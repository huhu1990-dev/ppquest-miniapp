import { SupabaseClient } from '@supabase/supabase-js';

import { type Database, type PromoCodeV1 } from './generated-db-types.ts';

export async function validatePromoCode(
  supabaseClient: SupabaseClient<Database>,
  promoCode: string,
): Promise<PromoCodeV1 | undefined> {
  const res = await supabaseClient.rpc('app:promo:validate', { promoCode });
  if (res.error) {
    throw res.error;
  }
  return res.data ?? undefined;
}
