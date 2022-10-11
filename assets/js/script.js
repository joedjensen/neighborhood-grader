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
        //move to search page
        //then call api's
    }

}

searchBtnEl.on("click", fetchResults);