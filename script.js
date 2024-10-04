
let destinations = [];
let itinerary = []; 

async function fetchDestinations() {
    try {
        const response = await fetch('destinations.json');
        if (!response.ok) throw new Error('Network response was not ok');
        destinations = await response.json();
        console.log('Destinations loaded:', destinations);
    } catch (error) {
        console.error('Error fetching destinations:', error);
    }
}

fetchDestinations();

function displayResults(cityData) {
    const resultsSection = document.getElementById('results');
    resultsSection.innerHTML = '';

    if (cityData) {
        const cityInfo = `
            <h2 class="city-name">${cityData.city}</h2> 
            <img src="${cityData.image}" alt="${cityData.city}"  class="city-image">
            <h3>Attraction Places:</h3>
            <div class="attraction-places">
                ${cityData.attraction_places.map(place => `
                    <div class="attraction-item">
                        <img src="${place.image}" alt="${place.name}" class="attraction-image">
                        <span>${place.name}</span>
                    </div>
                `).join('')}
            </div>
            <h3>Activities:</h3>
            <ul class="activities">
                ${cityData.activities.map(activity => `<li>${activity}</li>`).join('')}
            </ul>
            <h3>Prices:</h3>
            <ul class="prices">
                ${cityData.prices.map(price => `<li>$${price}</li>`).join('')}
                <p>Favorable Season: ${cityData.favorable_season}</p>
                <p>Best Duration of Tour: ${cityData.best_duration_of_tour}</p>
                <p>Cost to Travel: ${cityData.cost_to_travel}</p>
            </ul>
            
            <h3>Hotels:</h3>
            <div class="hotels">
                ${cityData.hotels.map(hotel => `
                    <div class="hotel-item">
                        <img src="${hotel.image}" alt="${hotel.name}" class="hotel-image">
                        <span>${hotel.name}</span>
                    </div>
                `).join('')}
            </div>
            <button id="save-trip-btn">Save to Itinerary</button> <!-- Save button -->
        `;
        resultsSection.innerHTML = cityInfo;
        document.getElementById('save-trip-btn').addEventListener('click', () => saveToItinerary(cityData));
    } else {
        resultsSection.innerHTML = '<p>No results found.</p>';
    }
}


function saveToItinerary(cityData) {
    let storedItinerary = JSON.parse(localStorage.getItem('itinerary')) || [];
    if (!storedItinerary.some(city => city.city === cityData.city)) {
        storedItinerary.push(cityData); 
        localStorage.setItem('itinerary', JSON.stringify(storedItinerary)); 
        alert(`${cityData.city} added to your itinerary!`);
    } else {
        alert(`${cityData.city} is already in your itinerary.`);
    }
}


function removeFromItinerary(cityName) {
    let storedItinerary = JSON.parse(localStorage.getItem('itinerary')) || [];
    storedItinerary = storedItinerary.filter(city => city.city !== cityName);
    localStorage.setItem('itinerary', JSON.stringify(storedItinerary));
    displayItinerary();
}
function searchCity() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const foundCity = destinations.find(destination => destination.city.toLowerCase() === searchInput);
    displayResults(foundCity);
}
function displayItinerary() {
    const resultsSection = document.getElementById('results');
    const storedItinerary = JSON.parse(localStorage.getItem('itinerary')) || [];

    if (storedItinerary.length > 0) {
        resultsSection.innerHTML = `<h2>Your Itinerary:</h2>`;
        storedItinerary.forEach(city => {
            resultsSection.innerHTML += `
                <h3>${city.city}</h3>
                <img src="${city.image}" alt="${city.city}" style="width: 500px; height: 200px;">
                <p>Attractions: ${city.attraction_places.map(place => place.name).join(', ')}</p>
                <p>Favorable Season: ${city.favorable_season}</p>
                <p>Best Duration of Tour: ${city.best_duration_of_tour}</p>
                <p>Cost to Travel: ${city.cost_to_travel}</p>
                <button class="remove-trip-btn" data-city="${city.city}">Remove</button>
                <hr>
            `;
        });
        document.querySelectorAll('.remove-trip-btn').forEach(button => {
            button.addEventListener('click', function () {
                const cityName = this.getAttribute('data-city');
                removeFromItinerary(cityName);
            });
        });
    } else {
        resultsSection.innerHTML = '<p>Your itinerary is empty.</p>';
    }
}
document.getElementById('search').addEventListener('input', searchCity);
const itineraryButton = document.createElement('button');
itineraryButton.textContent = 'View Itinerary';
itineraryButton.id = 'view-itinerary-btn';
document.body.appendChild(itineraryButton);
document.getElementById('view-itinerary-btn').addEventListener('click', displayItinerary);

// style="width: 1000px; height: 400px; margin-left: 100px; margin-top: -35px;"