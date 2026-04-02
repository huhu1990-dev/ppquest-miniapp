import { Zap, Shield, Globe, type LucideIcon } from 'lucide-react-native';

import { type TranslationKeyType } from '@/i18n/types';
import { type IndexProps } from '@/app/index';

export interface FeatureItem {
  key: string;
  Icon: LucideIcon;
  titleKey: TranslationKeyType;
  descriptionKey: TranslationKeyType;
}

const FEATURES: FeatureItem[] = [
  {
    key: 'instant',
    Icon: Zap,
    titleKey: 'welcome.features.instantTitle',
    descriptionKey: 'welcome.features.instantDescription',
  },
  {
    key: 'secure',
    Icon: Shield,
    titleKey: 'welcome.features.secureTitle',
    descriptionKey: 'welcome.features.secureDescription',
  },
  {
    key: 'games',
    Icon: Globe,
    titleKey: 'welcome.features.gamesTitle',
    descriptionKey: 'welcome.features.gamesDescription',
  },
];

export interface IndexFunc {
  features: FeatureItem[];
}

export function useIndex(props: IndexProps): IndexFunc {
  return {
    features: FEATURES,
  };
}
