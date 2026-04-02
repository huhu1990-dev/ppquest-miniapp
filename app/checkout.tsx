/**
 * AUTO-GENERATED - DO NOT MODIFY!
 * Any changes will be lost when the file is regenerated.
 */

import { type PropsWithChildren, type ReactNode } from 'react';
import { type UnknownOutputParams } from 'expo-router';

import { useNav } from '@/comp-lib/navigation/useNav';
import { type OrderConfirmationUrlParams } from '@/app/order-confirmation';
import CheckoutContainer from '@/app-pages/CheckoutContainer';

export type CheckoutUrlParams = UnknownOutputParams;

export interface CheckoutProps extends PropsWithChildren {
  /**
   * The page's URL params. Includes path and query params.
   */
  urlParams: CheckoutUrlParams;
  /**
   * Sets the navigation options using navigation.setOptions()
   * @param options The options to set
   * @returns void
   */
  setNavigationOptions: (options?: Record<string, any>) => void;

  /**
   * Returns to game detail page
   */
  onGoBack: () => void;
  /**
   * Executes after successful payment
   */
  onNavigateToConfirmation: (urlParams?: OrderConfirmationUrlParams) => void;
}

/**
 * Checkout and payment page for top-up purchase
 */
export default function CheckoutPage(props: CheckoutProps): ReactNode {
  const { urlParams, setOptions, back, replace } = useNav<CheckoutUrlParams>({ auth: true });
  /**
   * Returns to game detail page
   */
  const onGoBack = () => {
    back();
  };
  /**
   * Executes after successful payment
   */
  const onNavigateToConfirmation = (urlParams?: OrderConfirmationUrlParams) => {
    replace({
      pathname: '/order-confirmation',
      params: urlParams,
    });
  };

  return (
    <CheckoutContainer
      children={props.children}
      urlParams={urlParams}
      setNavigationOptions={setOptions}
      onGoBack={onGoBack}
      onNavigateToConfirmation={onNavigateToConfirmation}
    />
  );
}
