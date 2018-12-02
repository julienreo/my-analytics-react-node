const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sites: [{ type: String }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  { 
    versionKey: false
  }
);

// Validate that `sites` is a non empty array
userSchema.pre('save', function(next) {
  if (!Array.isArray(this.sites) || this.sites.length === 0) {
    const err = new Error('Wrong "sites" format');
    return next(err);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);