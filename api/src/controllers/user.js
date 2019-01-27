const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');
const _ = require('lodash');

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
  const data = _.pick(req.body, ['username', 'email', 'password', 'sites']);

  // Validate data
  const { error } = validateUser(data);
  if (error) return res.status(400).send({ message: error.details[0].message });

  // Hash password
  data.password = await bcrypt.hash(data.password, saltRounds);

  // Save user
  const user = await new User(data).save();
  log.info(`New user: ${user.email} successfully saved`);

  // Save sites
  const newSitesIds = [];
  for (const site of user.sites) {
    const siteInstance = new Site({ site: site, user_id: user._id });

    const newSite = await siteInstance.save();
    log.info(`New site: ${newSite._id} successfully saved`);

    newSitesIds.push(newSite._id);
  }

  // Replace user sites names per their ids
  await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user._id) }, { sites: newSitesIds });

  return res.send({ success: true });
});


/***********
 Log user in
************/ 

exports.login = asyncMiddleware(async (req, res, next) => {
  const data = _.pick(req.body, ['email', 'password']);

  // Validate data
  const { error } = validateUserDetails(data);
  if (error) return res.status(400).send({ message: error.details[0].message });

  // Find user
  const user = await User.findOne({ email: data.email });
  if (!user) return res.status(404).send({ message: 'Utilisateur inconnu' });

  // Authenticate user
  const match = await bcrypt.compare(data.password, user.password);
  if (!match) return res.status(403).send({ message: 'Mauvaise combinaison' });

  // Generate access token
  const token = await jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  // Return token
  return res.send({ message: 'Authentification réussie', token });
});


/****************
 Fetch user sites
*****************/ 

exports.fetchSites = asyncMiddleware(async (req, res, next) => {
  const sites = await Site.find({ user_id: req.token.id });
  return res.send(sites);
});