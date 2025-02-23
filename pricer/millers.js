let sessionManager = require("./sessionManager");
let scrollToBottom = require("scroll-to-bottomjs");

const millers = {
	async scraper({page, data}){
        const baseUrl = 'https://www.millerandsonssupermarket.com/stores/';
        const searchTerm = data.searchTerm;
        const city = data.city;
        const zip = data.zip;
		console.log(`Millers: Navigating to ${baseUrl}${city}...`);
        page.setDefaultNavigationTimeout(120000);       // default was 30000

        await page.goto(`${baseUrl}${city}`, { waitUntil: 'networkidle2' });  //networkidle0 || domcontentloaded
        console.log(`Millers: Waiting for mystore button to load...`);

        await page.waitForSelector('.fp-btn-mystore');  
        await page.click('.fp-btn-mystore');
        console.log(`Millers: Clicked mystore button...`);

        await page.waitForSelector('.search');
        await page.click('.search');
        console.log(`Millers: Clicked search button...`);
        
        await page.waitForSelector('input[aria-label="Search products ..."]');
        await page.type('input[aria-label="Search products ..."]', searchTerm);
        await page.keyboard.press('Enter');
        console.log(`Millers: Added search terms and pressed Enter...`);

        await page.waitForSelector('.fp-result-list', { timeout: 10000 });
        
        console.log(`Millers: Scrolling to bottom to lazy load images...`);
        await page.evaluate(scrollToBottom);

        console.log(`Millers: Sending eval to browser to load products...`);
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

        await sessionManager.saveSession(page, 'millrs', city, zip);
        return products;
    }
}

module.exports = millers; 
