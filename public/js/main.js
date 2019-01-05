
// When the #make-new button is clicked
$(document).on("click", "#create-note-button", function() {

  var noteTitleInput = $("#note-title-input").val().trim();
  var noteBodyInput = $("#note-body-input").val().trim();
  // AJAX POST call to the submit route on the server
  // This will take the data from the form and send it to the server
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/notes/create",
    data: {
      title: noteTitleInput,
      note: noteBodyInput,
      created: Date.now()
    }
  })
  // If that API call succeeds, add the title and a delete button for the note to the page
    .then(function(data) {
    // Add the title and delete button to the #results section
      $("#results").prepend(
        "<p class='data-entry' data-id=" + data._id + ">" +
        "<span class='dataTitle' data-id=" +  data._id + ">" + data.title + "</span>" + 
        "<span class='dataNote' data-id=" +  data._id + ">" + data.note + "</span>" + 
        "<span class=delete>X</span>" + 
        "</p>");
      // Clear the note and title inputs on the page
      // $("#note").val("");
      // $("#title").val("");
    });
});