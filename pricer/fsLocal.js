const fs = require('fs');
const {join,normalize} = require('path');

const saveFile = (store, city, zip, sessionData) => {
  const sessionFilePath = buildSessionFilename(store, city, zip);
  fs.writeFileSync(sessionFilePath, JSON.stringify(sessionData, null, 2));
  return true;
};

const getFile = (store, city, zip) => {
  const sessionFilePath = buildSessionFilename(store, city, zip);
  if (!fs.existsSync(sessionFilePath)) {
    console.error(`Session file ${sessionFilePath} does not exist.`);
    return null;
  }
  const sessionData = JSON.parse(fs.readFileSync(sessionFilePath, 'utf8'));
  return sessionData;
};

function buildSessionFilename(store, city, zip) {
    return normalize(join(__dirname, '..', '.cache') + `/${store}.${city}.${zip}.json`);
}

module.exports = {
  saveFile,
  getFile,
};
