/**
 * Business logic for the OrdersOrderId route
 */
import { useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';

import { OrdersOrderIdProps } from '@/app/orders/[orderId]';
import { type OrderV1, type OrderStatus, type PaymentMethod, type uuidstr } from '@shared/generated-db-types';
import { readOrder } from '@shared/order-db';
import { supabaseClient } from '@/api/supabase-client';

const SUPPORT_EMAIL = 'support@ppquest.com';

const ORDER_ID_DISPLAY_LENGTH = 8;
const TIMELINE_TIMESTAMP_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

export interface TimelineStep {
  key: string;
  labelKey: string;
  isCompleted: boolean;
  isActive: boolean;
  isFailed: boolean;
  timestamp?: string;
}

export interface FormattedOrderDetails {
  orderId: string;
  orderIdDisplay: string;
  createdAtFormatted: string;
  gameName: string;
  gameIconUrl: string;
  packageName: string;
  playerId?: string;
  server?: string;
  paymentMethodKey: string;
  subtotalInUsd: string;
  discountInUsd: string;
  totalInUsd: string;
  promoCode?: string;
  status: OrderStatus;
  isCompleted: boolean;
  isFailed: boolean;
  isProcessing: boolean;
  completedAtFormatted?: string;
  estimatedDeliveryInMin: number;
}

const PAYMENT_METHOD_LABEL_KEYS: Record<PaymentMethod, string> = {
  CARD: 'orderDetail.cardPayment',
  E_WALLET: 'orderDetail.eWalletPayment',
  TELEGRAM_PAYMENT: 'orderDetail.telegramPayment',
  CRYPTO: 'orderDetail.cryptoPayment',
    PPWALLET: 'PPWallet',
};

export function formatTimelineTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, TIMELINE_TIMESTAMP_OPTIONS);
  } catch {
    return '';
  }
}

const FULL_TIMESTAMP_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

function formatTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString(undefined, FULL_TIMESTAMP_OPTIONS);
  } catch {
    return isoString;
  }
}

function buildTimelineSteps(order: OrderV1): TimelineStep[] {
  const status = order.status ?? 'PROCESSING';
  const isFailed = status === 'FAILED';
  const isCompleted = status === 'COMPLETED';
  const isRefunded = status === 'REFUNDED';
  const isProcessing = status === 'PROCESSING';

  const steps: TimelineStep[] = [
    {
      key: 'placed',
      labelKey: 'orderDetail.stepPlaced',
      isCompleted: true,
      isActive: false,
      isFailed: false,
      timestamp: order.createdAt,
    },
    {
      key: 'processing',
      labelKey: 'orderDetail.stepProcessing',
      isCompleted: isCompleted || isRefunded,
      isActive: isProcessing,
      isFailed: isFailed,
    },
  ];

  if (isFailed) {
    steps.push({
      key: 'failed',
      labelKey: 'orderDetail.stepFailed',
      isCompleted: false,
      isActive: false,
      isFailed: true,
    });
  } else if (isRefunded) {
    steps.push({
      key: 'refunded',
      labelKey: 'orderDetail.stepRefunded',
      isCompleted: true,
      isActive: false,
      isFailed: false,
    });
  } else {
    steps.push({
      key: 'completed',
      labelKey: 'orderDetail.stepCompleted',
      isCompleted: isCompleted,
      isActive: false,
      isFailed: false,
      timestamp: order.completedAt ?? undefined,
    });
  }

  return steps;
}

