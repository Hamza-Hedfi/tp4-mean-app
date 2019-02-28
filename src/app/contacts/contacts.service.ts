import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Contact } from './contact.model';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private contacts: Contact[] = [];
  private contactUpdated = new Subject<Contact[]>();

  constructor(private http: HttpClient) {}

  getContacts() {
    this.http
      .get<{ message: string; contacts: any }>(
        'http://localhost:3000/api/contacts'
      )
      .pipe(map((contactData) => {
        return contactData.contacts.map((contact) => {
          return {
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            id: contact._id
          }
        });
      }))
      .subscribe(contacts => {
        this.contacts = contacts;
        this.contactUpdated.next([...this.contacts]);
      });
  }

  getContactUpdateListener() {
    return this.contactUpdated.asObservable();
  }

  addContact(name: string, email: string, phone: string) {
    const contact: Contact = { id: null, name, email, phone };
    this.http
      .post<{ message: string, contactId: string }>('http://localhost:3000/api/contacts', contact)
      .subscribe(responseData => {
        const contactId = responseData.contactId;
        contact.id = contactId;
        this.contacts.push(contact);
        this.contactUpdated.next([...this.contacts]);
      });
  }

  deleteContact(contactId: string) {
    this.http.delete('http://localhost:3000/api/contacts/' + contactId)
      .subscribe(() => {
        const updatedContacts = this.contacts.filter(contact => contact.id != contactId);
        this.contacts = updatedContacts;
        this.contactUpdated.next([...this.contacts]);
      });
  }
}
