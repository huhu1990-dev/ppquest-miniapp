/**
 * Business logic for the Checkout route
 */
import { useState } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

import { CheckoutProps } from '@/app/checkout';
import { type PaymentMethod, type uuidstr } from '@shared/generated-db-types';
import { createOrder as ppquestCreateOrder } from '@/api/ppquest-api';
import { type CreateOrderParams } from '@shared/order-db';
import { validatePromoCode } from '@shared/promo-db';
import { supabaseClient } from '@/api/supabase-client';

export interface PaymentMethodOption {
  value: PaymentMethod;
  labelKey: string;
  descriptionKey: string;
}

const PAYMENT_METHOD_OPTIONS: readonly PaymentMethodOption[] = [
  { value: 'CARD', labelKey: 'checkout.card', descriptionKey: 'checkout.cardDescription' },
  { value: 'E_WALLET', labelKey: 'checkout.eWallet', descriptionKey: 'checkout.eWalletDescription' },
  { value: 'TELEGRAM_PAYMENT', labelKey: 'checkout.telegramPayment', descriptionKey: 'checkout.telegramPaymentDescription' },
  { value: 'CRYPTO', labelKey: 'checkout.crypto', descriptionKey: 'checkout.cryptoDescription' },
  { value: 'PPWALLET', labelKey: 'checkout.ppwallet', descriptionKey: 'checkout.ppwalletDescription' },
] as const;

function triggerHaptic(style: Haptics.ImpactFeedbackStyle): void {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(style).catch(logHapticError);
}

function logHapticError(error: unknown): void {
  console.warn('Haptic feedback failed:', error);
}

export interface OrderSummary {
  gameId: string;
  gameName: string;
  gameIconUrl: string;
  packageId: string;
  packageName: string;
  priceInUsd: number;
  playerId: string;
  server: string;
}

/**
 * Interface for the return value of the useCheckout hook
 */
export interface CheckoutFunc {
  isLoading: boolean;
  isProcessing: boolean;
  error?: Error;
  orderSummary: OrderSummary;
  paymentMethodOptions: readonly PaymentMethodOption[];
  selectedPaymentMethod?: PaymentMethod;
  promoCode: string;
  promoDiscountPercent: number;
  promoValidationMessage?: string;
  isPromoValid?: boolean;
  subtotalInUsd: number;
  discountInUsd: number;
  totalInUsd: number;
  canSubmit: boolean;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  onPromoCodeChange: (text: string) => void;
  onApplyPromoCode: () => void;
  onSubmitPayment: () => void;
  onRetry: () => void;
}

function parseOrderSummaryFromParams(urlParams: Record<string, string | string[] | undefined>): OrderSummary {
  const priceRaw = urlParams.priceInUsd;
  const priceStr = Array.isArray(priceRaw) ? priceRaw[0] : priceRaw;
  const parsedPrice = parseFloat(priceStr ?? '0');

  return {
    gameId: String(urlParams.gameId ?? ''),
    gameName: String(urlParams.gameName ?? 'Unknown Game'),
    gameIconUrl: String(urlParams.gameIconUrl ?? ''),
    packageId: String(urlParams.packageId ?? ''),
    packageName: String(urlParams.packageName ?? 'Unknown Package'),
    priceInUsd: isNaN(parsedPrice) ? 0 : parsedPrice,
    playerId: String(urlParams.playerId ?? ''),
    server: String(urlParams.server ?? ''),
  };
}

/**
 * Custom hook that provides business logic for the Checkout component
 */