function formatOrderDetails(order: OrderV1): FormattedOrderDetails {
  const status = order.status ?? 'PROCESSING';
  const subtotal = order.amountInUsd + order.discountInUsd;
  const paymentMethodKey = order.paymentMethod != null
    ? (PAYMENT_METHOD_LABEL_KEYS[order.paymentMethod] ?? 'orderDetail.unknownPayment')
    : 'orderDetail.unknownPayment';

  const orderIdDisplay = order.id.length > ORDER_ID_DISPLAY_LENGTH
    ? order.id.substring(0, ORDER_ID_DISPLAY_LENGTH).toUpperCase()
    : order.id.toUpperCase();

  return {
    orderId: order.id,
    orderIdDisplay,
    createdAtFormatted: formatTimestamp(order.createdAt),
    gameName: order.gameName,
    gameIconUrl: order.gameIconUrl,
    packageName: order.packageName,
    playerId: order.playerId ?? undefined,
    server: order.server ?? undefined,
    paymentMethodKey,
    subtotalInUsd: subtotal.toFixed(2),
    discountInUsd: order.discountInUsd.toFixed(2),
    totalInUsd: order.amountInUsd.toFixed(2),
    promoCode: order.promoCode ?? undefined,
    status,
    isCompleted: status === 'COMPLETED',
    isFailed: status === 'FAILED',
    isProcessing: status === 'PROCESSING',
    completedAtFormatted: order.completedAt != null ? formatTimestamp(order.completedAt) : undefined,
    estimatedDeliveryInMin: order.estimatedDeliveryInMin,
  };
}

/**
 * Interface for the return value of the useOrdersOrderId hook
 */
export interface OrdersOrderIdFunc {
  isLoading: boolean;
  error?: Error;
  orderDetails?: FormattedOrderDetails;
  timelineSteps: TimelineStep[];
  hasDiscount: boolean;
  showDeliveryConfirmation: boolean;
  showRetryOption: boolean;
  showSupportOption: boolean;
  onContactSupport: () => void;
  onReorderPackage: () => void;
  onRetryPayment: () => void;
  onRetryLoad: () => void;
}

/**
 * Custom hook that provides business logic for the OrdersOrderId component
 */
export function useOrdersOrderId(props: OrdersOrderIdProps): OrdersOrderIdFunc {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [order, setOrder] = useState<OrderV1 | undefined>(undefined);
  const hasLoadedRef = useRef(false);

  const orderId = String(props.urlParams.orderId ?? '');

  useEffect(() => {
    if (orderId.length > 0 && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadOrderAsync(orderId).catch((loadError) => {
        console.error('loadOrder error:', loadError);
      });
    }
  }, [orderId]);

  async function loadOrderAsync(id: string): Promise<void> {
    setIsLoading(true);
    setError(undefined);
    try {
      const result = await readOrder(supabaseClient, id as uuidstr);
      setOrder(result);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError : new Error('Failed to load order'));
    } finally {
      setIsLoading(false);
    }
  }

  const orderDetails = order != null ? formatOrderDetails(order) : undefined;
  const timelineSteps = order != null ? buildTimelineSteps(order) : [];
  const hasDiscount = order != null ? order.discountInUsd > 0 : false;
  const showDeliveryConfirmation = orderDetails?.isCompleted === true;
  const showRetryOption = orderDetails?.isFailed === true;
  const showSupportOption = orderDetails?.isFailed === true || orderDetails?.isProcessing === true;

  function onContactSupport(): void {
    const subject = encodeURIComponent(`Order Support: #${orderDetails?.orderIdDisplay ?? orderId}`);
    const body = encodeURIComponent(`Hi PPQuest Support,\n\nI need help with my order #${orderDetails?.orderIdDisplay ?? orderId}.\n\n`);
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    Linking.openURL(mailtoUrl).catch((linkError) => {
      console.error('onContactSupport openURL error:', linkError);
    });
  }

  function onReorderPackage(): void {
    // TODO: Implement reorder — navigate to game detail with pre-filled package
    console.log('Reorder package for order:', orderId);
  }

  function onRetryPayment(): void {
    // TODO: Implement retry payment flow
    console.log('Retry payment for order:', orderId);
  }

  function onRetryLoad(): void {
    hasLoadedRef.current = false;
    loadOrderAsync(orderId).catch((loadError) => {
      console.error('onRetryLoad error:', loadError);
    });
  }

  return {
    isLoading,
    error,
    orderDetails,
    timelineSteps,
    hasDiscount,
    showDeliveryConfirmation,
    showRetryOption,
    showSupportOption,
    onContactSupport,
    onReorderPackage,
    onRetryPayment,
    onRetryLoad,
  };
}
