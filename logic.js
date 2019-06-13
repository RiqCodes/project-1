

// Or with jQuery
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

    $('select').formSelect();


    // favorite input & save function
    $(".card-action").on("click", function () {
        // $()append("collection-item avatar")
        // get the user input from form
        const startLocation = $("#start").val().trim();
        const endLocation = $("#end").val().trim();

        const userCoordinates = new Fav(startLocation, endLocation)


        const key = database.ref().child("favorites").push().key
        const updates = {}
        updates[`/favorites/${key}`] = userCoordinates
        console.log(updates)
        database.ref().update(updates)

        renderFavorites(key, startLocation, endLocation)

    });

    if (window.firebase) {
        database.ref().once('value', function (data) {
            console.log(data.val().favorites)
            const favorites = data.val().favorites

            for (let key in favorites) {
                console.log(key)
                console.log(favorites[key])
                renderFavorites(key, favorites[key].startLocation, favorites[key].endLocation)

            }

        })
    }

    const renderFavorites = (key, startLocation, endLocation) => {
        // create new list item for the unorder list
        const newListItem = $("<li>");
        // add a class to the <li> 
        newListItem.addClass("collection-item avatar");
        // creating a p tag
        const $pTag = $("<p>");
        // creating a span tag
        const $span = $("<span>");
        //set the text in span to Title
        $span.text("Favorite");
        // gives a class to the span 
        $span.addClass("favorite");
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
        $pTag.html(startLocation + "<br>" + endLocation);
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






 
    var latitude;
    var longitude;
    var stopID; 
   
    
    

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

    function getStops(){
        var $query = `http://api.actransit.org/transit/stops/${latitude}/${longitude}/1000/?token=73C0EC914517EE7D0DA47B8BE90D788B`;
    
        $.ajax({
            url : $query,
            method: "GET"
        }).then(function(stops){ 
            for (var stop = 0; stop < Object.keys(stops).length; stop ++){
                var stopbtn = $('<button>').attr("id", 'stops');
                stopbtn.attr('stopID', stops[stop].StopId).text(stops[stop].Name);
                $('#display').append(stopbtn);
            }
        });
        
            

        
    }
    //this function uses the AC transit 'stops/{stopId}/predictions' url to retrieve data about vehicles that is predicted to pass by the stop
    //then appending the information to yourlocation.html page to display the route info
    


    function getVehicleOnStop() {
        $.ajax({
            url : `https://api.actransit.org/transit/stops/${stopID}/predictions/?token=73C0EC914517EE7D0DA47B8BE90D788B`,
            method : "GET"
        }).then(function(predictions){
            console.log(predictions)
            for (var bus = 0; bus < Object.keys(predictions).length; bus ++){
                

                var estimateTime = moment(predictions[bus].PredictedDeparture);
                var otherTime = moment(predictions[bus].PredictionDateTime)
                var predicted = moment(estimateTime).unix()
                var current = moment(otherTime).unix();
                var remaining = predicted - current;
                var rounded = Math.round(remaining/60)
                
                var busPredictionDiv = $('<div>');
                var text = $('<h3>').text("Bus route: " + predictions[bus].RouteName + ', comes in ' + rounded + ' minutes');
                busPredictionDiv.append(text);
                $("#routes").append(busPredictionDiv);
                



            }
            


          

        })

    }
    
    function getRoutes() {
        $.ajax({
            url: `https://api.actransit.org/transit/routes/?token=73C0EC914517EE7D0DA47B8BE90D788B`,
            method: "GET"
        }).then(function (destination) {    
            populate(destination, '#start')
            populate(destination, '#end')
            console.log()
        })
    }

    const populate = (destination, target) => {
        //[{RouteId: "1", Name: "1", Description: "San Leandro Bart\ Dtn. Oakland"}, ...]
        for (var routes = 0; routes < Object.keys(destination).length; routes++) {
            var nO = $('<option>');
            nO.attr('value', destination[routes].RouteId)
            nO.attr('id', 'rout')
            nO.text(destination[routes].Name + ": " + destination[routes].Description)
            $(target).append(nO);
            $(target).formSelect(); 
        }
    }
    //end of AC Transit section
    //once clicked, it retrieves the value assigned to the buttons, which is the stopID of that stop name, then using this information to fire 
    //up getVehicleOnStop function to get predictions on this stop. 
    $(document).on('click', '#stops', function(){
        $('#routes').empty();
        stopID = $(this).attr('stopID');
        getVehicleOnStop();

    });
    
    //calls the function to grab the IP
    //getIP();
    getRoutes()
});


