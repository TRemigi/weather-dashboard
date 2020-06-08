var pastSearchesEl = document.querySelector("#past-searches");
var cityInputEl = document.querySelector("#city-input");
var citySubmitEl = document.querySelector("#city-submit");
var weatherTodayEl = document.querySelector("#weather-today");
var weatherNextFiveEl = document.querySelector("#weather-next-five");
var searchHistory = [];
// function to handle search submission
var submitHandler = function (event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    // check if valid city
    if (city) {
        cityWeatherGetter(city);
    } else {
        alert("Please enter a valid city name");
    }
    cityInputEl.value = "";
};
// function to send button click to cityWeatherGetter function
var pastSearchClickHandler = function (event) {
    event.preventDefault();
    var city = event.target.id;
    cityWeatherGetter(city);
};
// function to make fetch request with user submitted info
var cityWeatherGetter = function (city) {
    // format the api
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=ca94ded639b01eb51cf633b5d0145205";
    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    searchSaver(data);
                    displayWeather(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect");
        });
};
// function to create elements based on response data
var displayWeather = function (data) {

    // create title
    weatherTodayEl.style.display = "flex";
    weatherTodayEl.innerHTML = "";
    var date = moment().format("L");
    var titleEl = document.createElement("h2");
    titleEl.setAttribute("class", "card-title font-weight-bold");
    titleEl.textContent = data.city.name + " " + date;
    // create icon
    var iconSpan = document.createElement("span");
    var weatherIcon = document.createElement("img");
    var iconId = data.list[0].weather[0].icon;
    weatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" +
        iconId +
        "@2x.png");
    iconSpan.appendChild(weatherIcon);
    titleEl.appendChild(iconSpan);
    weatherTodayEl.appendChild(titleEl);
    // create temperature
    var currentTemp = data.list[0].main.temp;
    var tempEl = document.createElement("h4");
    tempEl.textContent = "Temperature: " +
        currentTemp +
        " °F";
    tempEl.setAttribute("class", "card-text");
    weatherTodayEl.appendChild(tempEl);
    // create humidity
    var currentHumidity = data.list[0].main.humidity;
    var humidityEl = document.createElement("h4");
    humidityEl.textContent = "Humidity: " +
        currentHumidity +
        "%";
    humidityEl.setAttribute("class", "card-text");
    weatherTodayEl.appendChild(humidityEl);
    // create windspeed
    var currentWindspeed = data.list[0].wind.speed;
    var windspeedEl = document.createElement("h4");
    windspeedEl.textContent = "Windspeed: " +
        currentWindspeed +
        " MPH";
    windspeedEl.setAttribute("class", "card-text");
    weatherTodayEl.appendChild(windspeedEl);
    // save lat and lon for fetching uv index
    var lat = data.city.coord.lat;
    var lon = data.city.coord.lon;
    // send data to five day forecast function
    fiveDayCardCreator(data);
    uvIndexHandler(lat, lon);
    // fetch uv index
    // var uvApiUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=ca94ded639b01eb51cf633b5d0145205&lat=" + lat + "&lon=" + lon;
    // fetch(uvApiUrl)
    //     .then(function (response) {
    //         // request was successful
    //         if (response.ok) {
    //             response.json().then(function (data) {
    //                 var uvIndex = data.value;
    //                 // create uv index
    //                 var uvIndexEl = document.createElement("h4");
    //                 uvIndexEl.textContent = "UV Index: ";
    //                 uvIndexEl.setAttribute("class", "card-text");
    //                 var uvSpan = document.createElement("span");
    //                 uvSpan.textContent = uvIndex;
    //                 // style uv index
    //                 if (uvIndex <= 2) {
    //                     uvSpan.setAttribute("class", "bg-success rounded uv-span");
    //                 }
    //                 if (uvIndex >= 8) {
    //                     uvSpan.setAttribute("class", "bg-danger rounded uv-span");
    //                 } else {
    //                     uvSpan.setAttribute("class", "bg-warning rounded uv-span");
    //                 }
    //                 uvIndexEl.appendChild(uvSpan);
    //                 weatherTodayEl.appendChild(uvIndexEl);

    //             });
    //         } else {
    //             alert("Error: " + response.statusText);
    //         }
    //     })
    //     .catch(function (error) {
    //         alert("Unable to connect");
    //     });
};

