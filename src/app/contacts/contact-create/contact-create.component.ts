import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { ContactsService } from '../contacts.service';
import { Contact } from '../contact.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-contact-create',
  templateUrl: './contact-create.component.html',
  styleUrls: ['./contact-create.component.css']
})
export class ContactCreateComponent implements OnInit {
  enteredName = '';
  enteredEmail = '';
  enteredPhone = '';
  contact: Contact;
  isLoading = false;
  form: FormGroup;
  imagePreview;
  private mode = 'create';
  private contactId: string;

  constructor(
    public contactsService: ContactsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      email: new FormControl(null, { validators: [Validators.required] }),
      phone: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern('[0-9]{2} [0-9]{3} [0-9]{3}')
        ]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('contactId')) {
        this.mode = 'edit';
        this.contactId = paramMap.get('contactId');
        this.isLoading = true;
        this.contactsService
          .getContact(this.contactId)
          .subscribe(contactData => {
            this.isLoading = false;
            this.contact = {
              id: contactData._id,
              name: contactData.name,
              email: contactData.email,
              phone: contactData.phone,
              imagePath: contactData.imagePath
            };
            this.form.setValue({
              name: this.contact.name,
              email: this.contact.email,
              phone: this.contact.phone,
              image: this.contact.imagePath
            });
          });
      } else {
        this.mode = 'create';
        this.contactId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    // console.log(file);
    // console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSaveContact() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.contactsService.addContact(
        this.form.value.name,
        this.form.value.email,
        this.form.value.phone,
        this.form.value.image
      );
    } else {
      this.contactsService.updateContact(
        this.contactId,
        this.form.value.name,
        this.form.value.email,
        this.form.value.phone,
        this.form.value.image
      );
    }
    this.form.reset();
  }
}
