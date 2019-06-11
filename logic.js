document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    // var instances = M.Sidenav.init(elems, options);
    var instances = M.Sidenav.init(elems);
  });

  // Or with jQuery

  $(document).ready(function(){
    $('.sidenav').sidenav();
  
    // favorite input & save function
    $(".card-action").on("click", function() {
        // $()append("collection-item avatar")
        // get the user input from form
        const userLocation  = $("#icon_prefix").val().trim();
        const endLocation = $("#icon_telephone").val().trim(); 
        
        // create new item for the unorder list
        const newListItem = $("<li>");
        newListItem.addClass("collection-item avatar");
        const $pTag = $("<p>");
        const $span = $("<span>");
        $span.text("Title")
        // const $img = $("<img>");
        const $ifolder = $("<i>")
        $ifolder.addClass("material-icons circle")
        $ifolder.text("folder")
        // $img.attr("src","")
        const $a = $("<a>"); 
        $a.addClass("secondary-content")
        $a.attr("href", "#")
        const $i = $("<i>")
        $i.addClass("material-icons")
        $i.text("grade")
        $a.append($i); 
        // $img.addClass("circle");
        $span.addClass("title");
        $pTag.html(userLocation + "<br>" + endLocation);
        // append img, span, a tag
        newListItem.append($ifolder, $span, $pTag, $a);

        // append new item to order list
        $(".collection").append(newListItem); 
    })

});

  