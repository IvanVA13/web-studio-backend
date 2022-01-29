const cloudinary = require('cloudinary').v2;
const { promisify } = require('util');
require('dotenv').config();
const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const uploadCloud = promisify(cloudinary.uploader.upload);

class UploadAvatarService {
  async saveAvatar(pathFile, oldIdCloudAvatar) {
    if (oldIdCloudAvatar === 'male' || oldIdCloudAvatar === 'female') {
      oldIdCloudAvatar = null;
    }
    const { public_id: idCloudAvatar, secure_url: avatarUrl } =
      await uploadCloud(pathFile, {
        public_id: oldIdCloudAvatar?.replace('CloudAvatar/users-avatars', ''), // 'CloudAvatar/public_id'
        folder: 'CloudAvatar/users-avatars',
        transformation: { width: 250, height: 250, crop: 'pad' },
      });
    return { idCloudAvatar, avatarUrl };
  }
}

module.exports = UploadAvatarService;
