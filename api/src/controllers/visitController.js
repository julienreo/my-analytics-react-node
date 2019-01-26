const geoip = require('geoip-lite');
const countries = require('i18n-iso-countries'); 
const mobile = require('is-mobile');
const mongoose = require('mongoose');
var moment = require('moment');

const log = require(__basedir + 'lib/logger');
const Visit = require(__basedir + 'src/models/Visit');
const Site = require(__basedir + 'src/models/Site');
const emptyGif = require(__basedir + 'lib/empty-gif');
const { validateVisit } = require(__basedir + 'lib/validator');


/****************
 Create new visit
*****************/ 

exports.create = async (req, res, next) => {
  
  /* 
   * Retrieve and process request data
   */

  const host = req.hostname;
  const ip = req.clientIp;
  const date = new Date();
  const userAgent = req.headers['user-agent'];
  const isMobile = mobile(userAgent);
  const geo = geoip.lookup(ip); // Geo info
  const siteId = req.params.id;


  /* 
   * Format data
   */

  let isoCountryCode = geo === null || typeof geo === 'undefined' ? 'N/A' : geo.country;
  isoCountryCode = isoCountryCode === null || typeof isoCountryCode === 'undefined' ? 'N/A' : isoCountryCode;

  let country = geo === null || typeof geo === 'undefined' ? 'N/A' : countries.getName(geo.country, 'en');
  country = country === null || typeof country === 'undefined' ? 'N/A' : country;
  
  let city = geo === null || typeof geo === 'undefined' ? 'N/A' : geo.city;
  city = city === null || typeof city === 'undefined' ? 'N/A' : city;
  
  const data = { host, ip, date, userAgent, isMobile, isoCountryCode, country, city, siteId };


  /* 
   * Validate data
   */

  const { error } = validateVisit(data);
  
  if (error) {
    const { message } = error.details[0];
    return res.status(400).send({ message });
  }
  

  /* 
   * Save data
   */

  try {
    // Check that site id is a valid ObjectId
    const isSiteValid = mongoose.Types.ObjectId.isValid(data.siteId);

    // If site id is not valid
    if (!isSiteValid) {
      return res.status(400).send({ message: 'Invalid site ID' });
    }

    // Retrieve site from which visit comes from
    const site = await Site.findOne({ _id: mongoose.Types.ObjectId(data.siteId) });

    // If site doesn't exit
    if (site === null) {
      return res.status(404).send({ message: 'Site not found' });
    }

    // Save visit
    const visitInstance = new Visit({
      host: data.host,
      ip: data.ip,
      date: data.date,
      user_agent: data.userAgent,
      is_mobile: data.isMobile,
      country: data.country,
      iso_country_code: data.isoCountryCode,
      city: data.city,
      site_id: site._id,
      user_id: site.user_id
    });

    const newVisit = await visitInstance.save();
    log.info(`New visit: ${newVisit._id} registered`);
  } 
  catch(err) {
    if (err) return next(err);
  }


  /* 
   * Return empty Gif
   */

  res.set('Content-Type', 'image/gif');
  res.send(emptyGif);
};


/************
 Fetch visits
*************/ 

exports.fetch = async (req, res, next) => {
  let { from, to } = req.query;
  const siteId = req.params.id;
  const userId = req.token.id;

  /* 
   * Validate query params 
   */

  // Check that site id is a valid ObjectId
  const isSiteValid = mongoose.Types.ObjectId.isValid(siteId);

  // If site id is not valid
  if (!isSiteValid) {
    return res.status(400).send({ message: 'Invalid site ID' });
  }

  // Check that site id exists
  const site = await Site.findOne({ _id: mongoose.Types.ObjectId(siteId) });

  // If site doesn't exit
  if (site === null) {
    return res.status(404).send({ message: 'Site not found' });
  }

  // Check that site belongs to user
  if (site.user_id !== userId) {
    return res.status(403).send({ message: 'Forbidden access' });
  }

  // If dates are missing
  if (typeof from === 'undefined' || typeof to === 'undefined') {
    return res.status(400).send({ message: 'Missing parameters' });
  }


  /* 
   * Format data 
   */

  // Convert dates objects into strings using ISO standard
  from = moment(req.query.from).startOf('day'); 
  to = moment(req.query.to).endOf('day'); 


  /* 
   * Retrieve data 
   */

  try {
    const fetchedVisits = await Visit.find({
      date: { '$gte': from, '$lte': to },
      site_id: siteId
    });
    return res.send(fetchedVisits);
  } 
  catch(err) {
    if (err) return next(err);
  }
};