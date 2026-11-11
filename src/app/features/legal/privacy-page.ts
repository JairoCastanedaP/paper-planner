import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LEGAL_EFFECTIVE_DATE, PRIVACY_VERSION, RESPONSIBLE } from '../../core/legal';

@Component({
  selector: 'app-privacy-page',
  imports: [RouterLink],
  templateUrl: './privacy-page.html',
  styleUrl: './legal-page.scss',
})
export class PrivacyPage {
  protected readonly responsible = RESPONSIBLE;
  protected readonly version = PRIVACY_VERSION;
  protected readonly effectiveDate = LEGAL_EFFECTIVE_DATE;
}
