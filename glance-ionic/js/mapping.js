var map, mapCenter,
    currentPositionMarker,
    homeControlUI,
    menuControlUI,
    statusControlUI,
    shareControlNewUI,
    layerControlUI,
    dummyControlUI,
    shareMyLoc = false;

var trafficLayer, showingTraffic = false;

function initializeMap() {
    
    
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: mapCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false
    });

    trafficLayer = new google.maps.TrafficLayer();

    var controlDiv = document.createElement('div');
    controlDiv.className = "dropSheet";

    var topRightControlDiv = document.createElement('div');
    topRightControlDiv.className = "dropSheetN";

    var HomeControl = function (topRightControlDiv, map) {
        homeControlUI = document.createElement('div');
        homeControlUI.id = "homebutton";
        homeControlUI.className = "button button-icon icon ion-pinpoint h-bar-control-div";
        homeControlUI.title = 'Current location';
        topRightControlDiv.appendChild(homeControlUI);
    }
    var homeControl = new HomeControl(topRightControlDiv, map);
    topRightControlDiv.index = 1;

    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(topRightControlDiv);

    var MenuControl = function (controlDiv, map) {
        menuControlUI = document.createElement('div');
        menuControlUI.id = "menubutton";
        menuControlUI.className = "button button-icon icon ion-android-menu h-bar-control-div";
        menuControlUI.style.paddingBottom = '20px';
        menuControlUI.title = 'Menu';
        controlDiv.appendChild(menuControlUI);
    }
    var menuControl = new MenuControl(controlDiv, map);
    controlDiv.index = 1;


    var ShareControl = function (controlDiv, map) {
        shareControlNewUI = document.createElement('div');
        shareControlNewUI.id = "sharelocbutton";
        shareControlNewUI.className = "button button-icon icon ion-android-share h-bar-control-div start-sharing";
        shareControlNewUI.style.paddingBottom = '20px';
        shareControlNewUI.title = 'Share location';
        controlDiv.appendChild(shareControlNewUI);
    }
    var shareControl = new ShareControl(controlDiv, map);
    controlDiv.index = 2;

    var StatusControl = function (controlDiv, map) {
        statusControlUI = document.createElement('div');
        statusControlUI.id = "statusbutton";
        statusControlUI.className = "button button-icon icon ion-android-share stop-sharing";
        statusControlUI.style.paddingBottom = '20px';
        statusControlUI.title = 'Share status';
        controlDiv.appendChild(statusControlUI);
    }
    var statusControl = new StatusControl(controlDiv, map);
    controlDiv.index = 3;

    var LayerControl = function (controlDiv, map) {
        layerControlUI = document.createElement('div');
        layerControlUI.id = "layerbutton";
        layerControlUI.className = "button button-icon icon ion-social-buffer h-bar-control-div";
        layerControlUI.style.paddingBottom = '20px';
        layerControlUI.title = 'Layers';
        controlDiv.appendChild(layerControlUI);
    }
    var layerControl = new LayerControl(controlDiv, map);
    controlDiv.index = 4;


    map.controls[google.maps.MapTypeControlStyle.HORIZONTAL_BAR, google.maps.ControlPosition.BOTTOM]
        .push(controlDiv);
        
    
}
function displayAndWatch(position, $http, glancepub, glancesms) {
    setCurrentPosition(position, $http, glancepub, glancesms);

    forge.launchimage.hide(function () { }, function () { });

    watchCurrentPosition($http, glancepub);
}
function setCurrentPosition(pos, $http, glancepub, glancesms) {
    currentPositionMarker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(
            pos.coords.latitude,
            pos.coords.longitude
            )
    });

    $http.defaults.headers.common['x-api-key'] = 'SNriDHrilP2i8MqyAypVtA8ZsyzVdy39z7USppI7';
    //var msg = "{'lat':"+pos.coords.latitude+",'lng':"+pos.coords.longitude+"}";
    var msg = '{"lat":'+pos.coords.latitude+',"lng":'+pos.coords.longitude+'}';
    var message = JSON.parse(msg);
    glancepub.save({"channel":"my_channel", "message":message}, function(res){
        //forge.logging.log("Published : "+JSON.stringify(res))
    });
    

    map.panTo(new google.maps.LatLng(
        pos.coords.latitude,
        pos.coords.longitude
        ));

    google.maps.event.addDomListener(homeControlUI, 'click', function () {
        currentPositionMarker.setPosition(
            new google.maps.LatLng(
                pos.coords.latitude,
                pos.coords.longitude)
            );
    });

    google.maps.event.addDomListener(shareControlNewUI, 'click', function () {
        forge.contact.select(function (contact) {
            shareMyLoc = true;
            //sendsms(contact.phoneNumbers[0].value, 'Watch me at http://geobus.s3-website-us-west-2.amazonaws.com/', $http, glancesms);
            
            $http.defaults.headers.common['x-api-key'] = 'SNriDHrilP2i8MqyAypVtA8ZsyzVdy39z7USppI7';
            var res = glancesms.save({"to":contact.phoneNumbers[0].value,"msg":'Watch me at http://geobus.s3-website-us-west-2.amazonaws.com/'});
            forge.logging.log("SMS Sent : "+JSON.stringify(res));
            
            forge.logging.log('Sharing to ' + contact.phoneNumbers[0].value);
        }, function () { forge.logging.log('No contact selected!'); });
    });

    google.maps.event.addDomListener(statusControlUI, 'click', function () {
        shareMyLoc = false;
        forge.logging.log('Not sharing');
        document.getElementById('maphead').getAttribute("view-title").replace("You are currently sharing", "You are currently not sharing");
    });
}

