const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const visitSchema = new Schema(
  {
    host: { type: String, required: true },
    ip: { type: String, required: true },
    date: { type: Date, required: true },
    user_agent: { type: String, required: true },
    is_mobile: { type: Boolean, required: true },
    country: { type: String, required: true },
    iso_country_code: { type: String, required: true },
    city: { type: String, required: true },
    site_id: { type: String, required: true },
    user_id: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('Visit', visitSchema);