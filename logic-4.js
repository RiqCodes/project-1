document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    // var instances = M.Sidenav.init(elems, options);
    var instances = M.Sidenav.init(elems);
});

  // Or with jQuery

  $(document).ready(function(){
    $('.sidenav').sidenav();

    // select option
    // with jQuery
      
    $('select').formSelect();
      
  
    // favorite input & save function
    $(".card-action").on("click", function() {
        // $()append("collection-item avatar")
        // get the user input from form
        const userLocation  = $("#start").val().trim();
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
    var stopID; 
    
    

    function getIP(){
        $.ajax({
            url : 'https://api.ipify.org?format=jsonp&callback=?',
            dataType : "json"
        }).then(function(data){
            IP = data.ip
            getLocation()
        });

    }
    function getLocation(){
        var query = {
            url : `http://api.ipstack.com/${IP}?access_key=711ae091724cdd59c84aed29e5d6d3d0`,
            method: "GET"
        }

        $.ajax(query).then(function(location){
            
            
            latitude = location.latitude;
            longitude = location.longitude;
            getStops(); 
        });
        

    }

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
                console.log(rounded);
                var busPredictionDiv = $('<div>');
                var text = $('<h3>').text("Bus route: "+predictions[bus].RouteName + ', comes in '+rounded+ ' minutes');
                busPredictionDiv.append(text);
                $("#routes").append(busPredictionDiv);
                console.log(estimateTime)

                
                
            }

            
            console.log(predictions);

        })

    }
    $(document).on('click', '#stops', function(){
        stopID = $(this).attr('stopID');
        getVehicleOnStop();

    });

    getIP();

});
