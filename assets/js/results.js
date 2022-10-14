
var resultsCardsEl = $("#results-cards")
var searchBtnEl = $(".searchBtn");



var cityHistoryObject = {}

if (localStorage.getItem('cityHistoryObject')) {
    cityHistoryObject = JSON.parse(localStorage.getItem('cityHistoryObject'))
}
renderFromHistory()

if (localStorage.getItem('cityObject')) {
    var cityObject = JSON.parse(localStorage.getItem("cityObject"))
    if (!cityHistoryObject[cityObject.nameJS]) {
        generateInfoCard(cityObject)
        weatherApi(cityObject);
        eventsAndJobsApi(cityObject);
        populateHeader(cityObject)
    }
    
    cityHistoryObject[cityObject.nameJS] = cityObject
}




function generateInfoCard(cityObject) {
    console.log(cityObject)
    var largeCardEl = $("<div>", { "class": "cell card align-center auto result-card", "data-city-name": cityObject.nameJS})
    var closeButtonEl = $("<button>", { "class": "close-button close-btn", "aria-label": "Close alert", "type": "button" })
    closeButtonEl.html("<span>&times;</span>")
    var cardGridX = $("<div>", { "class": "grid-x grid-padding-x grid-margin-x" })
    var headerGridY = $("<div>", { "class": "grid-y align-center", "style": "height:100%" })
    var headerEl = $("<div>", { "class": "cell medium-4 large-4" })
    var headerCardEl = $("<div>", { "class": "card text-center", "id": cityObject.nameJS + "-score" })
    var bodyEl = $("<div>", { "class": "cell medium-8 large-8" })
    var bodyGridEl = $("<div>", { "class": "grid-x  grid-margin-x grid-padding-x align-justify"  })
    var bodyCardEl1 = $("<div>", { "class": "card cell medium-6 large-4 text-center", "id": cityObject.nameJS + "-weather-el" })
    var bodyCardEl2 = $("<div>", { "class": "card cell medium-6 large-4 text-center", "id": cityObject.nameJS + "-jobs-el" })
    var bodyCardEl3 = $("<div>", { "class": "card cell medium-6 large-4 text-center", "id": cityObject.nameJS + "-events-el" })
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


function eventsAndJobsApi(cityObject) {
    $.ajax({
        url: 'https://api.seatgeek.com/2/events?lat=' + cityObject.lat + '&lon=' + cityObject.lon + '&client_id=Mjk2NTg1OTB8MTY2NTUxOTc2Ny4yMjYwMDQ4'
    })
        .then(function (response) {
            cityObject['seatgeekResponse'] = response;
            console.log(cityObject.seatgeekResponse)
            populateEvents(cityObject)
            jobsApi(cityObject)
        })
}

function populateEvents(cityObject) {
    var cardEl = $("#" + cityObject.nameJS + "-events-el")
    cardEl.empty()
    // cardEl.text(cityObject.seatgeekResponse.meta.total)
    var eventCardHeader = $("<h4>").text("Events")
    cardEl.append(eventCardHeader)
    var eventNumber = $("<h2>").text(cityObject.seatgeekResponse.meta.total.toLocaleString())
    var cardFooter = $("<h5>").text("in area")
    cardEl.append(eventNumber, cardFooter);

    // var eventTypes = [{}];
    // eventTypes.push(cityObject.seatgeekResponse.events[0].type)
    // for (let i = 0; i < cityObject.seatgeekResponse.events.length; i++) {
    //     var tempType = cityObject.seatgeekResponse.events[i].type;
    //     if (!(eventTypes.includes(tempType))) {

    //         eventTypes.push(tempType);
    //         var eventTypesEl = $("<a>").text(cityObject.seatgeekResponse.events[i].type.toUpperCase());
    //         eventTypesEl.href = "#";
    //         eventTypesEl.on("click", loadEventSearch);
    //         cardEl.append(eventTypesEl);
    //     }
    //     else {
    //         //do nothing
    //     }
    // }
    // console.log(eventTypes);
}

function weatherApi(cityObject) {

    $.ajax({
        type: 'GET',
        url: 'https://fnw-us.foreca.com/api/v1/observation/latest/"' + cityObject.lon + ',' + cityObject.lat + '"?lang=en&tempunit=F',
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

    var cardEl = $("#" + cityObject.nameJS + "-weather-el");
    cardEl.empty()
    var weatherCardHeader = $("<h4>").text("Current Temp")
    // var feels = $("<h5>").text("Feels Like: " + cityObject.foreca.observations[0].feelsLikeTemp);
    // var humidity = $("<h5>").text("Humidity: " + cityObject.foreca.observations[0].relHumidity);
    // var symbol = $("<img>").text(cityObject.foreca.observations[0].symbol);
    var temp = $("<h2>").html(cityObject.foreca.observations[0].temperature  + "&#8457");
    // var windSpeed = $("<h5>").text("Windspeed: " + cityObject.foreca.observations[0].windSpeed);

    cardEl.append(weatherCardHeader ,temp);

}
// search api via type
function loadEventSearch() {
    console.log("event Loaded");
}



function jobsApi(cityObject) {
    var jobLocationName = cityObject.name;
    var jobLocationState = cityObject.seatgeekResponse.meta.geolocation.state;
    var requestURL = 'https://www.themuse.com/api/public/jobs?page=20&location=' + jobLocationName + '%2C%20' + jobLocationState;
    $.ajax({
        url: requestURL,
        method: 'GET'
    }).then(function (response) {
        console.log(response)
        cityObject['jobs'] = response;
        populateJobs(cityObject);
        populateScore(cityObject)
        localStorage.setItem('cityHistoryObject', JSON.stringify(cityHistoryObject))
    })
}


function populateJobs(cityObject) {
    var cardEl = $("#" + cityObject.nameJS + "-jobs-el");
    cardEl.empty()
    var jobsCardHeader = $("<h4>").text("Jobs")
    // var jobsList = $('<ul>').css("list-style", "none").css("font-size", '15px');
    // var jobNum = $('<li>');
    // jobNum.text(cityObject.jobs.total + ' total jobs in area, including:');
    // var jobEx1 = $('<li>');
    // jobEx1.text(cityObject.jobs.results[0].name);
    // var jobEx2 = $('<li>');
    // jobEx2.text(cityObject.jobs.results[1].name);
    // var jobEx3 = $('<li>');
    // jobEx3.text(cityObject.jobs.results[2].name);
    // cardEl.text('');
    // jobsList.prepend(jobNum);
    // jobsList.append(jobEx1, jobEx2, jobEx3);

    var jobNum = $("<h2>").html(cityObject.jobs.total.toLocaleString());
    var footer =  $("<h5>").text("in area")
    cardEl.append(jobsCardHeader, jobNum, footer);
    
}

function populateHeader(cityObject) {
    var scoreCardEl = $("#" + cityObject.nameJS + "-score")
    scoreCardEl.empty()
    var scoreCardHeader = $("<h4>").text(cityObject.name)
    scoreCardEl.append(scoreCardHeader)
}

function fetchResults(event) {
    console.log("here we go")
    event.preventDefault();
    //save street and city values
    var cityName = $("#findlocate").val();

    if (!cityName) {
        console.log("Need city.");
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
                    "nameJS": cityName.replace(/\s/g, '-'),
                    "lat": lat,
                    "lon": lon
                }
                localStorage.setItem("cityObject", JSON.stringify(cityObject));
                // Seatgeek api
                // fetch('https://api.seatgeek.com/2/events?venue.state=NY&client_id=Mjk2NTg1OTB8MTY2NTUxOTc2Ny4yMjYwMDQ4')
                document.location.replace( "./results.html")

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
resultsCardsEl.on("click", "button", removeCity)

function removeCity(event) {
    localStorage.removeItem('cityObject')
    delete cityHistoryObject[$(this).closest(".card").attr("data-city-name")]
    localStorage.setItem('cityHistoryObject', JSON.stringify(cityHistoryObject))
    resultsCardsEl.empty()
    renderFromHistory()
}

function renderFromHistory() {
    var cities = Object.keys(cityHistoryObject)
    for (i = 0; i < cities.length; i++) {
        console.log(cityHistoryObject[cities[i]])
        generateInfoCard(cityHistoryObject[cities[i]])
        //need lat and lon
        populateHeader(cityHistoryObject[cities[i]])
        populateWeather(cityHistoryObject[cities[i]]);
        populateEvents(cityHistoryObject[cities[i]])
        populateJobs(cityHistoryObject[cities[i]])
        populateScore(cityHistoryObject[cities[i]])
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

function populateScore(cityObject) { 
    var scoreCardEl = $("#" + cityObject.nameJS + "-score")
    var scoreEl = $("<h2>")
    if (cityObject.score) {
        scoreEl.text(cityObject.score)
    } else {
        var score = getRandomInt(80, 100)
        scoreEl.text(score)
        console.log("setting score")
        cityObject['score'] = score
        localStorage.setItem("cityHistoryObject", JSON.stringify(cityHistoryObject))
        console.log(cityObject)
        console.log(cityHistoryObject)
    }
    var scoreFooter = $("<h5>").text("Overall Score")
    scoreEl.css("fontSize", 130)
    scoreCardEl.append(scoreEl, scoreFooter)
}
