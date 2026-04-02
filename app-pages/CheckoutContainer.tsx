/**
 * Main container for the Checkout route — Payment page for completing top-up purchase
 */

import { type ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { CreditCard, Wallet, Send, ShieldCheck, AlertCircle, Bitcoin } from 'lucide-react-native';

import { t } from '@/i18n';
import { CustomTextField } from '@/comp-lib/core/custom-text-field/CustomTextField';
import { CustomTextInput } from '@/comp-lib/core/custom-text-input/CustomTextInput';
import { CustomButton } from '@/comp-lib/core/custom-button/CustomButton';
import { CustomHeader } from '@/comp-lib/custom-header/CustomHeader';
import { useStyleContext } from '@/comp-lib/styles/StyleContext';
import {
  useCheckoutStyles,
  type CheckoutOrderSummaryStyles,
  type CheckoutPaymentMethodCardStyles,
  type CheckoutPromoCodeStyles,
  type CheckoutTermsStyles,
  type CheckoutBottomBarStyles,
  type CheckoutErrorStyles,
  type CheckoutProcessingStyles,
} from './CheckoutStyles';
import { useCheckout, type OrderSummary, type PaymentMethodOption } from './CheckoutFunc';
import { CheckoutProps } from '@/app/checkout';
import { type PaymentMethod } from '@shared/generated-db-types';
import { type CustomButtonStyles } from '@/comp-lib/core/custom-button/CustomButtonStyles';
import { type CustomTextInputStyles } from '@/comp-lib/core/custom-text-input/CustomTextInputStyles';
import { type CustomHeaderStyles } from '@/comp-lib/custom-header/CustomHeaderStyles';

const PAYMENT_ICONS: Record<PaymentMethod, (size: number, color: string) => ReactNode> = {
  CARD: (size: number, color: string) => <CreditCard size={size} color={color} />,
  E_WALLET: (size: number, color: string) => <Wallet size={size} color={color} />,
  TELEGRAM_PAYMENT: (size: number, color: string) => <Send size={size} color={color} />,
  CRYPTO: (size: number, color: string) => <Bitcoin size={size} color={color} />,
  PPWALLET: (size: number, color: string) => <Wallet size={size} color={color} />,
};

interface OrderSummaryCardProps {
  orderSummary: OrderSummary;
  styles: CheckoutOrderSummaryStyles;
}

function OrderSummaryCard(props: OrderSummaryCardProps): ReactNode {
  const { orderSummary, styles } = props;
  const initial = orderSummary.gameName.charAt(0).toUpperCase();
  const hasPlayerId = orderSummary.playerId.length > 0;
  const hasServer = orderSummary.server.length > 0;

  return (
    <Animated.View entering={FadeIn.duration(250)} style={styles.card}>
      <View style={styles.gameRow}>
        <View style={styles.gameIconContainer}>
          {orderSummary.gameIconUrl.length > 0 ? (
            <Image source={{ uri: orderSummary.gameIconUrl }} style={styles.gameIcon} contentFit="cover" />
          ) : (
            <View style={styles.iconPlaceholder}>
              <CustomTextField styles={styles.iconPlaceholderText} title={initial} />
            </View>
          )}
        </View>
        <View style={styles.gameInfoColumn}>
          <CustomTextField styles={styles.gameName} title={orderSummary.gameName} numberOfLines={1} />
          <CustomTextField styles={styles.packageName} title={orderSummary.packageName} numberOfLines={1} />
        </View>
      </View>

      {(hasPlayerId || hasServer) && (
        <>
          <View style={styles.divider} />
          {hasPlayerId && (
            <View style={styles.detailRow}>
              <CustomTextField styles={styles.detailLabel} title={t('checkout.playerId')} />
              <CustomTextField styles={styles.detailValue} title={orderSummary.playerId} />
            </View>
          )}
          {hasServer && (
            <View style={styles.detailRow}>
              <CustomTextField styles={styles.detailLabel} title={t('checkout.server')} />
              <CustomTextField styles={styles.detailValue} title={orderSummary.server} />
            </View>
          )}
        </>
      )}
    </Animated.View>
  );
}

interface PaymentMethodCardProps {
  option: PaymentMethodOption;
  isSelected: boolean;
  onSelect: (method: PaymentMethod) => void;
  styles: CheckoutPaymentMethodCardStyles;
  iconColor: string;
}

function PaymentMethodCard(props: PaymentMethodCardProps): ReactNode {
  const { option, isSelected, onSelect, styles, iconColor } = props;
  const renderIcon = PAYMENT_ICONS[option.value];

  return (
    <Pressable onPress={() => onSelect(option.value)}>
      <View style={[styles.container, isSelected ? styles.containerSelected : undefined]}>
        <View style={styles.iconContainer}>
          {renderIcon(20, iconColor)}
        </View>
        <View style={styles.textColumn}>
          <CustomTextField styles={styles.label} title={t(option.labelKey as Parameters<typeof t>[0])} />
          <CustomTextField styles={styles.description} title={t(option.descriptionKey as Parameters<typeof t>[0])} />
        </View>
        <View style={[styles.radioOuter, isSelected ? styles.radioOuterSelected : undefined]}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </View>
    </Pressable>
  );
}

interface PromoCodeSectionProps {
  promoCode: string;
  promoValidationMessage?: string;
  isPromoValid?: boolean;
  promoDiscountPercent: number;
  onPromoCodeChange: (text: string) => void;
  onApplyPromoCode: () => void;
  styles: CheckoutPromoCodeStyles;
  inputStyles: CustomTextInputStyles;
  applyButtonStyles: CustomButtonStyles;
}

function PromoCodeSection(props: PromoCodeSectionProps): ReactNode {
  const { promoCode, promoValidationMessage, isPromoValid, promoDiscountPercent, onPromoCodeChange, onApplyPromoCode, styles, inputStyles, applyButtonStyles } = props;

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={{ flex: 1 }}>
          <CustomTextInput
            styles={inputStyles}
            placeholder={t('checkout.promoCodePlaceholder')}
            value={promoCode}
            onChangeText={onPromoCodeChange}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        </View>
        <CustomButton
          onPress={onApplyPromoCode}
          title={t('checkout.apply')}
          styles={applyButtonStyles}
          disabled={promoCode.trim().length === 0}
        />
      </View>
      {promoValidationMessage != null && (
        <CustomTextField
          styles={[
            styles.validationText,
            isPromoValid === false ? styles.validationTextError : undefined,
          ]}
          title={
            isPromoValid === true
              ? t('checkout.promoApplied', { percent: String(promoDiscountPercent) } as never)
              : t(promoValidationMessage as Parameters<typeof t>[0])
          }
        />
      )}
    </View>
  );
}

