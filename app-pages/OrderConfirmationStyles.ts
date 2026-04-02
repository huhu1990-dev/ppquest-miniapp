/**
 * Styling for the OrderConfirmation page
 */
import { ViewStyle, TextStyle } from 'react-native';

import { useStyleContext } from '@/comp-lib/styles/StyleContext';
import { CustomButtonStyles } from '@/comp-lib/core/custom-button/CustomButtonStyles';

const SUCCESS_ICON_SIZE = 72;
const SUCCESS_ICON_BORDER_RADIUS = 36;
const STEP_NUMBER_SIZE = 24;
const STEP_NUMBER_BORDER_RADIUS = 12;

/**
 * Interface for base styles of the useOrderConfirmationStyles hook
 */
export interface OrderConfirmationBaseStyles {
  safeArea: ViewStyle;
  container: ViewStyle;
  scrollContent: ViewStyle;
  successSection: ViewStyle;
  successIconContainer: ViewStyle;
  successTitle: TextStyle;
  successSubtitle: TextStyle;
  detailsCard: ViewStyle;
  detailsSectionTitle: TextStyle;
  detailRow: ViewStyle;
  detailLabel: TextStyle;
  detailValue: TextStyle;
  detailDivider: ViewStyle;
  deliveryRow: ViewStyle;
  deliveryIconContainer: ViewStyle;
  deliveryTextColumn: ViewStyle;
  deliveryLabel: TextStyle;
  deliveryValue: TextStyle;
  howItWorksCard: ViewStyle;
  howItWorksSectionTitle: TextStyle;
  stepRow: ViewStyle;
  stepNumberContainer: ViewStyle;
  stepNumber: TextStyle;
  stepText: TextStyle;
  actionsContainer: ViewStyle;
}

/** Styles for the order detail row sub-component */
export interface OrderDetailRowStyles {
  detailRow: ViewStyle;
  detailLabel: TextStyle;
  detailValue: TextStyle;
}

/** Styles for the how-it-works step sub-component */
export interface HowItWorksStepStyles {
  stepRow: ViewStyle;
  stepNumberContainer: ViewStyle;
  stepNumber: TextStyle;
  stepText: TextStyle;
}

/**
 * Interface for the return value of the useOrderConfirmationStyles hook
 */
export interface OrderConfirmationStyles {
  styles: OrderConfirmationBaseStyles;
  primaryButtonStyles: CustomButtonStyles;
  secondaryButtonStyles: CustomButtonStyles;
  orderDetailRowStyles: OrderDetailRowStyles;
  howItWorksStepStyles: HowItWorksStepStyles;
}

/**
 * Custom hook that provides styles for the OrderConfirmation component
 */
