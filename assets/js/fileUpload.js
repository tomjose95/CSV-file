$(document).ready(function () {
  //searching
  $("#search").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("tbody tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
  //sorting
  $(".sort").click(function () {
    var column = $(this).attr("id");
    var order = $(this).attr("data-order");

    // change sort order
    if (order === "desc") {
      $(this).attr("data-order", "asc");
    } else {
      $(this).attr("data-order", "desc");
    }

    // sort the table
    sortTable(column, order);
  });

  function sortTable(column, order) {
    var rows = $("tbody tr").get();

    rows.sort(function (a, b) {
      var A = $(a).children("td").eq(column).text().toUpperCase();
      var B = $(b).children("td").eq(column).text().toUpperCase();

      if (A < B) {
        return order === "asc" ? -1 : 1;
      } else if (A > B) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });

    $.each(rows, function (index, row) {
      $("tbody").append(row);
    });
  }
});
