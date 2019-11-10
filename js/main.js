$("document").ready(function() {

  // ----------------Markers ---------------------
    //Separate the markers into red/blue/other
  var allMarkers = [];
  var locations = [];
  var markers = {};
  var baseMaps;
  var LineLayerGroup;
  var index = -1;
  // all the markers
  var baseMaps;
  var LineLayerGroup;

  // map context
  var mymap;
  const HURLBURT = [30.455, -086.70];
  var Streetmap, Stamen_Terrain, Esri_WorldImagery, Roads;
  // infoTemplate is a string template for use with L.Util.template()
  var infoTemplate = '<h3>Unique ID: {id}</h3>\
                      <p>Info: {freq}</p>\
                      <p>Team: {team}</p>' ;

  function drawmarkers(infoTemplate, locations){
      var len      = locations.length;
      allMarkers = [];
      var location;//NOTE location not locations
      for (i = 0; i < len; i++) {
          location  = locations[i];
          // Here we're defining a new icon to use on our map.
          var icondir     = 'icons/';
          var iconpre     = '.png';
          var iconname    = icondir.concat(location.icon,iconpre);
          var customIcon  = L.icon({
                     iconUrl: iconname,
                     iconSize: [65,65]
                 });
          let marker = new L.marker([location.latitude, location.longitude], {
                  icon: customIcon, draggable:'true'});
          marker.bindPopup(L.Util.template(infoTemplate,location));
          marker.on('click', function(e){
              marker = this;
              index = allMarkers.indexOf(marker);
              updateMarkerInfo(index,locations);
          });

          marker.on('dragend', function(e) {
          //$('#selectedAddress').text("Map markers: "+this.getLatLng().lat);
              marker = this;
              index = Number(allMarkers.indexOf(marker));
              location = locations[index];
              location.latitude  = Number(marker.getLatLng().lat).toFixed(4);
              location.longitude = Number(marker.getLatLng().lng).toFixed(4);
              locations[index] = location;
              updateMarkerInfo(index,locations);
              //mymap.removeLayer(LineLayerGroup);
            //  LineLayerGroup = drawLine(bluemarker,distances, mymap);
          });
          //$('#selectedAddress').text("Got Markers: "+ location.team);
          allMarkers.push(marker);

      }
      const temp = L.markerClusterGroup();
      temp.addLayers(allMarkers);
      return temp
    }

   function updateMarkerInfo(index,locations){
     var location = locations[Number(index)];
     document.getElementById('Input_lat').value  = location.latitude;
     document.getElementById('Input_long').value = location.longitude;
     document.getElementById('Input_00').value   = location.freq;
     document.getElementById('Icon_00').value    = location.icon;
     document.getElementById('Active_00').value  = location.active.toUpperCase();
     document.getElementById('Team_00').value   = location.team;
     document.getElementById('Id_00').value   =  location.id;
   }


    function get_userMarkerInfo(){
        if (index <0){
           index = 1;
         }
        var location = locations[index];
        var temp_location={
          latitude: document.getElementById('Input_lat').value ,
          longitude: document.getElementById('Input_long').value ,
          freq: document.getElementById('Input_00').value  ,
          icon: document.getElementById('Icon_00').value ,
          active: document.getElementById('Active_00').value,
          description: "User Added",
          team: document.getElementById('Team_00').value,
          id: document.getElementById('Id_00').value
        };
        return temp_location
      }

    function updateLatLng(lat,lng,reverse) {
        if(reverse) {
          marker.setLatLng([lat,lng]);
          mymap.panTo([lat,lng]);
        } else {
          mymap.panTo([lat,lng]);
        }
    }


    function read_in_markers(data){
      //Read in data and return markers
      // jQuery gives us back the data as a big string, so the first step
      // is to split on the newlines
      var lines     = data.split('\n');
      var i, values;
      var len       = lines.length;
      locations = [];
      for (i = 0; i < len; i++) {
          // for each line, split on the tab character. The lat and long
          // values are in the first and second positions respectively.
          values    = lines[i].split(',');
          // ignore header line of the csv as well as the ending newline
          // keep lines that have a numeric value in the first, second slot
          if (!isNaN(values[0]) && !isNaN(values[1])) {
                locations.push({
                    latitude:   Number(values[0]).toFixed(4),
                    longitude:  Number(values[1]).toFixed(4),
                    freq:         values[5],
                    description:  values[3],
                    team:         values[4],
                    id:           values[2],
                    icon:         values[6],
                    active:       values[7]

                });
          }
      }
      return locations;
    }

  function createMap(){
    //-------------Different Types of Maps---------
    Streetmap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });//.addTo(mymap);
    Stamen_Terrain = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
  	  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  	  subdomains: 'abcd',
  	  ext: 'png'
    });
    // https: also supported.
    Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	   attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    });
    //---------------------------------------
    // Map choices.----------
    baseMaps = {
     "Street":Streetmap,
     "TopoMap":Stamen_Terrain,
     "WorldImagery":Esri_WorldImagery
    };
    // Set the Map ------------------------
    mymap = L.map('map',{
          layers:[Streetmap]
        }).setView(HURLBURT, 15);
    L.control.layers(baseMaps).addTo(mymap);

    mymap.on('click', function(e) {
        var popLocation= e.latlng;
        var popup = L.popup()
        .setLatLng(popLocation)
        .setContent('<h2>Clicked Location</h2><p>Lat: ' + e.latlng.lat.toFixed(3) +
               "<br />Long: " + e.latlng.lng.toFixed(3) +'</p>')
        .openOn(mymap);
    });
   }



  function getmarkers(){
    var file = './data/toughdata.csv';
   $.get(file, function(data) {
            locations = read_in_markers(data);
          allmarker = drawmarkers(infoTemplate, locations);
          allm  =  L.markerClusterGroup().addLayers(allmarker);
          allm.addTo(mymap);
          // Now we can zoom the map to the extent of the markers
          mymap.fitBounds(allm.getBounds());
          });//$.get()
   }


   function initSite() {
     createMap();
     getmarkers();
   };


   $('#add_marker-button').on('click',function(e){
      //location = locations[index];
      var ll = get_userMarkerInfo();
      locations.push(ll);
      refresh();
   });

   $('#Team_00').on('change',function(e){
        var textd =  this.options[this.selectedIndex].value;
        if (0<locations.length){
          $('#selectedAddress').text(textd);
          var location = locations[index];
          location.team = textd;
          refresh();
      } else {
        $('#selectedAddress').text("NO Marker");
      }
    });
    $('#Input_00').on('change',function(e){
         var textd =  this.value;
         if (0<locations.length){
           $('#selectedAddress').text(textd);
           var location = locations[index];
           location.freq = textd;
            $('#selectedAddress').text(textd);
       } else {
         $('#selectedAddress').text("NO Marker");
       }
     });
     $('#Id_00').on('change',function(e){
          var textd =  this.value;
          if (0<locations.length){
            $('#selectedAddress').text(textd);
            var location = locations[index];
            location.id = textd;
             $('#selectedAddress').text(textd);
        } else {
          $('#selectedAddress').text("NO Marker");
        }
      });
   $('#Active_00').on('change',function(e){
        var textd =  this.options[this.selectedIndex].value;
        if (0<locations.length){
          $('#selectedAddress').text(textd);
          var location = locations[index];
          location.active = textd;
          refresh();
      } else {
        $('#selectedAddress').text("NO Marker");
      }
    });

   $('#Icon_00').on('change',function(e){
        var textd =  this.options[this.selectedIndex].value;
        if (0<locations.length){
          $('#selectedAddress').text(textd);
          changeIcon(index,textd);
      } else {
        $('#selectedAddress').text("NO Marker");
      }
      });

   function changeIcon(i, text){
        if (i<locations.length){
          var location  = locations[i];
          location.icon = text;
          locations[i] = location;
          refresh();
           // Now we can zoom the map to the extent of the markers
          mymap.fitBounds(allm.getBounds());
    }
   }


   function refresh(){
     //Refesh Locations
     //Currently it refreshes everything in Location!
      mymap.removeLayer(allm);
      allm.clearLayers();
      var newIconsLayer=[];
      newIconsLayer =  drawmarkers(infoTemplate, locations);
      //allmarker = newIconsLayer;
      allm  = new L.markerClusterGroup();
      allm.addLayers(newIconsLayer);
      allm.addTo(mymap);
   }

 initSite();
 //HTML5 input placeholder fix for < ie10
 $('input, textarea').placeholder();


 function uiFixes() {
    //JS to fix the Twitter Typeahead styling, as it is unmodifiable in the bower folder
   $('.twitter-typeahead').css('display', '');
   //Fix for the Twitter Typeahead styling of the pre tag causing issues with horizontal scrolling in conentpanel
   $('pre').css("margin-left", "-50%");
 }


 uiFixes();

 //JS FAQ triggers



 function clickedFAQ(element) {
   var clickedFAQ = element.id;
   var expandFAQ = clickedFAQ + "-expand";
   var isExpandedFAQ = $("#"+expandFAQ).css("display");

   if (isExpandedFAQ === "block"){
     $("#"+expandFAQ).hide("slow");
     $("#"+expandFAQ+" *").hide("slow");
     $("#"+clickedFAQ+" h4 span.expanded-icon").replaceWith("<span class='expand-icon'>+</span>");
     console.log(clickedFAQ+" h4 span.expand-icon");
   }else{
     $("#"+expandFAQ).show();
     $("#"+expandFAQ+" *").show("fast");
     $("#"+clickedFAQ+" h4 span.expand-icon").replaceWith("<span class='expanded-icon'>&#8210;</span>");
   }
 }

 $("[id^=FAQ-]").click( function() {
   clickedFAQ(this);
 });
});
