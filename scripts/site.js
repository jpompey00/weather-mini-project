"use strict";


const cityDropdown = document.getElementById("cityDropdown");

const outputTable = document.getElementById("outputTable");


//API
const STATION_LOOKUP_URL = "https://api.weather.gov/points/"

window.onload = () => {
    console.log("connected");
    populateCityDropDown();
    cityDropdown.onchange = onCityDropdownChange;
}


function onCityDropdownChange() {
    outputTable.innerHTML = "";
    let objectToDisplay;
    if (cityDropdown.value != "") {
        for (let i of locationsArray) {
            if (cityDropdown.value == i.name) {
                objectToDisplay = i;
            }
        }
    }
    if (objectToDisplay != null) {
        // cant have this return anything without await or something
        stationLookup(objectToDisplay);


    }
}

function populateCityDropDown() {
    let option = new Option("select a value", "");
    cityDropdown.appendChild(option);
    for (let i of locationsArray) {
        option = new Option(i.name, i.name);

        cityDropdown.appendChild(option);
    }
}

function stationLookup(object) {
    let url = `${object.latitude},${object.longitude}`;
    let completedUrl = STATION_LOOKUP_URL + url;

    fetch(completedUrl)
        .then(response => response.json())
        .then(data => {
            let forecastUrl = data.properties.forecast;
            forecastArrayApiCall(forecastUrl);

        })
}

function forecastArrayApiCall(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            //returns array
            
            let periodsArray = data.properties.periods;
            createListing(periodsArray);
            //name
            //temperature
            //temperatureUnits
            //windDirection
            //windSpeed
            //Short forecast
            //icon
        })
}


function createListing(forecastArray){
    for(let i of forecastArray){
        outputTable.appendChild(createCol(i));
    }
}

function createCol(forecastObj){
    //column becomes red when thunderstorms
    
    let tr = document.createElement("tr");
    if(forecastObj.shortForecast.includes("Thunderstorms")){
        tr.classList.add("table-danger")
    }
    
    let forecast = document.createElement("td");
    let temperature = document.createElement("td");
    let winds = document.createElement("td");
    let shortForecast = document.createElement("td");
    let image = document.createElement("td");

    //name
    forecast.innerHTML = forecastObj.name;
    tr.appendChild(forecast);
    //temperature

    temperature.innerHTML = `${forecastObj.temperature}${forecastObj.temperatureUnit}`;
    tr.appendChild(temperature);
    //winds

    winds.innerHTML = `Winds: ${forecastObj.windSpeed} ${forecastObj.windDirection}`;
    tr.appendChild(winds);
    //short forecastr

    shortForecast.innerHTML = forecastObj.shortForecast;
    tr.appendChild(shortForecast);
    //image
    let forecastIcon = document.createElement("img");
    forecastIcon.src = forecastObj.icon;
    image.appendChild(forecastIcon);
    tr.appendChild(image);

    

    return tr;
}