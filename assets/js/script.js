var searchBtnEl = $(".searchBtn");
// Get the modal
var modal = document.getElementById("myModal");
// Get the button that opens the modal
var closeCitybtn = document.getElementsByClassName("close")[0];

//Need to sync up the locations 
var lat = 0;
var lon = 0;


function fetchResults(event) {
    console.log("here we go")
    event.preventDefault();
    //save street and city values
    var cityName = $("#findlocate").val();

    if (!cityName) {
        if (document.location.pathname == "/results.html") {
            $("label").text("").append(" Enter a city Name, such as Fresno, Chicago, or New York").css({ "color": "red" });
        } else {
            $("#cityStatus").text("Enter a city Name, such as Fresno, Chicago, or New York");
            modal.style.display = "block";
        }
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

                if (!data.locations.length) {
                    console.log(document.location)
                    if (document.location.pathname == "/results.html") {
                        $("label").text("").append("City not Found: " + cityName).css({ "color": "red" });
                        $("#findlocate").val("");
                    } else {
                        modal.style.display = "block";
                        $("#findlocate").val("");
                        $("#cityStatus").text("City not Found: " + cityName);
                    }
                    return data;
                }

                lon = data.locations[0].lon;
                lat = data.locations[0].lat;

                lon = parseFloat(lon).toFixed(2);
                lat = parseFloat(lat).toFixed(2);

                var cityObject = {
                    "name": data.locations[0].name,
                    "nameJS": data.locations[0].name.replace(/\s/g, '-'),
                    "lat": lat,
                    "lon": lon
                }
                localStorage.setItem("cityObject", JSON.stringify(cityObject));
                if (document.location.pathname == "/results.html") {
                    document.location.replace("./results.html")
                } else {
                    document.location = "./results.html"
                }
            })
    }

}

searchBtnEl.on("click", fetchResults);

console.log(searchBtnEl)

if (closeCitybtn) {
    // When the user clicks on <span> (x), close the modal
    closeCitybtn.onclick = function () {
        modal.style.display = "none";
    }
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}