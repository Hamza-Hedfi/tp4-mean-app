import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private contacts: Contact[] = [];
  private contactUpdated = new Subject<Contact[]>();

  constructor(private http: HttpClient) {}

  getContacts() {
    this.http
      .get<{ message: string; contacts: Contact[] }>(
        'http://localhost:3000/api/contacts'
      )
      .subscribe(contactData => {
        this.contacts = contactData.contacts;
        this.contactUpdated.next([...this.contacts]);
      });
  }

  getContactUpdateListener() {
    return this.contactUpdated.asObservable();
  }

  addContact(name: string, email: string, phone: string) {
    const contact: Contact = { id: null, name, email, phone };
    this.http
      .post<{ message: string }>('http://localhost:3000/api/contacts', contact)
      .subscribe(responseData => {
        console.log(responseData.message);
        this.contacts.push(contact);
        this.contactUpdated.next([...this.contacts]);
      });
  }
}
