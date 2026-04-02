import { SupabaseClient } from '@supabase/supabase-js';

import { type Database, type GameV1, type PackageV1, type uuidstr } from './generated-db-types.ts';

export async function readAllGames(supabaseClient: SupabaseClient<Database>): Promise<GameV1[]> {
  const res = await supabaseClient.rpc('app:game:readAll');
  if (res.error) {
    throw res.error;
  }
  return res.data ?? [];
}

export async function readGame(supabaseClient: SupabaseClient<Database>, gameId: uuidstr): Promise<GameV1 | undefined> {
  const res = await supabaseClient.rpc('app:game:read', { gameId });
  if (res.error) {
    throw res.error;
  }
  return res.data ?? undefined;
}

export async function readAllPackagesForGame(
  supabaseClient: SupabaseClient<Database>,
  gameId: uuidstr,
): Promise<PackageV1[]> {
  const res = await supabaseClient.rpc('app:game:package:readAll', { gameId });
  if (res.error) {
    throw res.error;
  }
  return res.data ?? [];
}

export async function readPackage(
  supabaseClient: SupabaseClient<Database>,
  packageId: uuidstr,
): Promise<PackageV1 | undefined> {
  const res = await supabaseClient.rpc('app:game:package:read', { packageId });
  if (res.error) {
    throw res.error;
  }
  return res.data ?? undefined;
}
