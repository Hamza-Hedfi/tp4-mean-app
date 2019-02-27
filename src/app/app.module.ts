import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule
} from '@angular/material';

import {MatIconModule} from '@angular/material/icon';

import { AppComponent } from './app.component';
import { ContactCreateComponent } from './contacts/contact-create/contact-create.component';
import { HeaderComponent } from './header/header.component';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';


@NgModule({
  declarations: [
    AppComponent,
    ContactCreateComponent,
    HeaderComponent,
    ContactListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatIconModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
