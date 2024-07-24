let sessionManager = require("./sessionManager");

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

		console.log(`PickNSave: Navigating to ${fullUrl}...`);
        page.setDefaultNavigationTimeout(120000);       // default was 30000

        await page.goto(`${fullUrl}`, { waitUntil: 'networkidle2' });  //networkidle0 || domcontentloaded
        console.log(`PickNSave: Waiting for page to load...`);

        await page.waitForSelector('div.kds-Card');

        console.log(`PickNSave: Sending eval to browser to load products...`);
        const products = await page.evaluate((prodElements) => {
            prodElements = [];
        
            document.querySelectorAll('div.kds-Card').forEach(item => {
                const productNameElement = item.querySelector('[data-testid="cart-page-item-description"]');
                const productUnitPriceElement = item.querySelector('[data-testid="cart-page-item-unit-price"]');
                const productOriginalPriceElement = item.querySelector('s.kds-Price-original');
                const productSizeElement = item.querySelector('[data-testid="cart-page-item-sizing"]');
                const productImgElement = item.querySelector('.kds-Image-img');
                const productCouponElement = item.querySelector('[data-testid="savings-zone-coupon-text"]');
                const manyCouponsElement = item.querySelector('[data-testid="open-coupon-modal-button"]');

                const aboutElement = item.querySelector('.kds-Price-relativePrefix');

                if (productNameElement && productUnitPriceElement) {
                    const productName = productNameElement.innerText.trim();
                    const productPrice = productOriginalPriceElement ? productOriginalPriceElement.innerText.trim().replace('$','') 
                                                                     :  productUnitPriceElement.value.trim();
                    const productSale = productOriginalPriceElement ? productUnitPriceElement.value.trim() : null;
                    const productSize = productSizeElement ? productSizeElement.innerText.replace(" |", "")
                                                                                         .replace("NET WT","")
                                                                                         .trim()
                                                                                         : null;
                    const imgSrc = productImgElement && productImgElement.src ? productImgElement.src.trim() : null;

                    const manyCoupons = manyCouponsElement && !/View Offer/.test(manyCouponsElement.innerText) ? ` (more offers available)` : '';
                    const couponText =  productCouponElement ? `${productCouponElement.innerText.trim()}${manyCoupons}` : null;

                    // Deal with produce aboutElement
                    const producePrice = aboutElement ? productSize.split("/")[0].replace("$","").trim() : null;
                    const produceSize = aboutElement ? productSize.split("/")[1].trim() : null;

                    // Add the product data to the array
                    prodElements.push({
                        name: productName,
                        price: producePrice ?? productPrice,
                        sale: productSale,
                        size: produceSize ?? productSize,
                        coupon: couponText,
                        img: imgSrc,
                    });
                }
            });
        
            return prodElements;
	    });

        await sessionManager.saveSession(page, 'picknsave', city, zip);
        return products;
    }
}

module.exports = picknsave; 
