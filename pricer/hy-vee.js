const festival = {
	async scraper({page, data}){
        const baseUrl = 'https://www.hy-vee.com/';
        const searchTerm = data.searchTerm;
        const city = data.city;
        const zip = data.zip;

		console.log(`Navigating to ${baseUrl}...`);

        await page.goto(`${baseUrl}`, { waitUntil: 'networkidle2' });  //networkidle0 || domcontentloaded
         
        const btnSearch = await page.waitForSelector('button[aria-label="Search"]', { timeout: 10000 });
        btnSearch.click();

        await page.waitForSelector('#search-input', { timeout: 10000 });
        await page.type('#search-input', searchTerm);
        await page.keyboard.press('Enter');

        await page.waitForNavigation();
        await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });

        // await page.click('.fp-btn-mystore');
        
        // await page.waitForSelector('.search', { timeout: 10000 });
        // await page.click('.search');
        
        // await page.waitForSelector('#fp-input-search-c-8', { timeout: 10000 });
        // await page.type('#fp-input-search-c-8', searchTerm);
        // await page.keyboard.press('Enter');
        
        // await page.waitForSelector('.fp-result-list', { timeout: 10000 });
        
        // if fp-result-list does not return, means no results for search term
        console.log(`Loading hy-vee prdoduct data...`);

        const products = await page.evaluate((prodElements) => {
            prodElements = [];
        
            // document.querySelectorAll('div.fp-item-content').forEach(item => {
            //     const productNameElement = item.querySelector('div.fp-item-detail > div.fp-item-name > a');
            //     const productPriceElement = item.querySelector('div.fp-item-detail > div.fp-item-price > span.fp-item-base-price');
            //     const productSaleElement = item.querySelector('div.fp-item-detail > div.fp-item-sale > span.fp-item-sale-date');
            //     const productImgElement = item.querySelector('div.fp-item-image > a > img');

            //     if (productNameElement && productPriceElement) {
            //         const productName = productNameElement.textContent.trim();
            //         const productPrice = productPriceElement.innerText.trim();
            //         const productSale = productSaleElement ? productSaleElement.innerText.trim().replace('Sale price:\n','') : null;
                    
            //         // try to get UPC
            //         let imgSrc = productImgElement ? productImgElement.src.trim() : '';
            //         let upcMatch = imgSrc.match(/images\.freshop\.com\/(\d+)/);
            //         const productUpc = upcMatch ? upcMatch[1] : null;
                    
            //         // Add the product data to the array
            //         prodElements.push({
            //             name: productName,
            //             price: productPrice,
            //             sale: productSale,
            //             upc: productUpc
            //         });
            //     }
            // });
        
            return prodElements;
	    });

        return products;
    }
}

module.exports = festival; 
