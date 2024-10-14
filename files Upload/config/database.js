const mongoose = require('mongoose')

require('dotenv').config();

exports.connect = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("Database connected")
    })
    .catch((error) => {
        console.error(error)
        console.log("Database not connectd")
        process.exit(1);
    })
}