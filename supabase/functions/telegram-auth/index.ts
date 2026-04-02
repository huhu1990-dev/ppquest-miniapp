import { toUuidStr } from '../_shared-client/generated-db-types.ts';
import { adminSetTelegramUserId } from '../_shared-client/user-app-db.ts';
import { config } from '../_shared/config.ts';
import { okResponse, serveFunction, statusResponse } from '../_shared/server/func-server.ts';
import { supabaseAdminClient } from '../_shared/supabaseAdmin.ts';
import { createClient } from '@supabase/supabase-js';
import { config as appConfig } from '../_shared/config.ts';

// Separate client for user sign-in (doesn't corrupt admin client's service_role auth)
function createSignInClient() {
  return createClient(appConfig.supabase.url, appConfig.supabase.anonKey);
}

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
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

interface TelegramAuthResponse {
  accessToken: string;
  refreshToken: string;
}

async function verifyTelegramInitData(initData: string, botToken: string): Promise<URLSearchParams | null> {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;

  params.delete('hash');
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => `${key}=${val}`)
    .join('\n');

  const encoder = new TextEncoder();

  // secret_key = HMAC-SHA256(key="WebAppData", data=bot_token)
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode('WebAppData'),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const secretKeyBytes = await crypto.subtle.sign('HMAC', keyMaterial, encoder.encode(botToken));

  // hash = HMAC-SHA256(key=secret_key, data=data_check_string)
  const checkKey = await crypto.subtle.importKey(
    'raw',
    secretKeyBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const hashBytes = await crypto.subtle.sign('HMAC', checkKey, encoder.encode(dataCheckString));
  const hashHex = Array.from(new Uint8Array(hashBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  if (hashHex !== hash) return null;
  return params;
}

async function verifyTelegramWidgetData(widgetUser: TelegramWidgetUser, botToken: string): Promise<boolean> {
  const encoder = new TextEncoder();

  // secret_key = SHA256(bot_token) — different from Mini App HMAC derivation
  const secretKeyBytes = await crypto.subtle.digest('SHA-256', encoder.encode(botToken));

  const dataCheckString = (Object.entries(widgetUser) as [string, string | number][])
    .filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const checkKey = await crypto.subtle.importKey(
    'raw',
    secretKeyBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const hashBytes = await crypto.subtle.sign('HMAC', checkKey, encoder.encode(dataCheckString));
  const hashHex = Array.from(new Uint8Array(hashBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return hashHex === widgetUser.hash;
}

async function deriveTelegramPassword(botToken: string, telegramId: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(botToken),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const hashBytes = await crypto.subtle.sign('HMAC', keyMaterial, encoder.encode(`tg_pwd_${telegramId}`));
  return Array.from(new Uint8Array(hashBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function signInOrCreateTelegramUser(
  telegramUser: TelegramUser,
  botToken: string,
): Promise<TelegramAuthResponse | Response> {
  const telegramId = String(telegramUser.id);
  const email = `tg_${telegramId}@ppquest.bot`;
  const password = await deriveTelegramPassword(botToken, telegramId);

  // Try sign-in first (for existing users)
  const signInClient = createSignInClient();
  const signInRes = await signInClient.auth.signInWithPassword({ email, password });

  if (!signInRes.error && signInRes.data.session) {
    const userId = toUuidStr(signInRes.data.user.id);
    await adminSetTelegramUserId(supabaseAdminClient, userId, telegramId);
    return {
      accessToken: signInRes.data.session.access_token,
      refreshToken: signInRes.data.session.refresh_token,
    };
  }

  // User doesn't exist — create them
  const displayName =
    [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(' ') || `TG_${telegramId}`;

  const createRes = await supabaseAdminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: displayName,
      telegram_id: telegramId,
      telegram_username: telegramUser.username ?? null,
    },
  });

  if (createRes.error) {
    console.error('Error creating Telegram user:', createRes.error);
    return statusResponse(500, 'Failed to create user');
  }

  const userId = toUuidStr(createRes.data.user.id);

  const secondSignInClient = createSignInClient();
  const secondSignInRes = await secondSignInClient.auth.signInWithPassword({ email, password });
  if (secondSignInRes.error || !secondSignInRes.data.session) {
    console.error('Error signing in after creation:', secondSignInRes.error);
    return statusResponse(500, 'Failed to sign in after user creation');
  }

  await adminSetTelegramUserId(supabaseAdminClient, userId, telegramId);

  return {
    accessToken: secondSignInRes.data.session.access_token,
    refreshToken: secondSignInRes.data.session.refresh_token,
  };
}

serveFunction(false, async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return statusResponse(405, 'Method Not Allowed');
  }

  const botToken = config.telegramBotToken;
  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN is not configured');
    return statusResponse(500, 'Telegram bot token not configured');
  }

  let body: { initData?: string; widgetData?: TelegramWidgetUser };
  try {
    body = await req.json();
  } catch {
    return statusResponse(400, 'Invalid request body');
  }

  // --- Telegram Login Widget flow ---
  if (body.widgetData != null) {
    const { widgetData } = body;
    const isValid = await verifyTelegramWidgetData(widgetData, botToken);
    if (!isValid) {
      console.warn('Invalid Telegram widget HMAC');
      return statusResponse(401, 'Invalid Telegram widget data');
    }

    const telegramUser: TelegramUser = {
      id: widgetData.id,
      first_name: widgetData.first_name,
      last_name: widgetData.last_name,
      username: widgetData.username,
    };

    const result = await signInOrCreateTelegramUser(telegramUser, botToken);
    if (result instanceof Response) return result;
    return okResponse(result);
  }

  // --- Mini App initData flow ---
  const { initData } = body;
  if (!initData) {
    return statusResponse(400, 'initData or widgetData is required');
  }

  const params = await verifyTelegramInitData(initData, botToken);
  if (!params) {
    console.warn('Invalid Telegram initData HMAC');
    return statusResponse(401, 'Invalid Telegram initData');
  }

  const userJson = params.get('user');
  if (!userJson) {
    return statusResponse(400, 'No user data in initData');
  }

  let telegramUser: TelegramUser;
  try {
    telegramUser = JSON.parse(userJson) as TelegramUser;
  } catch {
    return statusResponse(400, 'Invalid user data in initData');
  }

  const result = await signInOrCreateTelegramUser(telegramUser, botToken);
  if (result instanceof Response) return result;
  return okResponse(result);
});
