
/*

 Client side functions

    These functions below are specific to the client side only,
    and usually start with client_* to make things clearer.

*/

game_core.prototype.client_handle_input = function(){

    //if(this.lit > this.local_time) return;
    //this.lit = this.local_time+0.5; //one second delay

        //This takes input from the client and keeps a record,
        //It also sends the input information to the server immediately
        //as it is pressed. It also tags each input with a sequence number.

    var x_dir = 0;
    var y_dir = 0;
    var input = [];
    this.client_has_input = false;

    if( this.keyboard.pressed('A') ||
        this.keyboard.pressed('left')) {

            x_dir = -1;
            input.push('l');

        } //left

    if( this.keyboard.pressed('D') ||
        this.keyboard.pressed('right')) {

            x_dir = 1;
            input.push('r');

        } //right

    if( this.keyboard.pressed('S') ||
        this.keyboard.pressed('down')) {

            y_dir = 1;
            input.push('d');

        } //down

    if( this.keyboard.pressed('W') ||
        this.keyboard.pressed('up')) {

            y_dir = -1;
            input.push('u');

        } //up

    if(input.length) {

            //Update what sequence we are on now
        this.input_seq += 1;

            //Store the input state as a snapshot of what happened.
        this.players.self.inputs.push({
            inputs : input,
            time : this.local_time.fixed(3),
            seq : this.input_seq
        });

            //Send the packet of information to the server.
            //The input packets are labelled with an 'i' in front.
        var server_packet = 'i.';
            server_packet += input.join('-') + '.';
            server_packet += this.local_time.toFixed(3).replace('.','-') + '.';
            server_packet += this.input_seq;

            //Go
        this.socket.send(  server_packet  );

            //Return the direction if needed
        return this.physics_movement_vector_from_direction( x_dir, y_dir );

    } else {

        return {x:0,y:0};

    }

}; //game_core.client_handle_input

game_core.prototype.client_process_net_prediction_correction = function() {

        //No updates...
    if(!this.server_updates.length) return;

        //The most recent server update
    var latest_server_data = this.server_updates[this.server_updates.length-1];

        //Our latest server position
    var my_server_pos = this.players.self.host ? latest_server_data.hp : latest_server_data.cp;

        //Update the debug server position block
    this.ghosts.server_pos_self.pos = this.pos(my_server_pos);

            //here we handle our local input prediction ,
            //by correcting it with the server and reconciling its differences

        var my_last_input_on_server = this.players.self.host ? latest_server_data.his : latest_server_data.cis;
        if(my_last_input_on_server) {
                //The last input sequence index in my local input list
            var lastinputseq_index = -1;
                //Find this input in the list, and store the index
            for(var i = 0; i < this.players.self.inputs.length; ++i) {
                if(this.players.self.inputs[i].seq == my_last_input_on_server) {
                    lastinputseq_index = i;
                    break;
                }
            }

                //Now we can crop the list of any updates we have already processed
            if(lastinputseq_index != -1) {
                //so we have now gotten an acknowledgement from the server that our inputs here have been accepted
                //and that we can predict from this known position instead

                    //remove the rest of the inputs we have confirmed on the server
                var number_to_clear = Math.abs(lastinputseq_index - (-1));
                this.players.self.inputs.splice(0, number_to_clear);
                    //The player is now located at the new server position, authoritive server
                this.players.self.cur_state.pos = this.pos(my_server_pos);
                this.players.self.last_input_seq = lastinputseq_index;
                    //Now we reapply all the inputs that we have locally that
                    //the server hasn't yet confirmed. This will 'keep' our position the same,
                    //but also confirm the server position at the same time.
                this.client_update_physics();
                this.client_update_local_position();

            } // if(lastinputseq_index != -1)
        } //if my_last_input_on_server

}; //game_core.client_process_net_prediction_correction

