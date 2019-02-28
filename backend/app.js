const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Contact = require('./models/contact');

const app = express();

mongoose
  .connect('mongodb://localhost:27017/contacts')
  .then(() => {
    console.log('Connected to database');
  })
  .catch(() => {
    console.log('Connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Request-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.post('/api/contacts', (req, res, next) => {
  const contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone
  });
  contact.save().then(createdContact => {
    res.status(201).json({
      message: 'Contact added successfully',
      contactId: createdContact._id
    });
  });
  // console.log(contact);
});

app.get('/api/contacts', (req, res, next) => {
  Contact.find().then(documents => {
    res.status(200).json({
      message: 'Contacts fetched successfully!',
      contacts: documents
    });
  });
});

app.delete('/api/contacts/:id', (req, res, next) => {
  Contact.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Contact deleted!' });
  });
});

module.exports = app;
