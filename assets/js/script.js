var searchBtnEl = $(".searchBtn");

//Need to sync up the locations 
var lat = 0;
var lon = 0;

function fetchResults(event) {
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

// Foreca api
// $.ajax({
//     url: 'https://fnw-us.foreca.com/api/v1/location/search/Barcelona?lang=es',
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

searchBtnEl.on("click", fetchResults);