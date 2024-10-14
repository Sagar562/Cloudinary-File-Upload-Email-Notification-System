const File = require('../modules/file');
const { options } = require('../routes/FileUpload');
const cloudinary = require('cloudinary').v2

//local file upload
exports.localFileUpload = async (req, res) => {

    try {
        const file = req.files.file;

        const path = __dirname + '/files/' + Date.now() + `.${file.name.split('.')[1]}`

        // console.log('path => ', path)

        file.mv(path, (error) => {
            console.log(error)
        })

        res.status(200).json({
            success : true,
            message : 'File uploaded'
        })

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : 'File cannot uploaded'
        })
    }
}

function checkFileType (fileType, supportedTypes) {
    return supportedTypes.includes(fileType);
}

async function uploadFileToCloudinary (file, folder,quality) {
    const options = {folder}
    if (quality)
    {
        options.quality = quality || 'auto'
    }
    return await cloudinary.uploader.upload(file.tempFilePath, options)
}

exports.imageUpload = async (req, res) => {

    try {
        const {name, tags, emails} = req.body;

        const file = req.files.imageFile;

        //validation
        const supportedTypes = ['jpg','jpeg','png'];
        const fileType = file.name.split('.')[1];
        // console.log("File type : ", fileType)
        if (!checkFileType(fileType, supportedTypes))
        {
            return res.status(400).json({
                success : false,
                message : 'File type is not matched'
            })
        }

        //upload to cloadinary
        const response = await uploadFileToCloudinary(file, 'TestSagar')
        console.log(response)

        // create entry in DB
        const fileData = File.create({
            name,
            tags,
            emails,
            imageUrl : response.secure_url
        })

        res.status(200).json({
            success : true,
            message : 'File uploaded to cloudinary',
        
        })

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : 'File not uploaded to cloudinary'
        })
    }
}

exports.videoUpload = async (req, res) => {
    
    try {
        const {name, tags, emails} = req.body;

        const file = req.files.videoFile;

        //validation
        const supportedTypes = ['mp4', 'mov'];
        const fileType = file.name.split('.')[1].toLowerCase();

        if (!checkFileType(fileType, supportedTypes))
        {
            return res.status(400).json({
                success : false,
                message : 'video not supported'
            })
        }

        const response = await uploadFileToCloudinary(file, 'TestSagar');
        console.log(response);

        const fileData = await File.create({
            name,
            tags,
            emails,
            imageUrl : response.secure_url
        })
        res.status(200).json({
            success : true,
            fileData,
            message : 'file entry created in Database'
        })

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : 'File not uploaded'
        })
    }
}

exports.imageReducerUpload = async (req, res) => {

    try {
        const {name, tags, emails} = req.body;
        // console.log(name, tags, emails)
        const file = req.files.imageReducer;

        //validation
        const supportedTypes = ['jpg','jpeg','png'];
        const fileType = file.name.split('.')[1];
        
        // console.log(fileType)
        
        if (!checkFileType(fileType, supportedTypes))
        {
            return res.status(400).json({
                success : false,
                message : 'File type not matched'
            })
        }
        //upload to cloudinary
        const response = await uploadFileToCloudinary(file, 'TestSagar',30)

        //create entry in DB
        const fileData = await File.create({
            name,
            tags,
            emails,
            imageUrl : response.secure_url
        })

        res.status(200).json({
            success : true,
            fileData,
            message : 'File Entry created into th DB'
        })

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : 'Internal server problem'
        })
    }
}