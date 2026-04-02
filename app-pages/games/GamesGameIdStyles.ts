/**
 * Styling for the GamesGameId page
 */
import { ImageStyle, ViewStyle, TextStyle } from 'react-native';

import { useStyleContext } from '@/comp-lib/styles/StyleContext';
import { CustomButtonStyles } from '@/comp-lib/core/custom-button/CustomButtonStyles';
import { CustomTextInputStyles } from '@/comp-lib/core/custom-text-input/CustomTextInputStyles';
import { useResponsiveDesign } from '@/comp-lib/styles/useResponsiveDesign';

const GRID_COLUMNS = 2;
const BANNER_HEIGHT = 240;
const GAME_ICON_SIZE = 64;
const GAME_ICON_RADIUS = 18;

/** Styles for the hero banner section */
export interface GameDetailBannerStyles {
  bannerContainer: ViewStyle;
  bannerImage: ImageStyle;
  bannerOverlay: ViewStyle;
  backButton: ViewStyle;
  backIconWrapper: ViewStyle;
  gameInfoRow: ViewStyle;
  gameIconContainer: ViewStyle;
  gameIcon: ImageStyle;
  iconPlaceholder: ViewStyle;
  iconPlaceholderText: TextStyle;
  gameTextContainer: ViewStyle;
  gameName: TextStyle;
  gameDescription: TextStyle;
}

/** Styles for the package type filter pills */
export interface GameDetailPackageTypePillStyles {
  scrollContainer: ViewStyle;
  contentContainer: ViewStyle;
  pill: ViewStyle;
  pillActive: ViewStyle;
  pillText: TextStyle;
  pillTextActive: TextStyle;
}

/** Styles for a package card in the grid */
export interface GameDetailPackageCardStyles {
  container: ViewStyle;
  containerSelected: ViewStyle;
  promoBadge: ViewStyle;
  promoBadgeText: TextStyle;
  nameText: TextStyle;
  quantityText: TextStyle;
  priceRow: ViewStyle;
  priceText: TextStyle;
  originalPriceText: TextStyle;
  discountText: TextStyle;
  checkmarkContainer: ViewStyle;
}

/** Styles for the player info input section */
export interface GameDetailPlayerInfoStyles {
  container: ViewStyle;
  sectionTitle: TextStyle;
  helpText: TextStyle;
  serverPickerContainer: ViewStyle;
  serverPill: ViewStyle;
  serverPillActive: ViewStyle;
  serverPillText: TextStyle;
  serverPillTextActive: TextStyle;
  serverScrollContainer: ViewStyle;
  serverScrollContent: ViewStyle;
}

/** Styles for the bottom checkout bar */
export interface GameDetailCheckoutBarStyles {
  container: ViewStyle;
  priceColumn: ViewStyle;
  totalLabel: TextStyle;
  totalPrice: TextStyle;
  selectHint: TextStyle;
}

/** Styles for the empty/error state */
export interface GameDetailEmptyStyles {
  container: ViewStyle;
  iconWrapper: ViewStyle;
  text: TextStyle;
  hintText: TextStyle;
}

/** Styles for the error state with retry */
export interface GameDetailErrorStyles {
  container: ViewStyle;
  iconWrapper: ViewStyle;
  title: TextStyle;
  message: TextStyle;
}

/**
 * Interface for base styles of the useGamesGameIdStyles hook
 */
export interface GamesGameIdBaseStyles {
  safeArea: ViewStyle;
  container: ViewStyle;
  scrollView: ViewStyle;
  scrollContent: ViewStyle;
  sectionContainer: ViewStyle;
  sectionTitle: TextStyle;
  gridContainer: ViewStyle;
  loadingContainer: ViewStyle;
}

/**
 * Interface for the return value of the useGamesGameIdStyles hook
 */
export interface GamesGameIdStyles {
  styles: GamesGameIdBaseStyles;
  bannerStyles: GameDetailBannerStyles;
  packageTypePillStyles: GameDetailPackageTypePillStyles;
  packageCardStyles: GameDetailPackageCardStyles;
  playerInfoStyles: GameDetailPlayerInfoStyles;
  playerIdInputStyles: CustomTextInputStyles;
  checkoutBarStyles: GameDetailCheckoutBarStyles;
  checkoutButtonStyles: CustomButtonStyles;
  emptyStyles: GameDetailEmptyStyles;
  errorStyles: GameDetailErrorStyles;
  retryButtonStyles: CustomButtonStyles;
}

/**
 * Custom hook that provides styles for the GamesGameId component
 */
