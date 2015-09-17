var mongoose = require('mongoose');
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'production') {
	dbURI = 'mongodb://localhost/';
} else if (process.env.NODE_ENV === 'production') {
	dbURI = 'mongodb://heroku_qc4cj4cl:taq9s87h34peqv1a1dt2uvvmqa@ds045882.mongolab.com:45882/heroku_qc4cj4cl'
}
mongoose.connect(dbURI);
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function (callback) {
  console.log("yay");
});



var Schema = mongoose.Schema;

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


module.exports.urlSchema = urlSchema;
module.exports.userSchema = userSchema;
