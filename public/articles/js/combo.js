//////////////////////////////// * Initialize Modals * \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
$(document).ready(function() {
    $('#saveModal').modal(); // Articles Saved Modal
    $('#modalMessage').modal(); // Message Modal
    $('#articleModal').modal(); // Notes Modal
});

/////////////////////////////////////////////// /* Event Listeners */ ////////////////////////////////////////////////////////
$(".searchArticle").on("click", function() { // Scrap Articles Request
     $.getJSON("/articles", function(data) {
        // $("#articles").append(
        // "<li id=" + article._id + "data-url=" + 
        //       data.link + "data-category=" + 
        //       data.category + "class=collection-item avatar hover modal-trigger href=#articleModal><img src=" + 
        //       data.image + "class=circle><span class=title>" + 
        //       data.title + "</span><p>" + 
        //       data.summary + "</p><a class=secondary-content deleteArticle><i class=material-icons hoverRed>delete_forever</i></a></li>"
        //     );
        }).then(function(){ 
            // res.render("index", hbsObj);
            window.location.replace("/articles");
            });
      }); // End searchArticle btn Click