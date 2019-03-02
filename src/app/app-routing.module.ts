import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactListComponent } from './contacts/contact-list/contact-list.component';
import { ContactCreateComponent } from './contacts/contact-create/contact-create.component';

const routes: Routes = [
  { path: '', component: ContactListComponent },
  { path: 'create', component: ContactCreateComponent },
  { path: 'edit/:contactId', component: ContactCreateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
