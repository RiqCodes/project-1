$(document).ready(function(){
    
    
    var distance= 500;
    var routeName = '51b';
   

    $.ajax({
        url : 'https://api.ipify.org?format=jsonp&callback=?',
        dataType : "json"
    }).then(function(data){
        var IP = data.ip
        var query = {
            url : `http://api.ipstack.com/${IP}?access_key=711ae091724cdd59c84aed29e5d6d3d0`,
            method: "GET"
        }
        console.log(data)
        
        
        
        
        $.ajax(query).then(function(location){
            
            console.log(location);
            var latitude = location.latitude;
            var longitude = location.longitude; 
            var $query = `http://api.actransit.org/transit/stops/${latitude}/${longitude}/1000/?token=73C0EC914517EE7D0DA47B8BE90D788B`;
            console.log(latitude)
            $.ajax({
                url : $query,
                method: "GET"
            }).then(function(bus){
                console.log(bus);
            })
        })
    });  

});