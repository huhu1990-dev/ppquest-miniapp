/**
 * AUTO-GENERATED - DO NOT MODIFY!
 * Any changes will be lost when the file is regenerated.
 */

import '@/comp-lib/assets/customAssetResolver';

import { type PropsWithChildren, type ReactNode } from 'react';
import { type UnknownOutputParams, Stack } from 'expo-router';

import { useStackLayoutStyles } from '@/comp-lib/styles/useStackLayoutStyles';
import { useNav } from '@/comp-lib/navigation/useNav';
import { type TabsGamesUrlParams } from '@/app/(tabs)/games';
import { type OnboardingGamePreferencesUrlParams } from '@/app/onboarding/game-preferences';
import { type AuthLoginUrlParams } from '@/app/auth/login';
import { type AuthUpdatePasswordUrlParams } from '@/app/auth/update-password';
import { AppContextProviders } from '@/comp-app/common/AppContextProviders';
import { useAppStateHandler } from '@/comp-app/common/useAppStateHandler';
import LayoutContainer from '@/app-pages/LayoutContainer';

export type LayoutUrlParams = UnknownOutputParams;

export interface LayoutProps extends PropsWithChildren {
  /**
   * The page's URL params. Includes path and query params.
   */
  urlParams: LayoutUrlParams;
  /**
   * Sets the navigation options using navigation.setOptions()
   * @param options The options to set
   * @returns void
   */
  setNavigationOptions: (options?: Record<string, any>) => void;

  /**
   * Executes after app start when user is authenticated and onboarded
   */
  onNavigateToHome: (urlParams?: TabsGamesUrlParams) => void;
  /**
   * Executes after app start when user needs to complete onboarding
   */
  onNavigateToOnboarding: (urlParams?: OnboardingGamePreferencesUrlParams) => void;
  /**
   * Executes after app start when user is not authenticated
   */
  onNavigateToLogin: (urlParams?: AuthLoginUrlParams) => void;
  /**
   * Executes when user needs to update password after reset
   */
  onNavigateToUpdatePassword: (urlParams?: AuthUpdatePasswordUrlParams) => void;
}

/**
 * Root layout for the gaming top-up mini app
 */
export default function Layout(): ReactNode {
  useAppStateHandler();

  const { defaultScreenOptions: defaultStackLayoutOptions } = useStackLayoutStyles();
  const { urlParams, setOptions, navigate } = useNav<LayoutUrlParams>({ auth: false });
  /**
   * Executes after app start when user is authenticated and onboarded
   */
  const onNavigateToHome = (urlParams?: TabsGamesUrlParams) => {
    navigate({
      pathname: '/(tabs)/games',
      params: urlParams,
    });
  };
  /**
   * Executes after app start when user needs to complete onboarding
   */
  const onNavigateToOnboarding = (urlParams?: OnboardingGamePreferencesUrlParams) => {
    navigate({
      pathname: '/onboarding/game-preferences',
      params: urlParams,
    });
  };
  /**
   * Executes after app start when user is not authenticated
   */
  const onNavigateToLogin = (urlParams?: AuthLoginUrlParams) => {
    navigate({
      pathname: '/auth/login',
      params: urlParams,
    });
  };
  /**
   * Executes when user needs to update password after reset
   */
  const onNavigateToUpdatePassword = (urlParams?: AuthUpdatePasswordUrlParams) => {
    navigate({
      pathname: '/auth/update-password',
      params: urlParams,
    });
  };

  return (
    <AppContextProviders>
      <LayoutContainer
        urlParams={urlParams}
        setNavigationOptions={setOptions}
        onNavigateToHome={onNavigateToHome}
        onNavigateToOnboarding={onNavigateToOnboarding}
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToUpdatePassword={onNavigateToUpdatePassword}
      >
        <Stack screenOptions={{ ...defaultStackLayoutOptions, headerShown: false }}>
          <Stack.Screen
            name="index"
            options={{
              title: 'Welcome',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="+not-found"
            options={{
              title: 'Not Found',
              headerShown: false,
            }}
          />
          <Stack.Screen name="auth" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="checkout"
            options={{
              title: 'Checkout',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="order-confirmation"
            options={{
              title: 'Order Confirmed',
              headerShown: false,
            }}
          />
        </Stack>
      </LayoutContainer>
    </AppContextProviders>
  );
}
