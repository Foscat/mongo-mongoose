// Scrape article button function
$("#scraper").on("click", function(event){
  console.log("scrape click test 1");

  $.ajax({
    url: "/scrape",
    type: "GET",
    data: {
      title: title,
      link: link
    }
  }).then(
    function(){
      console.log(data);
      $("#art-info").append(data);
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