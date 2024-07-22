const fs = require('fs');
const {join,normalize} = require('path');

async function saveSession(page, store, city, zip) {
  console.log('saveSession is under construction'); return;
  const session = await page.target().createCDPSession();
  const resp = await session.send('Network.getAllCookies');
  await session.detach();
  const cookies = await resp.cookies;
  const localStorageData = await page.evaluate(() => {
    let data = {};
    try
    {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
      }
    } catch(err) { console.log(`saveSession localstorage error: ${err}`); }
    return data;
  });
  const sessionData = { cookies, localStorageData };
  const sessionFilePath = buildSessionFilename(store, city, zip);
  fs.writeFileSync(sessionFilePath, JSON.stringify(sessionData, null, 2));
}

async function restoreSession(page, store, city, zip) {
  console.log('restoreSession is under construction'); return;
  const sessionFilePath = buildSessionFilename(store, city, zip);
  if (!fs.existsSync(sessionFilePath)) {
    console.error(`Session file ${sessionFilePath} does not exist.`);
    return false;
  }

  const sessionData = JSON.parse(fs.readFileSync(sessionFilePath, 'utf8'));
  const { cookies, localStorageData } = sessionData;
  const session = await page.target().createCDPSession();
  await session.send('Network.setCookies', {
    cookies: cookies,
  });
  await session.detach();

  await page.evaluate((data) => {
    try {
      for (const key in data) {
        localStorage.setItem(key, data[key]);
      }
    } catch(err) { console.log(`restoreSession localstorage error: ${err}`); }  
  }, localStorageData);
  return true;
}

function buildSessionFilename(store, city, zip) {
    return normalize(join(__dirname, '..', '.cache') + `/${store}.${city}.${zip}.json`);
}

module.exports = {
  saveSession,
  restoreSession,
};
