const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');

const log = require(__basedir + 'lib/logger');
const { User } = require(__basedir + 'src/models/User');
const { validateUser } = require(__basedir + 'src/models/User');
const { validateUserDetails } = require(__basedir + 'src/models/User');
const Site = require(__basedir + 'src/models/Site');
const asyncMiddleware = require(__basedir + 'src/middleware/async');


/***************
 Create new user
****************/ 

exports.create = asyncMiddleware(async (req, res, next) => {
  const data = { username, email, password } = req.body;

  /* 
   * Validate data
   */
  
  const { error } = validateUser(data);

  if (error) {
    const { message } = error.details[0];
    return res.status(400).send({ message });
  }


  /* 
   * Hash password
   */

  data.password = await bcrypt.hash(data.password, saltRounds);


  /* 
   * Save user in `users` collections and his sites in `sites` collection
   */

  // Save user
  const userInstance = new User(data);
  const user = await userInstance.save();
  log.info(`New user: ${user.email} successfully saved`);


  // Save user sites
  const newSitesIds = [];
  for (const site of user.sites) {
    const siteInstance = new Site({
      site: site,
      user_id: user._id
    });

    const newSite = await siteInstance.save();
    log.info(`New site: ${newSite._id} successfully saved`);

    // Push newly created sites ids into `newSitesIds` array
    newSitesIds.push(newSite._id);
  }


  // In user document, replace user sites names per their respective ids
  await User.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(user._id) },
    { sites: newSitesIds }
  );

  log.info(`New user: ${user.email} sites values replaced per their ids`);
  return res.send({ success: true });
});


/***********
 Log user in
************/ 

exports.login = asyncMiddleware(async (req, res, next) => {
  const data = { email, password } = req.body;

  /* 
   * Validate data
   */
  
  const { error } = validateUserDetails(data);
  
  if (error) {
    const { message } = error.details[0];
    return res.status(400).send({ message });
  }


  /* 
   *
   * Find user and authenticate him
   * 
   */

  const user = await User.findOne({ email: data.email });

  // If user doesn't exist
  if (user === null) {
    log.error(`Failed to find user: ${data.email} when attempting to login`);
    return res.status(404).send({ message: 'Utilisateur inconnu' });
  }


  /*
    * Compare request and user passwords
    */
  
  const match = await bcrypt.compare(data.password, user.password);

  // If passwords don't match
  if (!match) {
    log.error(`Failed to authenticate user: ${data.email}`);
    return res.status(403).send({ message: 'Mauvaise combinaison' });
  }


  /*
    * Generate token
    */

    const payload = {
    id: user._id,
    username: user.username,
    email: user.email
  };
  
  const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
  log.info(`User: ${user.email} has logged in`);

  
  /*
    * Return token
    */

  return res.send({ message: 'Authentification réussie', token: token });
});


/****************
 Fetch user sites
*****************/ 

exports.fetchSites = asyncMiddleware(async (req, res, next) => {
  const userId = req.token.id;
  
  const sites = await Site.find({ user_id: userId });
  return res.send(sites);
});