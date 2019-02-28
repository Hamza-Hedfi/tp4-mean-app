import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Contact } from '../contact.model';
import { ContactsService } from '../contacts.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {
  constructor(public contactsService: ContactsService) {}
  // contacts = [
  //   {
  //     name: 'Hamza Hedfi',
  //     email: 'hedfi.hamza@hotmail.fr',
  //     phone: '27 287 347'
  //   },
  //   {
  //     name: 'Hamza Hedfi',
  //     email: 'hedfi.hamza@hotmail.fr',
  //     phone: '27 287 347'
  //   },
  //   {
  //     name: 'Hamza Hedfi',
  //     email: 'hedfi.hamza@hotmail.fr',
  //     phone: '27 287 347'
  //   }
  // ];
  contacts: Contact[] = [];
  private contactSub: Subscription;

  ngOnInit() {
    this.contactsService.getContacts();
    this.contactSub = this.contactsService
      .getContactUpdateListener()
      .subscribe((contacts: Contact[]) => {
        this.contacts = contacts;
      });
  }

  onDelete(contactId: string) {
    this.contactsService.deleteContact(contactId);
  }

  ngOnDestroy() {
    this.contactSub.unsubscribe();
  }
}
