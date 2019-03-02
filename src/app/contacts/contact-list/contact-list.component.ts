import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

import { Contact } from '../contact.model';
import { ContactsService } from '../contacts.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {

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
  isLoading = false;
  totalContacts = 0;
  contactsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private contactSub: Subscription;

  constructor(public contactsService: ContactsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.contactsService.getContacts(this.contactsPerPage, this.currentPage);
    this.contactSub = this.contactsService
      .getContactUpdateListener()
      .subscribe((contactData: {contacts: Contact[], contactCount: number}) => {
        this.isLoading = false;
        this.totalContacts = contactData.contactCount;
        this.contacts = contactData.contacts;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.contactsPerPage = pageData.pageSize;
    this.contactsService.getContacts(this.contactsPerPage, this.currentPage);
  }

  onDelete(contactId: string) {
    this.isLoading = true;
    this.contactsService.deleteContact(contactId).subscribe(() => {
      this.contactsService.getContacts(this.contactsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.contactSub.unsubscribe();
  }
}
