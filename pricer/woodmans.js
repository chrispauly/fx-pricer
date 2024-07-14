const woodmans = {
	async scraper({page, data}){
        const baseUrl = 'https://shopwoodmans.com/';
        const searchTerm = data.searchTerm;
        const city = data.city;
        const zip = data.zip;

		console.log(`Navigating to ${baseUrl}...`);
        page.setDefaultNavigationTimeout(120000);       // default was 30000

        await page.goto(`${baseUrl}`, { waitUntil: 'networkidle0' });  //networkidle0 || domcontentloaded
         
        console.log("Woodman's loaded");
        await page.waitForSelector('input');
        console.log("Found input");
        await page.type('input', zip);
        console.log(`Entered ${zip}`);
        await page.keyboard.press('Enter');
        await page.waitForNavigation();

        console.log("Searching for In-Store button...");

        //const instoreBtn = await page.waitForXPath('//button/span/span[text() = "In-Store"]');
        const instoreBtn = await page.waitForSelector('xpath///button/span/span[text() = "In-Store"]');

        if(instoreBtn) { instoreBtn.click(); }

        await page.waitForSelector('input#search-bar-input');
        await page.type('input#search-bar-input', searchTerm);
        await page.keyboard.press('Enter');

        await page.waitForSelector('div[aria-label="Product"]');
        //await page.waitForSelector('xpath///button/span[text() = "Load more"]');

        await new Promise(r => setTimeout(r, 2000));

        const products = await page.evaluate((prodElements) => {
            prodElements = [];
        
            document.querySelectorAll('div[aria-label="Product"]').forEach(item => {
                const productNameElement = item.querySelector('a > div > div > h2');
                const productPriceElement = item.querySelector('div.e-1jioxed > span');
                const productSalePriceElement = item.querySelector('div.e-hlbpyw > span');
                const productOriginalPriceElement = item.querySelector('div.e-1rr4qq7 > span');
                const productDealElement = item.querySelector('div.e-81yhrs');
                //const productImgElement = item.querySelector('div.fp-item-image > a > img');
                const productSizeElement = item.querySelector('div.e-122cwne'); //item.querySelector('a > div > div > div[title]');

                if (productNameElement && (productPriceElement || productSalePriceElement)) {
                    const productName = productNameElement.textContent.trim();
                    const productPrice = (productPriceElement || productSalePriceElement) ? 
                                         (productPriceElement || productSalePriceElement).innerText.trim() : null;
                    const productSale = (productSalePriceElement || productDealElement) ?
                                        (productSalePriceElement || productDealElement).innerText.trim() : null;
                    const productSize = productSizeElement ? productSizeElement.title.trim() : null;
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

module.exports = woodmans; 
