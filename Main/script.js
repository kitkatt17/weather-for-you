// Global variables
var searchHistory = [];
// calling the weather api from "openweathermap.org" with the string labeled 'weatherapirooturl"
var weatherApiRootUrl = 'https://api.openweathermap.org';
// have to use an api key to even be able to call the api from openweathermap
var weatherApiKey = '9dbfbbf1708abb3bea8fa218b6efa8e1';
// to display the city
var city;
// fetching the request to get the data from the openweathermap api to get the weather data from any city you're looking at by using the api key to even get it started
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=9dbfbbf1708abb3bea8fa218b6efa8e1" + weatherApiKey;
// the fetch request for the queryURL to have the application work the way its inputed above
fetch(queryURL)

// DOM element references
// with this you will be able to reference specific elements within the HTML document.
var queryForm = document.querySelector('#search-form');
var queryInput = document.querySelector('#search-input');
var currentDayContainer = document.querySelector('#today');
var weatherContainer = document.querySelector('#forecast');
var searchHistoryContainer = document.querySelector('#history');

// the timezone plugins to 'day.js' for the application to catch the right data
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// Function to display the search history list.
// So when you type a city/place in the search bar it will automatically come up
function renderSearchHistory() {
  searchHistoryContainer.innerHTML = '';

  // Starts at end of history array and count down to then show the most recent at the top.
  // A for loop that will iterate over the 'searchHistory' array that will start from the last element -1 and will continue till it reaches the first element 0
  // the i variable is currently used to keep track of the current index
  for (var i = searchHistory.length - 1; i >= 0; i--) {
    // creates a HTML button element
    var btn = document.createElement('button');
    // 'setAttribute' is used to set the attribute of the 'button' for the specific Id's written below in the parenthesis
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-controls', 'today forecast');
    // the 'add' method is used to add two CSS class names to the button
    btn.classList.add('history-btn', 'btn-history');

    // `data-search` allows access to city name when click handler is invoked
    btn.setAttribute('data-search', searchHistory[i]);
    // This will ensures that the button displays the corresponding search history value as its text.
    btn.textContent = searchHistory[i];
    // the button is appended to a container referenced in the HTML document for display
    searchHistoryContainer.append(btn);
  }
}

// Function to update history in local storage then updates displayed history.
function appendToHistory(search) {
  // If there is no search term return function
  if (searchHistory.indexOf(search) !== -1) {
    return;
  }
  searchHistory.push(search);
  // Stores the 'search history' in the browser localStorage
  localStorage.setItem('search-history', JSON.stringify(searchHistory));
  // This renders the search history on the webpage itself
  renderSearchHistory();
}

// Search history from local storage function
function initSearchHistory() {
  var storedHistory = localStorage.getItem('search-history');
  // This checks if there is a search history stored in the localStorage
  if (storedHistory) {
    // JSON.parse is used to convert the string 'storedHistory' back into Javascript object/array (it parses the stored history back into an array)
    searchHistory = JSON.parse(storedHistory);
  }
  // renders the search history
  renderSearchHistory();
}

