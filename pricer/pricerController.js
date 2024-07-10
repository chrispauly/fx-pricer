const festival = require('./festival');
const picknsave = require('./picknsave');
const woodmans = require('./woodmans');
const hyvee = require('./hy-vee');
const millers = require('./millers');

async function scrapeAll(browserInstance, searchTerm){
	let browser;
	try{
		browser = await browserInstance;
        const productResults = [];
        
        const groceryData = [];
        //groceryData.push({ fxn: festival,  name: 'Festival-Verona', imglink: "https://www.festfoods.com/wp-content/uploads/logo-2.png" });
        groceryData.push({ fxn: picknsave, name: 'PickNSave',       imglink: "https://www.picknsave.com/content/v2/binary/image/picknsave_svg_logo--freshcart_picknsave_color_logo--picknsave.svg" });
        //groceryData.push({ fxn: woodmans,  name: 'Woodmans-West',   imglink: "https://www.instacart.com/assets/domains/store_configuration/logo/1205/c2f851f7-56de-4f36-a942-3feb9415194e.png" });
        //groceryData.push({ fxn: hyvee,     name: 'Hy-Vee',          imglink: "https://hy-vee.com/images/favicon.ico" });
        //groceryData.push({ fxn: millers,   name: 'Millers-Verona',  imglink: "https://www.millerandsonssupermarket.com/wp-content/themes/fp-wp-b-millers/resources/images/logo/logo.jpg" });

		// Call the scraper for different set of books to be scraped
        await Promise.all(groceryData.map(async (item) => { 
            const scraped = await item.fxn.scraper(browser, searchTerm, 'verona', '53593');
            productResults.push({ name: item.name, imglink: item.imglink, products: scraped });
            console.log(`Finished ${item.name}`);
          }));

        // let groceryData = {};
        // await Promise.all([
        //     groceryData['festival'] = await festival.scraper(browser, 'verona', searchTerm),
        //     groceryData['picknsave'] = await picknsave.scraper(browser, searchTerm),
        //     groceryData['woodmans'] = await woodmans.scraper(browser, '53719', searchTerm),
        //     groceryData['hyvee'] = await hyvee.scraper(browser, searchTerm),
        //     groceryData['millers'] = await millers.scraper(browser, 'verona', searchTerm)
        //   ]);
	
		await browser.close();
        return productResults;
	}
	catch(err){
		console.log("scrapeAll error => ", err);
	}
}

module.exports = (browserInstance, searchTerm) => scrapeAll(browserInstance, searchTerm)