import { useContext, useCallback } from 'react';
import { Linking, Platform } from 'react-native';

import { type Session } from '@supabase/supabase-js';

import { supabaseClient } from '@/api/supabase-client';
import { authenticateWithTelegramWidget, type TelegramWidgetUser } from '@/api/telegram-api';
import { OnboardingContext } from '@/comp-lib/common/context/OnboardingContextProvider';

const TELEGRAM_BOT_USERNAME = 'PPQuestApp_bot';
const TELEGRAM_WIDGET_CALLBACK = 'ppqTelegramOnAuth';

export interface TelegramLoginButtonFunc {
  isWebPlatform: boolean;
  botUsername: string;
  widgetCallbackName: string;
  onPressTelegramLogin: () => void;
  onWidgetAuth: (widgetUser: TelegramWidgetUser) => void;
}

export function useTelegramLoginButton(onSuccess: (session: Session) => void): TelegramLoginButtonFunc {
  const { completeOnboarding } = useContext(OnboardingContext);

  async function handleWidgetAuthAsync(widgetUser: TelegramWidgetUser): Promise<void> {
    const result = await authenticateWithTelegramWidget(supabaseClient, widgetUser);
    await supabaseClient.auth.setSession({
      access_token: result.accessToken,
      refresh_token: result.refreshToken,
    });
    completeOnboarding();
    const { data } = await supabaseClient.auth.getSession();
    if (data.session) {
      onSuccess(data.session);
    }
  }

  const onWidgetAuth = useCallback(
    (widgetUser: TelegramWidgetUser): void => {
      handleWidgetAuthAsync(widgetUser).catch((err) => {
        console.error('Telegram widget auth error:', err);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onSuccess],
  );

  function onPressTelegramLogin(): void {
    Linking.openURL(`https://t.me/${TELEGRAM_BOT_USERNAME}`).catch((err) => {
      console.error('Failed to open Telegram:', err);
    });
  }

  return {
    isWebPlatform: Platform.OS === 'web',
    botUsername: TELEGRAM_BOT_USERNAME,
    widgetCallbackName: TELEGRAM_WIDGET_CALLBACK,
    onPressTelegramLogin,
    onWidgetAuth,
  };
}
