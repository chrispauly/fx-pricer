const picknsave = {
	baseUrl: 'https://www.picknsave.com/search',
	async scraper(browser, searchTerm){
		let page = await browser.newPage();

        const queryParams = new URLSearchParams({
            query: searchTerm,
            searchType: "default_search"
        });
    
        const fullUrl = `${this.baseUrl}?${queryParams.toString()}`;

		console.log(`Navigating to ${fullUrl}...`);

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0');
        await page.goto(`${fullUrl}`, { waitUntil: 'domcontentloaded' });  //networkidle0 || networkidle2
         
        await page.waitForSelector('div.kds-Card', { timeout: 10000 });
        
        const products = await page.evaluate((prodElements) => {
            prodElements = [];
        
            document.querySelectorAll('div.kds-Card').forEach(item => {
                const productNameElement = item.querySelector('[data-testid="cart-page-item-description"]');
                const productPriceElement = item.querySelector('s.kds-Price-original');
                const productSaleElement = item.querySelector('[data-testid="cart-page-item-unit-price"]');
                const productImgElement = item.querySelector('div.fp-item-image > a > img');

                if (productNameElement && productPriceElement) {
                    const productName = productNameElement.innerText.trim();
                    const productPrice = productPriceElement.innerText.trim().replace('$','');
                    const productSale = productSaleElement.value.trim();
                    const productSize = null;
                    
                    // try to get UPC
                    const productUpc = null;
                    
                    // Add the product data to the array
                    prodElements.push({
                        name: productName,
                        size: productSize,
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
