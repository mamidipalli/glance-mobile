/*function publish(lat, lng) {
      var glancepubnub = PUBNUB.init({
            publish_key: 'pub-c-63292297-c3e2-40cd-8ea5-af3720b7a078',
            subscribe_key: 'sub-c-38383d3e-2724-11e5-83e8-02ee2ddab7fe'
      });
      var latlngvar = lat + " - " + lng;
      forge.logging.log("lat lng bef pub : " + latlngvar);
      glancepubnub.publish({
            channel: 'my_channel',
            message: { "lat": lat, "lng": lng }
      });
}*/

function publish(channel, lat, lng, $http, glancepub){
      $http.defaults.headers.common['x-api-key'] = 'SNriDHrilP2i8MqyAypVtA8ZsyzVdy39z7USppI7';
      var msg = "{'lat':'"+lat+"','lng':'"+lng+"'}";
      var res = glancepub.save({"channel":channel, "message":msg});
}





//


/*function notify(){
var glancepubnub = PUBNUB.init({
      publish_key: 'pub-c-63292297-c3e2-40cd-8ea5-af3720b7a078',
      subscribe_key: 'sub-c-38383d3e-2724-11e5-83e8-02ee2ddab7fe'
      });
glancepubnub.publish({
      channel : 'my_channel',
      message: {
            "aps" : {
            "alert" : "You got your emails.",
            "badge" : 9,
            "sound" : "bingbong.aiff"
            },
            "acme 1" : 42
      }
});
}*/