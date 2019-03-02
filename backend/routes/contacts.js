const express = require('express');
const multer = require('multer');

const Contact = require('../models/contact');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post(
  '',
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const contact = new Contact({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      imagePath: url + '/images/' + req.file.filename
    });
    contact.save().then(createdContact => {
      res.status(201).json({
        message: 'Contact added successfully',
        contact: {
          ...createdContact,
          id: createdContact._id
        }
      });
    });
  }
);

router.put(
  '/:id',
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename
    }
    const contact = new Contact({
      _id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      imagePath: imagePath
    });
    console.log(contact);
    Contact.updateOne({ _id: req.params.id }, contact).then(result => {
      res.status(200).json({ message: 'Update successful!' });
    });
  }
);

router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const contactQuery = Contact.find();
  let fetchedContacts;
  if (pageSize && currentPage) {
    contactQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  contactQuery.then(documents => {
    fetchedContacts = documents
    return Contact.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Contacts fetched successfullt!',
        contacts: fetchedContacts,
        maxContacts: count
      });
    });
});


router.get('/:id', (req, res, next) => {
  Contact.findById(req.params.id).then(contact => {
    // console.log(contact);n
    if (contact) {
      res.status(200).json( contact );
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  });
});

router.delete('/:id', (req, res, next) => {
  Contact.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Contact deleted!' });
  });
});

module.exports = router;
