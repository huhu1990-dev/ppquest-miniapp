import { type PropsWithChildren, type ReactNode } from 'react';

import { DefaultAppContextProviders } from '@/comp-lib/common/DefaultAppContextProviders';
import { TelegramProvider } from '@/comp-app/telegram/TelegramProvider';

export function AppContextProviders({ children }: PropsWithChildren): ReactNode {
  return (
    <DefaultAppContextProviders>
      <TelegramProvider>{children}</TelegramProvider>
    </DefaultAppContextProviders>
  );
}
