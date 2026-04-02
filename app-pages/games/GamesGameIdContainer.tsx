/**
 * Main container for the GamesGameId route — Game detail page with top-up packages
 */

import { type ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ArrowLeft, Check, Package, ShoppingCart } from 'lucide-react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { t } from '@/i18n';
import { CustomTextField } from '@/comp-lib/core/custom-text-field/CustomTextField';
import { CustomTextInput } from '@/comp-lib/core/custom-text-input/CustomTextInput';
import { CustomButton } from '@/comp-lib/core/custom-button/CustomButton';
import { useStyleContext } from '@/comp-lib/styles/StyleContext';
import {
  useGamesGameIdStyles,
  type GameDetailBannerStyles,
  type GameDetailPackageTypePillStyles,
  type GameDetailPackageCardStyles,
  type GameDetailPlayerInfoStyles,
  type GameDetailCheckoutBarStyles,
  type GameDetailEmptyStyles,
  type GameDetailErrorStyles,
} from './GamesGameIdStyles';
import {
  useGamesGameId,
  computeDiscountPercent,
  type PackageTypeFilter,
  type PackageTypeOption,
} from './GamesGameIdFunc';
import { GamesGameIdProps } from '@/app/games/[gameId]';
import { type GameV1, type PackageV1, type uuidstr } from '@shared/generated-db-types';
import { type CustomButtonStyles } from '@/comp-lib/core/custom-button/CustomButtonStyles';
import { type CustomTextInputStyles } from '@/comp-lib/core/custom-text-input/CustomTextInputStyles';

interface HeroBannerProps {
  game: GameV1;
  onGoBack: () => void;
  styles: GameDetailBannerStyles;
  topInset: number;
}

