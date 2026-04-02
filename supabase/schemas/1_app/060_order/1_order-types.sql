CREATE TYPE public.order_status AS ENUM (
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'REFUNDED'
);

COMMENT ON TYPE public.order_status IS '
description: Status of a top-up order
values:
  PROCESSING: Order is being processed
  COMPLETED: Order has been delivered successfully
  FAILED: Order processing failed
  REFUNDED: Order has been refunded
';

CREATE TYPE public.payment_method AS ENUM (
  'CARD',
  'E_WALLET',
  'TELEGRAM_PAYMENT',
  'CRYPTO',
  'PPWALLET'
);

COMMENT ON TYPE public.payment_method IS '
description: Available payment methods
values:
  CARD: Credit or debit card payment
  E_WALLET: E-wallet payment (GCash, PayMaya, etc.)
  TELEGRAM_PAYMENT: Telegram built-in payment system
  CRYPTO: Cryptocurrency payment (USDT, BTC, ETH, etc.)
  PPWALLET: Pay via PPWallet (THB balance)
';
