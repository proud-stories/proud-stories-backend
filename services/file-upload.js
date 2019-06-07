const aws = require('aws-sdk');
const Env = use("Env");
const multer = require('multer');
const multerS3 = require('multer-s3');
const secret_access = Env.get("AWS_SECRET_ACCESS");
const access_key = Env.get("AWS_ACCESS_KEY");

aws.config.update({
  secretAccessKey: secret_access,
  accessKeyId: access_key,
  region: 'ap-northeast-1'
});

const s3 = new aws.S3()

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//       cb(null, true)
//   } else {
//       cb(new Error('Invalid Mime Type, only JPEG and PNG'), false);
//   }
// }

const upload = multer({
  storage: multerS3({
    // fileFilter,
    s3,
    bucket: 'proud-videos',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

module.exports = upload;