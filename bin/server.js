const app = require('../app');
const db = require('../models/db');

require('dotenv').config();
const { PORT = 3000 } = process.env;
const { UPLOAD } = process.env;
const createFolderIsNotExist = require('../helpers/create-folder.js');

db.then(() => {
  return app.listen(PORT, async () => {
    await createFolderIsNotExist(UPLOAD);
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch(e => console.log(e.message));
