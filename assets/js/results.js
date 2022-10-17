var resultsCardsEl = $("#results-cards")
var searchBtnEl = $(".searchBtn");
var modalEl = $('#exampleModal2');



var cityHistoryObject = {}
// retrieving local storage and assigning to variable for quick access
if (localStorage.getItem('cityHistoryObject')) {
    cityHistoryObject = JSON.parse(localStorage.getItem('cityHistoryObject'))
}

// checking to see if cityObject (most recent search) is already in history, and putting it there if it's not
if (localStorage.getItem('cityObject')) {
    var cityObject = JSON.parse(localStorage.getItem("cityObject"))
    if (!(cityObject.nameJS in cityHistoryObject)) {
        console.log("entering deletion loop")
        // capping the number of cities being rendered on page at 3
        if (Object.keys(cityHistoryObject).length > 2) {
            delete cityHistoryObject[Object.keys(cityHistoryObject)[0]]
        }
    }
}

renderFromHistory()

// initiating fetch request functions if cityObject is not already in cityHistoryObject
if (localStorage.getItem('cityObject')) {
    var cityObject = JSON.parse(localStorage.getItem("cityObject"))
    if (!cityHistoryObject[cityObject.nameJS]) {
        generateInfoCard(cityObject)
        weatherApi(cityObject);
        eventsAndJobsApi(cityObject);
        populateHeader(cityObject)
        weatherForecast(cityObject)
        cityHistoryObject[cityObject.nameJS] = cityObject
    }
}



// generating the cards within which the data from the APIs will be displayed
// assigning appropriate classes/ids/data attributes for Foundation/CSS and jQuery targeting/manipulation
function generateInfoCard(cityObject) {
    var largeCardEl = $("<div>", { "class": "cell card align-center auto result-card", "data-city-name": cityObject.nameJS })
    var closeButtonEl = $("<button>", { "class": "close-button close-btn", "aria-label": "Close alert", "type": "button" })
    closeButtonEl.html("<span>&times;</span>")
    var cardGridX = $("<div>", { "class": "grid-x grid-padding-x grid-margin-x" })
    var headerGridY = $("<div>", { "class": "grid-y align-center", "style": "height:100%" })
    var headerEl = $("<div>", { "class": "cell medium-4 large-4 scene" })
    var headerCardEl = $("<div>", { "class": "card text-center flippable-card" })
    var headerCardFront = $("<div>", { "class": "text-center front", "id": cityObject.nameJS + "-score" })
    var headerCardBack = $("<div>", { "class": "text-center back", "id": cityObject.nameJS + "-back" })
    var bodyEl = $("<div>", { "class": "cell medium-8 large-8" })
    var bodyGridEl = $("<div>", { "class": "grid-x  grid-margin-x grid-padding-x align-justify" })
    var bodyCardEl1 = $("<div>", { "class": "card cell medium-6 large-4 text-center weather", "id": cityObject.nameJS + "-weather-el" })
    var bodyCardEl2 = $("<div>", { "class": "card cell medium-6 large-4 text-center jobs", "id": cityObject.nameJS + "-jobs-el" })
    var bodyCardEl3 = $("<div>", { "class": "card cell medium-6 large-4 text-center events", "id": cityObject.nameJS + "-events-el" })
    bodyCardEl1.text("Loading")
    bodyCardEl2.text("Loading")
    bodyCardEl3.text("Loading")
    bodyCardEl1.attr("data-open", "exampleModal2")
    bodyCardEl2.attr("data-open", "exampleModal2")
    bodyCardEl3.attr("data-open", "exampleModal2")
    bodyGridEl.append(bodyCardEl1, bodyCardEl2, bodyCardEl3)
    bodyEl.append(bodyGridEl)
    headerEl.append(headerGridY.append(headerCardEl.append(headerCardFront).append(headerCardBack)))
    headerCardFront.text("Loading")
    headerCardBack.text("Loading")
    largeCardEl.append(cardGridX.append(headerEl).append(bodyEl))
    largeCardEl.append(closeButtonEl)
    resultsCardsEl.append(largeCardEl)
}

// calling on SeatGeek API to fetch event data
function eventsAndJobsApi(cityObject) {
    $.ajax({
        url: 'https://api.seatgeek.com/2/events?lat=' + cityObject.lat + '&lon=' + cityObject.lon + '&client_id=Mjk2NTg1OTB8MTY2NTUxOTc2Ny4yMjYwMDQ4'
    })
        // we call the jobsApi function from in here because we need the two-letter state abbreviation, and this API returns it in its data object
        .then(function (response) {
            cityObject['seatgeekResponse'] = response;
            populateEvents(cityObject)
            jobsApi(cityObject)
        })
}

