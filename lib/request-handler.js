var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var mongoose = require('mongoose');

var db = require('../app/config');
var userSchema = db.userSchema;
var urlSchema = db.urlSchema;

var User = mongoose.model('user', userSchema);
var Url = mongoose.model('url', urlSchema);


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Url.find().exec(function(err, data) {
    if (err) {console.log(err)}
    res.send(200, data)
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Url.findOne( { url: uri }, function(err, url) {
    if (err) {console.log(err)}
    else if (url) {
      res.send(200, url)
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) { 
          console.log('What did you say?')
          res.send(404);
        }

        var shasum = crypto.createHash('sha1');
        shasum.update(uri);

        Url.create( {
          url: uri,
          title: title,
          base_url: req.headers.origin,
          code: shasum.digest('hex').slice(0,5)
        }, function(err, url) {
          if (err) {console.log("will there ever be an error?  " + err)}
          else {
            res.send(200, url)
          }
        })
      })
    }
  })
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;


  User.findOne( {'username': username }, function(err, user) {
    if (err) { console.log(err) }
    else if (!user) {
      res.redirect('/login')
    } else {
      bcrypt.compare(password, user.password, function(err, isMatch) {
        if (isMatch) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  })

};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var cipher = bcrypt.hashSync(password, null, null)

  User.findOne( {'username': username}, function(err, user) {
    if (err) {console.log (err) }
    else if (!user) {
      User.create({
        username: username,
        password: cipher
      }, function (err, user) {
        if (err) {console.log (err)}
        util.createSession(req, res, user)
      });
    } else {
      res.redirect('/signup');
    }
  })
  
};

exports.navToLink = function(req, res) {
  Url.findOne( {code: req.params[0] }, function (err, url) {
    if (err) {console.log(err) }
    else if (!url) {
      res.redirect('/');
    } else {
      url.visits++;
      url.save();
      res.redirect(url.url);
    }
  });

};