// Function to display the current weather data fetched from OpenWeather api.
function renderCurrentWeather(city, weather) {
  // This will then display the dating format with 'day.js'
  var date = dayjs().format('M/D/YYYY');
  // Storing response data from our fetch request in variables; temp, speed of wind, and humidity
  var temperatureF = weather.main.temp;
  var windMph = weather.wind.speed;
  var humidity = weather.main.humidity;
  // Using icons from the openweathermap.org
  var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  // This will receive the valid weather description by retrieving the description
  var iconDescription = weather.weather[0].description || weather[0].main;

  // The createElement method is called on the document object, allowing the creation of an HTML element in memory
  var card = document.createElement('div');
  // This line creates another <div> element and assigns it to the 'cardBody'
  var cardBody = document.createElement('div');
  // This line creates an <h2> element and assigns it to the 'var heading'
  var heading = document.createElement('h2');
  // This line creates an <img> element and assigns it to the variable 'forecastIcon'
  var forecastIcon = document.createElement('img');
  // This line creates a <p> element and assigns it to the variable 'tempElement'
  var tempElement = document.createElement('p');
  // this line creates another <p> element and assigns it to the variable 'windElement'
  var windElement = document.createElement('p');
  // This line creates another <p> element and assigns it to the variable 'humidityEl'
  var humidityEl = document.createElement('p');

  // This line sets the class attribute of 'card' element to 'card'
  card.setAttribute('class', 'card');
  // This line sets the class attribute of 'cardBody' element to 'card-body'
  cardBody.setAttribute('class', 'card-body');
  // The 'append' is called on the card element, and the cardBody element is passed as an argument.
  card.append(cardBody);

  // This line sets the class attribute of the heading element to 'h3 card-title'
  heading.setAttribute('class', 'h3 card-title');
  // this line sets the class attribute of the tempElement element to 'card-text'
  tempElement.setAttribute('class', 'card-text');
  // This line sets the class attribute of the windElement element to 'card-text'
  windElement.setAttribute('class', 'card-text');
  // this line sets the class attribute of the humidityEl element to 'card-text'
  humidityEl.setAttribute('class', 'card-text');

  // uses template literals, will display the city name and date as the heading text
  heading.textContent = `${city} (${date})`;
  // This line sets the src attribute of the forecastIcon element to the value of iconUrl
  forecastIcon.setAttribute('src', iconUrl);
  // This line sets the alt attribute of the forecastIcon element to the value of iconDescription
  forecastIcon.setAttribute('alt', iconDescription);
  // This line sets the class attribute of the forecastIcon element to 'weather-img'
  forecastIcon.setAttribute('class', 'weather-img');
  // This line appends the forecastIcon element as a child to the heading element
  heading.append(forecastIcon);
  // uses template literals, will display the temperature in Fahrenheit as part of the text
  tempElement.textContent = `Temp: ${temperatureF}°F`;
  // uses template literals, will display the wind speed in miles per hour as part of the text
  windElement.textContent = `Wind: ${windMph} MPH`;
  // uses template literals, will display the humidity percentage as part of the text
  humidityEl.textContent = `Humidity: ${humidity} %`;
  // This groups and structures the elements within the cardBody element
  cardBody.append(heading, tempElement, windElement, humidityEl);

  // This line sets 'innerHTML' property of the currentDayContainer element to an empty string
  currentDayContainer.innerHTML = '';
  // This places 'card' element inside the currentDayContainer, is a nested child element
  currentDayContainer.append(card);
}

