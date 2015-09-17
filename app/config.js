var mongoose = require('mongoose');
mongoose.connect('mongodb://SmokiesLab:eSO4sRju0aVnGz4LS05pGfh2_RwNYH0Yc0t_e6YTkkI-@ds040888.mongolab.com:40888/SmokiesLab');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function (callback) {
  console.log("yay");
});



var Schema = mongoose.Schema;
// var Bookshelf = require('bookshelf');
// var path = require('path');

// var db = Bookshelf.initialize({
//   client: 'sqlite3',
//   connection: {
//     host: '127.0.0.1',
//     user: 'your_database_user',
//     password: 'password',
//     database: 'shortlydb',
//     charset: 'utf8',
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   }
// });

var urlSchema = new Schema({
  url: String,
  base_url: String,
  code: String,
  visits: {type: Number, defaults: 0}
})

var userSchema = new Schema({
  username: String,
  password: String
})

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('base_url', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

module.exports.urlSchema = urlSchema;
module.exports.userSchema = userSchema;
