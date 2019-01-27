const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const visitSchema = new Schema(
  {
    host: { 
      type: String, 
      required: true 
    },
    ip: { 
      type: String, 
      required: true 
    },
    date: { 
      type: Date, 
      required: true 
    },
    user_agent: { 
      type: String, 
      required: true 
    },
    is_mobile: { 
      type: Boolean, 
      required: true 
    },
    country: { 
      type: String, 
      required: true 
    },
    iso_country_code: { 
      type: String, 
      required: true 
    },
    city: { 
      type: String, 
      required: true 
    },
    site_id: { 
      type: String, 
      required: true 
    },
    user_id: { 
      type: String, 
      required: true 
    },
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

exports.Visit = mongoose.model('Visit', visitSchema);

// Validate visits data
exports.validateVisit = (visit) => {
  return Joi.validate(visit, Joi.object().keys({
    host: Joi.string().required(),
    ip: Joi.string().required(),
    date: Joi.date().iso().required(),
    userAgent: Joi.string().required(),
    isMobile: Joi.boolean().required(),
    isoCountryCode: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    siteId: Joi.string().required()
  }));
};