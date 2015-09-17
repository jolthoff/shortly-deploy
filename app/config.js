var mongoose = require('mongoose');
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'production') {
	dbURI = 'mongodb://localhost/';
} else if (process.env.NODE_ENV === 'production') {
	dbURI = 'mongodb://SmokiesLab:eSO4sRju0aVnGz4LS05pGfh2_RwNYH0Yc0t_e6YTkkI-@ds040888.mongolab.com:40888/SmokiesLab'
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
