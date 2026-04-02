import { SupabaseClient } from '@supabase/supabase-js';

import { type Database, type intnum, type OrderV1, type PaymentMethod, type uuidstr, toIntNum } from './generated-db-types.ts';

export interface CreateOrderParams {
  gameId: uuidstr
  gameName: string
  gameIconUrl: string
  packageId: uuidstr
  packageName: string
  playerId?: string
  server?: string
  amountInUsd: number
  discountInUsd?: number
  promoCode?: string
  paymentMethod: PaymentMethod
  estimatedDeliveryInMin?: intnum
}

export async function createOrder(
  supabaseClient: SupabaseClient<Database>,
  params: CreateOrderParams,
): Promise<OrderV1> {
  const res = await supabaseClient.rpc('app:order:create', {
    gameId: params.gameId,
    gameName: params.gameName,
    gameIconUrl: params.gameIconUrl,
    packageId: params.packageId,
    packageName: params.packageName,
    playerId: params.playerId ?? null,
    server: params.server ?? null,
    amountInUsd: params.amountInUsd,
    discountInUsd: params.discountInUsd ?? 0,
    promoCode: params.promoCode ?? null,
    paymentMethod: params.paymentMethod,
    estimatedDeliveryInMin: params.estimatedDeliveryInMin ?? toIntNum(5),
  });
  if (res.error) {
    throw res.error;
  }
  if (res.data == null) {
    throw new Error('Failed to create order');
  }
  return res.data;
}

export async function readAllOrders(supabaseClient: SupabaseClient<Database>): Promise<OrderV1[]> {
  const res = await supabaseClient.rpc('app:order:readAll');
  if (res.error) {
    throw res.error;
  }
  return res.data ?? [];
}

export async function readOrder(
  supabaseClient: SupabaseClient<Database>,
  orderId: uuidstr,
): Promise<OrderV1 | undefined> {
  const res = await supabaseClient.rpc('app:order:read', { orderId });
  if (res.error) {
    throw res.error;
  }
  return res.data ?? undefined;
}
