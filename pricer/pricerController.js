const festival = require('./festival');
const picknsave = require('./picknsave');
const woodmans = require('./woodmans');
const hyvee = require('./hy-vee');
const millers = require('./millers');

async function scrapeAll(browserInstance, searchTerm){
	let browser;
	try{
		browser = await browserInstance;
		// let groceryData = [];
        // groceryData.push({ name: 'Festival-Verona', products: {}, imglink: "https://www.festfoods.com/wp-content/uploads/logo-2.png" });
        // groceryData.push({ name: 'PickNSave',       products: {}, imglink: "https://www.picknsave.com/content/v2/binary/image/picknsave_svg_logo--freshcart_picknsave_color_logo--picknsave.svg" });
        // groceryData.push({ name: 'Woodmans-West',   products: {}, imglink: "https://www.instacart.com/assets/domains/store_configuration/logo/1205/c2f851f7-56de-4f36-a942-3feb9415194e.png" });
        // groceryData.push({ name: 'Hy-Vee',          products: {}, imglink: "https://hy-vee.com/images/favicon.ico" });
        // groceryData.push({ name: 'Millers-Verona',  products: {}, imglink: "https://www.millerandsonssupermarket.com/wp-content/themes/fp-wp-b-millers/resources/images/logo/logo.jpg" });

		// // Call the scraper for different set of books to be scraped
        // await Promise.allSettled(groceryData.map(async (item) => { 
        //     switch(item.name){
        //         case 'Festival-Verona': 
        //             item.products = await festival.scraper(browser, 'verona', searchTerm);
        //             console.log('Finished Festival-Verona');
        //             break;
        //         case 'PickNSave':
        //             item.products = await picknsave.scraper(browser, searchTerm);
        //             console.log('Finished PickNSave');
        //             break;
        //         case 'Woodmans-West':
        //             item.products = await woodmans.scraper(browser, '53719', searchTerm);
        //             console.log('Finished Woodmans-West');
        //             break;
        //         case 'Hy-Vee':
        //             item.products = await hyvee.scraper(browser, searchTerm);
        //             console.log('Finished Hy-Vee');
        //             break;
        //         case 'Millers-Verona':
        //             item.products = await millers.scraper(browser, 'verona', searchTerm);
        //             console.log('Finished Millers-Verona');
        //             break;
        //     }
        //   }));

        let groceryData = {};
        await Promise.all([
            groceryData['festival'] = await festival.scraper(browser, 'verona', searchTerm),
            groceryData['picknsave'] =  await picknsave.scraper(browser, searchTerm),
            groceryData['woodmans'] = await woodmans.scraper(browser, '53719', searchTerm),
            groceryData['hyvee'] = await hyvee.scraper(browser, searchTerm),
            groceryData['millers'] = await millers.scraper(browser, 'verona', searchTerm)
          ]);
	
        
		await browser.close();
        return groceryData;
	}
	catch(err){
		console.log("scrapeAll error => ", err);
	}
}

module.exports = (browserInstance, searchTerm) => scrapeAll(browserInstance, searchTerm)