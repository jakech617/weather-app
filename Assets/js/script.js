const apiKey = "5f1d1181ba62d6d447dc01b056f8f1b4"

$(document).ready(function() {
  let cities = [];
  $("#displayCity").hide();
  $("#extended-forecast").hide();
  $("#5-day").hide();
  $("#recently-searched").hide();

// api call for searched city.
  function displayCityForecast(city) {
      let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

      $.ajax({
          url: queryURL,
          method: "GET"
      }).then (function(response) {
          let weatherIcon = response.weather[0].icon;
          let date = $("<h2>").text(moment().format('l'));
          let icon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"); 
          let tempFarenheit = (response.main.temp - 273.15) * 1.80 + 32;
              
          $("#displayCityName").text(response.name);
          $("#displayCityName").append(date);
          $("#displayCityName").append(icon);
          $("#displayCityTemp").text(tempFarenheit.toFixed(2) + " \u00B0F");
          $("#displayCityHumidity").text(response.main.humidity + "%");
          $("#displayCityWind").text(response.wind.speed + "MPH");

          let lat = response.coord.lat
          let lon = response.coord.lon
          queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon; 
          $.ajax({
              url: queryURL,
              method: "GET"
          }).then(function(response) {
          
          // applys classes for uvi condition. 
          let uvIndex = response.value;
          $("#displayCityUVindex").removeClass("favorable");
          $("#displayCityUVindex").removeClass("moderate");
          $("#displayCityUVindex").removeClass("severe");
              if (uvIndex <= 2.9) {
                  $("#displayCityUVindex").addClass("favorable");
              } else if (uvIndex >= 3 && uvIndex <= 7.9) {
                  $("#displayCityUVindex").addClass("moderate");
              } else {
                  $("#displayCityUVindex").addClass("severe");};
                  $("#displayCityUVindex").text(response.value);});   
                  $("#displayCity").show();}); 
              };

// api call for 5 day forecast.
function fiveDayForecast(city) {
  
  let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;

  $.ajax({
      url: queryURL,
      method: "GET"
  }).then(function(response) {
      let counter = 1
      for (i = 0; i < response.list.length; i += 8){
          let date = moment(response.list[i].dt_txt).format("l");
          let weatherIcon = response.list[i].weather[0].icon;
          let temperatureF = (response.list[i].main.temp - 273.15) * 1.80 + 32;
              
          $("#day-" + counter).text(date);
          $("#icon" + counter).attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + ".png");
          $("#temp-" + counter).text(temperatureF.toFixed(2) + " \u00B0F");
          $("#humidity-" + counter).text(response.list[i].main.humidity + "%"); counter++;};
          $("#extended-forecast").show();
          $("#5-day").show();
          $("#recently-searched").show();  
          });
        };

// appends previous city searches.
function searchedCities(city) {
  let recentCity = $("<a>").text(city)
  recentCity.addClass("searchedCity");
  $("#searchedCity").append(recentCity);
};

// clears search input.
function getCities() {
  $("#searchedCity").empty();
  for (i = 0; i < cities.length; i++) { 
      searchedCities(cities[i]);
  };
};

function weather(city){
  displayCityForecast(city);
  fiveDayForecast(city);};

function init() {
  // retrieve searched cities.
  let storedCities = JSON.parse(localStorage.getItem("searches"));
  if (storedCities) {
      cities = storedCities;
      getCities();
      weather(cities[cities.length -1]);
  };
};

init();

// saves user input to local storage.
$("#searchBtn").click(function() {
  let cityInputs = $(this).siblings("#inputCity").val().trim();
  $("#inputCity").val("");
  if (cityInputs !== "") {
      if (cities.indexOf(cityInputs)== -1){
          cities.push(cityInputs);
          localStorage.setItem("searches",JSON.stringify(cities));
          searchedCities(cityInputs);
      };
      weather(cityInputs);
  };
});

// listens for user to click a previously searched city.
$("#searchedCity").on("click", ".searchedCity", function() {
  let cityOnButton = $(this).text();
  weather(cityOnButton);

});
});