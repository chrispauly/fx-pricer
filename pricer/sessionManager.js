const {saveFile, getFile} = require('./fsLocal');

async function saveSession(page, store, city, zip) {
  if(notLocal()) { console.log('saveSession not working in the cloud...'); return; }

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

  // Save off data
  saveFile(store, city, zip, sessionData);
}

async function restoreSession(page, store, city, zip) {
  if(notLocal()) { console.log('restoreSession not working in the cloud...'); return; }

  const sessionData = getFile(store, city, zip);
  if(!sessionData) return;

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

function notLocal() {
  return process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.WEBSITE_INSTANCE_ID || true;
}

module.exports = {
  saveSession,
  restoreSession,
};
