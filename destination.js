

// Or with jQuery

$(document).ready(function () {

    $('.sidenav').sidenav();
    // select option
    // with jQuery
    $('#options').formSelect();


    // favorite input & save function
    $(".card-action").on("click", function () {
        // $()append("collection-item avatar")
        // get the user input from form
        const userLocation = $("#start").val().trim();
        const endLocation = $("#end").val().trim();

        // create new list item for the unorder list
        const newListItem = $("<li>");
        // add a class to the <li> 
        newListItem.addClass("collection-item avatar");
        // creating a p tag
        const $pTag = $("<p>");
        // creating a span tag
        const $span = $("<span>");
        //set the text in span to Title
        $span.text("Title");
        // gives a class to the span 
        $span.addClass("title");
        // const $img = $("<img>");
        // $img.attr("src","")
        // creating a icon tag
        // $img.addClass("circle");
        const $ifolder = $("<i>")
        // adding a class to the icon tag
        $ifolder.addClass("material-icons circle")
        // gives text the icon tag
        $ifolder.text("folder")
        // creating an anchor tag
        const $a = $("<a>");
        // add a class to the anchor tag
        $a.addClass("secondary-content")
        // gives the anchor tag a link 
        $a.attr("href", "#")
        // creates another icon tag
        const $i = $("<i>")
        // gives a class to the second icon tag
        $i.addClass("material-icons")
        // gives text to the icon tag
        $i.text("grade")
        // apend the icon tag to the anchor tag
        $a.append($i);
        // give userLocation and endLocation tot the p tag
        $pTag.html(userLocation + "<br>" + endLocation);
        // append $ifolder, $span, $a tag
        newListItem.append($ifolder, $span, $pTag, $a);
        // append new item to order list
        $(".collection").append(newListItem);
    });









  
    var latitude;
    var longitude;
    var stopID=[];
    var routeID;
    

    

    navigator.geolocation.getCurrentPosition(function(position) {
        latitude = position.coords.latitude,
        longitude = position.coords.longitude;
        getStops()
        var mymap = L.map('mapid').setView([latitude, longitude], 15);
    
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: 'mapbox.streets'
            }).addTo(mymap);
            var marker = L.marker([latitude, longitude]).addTo(mymap);
    });
//  START OF AC TRANSIT API SECTION

//Uses the longitude and latitude value retrieved from the previous function to input into AC trasit URL to get the stops within 
//1000 square feet, then retrieves the stopsID info and appending it to the stopID array declared globally; 
    function getStops() {
        var $query = `http://api.actransit.org/transit/stops/${latitude}/${longitude}/1000/?token=73C0EC914517EE7D0DA47B8BE90D788B`;

        $.ajax({
            url: $query,
            method: "GET"
        }).then(function (stops) {
            for (var stop = 0; stop < Object.keys(stops).length; stop++) {
                stopID[stop] = stops[stop].StopId
            }

        });
    }

//step one, grabs data getStops, which is stopID, and make an API request to ac transit to retrieve data about the stops, namely to get the routeName on that passes
//by that stop, the departure time, and time to wait;
//step two, uses data retrieved from getRoutes, which is routeID
//step three, if data grabed from step one (routeName) equals to the data from step two (routeID), then displays the info about the route and the estimate time that it will come; 
//If the first condtional statement does not fire, then fire the subsequent one, which just displays that the route is not found. 


    function getVehicleOnStop() {
        for (var i = 0; i < stopID.length; i ++){
            $.ajax({
                url: `https://api.actransit.org/transit/stops/${stopID[i]}/predictions/?token=73C0EC914517EE7D0DA47B8BE90D788B`,
                method: "GET"
            }).then(function (predictions) {
              
                for (var bus = 0; bus < Object.keys(predictions).length; bus++) {
                    if (predictions[bus].RouteName === routeID){

                        var estimateTime = moment(predictions[bus].PredictedDeparture);
                        var otherTime = moment(predictions[bus].PredictionDateTime)
                        var predicted = moment(estimateTime).unix()
                        var current = moment(otherTime).unix();
                        var remaining = predicted - current;
                        var rounded = Math.round(remaining / 60)
                        var busPredictionDiv = $('<div>');
                        var text = $('<h3>').text("Bus route: " + predictions[bus].RouteName + ', comes in ' + rounded + ' minutes');
                        busPredictionDiv.append(text);
                        $("#routes").append(busPredictionDiv);

                    }
                 
                    
    
    
                }
            });
    

        }

    }
    //this function makes an API call to ac transit to retrieve data about routes and then dinamically renders option tags with each route name and description to the html page; see $('.select-picker)
    
    
    function getRoutes() {
        $.ajax({
            url: `https://api.actransit.org/transit/routes/?token=73C0EC914517EE7D0DA47B8BE90D788B`,
            method: "GET"
        }).then(function (destination) { 
            console.log(destination)
               

            for (var routes = 0; routes < Object.keys(destination).length; routes++) {
                var nO = $('<option>');
                nO.attr('value', destination[routes].RouteId)
                nO.attr('id', 'route')
                nO.text(destination[routes].Name + ": " + destination[routes].Description)
                $('#options').append(nO);
                $('#options').formSelect(); 
                
            }

        })
        

    }
 
//fires get route function, see function
    getRoutes();

 
    //once the an option is selected, it saves the value assigned to that option to routeID, then fires getVehicleOnStop function.

    $('.select-picker').change(function(e){
        routeID= e.target.value;
        $('#routes').empty();
        
        
        getVehicleOnStop();
    });


});