interface TermsSummaryProps {
  styles: CheckoutTermsStyles;
}

function TermsSummary(props: TermsSummaryProps): ReactNode {
  return (
    <View style={props.styles.container}>
      <View style={{ width: 20, height: 20, marginBottom: 6 }}>
        <ShieldCheck size={18} color="#7C7C7C" />
      </View>
      <CustomTextField styles={props.styles.title} title={t('checkout.termsTitle')} />
      <CustomTextField styles={props.styles.body} title={t('checkout.termsBody')} />
    </View>
  );
}

interface CheckoutBottomBarProps {
  subtotalInUsd: number;
  discountInUsd: number;
  totalInUsd: number;
  canSubmit: boolean;
  isProcessing: boolean;
  onSubmitPayment: () => void;
  styles: CheckoutBottomBarStyles;
  payButtonStyles: CustomButtonStyles;
}

function CheckoutBottomBar(props: CheckoutBottomBarProps): ReactNode {
  const { subtotalInUsd, discountInUsd, totalInUsd, canSubmit, isProcessing, onSubmitPayment, styles, payButtonStyles } = props;
  const hasDiscount = discountInUsd > 0;

  return (
    <View style={styles.container}>
      <View style={styles.priceBreakdown}>
        <View style={styles.priceRow}>
          <CustomTextField styles={styles.priceLabel} title={t('checkout.subtotal')} />
          <CustomTextField styles={styles.priceValue} title={`฿${Math.round(subtotalInUsd).toLocaleString()}`} />
        </View>
        {hasDiscount && (
          <View style={styles.priceRow}>
            <CustomTextField styles={styles.priceLabel} title={t('checkout.discount')} />
            <CustomTextField styles={styles.discountValue} title={`-฿${Math.round(discountInUsd).toLocaleString()}`} />
          </View>
        )}
        <View style={styles.totalRow}>
          <CustomTextField styles={styles.totalLabel} title={t('checkout.total')} />
          <CustomTextField styles={styles.totalValue} title={`฿${Math.round(totalInUsd).toLocaleString()}`} />
        </View>
      </View>
      <CustomButton
        onPress={onSubmitPayment}
        title={`${t('checkout.payNow')} · ฿${Math.round(totalInUsd).toLocaleString()}`}
        styles={payButtonStyles}
        disabled={!canSubmit || isProcessing}
        isLoading={isProcessing}
      />
    </View>
  );
}

interface ErrorBannerProps {
  error: Error;
  onRetry: () => void;
  styles: CheckoutErrorStyles;
  retryButtonStyles: CustomButtonStyles;
}

