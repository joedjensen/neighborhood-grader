var cityObject = JSON.parse(localStorage.getItem("cityObject"))
var resultsCardsEl = $("#results-cards")
var searchBtnEl = $(".searchBtn");

var cityArray = []
if (localStorage.getItem('cityArray')) {
    cityArray = JSON.parse(localStorage.getItem('cityArray'))
}
cityArray.push(cityObject)

for (i = 0; i < cityArray.length; i++) {
    console.log(cityArray[i])
    generateInfoCard(cityArray[i])
    //need lat and lon
    var cityLat = cityArray[i].lat;
    var cityLon = cityArray[i].lon;
    weatherApi(cityObject, cityLat, cityLon);
}

function generateInfoCard(cityObject) {
    console.log(resultsCardsEl[0].children)
    var largeCardEl = $("<div>", {"class": "cell card align-center auto result-card"})
    var closeButtonEl =$("<button>", {"class": "close-button close-btn", "aria-label":"Close alert", "type":"button"})
    closeButtonEl.html("<span>&times;</span>")
    var cardGridX =  $("<div>", {"class": "grid-x grid-padding-x grid-margin-x"})
    var headerGridY = $("<div>", {"class": "grid-y align-center", "style":"height:100%"})
    var headerEl =  $("<div>", {"class": "cell medium-4 large-4"})
    var headerCardEl =  $("<div>", {"class": "card text-center"})
    var bodyEl = $("<div>", {"class": "cell medium-8 large-8"})
    var bodyGridEl =  $("<div>", {"class": "grid-x align-justify grid-margin-x grid-padding-x"})
    var bodyCardEl1 = $("<div>", {"class": "card cell medium-3 large-6 text-center", "id" : cityObject.name + "-weather-el"})
    var bodyCardEl2 = $("<div>", {"class": "card cell medium-3 large-6 text-center", "id" : cityObject.name + "-jobs-el"})
    var bodyCardEl3 = $("<div>", {"class": "card cell medium-3 large-6 text-center", "id" : cityObject.name + "-events-el"})
    bodyCardEl1.text("Loading")
    bodyCardEl2.text("Loading")
    bodyCardEl3.text("Loading")
    bodyGridEl.append(bodyCardEl1, bodyCardEl2, bodyCardEl3)
    bodyEl.append(bodyGridEl)
    headerEl.append(headerGridY.append(headerCardEl))
    headerCardEl.text("Loading")
    largeCardEl.append(cardGridX.append(headerEl).append(bodyEl))
    largeCardEl.append(closeButtonEl)
    resultsCardsEl.append(largeCardEl)
    console.log(resultsCardsEl[0].children)
}

$.ajax({
    url: 'https://api.seatgeek.com/2/events?lat=' + cityObject.lat + '&lon=' + cityObject.lon + '&client_id=Mjk2NTg1OTB8MTY2NTUxOTc2Ny4yMjYwMDQ4'
})
    .then(function (response) {
        cityObject['seatgeekResponse'] = response;
        console.log(cityObject.seatgeekResponse)
        populateEvents(cityObject)
        populateJobs(cityObject);
    })

function populateEvents(cityObject) {
    var cardEl = $("#" + cityObject.name + "-events-el")
    // cardEl.text(cityObject.seatgeekResponse.meta.total)
    cardEl.text("Entertainment")
    var eventNumber = $("<h5>").text("Total: " + cityObject.seatgeekResponse.meta.total + " in a 30 mile radius.")
    cardEl.append(eventNumber);

    var eventTypes = [{}];
    eventTypes.push(cityObject.seatgeekResponse.events[0].type)
    for (let i = 0; i < cityObject.seatgeekResponse.events.length; i++) {
        var tempType = cityObject.seatgeekResponse.events[i].type;
        if (!(eventTypes.includes(tempType))) {

            eventTypes.push(tempType);
            var eventTypesEl = $("<a>").text(cityObject.seatgeekResponse.events[i].type.toUpperCase());
            eventTypesEl.href = "#";
            eventTypesEl.on("click", loadEventSearch);
            cardEl.append(eventTypesEl);
        }
        else {
            //do nothing
        }
    }
    console.log(eventTypes);
}

function weatherApi(cityObject) {

    $.ajax({
        type: 'GET',
        url: 'https://fnw-us.foreca.com/api/v1/observation/latest/"'+ cityObject.lon + ',' + cityObject.lat + '"?lang=en&tempunit=F',
        headers: {
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9wZmEuZm9yZWNhLmNvbVwvYXV0aG9yaXplXC90b2tlbiIsImlhdCI6MTY2NTUyNjI0NiwiZXhwIjo5OTk5OTk5OTk5LCJuYmYiOjE2NjU1MjYyNDYsImp0aSI6IjI3Yzc0MGYzODg0ODEwZWMiLCJzdWIiOiJqb2huZnJvbTIwOSIsImZtdCI6IlhEY09oakM0MCtBTGpsWVR0amJPaUE9PSJ9.R6lwtfrLoCrBhdTpLpZaeKjDbjeQWfZmla6i759u7Wg",
        }
    })
        .then(function (response) {
            console.log(response)
            cityObject['foreca'] = response;
            console.log(cityObject.foreca + "Foreca");
            populateWeather(cityObject);
        })
}
// lets call the weather api
// Foreca api
// this call gets the day



