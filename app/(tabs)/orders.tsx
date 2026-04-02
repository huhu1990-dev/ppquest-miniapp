/**
 * AUTO-GENERATED - DO NOT MODIFY!
 * Any changes will be lost when the file is regenerated.
 */

import { type PropsWithChildren, type ReactNode } from 'react';
import { type UnknownOutputParams } from 'expo-router';

import { useNav } from '@/comp-lib/navigation/useNav';
import { type OrdersOrderIdUrlParams } from '@/app/orders/[orderId]';
import OrdersContainer from '@/app-pages/(tabs)/OrdersContainer';

export type TabsOrdersUrlParams = UnknownOutputParams;

export interface OrdersProps extends PropsWithChildren {
  /**
   * The page's URL params. Includes path and query params.
   */
  urlParams: TabsOrdersUrlParams;
  /**
   * Sets the navigation options using navigation.setOptions()
   * @param options The options to set
   * @returns void
   */
  setNavigationOptions: (options?: Record<string, any>) => void;

  /**
   * Executes when user selects an order to view details
   */
  onNavigateToOrderDetail: (urlParams: OrdersOrderIdUrlParams) => void;
}

/**
 * View order and transaction history
 */
export default function OrdersPage(props: OrdersProps): ReactNode {
  const { urlParams, setOptions, push } = useNav<TabsOrdersUrlParams>({ auth: true });
  /**
   * Executes when user selects an order to view details
   */
  const onNavigateToOrderDetail = (urlParams: OrdersOrderIdUrlParams) => {
    push({
      pathname: '/orders/[orderId]',
      params: urlParams,
    });
  };

  return (
    <OrdersContainer
      children={props.children}
      urlParams={urlParams}
      setNavigationOptions={setOptions}
      onNavigateToOrderDetail={onNavigateToOrderDetail}
    />
  );
}
