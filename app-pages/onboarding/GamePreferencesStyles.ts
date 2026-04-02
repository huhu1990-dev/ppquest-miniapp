/**
 * Styling for the GamePreferences page
 */

import { ImageStyle, TextStyle, type ViewStyle } from 'react-native';

import { useStyleContext } from '@/comp-lib/styles/StyleContext';
import { CustomButtonStyles } from '@/comp-lib/core/custom-button/CustomButtonStyles';
import { CustomTextInputStyles } from '@/comp-lib/core/custom-text-input/CustomTextInputStyles';
import { useResponsiveDesign } from '@/comp-lib/styles/useResponsiveDesign';

const GRID_COLUMNS = 3;

/** Styles for the step indicator */
export interface StepIndicatorStyles {
  text: TextStyle;
}

/** Styles for the category filter pill chips */
export interface CategoryPillStyles {
  scrollContainer: ViewStyle;
  contentContainer: ViewStyle;
  pill: ViewStyle;
  pillActive: ViewStyle;
  pillText: TextStyle;
  pillTextActive: TextStyle;
}

/** Styles for individual game card in the grid */
export interface GameCardStyles {
  container: ViewStyle;
  selectedContainer: ViewStyle;
  iconContainer: ViewStyle;
  gameIcon: ImageStyle;
  iconPlaceholder: ViewStyle;
  iconPlaceholderText: TextStyle;
  infoContainer: ViewStyle;
  gameName: TextStyle;
  gameNameSelected: TextStyle;
  categoryBadge: ViewStyle;
  categoryBadgeText: TextStyle;
  checkContainer: ViewStyle;
  tagRow: ViewStyle;
  tagBadge: ViewStyle;
  tagBadgeText: TextStyle;
}

/** Styles for the empty state when no games match */
export interface EmptyStateStyles {
  container: ViewStyle;
  iconWrapper: ViewStyle;
  text: TextStyle;
  hintText: TextStyle;
}

/** Styles for the selected count indicator */
export interface SelectionCountStyles {
  container: ViewStyle;
  text: TextStyle;
}

/** Interface for base styles of the useGamePreferencesStyles hook */
export interface GamePreferencesBaseStyles {
  safeArea: ViewStyle;
  container: ViewStyle;
  headerRow: ViewStyle;
  headerSpacer: ViewStyle;
  headerCenter: ViewStyle;
  pageTitleSection: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  gridContainer: ViewStyle;
  gridContent: ViewStyle;
  gridColumnWrapper: ViewStyle;
  bottomBar: ViewStyle;
  bottomBarBorder: ViewStyle;
  loadingContainer: ViewStyle;
}

/**
 * Interface for the return value of the useGamePreferencesStyles hook
 */
export interface GamePreferencesStyles {
  styles: GamePreferencesBaseStyles;
  stepIndicatorStyles: StepIndicatorStyles;
  searchInputStyles: CustomTextInputStyles;
  categoryPillStyles: CategoryPillStyles;
  gameCardStyles: GameCardStyles;
  emptyStateStyles: EmptyStateStyles;
  selectionCountStyles: SelectionCountStyles;
  skipButtonStyles: CustomButtonStyles;
  continueButtonStyles: CustomButtonStyles;
}

