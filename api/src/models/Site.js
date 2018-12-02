const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const siteSchema = new Schema(
  {
    site: { type: String, required: true },
    user_id: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('Site', siteSchema);