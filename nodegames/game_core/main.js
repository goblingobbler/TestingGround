
// ############################################# //
//Now the main game class. This gets created on both server and client. Server creates one for
//each game that is hosted, and client creates one for itself to play the game.
// ############################################# //
/* The game_core class */

var game_core = function(game_instance){

    //Store the instance, if this is a client it will be empty
    this.instance = game_instance;
    //Store a flag if we are the server
    this.server = this.instance !== undefined;

    //Used in collision etc.
    this.world = {
        width : 720,
        height : 480
    };

    //The speed at which the clients move.
    this.playerspeed = 120;

    //Size of the tiles on the board
	this.board_length = 20;
	this.increment = this.world.height/this.board_length;
	this.offset = (this.world.width - this.world.height)/2;

    //Setup initial state of the board
	this.board_spaces = [];
	for (var i=0;i<this.board_length;i++){
		this.board_spaces.push([]);
		for (var j=0;j<this.board_length;j++){
			this.board_spaces[i].push({'state': 0,'bomb': Math.floor(Math.random() * 1.5), 'score':0});
		}
	}

    //Create the scores found on each square depeneding on bomb location
	var cycle = [-1,0,1];
	for (var i=0;i<this.board_length;i++){
		for (var j=0;j<this.board_length;j++){
            //Look at all 8 places around the location
			for (off_x in cycle){
				off_x = parseInt(cycle[off_x]);
				for (off_y in cycle){
					off_y = parseInt(cycle[off_y]);
                    //If the square is on the board
					if (i+off_x >= 0 && j+off_y >= 0 && i+off_x < this.board_length && j+off_y < this.board_length){
						if (this.board_spaces[i+off_x][j+off_y].bomb){
                            //Add a point if a bomb is found
							this.board_spaces[i][j].score += 1;
						}
					}
				}
			}
		}
	}

    //We create a player set, passing them to
    //the game that is running them, as well
    if(this.server) {
        this.players = {
            self : new game_player(this,this.instance.player_host),
            other : new game_player(this,this.instance.player_client)
        };
    } else {
        this.players = {
            self : new game_player(this),
            other : new game_player(this)
        };

        //Debugging ghosts, to help visualise things
        this.ghosts = {
            //Our ghost position on the server
            server_pos_self : new game_player(this),
            //The other players server position as we receive it
            server_pos_other : new game_player(this),
            //The other players ghost destination position (the lerp)
            pos_other : new game_player(this)
        };

        this.ghosts.pos_other.state = 'dest_pos';

        this.ghosts.pos_other.info_color = 'rgba(255,255,255,0.1)';
        this.ghosts.server_pos_self.info_color = 'rgba(255,255,255,0.2)';
        this.ghosts.server_pos_other.info_color = 'rgba(255,255,255,0.2)';
        //Set ghost player states
        this.ghosts.server_pos_self.state = 'server_pos';
        this.ghosts.server_pos_other.state = 'server_pos';
    }

    
    //Set up some physics integration values
    this._pdt = 0.0001;                 //The physics update delta time
    this._pdte = new Date().getTime();  //The physics update last delta time
    //A local timer for precision on server and client
    this.local_time = 0.016;            //The local timer
    this._dt = new Date().getTime();    //The local timer delta
    this._dte = new Date().getTime();   //The local timer last frame time

    //Start a physics loop, this is separate to the rendering
    //as this happens at a fixed frequency
    this.create_physics_simulation();

    //Start a fast paced timer for measuring time easier
    this.create_timer();

    //Client specific initialisation
    if(!this.server) {
    
        //Create a keyboard handler
        this.keyboard = new THREEx.KeyboardState();

        //Create the default configuration settings
        this.client_create_configuration();

        //A list of recent server updates we interpolate across
        //This is the buffer that is the driving factor for our networking
        this.server_updates = [];

        //Connect to the socket.io server!
        this.client_connect_to_server();

        //We start pinging the server to determine latency
        this.client_create_ping_timer();

        //Set their colors from the storage or locally
        this.color = localStorage.getItem('color') || '#cc8822' ;
        localStorage.setItem('color', this.color);
        this.players.self.color = this.color;

        //Make this only if requested
        if(String(window.location).indexOf('debug') != -1) {
            this.client_create_debug_gui();
        }

    } else { //if !server
        this.server_time = 0;
        this.laststate = {};
    }
}; //game_core.constructor


//server side we set the 'game_core' class to a global type, so that it can use it anywhere.
if( 'undefined' != typeof global ) {
    module.exports = global.game_core = game_core;
}

