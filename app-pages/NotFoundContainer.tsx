/**
 * Main container for the NotFound route
 */

import { type ReactNode } from 'react';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { SearchX } from 'lucide-react-native';

import { CustomButton } from '@/comp-lib/core/custom-button/CustomButton';
import { CustomTextField } from '@/comp-lib/core/custom-text-field/CustomTextField';
import { useNotFoundStyles } from './NotFoundStyles';
import { useNotFound } from './NotFoundFunc';
import { NotFoundProps } from '@/app/+not-found';

export default function NotFoundContainer(props: NotFoundProps): ReactNode {
  const { styles, primaryButtonStyles, iconSize, iconColor } = useNotFoundStyles();
  const { errorCode, title, description, brandName, backToGamesLabel, onGoToGames } = useNotFound(props);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle} />
          <SearchX size={iconSize} color={iconColor} />
        </View>

        <CustomTextField styles={styles.brandText} title={brandName} />
        <CustomTextField styles={styles.errorCode} title={errorCode} />
        <CustomTextField styles={styles.title} title={title} />
        <CustomTextField styles={styles.description} title={description} />

        <View style={styles.buttonContainer}>
          <CustomButton
            styles={primaryButtonStyles}
            title={backToGamesLabel}
            onPress={onGoToGames}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
