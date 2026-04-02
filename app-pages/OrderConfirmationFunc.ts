/**
 * Business logic for the OrderConfirmation route
 */
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

import { getOrder } from '@/api/ppquest-api';
// readOrder replaced by ppquest-api getOrder
import { type OrderV1 } from '@shared/generated-db-types';
import { OrderConfirmationProps } from '@/app/order-confirmation';

const ORDER_ID_DISPLAY_LENGTH = 8;

export interface OrderDetails {
  orderId: string;
  orderIdDisplay: string;
  gameName: string;
  packageName: string;
  totalInUsd: string;
}

export interface HowItWorksStep {
  id: number;
  translationKey: string;
}

const HOW_IT_WORKS_STEPS: readonly HowItWorksStep[] = [
  { id: 1, translationKey: 'orderConfirmation.step1' },
  { id: 2, translationKey: 'orderConfirmation.step2' },
  { id: 3, translationKey: 'orderConfirmation.step3' },
] as const;

function formatOrderIdDisplay(orderId: string): string {
  if (orderId.length > ORDER_ID_DISPLAY_LENGTH) {
    return orderId.substring(0, ORDER_ID_DISPLAY_LENGTH).toUpperCase();
  }
  return orderId.toUpperCase();
}

function deriveOrderDetails(order: OrderV1): OrderDetails {
  const totalAfterDiscount = Number(order.amountInUsd) - Number(order.discountInUsd);
  const formattedTotal = isNaN(totalAfterDiscount) ? '0.00' : totalAfterDiscount.toFixed(2);

  return {
    orderId: order.id,
    orderIdDisplay: formatOrderIdDisplay(order.id),
    gameName: order.gameName,
    packageName: order.packageName,
    totalInUsd: formattedTotal,
  };
}

const EMPTY_ORDER_DETAILS: OrderDetails = {
  orderId: '',
  orderIdDisplay: '',
  gameName: '',
  packageName: '',
  totalInUsd: '0.00',
};

function triggerSuccessHaptic(): void {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(logHapticError);
}

function logHapticError(error: unknown): void {
  console.warn('Haptic feedback failed:', error);
}

/**
 * Interface for the return value of the useOrderConfirmation hook
 */
export interface OrderConfirmationFunc {
  orderDetails: OrderDetails;
  howItWorksSteps: readonly HowItWorksStep[];
  isLoading: boolean;
  hasError: boolean;
  onViewOrders: () => void;
  onContinueBrowsing: () => void;
}

/**
 * Custom hook that provides business logic for the OrderConfirmation component
 */
export function useOrderConfirmation(props: OrderConfirmationProps): OrderConfirmationFunc {
  const [order, setOrder] = useState<OrderV1 | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const hasTriggeredHaptic = useRef(false);

  const orderIdParam = String(props.urlParams.orderId ?? '');

  useEffect(() => {
    if (!orderIdParam) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    async function fetchOrder(): Promise<void> {
      try {
        setIsLoading(true);
        setHasError(false);
        const fetchedOrder = await getOrder(orderIdParam);
        if (fetchedOrder == null) {
          setHasError(true);
        } else {
          setOrder(fetchedOrder);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchOrder();
  }, [orderIdParam]);

  useEffect(() => {
    if (!hasTriggeredHaptic.current && order != null) {
      hasTriggeredHaptic.current = true;
      triggerSuccessHaptic();
    }
  }, [order]);


  // Poll for PPWallet payment status (every 3s while status is PROCESSING)
  useEffect(() => {
    if (!orderIdParam || !order || order.status !== 'PROCESSING' || order.paymentMethod !== 'PPWALLET') return;

    const interval = setInterval(async () => {
      try {
        const updatedOrder = await getOrder(orderIdParam);
        setOrder(updatedOrder);
        if (updatedOrder.status !== 'PROCESSING') {
          clearInterval(interval);
        }
      } catch {}
    }, 3000);

    return () => clearInterval(interval);
  }, [orderIdParam, order?.status, order?.paymentMethod]);

  const orderDetails = order != null ? deriveOrderDetails(order) : EMPTY_ORDER_DETAILS;

  function onViewOrders(): void {
    props.onNavigateToOrders();
  }

  function onContinueBrowsing(): void {
    props.onNavigateToHome();
  }

  return {
    orderDetails,
    howItWorksSteps: HOW_IT_WORKS_STEPS,
    isLoading,
    hasError,
    onViewOrders,
    onContinueBrowsing,
  };
}
