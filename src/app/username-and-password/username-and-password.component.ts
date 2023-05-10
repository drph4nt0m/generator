import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { generateUsername } from 'friendly-username-generator';
import {
  generate as generatePassword,
  GenerateOptions as PasswordSettings,
} from 'generate-password';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators } from '@angular/forms';
import { Options as UsernameSettings } from 'friendly-username-generator/build/generateUsername';

type Credential = { username: string; password: string };

@Component({
  selector: 'app-username-and-password',
  templateUrl: './username-and-password.component.html',
  styleUrls: ['./username-and-password.component.scss'],
})
export class UsernameAndPasswordComponent implements OnInit {
  settingsFormGroup = this._formBuilder.group({
    numberOfCreds: [
      5,
      [Validators.required, Validators.min(1), Validators.max(50)],
    ],
    usernameSettings: this._formBuilder.group({
      useHyphen: [false, Validators.required],
      useRandomNumber: [false, Validators.required],
    }),
    passwordSettings: this._formBuilder.group({
      length: [
        10,
        [Validators.required, Validators.min(8), Validators.max(50)],
      ],
      numbers: [true],
      symbols: [false],
      lowercase: [true],
      uppercase: [true],
      excludeSimilarCharacters: [false],
      strict: [true],
    }),
  });

  credentials: MatTableDataSource<Credential>;
  displayedColumns: string[] = ['select', 'username', 'password', 'actions'];
  selection = new SelectionModel<Credential>(true, []);

  constructor(
    private clipboard: Clipboard,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder
  ) {}

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.credentials.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.credentials.data);
  }

  ngOnInit() {
    this.generate();
  }

  generate(index = -1, toGenerate: 'username' | 'password' | 'both' = 'both', isNew: boolean = true): void {
    if (this.settingsFormGroup.invalid) {
      console.error(this.settingsFormGroup.errors);
      return;
    }

    const settings = this.settingsFormGroup.getRawValue();

    const usernameSettings: UsernameSettings = {
      useHyphen: settings.usernameSettings.useHyphen ?? false,
      useRandomNumber: settings.usernameSettings.useRandomNumber ?? false,
    };

    const passwordSettings: PasswordSettings = {
      length: settings.passwordSettings.length ?? 10,
      numbers: settings.passwordSettings.numbers ?? true,
      symbols: settings.passwordSettings.symbols ?? false,
      lowercase: settings.passwordSettings.lowercase ?? true,
      uppercase: settings.passwordSettings.uppercase ?? true,
      excludeSimilarCharacters:
        settings.passwordSettings.excludeSimilarCharacters ?? false,
      strict: settings.passwordSettings.strict ?? true,
    };

    if (isNew) {
      const numberOfCreds = settings.numberOfCreds ?? 5;

      const credentials: Credential[] = [];

      for (let i = 0; i < numberOfCreds; i++) {
        credentials.push({
          username: this.generateUsername(usernameSettings),
          password: this.generatePassword(passwordSettings),
        });
      }

      this.credentials = new MatTableDataSource(credentials);

      this.selection.clear();
      this.toggleAllRows();
    } else {
      const newCredentials = this.credentials.data;
      const selectedIndexes = this.selection.selected.map((oldCredential) => this.credentials.data.findIndex((cred) => cred.username === oldCredential.username && cred.password === oldCredential.password));

      if(index === -1) {
        this.selection.selected.forEach((oldCredential) => {
          const _index = this.credentials.data.findIndex((cred) => cred.username === oldCredential.username && cred.password === oldCredential.password)
          const newCredential = {...oldCredential}

          switch (toGenerate) {
            case 'username':
              newCredential.username = this.generateUsername(usernameSettings)
              break;
            case 'password':
              newCredential.password = this.generatePassword(passwordSettings)
              break;
            case 'both':
              newCredential.username = this.generateUsername(usernameSettings)
              newCredential.password = this.generatePassword(passwordSettings)
              break;
          }

          newCredentials.splice(_index, 1, newCredential);
        })
      } else {
        const newCredential = {...this.credentials.data[index]}

        switch (toGenerate) {
          case 'username':
            newCredential.username = this.generateUsername(usernameSettings)
            break;
          case 'password':
            newCredential.password = this.generatePassword(passwordSettings)
            break;
          case 'both':
            newCredential.username = this.generateUsername(usernameSettings)
            newCredential.password = this.generatePassword(passwordSettings)
            break;
        }

        newCredentials.splice(index, 1, newCredential);
      }

      this.credentials = new MatTableDataSource(newCredentials);
      const toSelect = this.credentials.data.filter((credential, credentialIndex) => selectedIndexes.includes(credentialIndex))
      this.selection.setSelection(...toSelect);
    }
  }

  generateUsername(usernameSettings: UsernameSettings) {
    return generateUsername(usernameSettings);
  }

  generatePassword(passwordSettings: PasswordSettings) {
    return generatePassword(passwordSettings);
  }

  copyCredentials(
    index = -1,
    toCopy: 'username' | 'password' | 'both' = 'both'
  ) {
    let successfullyCopied = true;

    let snackbarMessage = 'Credential copied to clipboard!';

    if (this.selection.selected.length === 0) {
      snackbarMessage = 'No credentials selected. Nothing copied!';
    } else {
      if (index === -1) {
        const text =
          this.selection.selected
            .map((credential: Credential) => {
              switch (toCopy) {
                case 'username':
                  return credential.username;
                case 'password':
                  return credential.password;
                case 'both':
                  return `${credential.username} : ${credential.password}`;
              }
            })
            .join('\n') || ' ';

        successfullyCopied = this.clipboard.copy(text);
      } else {
        const credential = this.credentials.data[index];
        let text = '';
        switch (toCopy) {
          case 'username':
            text = credential.username;
            break;
          case 'password':
            text = credential.password;
            break;
          case 'both':
            text = `${credential.username} : ${credential.password}`;
            break;
        }
        successfullyCopied = this.clipboard.copy(text);
      }

      if (index === -1 && this.selection.selected.length > 1) {
        snackbarMessage = `${this.selection.selected.length} credentials copied to clipboard!`;
      }
    }

    if (successfullyCopied) {
      this._snackBar.open(snackbarMessage, '', { duration: 1000 });
    } else {
      this._snackBar.open('Copy failed. Please try again!', '', {
        duration: 1000,
      });
    }
  }
}
