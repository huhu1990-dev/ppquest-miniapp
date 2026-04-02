import { type ReactNode } from 'react';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gamepad2 } from 'lucide-react-native';

import { CustomButton } from '@/comp-lib/core/custom-button/CustomButton';
import { CustomTextField } from '@/comp-lib/core/custom-text-field/CustomTextField';
import { t } from '@/i18n';
import { TelegramLoginButton } from '@/comp-app/telegram/TelegramLoginButton';
import { type FeatureItem } from './IndexFunc';
import { useIndexStyles, type FeatureRowStyles } from './IndexStyles';
import { useIndex } from './IndexFunc';
import { type IndexProps } from '@/app/index';
import { useTelegramContext } from '@/comp-app/telegram/TelegramProviderFunc';

interface FeatureRowProps {
  feature: FeatureItem;
  styles: FeatureRowStyles;
}

function FeatureRow(props: FeatureRowProps): ReactNode {
  const { feature, styles } = props;
  const IconComponent = feature.Icon;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconComponent size={styles.iconSize} color={styles.iconColor} />
      </View>
      <View style={styles.textContainer}>
        <CustomTextField styles={styles.title} title={t(feature.titleKey)} />
        <CustomTextField styles={styles.description} title={t(feature.descriptionKey)} />
      </View>
    </View>
  );
}

export default function IndexContainer(props: IndexProps): ReactNode {
  const { styles, featureRowStyles, loginButtonStyles, signupButtonStyles } = useIndexStyles();
  const { features } = useIndex(props);
  const { isTelegramEnv, telegramAuthError } = useTelegramContext();

  // In Telegram MiniApp: show loading spinner while auto-login is processing
  if (isTelegramEnv) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#059669' }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
            <Gamepad2 size={32} color="#FFFFFF" />
          </View>
          <CustomTextField styles={{ color: '#FFFFFF', fontSize: 24, fontWeight: '800' }} title={t('app.name')} />
          {telegramAuthError ? (
            <View style={{ marginTop: 16, alignItems: 'center' }}>
              <CustomTextField styles={{ color: '#FEE2E2', fontSize: 14 }} title="เข้าสู่ระบบไม่สำเร็จ" />
              <CustomTextField styles={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 }} title={telegramAuthError} />
            </View>
          ) : (
            <View style={{ marginTop: 24, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <CustomTextField styles={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 12 }} title="กำลังเข้าสู่ระบบ..." />
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View>
          <LinearGradient
            colors={styles.heroGradientColors}
            locations={styles.heroGradientLocations}
            style={styles.heroSection}
          >
            <View style={styles.logoContainer}>
              <Gamepad2 size={styles.logoIconSize} color={styles.logoIconColor} />
            </View>
            <CustomTextField styles={styles.appName} title={t('app.name')} />
            <CustomTextField styles={styles.tagline} title={t('welcome.tagline')} />
            <CustomTextField styles={styles.subtitle} title={t('welcome.subtitle')} />
          </LinearGradient>

          <View style={styles.featuresSection}>
            <CustomTextField styles={styles.featuresSectionTitle} title={t('welcome.whyChooseUs')} />
            {features.map((feature) => (
              <FeatureRow key={feature.key} feature={feature} styles={featureRowStyles} />
            ))}
          </View>
        </View>

        <View style={styles.ctaSection}>
          <TelegramLoginButton onSuccess={() => {}} showDivider={false} />
          <CustomTextField styles={styles.ctaDividerText} title={t('welcome.or')} />
          <CustomButton
            onPress={() => props.onNavigateToLogin()}
            title={t('auth.signIn')}
            styles={loginButtonStyles}
          />
          <CustomButton
            onPress={() => props.onNavigateToSignup()}
            title={t('auth.signUp')}
            styles={signupButtonStyles}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