export function useOrderConfirmationStyles(): OrderConfirmationStyles {
  const {
    createAppPageStyles,
    colors,
    typographyPresets,
    spacingPresets,
    buttonPresets,
    borderRadiusPresets,
    overrideStyles,
  } = useStyleContext();

  const HORIZONTAL_PADDING = spacingPresets.md2;

  const styles: OrderConfirmationBaseStyles = {
    safeArea: {
      flex: 1,
      backgroundColor: colors.primaryBackground,
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingBottom: spacingPresets.lg2,
    },
    successSection: {
      alignItems: 'center',
      paddingTop: spacingPresets.lg2,
      paddingBottom: spacingPresets.lg1,
    },
    successIconContainer: {
      width: SUCCESS_ICON_SIZE,
      height: SUCCESS_ICON_SIZE,
      borderRadius: SUCCESS_ICON_BORDER_RADIUS,
      backgroundColor: colors.primaryAccentDark,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacingPresets.md2,
    },
    successTitle: {
      ...typographyPresets.PageTitle,
      color: colors.primaryForeground,
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: spacingPresets.sm,
    },
    successSubtitle: {
      ...typographyPresets.Body,
      color: colors.secondaryForeground,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
      paddingHorizontal: spacingPresets.md2,
    },
    detailsCard: {
      backgroundColor: colors.secondaryBackground,
      borderRadius: borderRadiusPresets.components,
      padding: spacingPresets.md2,
      borderWidth: 1,
      borderColor: colors.tertiaryBackground,
      marginBottom: spacingPresets.md2,
    },
    detailsSectionTitle: {
      ...typographyPresets.Label,
      color: colors.primaryForeground,
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '700',
      marginBottom: spacingPresets.md1,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacingPresets.sm,
    },
    detailLabel: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      fontSize: 13,
      lineHeight: 17,
    },
    detailValue: {
      ...typographyPresets.Body,
      color: colors.primaryForeground,
      fontSize: 13,
      lineHeight: 17,
      fontWeight: '600',
      flexShrink: 1,
      textAlign: 'right',
      maxWidth: '60%' as unknown as number,
    },
    detailDivider: {
      height: 1,
      backgroundColor: colors.tertiaryBackground,
    },
    deliveryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacingPresets.md1,
      paddingVertical: spacingPresets.md1,
      paddingHorizontal: spacingPresets.md2,
      backgroundColor: colors.tertiaryBackground,
      borderRadius: borderRadiusPresets.components,
      marginBottom: spacingPresets.md2,
    },
    deliveryIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primaryAccentDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
    deliveryTextColumn: {
      flex: 1,
      gap: spacingPresets.xxs,
    },
    deliveryLabel: {
      ...typographyPresets.Label,
      color: colors.primaryForeground,
      fontSize: 13,
      lineHeight: 17,
      fontWeight: '600',
    },
    deliveryValue: {
      ...typographyPresets.Caption,
      color: colors.secondaryForeground,
      fontSize: 12,
      lineHeight: 16,
    },
    howItWorksCard: {
      backgroundColor: colors.secondaryBackground,
      borderRadius: borderRadiusPresets.components,
      padding: spacingPresets.md2,
      borderWidth: 1,
      borderColor: colors.tertiaryBackground,
      marginBottom: spacingPresets.lg1,
    },
    howItWorksSectionTitle: {
      ...typographyPresets.Label,
      color: colors.primaryForeground,
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '700',
      marginBottom: spacingPresets.md1,
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacingPresets.md1,
      marginBottom: spacingPresets.md1,
    },
    stepNumberContainer: {
      width: STEP_NUMBER_SIZE,
      height: STEP_NUMBER_SIZE,
      borderRadius: STEP_NUMBER_BORDER_RADIUS,
      backgroundColor: colors.tertiaryBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepNumber: {
      ...typographyPresets.Caption,
      color: colors.primaryAccentDark,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '700',
    },
    stepText: {
      ...typographyPresets.Body,
      color: colors.secondaryForeground,
      fontSize: 13,
      lineHeight: 18,
      flex: 1,
    },
    actionsContainer: {
      gap: spacingPresets.md1,
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingBottom: spacingPresets.md2,
    },
  };

  const primaryButtonStyles: CustomButtonStyles = overrideStyles(buttonPresets.Primary, {
    container: {
      borderRadius: borderRadiusPresets.components,
      paddingVertical: spacingPresets.md1,
    },
  });

  const secondaryButtonStyles: CustomButtonStyles = overrideStyles(buttonPresets.Secondary, {
    container: {
      borderRadius: borderRadiusPresets.components,
      paddingVertical: spacingPresets.md1,
    },
  });

  const orderDetailRowStyles: OrderDetailRowStyles = {
    detailRow: styles.detailRow,
    detailLabel: styles.detailLabel,
    detailValue: styles.detailValue,
  };

  const howItWorksStepStyles: HowItWorksStepStyles = {
    stepRow: styles.stepRow,
    stepNumberContainer: styles.stepNumberContainer,
    stepNumber: styles.stepNumber,
    stepText: styles.stepText,
  };

  return createAppPageStyles<OrderConfirmationStyles>({
    styles,
    primaryButtonStyles,
    secondaryButtonStyles,
    orderDetailRowStyles,
    howItWorksStepStyles,
  });
}
