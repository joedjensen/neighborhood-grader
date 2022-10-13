var cityObject = JSON.parse(localStorage.getItem("cityObject"))
var resultsCardsEl = $("#results-cards")

var cityArray = ["Syracuse", "Washington"]
if (localStorage.getItem('cityArray')) {
     cityArray = JSON.parse(localStorage.getItem('cityArray'))
}
cityArray.push(cityObject)

for (i=0; i<cityArray.length; i++) {
    console.log(cityArray[i])
    generateInfoCard(cityArray[i])
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
    console.log(cityArray.seatgeekResponse)
    populateEvents(cityObject)
    populateJobs(cityObject);
})

function populateEvents(cityObject) {
    var cardEl = $("#" + cityObject.name + "-events-el")
    cardEl.text(cityObject.seatgeekResponse.meta.total)
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