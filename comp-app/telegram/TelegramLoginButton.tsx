import { type ReactNode, useEffect, useRef } from 'react';
import { Platform, View } from 'react-native';
import { Send } from 'lucide-react-native';

import { type Session } from '@supabase/supabase-js';

import { CustomButton } from '@/comp-lib/core/custom-button/CustomButton';
import { CustomTextField } from '@/comp-lib/core/custom-text-field/CustomTextField';
import { t } from '@/i18n';
import { type TelegramWidgetUser } from '@/api/telegram-api';
import { useTelegramLoginButton } from './TelegramLoginButtonFunc';
import { useTelegramLoginButtonStyles } from './TelegramLoginButtonStyles';

const WIDGET_CONTAINER_ID = 'ppq-telegram-login-widget';

interface TelegramWebWidgetProps {
  botUsername: string;
  callbackName: string;
  onAuth: (user: TelegramWidgetUser) => void;
}

function TelegramWebWidget(props: TelegramWebWidgetProps): ReactNode {
  const { botUsername, callbackName, onAuth } = props;
  const styles = useTelegramLoginButtonStyles();
  const scriptInjected = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || scriptInjected.current) return;
    scriptInjected.current = true;

    (window as unknown as Record<string, unknown>)[callbackName] = onAuth;

    const container = document.getElementById(WIDGET_CONTAINER_ID);
    if (!container) return;

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', `${callbackName}(user)`);
    script.setAttribute('data-request-access', 'write');
    script.async = true;
    container.appendChild(script);

    return () => {
      delete (window as unknown as Record<string, unknown>)[callbackName];
      if (container.contains(script)) container.removeChild(script);
      scriptInjected.current = false;
    };
  }, [botUsername, callbackName, onAuth]);

  return <View nativeID={WIDGET_CONTAINER_ID} style={styles.widgetContainer} />;
}

interface TelegramLoginButtonProps {
  onSuccess: (session: Session) => void;
  /** Show the "or" divider above the button. Defaults to true. */
  showDivider?: boolean;
}

export function TelegramLoginButton(props: TelegramLoginButtonProps): ReactNode {
  const { isWebPlatform, botUsername, widgetCallbackName, onPressTelegramLogin, onWidgetAuth } =
    useTelegramLoginButton(props.onSuccess);
  const styles = useTelegramLoginButtonStyles();
  const showDivider = props.showDivider !== false;

  return (
    <View style={styles.container}>
      {showDivider && (
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <CustomTextField styles={styles.dividerText} title={t('auth.or')} allowFontScaling={false} />
          <View style={styles.dividerLine} />
        </View>
      )}

      {isWebPlatform && Platform.OS === 'web' ? (
        <TelegramWebWidget
          botUsername={botUsername}
          callbackName={widgetCallbackName}
          onAuth={onWidgetAuth}
        />
      ) : (
        <CustomButton
          styles={styles.nativeButton}
          onPress={onPressTelegramLogin}
          title={t('auth.continueWithTelegram')}
          leftIcon={({ size, color }) => <Send size={size} color={color} />}
        />
      )}
    </View>
  );
}
