import { type SupabaseClient } from '@supabase/supabase-js';

import { type Database } from '@shared/generated-db-types';

const TELEGRAM_AUTH_FUNCTION = 'telegram-auth';

export interface TelegramAuthResult {
  accessToken: string;
  refreshToken: string;
}

export interface TelegramWidgetUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

/**
 * Calls the telegram-auth edge function with Telegram's initData to
 * authenticate the user and obtain Supabase session tokens.
 */
export async function authenticateWithTelegram(
  supabaseClient: SupabaseClient<Database>,
  initData: string,
): Promise<TelegramAuthResult> {
  const { data, error } = await supabaseClient.functions.invoke<TelegramAuthResult>(TELEGRAM_AUTH_FUNCTION, {
    method: 'POST',
    body: { initData },
  });

  if (error) {
    throw new Error(`Telegram authentication failed: ${error.message}`);
  }

  if (!data?.accessToken || !data?.refreshToken) {
    throw new Error('Invalid response from telegram-auth function');
  }

  return data;
}

/**
 * Calls the telegram-auth edge function with Telegram Login Widget data
 * (for users authenticating via the web widget, not the Mini App).
 */
export async function authenticateWithTelegramWidget(
  supabaseClient: SupabaseClient<Database>,
  widgetData: TelegramWidgetUser,
): Promise<TelegramAuthResult> {
  const { data, error } = await supabaseClient.functions.invoke<TelegramAuthResult>(TELEGRAM_AUTH_FUNCTION, {
    method: 'POST',
    body: { widgetData },
  });

  if (error) {
    throw new Error(`Telegram widget authentication failed: ${error.message}`);
  }

  if (!data?.accessToken || !data?.refreshToken) {
    throw new Error('Invalid response from telegram-auth function');
  }

  return data;
}
