/**
 * AUTO-GENERATED - DO NOT MODIFY!
 * Any changes will be lost when the file is regenerated.
 */

import { type PropsWithChildren, type ReactNode } from 'react';
import { type UnknownOutputParams } from 'expo-router';

import { useNav } from '@/comp-lib/navigation/useNav';
import { type TabsGamesUrlParams } from '@/app/(tabs)/games';
import { type OnboardingGamePreferencesUrlParams } from '@/app/onboarding/game-preferences';
import { type AuthSignupUrlParams } from '@/app/auth/signup';
import { type AuthResetPasswordUrlParams } from '@/app/auth/reset-password';
import LoginContainer from '@/app-pages/auth/LoginContainer';

export type AuthLoginUrlParams = UnknownOutputParams;

export interface LoginProps extends PropsWithChildren {
  /**
   * The page's URL params. Includes path and query params.
   */
  urlParams: AuthLoginUrlParams;
  /**
   * Sets the navigation options using navigation.setOptions()
   * @param options The options to set
   * @returns void
   */
  setNavigationOptions: (options?: Record<string, any>) => void;

  /**
   * Executes after successful login when onboarding is complete
   */
  onNavigateToHome: (urlParams?: TabsGamesUrlParams) => void;
  /**
   * Executes after successful login when onboarding is not complete
   */
  onNavigateToOnboarding: (urlParams?: OnboardingGamePreferencesUrlParams) => void;
  /**
   * Executes when user wants to create a new account
   */
  onNavigateToSignup: (urlParams?: AuthSignupUrlParams) => void;
  /**
   * Executes when user wants to reset their password
   */
  onNavigateToResetPassword: (urlParams?: AuthResetPasswordUrlParams) => void;
}

/**
 * User login page
 */
export default function LoginPage(props: LoginProps): ReactNode {
  const { urlParams, setOptions, navigate } = useNav<AuthLoginUrlParams>({ auth: false });
  /**
   * Executes after successful login when onboarding is complete
   */
  const onNavigateToHome = (urlParams?: TabsGamesUrlParams) => {
    navigate({
      pathname: '/(tabs)/games',
      params: urlParams,
    });
  };
  /**
   * Executes after successful login when onboarding is not complete
   */
  const onNavigateToOnboarding = (urlParams?: OnboardingGamePreferencesUrlParams) => {
    navigate({
      pathname: '/onboarding/game-preferences',
      params: urlParams,
    });
  };
  /**
   * Executes when user wants to create a new account
   */
  const onNavigateToSignup = (urlParams?: AuthSignupUrlParams) => {
    navigate({
      pathname: '/auth/signup',
      params: urlParams,
    });
  };
  /**
   * Executes when user wants to reset their password
   */
  const onNavigateToResetPassword = (urlParams?: AuthResetPasswordUrlParams) => {
    navigate({
      pathname: '/auth/reset-password',
      params: urlParams,
    });
  };

  return (
    <LoginContainer
      children={props.children}
      urlParams={urlParams}
      setNavigationOptions={setOptions}
      onNavigateToHome={onNavigateToHome}
      onNavigateToOnboarding={onNavigateToOnboarding}
      onNavigateToSignup={onNavigateToSignup}
      onNavigateToResetPassword={onNavigateToResetPassword}
    />
  );
}
