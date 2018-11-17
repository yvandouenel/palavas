(function ($) {

  if($(".field--name-field-argumentaires .field--item").length) {
    moveLinkArgument();
  }
  else {
    $("#pause-cafe").hide(0);
  }
  if($(".webform-submission-form").length
  && (!($(".webform-submission-form .alert-dismissible").length &&
    !($("body.user-logged-in").length)))) {
    moveWebform();
  } else {
    $("#custom-form-this-event").hide();
    $("button.incitation").hide();

  }

  function moveLinkArgument() {
    if($(".field--name-field-argumentaires .field--item a").length) {
      $(".field--name-field-argumentaires .field--item a").appendTo("#pause-cafe").addClass("link-to-arg");
    }

  }

  function moveWebform() {
    $(".webform-submission-form").appendTo("#custom-form-this-event").hide();
    $("#custom-link-this-event").click(function(e) {
      e.preventDefault();
      $(".webform-submission-form").slideToggle();
    });
  }

})(jQuery);