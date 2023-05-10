import { UsernameAndPasswordComponent } from './username-and-password/username-and-password.component';
import { Component, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  appTitle = 'Toolkit';

  @ViewChild(UsernameAndPasswordComponent) usernameAndPassword: UsernameAndPasswordComponent;

  onTabChanged(event: MatTabChangeEvent) {
    switch(event.tab.textLabel) {
      case "Username & Password":
        return this.usernameAndPassword.generate();
      case "TOTP":
        return;
      case "JSON prettier":
        return;
    }
  }
}
