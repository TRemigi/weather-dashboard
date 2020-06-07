var pastSearchesEl = document.querySelector("#past-searches");
var cityInputEl = document.querySelector("#city-input");
var citySubmitEl = document.querySelector("#city-submit");
var weatherTodayEl = document.querySelector("#weather-today");
var weatherNextFiveEl = document.querySelector("#weather-next-five");
var searchHistory = [];

var submitHandler = function (event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();

    if (city) {
        cityWeatherGetter(city);
    } else {
        alert("Please enter a valid city name");
    }
};

var pastSearchClickHandler = function (event) {
    event.preventDefault();
    var city = event.target.id;
    cityWeatherGetter(city);
};

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

var displayWeather = function (data) {
    console.log(data);
    fiveDayCardCreator(data);
    // create title and icon
    weatherTodayEl.style.display = "flex";
    weatherTodayEl.innerHTML = "";
    var date = moment().format("L");
    var titleEl = document.createElement("h2");
    titleEl.setAttribute("class", "card-title");
    titleEl.textContent = data.city.name + " " + date;
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
    // fetch uv index
    var lat = data.city.coord.lat;
    var lon = data.city.coord.lon;
    var uvApiUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=ca94ded639b01eb51cf633b5d0145205&lat=" + lat + "&lon=" + lon;
    return fetch(uvApiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    var uvIndex = data.value;
                    // create uv index
                    console.log(uvIndex);
                    var uvIndexEl = document.createElement("h4");
                    uvIndexEl.textContent = "UV Index: ";
                    uvIndexEl.setAttribute("class", "card-text");
                    var uvSpan = document.createElement("span");
                    uvSpan.textContent = uvIndex;
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

var searchSaver = function (search) {
    var cityName = search.city.name;
    if (searchHistory.includes(cityName)) {
        return;
    } else {
        searchHistory.push(cityName);
        localStorage.setItem("search-history", JSON.stringify(searchHistory));
        console.log(localStorage);
        searchLoader();
    }
};

var searchLoader = function () {
    searchHistory = JSON.parse(localStorage.getItem("search-history"));
    if (!searchHistory) {
        searchHistory = [];
    }
    pastSearchesEl.innerHTML = "";
    for (i = 0; i < searchHistory.length; i++) {
        var searchButtonEl = document.createElement("button");
        var notRecent = searchHistory.length - 3;
        console.log(notRecent);
        console.log(i);
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

var fiveDayCardCreator = function (data) {
    weatherNextFiveEl.innerHTML = "";
    var nextFiveTitle = document.createElement("h2");
    nextFiveTitle.setAttribute("class", "col-12 text-left");
    nextFiveTitle.style.paddingLeft = 0;
    nextFiveTitle.textContent = "5-Day Forecast:"
    weatherNextFiveEl.appendChild(nextFiveTitle);
    for (i = 0; i < data.list.length; i++) {
        var timeOfDay = data.list[i].dt_txt.split(" ")[1];
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
};

searchLoader();
citySubmitEl.addEventListener("click", submitHandler);
pastSearchesEl.addEventListener("click", pastSearchClickHandler);