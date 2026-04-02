/**
 * Login container that handles user login
 */
import { type ReactNode } from 'react';
import { View } from 'react-native';

import { LoginProps } from '@/app/auth/login';
import LoginCore from '@/comp-lib/auth/LoginCore';
import { useLoginStyles } from './LoginStyles.ts';
import { t } from '@/i18n';
import { useAppRedirection } from '@/comp-app/auth/useAppRedirection.ts';
import { TelegramLoginButton } from '@/comp-app/telegram/TelegramLoginButton';

export default function LoginContainer(props: LoginProps): ReactNode {
  const { loginCoreStyles, styles } = useLoginStyles();
  const { onPostLoginRedirection } = useAppRedirection({
    onNavigateToHome: props.onNavigateToHome,
    onNavigateToOnboarding: props.onNavigateToOnboarding,
  });

  return (
    <View style={styles.container}>
      <LoginCore
        styles={loginCoreStyles}
        wrapInSafeAreaView
        wrapInKeyboardAvoidingView
        showSpinnerOnSubmit
        title={t('auth.signIn')}
        subTitle={t('auth.loginSubtitle')}
        onLogin={onPostLoginRedirection}
        onGoToSignupButtonPress={props.onNavigateToSignup}
        onGoToResetPwButtonPress={props.onNavigateToResetPassword}
      />
      <View style={styles.telegramButtonWrapper}>
        <TelegramLoginButton onSuccess={onPostLoginRedirection} />
      </View>
    </View>
  );
}
