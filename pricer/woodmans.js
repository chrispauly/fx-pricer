const woodmans = {
	baseUrl: 'https://shopwoodmans.com/',
	async scraper(browser, searchTerm, city, zip){
		let page = await browser.newPage();
		console.log(`Navigating to ${this.baseUrl}...`);

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0');
        await page.goto(`${this.baseUrl}`, { waitUntil: 'networkidle2' });  //networkidle0 || domcontentloaded
         
        await page.waitForSelector('input', { timeout: 10000 });
        await page.type('input', zip);
        await page.keyboard.press('Enter');
        await page.waitForNavigation();

        console.log("Searching for In-Store button...");

        //const instoreBtn = await page.waitForXPath('//button/span/span[text() = "In-Store"]');
        const instoreBtn = await page.waitForSelector('xpath///button/span/span[text() = "In-Store"]');

        if(instoreBtn) { instoreBtn.click(); }

        await page.waitForSelector('input#search-bar-input', { timeout: 10000 });
        await page.type('input#search-bar-input', searchTerm);
        await page.keyboard.press('Enter');

        await page.waitForSelector('div[aria-label="Product"]', { timeout: 10000 });
        
// if fp-result-list does not return, means no results for search term

        const products = await page.evaluate((prodElements) => {
            prodElements = [];
        
            document.querySelectorAll('div[aria-label="Product"]').forEach(item => {
                const productNameElement = item.querySelector('a > div > div > h2');
                //const productPriceElement = item.querySelector('div.fp-item-detail > div.fp-item-price > span.fp-item-base-price');
                //const productSaleElement = item.querySelector('div.fp-item-detail > div.fp-item-sale > span.fp-item-sale-date');
                //const productImgElement = item.querySelector('div.fp-item-image > a > img');

                if (productNameElement) {
                    const productName = productNameElement.textContent.trim();
                    const productPrice = null; //productPriceElement.innerText.trim();
                    const productSale = null; //productSaleElement ? productSaleElement.innerText.trim().replace('Sale price:\n','') : null;
                    
                    // // try to get UPC
                    // let imgSrc = productImgElement ? productImgElement.src.trim() : '';
                    // let upcMatch = imgSrc.match(/images\.freshop\.com\/(\d+)/);
                    // const productUpc = upcMatch ? upcMatch[1] : null;
                    
                    // Add the product data to the array
                    prodElements.push({
                        name: productName,
                        price: productPrice,
                        sale: productSale
                    });
                }
            });
        
            return prodElements;
	    });

        return products;
    }
}

module.exports = woodmans; 
