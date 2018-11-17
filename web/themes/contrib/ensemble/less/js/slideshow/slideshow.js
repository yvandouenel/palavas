/**
 * Created by yvan on 27/11/15.
 */

jQuery(function($) {
  //paramètres de base
  var slide_show_height,
    slide_show_central_zone,
    window_width,
    wrapper_slide_show_width,
    nb_slide,
    nb_mvt,
    timer,
    slide_width,
    frame_width, // Taille de l'élément dans lequel les slides défilent
    margin_left_controlers,
    margin_left_next,
    margin_left_previous,
    control_zone_width,
    first_mvt_width,
    mvt_width,
    selected_slide,
    first_slide,
    last_slide,
    block_id,
    animate;

  window_width = $( window ).width();
  animate = (window_width >= 992);

  $( window ).resize(function() {
    initiate_slide_show();
  });

  /* Opérations nécessaires uniquement au premier chargement **********************************************************/
  if (animate) {
    // Eléments à modifier pour chaque slide show **********************************/
    block_id = "block-views-block-frontpage-block-slideshow";
    slide_show_height = 360; // pour l'instant, le diapo ne s'adapte pas en hauteur
    slide_width = 640; // pour l'instant, le diapo ne s'adapte pas en largeur
    /********************************************************************************/

    frame_width = $("#" + block_id ).width(); // Taille de l'élément dans lequel les slides défilent
    selected_slide = 0;

    // Création des controleurs
    createControleurs();

    // Création des boutons previous et next
    createPreviousNext();

    // Mise en place de la class controler-selected sur le premier controler
    $(".controler:first").addClass("controler-selected");

    // Ajout de la derniere diapo au début
    first_slide = $(".row-diapo:first");
    last_slide  = $(".row-diapo:last");

    $(".wrapper-diapo").prepend(last_slide);

    initiate_slide_show();

    // positionnement initial du slideshow
    $(".wrapper-diapo").animate({marginLeft:first_mvt_width},0);

    // Gestion des textes
    $(".diapo-h3-txt").hide();
    $(".diapo-h3-txt:eq(1)").show();

    // Gestion des click sur les contrôleurs
    $('.controler').each(function(index){
      $(this).click(function(event){
        if(animate){
          moove(index);
          return false;
        }
      });
    });
    // Gestion des click sur le bouton next
    $('#next-ss').click(function(event){
      if(animate){
        moove(selected_slide + 1);
        return false;
      }
    });

    // Gestion des click sur le bouton previous
    $('#previous-ss').click(function(event){
      if(animate){
        moove(selected_slide - 1);
        return false;
      }
    });

  }

  // lancement automatique du slideshow
  /*$(function () {
    var num = 0;
    var interval = setInterval(function () {
      num = num % nb_slide;
      if (num < nb_slide) {
        moove(num, true);
      } else clearInterval(interval);
      num++;
    }, 5000);
    $('.wrapper-diapo').hover(function () {
      clearInterval(interval);
    });
  });*/


  /**
   * Fonction d'animation
   * @ num_controler : the controler number (click or automatic)
   * @ infinite_right : boolean - if true, the slideshow continue to slide on the right
   * *****************************************************/
  function moove(num_controler, infinite_right){
    // dans le cas d'un mvt automatique et infini vers la droite, le slide selectionné
    // devient (-1) quand on arrive à la dernière diapo
    if(infinite_right){
      selected_slide = (selected_slide == (nb_slide-1)) ? (-1) : selected_slide;
    }

    num_controler = num_controler % (nb_slide);
    mvt_width = slide_width * (num_controler - selected_slide);
    nb_mvt = (num_controler - selected_slide);
    timer = 800 / nb_mvt;

    // on avance *************************************************/
    if ((num_controler - selected_slide) > 0) {

      $(".wrapper-diapo").animate({marginLeft:"-=" + mvt_width},timer,function() {
        for(var i = 0;i< Math.abs(nb_mvt);i++){
          $(this).css({marginLeft:first_mvt_width}).find(".row-diapo:last").after($(this).find(".row-diapo:first"));
        }
        // Gestion des textes
        $(".diapo-h3-txt").hide();
        $(".diapo-h3-txt:eq(1)").show();
      });
      // on recule ************************************************/
    }else if((num_controler - selected_slide) < 0) {
      for (var i = 0; i < Math.abs(nb_mvt); i++) {
        // L'astuce est de bien mettre la bonne marge avant que l'animation ne commence
        $(".wrapper-diapo").animate({marginLeft: (first_mvt_width + mvt_width)},0,function() {
          $(this).find(".row-diapo:first").before($(this).find(".row-diapo:last"));
        });
      }
      $(".wrapper-diapo").animate({marginLeft: "-=" + mvt_width}, 1000, function () {
        // Gestion des textes
        $(".diapo-h3-txt").hide();
        $(".diapo-h3-txt:eq( 1 )").show();
      })
    }
    selected_slide = num_controler;

    // Gestion du controleur sélectionné
    $(".controler").removeClass("controler-selected");
    $(".controler:eq( "+ num_controler + " )").addClass("controler-selected");
  }

  /* Fonction d'initialisation du slideshow ***********************************/
  function initiate_slide_show(){
    animate = (window_width >= 992);
    if(animate && $('.row-diapo').length ){


      nb_slide = $('.row-diapo').length;
      wrapper_slide_show_width = nb_slide * slide_width;
      $('.wrapper-diapo').width(wrapper_slide_show_width);

      slide_show_central_zone = (window_width > 1230) ? 1100 : 992;
      margin_left_controlers = (frame_width / 2) - (control_zone_width / 2);


      margin_left_previous = (frame_width - slide_width) - ((frame_width - slide_width) / 2) - 20;
      margin_left_next = margin_left_previous + slide_width - 10;
       /*margin_left_controlers_2 = margin_left_controlers_1 + slide_show_central_zone - control_zone_width;*/

      first_mvt_width = - slide_width + (frame_width -slide_width) / 2 ;

      // Placement des controleurs
      $('#controlers-ss').css('left', margin_left_controlers + 'px');
      $('#controlers-ss').css('top', (slide_show_height - 28) + 'px');

      // Placement de previous
      $('#previous-ss').css('left', margin_left_previous + 'px');
      $('#previous-ss').css('top', (slide_show_height / 2 - 20) + 'px');


      // Placement de next
      $('#next-ss').css('left', margin_left_next + 'px');
      $('#next-ss').css('top', (slide_show_height / 2 - 20) + 'px');

      //placement du texte
      $(".h3-ss-home").css('left', (slide_width / 10)  + 'px');
      $(".txt-diapo").css('left', (slide_width / 10)  + 'px');
      $(".txt-diapo").css('top', (slide_show_height / 3 * 2) + 'px');


      // Re-positionnement du slideshow
      $(".wrapper-diapo").animate({marginLeft:first_mvt_width},0);
    }else{
      $(".wrapper-diapo").animate({marginLeft:30},0);
    }
  }

  function createControleurs() {
    $("<div></div>", {
      "class": "controlers",
      "id": "controlers-ss",
    }).appendTo(".wrapper-diapo");

    $(".row-diapo").each(function(i){
      $("<span></span>", {
        "class": "controler",
        "id": "controler-" + i,
      }).appendTo("#controlers-ss");
    });
    control_zone_width = $("#controlers-ss").width();
  }

  function createPreviousNext() {
    $("<div></div>", {
      "class": "previous-next-ss",
      "id": "previous-ss",
    }).appendTo(".wrapper-diapo");

    $("<div></div>", {
      "class": "previous-next-ss",
      "id": "next-ss",
    }).appendTo(".wrapper-diapo");
  }

});
