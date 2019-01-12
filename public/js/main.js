// Scrape article button function
$(document).on("click", "#scraper", function(event){
  console.log("scrape click test 1");

  $.ajax({
    url: "/scrape",
    type: "GET",
    data: event
  }).then(
    function(response){
      console.log(data);
      console.log(response);
      // $("#art-info").append(data);
      location.reload();
    }
  );
});

$(document).ready(function(){
  // make models active
  $("#saveArtModel").modal();
  $("#noteModel").modal();
  $("#articlePoolModel").modal();
});

$(document).on("click", ".addArticle", function(element){

  var Title = $(this).attr("data-title");
  var Summary = $(this).attr("data-summary");
  var Link = $(this).attr("data-link");
  var Image = $(this).attr("data-image");
    
  var savedArticle = {
    title: Title,
    summary: Summary,
    link: Link,
    image: Image,
    notes: []
    };

  $.ajax({
    url: "/article/add",
    headers: {
      "Content-Type": "application/json"
      },
    body: JSON.stringify(savedArticle)
      }).then(function(response){
        console.log(response);
        $("#noteModel").modal("open");
        $("#noteModel .model-content").html("<h4> Added Article </h4>");
        setTimeout(function(){
          $("#noteModel").modal(("close"), 1500);
        });

      });
});

$(document).on("click", ".savedArticle", function(){
  $(".collection").html("");
  $("#textarea1").val("");

  $.ajax({
    url: "/articles/saved",
    type: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(function(response){
    console.log(response);
  });
});
  
  // Delete note function
$(".deleteNote").on("click", function(event) {

  console.log("click test 1");

  var id = $(this).data("id");
  // Delete a note
  $.ajax({
    url: `/notes/delete/` + id,
    type: "DELETE"
  }).then(
    function() {
      console.log("note deleted at ", id);
      // Reload the page to get the updated list
      location.reload();
    }
  );
});
