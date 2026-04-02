/**
 * Styling for the Profile page
 */
import { ImageStyle, ViewStyle, TextStyle } from 'react-native';

import { useStyleContext } from '@/comp-lib/styles/StyleContext';
import { CustomButtonStyles } from '@/comp-lib/core/custom-button/CustomButtonStyles';

/** Styles for the profile header / avatar area */
export interface ProfileHeaderStyles {
  container: ViewStyle;
  avatarContainer: ViewStyle;
  avatar: ImageStyle;
  avatarPlaceholder: ViewStyle;
  avatarPlaceholderText: TextStyle;
  nameText: TextStyle;
  emailText: TextStyle;
}

/** Styles for a stat card */
export interface ProfileStatCardStyles {
  container: ViewStyle;
  row: ViewStyle;
  statItem: ViewStyle;
  statValue: TextStyle;
  statLabel: TextStyle;
  divider: ViewStyle;
}

/** Styles for a menu/action row */
export interface ProfileMenuItemStyles {
  container: ViewStyle;
  iconWrapper: ViewStyle;
  label: TextStyle;
  chevron: ViewStyle;
}

/** Styles for a saved game account card */
export interface SavedAccountCardStyles {
  container: ViewStyle;
  gameIconWrapper: ViewStyle;
  gameIcon: ImageStyle;
  iconPlaceholder: ViewStyle;
  iconPlaceholderText: TextStyle;
  infoColumn: ViewStyle;
  gameName: TextStyle;
  playerIdRow: ViewStyle;
  playerIdLabel: TextStyle;
  playerIdValue: TextStyle;
  serverBadge: ViewStyle;
  serverBadgeText: TextStyle;
  topUpButton: CustomButtonStyles;
  deleteButton: ViewStyle;
}

/**
 * Interface for base styles of the useProfileStyles hook
 */
export interface ProfileBaseStyles {
  safeArea: ViewStyle;
  container: ViewStyle;
  scrollContent: ViewStyle;
  headerSection: ViewStyle;
  pageTitle: TextStyle;
  sectionContainer: ViewStyle;
  sectionTitle: TextStyle;
  loadingContainer: ViewStyle;
}

/**
 * Interface for the return value of the useProfileStyles hook
 */
export interface ProfileStyles {
  styles: ProfileBaseStyles;
  headerStyles: ProfileHeaderStyles;
  statCardStyles: ProfileStatCardStyles;
  menuItemStyles: ProfileMenuItemStyles;
  savedAccountCardStyles: SavedAccountCardStyles;
  logoutButtonStyles: CustomButtonStyles;
  deleteButtonStyles: CustomButtonStyles;
}

/**
 * Custom hook that provides styles for the Profile component
 */
