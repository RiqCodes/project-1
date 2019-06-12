
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    // var instances = M.Sidenav.init(elems, options);
    var instances = M.Sidenav.init(elems);
});

  // Or with jQuery
  let favArray = []

  function Fav(start, end) {
      this.startLocation = start
      this.endLocation = end
  }
  
//   database.ref().once('value', function (snap) {
//       console.log(snap.val().faves)
//       favArray = snap.val().faves
  
  
//       for(let i = 0; i < favArray.length; i++) {
//            // create new list item for the unorder list
//         const newListItem = $("<li>");
//         // add a class to the <li> 
//         newListItem.addClass("collection-item avatar");
//         // creating a p tag
//         const $pTag = $("<p>");
//         // creating a span tag
//         const $span = $("<span>");
//         //set the text in span to Title
//         $span.text("Title");
//         // gives a class to the span 
//         $span.addClass("title");
//         // const $img = $("<img>");
//         // $img.attr("src","")
//         // creating a icon tag
//         // $img.addClass("circle");
//         const $ifolder = $("<i>")
//         // adding a class to the icon tag
//         $ifolder.addClass("material-icons circle")
//         // gives text the icon tag
//         $ifolder.text("folder")
//         // creating an anchor tag
//         const $a = $("<a>"); 
//         // add a class to the anchor tag
//         $a.addClass("secondary-content")
//         // gives the anchor tag a link 
//         $a.attr("href", "#")
//         // creates another icon tag
//         const $i = $("<i>")
//         // gives a class to the second icon tag
//         $i.addClass("material-icons")
//         // gives text to the icon tag
//         $i.text("grade")
//         // apend the icon tag to the anchor tag
//         $a.append($i); 
//         // give userLocation and endLocation tot the p tag
//         $pTag.html(userLocation + "<br>" + endLocation);
//         // append $ifolder, $span, $a tag
//         newListItem.append($ifolder, $span, $pTag, $a);
//         // append new item to order list
//         $(".collection").append(newListItem); 
//       }
//   })
  


  let database

  $(document).ready(function(){

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
    $(".card-action").on("click", function() {
        // $()append("collection-item avatar")
        // get the user input from form
        const startLocation  = $("#start").val().trim();
        const endLocation = $("#end").val().trim();
        
        const userCoordinates = new Fav(startLocation, endLocation)

        // favArray.push(userCoordinates)

        // database.ref().set({
        //     faves: favArray
        // });

        // database.ref().child("favorites").push( userCoordinates )

        const key = database.ref().child("favorites").push().key
        const updates = {}
        updates[`/favorites/${key}`] = userCoordinates
        console.log(updates)
        database.ref().update(updates)

        renderFavorites(key, startLocation, endLocation)
        // // create new list item for the unorder list
        // const newListItem = $("<li>");
        // // add a class to the <li> 
        // newListItem.addClass("collection-item avatar");
        // // creating a p tag
        // const $pTag = $("<p>");
        // // creating a span tag
        // const $span = $("<span>");
        // //set the text in span to Title
        // $span.text("Title");
        // // gives a class to the span 
        // $span.addClass("title");
        // // const $img = $("<img>");
        // // $img.attr("src","")
        // // creating a icon tag
        // // $img.addClass("circle");
        // const $ifolder = $("<i>")
        // // adding a class to the icon tag
        // $ifolder.addClass("material-icons circle")
        // // gives text the icon tag
        // $ifolder.text("folder")
        // // creating an anchor tag
        // const $a = $("<a>"); 
        // // add a class to the anchor tag
        // $a.addClass("secondary-content")
        // // gives the anchor tag a link 
        // $a.attr("href", "#")
        // // creates another icon tag
        // const $i = $("<i>")
        // // gives a class to the second icon tag
        // $i.addClass("material-icons")
        // // gives text to the icon tag
        // $i.text("grade")
        // // apend the icon tag to the anchor tag
        // $a.append($i); 
        // // give userLocation and endLocation tot the p tag
        // $pTag.html(startLocation + "<br>" + endLocation + "<br>" + key);
        // // append $ifolder, $span, $a tag
        // newListItem.append($ifolder, $span, $pTag, $a);
        // // append new item to order list
        // $(".collection").append(newListItem); 
    });

    if (window.firebase) {
        database.ref().once('value', function(data){
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
        $i.text("grade close")
        // apend the icon tag to the anchor tag
        $a.append($i); 
        // give userLocation and endLocation tot the p tag
        $pTag.html(startLocation + "<br>" + endLocation + "<br>" + key);
        // append $ifolder, $span, $a tag
        newListItem.append($ifolder, $span, $pTag, $a);
        // append new item to order list
        $(".collection").append(newListItem); 
    }



  




    var IP;
    var latitude;
    var longitude;
    var stopID; 
   
    
    
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
    //1000 square feet, then dynamically create buttons on the page and assigning corresponding stopID from each stop to the buttons.

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
    

    function getVehicleOnStop(){
        $.ajax({
            url : `https://api.actransit.org/transit/stops/${stopID}/predictions/?token=73C0EC914517EE7D0DA47B8BE90D788B`,
            method : "GET"
        }).then(function(predictions){
            for (var bus = 0; bus < Object.keys(predictions).length; bus ++){
                

                var estimateTime = moment(predictions[bus].PredictedDeparture);
                var otherTime = moment(predictions[bus].PredictionDateTime)
                var predicted = moment(estimateTime).unix()
                var current = moment(otherTime).unix();
                var remaining = predicted - current;
                var rounded = Math.round(remaining/60)
                
                var busPredictionDiv = $('<div>');
                var text = $('<h3>').text("Bus route: "+predictions[bus].RouteName + ', comes in '+rounded+ ' minutes');
                busPredictionDiv.append(text);
                $("#routes").append(busPredictionDiv);
                

                
                
            }

            
            console.log(predictions);

        })

    }
    

    //end of AC Transit section
    //once clicked, it retrieves the value assigned to the buttons, which is the stopID of that stop name, then using this information to fire 
    //up getVehicleOnStop function to get predictions on this stop. 
    $(document).on('click', '#stops', function(){
        stopID = $(this).attr('stopID');
        getVehicleOnStop();

    });
    
    //calls the function to grab the IP
    getIP();

});


