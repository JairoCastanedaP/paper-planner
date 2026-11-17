import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LangSwitch } from '../lang-switch/lang-switch';
import { LEGAL_EFFECTIVE_DATE, RESPONSIBLE, TERMS_VERSION } from '../../core/legal';
import { isEn, tx } from '../../core/i18n';

@Component({
  selector: 'app-terms-page',
  imports: [RouterLink, LangSwitch],
  templateUrl: './terms-page.html',
  styleUrl: './legal-page.scss',
})
export class TermsPage {
  protected readonly tx = tx;
  protected readonly en = isEn;
  protected readonly responsible = RESPONSIBLE;
  protected readonly version = TERMS_VERSION;
  protected readonly effectiveDate = LEGAL_EFFECTIVE_DATE;
}