// Function to display a weather card given an object from open weather api
// daily forecast.
// Extracting the sepcific data (weather,temp,humidity,windmph) from 'forecast' object
function renderWeatherCard(forecast) {
  // variables for data from api
  var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
  var iconDescription = forecast.weather[0].description;
  var temperatureF = forecast.main.temp;
  var humidity = forecast.main.humidity;
  var windMph = forecast.wind.speed;

  // elements for a card
  // Creating HTML elements
  // The (forecastIcon, tempElement, windElement, and humidityEl) elements is representing the specific content in card
  var col = document.createElement('div');
  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var cardTitle = document.createElement('h5');
  var forecastIcon = document.createElement('img');
  var tempElement = document.createElement('p');
  var windElement = document.createElement('p');
  var humidityEl = document.createElement('p');

  // Appending the elements to the respective parent elements
  // will allow you to organize and structure the content within the HTML doc
  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, forecastIcon, tempElement, windElement, humidityEl);

  // adding classes to these elements
  // These classes are useful for Bootstrap for styling 
  col.setAttribute('class', 'col-md');
  col.classList.add('five-day-card');
  card.setAttribute('class', 'card bg-primary h-100 text-white');
  cardBody.setAttribute('class', 'card-body p-2');
  cardTitle.setAttribute('class', 'card-title');
  tempElement.setAttribute('class', 'card-text');
  windElement.setAttribute('class', 'card-text');
  humidityEl.setAttribute('class', 'card-text');

  // Adding content to elements
  // assigns the formatted date string to the textContent property of the cardTitle element
  cardTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
  // manipulating the text content and attributes of these elements, can then update the displayed info in the HTML doc
  forecastIcon.setAttribute('src', iconUrl);
  forecastIcon.setAttribute('alt', iconDescription);
  tempElement.textContent = `Temp: ${temperatureF} °F`;
  windElement.textContent = `Wind: ${windMph} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  // appends the col element as a child to the weatherContainer element
  weatherContainer.append(col);
}

// Function to display 5 day forecast.
function renderWeather(dailyForecast) {
  // Create unix timestamps for start and end of 5 day forecast
  var startDate = dayjs().add(1, 'day').startOf('day').unix();
  var endDate = dayjs().add(6, 'day').startOf('day').unix();

  // these lines of code create new HTML elements
  var headingCol = document.createElement('div');
  var heading = document.createElement('h4');

  // manipulating the attributes and content of HTML elements
  headingCol.setAttribute('class', 'col-12');
  heading.textContent = '5-Day Forecast:';
  // then appending the heading element as a child to the headingCol
  headingCol.append(heading);

  // Sets innerHTML property of the weatherContainer element to an empty string
  // appends the headingCol element as a child to the weatherContainer element
  weatherContainer.innerHTML = '';
  weatherContainer.append(headingCol);

  for (var i = 0; i < dailyForecast.length; i++) {

    // First filters through all of the data and returns only data that falls between one day after the current data and up to 5 days later.
    if (dailyForecast[i].dt >= startDate && dailyForecast[i].dt < endDate) {

      // Then filters through the data and returns only data captured at noon for each day.
      if (dailyForecast[i].dt_txt.slice(11, 13) == "12") {
        renderWeatherCard(dailyForecast[i]);
      }
    }
  }
}
// rendering the current weather information and the weather forecast
function renderItems(city, data) {
  renderCurrentWeather(city, data.list[0], data.city.timezone);
  renderWeather(data.list);
}

// Fetches weather data for given location from the Weather Geolocation
// endpoint; then, calls functions to display current and forecast weather data.
function fetchWeather(location) {
  var { lat } = location;
  var { lon } = location;
  var city = location.name;

  // fetching the request to get the data from the openweathermap api to get the weather data from any city you're looking at by using the api key
  var apiUrl = `${weatherApiRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;

  // performs an HTTP request to retrieve data from the specified API endpoint (apiUrl)
  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      renderItems(city, data);
    })
    .catch(function (err) {
      console.error(err);
    });
}

// fetching the coordinates
// fetching the request to get the data from the openweathermap api
function fetchCoords(search) {
  var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;


  // performs an HTTP request to retrieve data
  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert('Location not found');
        // if location not found it will return this
      } else {
        appendToHistory(search);
        fetchWeather(data[0]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

function handleSearchFormSubmit(e) {
  // Don't continue if there is nothing in the search form
  if (!queryInput.value) {
    return;
  }

  // This line prevents the default behavior of the event
  e.preventDefault();
  var search = queryInput.value.trim();
  fetchCoords(search);
  // this will effectively clear the search input field after the search form has been submitted
  queryInput.value = '';
}

function handleSearchHistoryClick(e) {
  // Don't do search if current elements is not a search history button
  if (!e.target.matches('.btn-history')) {
    return;
  }

  // This line assigns the element that triggered the event (e.target) to the btn 
  var btn = e.target;
  // stores the search query associated with the clicked search history button
  var search = btn.getAttribute('data-search');
  // fetching the coordinates 
  fetchCoords(search);
}

// Adding eventlisteners to the submit event of a search form, and to the click event of search history container
// Initializing the search history functionality
initSearchHistory();
queryForm.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);
