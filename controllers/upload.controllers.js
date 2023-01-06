const AWS = require('aws-sdk')
const multer = require('multer');
const crypto = require("crypto");
const config = require('./../config/dev');
const Utils = require('./../service/utils');

const s3Client = new AWS.S3({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    region: config.AWS_REGION,
});

var multerStorage = multer.memoryStorage()

exports.upload = multer({
    storage: multerStorage,
    fileFilter: (req, file, callback) => {
        // console.log(file);
        // if (file.mimetype == "image/png" || 
        //     file.mimetype == "image/jpg" || 
        //     file.mimetype == "image/jpeg" || 
        //     file.mimetype == "image/gif" ||
        //     file.mimetype == "sound/wav") {
        //     callback(null, true);
        // } else {
        //     callback(null, false);
        //     return callback('Only .png, .jpg, .gif .jpeg and .wav format allowed');
        // }
        callback(null, true);
      }
});

exports.uploadFiles = async function(req, res) {
    try {
        var respnsseData = [];
        const s3UploadParams = {
            Bucket: config.AWS_BUCKET,
            Key: '',
            Body: '',
            ContentType: '',
            ACL: 'public-read'                
        };

        req.files.map((file) => {
            let hash = crypto.randomBytes(16);
            let filename = `${hash.toString("hex")}-${file.originalname}`;

            // console.log(filename);

            s3UploadParams.Key = filename;
            s3UploadParams.ContentType = file.mimetype;
            s3UploadParams.Body = file.buffer;

            s3Client.upload(s3UploadParams, function (err, data) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "file upload failed",
                        error: err.message
                    });
                } else {
                    respnsseData.push(data);
                    if (respnsseData.length == req.files.length) {
                        return res.status(200).send({ 
                            success: true, 
                            Message: "file upload success", 
                            result: respnsseData 
                        });
                    }
                }
            });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "exception has occurred",
            error: err.message
        });
    }
}