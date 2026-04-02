import { SupabaseClient } from '@supabase/supabase-js';

import {
  type Database,
  type SavedGameAccountV1,
  type UserAppProfileV1,
  type UserPreferenceV1,
  type uuidstr,
} from './generated-db-types.ts';

export async function readUserAppProfile(
  supabaseClient: SupabaseClient<Database>,
): Promise<UserAppProfileV1 | undefined> {
  const res = await supabaseClient.rpc('app:userApp:profile:read');
  if (res.error) {
    throw res.error;
  }
  return res.data ?? undefined;
}

export async function updateUserAppProfile(
  supabaseClient: SupabaseClient<Database>,
  params: {
    isOnboardingComplete?: boolean
    telegramUserId?: string
  },
): Promise<UserAppProfileV1> {
  const res = await supabaseClient.rpc('app:userApp:profile:update', {
    isOnboardingComplete: params.isOnboardingComplete ?? null,
    telegramUserId: params.telegramUserId ?? '___UNSET___',
  });
  if (res.error) {
    throw res.error;
  }
  if (res.data == null) {
    throw new Error('Failed to update user app profile');
  }
  return res.data;
}

export async function readUserPreference(
  supabaseClient: SupabaseClient<Database>,
): Promise<UserPreferenceV1 | undefined> {
  const res = await supabaseClient.rpc('app:userApp:preference:read');
  if (res.error) {
    throw res.error;
  }
  return res.data ?? undefined;
}

export async function updateUserPreference(
  supabaseClient: SupabaseClient<Database>,
  favoriteGameIds: uuidstr[],
): Promise<UserPreferenceV1> {
  const res = await supabaseClient.rpc('app:userApp:preference:update', {
    favoriteGameIds: favoriteGameIds,
  });
  if (res.error) {
    throw res.error;
  }
  if (res.data == null) {
    throw new Error('Failed to update user preferences');
  }
  return res.data;
}

export async function readAllSavedGameAccounts(
  supabaseClient: SupabaseClient<Database>,
): Promise<SavedGameAccountV1[]> {
  const res = await supabaseClient.rpc('app:userApp:savedAccount:readAll');
  if (res.error) {
    throw res.error;
  }
  return res.data ?? [];
}

export async function upsertSavedGameAccount(
  supabaseClient: SupabaseClient<Database>,
  params: {
    gameId: uuidstr;
    playerId: string;
    server?: string;
    nickname?: string;
  },
): Promise<SavedGameAccountV1> {
  const res = await supabaseClient.rpc('app:userApp:savedAccount:upsert', {
    gameId: params.gameId,
    playerId: params.playerId,
    server: params.server ?? null,
    nickname: params.nickname ?? null,
  });
  if (res.error) {
    throw res.error;
  }
  if (res.data == null) {
    throw new Error('Failed to save game account');
  }
  return res.data;
}

export async function deleteSavedGameAccount(
  supabaseClient: SupabaseClient<Database>,
  savedAccountId: uuidstr,
): Promise<void> {
  const res = await supabaseClient.rpc('app:userApp:savedAccount:delete', {
    savedAccountId,
  });
  if (res.error) {
    throw res.error;
  }
}

export async function adminSetTelegramUserId(
  supabaseAdminClient: SupabaseClient<Database>,
  userId: uuidstr,
  telegramUserId: string,
): Promise<void> {
  const res = await supabaseAdminClient.rpc('admin:userApp:setTelegramUserId', {
    userId,
    telegramUserId,
  });
  if (res.error) {
    throw res.error;
  }
}
