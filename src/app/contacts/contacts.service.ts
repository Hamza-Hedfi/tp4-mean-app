import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Contact } from './contact.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private contacts: Contact[] = [];
  private contactsUpdated = new Subject<{
    contacts: Contact[];
    contactCount: number;
  }>();

  constructor(private http: HttpClient, public router: Router) {}

  getContacts(contactsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${contactsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; contacts: any; maxContacts: number }>(
        'http://localhost:3000/api/contacts' + queryParams
      )
      .pipe(
        map(contactData => {
          return {
            contacts: contactData.contacts.map(contact => {
              return {
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                id: contact._id,
                imagePath: contact.imagePath
              };
            }),
            maxContacts: contactData.maxContacts
          };
        })
      )
      .subscribe(transformedcontactsData => {
        this.contacts = transformedcontactsData.contacts;
        this.contactsUpdated.next({
          contacts: [...this.contacts],
          contactCount: transformedcontactsData.maxContacts
        });
      });
  }

  getContactUpdateListener() {
    return this.contactsUpdated.asObservable();
  }

  getContact(id: string) {
    return this.http.get<{
      _id: any;
      name: string;
      email: string;
      phone: string;
      imagePath: string;
    }>('http://localhost:3000/api/contacts/' + id);
  }

  addContact(name: string, email: string, phone: string, image: File) {
    const contactData = new FormData();
    contactData.append('name', name);
    contactData.append('email', email);
    contactData.append('phone', phone);
    contactData.append('image', image, name);
    this.http
      .post<{ message: string; contact: Contact }>(
        'http://localhost:3000/api/contacts',
        contactData
      )
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  updateContact(
    id: string,
    name: string,
    email: string,
    phone: string,
    image: File | string
  ) {
    let contactData: Contact | FormData;
    if (typeof image === 'object') {
      contactData = new FormData();
      contactData.append('id', id);
      contactData.append('name', name);
      contactData.append('email', email);
      contactData.append('phone', phone);
      contactData.append('image', image, name);
    } else {
      contactData = { id, name, email, phone, imagePath: image };
    }
    this.http
      .put('http://localhost:3000/api/contacts/' + id, contactData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deleteContact(contactId: string) {
    return this.http.delete('http://localhost:3000/api/contacts/' + contactId);
  }
}
