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

// var User = require('../app/models/user');
// var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

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
  // Links.reset().fetch().then(function(links) {
  //   res.send(200, links.models);
  // })
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
        Url.create( {
          url: uri,
          title: title,
          base_url: req.headers.origin
        }, function(err, url) {
          if (err) {console.log("will there ever be an error?  " + err)}
          else {
            res.send(200, url)
          }
        })
      })
    }
  })

  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.send(200, found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.send(404);
  //       }
  //       var newLink = new Link({
  //         url: uri,
  //         title: title,
  //         base_url: req.headers.origin
  //       });
  //       newLink.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.send(200, newLink);
  //       });
  //     });
  //   }
  // });
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

  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/login');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       })
  //     }
  // });
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

  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};