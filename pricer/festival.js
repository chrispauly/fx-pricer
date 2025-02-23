let sessionManager = require("./sessionManager");
let scrollToBottom = require("scroll-to-bottomjs");

const festival = {
	async scraper({page, data}){
        const baseUrl = 'https://www.festfoods.com/stores/';
        const searchTerm = data.searchTerm;
        const city = data.city;
        const zip = data.zip;

		console.log(`Festival: Navigating to ${baseUrl}${city}...`);
        page.setDefaultNavigationTimeout(120000);       // default was 30000
        const restoredSession = await sessionManager.restoreSession(page, 'festival', city, zip);

        await page.goto(`${baseUrl}${city}`, { waitUntil: 'networkidle2' });  //networkidle0 || domcontentloaded
        console.log(`Festival: Waiting for mystore button to load...`);

        if(!restoredSession) {
            await page.waitForSelector('.fp-btn-mystore');  // Festival foods slow loads this button
            await page.hover('.fp-btn-mystore');
            await page.click('.fp-btn-mystore');
            console.log(`Festival: Clicked mystore button...`);
        } else {
            console.log(`Festival: Session restored...`);
        }

        // Jump here on restored session
        await page.waitForSelector('.search');
        await page.hover('.search');
        await page.click('.search');
        console.log(`Festival: Clicked search button...`);

        await page.waitForSelector('input[aria-label="Search products ..."]');
        await page.type('input[aria-label="Search products ..."]', searchTerm);
        await page.keyboard.press('Enter');
        console.log(`Festival: Added search terms and pressed Enter...`);
        
        await page.waitForSelector('.fp-result-list', { timeout: 10000 });

        console.log(`Festival: Scrolling to bottom to lazy load images...`);
        await page.evaluate(scrollToBottom);
        
        console.log(`Festival: Pausing for 2 seconds to lazy load images...`);
        await new Promise(r => setTimeout(r, 2000));

// if fp-result-list does not return, means no results for search term

        console.log(`Festival: Sending eval to browser to load products...`);
        const products = await page.evaluate((prodElements) => {
            prodElements = [];
        
            document.querySelectorAll('div.fp-item-content').forEach(item => {
                const productNameElement = item.querySelector('div.fp-item-detail > div.fp-item-name > a');
                const productPriceElement = item.querySelector('div.fp-item-detail > div.fp-item-price > span.fp-item-base-price');
                const productSaleElement = item.querySelector('div.fp-item-detail > div.fp-item-sale > span.fp-item-sale-date');
                const productImgElement = item.querySelector('div.fp-item-image > a > img');
                const productSizeElement = item.querySelector('div.fp-item-detail > div.fp-item-price > span.fp-item-size');

                if (productNameElement && productPriceElement) {
                    const productName = productNameElement.textContent.trim();
                    const productPrice = productPriceElement.innerText.trim();
                    const productSale = productSaleElement ? productSaleElement.innerText.trim().replace('Sale price:\n','') : null;
                    const productSize = productSizeElement ? productSizeElement.innerText.trim() : null;
                    const imgSrc = productImgElement ? productImgElement.src.trim() : '';

                    // Add the product data to the array
                    prodElements.push({
                        name: productName,
                        price: productPrice,
                        sale: productSale,
                        size: productSize,
                        img: imgSrc,
                    });
                }
            });
        
            return prodElements;
	    });

        await sessionManager.saveSession(page, 'festival', city, zip);
        return products;
    }
}

module.exports = festival; 
