import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ContactsService } from '../contacts.service';

@Component({
  selector: 'app-contact-create',
  templateUrl: './contact-create.component.html',
  styleUrls: ['./contact-create.component.css']
})
export class ContactCreateComponent {
  enteredName = '';
  enteredEmail = '';
  enteredPhone = '';

  onAddContact(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.contactsService.addContact(
      form.value.name,
      form.value.email,
      form.value.phone
    );

    form.resetForm();
  }

  constructor(public contactsService: ContactsService) {}
}
