var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var anr = require('../lib/appsAndRulesHelper.js');
var router = express.Router();

router.get('/', ensureLoggedIn, function(req, res, next) {
  var userData = {
    name: req.user.displayName
  };

  anr.getClientsAndRules()
  .then((data) => {
    let ruleNames = data.rules.map(x => { return x.name });
    res.render('apps', { apps: data.appAndRules, user: userData, ruleNames: ruleNames, rules: data.rules });
  }).catch((err) =>  {
    console.log("Error retrieving clients");
    console.log(err);
    res.render('apps', { apps: [], user: userData, ruleNames: [], rules: [] });
  });
});

module.exports = router;
