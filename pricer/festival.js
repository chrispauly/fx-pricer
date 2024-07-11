const festival = {
	async scraper({page, data}){
        const baseUrl = 'https://www.festfoods.com/stores/';
        const searchTerm = data.searchTerm;
        const city = data.city;
        const zip = data.zip;

		console.log(`Navigating to ${baseUrl}${city}...`);

        await page.goto(`${baseUrl}${city}`, { waitUntil: 'networkidle2' });  //networkidle0 || domcontentloaded
         
        await page.waitForSelector('.fp-btn-mystore', { timeout: 10000 });  // Festival foods slow loads this button
        await page.hover('.fp-btn-mystore');
        await page.click('.fp-btn-mystore');
        
        await page.waitForSelector('.search', { timeout: 10000 });
        await page.hover('.search');
        await page.click('.search');
        
        await page.waitForSelector('input[aria-label="Search products ..."]', { timeout: 10000 });
        await page.type('input[aria-label="Search products ..."]', searchTerm);
        await page.keyboard.press('Enter');
        
        await page.waitForSelector('.fp-result-list', { timeout: 10000 });
        
// if fp-result-list does not return, means no results for search term

        const products = await page.evaluate((prodElements) => {
            prodElements = [];
        
            document.querySelectorAll('div.fp-item-content').forEach(item => {
                const productNameElement = item.querySelector('div.fp-item-detail > div.fp-item-name > a');
                const productPriceElement = item.querySelector('div.fp-item-detail > div.fp-item-price > span.fp-item-base-price');
                const productSaleElement = item.querySelector('div.fp-item-detail > div.fp-item-sale > span.fp-item-sale-date');
                //const productImgElement = item.querySelector('div.fp-item-image > a > img');
                const productSizeElement = item.querySelector('div.fp-item-detail > div.fp-item-price > span.fp-item-size');

                if (productNameElement && productPriceElement) {
                    const productName = productNameElement.textContent.trim();
                    const productPrice = productPriceElement.innerText.trim();
                    const productSale = productSaleElement ? productSaleElement.innerText.trim().replace('Sale price:\n','') : null;
                    const productSize = productSizeElement ? productSizeElement.innerText.trim() : null;
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

        return products;
    }
}

module.exports = festival; 
