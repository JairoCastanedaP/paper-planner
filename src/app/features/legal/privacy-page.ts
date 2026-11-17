import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LangSwitch } from '../lang-switch/lang-switch';
import { LEGAL_EFFECTIVE_DATE, PRIVACY_VERSION, RESPONSIBLE } from '../../core/legal';
import { isEn, tx } from '../../core/i18n';

@Component({
  selector: 'app-privacy-page',
  imports: [RouterLink, LangSwitch],
  templateUrl: './privacy-page.html',
  styleUrl: './legal-page.scss',
})
export class PrivacyPage {
  protected readonly tx = tx;
  protected readonly en = isEn;
  protected readonly responsible = RESPONSIBLE;
  protected readonly version = PRIVACY_VERSION;
  protected readonly effectiveDate = LEGAL_EFFECTIVE_DATE;
}
