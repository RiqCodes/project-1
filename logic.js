    $(document).ready(function(){
    
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
            })
            
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

    // need to add in display section, 