export function useGamesGameIdStyles(): GamesGameIdStyles {
  const {
    createAppPageStyles,
    colors,
    typographyPresets,
    spacingPresets,
    buttonPresets,
    textInputPresets,
    borderRadiusPresets,
    overrideStyles,
  } = useStyleContext();
  const { dimensions } = useResponsiveDesign();

  const HORIZONTAL_PADDING = spacingPresets.md2;
  const GRID_GAP = spacingPresets.md1;
  const CARD_WIDTH = (dimensions.width - HORIZONTAL_PADDING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

  const styles: GamesGameIdBaseStyles = {
    safeArea: {
      flex: 1,
      backgroundColor: colors.primaryBackground,
    },
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: spacingPresets.xxxl,
    },
    sectionContainer: {
      paddingHorizontal: HORIZONTAL_PADDING,
      marginTop: spacingPresets.lg1,
    },
    sectionTitle: {
      ...typographyPresets.Subtitle,
      color: colors.primaryForeground,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '700',
      marginBottom: spacingPresets.md1,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: GRID_GAP,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacingPresets.xl,
    },
  };

  const bannerStyles: GameDetailBannerStyles = {
    bannerContainer: {
      height: BANNER_HEIGHT,
      width: '100%',
      backgroundColor: colors.tertiaryBackground,
    },
    bannerImage: {
      width: '100%',
      height: BANNER_HEIGHT,
    },
    bannerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'space-between',
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(0,0,0,0.35)',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: HORIZONTAL_PADDING,
    },
    backIconWrapper: {
      width: 22,
      height: 22,
    },
    gameInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingBottom: spacingPresets.lg1,
      gap: spacingPresets.md1,
    },
    gameIconContainer: {
      width: GAME_ICON_SIZE,
      height: GAME_ICON_SIZE,
      borderRadius: GAME_ICON_RADIUS,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.7)',
    },
    gameIcon: {
      width: GAME_ICON_SIZE,
      height: GAME_ICON_SIZE,
    },
    iconPlaceholder: {
      width: GAME_ICON_SIZE,
      height: GAME_ICON_SIZE,
      borderRadius: GAME_ICON_RADIUS,
      backgroundColor: colors.primaryAccentDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconPlaceholderText: {
      ...typographyPresets.Title,
      color: '#FFFFFF',
      fontSize: 24,
      lineHeight: 28,
      fontWeight: '700',
    },
    gameTextContainer: {
      flex: 1,
    },
    gameName: {
      ...typographyPresets.Title,
      color: '#FFFFFF',
      fontSize: 24,
      lineHeight: 30,
      fontWeight: '800',
    },
    gameDescription: {
      ...typographyPresets.Caption,
      color: 'rgba(255,255,255,0.9)',
      fontSize: 13,
      lineHeight: 18,
      marginTop: spacingPresets.xxs,
    },
  };

  const packageTypePillStyles: GameDetailPackageTypePillStyles = {
    scrollContainer: {
      flexGrow: 0,
      marginTop: spacingPresets.md2,
    },
    contentContainer: {
      paddingHorizontal: HORIZONTAL_PADDING,
      gap: spacingPresets.sm,
    },
    pill: {
      paddingHorizontal: spacingPresets.md2,
      paddingVertical: spacingPresets.sm,
      borderRadius: 20,
      backgroundColor: colors.tertiaryBackground,
      borderWidth: 1.5,
      borderColor: colors.tertiaryBackground,
    },
    pillActive: {
      backgroundColor: colors.primaryAccentDark,
      borderColor: colors.primaryAccentDark,
    },
    pillText: {
      ...typographyPresets.Label,
      color: colors.secondaryForeground,
      fontSize: 13,
      lineHeight: 17,
      fontWeight: '500',
    },
    pillTextActive: {
      color: colors.primaryAccentForeground,
      fontWeight: '600',
    },
  };

  const packageCardStyles: GameDetailPackageCardStyles = {
    container: {
      width: CARD_WIDTH,
      padding: spacingPresets.md1,
      borderRadius: borderRadiusPresets.components,
      backgroundColor: colors.secondaryBackground,
      borderWidth: 1.5,
      borderColor: colors.tertiaryBackground,
      gap: spacingPresets.xs,
      minHeight: 110,
    },
    containerSelected: {
      borderColor: colors.primaryAccentDark,
      borderWidth: 2,
      backgroundColor: colors.tertiaryBackground,
    },
    promoBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: spacingPresets.sm,
      paddingVertical: spacingPresets.xxs,
      borderRadius: 8,
      backgroundColor: colors.primaryAccentDark,
      marginBottom: spacingPresets.xxs,
    },
    promoBadgeText: {
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '700',
      color: colors.primaryAccentForeground,
    },
    nameText: {
      ...typographyPresets.Label,
      color: colors.primaryForeground,
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '600',
    },
    quantityText: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      fontSize: 11,
      lineHeight: 15,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: spacingPresets.xs,
      marginTop: spacingPresets.xs,
    },
    priceText: {
      ...typographyPresets.Label,
      color: colors.primaryAccentDark,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '700',
    },
    originalPriceText: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      fontSize: 11,
      lineHeight: 15,
      textDecorationLine: 'line-through',
    },
    discountText: {
      ...typographyPresets.Caption,
      color: colors.primaryAccentDark,
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '700',
    },
    checkmarkContainer: {
      position: 'absolute',
      top: spacingPresets.sm,
      right: spacingPresets.sm,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primaryAccentDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  const playerInfoStyles: GameDetailPlayerInfoStyles = {
    container: {
      paddingHorizontal: HORIZONTAL_PADDING,
      marginTop: spacingPresets.lg1,
      gap: spacingPresets.md1,
    },
    sectionTitle: {
      ...typographyPresets.Subtitle,
      color: colors.primaryForeground,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '700',
    },
    helpText: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      fontSize: 12,
      lineHeight: 16,
    },
    serverPickerContainer: {
      gap: spacingPresets.sm,
    },
    serverPill: {
      paddingHorizontal: spacingPresets.md1,
      paddingVertical: spacingPresets.sm,
      borderRadius: borderRadiusPresets.inputElements,
      backgroundColor: colors.tertiaryBackground,
      borderWidth: 1.5,
      borderColor: colors.tertiaryBackground,
    },
    serverPillActive: {
      borderColor: colors.primaryAccentDark,
      backgroundColor: colors.tertiaryBackground,
    },
    serverPillText: {
      ...typographyPresets.Label,
      color: colors.secondaryForeground,
      fontSize: 13,
      lineHeight: 17,
    },
    serverPillTextActive: {
      color: colors.primaryAccentDark,
      fontWeight: '700',
    },
    serverScrollContainer: {
      flexGrow: 0,
    },
    serverScrollContent: {
      gap: spacingPresets.sm,
    },
  };

  const playerIdInputStyles: CustomTextInputStyles = overrideStyles(textInputPresets.DefaultInput, {
    container: {
      borderRadius: borderRadiusPresets.inputElements,
      backgroundColor: colors.tertiaryBackground,
      borderWidth: 1,
      borderColor: colors.tertiaryBackground,
      height: 46,
    },
    input: {
      ...typographyPresets.Body,
      color: colors.primaryForeground,
      fontSize: 14,
      lineHeight: 18,
    },
    placeholderTextColor: colors.tertiaryForeground,
    error: {
      borderColor: colors.customColors.error,
    },
    errorText: {
      ...typographyPresets.Caption,
      color: colors.customColors.error,
      fontSize: 12,
      lineHeight: 16,
    },
  });

  const checkoutBarStyles: GameDetailCheckoutBarStyles = {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingTop: spacingPresets.md1,
      paddingBottom: spacingPresets.md2,
      backgroundColor: colors.secondaryBackground,
      borderTopWidth: 1.5,
      borderTopColor: colors.tertiaryBackground,
      gap: spacingPresets.md2,
    },
    priceColumn: {
      flex: 1,
    },
    totalLabel: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      fontSize: 11,
      lineHeight: 15,
    },
    totalPrice: {
      ...typographyPresets.Title,
      color: colors.primaryAccentDark,
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '800',
    },
    selectHint: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      fontSize: 13,
      lineHeight: 17,
    },
  };

  const checkoutButtonStyles: CustomButtonStyles = overrideStyles(buttonPresets.Primary, {
    container: {
      paddingHorizontal: spacingPresets.lg2,
      paddingVertical: spacingPresets.md1,
      borderRadius: borderRadiusPresets.components,
    },
  });

  const emptyStyles: GameDetailEmptyStyles = {
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacingPresets.xl,
      gap: spacingPresets.sm,
    },
    iconWrapper: {
      width: 44,
      height: 44,
    },
    text: {
      ...typographyPresets.Subtitle,
      color: colors.secondaryForeground,
      textAlign: 'center',
      fontWeight: '600',
    },
    hintText: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      textAlign: 'center',
    },
  };

  const errorStyles: GameDetailErrorStyles = {
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingVertical: spacingPresets.xl,
      gap: spacingPresets.md1,
    },
    iconWrapper: {
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      ...typographyPresets.Subtitle,
      color: colors.primaryForeground,
      textAlign: 'center',
      fontWeight: '600',
    },
    message: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      textAlign: 'center',
    },
  };

  const retryButtonStyles: CustomButtonStyles = overrideStyles(buttonPresets.Secondary, {
    container: {
      paddingHorizontal: spacingPresets.lg1,
      paddingVertical: spacingPresets.sm,
      borderRadius: borderRadiusPresets.inputElements,
    },
  });

  return createAppPageStyles<GamesGameIdStyles>({
    styles,
    bannerStyles,
    packageTypePillStyles,
    packageCardStyles,
    playerInfoStyles,
    playerIdInputStyles,
    checkoutBarStyles,
    checkoutButtonStyles,
    emptyStyles,
    errorStyles,
    retryButtonStyles,
  });
}
