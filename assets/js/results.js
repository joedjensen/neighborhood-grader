var cityObject = JSON.parse(localStorage.getItem("cityObject"))
var resultsCardsEl = $("#results-cards")

var cityArray = ["Syracuse", "Washington"]
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
    var largeCardEl = $("<div>", {"class": "cell card align-center auto"})
    var cardGridX =  $("<div>", {"class": "grid-x grid-padding-x grid-margin-x"})
    var headerGridY = $("<div>", {"class": "grid-y align-center", "style":"height:100%"})
    var headerEl =  $("<div>", {"class": "cell medium-4 large-4"})
    var headerCardEl =  $("<div>", {"class": "card text-center"})
    var bodyEl = $("<div>", {"class": "cell medium-8 large-8"})
    var bodyGridEl =  $("<div>", {"class": "grid-x align-justify grid-margin-x grid-padding-x"})
    bodyCardEl1 = $("<div>", {"class": "card cell medium-3 large-6 text-center", "id" : cityObject.name + "-weather-el"})
    bodyCardEl2 = $("<div>", {"class": "card cell medium-3 large-6 text-center", "id" : cityObject.name + "-jobs-el"})
    bodyCardEl3 = $("<div>", {"class": "card cell medium-3 large-6 text-center", "id" : cityObject.name + "-events-el"})
    bodyCardEl1.text("Loading")
    bodyCardEl2.text("Loading")
    bodyCardEl3.text("Loading")
    bodyGridEl.append(bodyCardEl1, bodyCardEl2, bodyCardEl3)
    bodyEl.append(bodyGridEl)
    headerEl.append(headerGridY.append(headerCardEl))
    headerCardEl.text("Loading")
    largeCardEl.append(cardGridX.append(headerEl).append(bodyEl))
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


function weatherApi(cityObject, lat, lon) {

    $.ajax({
        type: 'GET',
        url: 'https://fnw-us.foreca.com/api/v1/observation/latest/%22' + lon + ',' + lat + '%22?lang=en&tempunit=F',
        headers: {
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9wZmEuZm9yZWNhLmNvbVwvYXV0aG9yaXplXC90b2tlbiIsImlhdCI6MTY2NTUyNjI0NiwiZXhwIjo5OTk5OTk5OTk5LCJuYmYiOjE2NjU1MjYyNDYsImp0aSI6IjI3Yzc0MGYzODg0ODEwZWMiLCJzdWIiOiJqb2huZnJvbTIwOSIsImZtdCI6IlhEY09oakM0MCtBTGpsWVR0amJPaUE9PSJ9.R6lwtfrLoCrBhdTpLpZaeKjDbjeQWfZmla6i759u7Wg",
        }
    })
        .then(function (response) {
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
    var feels = $("<h5>").text("Feels Like: " + cityObject.foreca.observations.feelsLikeTemp);
    var humidity = $("<h5>").text("Humidity: " + cityObject.foreca.observations.relHumidity);
    var symbol = $("<img>").text(cityObject.foreca.observations.symbol);
    var temp = $("<h5>").text("Temperature: " + cityObject.foreca.observations.temperature);
    var windSpeed = $("<h5>").text("Windspeed: " + cityObject.foreca.observations.windSpeed);

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
            bodyCardEl2.text('');
            jobsList.prepend(jobNum);
            jobsList.append(jobEx1, jobEx2, jobEx3);
            bodyCardEl2.append(jobsList);
        })
}