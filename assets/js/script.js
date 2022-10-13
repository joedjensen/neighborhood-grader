var searchBtnEl = $(".searchBtn");

function fetchResults(event) {
    event.preventDefault();
    //save street and city values
    var streetName = $("#findtext").val();
    var cityName = $("#findlocate").val();

    if (!streetName || !cityName) {
        console.log("Need both street and city.");
        return;
    }
    else {
        console.log("Thanks for the location.");
        //move to search page or clear the page
        //then call api's

        // Seatgeek api
        fetch('https://api.seatgeek.com/2/events?venue.state=NY&client_id=Mjk2NTg1OTB8MTY2NTUxOTc2Ny4yMjYwMDQ4')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
            })
    }

}

// Foreca api
$.ajax({
    url: 'https://fnw-us.foreca.com/api/v1/location/search/Barcelona?lang=es',
    headers: {
        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9wZmEuZm9yZWNhLmNvbVwvYXV0aG9yaXplXC90b2tlbiIsImlhdCI6MTY2NTUyNjI0NiwiZXhwIjo5OTk5OTk5OTk5LCJuYmYiOjE2NjU1MjYyNDYsImp0aSI6IjI3Yzc0MGYzODg0ODEwZWMiLCJzdWIiOiJqb2huZnJvbTIwOSIsImZtdCI6IlhEY09oakM0MCtBTGpsWVR0amJPaUE9PSJ9.R6lwtfrLoCrBhdTpLpZaeKjDbjeQWfZmla6i759u7Wg",
    }
})
    .then(function (response) {
        return response;
    })
    .then(function (data) {
        console.log(data);
    })

searchBtnEl.on("click", fetchResults);