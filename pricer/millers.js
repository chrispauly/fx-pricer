const picknsave = {
	baseUrl: 'https://www.millerandsonssupermarket.com/stores/',
	async scraper(browser, searchTerm, city, zip){
		let page = await browser.newPage();
		console.log(`Navigating to ${this.baseUrl}${city}...`);

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0');
        await page.goto(`${this.baseUrl}${city}`, { waitUntil: 'networkidle2' });  //networkidle0 || domcontentloaded
         
        await page.waitForSelector('.fp-btn-mystore', { timeout: 10000 });  
        await page.click('.fp-btn-mystore');
        
        await page.waitForSelector('.search', { timeout: 10000 });
        await page.click('.search');
        
        await page.waitForSelector('input[aria-label="Search products ..."]', { timeout: 10000 });
        await page.type('input[aria-label="Search products ..."]', searchTerm);
        await page.keyboard.press('Enter');
        
        await page.waitForSelector('.fp-result-list', { timeout: 10000 });
        
        const products = await page.evaluate((prodElements) => {
            prodElements = [];
        
            document.querySelectorAll('div.fp-item-content').forEach(item => {
                const productNameElement = item.querySelector('div.fp-item-detail > div.fp-item-name > a');
                const productPriceElement = item.querySelector('div.fp-item-detail > div.fp-item-price > span.fp-item-base-price');
                const productSaleElement = item.querySelector('div.fp-item-detail > div.fp-item-sale > span.fp-item-sale-date');
                const productImgElement = item.querySelector('div.fp-item-image > a > img');

                if (productNameElement && productPriceElement) {
                    const productName = productNameElement.textContent.trim();
                    const productPrice = productPriceElement.innerText.trim();
                    const productSale = productSaleElement ? productSaleElement.innerText.trim().replace('Sale price:\n','') : null;
                    
                    // try to get UPC
                    let imgSrc = productImgElement ? productImgElement.src.trim() : '';
                    let upcMatch = imgSrc.match(/images\.freshop\.com\/(\d+)/);
                    const productUpc = upcMatch ? upcMatch[1] : null;
                    
                    // Add the product data to the array
                    prodElements.push({
                        name: productName,
                        price: productPrice,
                        sale: productSale,
                        upc: productUpc
                    });
                }
            });
        
            return prodElements;
	    });

        return products;
    }
}

module.exports = picknsave; 
