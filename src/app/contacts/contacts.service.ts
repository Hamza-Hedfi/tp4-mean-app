import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';

@Injectable({providedIn: 'root'})
export class ContactsService {
  private contacts: Contact[] = [];
  private contactUpdated = new Subject<Contact[]>();

  getContacts() {
    return [...this.contacts];
  }

  getContactUpdateListener() {
    return this.contactUpdated.asObservable();
  }

  addContact(name: string, email: string, phone: string) {
    const contact: Contact = { name, email, phone };
    this.contacts.push(contact);
    this.contactUpdated.next([...this.contacts]);
  }
}
