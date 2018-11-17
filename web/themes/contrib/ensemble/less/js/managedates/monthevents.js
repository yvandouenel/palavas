jQuery(function($) {
  var pageURL,
    current_date,
    current_year,
    current_month,
    next_month,
    previous_month,
    next_year,
    previous_year,
    next_date,
    previous_date;

  manageViewedMonth();
  managePrevNextYearMonth();

  current_date = new Date(current_year, (current_month -1), 1);

  options = { year: 'numeric', month: 'long'};
  var readable_date = current_date.toLocaleDateString('fr-FR', options);

  $("#current-month").html('<h3 id="viewed-month">' + readable_date + '</h3>');
  $("#previous-month > a").attr("href","/agenda/" + previous_date);
  $("#next-month > a").attr("href","/agenda/" + next_date);

  function managePrevNextYearMonth() {
    next_year = parseInt(current_year) + 1;
    previous_year = parseInt(current_year) - 1;
    next_month = (current_month % 12) ? parseInt(current_month) + 1 : 1;
    previous_month = (current_month != "01") ? parseInt(current_month) - 1 : 12;
    next_date = (current_month % 12) ? current_year + addZero(next_month) : next_year + addZero(next_month);
    previous_date = (current_month != "01") ? current_year + addZero(previous_month) : previous_year + addZero(previous_month);
  }

  function manageViewedMonth() {
    pageURL = $(location). attr("href");
    current_year = pageURL.slice(-6,-2);
    current_month = pageURL.slice(-2);
  }

  function addZero(n){
    return n<10? '0'+n:''+n;
  }
  /*
   var current_date = new Date();
   var current_year = current_date.getFullYear();
   var current_month = addZero((current_date.getMonth() + 1 ));
   */
});