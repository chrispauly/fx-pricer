let sessionManager = require("./sessionManager");

const hyvee = {
	async scraper({page, data}) {
        const baseUrl = 'https://www.hy-vee.com/';
        const searchTerm = data.searchTerm;
        const city = data.city;
        const zip = data.zip;

		console.log(`Hy-Vee: Navigating to ${baseUrl}...`);
        page.setDefaultNavigationTimeout(120000);       // default was 30000

        await page.goto(`${baseUrl}`, { waitUntil: 'networkidle2' });  //networkidle0 || domcontentloaded
         
        console.log(`Hy-Vee: Waiting for search button...`);
        const btnSearch = await page.waitForSelector('button[aria-label="Search"]');
        btnSearch.click();
        console.log(`Hy-Vee: Clicked search button...`);

        await page.waitForSelector('#search-input');
        await page.type('#search-input', searchTerm);
        await page.keyboard.press('Enter');
        console.log(`Hy-Vee: Added search term and pressed Enter...`);

        await page.waitForNavigation();
        await page.waitForSelector('[data-testid="product-card"]');

        console.log(`Hy-Vee: Sending eval to browser to load products...`);
        const products = await page.evaluate((prodElements) => {
            prodElements = [];
        
            document.querySelectorAll('[data-testid="product-card"]').forEach(item => {
                const productNameElement = item.querySelector('[data-testid="product-card-title"]');
                const productPriceElement = item.querySelector('p.price');
                const productBasePriceElement = item.querySelector('p.base-price');
                const productImgElement = item.querySelector('[data-testid="productImageContainer"] > img');
                const productSizeElement = item.querySelector('span.product-subtitle');

                if (productNameElement && productPriceElement) {
                    const productName = productNameElement.innerText.trim();
                    const productPrice = (productBasePriceElement || productPriceElement).innerText.trim();
                    const productSale = productBasePriceElement ? productPriceElement.innerText.trim() : null;
                    const productSize = productSizeElement ? productSizeElement.innerText.trim() : null;
                    const imgSrc = productImgElement ? productImgElement.src.trim() : null;

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

        await sessionManager.saveSession(page, 'hyvee', city, zip);
        return products;
    }
}

module.exports = hyvee; 
