/**
 * Main container for the Profile route
 */

import { type ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Trash2, Zap } from 'lucide-react-native';

import { t } from '@/i18n';
import { CustomButton } from '@/comp-lib/core/custom-button/CustomButton';
import { CustomTextField } from '@/comp-lib/core/custom-text-field/CustomTextField';
import { useStyleContext } from '@/comp-lib/styles/StyleContext';
import {
  useProfileStyles,
  type ProfileHeaderStyles,
  type ProfileStatCardStyles,
  type SavedAccountCardStyles,
} from './ProfileStyles';
import { useProfile, type ProfileData } from './ProfileFunc';
import { ProfileProps } from '@/app/(tabs)/profile';
import { type SavedGameAccountV1 } from '@shared/generated-db-types';

interface ProfileAvatarHeaderProps {
  profileData?: ProfileData;
  styles: ProfileHeaderStyles;
}

function ProfileAvatarHeader(props: ProfileAvatarHeaderProps): ReactNode {
  const { profileData, styles } = props;
  const nameOrEmail = (profileData?.fullName?.length ?? 0) > 0
    ? profileData?.fullName
    : profileData?.email;
  const initial = (nameOrEmail ?? '?').charAt(0).toUpperCase();
  const displayName = nameOrEmail ?? '';

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {profileData?.avatarUrl ? (
          <Image source={{ uri: profileData.avatarUrl }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <CustomTextField styles={styles.avatarPlaceholderText} title={initial} />
          </View>
        )}
      </View>
      {displayName.length > 0 && (
        <CustomTextField styles={styles.nameText} title={displayName} numberOfLines={1} />
      )}
      {profileData?.email != null && profileData.email.length > 0 && profileData.fullName.length > 0 && (
        <CustomTextField styles={styles.emailText} title={profileData.email} numberOfLines={1} />
      )}
    </View>
  );
}

interface SavedAccountCardProps {
  account: SavedGameAccountV1;
  onTopUp: (account: SavedGameAccountV1) => void;
  onDelete: (id: any) => void;
  styles: SavedAccountCardStyles;
  deleteIconColor: string;
}

function SavedAccountCard(props: SavedAccountCardProps): ReactNode {
  const { account, onTopUp, onDelete, styles, deleteIconColor } = props;
  const game = account.game!;
  const initial = game.name.charAt(0).toUpperCase();
  const hasServer = (account.server?.length ?? 0) > 0;

  return (
    <View style={styles.container}>
      <View style={styles.gameIconWrapper}>
        {game.iconUrl.length > 0 ? (
          <Image source={{ uri: game.iconUrl }} style={styles.gameIcon} contentFit="cover" />
        ) : (
          <View style={styles.iconPlaceholder}>
            <CustomTextField styles={styles.iconPlaceholderText} title={initial} />
          </View>
        )}
      </View>

      <View style={styles.infoColumn}>
        <CustomTextField styles={styles.gameName} title={game.name} numberOfLines={1} />
        <View style={styles.playerIdRow}>
          <CustomTextField styles={styles.playerIdLabel} title={t('profile.uid')} />
          <CustomTextField styles={styles.playerIdValue} title={account.playerId} numberOfLines={1} />
          {hasServer && (
            <View style={styles.serverBadge}>
              <CustomTextField styles={styles.serverBadgeText} title={account.server ?? ''} />
            </View>
          )}
        </View>
      </View>

      <CustomButton
        onPress={() => onTopUp(account)}
        title={t('profile.topUp')}
        styles={styles.topUpButton}
        leftIcon={({ size, color }) => <Zap size={size} color={color} />}
      />

      <Pressable style={styles.deleteButton} onPress={() => onDelete(account.id)}>
        <Trash2 size={16} color={deleteIconColor} />
      </Pressable>
    </View>
  );
}

interface ProfileStatsProps {
  profileData?: ProfileData;
  styles: ProfileStatCardStyles;
}

function ProfileStats(props: ProfileStatsProps): ReactNode {
  const { profileData, styles } = props;
  const ordersCount = profileData?.totalOrdersCount ?? 0;
  const totalSpent = profileData?.totalSpentInUsd ?? 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.statItem}>
          <CustomTextField styles={styles.statValue} title={ordersCount.toString()} />
          <CustomTextField styles={styles.statLabel} title={t('tabs.orders')} />
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <CustomTextField styles={styles.statValue} title={`฿${Math.round(totalSpent).toLocaleString()}`} />
          <CustomTextField styles={styles.statLabel} title={t('checkout.total')} />
        </View>
      </View>
    </View>
  );
}

export default function ProfileContainer(props: ProfileProps): ReactNode {
  const { colors } = useStyleContext();
  const {
    styles,
    headerStyles,
    statCardStyles,
    savedAccountCardStyles,
    logoutButtonStyles,
    deleteButtonStyles,
  } = useProfileStyles();
  const {
    isLoading,
    profileData,
    savedAccounts,
    onLogout,
    onDeleteAccount,
    onTopUpAccount,
    onDeleteSavedAccount,
  } = useProfile(props);

  const safeAreaProps = { edges: ['top', 'left', 'right'] as const };

  function onPressLogout(): void {
    onLogout(() => props.onNavigateToAuth());
  }

  function onPressDeleteAccount(): void {
    onDeleteAccount(() => props.onNavigateToAuth());
  }

  return (
    <SafeAreaView style={styles.safeArea} {...safeAreaProps}>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <CustomTextField styles={styles.pageTitle} title={t('tabs.profile')} />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryAccentDark} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <ProfileAvatarHeader profileData={profileData} styles={headerStyles} />

            <View style={styles.sectionContainer}>
              <ProfileStats profileData={profileData} styles={statCardStyles} />
            </View>

            {savedAccounts.length > 0 && (
              <View style={styles.sectionContainer}>
                <CustomTextField styles={styles.sectionTitle} title={t('profile.savedAccounts')} />
                {savedAccounts.map((account) => (
                  <SavedAccountCard
                    key={account.id}
                    account={account}
                    onTopUp={onTopUpAccount}
                    onDelete={onDeleteSavedAccount}
                    styles={savedAccountCardStyles}
                    deleteIconColor={colors.tertiaryForeground}
                  />
                ))}
              </View>
            )}

            <View style={styles.sectionContainer}>
              <CustomButton
                onPress={onPressLogout}
                title={t('auth.signOut')}
                styles={logoutButtonStyles}
              />
              <CustomButton
                onPress={onPressDeleteAccount}
                title={t('auth.deleteAccount')}
                styles={deleteButtonStyles}
              />
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
