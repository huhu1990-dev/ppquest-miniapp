import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

// Increment this on each deploy to bust Telegram cache
const APP_VERSION = '20260327_0730';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no" />
        {/* Telegram MiniApp WebApp API */}
        <script src="https://telegram.org/js/telegram-web-app.js" />
        {/* Prevent caching */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        {/* Force cache bust on deploy — Telegram WebView caches aggressively */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var v = '${APP_VERSION}';
            var stored = localStorage.getItem('app_version');
            if (stored && stored !== v) {
              localStorage.setItem('app_version', v);
              location.reload(true);
            } else {
              localStorage.setItem('app_version', v);
            }
          })();
        `}} />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
