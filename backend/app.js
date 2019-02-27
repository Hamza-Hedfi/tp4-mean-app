const express = require('express');
const bodyParser = require('body-parser');

const app = express();

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
  const contact = req.body;
  console.log(contact);
  res.status(201).json({
    message: 'Contact added successfully'
  });
});

app.get('/api/contacts', (req, res, next) => {
  const contacts = [
    {
      id: '1',
      name: 'Hamza Hedfi',
      email: 'h.hedfi@outlook.com',
      phone: '27 287 347'
    },
    {
      id: '2',
      name: 'Hamza Hedfi',
      email: '01101000.hedfi@gmail.com',
      phone: '27 287 347'
    },
    {
      id: '3',
      name: 'Hamza Hedfi',
      email: 'hamza.hedfi5@gmail.com',
      phone: '27 287 347'
    }
  ];
  res.status(200).json({
    message: 'Contacts fetched successfully!',
    contacts: contacts
  });
});

module.exports = app;
