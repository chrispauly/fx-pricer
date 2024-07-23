const groceryStores = [];

groceryStores.push({ fxn: require('./festival'), name: 'Festival-Verona', imglink: "https://www.festfoods.com/wp-content/uploads/logo-2.png" });
groceryStores.push({ fxn: require('./picknsave'), name: 'PickNSave', imglink: "https://www.picknsave.com/content/v2/binary/image/picknsave_svg_logo--freshcart_picknsave_color_logo--picknsave.svg" });
groceryStores.push({ fxn: require('./woodmans'), name: 'Woodmans-West', imglink: "https://www.instacart.com/assets/domains/store_configuration/logo/1205/c2f851f7-56de-4f36-a942-3feb9415194e.png" });
groceryStores.push({ fxn: require('./hy-vee'), name: 'Hy-Vee', imglink: "https://upload.wikimedia.org/wikipedia/en/a/ae/Hy-Vee.svg" });
groceryStores.push({ fxn: require('./millers'), name: 'Millers-Verona', imglink: "https://www.millerandsonssupermarket.com/wp-content/themes/fp-wp-b-millers/resources/images/logo/logo.jpg" });

const fs = require('fs');
// Function to read file contents and return a Promise
const readFileAsync = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const storesHtml = async () => {
    try {
        // Path to your file
        const filePath = './stores.html';
        const data = await readFileAsync(filePath);
        const storeNames = groceryStores.map(store => {
            return { name: store.name };
        });

        updatedData = data.replace('{jsonStores}', JSON.stringify(storeNames));

        return updatedData;
    } catch (err) {
        console.error('Error reading the file:', err);
    }
};


module.exports = { stores: groceryStores, storesHtml };