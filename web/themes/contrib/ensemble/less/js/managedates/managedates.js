jQuery(function($) {

  var
    from_date,
    to_date,
    from_year_date,
    to_year_date,
    msg_date,
    url_data,
    options;

  $("#views-bootstrap-frontpage-page-1 > .row > .col").each(function(){
    url_data = $(".field--name-node-link a", $(this)).attr("href");

    if($(".field--name-field-date > .field--item",$(this)).length > 1) {
      from_date = $(".field--name-field-date > .field--item:first",$(this)).text();
      to_date = $(".field--name-field-date > .field--item:last",$(this)).text();

      from_date = new Date(from_date);
      from_date.setMonth(from_date.getMonth() + 1);
      to_date = new Date(to_date);
      to_date.setMonth(to_date.getMonth() + 1);

      options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

      msg_date =
        from_date.getDate() + "/" + parseInt(from_date.getMonth()) + "/" + from_date.getFullYear() +
        " > " + to_date.getDate() + "/" + to_date.getMonth() + "/" + to_date.getFullYear() ;

      $(".field--name-field-date", $(this)).html("")
      $(".field--name-field-date", $(this)).text(msg_date)

      /*$("<div></div>",
        {
          "class": "field-name-field-show-dates",
          "html": '<div class="js-div-date"><span class="date-display-single">' + msg_date + '</span></div>',
        }).prependTo($(this));*/
    }
    else if ($(".field--name-field-date > .field--item",$(this)).length == 1) {
      from_date = $(".field--name-field-date > .field--item:first",$(this)).text();
      from_date = new Date(from_date);
      from_date.setMonth(from_date.getMonth() + 1);
      options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      from_date = from_date.toLocaleDateString('fr-FR', options);
      $(".field--name-field-date", $(this)).html("")
      $(".field--name-field-date", $(this)).text(from_date);
    }
    // wrap date in a link
    $(".date-display-single",$(this)).wrap( '<a href="' + url_data + '"></a>' );

  });

  function customGetMonth(d) {
    if(d.getMonth() < 10) {
      return "0" + d.getMonth();
    } else return d.getMonth();
  }
  function customGetDate(d) {
    if(d.getDate() < 10) {
      return "0" + d.getDate();
    } else return d.getDate();
  }

});