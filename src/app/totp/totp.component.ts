import { Clipboard } from '@angular/cdk/clipboard';
import { Component, } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import TotpGenerator from 'totp-generator';

@Component({
  selector: 'app-totp',
  templateUrl: './totp.component.html',
  styleUrls: ['./totp.component.scss'],
})
export class TotpComponent {
  totpFormGroup = this._formBuilder.group({
    totpKey: ['', Validators.required],
  });
  totp = '';
  hideTotpKey = true;

  constructor(
    private clipboard: Clipboard,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder
  ) {}

  getTotp() {
    if (this.totpFormGroup.invalid) {
      console.error(this.totpFormGroup.errors);
      return;
    }
    const totpKey = this.totpFormGroup.get('totpKey')?.value;
    if (!totpKey) {
      return;
    }
    try {
      this.totp = TotpGenerator(totpKey);
    } catch (error: any) {
      this._snackBar.open(error.message ?? 'Something went wrong', '', {
        duration: 1000,
      });
    }
  }

  copyTotp() {
    const successfullyCopied = this.clipboard.copy(this.totp);
    if (successfullyCopied) {
      this._snackBar.open('TOTP copied to clipboard', '', { duration: 1000 });
    } else {
      this._snackBar.open('Copy failed. Please try again!', '', {
        duration: 1000,
      });
    }
  }
}
