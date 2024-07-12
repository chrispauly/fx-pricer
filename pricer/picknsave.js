const picknsave = {
	async scraper({page, data}){
        const baseUrl = 'https://www.picknsave.com/search';
        const searchTerm = data.searchTerm;
        const city = data.city;
        const zip = data.zip;

        const queryParams = new URLSearchParams({
            query: searchTerm,
            searchType: "default_search"
        });
    
        const fullUrl = `${baseUrl}?${queryParams.toString()}`;

		console.log(`Navigating to ${fullUrl}...`);

        await page.goto(`${fullUrl}`, { waitUntil: 'networkidle2' });  //networkidle0 || domcontentloaded

        await page.waitForSelector('div.kds-Card');

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

        return products;
    }
}

module.exports = picknsave; 
