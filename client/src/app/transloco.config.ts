import { provideTransloco, TranslocoModule } from '@jsverse/transloco';
import { isDevMode, inject } from '@angular/core';
import { TranslocoHttpLoader } from './transloco-loader';

export const translocoConfig = provideTransloco({
  config: {
    availableLangs: ['fr', 'en'],
    defaultLang: 'fr',
    fallbackLang: 'fr',
    reRenderOnLangChange: true,
    prodMode: !isDevMode(),
  },
  loader: TranslocoHttpLoader,
});
