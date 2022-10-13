var cityObject = JSON.parse(localStorage.getItem("cityObject"))
var resultsCardsEl = $("#results-cards")

var cityArray = []
if (localStorage.getItem('cityArray')) {
    cityArray = JSON.parse(localStorage.getItem('cityArray'))
}
cityArray.push(cityObject)

for (i = 0; i < cityArray.length; i++) {
    console.log(cityArray[i])
    generateInfoCard(cityArray[i])
}

function generateInfoCard(cityObject) {
    console.log(resultsCardsEl[0].children)
    var rowEl = $("<div>", { "class": "grid-x align-spaced" })
    var outerCardEl = $("<div>", { "class": "card cell med-10 large-10" })
    var innerRowEl = $("<div>", { "class": "grid-x align-middle grid-margin-x grid-padding-x" })
    var headerEl = $("<div>", { "class": "cell medium-4 large-4" })
    var headerCardEl = $("<div>", { "class": "card text-center" })
    var bodyEl = $("<div>", { "class": "cell medium-8 large-8" })
    var bodyGridEl = $("<div>", { "class": "grid-x align-justify grid-margin-x grid-padding-x" })
    var bodyCardEl1 = $("<div>", { "class": "card cell medium-3 large-6 text-center", "id": cityObject.name + "-weather-el" })
    var bodyCardEl2 = $("<div>", { "class": "card cell medium-3 large-6 text-center", "id": cityObject.name + "-events-el" })
    var bodyCardEl3 = $("<div>", { "class": "card cell medium-3 large-6 text-center" })
    var bodyCardEl4 = $("<div>", { "class": "card cell medium-3 large-6 text-center" })
    bodyCardEl1.text("Loading")
    bodyCardEl2.text("Loading")
    bodyCardEl3.text("Loading")
    bodyCardEl4.text("Loading")
    bodyGridEl.append(bodyCardEl1, bodyCardEl2, bodyCardEl3, bodyCardEl4)
    bodyEl.append(bodyGridEl)
    headerEl.append(headerCardEl)
    headerCardEl.text("Loading")
    rowEl.append(outerCardEl.append(innerRowEl.append(headerEl).append(bodyEl)))
    resultsCardsEl.append(rowEl)
    console.log(resultsCardsEl[0].children)
}

$.ajax({
    url: 'https://api.seatgeek.com/2/events?lat=' + cityObject.lat + '&lon=' + cityObject.lon + '&client_id=Mjk2NTg1OTB8MTY2NTUxOTc2Ny4yMjYwMDQ4',
    async: 'false'
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
    var eventNumber = $("<h5>").text("Total: " + cityObject.seatgeekResponse.meta.total)
    cardEl.append(eventNumber);

    var eventTypes = [{}];
    eventTypes.push(cityObject.seatgeekResponse.events[0].type)
    for (let i = 0; i < cityObject.seatgeekResponse.events.length; i++) {
        console.log(i);
        var tempType = cityObject.seatgeekResponse.events[i].type;
        if (!(eventTypes.includes(tempType))) {
            console.log("Type " + tempType);
            eventTypes.push(tempType);
            var eventTypesEl = $("<a>").text(cityObject.seatgeekResponse.events[i].type.toUpperCase());
            eventTypesEl.href = "#";
            eventTypesEl.on("click", loadEventSearch);
            cardEl.append(eventTypesEl);
        }
        else {

        }
    }
    console.log(eventTypes);
}

function loadEventSearch() {
    console.log("event Loaded");
}