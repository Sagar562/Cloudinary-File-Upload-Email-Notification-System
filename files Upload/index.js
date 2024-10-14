const express = require('express')
const app = express()

require('dotenv').config();

//middleware for body parser
app.use(express.json())
const filepload = require('express-fileupload')
app.use(filepload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

const PORT = process.env.PORT || 4000

//api route mount
const Upload = require('./routes/FileUpload')
app.use('/api/v1/upload', Upload)

//cloud connect
const cloudinary = require('./config/cloudinary')
cloudinary.cloudinaryConnect();

//Db connect
const db = require('./config/database')
db.connect();

//activate server
app.listen(PORT, () => {
    console.log(`server at ${PORT}`)
})