function HeroBanner(props: HeroBannerProps): ReactNode {
  const { game, onGoBack, styles, topInset } = props;
  const initial = game.name.charAt(0).toUpperCase();

  return (
    <View style={styles.bannerContainer}>
      {game.bannerUrl ? (
        <Image source={{ uri: game.bannerUrl }} style={styles.bannerImage} contentFit="cover" />
      ) : (
        <View style={styles.bannerImage} />
      )}
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
        locations={[0, 0.4, 1]}
        style={styles.bannerOverlay}
      >
        <Pressable onPress={onGoBack} style={[styles.backButton, { marginTop: topInset + 8 }]}>
          <View style={styles.backIconWrapper}>
            <ArrowLeft size={22} color="#FFFFFF" />
          </View>
        </Pressable>
        <View style={styles.gameInfoRow}>
          <View style={styles.gameIconContainer}>
            {game.iconUrl ? (
              <Image source={{ uri: game.iconUrl }} style={styles.gameIcon} contentFit="cover" />
            ) : (
              <View style={styles.iconPlaceholder}>
                <CustomTextField styles={styles.iconPlaceholderText} title={initial} />
              </View>
            )}
          </View>
          <View style={styles.gameTextContainer}>
            <CustomTextField styles={styles.gameName} title={game.name} numberOfLines={1} />
            {game.description != null && game.description.length > 0 && (
              <CustomTextField styles={styles.gameDescription} title={game.description} numberOfLines={2} />
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

interface PackageTypePillBarProps {
  options: readonly PackageTypeOption[];
  activeType: PackageTypeFilter;
  onTypeChange: (type: PackageTypeFilter) => void;
  styles: GameDetailPackageTypePillStyles;
}

function PackageTypePillBar(props: PackageTypePillBarProps): ReactNode {
  const { options, activeType, onTypeChange, styles } = props;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
    >
      {options.map((option) => {
        const isActive = option.value === activeType;
        return (
          <Pressable key={option.value} onPress={() => onTypeChange(option.value)}>
            <View style={[styles.pill, isActive ? styles.pillActive : undefined]}>
              <CustomTextField
                styles={[styles.pillText, isActive ? styles.pillTextActive : undefined]}
                title={t(option.labelKey as Parameters<typeof t>[0])}
              />
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

interface PackageCardProps {
  pkg: PackageV1;
  isSelected: boolean;
  onSelect: (id: uuidstr) => void;
  styles: GameDetailPackageCardStyles;
}

function PackageCard(props: PackageCardProps): ReactNode {
  const { pkg, isSelected, onSelect, styles } = props;
  const hasPromo = pkg.isPromotion && pkg.promotionText != null;
  const hasOriginalPrice = pkg.originalPriceInUsd != null && pkg.originalPriceInUsd > pkg.priceInUsd;
  const discountPercent = hasOriginalPrice
    ? computeDiscountPercent(pkg.originalPriceInUsd ?? 0, pkg.priceInUsd)
    : 0;
  const quantityLabel = pkg.quantity != null && pkg.quantity > 1
    ? t('gameDetail.qty', { quantity: String(pkg.quantity) })
    : undefined;

  return (
    <Pressable onPress={() => onSelect(pkg.id)}>
      <Animated.View
        entering={FadeIn.duration(200)}
        style={[styles.container, isSelected ? styles.containerSelected : undefined]}
      >
        {hasPromo && (
          <View style={styles.promoBadge}>
            <CustomTextField styles={styles.promoBadgeText} title={pkg.promotionText ?? ''} />
          </View>
        )}
        <CustomTextField styles={styles.nameText} title={pkg.name} numberOfLines={2} />
        {quantityLabel != null && (
          <CustomTextField styles={styles.quantityText} title={quantityLabel} />
        )}
        <View style={styles.priceRow}>
          <CustomTextField styles={styles.priceText} title={`฿${Math.round(pkg.priceInUsd).toLocaleString()}`} />
          {hasOriginalPrice && (
            <CustomTextField
              styles={styles.originalPriceText}
              title={`฿${Math.round(pkg.originalPriceInUsd ?? 0).toLocaleString()}`}
            />
          )}
          {discountPercent > 0 && (
            <CustomTextField
              styles={styles.discountText}
              title={t('gameDetail.off', { percent: String(discountPercent) })}
            />
          )}
        </View>
        {isSelected && (
          <View style={styles.checkmarkContainer}>
            <Check size={14} color="#FFFFFF" />
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

interface PlayerInfoSectionProps {
  game: GameV1;
  playerId: string;
  playerIdError?: string;
  selectedServer: string;
  onPlayerIdChange: (text: string) => void;
  onServerChange: (server: string) => void;
  styles: GameDetailPlayerInfoStyles;
  inputStyles: CustomTextInputStyles;
}

function PlayerInfoSection(props: PlayerInfoSectionProps): ReactNode {
  const { game, playerId, playerIdError, selectedServer, onPlayerIdChange, onServerChange, styles, inputStyles } = props;

  return (
    <View style={styles.container}>
      {game.requiresPlayerId && (
        <>
          <CustomTextField
            styles={styles.sectionTitle}
            title={game.playerIdLabel ?? t('gameDetail.playerIdLabel')}
          />
          <CustomTextInput
            styles={inputStyles}
            placeholder={t('gameDetail.playerIdPlaceholder')}
            value={playerId}
            onChangeText={onPlayerIdChange}
            errorText={playerIdError != null ? t(playerIdError as Parameters<typeof t>[0]) : undefined}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
          />
          {game.playerIdHelp != null && game.playerIdHelp.length > 0 && (
            <CustomTextField styles={styles.helpText} title={game.playerIdHelp} />
          )}
        </>
      )}

      {game.requiresServer && game.servers != null && game.servers.length > 0 && (
        <View style={styles.serverPickerContainer}>
          <CustomTextField styles={styles.sectionTitle} title={t('gameDetail.serverLabel')} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.serverScrollContainer}
            contentContainerStyle={styles.serverScrollContent}
          >
            {game.servers.map((server) => {
              const isActive = server === selectedServer;
              return (
                <Pressable key={server} onPress={() => onServerChange(server)}>
                  <View style={[styles.serverPill, isActive ? styles.serverPillActive : undefined]}>
                    <CustomTextField
                      styles={[styles.serverPillText, isActive ? styles.serverPillTextActive : undefined]}
                      title={server}
                    />
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

interface CheckoutBarProps {
  selectedPackagePrice: number;
  canCheckout: boolean;
  hasSelection: boolean;
  onCheckout: () => void;
  styles: GameDetailCheckoutBarStyles;
  buttonStyles: CustomButtonStyles;
}

function CheckoutBar(props: CheckoutBarProps): ReactNode {
  const { selectedPackagePrice, canCheckout, hasSelection, onCheckout, styles, buttonStyles } = props;

  return (
    <View style={styles.container}>
      <View style={styles.priceColumn}>
        {hasSelection ? (
          <>
            <CustomTextField styles={styles.totalLabel} title={t('gameDetail.total')} />
            <CustomTextField styles={styles.totalPrice} title={`฿${Math.round(selectedPackagePrice).toLocaleString()}`} />
          </>
        ) : (
          <CustomTextField styles={styles.selectHint} title={t('gameDetail.selectPackage')} />
        )}
      </View>
      <CustomButton
        onPress={onCheckout}
        title={t('gameDetail.checkout')}
        styles={buttonStyles}
        disabled={!canCheckout}
        leftIcon={({ size, color }) => <ShoppingCart size={size} color={color} />}
      />
    </View>
  );
}

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
  styles: GameDetailErrorStyles;
  retryButtonStyles: CustomButtonStyles;
  iconColor: string;
}

function ErrorState(props: ErrorStateProps): ReactNode {
  return (
    <View style={props.styles.container}>
      <View style={props.styles.iconWrapper}>
        <Package size={48} color={props.iconColor} />
      </View>
      <CustomTextField styles={props.styles.title} title={t('gameDetail.loadError')} />
      <CustomTextField styles={props.styles.message} title={props.error.message} numberOfLines={2} />
      <CustomButton
        onPress={props.onRetry}
        title={t('gameDetail.retry')}
        styles={props.retryButtonStyles}
      />
    </View>
  );
}

interface EmptyPackageStateProps {
  styles: GameDetailEmptyStyles;
  iconColor: string;
}

function EmptyPackageState(props: EmptyPackageStateProps): ReactNode {
  return (
    <View style={props.styles.container}>
      <View style={props.styles.iconWrapper}>
        <Package size={44} color={props.iconColor} />
      </View>
      <CustomTextField styles={props.styles.text} title={t('gameDetail.noPackages')} />
      <CustomTextField styles={props.styles.hintText} title={t('gameDetail.noPackagesHint')} />
    </View>
  );
}

export default function GamesGameIdContainer(props: GamesGameIdProps): ReactNode {
  const { colors } = useStyleContext();
  const insets = useSafeAreaInsets();
  const {
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
  } = useGamesGameIdStyles();
  const {
    isLoading,
    error,
    game,
    filteredPackages,
    activePackageType,
    packageTypeOptions,
    selectedPackageId,
    playerId,
    playerIdError,
    selectedServer,
    canCheckout,
    selectedPackagePrice,
    onPackageTypeChange,
    onSelectPackage,
    onPlayerIdChange,
    onServerChange,
    onProceedToCheckout,
    onRetry,
  } = useGamesGameId(props);

  if (isLoading) {
    return (
      <View style={[styles.safeArea, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primaryAccentDark} />
      </View>
    );
  }

  if (error != null && game == null) {
    return (
      <View style={[styles.safeArea, styles.loadingContainer]}>
        <ErrorState
          error={error}
          onRetry={onRetry}
          styles={errorStyles}
          retryButtonStyles={retryButtonStyles}
          iconColor={colors.tertiaryForeground}
        />
      </View>
    );
  }

  if (game == null) {
    return (
      <View style={[styles.safeArea, styles.loadingContainer]}>
        <EmptyPackageState styles={emptyStyles} iconColor={colors.tertiaryForeground} />
      </View>
    );
  }

  const hasSelection = selectedPackageId != null;
  const showPlayerInfo = game.requiresPlayerId || game.requiresServer;

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero banner with game info */}
          <HeroBanner
            game={game}
            onGoBack={props.onGoBack}
            styles={bannerStyles}
            topInset={insets.top}
          />

          {/* Package type filter pills */}
          <PackageTypePillBar
            options={packageTypeOptions}
            activeType={activePackageType}
            onTypeChange={onPackageTypeChange}
            styles={packageTypePillStyles}
          />

          {/* Package grid */}
          {filteredPackages.length > 0 ? (
            <View style={styles.sectionContainer}>
              <CustomTextField styles={styles.sectionTitle} title={t('gameDetail.packages')} />
              <View style={styles.gridContainer}>
                {filteredPackages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    isSelected={pkg.id === selectedPackageId}
                    onSelect={onSelectPackage}
                    styles={packageCardStyles}
                  />
                ))}
              </View>
            </View>
          ) : (
            <EmptyPackageState styles={emptyStyles} iconColor={colors.tertiaryForeground} />
          )}

          {/* Player ID and server input */}
          {showPlayerInfo && (
            <PlayerInfoSection
              game={game}
              playerId={playerId}
              playerIdError={playerIdError}
              selectedServer={selectedServer}
              onPlayerIdChange={onPlayerIdChange}
              onServerChange={onServerChange}
              styles={playerInfoStyles}
              inputStyles={playerIdInputStyles}
            />
          )}
        </ScrollView>

        {/* Bottom checkout bar */}
        <View style={{ paddingBottom: insets.bottom, backgroundColor: colors.secondaryBackground }}>
          <CheckoutBar
            selectedPackagePrice={selectedPackagePrice}
            canCheckout={canCheckout}
            hasSelection={hasSelection}
            onCheckout={onProceedToCheckout}
            styles={checkoutBarStyles}
            buttonStyles={checkoutButtonStyles}
          />
        </View>
      </View>
    </View>
  );
}
