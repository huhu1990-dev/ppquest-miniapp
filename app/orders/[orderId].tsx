/**
 * AUTO-GENERATED - DO NOT MODIFY!
 * Any changes will be lost when the file is regenerated.
 */

import { type PropsWithChildren, type ReactNode } from 'react';
import { type UnknownOutputParams } from 'expo-router';

import { useNav } from '@/comp-lib/navigation/useNav';
import OrdersOrderIdContainer from '@/app-pages/orders/OrdersOrderIdContainer';

export type OrdersOrderIdUrlParams = UnknownOutputParams & {
  orderId: string;
};

export interface OrdersOrderIdProps extends PropsWithChildren {
  /**
   * The page's URL params. Includes path and query params.
   */
  urlParams: OrdersOrderIdUrlParams;
  /**
   * Sets the navigation options using navigation.setOptions()
   * @param options The options to set
   * @returns void
   */
  setNavigationOptions: (options?: Record<string, any>) => void;

  /**
   * Returns to orders list
   */
  onGoBack: () => void;
}

/**
 * Order detail page showing transaction information
 */
export default function OrdersOrderIdPage(props: OrdersOrderIdProps): ReactNode {
  const { urlParams, setOptions, back } = useNav<OrdersOrderIdUrlParams>({ auth: true });
  /**
   * Returns to orders list
   */
  const onGoBack = () => {
    back();
  };

  return (
    <OrdersOrderIdContainer
      children={props.children}
      urlParams={urlParams}
      setNavigationOptions={setOptions}
      onGoBack={onGoBack}
    />
  );
}
