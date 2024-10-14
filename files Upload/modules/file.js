const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
require('dotenv').config()

const fileSchema = new mongoose.Schema({
    
    name : {
        type : String,
        required : true,
    },
    imageUrl : {
        type : String,
    },
    tags : {
        type : String,
    },
    emails : {
        type : String,
    }
})

fileSchema.post("save", async function(doc) {
    try {
        let transporter = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            port: 465, 
            secure: true, 
            auth : {
                user : process.env.MAIL_USER,
                pass : process.env.MAIL_PASS
            }
        })

        let info = await transporter.sendMail({
            from : `"Sagar" <${process.env.MAIL_USER}>`,
            to : doc.emails,
            subject :"New file uploaded on cloudinary",
            html : `<h1>File uploaded</h1> <p>Uploaded file : <a href = "${doc.imageUrl}">${doc.imageUrl}</a></p>`
        })
        // console.log(info)
    } catch(error) {
       console.log(error)
    }
})

const File = mongoose.model('File', fileSchema)
module.exports = File;