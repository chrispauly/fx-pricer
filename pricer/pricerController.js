const groceryStores = require('./groceryStores');

async function scrapeAll(cluster, searchTerm, storeNames) {
  const productResults = [];

  await Promise.all(groceryStores.stores.map(async (item) => {
    try {
      if(storeNames.includes(item.name)) {
        console.log(`${item.name} started`);
        const scraped = await cluster.execute({ searchTerm: searchTerm, city: 'verona', zip: '53719' }, item.fxn.scraper);
        productResults.push({ name: item.name, imglink: item.imglink, products: scraped });
        console.log(`${item.name} finished`);
      }
    }
    catch (err) {
      console.log(`${item.name} scrapeAll error => `, err);
    }
  }));

  // let groceryData = {};
  // await Promise.all([
  //     groceryData['festival'] = await festival.scraper(browser, 'verona', searchTerm),
  //     groceryData['picknsave'] = await picknsave.scraper(browser, searchTerm),
  //     groceryData['woodmans'] = await woodmans.scraper(browser, '53719', searchTerm),
  //     groceryData['hyvee'] = await hyvee.scraper(browser, searchTerm),
  //     groceryData['millers'] = await millers.scraper(browser, 'verona', searchTerm)
  //   ]);

  return productResults;
}

module.exports = (cluster, searchTerm, storeNames) => scrapeAll(cluster, searchTerm, storeNames)