export function useProfileStyles(): ProfileStyles {
  const { createAppPageStyles, colors, typographyPresets, buttonPresets, spacingPresets, borderRadiusPresets, overrideStyles } =
    useStyleContext();

  const HORIZONTAL_PADDING = spacingPresets.md2;
  const AVATAR_SIZE = 72;

  const styles: ProfileBaseStyles = {
    safeArea: {
      flex: 1,
      backgroundColor: colors.primaryBackground,
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: spacingPresets.lg2,
    },
    headerSection: {
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingTop: spacingPresets.md1,
      paddingBottom: spacingPresets.sm,
    },
    pageTitle: {
      ...typographyPresets.PageTitle,
      color: colors.primaryForeground,
    },
    sectionContainer: {
      paddingHorizontal: HORIZONTAL_PADDING,
      marginTop: spacingPresets.md2,
      gap: spacingPresets.md1,
    },
    sectionTitle: {
      ...typographyPresets.Label,
      color: colors.tertiaryForeground,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacingPresets.xl,
    },
  };

  const headerStyles: ProfileHeaderStyles = {
    container: {
      alignItems: 'center',
      paddingVertical: spacingPresets.lg1,
      paddingHorizontal: HORIZONTAL_PADDING,
      gap: spacingPresets.sm,
    },
    avatarContainer: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: AVATAR_SIZE / 2,
      overflow: 'hidden',
    },
    avatar: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
    },
    avatarPlaceholder: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: AVATAR_SIZE / 2,
      backgroundColor: colors.primaryAccentDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarPlaceholderText: {
      ...typographyPresets.Title,
      color: colors.primaryAccentForeground,
      fontSize: 28,
      lineHeight: 34,
    },
    nameText: {
      ...typographyPresets.Title,
      color: colors.primaryForeground,
      fontSize: 20,
      lineHeight: 26,
      fontWeight: '700',
      textAlign: 'center',
    },
    emailText: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      fontSize: 13,
      lineHeight: 17,
      textAlign: 'center',
    },
  };

  const statCardStyles: ProfileStatCardStyles = {
    container: {
      padding: spacingPresets.md2,
      borderRadius: borderRadiusPresets.components,
      backgroundColor: colors.secondaryBackground,
      borderWidth: 1,
      borderColor: colors.tertiaryBackground,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
      gap: spacingPresets.xxs,
    },
    statValue: {
      ...typographyPresets.Title,
      color: colors.primaryAccentDark,
      fontSize: 20,
      lineHeight: 26,
      fontWeight: '700',
    },
    statLabel: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      fontSize: 11,
      lineHeight: 15,
    },
    divider: {
      width: 1,
      height: 36,
      backgroundColor: colors.tertiaryBackground,
    },
  };

  const menuItemStyles: ProfileMenuItemStyles = {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacingPresets.md2,
      paddingHorizontal: spacingPresets.md2,
      borderRadius: borderRadiusPresets.components,
      backgroundColor: colors.secondaryBackground,
      borderWidth: 1,
      borderColor: colors.tertiaryBackground,
    },
    iconWrapper: {
      width: 24,
      height: 24,
      marginRight: spacingPresets.md1,
    },
    label: {
      ...typographyPresets.Body,
      color: colors.primaryForeground,
      flex: 1,
      fontSize: 15,
      lineHeight: 19,
    },
    chevron: {
      width: 20,
      height: 20,
    },
  };

  const GAME_ICON_SIZE = 44;

  const savedAccountCardStyles: SavedAccountCardStyles = {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacingPresets.md2,
      borderRadius: borderRadiusPresets.components,
      backgroundColor: colors.secondaryBackground,
      borderWidth: 1,
      borderColor: colors.tertiaryBackground,
      gap: spacingPresets.md1,
    },
    gameIconWrapper: {
      width: GAME_ICON_SIZE,
      height: GAME_ICON_SIZE,
      borderRadius: borderRadiusPresets.inputElements,
      overflow: 'hidden',
    },
    gameIcon: {
      width: GAME_ICON_SIZE,
      height: GAME_ICON_SIZE,
    },
    iconPlaceholder: {
      width: GAME_ICON_SIZE,
      height: GAME_ICON_SIZE,
      borderRadius: borderRadiusPresets.inputElements,
      backgroundColor: colors.primaryAccentLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconPlaceholderText: {
      ...typographyPresets.Label,
      color: colors.primaryAccentDark,
      fontSize: 18,
      lineHeight: 22,
      fontWeight: '700',
    },
    infoColumn: {
      flex: 1,
      gap: spacingPresets.xxs,
    },
    gameName: {
      ...typographyPresets.Body,
      color: colors.primaryForeground,
      fontWeight: '600',
      fontSize: 14,
      lineHeight: 18,
    },
    playerIdRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacingPresets.xs,
    },
    playerIdLabel: {
      ...typographyPresets.Caption,
      color: colors.tertiaryForeground,
      fontSize: 11,
      lineHeight: 15,
    },
    playerIdValue: {
      ...typographyPresets.Caption,
      color: colors.secondaryForeground,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500',
    },
    serverBadge: {
      backgroundColor: colors.primaryAccentLight,
      borderRadius: 4,
      paddingHorizontal: spacingPresets.xs,
      paddingVertical: 2,
    },
    serverBadgeText: {
      ...typographyPresets.Caption,
      color: colors.primaryAccentDark,
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '600',
    },
    topUpButton: overrideStyles(buttonPresets.Primary, {
      container: {
        paddingHorizontal: spacingPresets.md1,
        paddingVertical: spacingPresets.sm,
        minWidth: 72,
      },
      text: {
        fontSize: 12,
        lineHeight: 16,
      },
    }),
    deleteButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  const logoutButtonStyles: CustomButtonStyles = overrideStyles(buttonPresets.Secondary, {
    container: {
      width: '100%',
    },
  });

  const deleteButtonStyles: CustomButtonStyles = overrideStyles(buttonPresets.Tertiary, {
    text: {
      color: colors.primaryForeground,
    },
    container: {
      width: '100%',
    },
  });

  return createAppPageStyles<ProfileStyles>({
    styles,
    headerStyles,
    statCardStyles,
    menuItemStyles,
    savedAccountCardStyles,
    logoutButtonStyles,
    deleteButtonStyles,
  });
}
