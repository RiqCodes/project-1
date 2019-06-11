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
            console.log(IP);
            
            $.ajax(query).then(function(location){
                
                
                latitude = location.latitude;
                longitude = location.longitude;
                getStops(); 
            });
            

        }

        function getStops(){
            var $query = `http://api.actransit.org/transit/stops/${latitude}/${longitude}/10000/?token=73C0EC914517EE7D0DA47B8BE90D788B`;
        
            $.ajax({
                url : $query,
                method: "GET"
            }).then(function(stops){ 
                console.log(stops)
                for (var stop = 0; stop < Object.keys(stops).length; stop ++){
                    var stopbtn = $('<button>').attr("id", 'stops');
                    stopbtn.attr('stopID', stops[stop].StopId).text(stops[stop].Name);
                    $('#display').append(stopbtn);
                }
            })
            
        }
        getIP();
        function getVehicleOnStop(){
            $.ajax({
                url : `https://api.actransit.org/transit/stops/${stopID}/predictions/?token=73C0EC914517EE7D0DA47B8BE90D788B`,
                method : "GET"
            }).then(function(predictions){
                console.log(predictions);

            })


        }

        $(document).on('click', '#stops', function(){
            stopID = $(this).attr('stopID');
            getVehicleOnStop();

        });

        
        
        
    
    
    
    });

    // need to add in display section, 