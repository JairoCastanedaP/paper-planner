import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LEGAL_EFFECTIVE_DATE, RESPONSIBLE, TERMS_VERSION } from '../../core/legal';

@Component({
  selector: 'app-terms-page',
  imports: [RouterLink],
  templateUrl: './terms-page.html',
  styleUrl: './legal-page.scss',
})
export class TermsPage {
  protected readonly responsible = RESPONSIBLE;
  protected readonly version = TERMS_VERSION;
  protected readonly effectiveDate = LEGAL_EFFECTIVE_DATE;
}
