//services/TwitterService
var Twitter = require('twitter');
module.exports = {
    //Number of clients connected to the room 'stream'
    room_length: 0,
    //Keep the stream open for several clients
    stream: null,

    wait_to_disconnect:false,

    //Start the stream if it's not running
    startService: function(){
        var _this = this;
        if(this.stream == null){
            console.log("Start twitter service");


            var client = new Twitter({
                consumer_key:sails.config.api.twitter.consumer_key,
                consumer_secret:sails.config.api.twitter.consumer_secret,
                access_token_key:sails.config.api.twitter.access_token_key,
                access_token_secret:sails.config.api.twitter.access_token_secret
            });

            client.stream('statuses/filter', {'locations':'-180,-90,180,90'}, function(stream){
                _this.stream = stream;

                //When we receive a tweet
                stream.on('data', function(event){
                    //Check  if this data is a tweet
                    if(event.text && event.text.trim()){
                        //JSON object which will be send to client
                        var res = {
                            'text':event.text
                        };
                        //If the var geo exists, we can get the exact position of the tweet in the world
                        if(event.geo){
                            res['position'] = {
                                'lat':event.geo.coordinates[0],
                                'lng':event.geo.coordinates[1]
                            };
                            res['type'] = 'real_position';
                        }
                        //With event.place, we can have an approximation of the position in a rectangle
                        //It can be a city, a country, etc
                        else if(event.place){
                            //calculates the center of this rect to display this point on the map
                            var centroid = {'lat':0, 'lng':0};
                            var i = 0;
                            event.place.bounding_box.coordinates[0].forEach(function(position){
                                i++;
                                centroid['lng'] += position[0];
                                centroid['lat'] += position[1];
                            });
                            centroid['lat'] /= i;
                            centroid['lng'] /= i;
                            res['position'] = centroid;
                            res['type'] = 'approximation';
                        }

                        if(sails.io.sockets.adapter.rooms['stream']){

                            _this.wait_to_disconnect = false;
                            //Send the tweet in the room 'stream'
                            sails.sockets.broadcast('stream', 'tweet', res);
                        }else{
                            //Wait to disconnect the stream to avoid inadvertent connection, for exemple if the user refresh his page
                            if(!_this.wait_to_disconnect){
                                _this.wait_to_disconnect = true;
                                setTimeout(function(){
                                    if(!sails.io.sockets.adapter.rooms['stream'] && _this.wait_to_disconnect){
                                        _this.stopService();
                                        _this.wait_to_disconnect = false;
                                    }
                                }, 5000);
                            }
                        }
                    }
                });
            })
        }
    },
    //Stop the stream
    stopService: function(){
        console.log("Stop twitter service");
        this.stream.destroy();
        this.stream = null;
    },
};