game_core.prototype.client_process_net_updates = function() {

        //No updates...
    if(!this.server_updates.length) return;

    //First : Find the position in the updates, on the timeline
    //We call this current_time, then we find the past_pos and the target_pos using this,
    //searching throught the server_updates array for current_time in between 2 other times.
    // Then :  other player position = lerp ( past_pos, target_pos, current_time );

        //Find the position in the timeline of updates we stored.
    var current_time = this.client_time;
    var count = this.server_updates.length-1;
    var target = null;
    var previous = null;

        //We look from the 'oldest' updates, since the newest ones
        //are at the end (list.length-1 for example). This will be expensive
        //only when our time is not found on the timeline, since it will run all
        //samples. Usually this iterates very little before breaking out with a target.
    for(var i = 0; i < count; ++i) {

        var point = this.server_updates[i];
        var next_point = this.server_updates[i+1];

            //Compare our point in time with the server times we have
        if(current_time > point.t && current_time < next_point.t) {
            target = next_point;
            previous = point;
            break;
        }
    }

        //With no target we store the last known
        //server position and move to that instead
    if(!target) {
        target = this.server_updates[0];
        previous = this.server_updates[0];
    }

        //Now that we have a target and a previous destination,
        //We can interpolate between then based on 'how far in between' we are.
        //This is simple percentage maths, value/target = [0,1] range of numbers.
        //lerp requires the 0,1 value to lerp to? thats the one.

     if(target && previous) {

        this.target_time = target.t;

        var difference = this.target_time - current_time;
        var max_difference = (target.t - previous.t).fixed(3);
        var time_point = (difference/max_difference).fixed(3);

            //Because we use the same target and previous in extreme cases
            //It is possible to get incorrect values due to division by 0 difference
            //and such. This is a safe guard and should probably not be here. lol.
        if( isNaN(time_point) ) time_point = 0;
        if(time_point == -Infinity) time_point = 0;
        if(time_point == Infinity) time_point = 0;

            //The most recent server update
        var latest_server_data = this.server_updates[ this.server_updates.length-1 ];

            //These are the exact server positions from this tick, but only for the ghost
        var other_server_pos = this.players.self.host ? latest_server_data.cp : latest_server_data.hp;

            //The other players positions in this timeline, behind us and in front of us
        var other_target_pos = this.players.self.host ? target.cp : target.hp;
        var other_past_pos = this.players.self.host ? previous.cp : previous.hp;

            //update the dest block, this is a simple lerp
            //to the target from the previous point in the server_updates buffer
        this.ghosts.server_pos_other.pos = this.pos(other_server_pos);
        this.ghosts.pos_other.pos = this.v_lerp(other_past_pos, other_target_pos, time_point);

        if(this.client_smoothing) {
            this.players.other.pos = this.v_lerp( this.players.other.pos, this.ghosts.pos_other.pos, this._pdt*this.client_smooth);
        } else {
            this.players.other.pos = this.pos(this.ghosts.pos_other.pos);
        }

            //Now, if not predicting client movement , we will maintain the local player position
            //using the same method, smoothing the players information from the past.
        if(!this.client_predict && !this.naive_approach) {

                //These are the exact server positions from this tick, but only for the ghost
            var my_server_pos = this.players.self.host ? latest_server_data.hp : latest_server_data.cp;

                //The other players positions in this timeline, behind us and in front of us
            var my_target_pos = this.players.self.host ? target.hp : target.cp;
            var my_past_pos = this.players.self.host ? previous.hp : previous.cp;

                //Snap the ghost to the new server position
            this.ghosts.server_pos_self.pos = this.pos(my_server_pos);
            var local_target = this.v_lerp(my_past_pos, my_target_pos, time_point);

                //Smoothly follow the destination position
            if(this.client_smoothing) {
                this.players.self.pos = this.v_lerp( this.players.self.pos, local_target, this._pdt*this.client_smooth);
            } else {
                this.players.self.pos = this.pos( local_target );
            }
        }

    } //if target && previous

}; //game_core.client_process_net_updates