function watchCurrentPosition($http, glancepub) {
    var positionTimer = navigator.geolocation.watchPosition(
        function (position) {
            setMarkerPosition(position, $http, glancepub);
        }, function (error) { }, { enableHighAccuracy: true });

    google.maps.event.addDomListener(layerControlUI, 'click', function () {
        showingTraffic = !showingTraffic;
        if (showingTraffic) {
            trafficLayer.setMap(map);
        } else {
            trafficLayer.setMap(null);
        }
    });

}

function setMarkerPosition(position, $http, glancepub) {
    var prevProsition = currentPositionMarker.getPosition();
    currentPositionMarker.setPosition(
        new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude)
        );

    var t1 = Date.now();
    var speed = calculateSpeed(t1 / 1000, prevProsition.lat(), prevProsition.lng(), Date.now() / 1000, position.coords.latitude, position.coords.longitude);

    if (shareMyLoc) {// && speed > 0 
        $http.defaults.headers.common['x-api-key'] = 'SNriDHrilP2i8MqyAypVtA8ZsyzVdy39z7USppI7';
        //var msg = "{'lat':"+position.coords.latitude+",'lng':"+position.coords.longitude+"}";
        var msg = '{"lat":'+position.coords.latitude+',"lng":'+position.coords.longitude+'}';
        var message = JSON.parse(msg);
        glancepub.save({"channel":"my_channel", "message":message}, function(res){
            //forge.logging.log("Published : "+JSON.stringify(res))
        });
    }

    map.panTo(new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
        ));
}

function calculateSpeed(t1, lat1, lng1, t2, lat2, lng2) {
    // From Caspar Kleijne's answer starts
    /** Converts numeric degrees to radians */
    if (typeof (Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function () {
            return this * Math.PI / 180;
        }
    }
    // From Caspar Kleijne's answer ends
    // From cletus' answer starts
    var R = 6371; // km
    var dLat = (lat2 - lat1).toRad();
    var dLon = (lng2 - lng2).toRad();
    var lat1 = lat1.toRad();
    var lat2 = lat2.toRad();

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c;
    // From cletus' answer ends
        
    return distance / t2 - t1;
}
function locError(error) {
    // the current position could not be located
    alert(error.message);
    forge.logging.log(error.message);
}