const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb+srv://bedii:112143asd@firstapi.4xfbc.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
    
    mongoose.connection.on('open', () => {
        console.log('MongoDB: Connected');
    });
    
    mongoose.connection.on('error', (err) => {
        console.log('MongoDB: Error', err);
    });

    mongoose.Promise = global.Promise;
};