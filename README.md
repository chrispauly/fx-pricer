A Verona, WI area grocery store website data scraper to compare prices on products

Code created with inspiration from the following articles:
* https://anthonychu.ca/post/azure-functions-headless-chromium-puppeteer-playwright/
* https://scrapingant.com/blog/puppeteer-tricks-to-avoid-detection-and-make-web-scraping-easier
* https://www.digitalocean.com/community/tutorials/how-to-scrape-a-website-using-node-js-and-puppeteer
* https://stackoverflow.com/a/46086037


To Install and Deploy
Make sure you have the following installed locally
NodeJS
Azure func tools 
az CLI


Run the following command to deploy
func azure functionapp publish fx-pricer --build remote


Sample call
https://fx-pricer.azurewebsites.net/api/pricer?search=cheerios&store=PickNSave|Festival-Verona|Millers-Verona



