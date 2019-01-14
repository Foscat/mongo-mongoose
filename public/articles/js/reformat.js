$(document).ready(function() {
    /////////////////////////////////////////////// /* Initialize Modals */ ////////////////////////////////////////////////////////
    $('#saveModal').modal(); // Articles Saved Modal
    $('#modalMessage').modal(); // Message Modal
    $('#articleModal').modal(); // Notes Modal
  
    /////////////////////////////////////////////// /* Event Listeners */ ////////////////////////////////////////////////////////
    $('.searchArticle').on("click", function() { // Scrap Articles Request
      $.getJSON("/articles", function(data) {
        $("#articles").append(
          "<li id=" + article._id + "data-url=" + 
            data.link + "data-category=" + 
            data.category + "class=collection-item avatar hover modal-trigger href=#articleModal><img src=" + 
            data.image + "class=circle><span class=title>" + 
            data.title + "</span><p>" + 
            data.summary + "</p><a class=secondary-content deleteArticle><i class=material-icons hoverRed>delete_forever</i></a></li>"
          );
      }).then(function(){ 
          // res.render("index", hbsObj);
          window.location.replace("/articles");
          });
    }); // End searchArticle btn Click

    // //// console.log("searchArticle Button clicked");
    // $.ajax({
    //   url: "/articles/scrape", 
    //   type: "GET"
    // })
    // .then(function(){ 
    //   // res.render("index", hbsObj);
    //   location.replace("/articles/scrape");
    //   });

  
    $('.addArticle').on("click", function(element) { // Save an Article Request
  
      // console.log("Add Button clicked");
  
      var title = $(this).attr("data-title");
      var summary = $(this).attr("data-summary");
      var link = $(this).attr("data-link");
      var image = $(this).attr("data-image");
      var modalID = $(this).attr("data-url") + "modal";
  
      // Create JSON to be Sent to Backend
      var savedArticle = {
        title: title,
        summary: summary,
        link: link,
        image: image,
        notes: []
      };
  
      $.ajax({ // Send savedArticle to the Server
        url: "/article/add", 
        type: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(savedArticle)
      }).then(function(response){
        console.log(response)
        $("#modalMessage").modal('open');
        $("#modalMessage .modal-content ").html("<h4> Sucessfully Added Article </h4>");
        setTimeout(function(){
            $("#modalMessage").modal('close'), 1500
        });
        $(document.getElementById(link)).css('display', 'none');
      });
  
    }); // End addArticle Btn click
  
    $('.savedArticles').on("click", function() { // Query for Saved Articles
      console.log("Saved Button clicked");
      $(".collection").html("");
      $("#textarea1").val("");
  
      $.ajax({
        url: "/article/add",
        type: "GET"
      }).then(function(response) {
        response.json();
      }).then(function(response) {
  
        response.map(function(article) {

          var articleDiv = "<li id='" + article._id + "' data-url='" + 
            article.link + "' data-category='" + 
            article.category + " class=collection-item avatar hover modal-trigger href=#articleModal><img src=" + 
            article.image + "'class=circle><span class=title>" + 
            article.title + "</span><p>" + 
            article.summary + "</P><a class=secondary-content deleteArticle><i class=material-icons hoverRed>delete_forever</i></a></li>";

            $(".collection").prepend(articleDiv);
  
          sessionStorage.setItem(article._id, JSON.stringify(article)); // Store Article Data in sessionStorage
  
          // Event Listeners For Each Saved Article Button
          $(document.getElementById(article._id)).on("click", function(event) { // Event Listenr For Saved Article
  
            var modalID = $(this).attr("id");
  
            var sessionArticle = JSON.parse(sessionStorage.getItem(modalID));
            $('#articleModal').modal("open");
            var title = $(this).children(".title").text();
            $('#articleID').text(title);
  
  
            $(".addComment").on("click", function() { // Event Listener for Adding Comments
  
              var note = $('#textarea1').val();
  
              var noteObject = {
                body: {
                  body: note
                },
                articleID: {
                  articleID: modalID
                }
              };
  
              $.ajax({ // Send savedArticle to the Server
                url: "/notes/write",
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(noteObject)
              }).then(function(response) {
                location.reload();
              });
            });
  
  
            $.ajax({ // Send savedArticle to the Server
              url: "/notes/article",
              type: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({articleID: modalID})
            }).then(function(response) {
              response.json();
              }).then(function(data) {
              console.log("Getting data");
              console.log("data is " + JSON.stringify(data));

              $(".boxComments").html("");
              if (data.length >= 1) {
                data.map(function(note) {
  
                  if (note === null) {

                    var notesDiv = "<div class=col s12 m7>" + 
                    "<div class=card horizontal>" +
                    "<div class=card-image>" + 
                    "<img src=images/conspiracykids_header.jpg>" + "</div>" +
                    "<div class=card-stacked center>" + "<div class=card-content valign-wrapper>" + 
                    "<p>No Notes.</p>" + "</div></div></div></div>";

                    // Attach div to webpage
                    $(".boxComments").prepend(notesDiv);
                  } else {
                    var notesDiv2 = "<div class=col s12 m7 id=" + note._id + ">" + 
                    "<div class=card horizontal>" + "<div class=card-image>" + 
                    "<img src=images/conspiracykids_header.jpg>" + "</div>" + 
                    "<div class=card-stacked center>" + "<div class=card-content valign-wrapper>" + 
                    "<p>" + note.body + "</p>" + "</div>" + 
                    "<div class=card-action deleteComment data-id=" + note._id + ">" + 
                    "<a href=#>Delete</a></div></div></div></div>";

                    // Attach div to webpage
                    $(".boxComments").prepend(notesDiv2);
                  }
  
                  $(".deleteComment").on("click", function() { // Event Listener for Each Delete Note Button
  
                    var  noteID = $(this).attr("data-id");
  
                    console.log("Note Id is" + noteID);
  
                    $.ajax({ // Send savedArticle to the Server
                      url: "/notes/delete",
                      type: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({"_id": commentID})
                    }).then(function(response) {
                      $(document.getElementById(note._id)).css('display', 'none');
                    });
  
                  });
  
                });
              } else {
                var notesDiv = "<div class=col s12 m7>" + 
                "<div class=card horizontal>" + 

                  "<div class=card-image>" + 
                    "<img src=images/conspiracykids_header.jpg>" + 
                  "</div>" + //End of class=card-image

                  "<div class=card-stacked center>" + 

                    "<div class=card-content valign-wrapper>" + 
                      "<p>No Notes.</p>" + 
                    "</div>" + //End of class=card-content

                  "</div>" + //End of class=card-stacked
                "</div>" + //End of class=card horozontal
                "</div>"; //End of notesDiv

                // Attach div to notes section
                $(".boxComments").prepend(notesDiv);
              }
            }); // End of note articles function
            event.stopPropagation();
          });
  
          $(".deleteArticle").on("click", function(event) { // Event Listenr For Saved Article Delete Button
            var modalID = $(this).parent().attr("id");
            var sessionArticle = JSON.parse(sessionStorage.getItem(modalID));
  
            $.ajax({ // Send savedArticle to the Server
              url: "/article/delete",
              type: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(sessionArticle)
            }).then(function(response) {
              console.log(response);
              $("#modalMessage").modal('open');
              $("#modalMessage .modal-content ").html('<h4> Sucessfully Deleted:' + sessionArticle._id + "</h4>");
                setTimeout(function(){ 
                  $("#modalMessage").modal('close'), 2000
                });
              $(document.getElementById(sessionArticle._id)).css('display', 'none');
            });
  
            event.stopPropagation();
          }); // End delete article function
  
        }); // End map function
      }); // End second .then() function
    }); // End savedArticles btn Click
  }); // End of document.ready
  