// taking the data from the fetch request and populating a card with the relevant information
function populateEvents(cityObject) {
    var cardEl = $("#" + cityObject.nameJS + "-events-el")
    cardEl.empty()
    var eventCardHeader = $("<h4>").text("Events")
    cardEl.append(eventCardHeader)
    var eventNumber = $("<h2>").text(cityObject.seatgeekResponse.meta.total.toLocaleString())
    var cardFooter = $("<h5>").text("in area")
    cardEl.append(eventNumber, cardFooter);
}

// fetch request to the Foreca weather API
function weatherApi(cityObject) {
    $.ajax({
        type: 'GET',
        url: 'https://fnw-us.foreca.com/api/v1/observation/latest/"' + cityObject.lon + ',' + cityObject.lat + '"?lang=en&tempunit=F',
        headers: {
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9wZmEuZm9yZWNhLmNvbVwvYXV0aG9yaXplXC90b2tlbiIsImlhdCI6MTY2NTUyNjI0NiwiZXhwIjo5OTk5OTk5OTk5LCJuYmYiOjE2NjU1MjYyNDYsImp0aSI6IjI3Yzc0MGYzODg0ODEwZWMiLCJzdWIiOiJqb2huZnJvbTIwOSIsImZtdCI6IlhEY09oakM0MCtBTGpsWVR0amJPaUE9PSJ9.R6lwtfrLoCrBhdTpLpZaeKjDbjeQWfZmla6i759u7Wg",
        }
    })
        .then(function (response) {
            cityObject['foreca'] = response;
            populateWeather(cityObject);
        })
}

// populating a card with the data from the Foreca fetch request
function populateWeather(cityObject) {

    var cardEl = $("#" + cityObject.nameJS + "-weather-el");
    cardEl.empty()
    var weatherCardHeader = $("<h4>").text("Current Temp")
    var temp = $("<h2>").html(cityObject.foreca.observations[0].temperature + "&#8457");
    cardEl.append(weatherCardHeader, temp);

}
// search API via type
function loadEventSearch() {
}


// fetch request from The Muse, a jobs API
function jobsApi(cityObject) {
    var jobLocationName = cityObject.name;
    // using data returned from the SeatGeek response to complete the fetch request
    var jobLocationState = cityObject.seatgeekResponse.meta.geolocation.state;
    var requestURL = 'https://www.themuse.com/api/public/jobs?page=20&location=' + jobLocationName + '%2C%20' + jobLocationState;
    $.ajax({
        url: requestURL,
        method: 'GET'
    }).then(function (response) {
        cityObject['jobs'] = response;
        populateJobs(cityObject);
        populateScore(cityObject)
        populateCardBack(cityObject)
        localStorage.setItem('cityHistoryObject', JSON.stringify(cityHistoryObject))
    })
}


function populateJobs(cityObject) {
    var cardEl = $("#" + cityObject.nameJS + "-jobs-el");
    cardEl.empty()
    var jobsCardHeader = $("<h4>").text("Jobs")
    var jobNum = $("<h2>").html(cityObject.jobs.total.toLocaleString());
    var footer = $("<h5>").text("in area")
    cardEl.append(jobsCardHeader, jobNum, footer);
}

function populateHeader(cityObject) {
    var scoreCardEl = $("#" + cityObject.nameJS + "-score")
    scoreCardEl.empty()
    var scoreCardHeader = $("<h4>").text(cityObject.name)
    scoreCardEl.append(scoreCardHeader)
}

resultsCardsEl.on("click", "button", removeCity)

// function to remove a city from local storage, then re-render the page, removing that city from the page
function removeCity(event) {
    localStorage.removeItem('cityObject')
    delete cityHistoryObject[$(this).closest(".card").attr("data-city-name")]
    localStorage.setItem('cityHistoryObject', JSON.stringify(cityHistoryObject))
    cityHistoryObject = JSON.parse(localStorage.getItem('cityHistoryObject'))
    resultsCardsEl.empty()
    renderFromHistory()
    var cards = $('.flippable-card');
    cards.flip()
}

function renderFromHistory() {
    var cities = Object.keys(cityHistoryObject)
    for (i = 0; i < cities.length; i++) {
        generateInfoCard(cityHistoryObject[cities[i]])
        //need lat and lon
        populateHeader(cityHistoryObject[cities[i]])
        populateWeather(cityHistoryObject[cities[i]]);
        populateEvents(cityHistoryObject[cities[i]])
        populateJobs(cityHistoryObject[cities[i]])
        populateScore(cityHistoryObject[cities[i]])
        populateCardBack(cityHistoryObject[cities[i]])
        attachListeners()
    }
}

// didn't get a chance to install a fully functioning algorithm for the overall score, so just generating a number to populate that space with for now
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

