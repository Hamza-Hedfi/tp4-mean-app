const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { tyep: String, required: true },
  phone: { tyep: String, required: true }
});

module.exports = mongoose.model('Contact', contactSchema);
