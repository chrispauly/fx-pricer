document.addEventListener('DOMContentLoaded', () => {
    const dataContainer = document.getElementById('dataContainer');
    const savedDataContainer = document.getElementById('savedDataContainer');
    const toggleButton = document.getElementById('toggleButton');
    const searchTermInput = document.getElementById('searchTerm');
    const searchButton = document.getElementById('searchButton');

    // Function to save data to localStorage
    function saveData(queryParam, data) {
        const existingData = JSON.parse(localStorage.getItem('savedData')) || [];
        const timestamp = new Date().toISOString();
        existingData.push({ queryParam, data, timestamp });
        localStorage.setItem('savedData', JSON.stringify(existingData));
    }

    // Function to load and display data from localStorage
    function loadData() {
        const existingData = JSON.parse(localStorage.getItem('savedData')) || [];
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        // Clear out old data
        const validData = existingData.filter(entry => new Date(entry.timestamp) > thirtyDaysAgo);
        localStorage.setItem('savedData', JSON.stringify(validData));

        // Display valid data
        savedDataContainer.innerHTML = '';
        validData.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('entry');

            const headerDiv = document.createElement('div');
            headerDiv.classList.add('header');
            const queryParamDiv = document.createElement('div');
            queryParamDiv.textContent = entry.queryParam;
            const dateDiv = document.createElement('div');
            dateDiv.innerHTML = `${new Date(entry.timestamp).toLocaleDateString()} <span class="delete-button" onclick="deleteEntry(${index})">🗑️</span>`;
            headerDiv.appendChild(queryParamDiv);
            headerDiv.appendChild(dateDiv);

            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('details');
            entry.data.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.textContent = `Store: ${product.store}, Name: ${product.name}, Price: ${product.price}`;
                detailsDiv.appendChild(productDiv);
            });

            entryDiv.appendChild(headerDiv);
            entryDiv.appendChild(detailsDiv);
            savedDataContainer.appendChild(entryDiv);
        });
    }

    // Function to delete an entry
    window.deleteEntry = function(index) {
        const existingData = JSON.parse(localStorage.getItem('savedData')) || [];
        existingData.splice(index, 1);
        localStorage.setItem('savedData', JSON.stringify(existingData));
        loadData();
    };

    // Toggle the display of saved data
    toggleButton.addEventListener('click', () => {
        savedDataContainer.classList.toggle('collapsed');
    });

    // Function to fetch data from an API
    async function fetchData(queryParam) {
        try {
            const response = await fetch(`http://localhost:7071/api/pricer?search=${queryParam}&store=Festival-Verona`);
            const data = await response.json();
            saveData(queryParam, data);

            const dataDiv = document.createElement('div');
            dataDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            dataContainer.appendChild(dataDiv);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Event listener for the search button
    searchButton.addEventListener('click', () => {
        const queryParam = searchTermInput.value;
        if (queryParam) {
            fetchData(queryParam);
        } else {
            alert('Please enter a search term');
        }
    });

    // Load data on page load
    loadData();
});