export function useCheckout(props: CheckoutProps): CheckoutFunc {
  const orderSummary = parseOrderSummaryFromParams(props.urlParams as Record<string, string | string[] | undefined>);

  const [isLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | undefined>(undefined);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscountPercent, setPromoDiscountPercent] = useState(0);
  const [promoValidationMessage, setPromoValidationMessage] = useState<string | undefined>(undefined);
  const [isPromoValid, setIsPromoValid] = useState<boolean | undefined>(undefined);

  const subtotalInUsd = orderSummary.priceInUsd;
  const discountInUsd = promoDiscountPercent > 0 ? subtotalInUsd * (promoDiscountPercent / 100) : 0;
  const totalInUsd = Math.max(0, subtotalInUsd - discountInUsd);
  const canSubmit = selectedPaymentMethod != null && totalInUsd > 0 && !isProcessing;

  function onSelectPaymentMethod(method: PaymentMethod): void {
    setSelectedPaymentMethod(method);
    setError(undefined);
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
  }

  function onPromoCodeChange(text: string): void {
    setPromoCode(text);
    if (promoValidationMessage != null) {
      setPromoValidationMessage(undefined);
      setIsPromoValid(undefined);
    }
  }

  function onApplyPromoCode(): void {
    if (promoCode.trim().length === 0) return;

    applyPromoCodeAsync().catch((applyError) => {
      console.error('onApplyPromoCode error:', applyError);
      setPromoDiscountPercent(0);
      setPromoValidationMessage('checkout.promoInvalid');
      setIsPromoValid(false);
    });
  }

  async function applyPromoCodeAsync(): Promise<void> {
    const result = await validatePromoCode(supabaseClient, promoCode);
    if (result != null) {
      setPromoDiscountPercent(result.discountPercent);
      setPromoValidationMessage('checkout.promoApplied');
      setIsPromoValid(true);
      triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      setPromoDiscountPercent(0);
      setPromoValidationMessage('checkout.promoInvalid');
      setIsPromoValid(false);
    }
  }

  function onSubmitPayment(): void {
    if (!canSubmit || selectedPaymentMethod == null) return;
    triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);

    submitPaymentAsync(selectedPaymentMethod).catch((submitError) => {
      console.error('onSubmitPayment error:', submitError);
    });
  }

  async function submitPaymentAsync(paymentMethod: PaymentMethod): Promise<void> {
    setIsProcessing(true);
    setError(undefined);

    try {
      const orderParams: CreateOrderParams = {
        gameId: orderSummary.gameId as uuidstr,
        gameName: orderSummary.gameName,
        gameIconUrl: orderSummary.gameIconUrl,
        packageId: orderSummary.packageId as uuidstr,
        packageName: orderSummary.packageName,
        playerId: orderSummary.playerId.length > 0 ? orderSummary.playerId : undefined,
        server: orderSummary.server.length > 0 ? orderSummary.server : undefined,
        amountInUsd: totalInUsd,
        discountInUsd: discountInUsd > 0 ? discountInUsd : undefined,
        promoCode: promoDiscountPercent > 0 ? promoCode.trim().toUpperCase() : undefined,
        paymentMethod,
      };

      const order = await ppquestCreateOrder({
        packageId: orderSummary.packageId,
        gameUid: orderSummary.playerId || 'unknown',
        paymentMethod: paymentMethod,
      });

      // If PPWALLET, open deep link to PPWallet MiniApp
      if (paymentMethod === 'PPWALLET' && order.ppwalletInvoice?.payUrl) {
        const tg = (globalThis as any).Telegram?.WebApp;
        if (tg?.openTelegramLink) {
          tg.openTelegramLink(order.ppwalletInvoice.payUrl);
        }
      }

      props.onNavigateToConfirmation({
        orderId: order.id,
        gameName: orderSummary.gameName,
        packageName: orderSummary.packageName,
        totalInUsd: String(totalInUsd.toFixed(2)),
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError : new Error('Payment failed'));
    } finally {
      setIsProcessing(false);
    }
  }

  function onRetry(): void {
    setError(undefined);
    if (selectedPaymentMethod != null) {
      onSubmitPayment();
    }
  }

  return {
    isLoading,
    isProcessing,
    error,
    orderSummary,
    paymentMethodOptions: PAYMENT_METHOD_OPTIONS,
    selectedPaymentMethod,
    promoCode,
    promoDiscountPercent,
    promoValidationMessage,
    isPromoValid,
    subtotalInUsd,
    discountInUsd,
    totalInUsd,
    canSubmit,
    onSelectPaymentMethod,
    onPromoCodeChange,
    onApplyPromoCode,
    onSubmitPayment,
    onRetry,
  };
}
