const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb://localhost:27017/blogauth')
        .then(() => {
            console.log('db connected successfully');
        })
        .catch((err) => {
            console.log('database error:', err);
        });
};
