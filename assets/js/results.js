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
    var bodyCardEl1 = $("<div>", {"class": "card cell medium-3 large-6 text-center", "id" : cityObject.name + "-weather-el"})
    var bodyCardEl2 = $("<div>", {"class": "card cell medium-3 large-6 text-center", "id" : cityObject.name + "-events-el"})
    var bodyCardEl3 = $("<div>", {"class": "card cell medium-3 large-6 text-center"})
    var bodyCardEl4 = $("<div>", {"class": "card cell medium-3 large-6 text-center"})
    bodyCardEl1.text("Loading")
    bodyCardEl2.text("Loading")
    bodyCardEl3.text("Loading")
    bodyCardEl4.text("Loading")
    bodyGridEl.append(bodyCardEl1, bodyCardEl2, bodyCardEl3, bodyCardEl4)
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
})

function populateEvents(cityObject) {
    var cardEl = $("#" + cityObject.name + "-events-el")
    cardEl.text(cityObject.seatgeekResponse.meta.total)
}

$.ajax({
    url: 'https://api.walkscore.com/score?format=json&address=1119%8th%20Avenue%20Seattle%20WA%2098101&lat=47.6085&lon=-122.3295&transit=1&bike=1&wsapikey=90425d88251785bef4ec50a92b54800c'
})
.then(function (response) {
    cityObject['wsReponse'] = response;
    console.log(cityArray.wsResponse)
})