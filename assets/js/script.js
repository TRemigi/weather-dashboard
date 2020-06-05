var cityInputEl = document.querySelector("#city-input");
var citySubmitEl = document.querySelector("#city-submit");
var weatherTodayEl = document.querySelector("#weather-today");

var submitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();

    if (city) {
        cityWeatherGetter(city);        
    }
    else {
        alert("Please enter a valid city name");
    }
};

var cityWeatherGetter = function(city) {
    // format the api
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=ca94ded639b01eb51cf633b5d0145205";
    // make a request to the url
   fetch(apiUrl)
   .then(function(response) {
       // request was successful
       if (response.ok) {
       response.json().then(function(data) {
           console.log(data);
           displayWeather(data, city);
       });
    } else {
        alert("Error: " + response.statusText);
    }
   })
   .catch(function(error) {
       alert("Unable to connect");
   });
};

var displayWeather = function(data) {
    var date = moment().format("L");
    var titleEl = document.createElement("h2");
    titleEl.textContent = data.city.name + " " + date;
    weatherTodayEl.appendChild(titleEl);
}

citySubmitEl.addEventListener("click", submitHandler);