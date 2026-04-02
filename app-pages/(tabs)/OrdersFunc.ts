/**
 * Business logic for the Orders route
 */
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

import { t } from '@/i18n';
import { type ViewStyle, type TextStyle } from 'react-native';
import { OrdersProps } from '@/app/(tabs)/orders';
import { type OrderV1, type OrderStatus } from '@shared/generated-db-types';
import { type OrdersCardStyles } from './OrdersStyles';
import { supabaseClient } from '@/api/supabase-client';
import { getOrders } from '@/api/ppquest-api';

export type OrdersFilterStatus = 'ALL' | OrderStatus;

export interface OrdersFilterOption {
  value: OrdersFilterStatus;
  label: string;
}

const ORDER_FILTER_OPTIONS: readonly OrdersFilterOption[] = [
  { value: 'ALL', label: t('gameDetail.all') },
  { value: 'PROCESSING', label: t('orderDetail.stepProcessing') },
  { value: 'COMPLETED', label: t('orderDetail.stepCompleted') },
  { value: 'FAILED', label: t('orderDetail.stepFailed') },
  { value: 'REFUNDED', label: t('orderDetail.stepRefunded') },
] as const;

function triggerHaptic(style: Haptics.ImpactFeedbackStyle): void {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(style).catch(logHapticError);
}

function logHapticError(error: unknown): void {
  console.warn('Haptic feedback failed:', error);
}

function formatOrderDate(createdAt: string): string {
  try {
    const date = new Date(createdAt);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

function formatOrderAmount(amountInUsd: number, discountInUsd: number): string {
  const total = Math.max(amountInUsd - discountInUsd, 0);
  return `฿${Math.round(total).toLocaleString()}`;
}

function getStatusBadgeStyle(status: OrderStatus | null, cardStyles: OrdersCardStyles): ViewStyle {
  switch (status) {
    case 'PROCESSING':
      return cardStyles.statusBadgeProcessing;
    case 'COMPLETED':
      return cardStyles.statusBadgeCompleted;
    case 'FAILED':
      return cardStyles.statusBadgeFailed;
    case 'REFUNDED':
      return cardStyles.statusBadgeRefunded;
    default:
      return cardStyles.statusBadgeProcessing;
  }
}

function getStatusTextStyle(status: OrderStatus | null, cardStyles: OrdersCardStyles): TextStyle {
  switch (status) {
    case 'PROCESSING':
      return cardStyles.statusTextProcessing;
    case 'COMPLETED':
      return cardStyles.statusTextCompleted;
    case 'FAILED':
      return cardStyles.statusTextFailed;
    case 'REFUNDED':
      return cardStyles.statusTextRefunded;
    default:
      return cardStyles.statusTextProcessing;
  }
}

function getStatusLabel(status: OrderStatus | null): string {
  switch (status) {
    case 'PROCESSING':
      return t('orderDetail.stepProcessing');
    case 'COMPLETED':
      return t('orderDetail.stepCompleted');
    case 'FAILED':
      return t('orderDetail.stepFailed');
    case 'REFUNDED':
      return t('orderDetail.stepRefunded');
    default:
      return t('orderDetail.stepProcessing');
  }
}

export { formatOrderDate, formatOrderAmount, getStatusBadgeStyle, getStatusTextStyle, getStatusLabel };

/**
 * Interface for the return value of the useOrders hook
 */
export interface OrdersFunc {
  isLoading: boolean;
  isRefreshing: boolean;
  error?: Error;
  orders: OrderV1[];
  filteredOrders: OrderV1[];
  activeFilter: OrdersFilterStatus;
  filterOptions: readonly OrdersFilterOption[];
  hasOrders: boolean;
  hasResults: boolean;
  onFilterChange: (filter: OrdersFilterStatus) => void;
  onRefresh: () => void;
  onSelectOrder: (order: OrderV1) => void;
}

/**
 * Custom hook that provides business logic for the Orders component
 */
export function useOrders(props: OrdersProps): OrdersFunc {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [orders, setOrders] = useState<OrderV1[]>([]);
  const [activeFilter, setActiveFilter] = useState<OrdersFilterStatus>('ALL');

  useEffect(() => {
    loadOrdersAsync().catch((loadError) => {
      console.error('Failed to load orders:', loadError);
    });
  }, []);

  async function loadOrdersAsync(): Promise<void> {
    setIsLoading(true);
    setError(undefined);
    try {
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError : new Error('Failed to load orders'));
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshOrdersAsync(): Promise<void> {
    setIsRefreshing(true);
    try {
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
    } catch {
      // Keep existing data on refresh failure
    } finally {
      setIsRefreshing(false);
    }
  }

  function getFilteredOrders(): OrderV1[] {
    if (activeFilter === 'ALL') return orders;
    return orders.filter((order) => order.status === activeFilter);
  }

  function onFilterChange(filter: OrdersFilterStatus): void {
    setActiveFilter(filter);
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
  }

  function onRefresh(): void {
    refreshOrdersAsync().catch((refreshError) => {
      console.error('onRefresh error:', refreshError);
    });
  }

  function onSelectOrder(order: OrderV1): void {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    props.onNavigateToOrderDetail({ orderId: order.id });
  }

  const filteredOrders = getFilteredOrders();
  const hasOrders = orders.length > 0;
  const hasResults = filteredOrders.length > 0;

  return {
    isLoading,
    isRefreshing,
    error,
    orders,
    filteredOrders,
    activeFilter,
    filterOptions: ORDER_FILTER_OPTIONS,
    hasOrders,
    hasResults,
    onFilterChange,
    onRefresh,
    onSelectOrder,
  };
}
