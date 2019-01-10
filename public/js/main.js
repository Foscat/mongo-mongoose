// Scrape article button function
$("#scraper").on("click", function(event){
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

// Delete note function
$(".delete-note").on("click", function(event) {

  console.log("click test 1");

  var id = $(this).data("id");

  console.log(this);
  // Send the DELETE request.
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