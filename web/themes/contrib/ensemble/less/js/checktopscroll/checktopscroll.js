(function ($) {
  var scrolled = false;
  if($(window).width() > 768) {
    $(window).scroll(function() {
      clearTimeout($.data(this, 'scrollTimer'));
      $.data(this, 'scrollTimer', setTimeout(function() {
        //console.log("Haven't scrolled in 250ms!");
        if($(window).scrollTop() && !scrolled) {
          $(".logo img").animate({
            height: "60px"
          }, 500, function() {
            // Animation complete.
          });
          scrolled = true;

        } else if (scrolled && $(window).scrollTop() == 0) {
          $("#full-content-header").css("margin-top","160px");
          $(".logo img").animate({
            height: "90px"
          }, 500, function() {
            // Animation complete.
          });

          scrolled = false;
        }

      }, 250));
    });
  } else {
    $(".logo img").css({
      height: "60px"
    });
  }
})(jQuery);
