let mongoose = require('mongoose');
let userSchema = mongoose.Schema({
    username: { type: String },
    password: { type: String },
    level: { type: Number },
    lldate: { type: String },
    country: { type: String },
    business: { type: String },
    Solution: {
        type: mongoose.Schema.Types.ObjectId,
        Ref: 'Solution'
    }
});

let User = mongoose.model('User', userSchema);

module.exports = User;