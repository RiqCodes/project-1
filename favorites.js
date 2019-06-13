let favArray = []

function Fav(start, end) {
    this.startLocation = start
    this.endLocation = end
}

let database

$(document).ready(function () {
    if (window.firebase) {
        // Your web app's Firebase configuration
        var firebaseConfig = {
            apiKey: "AIzaSyCi-pMxoEWX4y7lvwYuREsjX3LEqnegu3w",
            authDomain: "denzel-s-uniquer-project-1.firebaseapp.com",
            databaseURL: "https://denzel-s-uniquer-project-1.firebaseio.com",
            projectId: "denzel-s-uniquer-project-1",
            storageBucket: "denzel-s-uniquer-project-1.appspot.com",
            messagingSenderId: "169352910796",
            appId: "1:169352910796:web:0fbbd3cf4c0b6c15"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);

        database = firebase.database()
    }

    $('.sidenav').sidenav();
    // select option
    // with jQuery
    $('#start').formSelect();
    $('#end').formSelect(); 


    // favorite input & save function
    $(".card-action").on("click", function () {
        // $()append("collection-item avatar")
        // get the user input from form
        const startSelect = $('#start option:selected')
        const endSelect = $('#end option:selected')

        const route = {
            routeId: startSelect.attr('data-routeid'),
            description: startSelect.attr('data-description')
        }
        const stopLocation = {
            stopId: endSelect.attr('data-stopid'),
            name: endSelect.attr('data-name')
        }

        //const userCoordinates = new Fav(startLocation, endLocation)
        const userCoordinates = {
            route: route,
            stopLocation: stopLocation
        }


        const key = database.ref().child("favorites").push().key
        const updates = {}
        updates[`/favorites/${key}`] = userCoordinates
        console.log(updates)
        database.ref().update(updates)

        renderFavorites(key, route, stopLocation)

    });

    if (window.firebase) {
        database.ref().once('value', function (data) {
            console.log(data.val().favorites)
            const favorites = data.val().favorites

            for (let key in favorites) {
                console.log(key)
                console.log(favorites[key])
                // renderFavorites(key, favorites[key].route, favorites[key].stopLocation)
                $.ajax({
                    url: `https://api.actransit.org/transit/stops/${favorites[key].stopLocation.stopId}/predictions/?token=73C0EC914517EE7D0DA47B8BE90D788B`,
                    method: "GET"
                }).then(function (predictions) {
                    console.log(predictions)
                    const result = predictions.filter( e => e.RouteName === favorites[key].route.routeId)   
                    console.log(result)
                    var estimateTime = moment(result[0].PredictedDeparture);
                    var otherTime = moment(result[0].PredictionDateTime)
                    var predicted = moment(estimateTime).unix()
                    var current = moment(otherTime).unix();
                    var remaining = predicted - current;
                    var rounded = 'in '+ Math.round(remaining / 60) + ' minutes'
                    renderFavorites(key, favorites[key].route, favorites[key].stopLocation, rounded)
                })     
            }

        })
    }

    const renderFavorites = (key, route, stopLocation, time) => {
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
        $i.addClass("material-icons gold-icon")
        // gives text to the icon tag
        $i.text("grade")
        // creates another icon tag
        const $x = $("<i>")
        // gives a class to the second icon tag
        $x.addClass("material-icons deleteFav")
        $x.attr("data-id", key)
        // gives text to the icon tag
        $x.text("close")
        // apend the icon tag to the anchor tag
        $a.append($i, $x);
        // give userLocation and endLocation tot the p tag
        $pTag.html(`${route.routeId} ${route.description}` + "<br>" + `${stopLocation.stopId} ${stopLocation.name} ${time||"n/a"}`);
        // append $ifolder, $span, $a tag
        newListItem.append($ifolder, $span, $pTag, $a);
        // append new item to order list
        $(".collection").append(newListItem);
    }

    $(document).on('click', '.deleteFav', function (event) {
        console.log(this)
        const key = $(this).attr("data-id")
        console.log(key)
        database.ref(`/favorites/${key}`).remove();
        $(this).parent().parent().remove();
    })









  
   
    var stopID;
    var routeID;
    var tripID;
    
  
    
    

    

   
//  START OF AC TRANSIT API SECTION



//step one, grabs data getStops, which is stopID, and make an API request to ac transit to retrieve data about the stops, namely to get the routeName on that passes
//by that stop, the departure time, and time to wait;
//step two, uses data retrieved from getRoutes, which is routeID
//step three, if data grabed from step one (routeName) equals to the data from step two (routeID), then displays the info about the route and the estimate time that it will come; 
//If the first condtional statement does not fire, then fire the subsequent one, which just displays that the route is not found. 


    function getVehicleOnStop() {
       
        $.ajax({
            url: `https://api.actransit.org/transit/stops/${stopID}/predictions/?token=73C0EC914517EE7D0DA47B8BE90D788B`,
            method: "GET"
        }).then(function (predictions) {
            console.log(predictions)
            
            for (var bus = 0; bus < Object.keys(predictions).length; bus++) {
                if (predictions[bus].RouteName === routeID){

                    estimateTime = moment(predictions[bus].PredictedDeparture);
                    otherTime = moment(predictions[bus].PredictionDateTime)
                    predicted = moment(estimateTime).unix()
                    current = moment(otherTime).unix();
                    remaining = predicted - current;
                    rounded = Math.round(remaining / 60)
                    busPredictionDiv = $('<div>');
                    text = $('<h3>').text("Bus route: " + predictions[bus].RouteName + ', comes in ' + rounded + ' minutes');
                    busPredictionDiv.append(text);
                    $("#routes").append(busPredictionDiv);

                }
                
                


            }
        });
            
    

        

    }
   


    function getRoutes() {
        $.ajax({
            url: `https://api.actransit.org/transit/routes/?token=73C0EC914517EE7D0DA47B8BE90D788B`,
            method: "GET"
        }).then(function (destination) {    
            populate(destination, '#start')
        })
    }

    const populate = (destination, target) => {
        //[{RouteId: "1", Name: "1", Description: "San Leandro Bart\ Dtn. Oakland"}, ...]
        for (var routes = 0; routes < Object.keys(destination).length; routes++) {
            var nO = $('<option>');
            nO.attr('value', destination[routes].RouteId)
            nO.attr('id', 'rout')

            nO.attr('data-routeid', destination[routes].RouteId)
            nO.attr('data-description', destination[routes].Description)
            
            nO.text(destination[routes].Name + ": " + destination[routes].Description)
            $(target).append(nO);
            $(target).formSelect(); 
        }
    }
    const populate2 = (data, lol) => {
        for (var info = 0; info < Object.keys(data).length; info ++){
            var newop = $('<option>');
            newop.attr('value', data[info].StopId);

            newop.attr('data-stopid', data[info].StopId)
            newop.attr('data-name', data[info].Name)

            newop.text(data[info].Name)            
            $(lol).append(newop);
            $(lol).formSelect(); 
        

        }

    }
    function getTripID (){
        $.ajax({
            url : `https://api.actransit.org/transit/route/${routeID}/vehicles/?token=73C0EC914517EE7D0DA47B8BE90D788B`,
            method : "GET"
        }).then(function(response){
            tripID = response[0].CurrentTripId;
            getStopsOnRoute();
            console.log(tripID);

        })
      
    }

    function getStopsOnRoute(){
        $.ajax({
            url : `https://api.actransit.org/transit/route/${routeID}/trip/${tripID}/stops?token=73C0EC914517EE7D0DA47B8BE90D788B`,
            method : "GET"
        }).then(function(data){
            populate2(data, '#end');
            console.log("[getStopsOnRoute]", data)
            
           
        }) 
    }
 
//fires get route function, see function
    getRoutes();

 
    //once the an option is selected, it saves the value assigned to that option to routeID, then fires getVehicleOnStop function.

    $('.select-picker').change(function(e){
        
        routeID = e.target.value;
        
       
        getTripID();
       
    });

    $(document).on('change', '.selectPicker', function(e){
        stopID = e.target.value
 

        getVehicleOnStop()
       
        
        
    })


});