export function useGamePreferencesStyles(): GamePreferencesStyles {
  const {
    colors,
    typographyPresets,
    spacingPresets,
    buttonPresets,
    textInputPresets,
    borderRadiusPresets,
    overrideStyles,
    createAppPageStyles,
  } = useStyleContext();
  const { dimensions } = useResponsiveDesign();

  const GRID_HORIZONTAL_PADDING = spacingPresets.md2;
  const GRID_GAP = spacingPresets.sm;
  const CARD_WIDTH = (dimensions.width - GRID_HORIZONTAL_PADDING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;
  const ICON_SIZE = 56;
  const ICON_RADIUS = 16;
  const CHECK_BADGE_SIZE = 22;
  const EMPTY_ICON_SIZE = 44;

  const skipButtonStyles: CustomButtonStyles = overrideStyles(buttonPresets.Tertiary, {
    container: {
      paddingHorizontal: spacingPresets.md1,
      paddingVertical: spacingPresets.xs,
    },
    text: {
      fontSize: 13,
      lineHeight: 17,
      color: colors.tertiaryForeground,
      fontFamily: typographyPresets.Label.fontFamily,
    },
  });

  const continueButtonStyles: CustomButtonStyles = overrideStyles(buttonPresets.Primary, {
    container: {
      alignSelf: 'stretch',
      borderRadius: borderRadiusPresets.components,
      paddingVertical: 14,
    },
  });

  const searchInputStyles: CustomTextInputStyles = overrideStyles(textInputPresets.DefaultInput, {
    wrapper: {
      paddingHorizontal: GRID_HORIZONTAL_PADDING,
    },
    container: {
      borderRadius: borderRadiusPresets.components,
      backgroundColor: colors.tertiaryBackground,
      borderWidth: 1,
      borderColor: colors.tertiaryBackground,
      height: 44,
    },
    input: {
      ...typographyPresets.Body,
      color: colors.primaryForeground,
      fontSize: 14,
      lineHeight: 18,
    },
    iconLeftColor: colors.tertiaryForeground,
    iconLeftSize: 18,
    placeholderTextColor: colors.tertiaryForeground,
  });

  const stepIndicatorStyles: StepIndicatorStyles = {
    text: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      fontSize: 12,
      lineHeight: 16,
      textAlign: 'center',
    },
  };

  const categoryPillStyles: CategoryPillStyles = {
    scrollContainer: {
      flexGrow: 0,
      marginTop: spacingPresets.md1,
      marginBottom: spacingPresets.sm,
    },
    contentContainer: {
      paddingHorizontal: GRID_HORIZONTAL_PADDING,
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

  const gameCardStyles: GameCardStyles = {
    container: {
      width: CARD_WIDTH,
      alignItems: 'center',
      paddingTop: spacingPresets.md1,
      paddingBottom: spacingPresets.sm,
      paddingHorizontal: spacingPresets.xs,
      borderRadius: borderRadiusPresets.components,
      backgroundColor: colors.secondaryBackground,
      borderWidth: 2,
      borderColor: colors.tertiaryBackground,
    },
    selectedContainer: {
      borderColor: colors.primaryAccentDark,
    },
    iconContainer: {
      width: ICON_SIZE,
      height: ICON_SIZE,
      borderRadius: ICON_RADIUS,
      overflow: 'hidden',
      marginBottom: spacingPresets.sm,
    },
    gameIcon: {
      width: ICON_SIZE,
      height: ICON_SIZE,
    },
    iconPlaceholder: {
      width: ICON_SIZE,
      height: ICON_SIZE,
      borderRadius: ICON_RADIUS,
      backgroundColor: colors.tertiaryBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconPlaceholderText: {
      ...typographyPresets.Title,
      color: colors.primaryAccentDark,
      fontSize: 22,
      lineHeight: 26,
    },
    infoContainer: {
      alignItems: 'center',
      gap: spacingPresets.xxs,
    },
    gameName: {
      ...typographyPresets.Caption,
      color: colors.primaryForeground,
      fontSize: 11,
      lineHeight: 15,
      textAlign: 'center',
      fontWeight: '600',
    },
    gameNameSelected: {
      color: colors.primaryAccentDark,
      fontWeight: '700',
    },
    categoryBadge: {
      paddingHorizontal: spacingPresets.xs,
      paddingVertical: 1,
      borderRadius: 6,
      backgroundColor: colors.tertiaryBackground,
    },
    categoryBadgeText: {
      ...typographyPresets.Caption,
      fontSize: 9,
      lineHeight: 13,
      color: colors.tertiaryForeground,
    },
    checkContainer: {
      position: 'absolute',
      top: spacingPresets.xs,
      right: spacingPresets.xs,
      width: CHECK_BADGE_SIZE,
      height: CHECK_BADGE_SIZE,
      borderRadius: CHECK_BADGE_SIZE / 2,
      backgroundColor: colors.primaryAccentDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tagRow: {
      flexDirection: 'row',
      gap: spacingPresets.xxs,
      marginTop: spacingPresets.xxs,
    },
    tagBadge: {
      paddingHorizontal: spacingPresets.xs,
      paddingVertical: 1,
      borderRadius: 4,
      backgroundColor: colors.tertiaryBackground,
    },
    tagBadgeText: {
      fontSize: 9,
      lineHeight: 12,
      fontWeight: '600',
      color: colors.primaryAccentDark,
    },
  };

  const emptyStateStyles: EmptyStateStyles = {
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacingPresets.xl,
      gap: spacingPresets.sm,
    },
    iconWrapper: {
      width: EMPTY_ICON_SIZE,
      height: EMPTY_ICON_SIZE,
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

  const selectionCountStyles: SelectionCountStyles = {
    container: {
      alignItems: 'center',
      paddingBottom: spacingPresets.xs,
    },
    text: {
      ...typographyPresets.Caption,
      color: colors.primaryAccentDark,
      fontWeight: '600',
      fontSize: 12,
      lineHeight: 16,
    },
  };

  const styles: GamePreferencesBaseStyles = {
    safeArea: {
      flex: 1,
      backgroundColor: colors.primaryBackground,
    },
    container: {
      flex: 1,
      flexDirection: 'column',
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: GRID_HORIZONTAL_PADDING,
      paddingTop: spacingPresets.sm,
      paddingBottom: spacingPresets.xs,
    },
    headerSpacer: {
      width: 60,
    },
    headerCenter: {
      flex: 1,
      alignItems: 'center',
    },
    pageTitleSection: {
      flexDirection: 'column',
      paddingHorizontal: GRID_HORIZONTAL_PADDING,
      gap: spacingPresets.xs,
      paddingBottom: spacingPresets.md1,
    },
    title: {
      ...typographyPresets.PageTitle,
      color: colors.primaryForeground,
    },
    subtitle: {
      ...typographyPresets.Body,
      color: colors.tertiaryForeground,
      fontSize: 14,
      lineHeight: 20,
    },
    gridContainer: {
      flex: 1,
    },
    gridContent: {
      paddingHorizontal: GRID_HORIZONTAL_PADDING,
      paddingTop: spacingPresets.sm,
      paddingBottom: spacingPresets.md2,
    },
    gridColumnWrapper: {
      gap: GRID_GAP,
      marginBottom: GRID_GAP,
    },
    bottomBar: {
      paddingHorizontal: GRID_HORIZONTAL_PADDING,
      paddingTop: spacingPresets.sm,
      paddingBottom: spacingPresets.md2,
    },
    bottomBarBorder: {
      height: 1,
      backgroundColor: colors.tertiaryBackground,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  return createAppPageStyles<GamePreferencesStyles>({
    styles,
    stepIndicatorStyles,
    searchInputStyles,
    categoryPillStyles,
    gameCardStyles,
    emptyStateStyles,
    selectionCountStyles,
    skipButtonStyles,
    continueButtonStyles,
  });
}