var uvIndexHandler = function (lat, lon) {
    // fetch uv index
    var uvApiUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=ca94ded639b01eb51cf633b5d0145205&lat=" + lat + "&lon=" + lon;
    fetch(uvApiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    var uvIndex = data.value;
                    // create uv index
                    var uvIndexEl = document.createElement("h4");
                    uvIndexEl.textContent = "UV Index: ";
                    uvIndexEl.setAttribute("class", "card-text");
                    var uvSpan = document.createElement("span");
                    uvSpan.textContent = uvIndex;
                    // style uv index
                    if (uvIndex <= 2) {
                        uvSpan.setAttribute("class", "bg-success rounded uv-span");
                    }
                    if (uvIndex >= 8) {
                        uvSpan.setAttribute("class", "bg-danger rounded uv-span");
                    } else {
                        uvSpan.setAttribute("class", "bg-warning rounded uv-span");
                    }
                    uvIndexEl.appendChild(uvSpan);
                    weatherTodayEl.appendChild(uvIndexEl);

                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect");
        });
};

// function to save new searches to search history
var searchSaver = function (search) {
    var cityName = search.city.name;
    // check for city in array and move to end of list
    if (searchHistory.includes(cityName)) {
        var remove = searchHistory.indexOf(cityName);
        searchHistory.splice(remove, 1);
        searchHistory.push(cityName);
        localStorage.setItem("search-history", JSON.stringify(searchHistory));
        searchLoader();
    } else {
        searchHistory.push(cityName);
        localStorage.setItem("search-history", JSON.stringify(searchHistory));
        searchLoader();
    }
};
// function to create buttons for past searches
var searchLoader = function () {
    searchHistory = JSON.parse(localStorage.getItem("search-history"));
    if (!searchHistory) {
        searchHistory = [];
    }
    // reset section HTML
    pastSearchesEl.innerHTML = "";
    // create button for each
    for (i = 0; i < searchHistory.length; i++) {
        var searchButtonEl = document.createElement("button");
        var notRecent = searchHistory.length - 3;
        // only display three most recent buttons on smaller screen sizes
        if (i < notRecent) {
            searchButtonEl.setAttribute("class", "btn btn-outline-secondary col-12 d-none d-md-inline-block past-search");
        } else {
            searchButtonEl.setAttribute("class", "btn btn-outline-secondary col-12 past-search");
        }
        searchButtonEl.setAttribute("id", searchHistory[i]);
        searchButtonEl.textContent = searchHistory[i];
        pastSearchesEl.appendChild(searchButtonEl);
    }
};
// function to create five day forecast cards
var fiveDayCardCreator = function (data) {
    // reset section HTML
    weatherNextFiveEl.innerHTML = "";
    // create section title
    var nextFiveTitle = document.createElement("h2");
    nextFiveTitle.setAttribute("class", "col-12 text-left");
    nextFiveTitle.style.paddingLeft = 0;
    nextFiveTitle.textContent = "5-Day Forecast:"
    weatherNextFiveEl.appendChild(nextFiveTitle);
    // create cards for each day
    for (i = 0; i < data.list.length; i++) {
        // check for time of day in response object
        var timeOfDay = data.list[i].dt_txt.split(" ")[1];
        // create card with data for time of 12 pm
        if (timeOfDay === "12:00:00") {
            // create card
            var fiveDayCard = document.createElement("div");
            fiveDayCard.setAttribute("class", "card col-12 col-md-6 col-lg-2 bg-primary text-white");
            // create card title
            var date = data.list[i].dt_txt.split(" ")[0];
            var formattedDate = moment(date).format("L");
            var cardTitleEl = document.createElement("h5");
            cardTitleEl.textContent = formattedDate;
            cardTitleEl.setAttribute("class", "card-title");
            fiveDayCard.appendChild(cardTitleEl);
            // create icon
            var weatherIconEl = document.createElement("img");
            var iconId = data.list[i].weather[0].icon;
            weatherIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" +
                iconId +
                "@2x.png");
            weatherIconEl.setAttribute("width", "60px");
            weatherIconEl.setAttribute("height", "60px");
            fiveDayCard.appendChild(weatherIconEl);
            // create temp
            var tempEl = document.createElement("p");
            tempEl.setAttribute("class", "card-text");
            var temperature = data.list[i].main.temp
            tempEl.textContent = "Temp: " +
                temperature +
                " °F";
            // append to card
            fiveDayCard.appendChild(tempEl);
            // create humidity
            var humidityEl = document.createElement("p");
            humidityEl.setAttribute("class", "card-text");
            var humidity = data.list[i].main.humidity
            humidityEl.textContent = "Humidity: " +
                humidity +
                "%";
            // append to card
            fiveDayCard.appendChild(humidityEl);
            // append card to div
            weatherNextFiveEl.appendChild(fiveDayCard);
        }
    }
    return;
};
// load past searches
searchLoader();
// listen for search submission
citySubmitEl.addEventListener("click", submitHandler);
// listen for clicks on past search buttons
pastSearchesEl.addEventListener("click", pastSearchClickHandler);