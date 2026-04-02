/**
 * Main container for the OrdersOrderId route — Detailed order view with transaction info
 */

import { type ReactNode } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { CheckCircle, Headphones, RefreshCw, RotateCcw } from 'lucide-react-native';

import { t } from '@/i18n';
import { CustomTextField } from '@/comp-lib/core/custom-text-field/CustomTextField';
import { CustomButton } from '@/comp-lib/core/custom-button/CustomButton';
import { CustomHeader } from '@/comp-lib/custom-header/CustomHeader';
import { useStyleContext } from '@/comp-lib/styles/StyleContext';
import {
  useOrdersOrderIdStyles,
  type TimelineStyles,
  type GameInfoStyles,
  type PaymentDetailsStyles,
  type DeliveryConfirmationStyles,
  type ActionIconStyles,
} from './OrdersOrderIdStyles';
import {
  useOrdersOrderId,
  formatTimelineTimestamp,
  type TimelineStep,
  type FormattedOrderDetails,
} from './OrdersOrderIdFunc';
import { OrdersOrderIdProps } from '@/app/orders/[orderId]';

interface StatusTimelineProps {
  steps: TimelineStep[];
  styles: TimelineStyles;
}

function StatusTimeline(props: StatusTimelineProps): ReactNode {
  const { steps, styles } = props;

  function getDotStyle(step: TimelineStep): object {
    if (step.isFailed) return styles.dotFailed;
    if (step.isActive) return styles.dotActive;
    if (step.isCompleted) return styles.dotCompleted;
    return styles.dotPending;
  }

  function getLineStyle(currentStep: TimelineStep, nextStep: TimelineStep): object {
    if (nextStep.isFailed) return styles.lineFailed;
    if (currentStep.isCompleted && (nextStep.isCompleted || nextStep.isActive)) return styles.lineCompleted;
    return styles.linePending;
  }

  function getLabelStyle(step: TimelineStep): object[] {
    const baseStyle = [styles.stepLabel];
    if (step.isFailed) return [...baseStyle, styles.stepLabelFailed];
    if (step.isActive) return [...baseStyle, styles.stepLabelActive];
    return baseStyle;
  }

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <View key={step.key} style={styles.stepRow}>
            <View style={styles.dotColumn}>
              <View style={getDotStyle(step)} />
              {!isLast && (
                <View style={getLineStyle(step, steps[index + 1])} />
              )}
            </View>
            <View style={styles.textColumn}>
              <CustomTextField
                styles={getLabelStyle(step)}
                title={t(step.labelKey as Parameters<typeof t>[0])}
              />
              {step.timestamp != null && (
                <CustomTextField
                  styles={styles.stepTimestamp}
                  title={formatTimelineTimestamp(step.timestamp)}
                />
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

interface GameInfoCardProps {
  orderDetails: FormattedOrderDetails;
  styles: GameInfoStyles;
  dividerStyle: object;
}

function GameInfoCard(props: GameInfoCardProps): ReactNode {
  const { orderDetails, styles, dividerStyle } = props;
  const initial = orderDetails.gameName.charAt(0).toUpperCase();
  const hasPlayerId = orderDetails.playerId != null && orderDetails.playerId.length > 0;
  const hasServer = orderDetails.server != null && orderDetails.server.length > 0;

  return (
    <View>
      <View style={styles.gameRow}>
        <View style={styles.gameIconContainer}>
          {orderDetails.gameIconUrl.length > 0 ? (
            <Image source={{ uri: orderDetails.gameIconUrl }} style={styles.gameIcon} contentFit="cover" />
          ) : (
            <View style={styles.iconPlaceholder}>
              <CustomTextField styles={styles.iconPlaceholderText} title={initial} />
            </View>
          )}
        </View>
        <View style={styles.gameInfoColumn}>
          <CustomTextField styles={styles.gameName} title={orderDetails.gameName} numberOfLines={1} />
          <CustomTextField styles={styles.packageName} title={orderDetails.packageName} numberOfLines={1} />
        </View>
      </View>

      {(hasPlayerId || hasServer) && (
        <>
          <View style={dividerStyle} />
          {hasPlayerId && (
            <View style={styles.detailRow}>
              <CustomTextField styles={styles.detailLabel} title={t('orderDetail.playerId')} />
              <CustomTextField styles={styles.detailValue} title={orderDetails.playerId ?? ''} />
            </View>
          )}
          {hasServer && (
            <View style={styles.detailRow}>
              <CustomTextField styles={styles.detailLabel} title={t('orderDetail.server')} />
              <CustomTextField styles={styles.detailValue} title={orderDetails.server ?? ''} />
            </View>
          )}
        </>
      )}
    </View>
  );
}

interface PaymentDetailsCardProps {
  orderDetails: FormattedOrderDetails;
  hasDiscount: boolean;
  styles: PaymentDetailsStyles;
}

function PaymentDetailsCard(props: PaymentDetailsCardProps): ReactNode {
  const { orderDetails, hasDiscount, styles } = props;

  return (
    <View>
      <View style={styles.detailRow}>
        <CustomTextField styles={styles.detailLabel} title={t('orderDetail.paymentMethod')} />
        <CustomTextField
          styles={styles.detailValue}
          title={t(orderDetails.paymentMethodKey as Parameters<typeof t>[0])}
        />
      </View>
      <View style={styles.detailRow}>
        <CustomTextField styles={styles.detailLabel} title={t('orderDetail.subtotal')} />
        <CustomTextField styles={styles.detailValue} title={`$${orderDetails.subtotalInUsd}`} />
      </View>
      {hasDiscount && (
        <View style={styles.detailRow}>
          <CustomTextField styles={styles.detailLabel} title={t('orderDetail.discount')} />
          <CustomTextField styles={styles.discountValue} title={`-$${orderDetails.discountInUsd}`} />
        </View>
      )}
      {orderDetails.promoCode != null && (
        <View style={styles.detailRow}>
          <CustomTextField styles={styles.detailLabel} title={t('orderDetail.promoCode')} />
          <CustomTextField styles={styles.detailValue} title={orderDetails.promoCode} />
        </View>
      )}
      <View style={styles.totalRow}>
        <CustomTextField styles={styles.totalLabel} title={t('orderDetail.total')} />
        <CustomTextField styles={styles.totalValue} title={`$${orderDetails.totalInUsd}`} />
      </View>
    </View>
  );
}

interface DeliveryConfirmationRowProps {
  completedAtFormatted?: string;
  styles: DeliveryConfirmationStyles;
  iconColor: string;
}

function DeliveryConfirmationRow(props: DeliveryConfirmationRowProps): ReactNode {
  return (
    <View style={props.styles.container}>
      <View style={props.styles.iconContainer}>
        <View style={props.styles.checkIconWrapper}>
          <CheckCircle size={20} color={props.iconColor} strokeWidth={2.5} />
        </View>
      </View>
      <View style={props.styles.textColumn}>
        <CustomTextField styles={props.styles.label} title={t('orderDetail.deliveryConfirmed')} />
        {props.completedAtFormatted != null && (
          <CustomTextField styles={props.styles.value} title={props.completedAtFormatted} />
        )}
      </View>
    </View>
  );
}

export default function OrdersOrderIdContainer(props: OrdersOrderIdProps): ReactNode {
  const { colors } = useStyleContext();
  const {
    styles,
    headerStyles,
    timelineStyles,
    gameInfoStyles,
    paymentDetailsStyles,
    deliveryConfirmationStyles,
    actionIconStyles,
    primaryButtonStyles,
    secondaryButtonStyles,
    tertiaryButtonStyles,
    retryButtonStyles,
  } = useOrdersOrderIdStyles();
  const {
    isLoading,
    error,
    orderDetails,
    timelineSteps,
    hasDiscount,
    showDeliveryConfirmation,
    showRetryOption,
    showSupportOption,
    onContactSupport,
    onReorderPackage,
    onRetryPayment,
    onRetryLoad,
  } = useOrdersOrderId(props);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <CustomHeader
            showBackButton
            onGoBack={props.onGoBack}
            title={t('orderDetail.title')}
            customHeaderStyles={headerStyles}
          />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryAccentDark} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error != null || orderDetails == null) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <CustomHeader
            showBackButton
            onGoBack={props.onGoBack}
            title={t('orderDetail.title')}
            customHeaderStyles={headerStyles}
          />
          <View style={styles.errorContainer}>
            <CustomTextField styles={styles.errorText} title={t('orderDetail.loadError')} />
            <CustomButton
              onPress={onRetryLoad}
              title={t('orderDetail.retry')}
              styles={retryButtonStyles}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CustomHeader
          showBackButton
          onGoBack={props.onGoBack}
          title={t('orderDetail.title')}
          customHeaderStyles={headerStyles}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Order ID & Date */}
          <Animated.View entering={FadeIn.duration(300)}>
            <View style={styles.orderIdSection}>
              <View style={styles.orderIdBadge}>
                <CustomTextField
                  styles={styles.orderIdText}
                  title={`#${orderDetails.orderIdDisplay}`}
                />
              </View>
              <CustomTextField
                styles={styles.placedOnText}
                title={`${t('orderDetail.placedOn')} ${orderDetails.createdAtFormatted}`}
              />
            </View>
          </Animated.View>

          {/* Status Timeline */}
          <Animated.View entering={FadeInDown.duration(300).delay(100)}>
            <View style={styles.sectionContainer}>
              <CustomTextField styles={styles.sectionTitle} title={t('orderDetail.statusTimeline')} />
              <View style={styles.card}>
                <StatusTimeline steps={timelineSteps} styles={timelineStyles} />
              </View>
            </View>
          </Animated.View>

          {/* Game & Package Info */}
          <Animated.View entering={FadeInDown.duration(300).delay(200)}>
            <View style={styles.sectionContainer}>
              <CustomTextField styles={styles.sectionTitle} title={t('orderDetail.gameAndPackage')} />
              <View style={styles.card}>
                <GameInfoCard
                  orderDetails={orderDetails}
                  styles={gameInfoStyles}
                  dividerStyle={styles.cardDivider}
                />
              </View>
            </View>
          </Animated.View>

          {/* Payment Details */}
          <Animated.View entering={FadeInDown.duration(300).delay(300)}>
            <View style={styles.sectionContainer}>
              <CustomTextField styles={styles.sectionTitle} title={t('orderDetail.paymentDetails')} />
              <View style={styles.card}>
                <PaymentDetailsCard
                  orderDetails={orderDetails}
                  hasDiscount={hasDiscount}
                  styles={paymentDetailsStyles}
                />
              </View>
            </View>
          </Animated.View>

          {/* Delivery Confirmation */}
          {showDeliveryConfirmation && (
            <Animated.View entering={FadeInDown.duration(300).delay(400)}>
              <View style={styles.sectionContainer}>
                <DeliveryConfirmationRow
                  completedAtFormatted={orderDetails.completedAtFormatted}
                  styles={deliveryConfirmationStyles}
                  iconColor={colors.primaryAccentForeground}
                />
              </View>
            </Animated.View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {showRetryOption && (
            <CustomButton
              onPress={onRetryPayment}
              title={t('orderDetail.retryPayment')}
              styles={primaryButtonStyles}
              leftIcon={(iconProps) => (
                <View style={actionIconStyles.iconWrapper}>
                  <RefreshCw size={iconProps.size} color={iconProps.color} />
                </View>
              )}
            />
          )}
          <CustomButton
            onPress={onReorderPackage}
            title={t('orderDetail.reorder')}
            styles={showRetryOption ? secondaryButtonStyles : primaryButtonStyles}
            leftIcon={(iconProps) => (
              <View style={actionIconStyles.iconWrapper}>
                <RotateCcw size={iconProps.size} color={iconProps.color} />
              </View>
            )}
          />
          {showSupportOption && (
            <CustomButton
              onPress={onContactSupport}
              title={t('orderDetail.contactSupport')}
              styles={tertiaryButtonStyles}
              leftIcon={(iconProps) => (
                <View style={actionIconStyles.iconWrapper}>
                  <Headphones size={iconProps.size} color={iconProps.color} />
                </View>
              )}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
