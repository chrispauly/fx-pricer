const picknsave = {
	baseUrl: 'https://www.picknsave.com/search',
	async scraper(browser, searchTerm, city, zip){
		let page = await browser.newPage();

        const queryParams = new URLSearchParams({
            query: searchTerm,
            searchType: "default_search"
        });
    
        const fullUrl = `${this.baseUrl}?${queryParams.toString()}`;

		console.log(`Navigating to ${fullUrl}...`);

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0');
        await page.goto(`${fullUrl}`, { waitUntil: 'networkidle2' });  //networkidle0 || domcontentloaded

        await page.waitForSelector('div.kds-Card', { timeout: 10000 });

        const products = await page.evaluate((prodElements) => {
            prodElements = [];
        
            document.querySelectorAll('div.kds-Card').forEach(item => {
                const productNameElement = item.querySelector('[data-testid="cart-page-item-description"]');
                const productUnitPriceElement = item.querySelector('[data-testid="cart-page-item-unit-price"]');
                const productOriginalPriceElement = item.querySelector('s.kds-Price-original');
                const productSizeElement = item.querySelector('[data-testid="cart-page-item-sizing"]');
                const productImgElement = item.querySelector('.kds-Image-img');

                if (productNameElement && productUnitPriceElement) {
                    const productName = productNameElement.innerText.trim();
                    const productPrice = productOriginalPriceElement ? productOriginalPriceElement.innerText.trim().replace('$','') 
                                                       :  productUnitPriceElement.value.trim();
                    const productSale = productOriginalPriceElement ? productUnitPriceElement.value.trim() : null;
                    const productSize = productSizeElement ? productSizeElement.innerText.trim() : null;
                    
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

        console.log(products.length);
        return products;
    }
}

module.exports = picknsave; 
