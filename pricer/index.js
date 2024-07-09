const browserObject = require('./browser');
const pricerController = require('./pricerController');

module.exports = async function (context, req) {

    const searchTerm = req.query.search || "ketchup 24";

     //Start the browser and create a browser instance
    let browserInstance = browserObject.startBrowser();
    
    // Pass the browser instance to the pricer controller
    const prices = await pricerController(browserInstance, searchTerm);

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