game_core.prototype.client_onserverupdate_recieved = function(data){
		if (data.board_spaces){	this.board_spaces = data.board_spaces;}

		if (data.self_score){ this.players.self.score = data.self_score;}
		if (data.other_score){ this.players.other.score = data.other_score;}

        //Lets clarify the information we have locally. One of the players is 'hosting' and
        //the other is a joined in client, so we name these host and client for making sure
        //the positions we get from the server are mapped onto the correct local sprites
        var player_host = this.players.self.host ?  this.players.self : this.players.other;
        var player_client = this.players.self.host ?  this.players.other : this.players.self;
        var this_player = this.players.self;
        
		//Store the server time (this is offset by the latency in the network, by the time we get it)
		this.server_time = data.t;
		//Update our local offset time from the last server update
		this.client_time = this.server_time - (this.net_offset/1000);

		//One approach is to set the position directly as the server tells you.
		//This is a common mistake and causes somewhat playable results on a local LAN, for example,
		//but causes terrible lag when any ping/latency is introduced. The player can not deduce any
		//information to interpolate with so it misses positions, and packet loss destroys this approach
		//even more so. See 'the bouncing ball problem' on Wikipedia.

        if(this.naive_approach) {

            if(data.hp) {
                player_host.pos = this.pos(data.hp);
            }

            if(data.cp) {
                player_client.pos = this.pos(data.cp);
            }

        } else {

                //Cache the data from the server,
                //and then play the timeline
                //back to the player with a small delay (net_offset), allowing
                //interpolation between the points.
            this.server_updates.push(data);

                //we limit the buffer in seconds worth of updates
                //60fps*buffer seconds = number of samples
            if(this.server_updates.length >= ( 60*this.buffer_size )) {
                this.server_updates.splice(0,1);
            }

                //We can see when the last tick we know of happened.
                //If client_time gets behind this due to latency, a snap occurs
                //to the last tick. Unavoidable, and a reallly bad connection here.
                //If that happens it might be best to drop the game after a period of time.
            this.oldest_tick = this.server_updates[0].t;

                //Handle the latest positions from the server
                //and make sure to correct our local predictions, making the server have final say.
            this.client_process_net_prediction_correction();
            
        } //non naive

}; //game_core.client_onserverupdate_recieved

game_core.prototype.client_update_local_position = function(){

 if(this.client_predict) {

            //Work out the time we have since we updated the state
        var t = (this.local_time - this.players.self.state_time) / this._pdt;

            //Then store the states for clarity,
        var old_state = this.players.self.old_state.pos;
        var current_state = this.players.self.cur_state.pos;

            //Make sure the visual position matches the states we have stored
        //this.players.self.pos = this.v_add( old_state, this.v_mul_scalar( this.v_sub(current_state,old_state), t )  );
        this.players.self.pos = current_state;
        
            //We handle collision on client if predicting.
        this.check_collision( this.players.self );

    }  //if(this.client_predict)

}; //game_core.prototype.client_update_local_position

game_core.prototype.client_update_physics = function() {

        //Fetch the new direction from the input buffer,
        //and apply it to the state so we can smooth it in the visual state

    if(this.client_predict) {

        this.players.self.old_state.pos = this.pos( this.players.self.cur_state.pos );
        var nd = this.process_input(this.players.self);
        this.players.self.cur_state.pos = this.v_add( this.players.self.old_state.pos, nd);
        this.players.self.state_time = this.local_time;

    }

}; //game_core.client_update_physics

game_core.prototype.client_update = function() {

        //Clear the screen area
    this.ctx.clearRect(0,0,720,480);

	this.client_draw_board();

        //draw help/information if required
    this.client_draw_info();

        //Capture inputs from the player
    this.client_handle_input();

        //Network player just gets drawn normally, with interpolation from
        //the server updates, smoothing out the positions from the past.
        //Note that if we don't have prediction enabled - this will also
        //update the actual local client position on screen as well.
    if( !this.naive_approach ) {
        this.client_process_net_updates();
    }

        //Now they should have updated, we can draw the entity
    this.players.other.draw();

        //When we are doing client side prediction, we smooth out our position
        //across frames using local input states we have stored.
    this.client_update_local_position();

        //And then we finally draw
    this.players.self.draw();

        //and these
    if(this.show_dest_pos && !this.naive_approach) {
        this.ghosts.pos_other.draw();
    }

        //and lastly draw these
    if(this.show_server_pos && !this.naive_approach) {
        this.ghosts.server_pos_self.draw();
        this.ghosts.server_pos_other.draw();
    }

        //Work out the fps average
    this.client_refresh_fps();

}; //game_core.update_client


