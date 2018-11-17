(function ($) {
  $("#search-block-form--2").hide();

  $("#icon-search-sm").click(function() {
    $("#search-block-form--2").slideToggle();
    $("#icon-search-sm").toggleClass("search-open");
    $("html, body").animate({ scrollTop: 0 }, "slow");
  });

})(jQuery);