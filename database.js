const mongoose = require('mongoose')

const Post = new mongoose.Schema({
    name: { type: String, default: 'User' },
    message: { type: String, default: 'None' }
});

const User = mongoose.model('Post', Post);
module.exports = User;