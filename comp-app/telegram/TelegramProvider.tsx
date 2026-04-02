import { type PropsWithChildren, type ReactNode } from 'react';

import { TelegramContextValue, useTelegramProvider } from './TelegramProviderFunc';

/**
 * Provides Telegram Mini App context and handles Telegram authentication.
 * When running inside Telegram, it verifies the user and sets the Supabase session
 * before rendering children, ensuring downstream auth flows see a valid session.
 */
export function TelegramProvider({ children }: PropsWithChildren): ReactNode {
  const context = useTelegramProvider();

  // Block children from rendering until Telegram auth is complete.
  // In non-Telegram environments, isTelegramAuthReady is immediately true.
  if (!context.isTelegramAuthReady) {
    return null;
  }

  return <TelegramContextValue.Provider value={context}>{children}</TelegramContextValue.Provider>;
}
