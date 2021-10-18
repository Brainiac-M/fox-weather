// Select Elements

const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");


//App data
const weather = {};
 
weather.temperature = {
     unit: 'celsius'
}

//APP CONSTS AND VARIABLES
const kelvin = 273; 

//API Key
const key = "82005d27a116c2880c8f0fcb866998a0";

//CHECK GEOLOCATIION SUPPORT IN BROWSER
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = '<p>This browser does not support geolocation</p>';
}


//Change Background
function changeBackground(description){
    const pexelKey = '563492ad6f91700001000001f02a163ae3b4454bb48b70c60313943d';
    let url =  `https://api.pexels.com/v1/search?query=${description}`;
    
    fetch(url, {
        headers: {
            'Authorization': pexelKey
        }
    })
    .then(res => res.json().then(data => {
        console.log(data);
        const i = Math.floor(Math.random() * 15);
        console.log(i);
        const source = data.photos[i].src.original;
        document.body.style.background = `url(${source})`;
    })
    .catch(error => console.log(error)))
    .catch(error => console.log(error))
}

//Set User Position
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

//Show ERROR if there is issue
function showError(error){
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = `<p>${error.message}</p>`;
}

//GET Weather from API provider

function getWeather(latitude, longitude){

    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
    .then(function(response){
        let data = response.json();
        return data;
    })
    .then(function(data){
        weather.temperature.value = Math.floor(data.main.temp - kelvin);
        weather.description = data.weather[0].description;
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
    })
    .then(function(){
        displayWeather(); 
    })
    .then(function() {
           changeBackground(weather.description); 
    })

    
}

//Displaying weather in UI
function displayWeather(){
     iconElement.innerHTML = `<img src = 'icons/${weather.iconId}.png'>`;
     tempElement.innerHTML = `${weather.temperature.value}º <span>C</span>`;
     descElement.innerHTML = weather.description;
     locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

//Conversion to Farenheit
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

//  When User clicks on Temperature Element
tempElement.addEventListener("click", function(){
    if(weather.temperature.value == undefined) return;

        if(weather.temperature.unit === "celsius"){
            let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
            fahrenheit = Math.floor(fahrenheit);
            tempElement.innerHTML = `${fahrenheit}º<span>F</span>`; 
            weather.temperature.unit = "fahrenheit";
            }
        else{
            tempElement.innerHTML = `${weather.temperature.value}º<span>C</span>`; 
            weather.temperature.unit = "celsius";
        }
});

//background image should change based on the 
//weather state. Images for winter, summer, 
//clear sky and windy should be toggled.
//Let users search for cities and get weather results of various cities.
// Allow dark mode toggle
//Add glassmorphism
