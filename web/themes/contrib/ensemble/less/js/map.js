(function ($) {
  if ($("#map").length) {
    // variables
    var
      lat,
      long,
      adresse,
      title,
      image,
      description,
      event_type,
      event_type_id,
      event_date,
      map_date,
      event_minutes,
      event_short_date,
      marker_class,
      group;
    var legend_tab = [];
    var relative_dates_tab = [];
    var markers_this_week_tab = [];
    var markers_second_week_tab = [];
    var markers_third_week_tab = [];
    var markers_fourth_week_tab = [];
    var markers_fifth_week_tab = [];
    var markers_more_mont_tab = [];
    marker = [];
    var months = [];
    initiateMonth();
    createDivLegendEventTypeInDatesArea();

    // Récupération des dates relatives
    getRelativeDatesTab();

    // Add basemap tiles and attribution.
    var baseLayer = L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
      attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' +
      '<a href="http://cartodb.com/attributions">CartoDB</a>'
    });

    // Create map and set center and zoom.
    var map = L.map('map', {
      scrollWheelZoom: true,
      center: [43.587709, 3.919725],
      zoom: 12
    });

    // Add basemap to map.
    map.addLayer(baseLayer);
    // Path to map icons
    L.Icon.Default.imagePath = '/themes/contrib/ensemble/less/images/leaflet/';
    //var marker = L.marker([43.591735400166904, ]).addTo(map);

    // points from drupal view
    $.getJSON('/events', function (data) {
      addDataToMap(data, map, true);
    });


    // Add Marker and pop up message and manage dates
    function addDataToMap(data, map, first_map) {
      for (var i = 0; i < data.features.length; i++) {

        lat = data.features[i].geometry.coordinates[1];
        long = data.features[i].geometry.coordinates[0];
        adresse = data.features[i].properties.adresse;
        title = data.features[i].properties.name;
        image = data.features[i].properties.image;
        description = data.features[i].properties.description;
        event_type = data.features[i].properties.type;
        event_type_id = data.features[i].properties.type_id;
        event_date = $.trim(data.features[i].properties.date).split(",");
        event_short_date = data.features[i].properties.short_date.split(",");
        map_date = manageMapDate(event_short_date);

        marker_class = "thematique-" + event_type_id;
        console.log("marker_class " + marker_class);
       /* var event_date = new Date(event_date);
        event_minutes = (event_date.getMinutes() > 9) ? event_date.getMinutes() : "0" + event_date.getMinutes();*/

        //console.log(lat + " - " + long+ " - " + title+ " - " + description + " - " + event_type);
        marker[i] = new L.Marker([lat, long], {
          icon: new L.DivIcon({
            className: 'my-div-icon',
            html: '<div class="marker-glyphicon ' + marker_class + '"></div>' +
            '<div class="event-short-date">' + map_date + '</div>'
          })
        }).addTo(map);
        marker[i].bindPopup(
          image +
          "<h3>" + title + "</h3>" +
          map_date + " - " + adresse +
          description
          );
        if (first_map) {
          legend_tab[marker_class] = {
            "event_type_label": event_type,
            "event_type_id": event_type_id
          };
        }

        //resize map to fit all markers
        group = new L.featureGroup(marker);
        map.fitBounds(group.getBounds(), {padding:[100, 100]});

        // on ajoute des marqueurs dans les tableaux en fonction de la date
        for (var j = 0; j < event_date.length; j ++) {

          event_date[j] = new Date($.trim(event_date[j]));
          //console.log("Taille tableau : " + event_date.length + " - date " + j + " : " +event_date[j]);

          if (event_date[j] < relative_dates_tab["next_monday"]) {
            markers_this_week_tab.push(marker[i]);
          }
          else if (event_date[j] >= relative_dates_tab["next_monday"] && event_date[j] < relative_dates_tab["second_monday"]) {
            markers_second_week_tab.push(marker[i]);
          }
          else if (event_date[j] >= relative_dates_tab["second_monday"] && event_date[j] < relative_dates_tab["third_monday"]) {
            markers_third_week_tab.push(marker[i]);
          }
          else if (event_date[j] >= relative_dates_tab["third_monday"] && event_date[j] < relative_dates_tab["fourth_monday"]) {
            markers_fourth_week_tab.push(marker[i]);
          }
          else if (event_date[j] >= relative_dates_tab["fourth_monday"] && event_date [j]< relative_dates_tab["fifth_monday"]) {
            markers_fifth_week_tab.push(marker[i]);
          }
          else if (event_date[j] >= relative_dates_tab["fifth_monday"]) {
            markers_more_mont_tab.push(marker[i]);
          }
        }

      } // Fin de la récupération des données


      if(first_map) {
        console.log(legend_tab);
        addLegend(legend_tab);
      } else {
        $(".date-legend:not(:first)").remove();
      }
      addDateLegend();

    }

    // Gestion des événements
    $("#hide-markers").click(function () {
      for (var i = 0; i < marker.length; i++) {
        map.removeLayer(marker[i]);
      }
    });
    $("#show-markers").click(function () {
      showAllMarkers($(this));
    });

    function addLegend(legend_tab) {
      var cpt = 0;
      for (var key in legend_tab) {
        //console.log("cle : " + key + " - valeur : " + legend_tab[key]);
        if (!cpt) {
          $("<h3></h3>", {
            "class": "label-legend",
            text: "Recherche par thématiques",
          }).appendTo("#map-legend");
          $("<span></span>", {
            "class": "all-legend legend",
            "id": "all-legend",
            text: "toutes thématiques ",
          }).appendTo("#map-legend")
            .click(function(){

              for (var i = 0; i < marker.length; i++) {
                map.removeLayer(marker[i]);
              }
              $.getJSON('/events', function (data) {
                emptyDatesArray();
                addDataToMap(data, map, false);
                showAllMarkers($("#show-markers"));
              });
              $("#label-legend-type-dates")
                .hide()
                .text('Pour toutes les thématiques')
                .slideDown('slow');

              $("#map-legend span.legend").removeClass("selected-type-event").addClass('not-selected-type-event');
              $(this).addClass("selected-type-event").removeClass("not-selected-type-event");
            });
        } else {
          $("<span></span>", {
            "class": "label-separator",
            text: " - ",
          }).appendTo("#map-legend");
        }
        console.log(legend_tab[key]['event_type_id']);
        $("<span></span>", {
          "class": key + " legend",
          "id": legend_tab[key]['event_type_id'],
          "text": legend_tab[key]['event_type_label'],
        }).appendTo("#map-legend")
          .click(function(){
          //console.log($(this).attr("id"));
          for (var i = 0; i < marker.length; i++) {
            map.removeLayer(marker[i]);
          }
          $.getJSON('/events?field_event_type_target_id=' + $(this).attr("id"), function (data) {
            emptyDatesArray();
            addDataToMap(data, map, false);
            showAllMarkers($("#show-markers"));
          });
          $("#label-legend-type-dates")
            .hide()
            .text('Pour la thématique "' + $(this).text() + '"')
            .slideDown('slow');

          $("#map-legend span.legend").removeClass("selected-type-event").addClass('not-selected-type-event');
          $(this).addClass("selected-type-event").removeClass("not-selected-type-event");
        });
        cpt++;
      }
    }

    function addDateLegend() {

      if (markers_this_week_tab.length) {
        $("<span></span>", {
          "class": "date-legend",
          text: "Cette semaine",
        }).appendTo("#date-markers-legend").click(function () {
          for (var i = 0; i < marker.length; i++) {
            map.removeLayer(marker[i]);
          }
          for (var j = 0; j < markers_this_week_tab.length; j++) {
            markers_this_week_tab[j].addTo(map);
          }
          //resize map to fit all markers
          group = new L.featureGroup(markers_this_week_tab);
          map.fitBounds(group.getBounds(), {padding:[100, 100]});

          $(".date-legend").removeClass("selected-period");
          $(this).addClass("selected-period");
        });
      }
      if (markers_second_week_tab.length) {
        $("<span></span>", {
          "class": "date-legend",
          text: relative_dates_tab["next_monday"].getDate() +
          " " + ((relative_dates_tab["next_monday"].getDate() > 24) ? months[relative_dates_tab["next_monday"].getMonth()] : "")  +
          " > " + (relative_dates_tab["second_monday"].getDate() - 1) +
          " " + months[relative_dates_tab["second_monday"].getMonth()],
        }).appendTo("#date-markers-legend").click(function () {
          for (var i = 0; i < marker.length; i++) {
            map.removeLayer(marker[i]);
          }
          for (var j = 0; j < markers_second_week_tab.length; j++) {
            markers_second_week_tab[j].addTo(map);
          }
          //resize map to fit all markers
          group = new L.featureGroup(markers_second_week_tab);
          map.fitBounds(group.getBounds(), {padding:[100, 100]});

          $(".date-legend").removeClass("selected-period");
          $(this).addClass("selected-period");
        });
      }
      if (markers_third_week_tab.length) {
        $("<span></span>", {
          "class": "date-legend",
          text: relative_dates_tab["second_monday"].getDate() +
          " " + ((relative_dates_tab["second_monday"].getDate() > 24) ? months[relative_dates_tab["second_monday"].getMonth()] : "")  +
          " > " + (relative_dates_tab["third_monday"].getDate() - 1) +
          " " + months[relative_dates_tab["third_monday"].getMonth()],
        }).appendTo("#date-markers-legend").click(function () {
          for (var i = 0; i < marker.length; i++) {
            map.removeLayer(marker[i]);
          }
          for (var j = 0; j < markers_third_week_tab.length; j++) {
            markers_third_week_tab[j].addTo(map);
          }
          //resize map to fit all markers
          group = new L.featureGroup(markers_third_week_tab);
          map.fitBounds(group.getBounds(), {padding:[100, 100]});

          $(".date-legend").removeClass("selected-period");
          $(this).addClass("selected-period");
        });
      }
      if (markers_fourth_week_tab.length) {
        $("<span></span>", {
          "class": "date-legend",
          text: relative_dates_tab["third_monday"].getDate() +
          " " + ((relative_dates_tab["third_monday"].getDate() > 24) ? months[relative_dates_tab["third_monday"].getMonth()] : "") +
          " > " + (relative_dates_tab["fourth_monday"].getDate() - 1) +
          " " + months[relative_dates_tab["fourth_monday"].getMonth()],
        }).appendTo("#date-markers-legend").click(function () {
          for (var i = 0; i < marker.length; i++) {
            map.removeLayer(marker[i]);
          }
          for (var j = 0; j < markers_fourth_week_tab.length; j++) {
            markers_fourth_week_tab[j].addTo(map);
          }
          //resize map to fit all markers
          group = new L.featureGroup(markers_fourth_week_tab);
          map.fitBounds(group.getBounds(), {padding:[100, 100]});

          $(".date-legend").removeClass("selected-period");
          $(this).addClass("selected-period");
        });
      }
      if (markers_fifth_week_tab.length) {
        $("<span></span>", {
          "class": "date-legend",
          text: relative_dates_tab["fourth_monday"].getDate() +
          " " + ((relative_dates_tab["fourth_monday"].getDate() > 24) ? months[relative_dates_tab["fourth_monday"].getMonth()] : "") +
          " > " + (relative_dates_tab["fifth_monday"].getDate() - 1) +
          " " + months[relative_dates_tab["fifth_monday"].getMonth()],
        }).appendTo("#date-markers-legend").click(function () {
          for (var i = 0; i < marker.length; i++) {
            map.removeLayer(marker[i]);
          }
          for (var j = 0; j < markers_fifth_week_tab.length; j++) {
            markers_fifth_week_tab[j].addTo(map);
          }
          //resize map to fit all markers
          group = new L.featureGroup(markers_fifth_week_tab);
          map.fitBounds(group.getBounds(), {padding:[100, 100]});

          $(".date-legend").removeClass("selected-period");
          $(this).addClass("selected-period");
        });
      }
      if (markers_more_mont_tab.length) {
        $("<span></span>", {
          "class": "date-legend",
          text: "après le " +
          (relative_dates_tab["fifth_monday"].getDate()) +
          " " + months[relative_dates_tab["fifth_monday"].getMonth()],
        }).appendTo("#date-markers-legend").click(function () {
          for (var i = 0; i < marker.length; i++) {
            map.removeLayer(marker[i]);
          }
          for (var j = 0; j < markers_more_mont_tab.length; j++) {
            markers_more_mont_tab[j].addTo(map);
          }
          //resize map to fit all markers
          group = new L.featureGroup(markers_more_mont_tab);
          map.fitBounds(group.getBounds(), {padding:[100, 100]});

          $(".date-legend").removeClass("selected-period");
          $(this).addClass("selected-period");
        });
      }
    }

    function getRelativeDatesTab() {
      var next_monday = new Date();
      next_monday.setHours(00);
      next_monday.setDate(next_monday.getDate() + ((7 - next_monday.getDay()) % 7 + 1) % 7);
      relative_dates_tab["next_monday"] = next_monday;

      var second_monday = new Date(next_monday);
      second_monday.setHours(00);
      second_monday.setDate(second_monday.getDate() + 7);
      relative_dates_tab["second_monday"] = second_monday;

      var third_monday = new Date(next_monday);
      third_monday.setHours(00);
      third_monday.setDate(third_monday.getDate() + 14);
      relative_dates_tab["third_monday"] = third_monday;

      var fourth_monday = new Date(next_monday);
      fourth_monday.setHours(00);
      fourth_monday.setDate(fourth_monday.getDate() + 21);
      relative_dates_tab["fourth_monday"] = fourth_monday;

      var fifth_monday = new Date(next_monday);
      fifth_monday.setHours(00);
      fifth_monday.setDate(fifth_monday.getDate() + 28);
      relative_dates_tab["fifth_monday"] = fifth_monday;
    }
    function initiateMonth () {
      months[0] = "janv.";
      months[1] = "fev.";
      months[2] = "mars";
      months[3] = "avril";
      months[4] = "mai";
      months[5] = "juin";
      months[6] = "juillet";
      months[7] = "août";
      months[8] = "sep.";
      months[9] = "oct.";
      months[10] = "nov.";
      months[11] = "déc.";
    }
    function emptyDatesArray(){
      markers_this_week_tab = [];
      markers_second_week_tab = [];
      markers_third_week_tab = [];
      markers_fourth_week_tab = [];
      markers_fifth_week_tab = [];
      markers_more_mont_tab = [];
      marker = [];
    }
    function createDivLegendEventTypeInDatesArea() {
      $("#h3-map").after($("<div></div>", {
        "id": "label-legend-type-dates",
        "text": "",
      }));
    }
    function showAllMarkers(marker_element) {
      for (var i = 0; i < marker.length; i++) {
        marker[i].addTo(map);
        $(".date-legend").removeClass("selected-period");
        marker_element.addClass("selected-period");
      }
      //resize map to fit all markers
      group = new L.featureGroup(marker);
      map.fitBounds(group.getBounds(), {padding:[100, 100]});
    }

    function manageMapDate(mapdate) {
      if (mapdate.length > 1) {
        return mapdate[0] + ">" + $.trim(mapdate[(mapdate.length-1)]);
      }
      return mapdate;
    }

  }
})(jQuery);