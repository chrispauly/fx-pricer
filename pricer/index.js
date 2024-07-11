const pricerController = require('./pricerController');
const { Cluster } = require('puppeteer-cluster');
// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra');

// https://www.npmjs.com/package/puppeteer-extra-plugin-adblocker
// Add adblocker plugin, which will transparently block ads in all pages you
// create using puppeteer.
const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(
  AdblockerPlugin({
    // Optionally enable Cooperative Mode for several request interceptors
    interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
    blockTrackers: true,
    blockTrackersAndAnnoyances: true
  })
);
//const StealthPlugin = require('puppeteer-extra-plugin-stealth')
//puppeteer.use(StealthPlugin());

module.exports = async function (context, req) {

    const searchTerm = req.query.search || "ketchup 24";
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_BROWSER,
        maxConcurrency: 5,
        puppeteer: puppeteer,
        puppeteerOptions: {
	        headless: true,
			args: [
				'--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
				//'--window-size=1920,1080',
				'--disable-setuid-sandbox'
			],
	        'ignoreHTTPSErrors': true
	    },
        monitor: false
      });
    
    // Pass the cluster instance to the pricer controller
    const prices = await pricerController(cluster, searchTerm);
    
    await cluster.idle();
    await cluster.close();

    context.res = {
        body: prices,
        headers: {
            "content-type": "application/json"
        }
    };
    
    // const screenshotBuffer = await page.screenshot({ fullPage: true });
    // context.res = {
    //     body: screenshotBuffer,
    //     headers: {
    //         "content-type": "image/png"
    //     }
    // };
};