function populateWeather(cityObject) {

    var cardEl = $("#" + cityObject.name + "-weather-el");

    cardEl.text("Weather");
    var feels = $("<h5>").text("Feels Like: " + cityObject.foreca.observations[0].feelsLikeTemp);
    var humidity = $("<h5>").text("Humidity: " + cityObject.foreca.observations[0].relHumidity);
    var symbol = $("<img>").text(cityObject.foreca.observations[0].symbol);
    var temp = $("<h5>").text("Temperature: " + cityObject.foreca.observations[0].temperature);
    var windSpeed = $("<h5>").text("Windspeed: " + cityObject.foreca.observations[0].windSpeed);

    cardEl.append(symbol, feels, temp, humidity, windSpeed);

}
// search api via type
function loadEventSearch() {
    console.log("event Loaded");
}

function populateJobs(cityObject) {
    var cardEl = $("#" + cityObject.name + "-jobs-el");
    var jobLocationName = cityObject.name;
    var jobLocationState = cityObject.seatgeekResponse.meta.geolocation.state;
    var requestURL = 'https://www.themuse.com/api/public/jobs?page=20&location='+jobLocationName+'%2C%20'+jobLocationState;
        $.ajax({
            url: requestURL,
            method: 'GET'
        }).then(function(response) {
            console.log(response);
            console.log(response.results[0].locations[0].name)
            var jobsList = $('<ul>').css("list-style","none").css("font-size", '15px');
            var jobNum = $('<li>');
            jobNum.text(response.total + ' total jobs in area, including:');
            var jobEx1 = $('<li>');
            jobEx1.text(response.results[0].name);
            var jobEx2 = $('<li>');
            jobEx2.text(response.results[1].name);
            var jobEx3 = $('<li>');
            jobEx3.text(response.results[2].name);
            cardEl.text('');
            jobsList.prepend(jobNum);
            jobsList.append(jobEx1, jobEx2, jobEx3);
            cardEl.append(jobsList);
        })

    }

function fetchResults(event) {
    event.preventDefault();
    localStorage.setItem('cityArray', JSON.stringify(cityArray))
    //save street and city values
    var streetName = $("#findtext").val();
    var cityName = $("#findlocate").val();

    if (!streetName || !cityName) {
        console.log("Need both street and city.");
        return;
    }
    else {
        // console.log("Thanks for the location.");
        //move to search page or clear the page
        //then call api's




        // Foreca api grab lat/lon by city name
        $.ajax({
            url: 'https://fnw-us.foreca.com/api/v1/location/search/' + cityName + '?lang=en',
            async: 'false',
            headers: {
                "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9wZmEuZm9yZWNhLmNvbVwvYXV0aG9yaXplXC90b2tlbiIsImlhdCI6MTY2NTUyNjI0NiwiZXhwIjo5OTk5OTk5OTk5LCJuYmYiOjE2NjU1MjYyNDYsImp0aSI6IjI3Yzc0MGYzODg0ODEwZWMiLCJzdWIiOiJqb2huZnJvbTIwOSIsImZtdCI6IlhEY09oakM0MCtBTGpsWVR0amJPaUE9PSJ9.R6lwtfrLoCrBhdTpLpZaeKjDbjeQWfZmla6i759u7Wg",
            }
        })
            .then(function (response) {
                return response;
            })
            .then(function (data) {
                console.log(data);
                console.log("Lets get this lat/lon");

                lon = data.locations[0].lon;
                lat = data.locations[0].lat;

                lon = parseFloat(lon).toFixed(2);
                lat = parseFloat(lat).toFixed(2);

                console.log(lon + " this is lon");
                console.log(lat + " this is lat");
                var cityObject = {
                    "name": cityName,
                    "lat":lat,
                    "lon":lon
                }
                localStorage.setItem("cityObject", JSON.stringify(cityObject));
                // Seatgeek api
                // fetch('https://api.seatgeek.com/2/events?venue.state=NY&client_id=Mjk2NTg1OTB8MTY2NTUxOTc2Ny4yMjYwMDQ4')
                document.location = "./results.html"

                // // Foreca api
                //this call gets the day 
                // $.ajax({
                //     type: 'GET',
                //     async: 'false',
                //     url: 'https://fnw-us.foreca.com/api/v1/observation/latest/%22' + lon + ',' + lat + '%22?lang=en&tempunit=F',
                //     headers: {
                //         "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9wZmEuZm9yZWNhLmNvbVwvYXV0aG9yaXplXC90b2tlbiIsImlhdCI6MTY2NTUyNjI0NiwiZXhwIjo5OTk5OTk5OTk5LCJuYmYiOjE2NjU1MjYyNDYsImp0aSI6IjI3Yzc0MGYzODg0ODEwZWMiLCJzdWIiOiJqb2huZnJvbTIwOSIsImZtdCI6IlhEY09oakM0MCtBTGpsWVR0amJPaUE9PSJ9.R6lwtfrLoCrBhdTpLpZaeKjDbjeQWfZmla6i759u7Wg",
                //     }
                // })
                //     .then(function (response) {
                //         return response;
                //     })
                //     .then(function (data) {
                //         console.log(data);

                //     })
            })



    }

}

searchBtnEl.on("click", fetchResults);
resultsCardsEl.on("click","button", removeCity)

function removeCity() {
    document.location = "./index.html"
}