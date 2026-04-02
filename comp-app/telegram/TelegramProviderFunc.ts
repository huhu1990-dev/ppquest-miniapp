import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { supabaseClient } from '@/api/supabase-client';
import { setTelegramId, syncUser } from '@/api/ppquest-api';
import { authenticateWithTelegram } from '@/api/telegram-api';
import { OnboardingContext } from '@/comp-lib/common/context/OnboardingContextProvider';

export interface TelegramContext {
  /** True when running inside Telegram Mini App environment */
  isTelegramEnv: boolean;
  /** True once Telegram auth is complete (or not needed) */
  isTelegramAuthReady: boolean;
  /** The Telegram user ID string if authenticated via Telegram */
  telegramUserId: string | undefined;
  /** Auth error message if Telegram login failed */
  telegramAuthError?: string;
}

const TelegramContextValue = createContext<TelegramContext>({
  isTelegramEnv: false,
  isTelegramAuthReady: true,
  telegramUserId: undefined,
  telegramAuthError: undefined,
});

export function useTelegramContext(): TelegramContext {
  return useContext(TelegramContextValue);
}

export { TelegramContextValue };

function getTelegramWebApp(): { initData: string; ready: () => void; expand: () => void } | undefined {
  if (Platform.OS !== 'web') return undefined;
  // window.Telegram.WebApp is injected by Telegram when running as a Mini App
  const tg = (typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : undefined) as
    | { initData: string; ready: () => void; expand: () => void }
    | undefined;
  return tg;
}

export function useTelegramProvider(): TelegramContext {
  const webApp = getTelegramWebApp();
  const isTelegramEnv = webApp != null && webApp.initData.length > 0;

  const [isTelegramAuthReady, setIsTelegramAuthReady] = useState(!isTelegramEnv);
  const [telegramAuthError, setTelegramAuthError] = useState<string | undefined>(undefined);
  const [telegramUserId, setTelegramUserId] = useState<string | undefined>(undefined);
  const authAttempted = useRef(false);
  const { completeOnboarding } = useContext(OnboardingContext);

  useEffect(() => {
    if (!isTelegramEnv || authAttempted.current) return;
    authAttempted.current = true;

    async function performTelegramAuthAsync(): Promise<void> {
      const webAppInstance = getTelegramWebApp();
      if (!webAppInstance) return;

      try {
        webAppInstance.ready();
        webAppInstance.expand();

        console.log('[TelegramAuth] Starting auth, initData length:', webAppInstance.initData.length);
        const result = await authenticateWithTelegram(supabaseClient, webAppInstance.initData);
        console.log('[TelegramAuth] Auth success, got tokens');

        await supabaseClient.auth.setSession({
          access_token: result.accessToken,
          refresh_token: result.refreshToken,
        });

        // Mark onboarding as complete so Telegram users skip the onboarding flow
        completeOnboarding();

        // Extract telegram user id from initData
        const params = new URLSearchParams(webAppInstance.initData);
        const userJson = params.get('user');
        if (userJson) {
          const user = JSON.parse(userJson) as { id: number; first_name?: string; username?: string };
          const tgId = String(user.id);
          setTelegramUserId(tgId);
          setTelegramId(tgId);

          // Sync user to ppquest.com DB (fire-and-forget)
          syncUser(tgId, user.first_name || 'Telegram User', user.username).catch((err) => {
            console.warn('[TelegramAuth] User sync to ppquest.com failed:', err.message);
          });
        }
      } catch (err) {
        console.error('[TelegramAuth] Auth error:', err);
        setTelegramAuthError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsTelegramAuthReady(true);
      }
    }

    performTelegramAuthAsync().catch((err) => {
      console.error('performTelegramAuthAsync error:', err);
      setIsTelegramAuthReady(true);
    });
  }, [isTelegramEnv, completeOnboarding]);

  return { isTelegramEnv, isTelegramAuthReady, telegramUserId, telegramAuthError };
}