function ErrorBanner(props: ErrorBannerProps): ReactNode {
  return (
    <View style={props.styles.container}>
      <View style={{ width: 18, height: 18 }}>
        <AlertCircle size={18} color="#FFFFFF" />
      </View>
      <CustomTextField styles={props.styles.text} title={t('checkout.paymentError')} />
      <CustomButton
        onPress={props.onRetry}
        title={t('checkout.retry')}
        styles={props.retryButtonStyles}
      />
    </View>
  );
}

interface ProcessingOverlayProps {
  styles: CheckoutProcessingStyles;
  accentColor: string;
}

function ProcessingOverlay(props: ProcessingOverlayProps): ReactNode {
  return (
    <View style={props.styles.overlay}>
      <Animated.View entering={FadeIn.duration(200)} style={props.styles.content}>
        <ActivityIndicator size="large" color={props.accentColor} />
        <CustomTextField styles={props.styles.text} title={t('checkout.processing')} />
      </Animated.View>
    </View>
  );
}

export default function CheckoutContainer(props: CheckoutProps): ReactNode {
  const { colors } = useStyleContext();
  const {
    styles,
    headerStyles,
    orderSummaryStyles,
    paymentMethodCardStyles,
    promoCodeStyles,
    promoInputStyles,
    applyButtonStyles,
    termsStyles,
    bottomBarStyles,
    payButtonStyles,
    errorStyles,
    retryButtonStyles,
    processingStyles,
  } = useCheckoutStyles();
  const {
    isProcessing,
    error,
    orderSummary,
    paymentMethodOptions,
    selectedPaymentMethod,
    promoCode,
    promoDiscountPercent,
    promoValidationMessage,
    isPromoValid,
    subtotalInUsd,
    discountInUsd,
    totalInUsd,
    canSubmit,
    onSelectPaymentMethod,
    onPromoCodeChange,
    onApplyPromoCode,
    onSubmitPayment,
    onRetry,
  } = useCheckout(props);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <CustomHeader
          showBackButton
          onGoBack={props.onGoBack}
          title={t('checkout.title')}
          customHeaderStyles={headerStyles}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Order Summary */}
          <View style={styles.sectionContainer}>
            <CustomTextField styles={styles.sectionTitle} title={t('checkout.orderSummary')} />
            <OrderSummaryCard orderSummary={orderSummary} styles={orderSummaryStyles} />
          </View>

          {/* Payment Methods */}
          <View style={styles.sectionContainer}>
            <CustomTextField styles={styles.sectionTitle} title={t('checkout.paymentMethod')} />
            {paymentMethodOptions.map((option) => (
              <PaymentMethodCard
                key={option.value}
                option={option}
                isSelected={option.value === selectedPaymentMethod}
                onSelect={onSelectPaymentMethod}
                styles={paymentMethodCardStyles}
                iconColor={option.value === selectedPaymentMethod ? colors.primaryAccentDark : colors.tertiaryForeground}
              />
            ))}
          </View>

          {/* Promo Code */}
          <View style={styles.sectionContainer}>
            <CustomTextField styles={styles.sectionTitle} title={t('checkout.promoCode')} />
            <PromoCodeSection
              promoCode={promoCode}
              promoValidationMessage={promoValidationMessage}
              isPromoValid={isPromoValid}
              promoDiscountPercent={promoDiscountPercent}
              onPromoCodeChange={onPromoCodeChange}
              onApplyPromoCode={onApplyPromoCode}
              styles={promoCodeStyles}
              inputStyles={promoInputStyles}
              applyButtonStyles={applyButtonStyles}
            />
          </View>

          {/* Terms */}
          <View style={styles.sectionContainer}>
            <TermsSummary styles={termsStyles} />
          </View>

          {/* Error Banner */}
          {error != null && (
            <View style={styles.sectionContainer}>
              <ErrorBanner
                error={error}
                onRetry={onRetry}
                styles={errorStyles}
                retryButtonStyles={retryButtonStyles}
              />
            </View>
          )}
        </ScrollView>

        {/* Bottom Pay Bar */}
        <CheckoutBottomBar
          subtotalInUsd={subtotalInUsd}
          discountInUsd={discountInUsd}
          totalInUsd={totalInUsd}
          canSubmit={canSubmit}
          isProcessing={isProcessing}
          onSubmitPayment={onSubmitPayment}
          styles={bottomBarStyles}
          payButtonStyles={payButtonStyles}
        />

        {/* Processing Overlay */}
        {isProcessing && (
          <ProcessingOverlay styles={processingStyles} accentColor={colors.primaryAccentDark} />
        )}
      </View>
    </SafeAreaView>
  );
}