// display the score on the page in the appropriate card
// scores are color-coded according to the relative value (green for high, red for low, and orange in between)
function populateScore(cityObject) {
    var scoreCardEl = $("#" + cityObject.nameJS + "-score")
    var scoreEl = $("<h2>")
    const f = chroma.scale(['#BA6B41', '#13DA4C']);
    if (cityObject.score) {

        scoreEl.text(cityObject.score)
        scoreEl.css("color", f((cityObject.score - 80) / 20).toString())
    } else {
        var score = getRandomInt(80, 100)
        scoreEl.text(score)
        scoreEl.css("color", f((score - 80) / 20).toString())
        cityObject['score'] = score
        localStorage.setItem("cityHistoryObject", JSON.stringify(cityHistoryObject))
    }
    var scoreFooter = $("<h5>").text("Overall Score")
    scoreCardEl.append(scoreEl, scoreFooter)
}


// populating a modal with additional detailed info on jobs, events and weather
function attachListeners() {
    $('.jobs').on('click', function () {
        populateJobsModal(cityHistoryObject[$(this).closest(".result-card").attr("data-city-name")])
    })

    function populateJobsModal(cityObject) {
        modalEl.empty();
        // console.log(cityObject)
        modalEl.append($('<h2>').text('Job Listings'))
        var list = ($('<ul>'));
        var results = cityObject.jobs.results;
        for (var i = 0; i < 5; i++) {
            list.append($('<li>').html('<a href = ' + results[i].refs.landing_page + '>' + results[i].name + '</a>'));
        }
        modalEl.append(list);
    }
    $('.weather').on('click', function () {
        populateWeatherModal(cityHistoryObject[$(this).closest(".result-card").attr("data-city-name")])
    })

    function populateWeatherModal(cityHistoryObject) {
        modalEl.empty();
        var foreC = $("<div>", { "class": "grid-x grid-padding-x grid-margin-x" });
        foreC.append($("<div>", { "class": "col medium-2 large-2" }))
        modalEl.append($("<h2>").text("Forecast"));
        // modalEl.append($("<img src = '' alt = 'foreca logo'>"))
        var results = cityHistoryObject.forecaForecast.forecast;
        for (var i = 0; i < 5; i++) {
            var list = ($('<ul>'));
            list.append($('<li>').text("Date: " + results[i].date))
            list.append($('<li>').text("Temp: " + results[i].maxTemp))
            list.append($('<li>').text("Wind Speed: " + results[i].maxWindSpeed))
            // list.append($("<img src = 'https://fnw-us.foreca.com/api/v1/static/images/symbols/results[i].symbol alt = 'weather symbol'>"))
            foreC.append(list)
        }
        modalEl.append(foreC);
    }
    $('.events').on('click', function () {
        populateEventsModal(cityHistoryObject[$(this).closest(".result-card").attr("data-city-name")])
    })

    function populateEventsModal(cityObject) {
        modalEl.empty();
        modalEl.append($('<h2>').text('Nearby Events'))
        var list = ($('<ul>'));
        var events = cityObject.seatgeekResponse.events;
        for (var i = 0; i < 5; i++) {
            list.append($('<li>').html('<a href = ' + events[i].url + '>' + events[i].short_title + '</a>'));
        }
        modalEl.append(list);
    }
}

function populateCardBack(cityObject) {
    console.log("populatingback")
    var scoreCardEl = $("#" + cityObject.nameJS + "-back")
    scoreCardEl.empty()
    scoreCardEl.html("<p>This rating is based on a weighted combination of the weather, available jobs, and upcoming events in " + cityObject.name + ".</p><p> Click on the cards for more info!</p>")
}
var cards = $('.flippable-card');
cards.flip()
attachListeners()


function weatherForecast(cityObject) {

    $.ajax({
        type: 'GET',
        url: 'https://fnw-us.foreca.com/api/v1/forecast/daily/"' + cityObject.lon + ',' + cityObject.lat + '"?lang=en&tempunit=F',
        headers: {
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9wZmEuZm9yZWNhLmNvbVwvYXV0aG9yaXplXC90b2tlbiIsImlhdCI6MTY2NTUyNjI0NiwiZXhwIjo5OTk5OTk5OTk5LCJuYmYiOjE2NjU1MjYyNDYsImp0aSI6IjI3Yzc0MGYzODg0ODEwZWMiLCJzdWIiOiJqb2huZnJvbTIwOSIsImZtdCI6IlhEY09oakM0MCtBTGpsWVR0amJPaUE9PSJ9.R6lwtfrLoCrBhdTpLpZaeKjDbjeQWfZmla6i759u7Wg",
        }
    })
        .then(function (response) {
            cityObject['forecaForecast'] = response;
            console.log(response);
        })
}