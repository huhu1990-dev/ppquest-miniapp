/**
 * AUTO-GENERATED - DO NOT MODIFY!
 * Any changes will be lost when the file is regenerated.
 */

import { type PropsWithChildren, type ReactNode } from 'react';
import { type UnknownOutputParams } from 'expo-router';

import { useNav } from '@/comp-lib/navigation/useNav';
import { type TabsOrdersUrlParams } from '@/app/(tabs)/orders';
import { type TabsGamesUrlParams } from '@/app/(tabs)/games';
import OrderConfirmationContainer from '@/app-pages/OrderConfirmationContainer';

export type OrderConfirmationUrlParams = UnknownOutputParams;

export interface OrderConfirmationProps extends PropsWithChildren {
  /**
   * The page's URL params. Includes path and query params.
   */
  urlParams: OrderConfirmationUrlParams;
  /**
   * Sets the navigation options using navigation.setOptions()
   * @param options The options to set
   * @returns void
   */
  setNavigationOptions: (options?: Record<string, any>) => void;

  /**
   * Executes when user wants to view all orders
   */
  onNavigateToOrders: (urlParams?: TabsOrdersUrlParams) => void;
  /**
   * Executes when user wants to continue browsing games
   */
  onNavigateToHome: (urlParams?: TabsGamesUrlParams) => void;
}

/**
 * Order confirmation page after successful purchase
 */
export default function OrderConfirmationPage(props: OrderConfirmationProps): ReactNode {
  const { urlParams, setOptions, navigate } = useNav<OrderConfirmationUrlParams>({ auth: true });
  /**
   * Executes when user wants to view all orders
   */
  const onNavigateToOrders = (urlParams?: TabsOrdersUrlParams) => {
    navigate({
      pathname: '/(tabs)/orders',
      params: urlParams,
    });
  };
  /**
   * Executes when user wants to continue browsing games
   */
  const onNavigateToHome = (urlParams?: TabsGamesUrlParams) => {
    navigate({
      pathname: '/(tabs)/games',
      params: urlParams,
    });
  };

  return (
    <OrderConfirmationContainer
      children={props.children}
      urlParams={urlParams}
      setNavigationOptions={setOptions}
      onNavigateToOrders={onNavigateToOrders}
      onNavigateToHome={onNavigateToHome}
    />
  );
}
