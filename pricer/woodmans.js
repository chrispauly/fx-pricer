let sessionManager = require("./sessionManager");

const woodmans = {
	async scraper({page, data}){
        const baseUrl = 'https://shopwoodmans.com/';
        const searchTerm = data.searchTerm;
        const city = data.city;
        const zip = data.zip;
        

		console.log(`Woodmans: Navigating to ${baseUrl}...`);
        page.setDefaultNavigationTimeout(120000);       // default was 30000
        const restoredSession = await sessionManager.restoreSession(page, 'woodmans', city, zip);
        await page.goto(`${baseUrl}`);  //networkidle0 || domcontentloaded
        console.log(`Woodmans: Waiting for page to load...`);

        if(!restoredSession) {
            await page.waitForSelector('input');
            await page.type('input', zip);
            await page.keyboard.press('Enter');
            console.log(`Woodmans: Added zip and pressed Enter...`);

            await page.waitForNavigation();

            console.log("Woodmans: Searching for In-Store button...");

            //const instoreBtn = await page.waitForXPath('//button/span/span[text() = "In-Store"]');
            const instoreBtn = await page.waitForSelector('xpath///button/span/span[text() = "In-Store"]');

            if(instoreBtn) { 
                instoreBtn.click(); 
                console.log(`Woodmans: Clicked Instore button...`);
                await new Promise(r => setTimeout(r, 2000));
            } else {
                console.error(`Woodmans: Instore button not found...`);
            }
        }

        // Jump here on session restore
        await page.waitForSelector('input#search-bar-input');
        await page.type('input#search-bar-input', searchTerm);
        await page.keyboard.press('Enter');
        console.log(`Woodmans: Added search terms and pressed Enter...`);

        await page.waitForSelector('div[aria-label="Product"]');
        //await page.waitForSelector('xpath///button/span[text() = "Load more"]');

        console.log(`Woodmans: Pausing for 2 seconds to allow browser to load more products...`);
        await new Promise(r => setTimeout(r, 2000));

        console.log(`Woodmans: Sending eval to browser to load products...`);
        const products = await page.evaluate((prodElements) => {
            prodElements = [];
        
            document.querySelectorAll('div[aria-label="Product"]').forEach(item => {
                const productNameElement = item.querySelector('a > div > div > h2');
                const productPriceElement = item.querySelector('div.e-1jioxed > span');
                const productSalePriceElement = item.querySelector('div.e-hlbpyw > span');
                const productOriginalPriceElement = item.querySelector('div.e-1rr4qq7 > span');
                const productDealElement = item.querySelector('div.e-81yhrs');
                //const productImgElement = item.querySelector('div.fp-item-image > a > img');
                const productSizeElement = item.querySelector('div.e-122cwne'); //item.querySelector('a > div > div > div[title]');

                if (productNameElement && (productPriceElement || productSalePriceElement)) {
                    const productName = productNameElement.textContent.trim();
                    const productPrice = (productPriceElement || productSalePriceElement) ? 
                                         (productPriceElement || productSalePriceElement).innerText.trim() : null;
                    const productSale = (productSalePriceElement || productDealElement) ?
                                        (productSalePriceElement || productDealElement).innerText.trim() : null;
                    const productSize = productSizeElement ? productSizeElement.title.trim() : null;
                    //const imgSrc = productImgElement ? productImgElement.src.trim() : '';

                    // Add the product data to the array
                    prodElements.push({
                        name: productName,
                        price: productPrice,
                        sale: productSale,
                        size: productSize,
                        //img: imgSrc,
                    });
                }
            });
        
            return prodElements;
	    });

        if(!restoredSession) await sessionManager.saveSession(page, 'woodmans', city, zip);
        return products;
    }
}

module.exports = woodmans; 
