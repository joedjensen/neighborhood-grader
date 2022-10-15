var searchBtnEl = $(".searchBtn");
// Get the modal
var modal = document.getElementById("myModal");
// Get the button that opens the modal
var closeCitybtn = document.getElementsByClassName("close")[0];

//Need to sync up the locations 
var lat = 0;
var lon = 0;

function fetchResults(event) {
    event.preventDefault();
    //save street and city values
    var cityName = $("#findlocate").val();

    if (!cityName) {
        $("#cityStatus").text("Enter a city Name, such as Fresno, Chicago, or New York");
        modal.style.display = "block";
        return;
    }
    else {

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

                if (data.location === 0) {
                    modal.style.display = "block";
                    $("#cityStatus").text("City not Found: " + cityName);
                    return data;
                }

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

                document.location = "./results.html"
            })
    }
}

searchBtnEl.on("click", fetchResults);

// When the user clicks on <span> (x), close the modal
closeCitybtn.onclick = function () {
    modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}