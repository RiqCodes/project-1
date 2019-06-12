

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









    var IP;
    var latitude;
    var longitude;
    var stopID=[];
    var routeID;

    

//called at the bottom of the script page, automatically gets the user's ip address
    function getIP(){
        $.ajax({
            url : 'https://api.ipify.org?format=jsonp&callback=?',
            dataType : "json"
        }).then(function(data){
            IP = data.ip
            //calls this function to get location
            getLocation()
        });

    }
//this function getst he location of the user using their IP address, retrieves and stores the longitute and the latitude in global 
//variables declared above
    function getLocation(){
        var query = {
            url : `http://api.ipstack.com/${IP}?access_key=711ae091724cdd59c84aed29e5d6d3d0`,
            method: "GET"
        }

        $.ajax(query).then(function(location){
            
            //updates longtude and latutude value
            latitude = location.latitude;
            longitude = location.longitude;
            getStops(); 
        });
        

    }
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
                    else{
                        var busPredictionDiv = $('<div>');
                        var text = $('<h3>').text("Selected Bus does not pass by your location, select a different bus");
                        busPredictionDiv.append(text);
                        $("#routes").append(busPredictionDiv);
                    }
                    
    
    
                }
            })
    

        }

    }
    //this function makes an API call to ac transit to retrieve data about routes and then dinamically renders option tags with each route name and description to the html page; see $('.select-picker)
    
    
    function getRoutes() {
        $.ajax({
            url: `https://api.actransit.org/transit/routes/?token=73C0EC914517EE7D0DA47B8BE90D788B`,
            method: "GET"
        }).then(function (destination) {    

            for (var routes = 0; routes < Object.keys(destination).length; routes++) {
                var nO = $('<option>');
                nO.attr('value', destination[routes].RouteId)
                nO.attr('id', 'rout')
                nO.text(destination[routes].Name + ": " + destination[routes].Description)
                $('#options').append(nO);
                $('#options').formSelect(); 
                
            }
            
           

        })

    }

   

    
//fires get route function, see function
    getRoutes();
    //fires getIP function, see function
    getIP();
    

    
    
    //once the an option is selected, it saves the value assigned to that option to routeID, then fires getVehicleOnStop function.

    $('.select-picker').change(function(e){
        routeID= e.target.value;
        $('#routes').empty();
        
        getVehicleOnStop();
    });


});
