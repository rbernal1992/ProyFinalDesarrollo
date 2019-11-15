let mongoose = require('mongoose');

let { Solution } = require('./model');
let userSchema = mongoose.Schema({
    username: { type: String },
    password: { type: String },
    level: { type: Number },
    lldate: { type: String },
    country: { type: String },
    business: { type: String },
    SolutionOne: { //top three solutions will appear, no more.
        type: mongoose.Schema.Types.ObjectId,
        Ref: 'Solution'
    },
    SolutionTwo: {
        type: mongoose.Schema.Types.ObjectId,
        Ref: 'Solution'
    },
    SolutionThree: {
        type: mongoose.Schema.Types.ObjectId,
        Ref: 'Solution'
    }
});

let User = mongoose.model('User', userSchema);

module.exports = User;