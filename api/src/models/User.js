const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const userSchema = new Schema(
  {
    username: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    sites: [{ 
      type: String 
    }],
    created_at: { 
      type: Date, 
      default: Date.now 
    },
    updated_at: { 
      type: Date, 
      default: Date.now 
    }
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

exports.User = mongoose.model('User', userSchema);

// Validate user data
exports.validateUser  = (user) => {
  return Joi.validate(user, Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().required(),
    sites: Joi.array().items(Joi.string().required())
  }));
};

// Validate user login details
exports.validateUserDetails = (user) => {
  return Joi.validate(user, Joi.object().keys({
    email: Joi.string().email({ minDomainAtoms: 2 }).required().error(() => 'Email invalide'),
    password: Joi.string().required().error(() => 'Mot de passe invalide')
  }));
};