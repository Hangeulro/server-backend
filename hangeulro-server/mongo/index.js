var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/hangul');

var UserSchema = new mongoose.Schema({
  userid:{type: String, required:true, unique:true},
  pw:{type: String},
  name: {type: String},
  profile_image: {type: String},
  token: {type: String},
  level: {type: Number, default: 0},
  total_point: {type: Number, default: 0},
  max_point: {type: Number, default: 3000},
  point: {type: Number, default: 0},

});

var MydicSchema = new mongoose.Schema({
    owner: {type: String},
    dicname: {type: String},
    sub: {type: String},
    favorite: [String]
});

var WordSchema = new mongoose.Schema({
  id: {type: String},
  word: {type: String},
  mean: {type: String},
  ex: {type:String},
  see: {type: Number},
  similar: [String],
  cata: [String],
  tag: [String],

  comments: [{
    writer: {type: String},
    date: {type: Date},
    summary: {type: String},
      profile_image: {type: String},
  }]
});

var BoardSchema = new mongoose.Schema({
     boardid: {type: String},
     title: {type: String},
     writer: {type: String},
     writerToken: {type: String},
     writer_profile: {type: String},
     date: {type: Date},
     contents: {type: String},
     imageurl: {type: String, default: "null"},
     good: {type: Number, default: 0},
     bad: {type: Number, default: 0},
     share: {type: Number, default: 0},

     comments:[{
       writer: {type: String},
       date: {type: Date},
       summary: {type: String},
         profile_image: {type: String},
     }]
});

var TodayWordSchema= new mongoose.Schema({
    day: {type: String},
    wordid: {type: String}
});

Users = mongoose.model('users', UserSchema);
Words = mongoose.model('words', WordSchema);
Boards = mongoose.model('boards', BoardSchema);
TodayWords = mongoose.model('todaywords', TodayWordSchema);
Mydics = mongoose.model('mydics', MydicSchema);

exports.Mydics = Mydics;
exports.Boards = Boards;
exports.Words = Words;
exports.Users = Users;
exports.db = db;

