/**
 * Main container for the OrderConfirmation route — Success page after completed purchase
 */

import { type ReactNode } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, Check, Clock, Gamepad2, ShoppingBag } from 'lucide-react-native';

import { t } from '@/i18n';
import { CustomTextField } from '@/comp-lib/core/custom-text-field/CustomTextField';
import { CustomButton } from '@/comp-lib/core/custom-button/CustomButton';
import { useStyleContext } from '@/comp-lib/styles/StyleContext';
import {
  useOrderConfirmationStyles,
  type OrderDetailRowStyles,
  type HowItWorksStepStyles,
} from './OrderConfirmationStyles';
import { useOrderConfirmation, type HowItWorksStep } from './OrderConfirmationFunc';
import { OrderConfirmationProps } from '@/app/order-confirmation';

interface OrderDetailRowProps {
  label: string;
  value: string;
  styles: OrderDetailRowStyles;
}

function OrderDetailRow(props: OrderDetailRowProps): ReactNode {
  return (
    <View style={props.styles.detailRow}>
      <CustomTextField styles={props.styles.detailLabel} title={props.label} />
      <CustomTextField styles={props.styles.detailValue} title={props.value} numberOfLines={1} />
    </View>
  );
}

interface HowItWorksStepRowProps {
  step: HowItWorksStep;
  styles: HowItWorksStepStyles;
}

function HowItWorksStepRow(props: HowItWorksStepRowProps): ReactNode {
  return (
    <View style={props.styles.stepRow}>
      <View style={props.styles.stepNumberContainer}>
        <CustomTextField styles={props.styles.stepNumber} title={String(props.step.id)} />
      </View>
      <CustomTextField
        styles={props.styles.stepText}
        title={t(props.step.translationKey as Parameters<typeof t>[0])}
      />
    </View>
  );
}

export default function OrderConfirmationContainer(props: OrderConfirmationProps): ReactNode {
  const { colors } = useStyleContext();
  const {
    styles,
    primaryButtonStyles,
    secondaryButtonStyles,
    orderDetailRowStyles,
    howItWorksStepStyles,
  } = useOrderConfirmationStyles();
  const {
    orderDetails,
    howItWorksSteps,
    isLoading,
    hasError,
    onViewOrders,
    onContinueBrowsing,
  } = useOrderConfirmation(props);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primaryAccentDark} />
        </View>
      </SafeAreaView>
    );
  }

  if (hasError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <View style={{ width: 48, height: 48, marginBottom: 16 }}>
            <AlertTriangle size={48} color={colors.customColors.error} />
          </View>
          <CustomTextField styles={styles.successSubtitle} title={t('errors.defaultMessage')} />
          <View style={[styles.actionsContainer, { marginTop: 24 }]}>
            <CustomButton
              onPress={onViewOrders}
              title={t('orderConfirmation.viewOrders')}
              styles={primaryButtonStyles}
            />
            <CustomButton
              onPress={onContinueBrowsing}
              title={t('orderConfirmation.browseGames')}
              styles={secondaryButtonStyles}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Success Animation Section */}
          <View style={styles.successSection}>
            <Animated.View entering={ZoomIn.duration(400).delay(100)} style={styles.successIconContainer}>
              <View style={{ width: 36, height: 36 }}>
                <Check size={36} color={colors.primaryAccentForeground} strokeWidth={3} />
              </View>
            </Animated.View>
            <Animated.View entering={FadeIn.duration(400).delay(300)}>
              <CustomTextField styles={styles.successTitle} title={t('orderConfirmation.title')} />
            </Animated.View>
            <Animated.View entering={FadeIn.duration(400).delay(450)}>
              <CustomTextField styles={styles.successSubtitle} title={t('orderConfirmation.subtitle')} />
            </Animated.View>
          </View>

          {/* Order Details Card */}
          <Animated.View entering={FadeInDown.duration(400).delay(550)}>
            <View style={styles.detailsCard}>
              <CustomTextField styles={styles.detailsSectionTitle} title={t('orderConfirmation.orderDetails')} />
              <OrderDetailRow
                label={t('orderConfirmation.orderId')}
                value={`#${orderDetails.orderIdDisplay}`}
                styles={orderDetailRowStyles}
              />
              <View style={styles.detailDivider} />
              <OrderDetailRow
                label={t('orderConfirmation.game')}
                value={orderDetails.gameName}
                styles={orderDetailRowStyles}
              />
              <View style={styles.detailDivider} />
              <OrderDetailRow
                label={t('orderConfirmation.package')}
                value={orderDetails.packageName}
                styles={orderDetailRowStyles}
              />
              <View style={styles.detailDivider} />
              <OrderDetailRow
                label={t('orderConfirmation.amountPaid')}
                value={`฿${orderDetails.totalInUsd}`}
                styles={orderDetailRowStyles}
              />
            </View>
          </Animated.View>

          {/* Delivery Info */}
          <Animated.View entering={FadeInDown.duration(400).delay(650)}>
            <View style={styles.deliveryRow}>
              <View style={styles.deliveryIconContainer}>
                <View style={{ width: 20, height: 20 }}>
                  <Clock size={20} color={colors.primaryAccentForeground} strokeWidth={2.5} />
                </View>
              </View>
              <View style={styles.deliveryTextColumn}>
                <CustomTextField styles={styles.deliveryLabel} title={t('orderConfirmation.delivery')} />
                <CustomTextField styles={styles.deliveryValue} title={t('orderConfirmation.deliveryInstant')} />
              </View>
            </View>
          </Animated.View>

          {/* How It Works */}
          <Animated.View entering={FadeInDown.duration(400).delay(750)}>
            <View style={styles.howItWorksCard}>
              <CustomTextField styles={styles.howItWorksSectionTitle} title={t('orderConfirmation.howItWorks')} />
              {howItWorksSteps.map((step) => (
                <HowItWorksStepRow
                  key={step.id}
                  step={step}
                  styles={howItWorksStepStyles}
                />
              ))}
            </View>
          </Animated.View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <CustomButton
            onPress={onViewOrders}
            title={t('orderConfirmation.viewOrders')}
            styles={primaryButtonStyles}
            leftIcon={(iconProps) => (
              <View style={{ width: iconProps.size, height: iconProps.size }}>
                <ShoppingBag size={iconProps.size} color={iconProps.color} />
              </View>
            )}
          />
          <CustomButton
            onPress={onContinueBrowsing}
            title={t('orderConfirmation.browseGames')}
            styles={secondaryButtonStyles}
            leftIcon={(iconProps) => (
              <View style={{ width: iconProps.size, height: iconProps.size }}>
                <Gamepad2 size={iconProps.size} color={iconProps.color} />
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
