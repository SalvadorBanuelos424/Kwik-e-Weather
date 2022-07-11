// function to get current time
let locationDate = function (time) {
    let moment = new Date();
    moment.setTime(time * 1000);  //multiplied by 1000 to account for milliseconds
    let month = moment.getMonth() + 1;  //added by 1 to account for month array length beginning at 0
    let day = moment.getDate();
    return month+'/'+day;
}

let locationName;

// create button for 'location name' submissions and store as array in localStorage || create array in localStorage
let locationMemory = JSON.parse(localStorage.getItem("location")) || [];
for (let i = 0; i < locationMemory.length; i++) {
    var locationBtn = document.createElement("button");
    locationBtn.setAttribute("class", "locationNames");
    locationBtn.textContent = locationMemory[i];
    $("#locationSaved").append(locationBtn);
    weatherHandler();
}


// input 'location' into API-url to return data/coordinates in json format
var getForecast = function (locationName) {
    let weatherAPI = "https://api.openweathermap.org/data/2.5/forecast?q=" + locationName + "&appid=908d66bc443a59edcf38648405a06695";
    fetch(weatherAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {coordinates(data.city.coord.lat, data.city.coord.lon);
        })
}


// click search button to submit user into 'location'
var LocationBtnSearch = document.getElementById("locationSearchBtn");
LocationBtnSearch.addEventListener("click", function () {
    locationName = $("#userInput").val();
    getForecast(locationName);
    console.log(locationMemory);
    locationMemory.push(locationName);

    // create button from submission, set to localStorage
    var createBtnName = document.createElement("button");
    createBtnName.setAttribute("class", "locationNames");
    createBtnName.textContent = locationName;
    $("#locationSaved").append(createBtnName);
    localStorage.setItem("location", JSON.stringify(locationMemory));
    weatherHandler();
});

// DOM manipulation, append array-length 5- using fetch weather API
var week = function (data) {
    $('.week').empty();
    for (let i = 1; i < 6; i++) {
        var dateEl = $("<div class='dateEl'><div />")
        $(dateEl).append(`<img src="https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png"/>`);
        $(dateEl).append(locationDate(data.daily[i].dt));
        $(dateEl).append("<p>Temp: " + data.daily[i].temp.day + " °</p>");
        $(dateEl).append("<p>Humidity: " + data.daily[i].humidity + " %</p>");
        $(dateEl).append("<p>Wind: " + data.daily[i].wind_speed + " mph</p>");
        $('.week').append(dateEl)
    };
};

// add eventListeners to created buttons, with ability to submit 'location' into function
function weatherHandler() {
    var locationBtnSaved = document.querySelectorAll(".locationNames");
    locationBtnSaved.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
        locationName = e.target.innerText;
        getForecast(locationName);
    });
    });
};


// retrieved 'longitude' and 'latitude' to input into function
var coordinates = function (lat, lon) {
    let uvApi = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=72ad0bfae60e984f45334825ca9bd5db' + '&units=imperial'
    fetch(uvApi)
        .then(function (response) {
            return response.json();
        
            // retrieved 'data' to input into function
        }).then(function (data) {
            $('.day').html(locationName + " (" + locationDate(data.current.dt) + ")" + `<img src="https://openweathermap.org/img/w/${data.current.weather[0].icon}.png" />`); // in the city variable
            $('.temperature').text("Temperature: " + data.current.temp + " °");
            $('.wind').text("Wind speed: " + data.current.wind_speed + " mph");
            $('.humidity').text("Humidity: " + data.current.humidity + " %");
            $('.uv').html("UV: " + `<span class="color">${data.current.uvi}</span>`);
            week(data);

            // return class-attributes for current UV number
            if (data.current.uvi <= 2) {
                $(".color").attr("class", "green");
            };
            if (data.current.uvi > 2 && data.current.uvi <= 5) {
                $(".color").attr("class", "yellow");
            };
            if (data.current.uvi > 5 && data.current.uvi <= 7) {
                $(".color").attr("class", "red");
            };
            if (data.current.uvi > 7 && data.current.uvi <= 10) {
                $(".color").attr("class", "violet");
            };
            if (data.current.uvi >= 11) {
                $(".color").attr("class", "blue");
            };
        });
};


