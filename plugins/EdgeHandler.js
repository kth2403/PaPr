//=============================================================================
// EdgeHandler.js
//=============================================================================

/*:
 * @plugindesc Adds automatic handling when the party touches the edge of a map.
 * @author whitesphere
 *
 * @param Common Event ID
 * @desc Which common event is called when the player reaches an edge, by default.
 * @default 1
 *
 * @param Direction Variable
 * @desc Contain the party's current direction: "top", "left", "right" or "bottom"
 * @default 10
 *
 * @param Map ID Variable
 * @desc Variable which will contain the current Map ID
 * @default 11
 *
 * @param Fade Type
 * @desc How does the screen fade during the transfer.  0=Black, 1=White, 2=None
 * @default 0
 *
 * @param Transfer Sound
 * @desc The Sound Effect to play when starting a map transfer
 * @default Move1
 *
 * @help With this active, by default, when the player touches an edge of the screen,
 * this plugin will first set the party's direction and current Map ID in the variables
 * specified in the plug-in parameters.  Then, it will call the common event ID specified
 * in the "Common Event ID" parameter.  The common event can then check the current map ID, 
 * direction, etc, anything else to transfer the player to a different map.  This is highly
 * useful for fairly open maps where the player has many different ways to
 * exit the map.
 * The direction will be set to "bottom" for the bottom edge, "left" for the left edge, 
 * "right" for the right edge and "top" for the top edge.
 *
 * By default, when the player reaches an edge of the current map. the plug-in
 * sets the current Map ID into the "Map ID Variable" variable, and the current
 * player direction into the "Direction Variable" variable.  It then calls the
 * Common event specified by "Common Event ID"
 *
 * However, if you add in a per-map notetag, you can ask this plug-in to automatically
 * transport the player from, say, the left-most edge of one map to the right-most
 * edge of another.  When this plug-in wraps the player this way, it maintains the
 * other coordinate.  For example, moving left from (0,33) onto a map which is 50 tiles 
 * wide will end up on (49, 33).  
 * Moving off the top or bottom preserves the X coordinate, and moving off the left or
 * right preserves the Y coordinate.
 *
 * ============================================================================
 * Plug-in Commands
 * ============================================================================
 *
 * EdgeHandler EnterMap <map id> <edge name> - Enters the map specified as if the
 * player had walked in from the appropriate edge (bottom, top, left, right) from his
 * or her current location.
 * For example, if Map ID 3 were 50 tiles wide and 30 high, and the player were
 * currently at X=10, Y=20, if you call EnterMap 3 top, the player  
 * would be transferred to X=10, Y=1 on Map ID 3
 * If you called EnterMap 3 right instead, the player would be transferred to
 * X=49, Y=20 on Map ID 3.
 *
 * EdgeHandler SetEnabled (true or false) - If true, enables the current map's edge
 * handling.  If false, disables the current map's edge handling. Transferring to a
 * new map re-enables edge handling.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * You can use this notetag inside of your maps.  
 *
 * Map Notetags:
 *   <edge: (direction)=handling_type(param) [fade=(0, 1, 2)] [sound=Move1]>
 *   The direction can be one of these strings: top, bottom, left or right
 *   Handling_type is either "common_event" to call a particular common event, "none" to 
 *   disable edge handling for this side, or "map" to automatically wrap to the opposite
 *	 edge of the map ID specified by "param"
 *   Param is either a Common Event ID for the "common_event" handling type, or
 *   a Map ID for the "map" handling type.
 *	 If specified, fade describes how the screen fades during the map transfer.
 *	 0=Fade to Black, 1=Fade to White, 2=No Fade
 *	 Finally, if sound is set, the Sound Effect named will play before a map transfer.
 *	 If it is not, the Transfer Sound is played.  
 *   For example:
 *   <edge: top=common_event(3) bottom=map(2) left=map(3) right=map(4)>
 *	 When the player reaches the top, this calls Common Event 3, setting the Direction
 *	 and Map ID Variables before it does so.
 *	 When the player reaches the left, this finds the size of Map ID 3, and puts the
 *	 player at the rightmost side of Map ID 3, with the same Y coordinate.
 *	 When the player reaches the bottom, this puts the player at the topmost side of
 *	 Map ID 2, with the same X coordinate.
 *	 When the player reaches the right, this puts the player at the leftmost side of
 *	 Map ID 4, with the same Y coordinate.
 *
 *	 If a side is not set in the notetag, this plug-in reverts to the default behavior for
 *	 that side:  Set Map ID and Direction variables, then call the Common Event ID
 *	 specified in the plug-in parameters.
 */
 
 (function() {

WS_EdgeHandler = {}; 

WS_EdgeHandler.Parameters = PluginManager.parameters('EdgeHandler');
WS_EdgeHandler.Param = {};

WS_EdgeHandler.Param.CommonEventID = parseInt(WS_EdgeHandler.Parameters['Common Event ID']);
WS_EdgeHandler.Param.DirectionVariable = parseInt(WS_EdgeHandler.Parameters['Direction Variable']);
WS_EdgeHandler.Param.MapIDVariable = parseInt(WS_EdgeHandler.Parameters['Map ID Variable']);
WS_EdgeHandler.Param.FadeType = parseInt(WS_EdgeHandler.Parameters['Fade Type']);
WS_EdgeHandler.Param.TransferSound = WS_EdgeHandler.Parameters['Transfer Sound'];


$edgeHandler = {};

//=============================================================================
// Object to do special case handling at map edges
// Expects a note tag in the following format:
// <edge: top=common_event:3 fade=2 bottom=map:2 left=map:3 right=map:4>
//=============================================================================
Edge_Handler = function(meta) {
	if (meta && meta.edge) {
		var handlerString=meta.edge;
		var argSet=handlerString.split(" ");
		this.sides = {};
		this.fade=WS_EdgeHandler.Param.FadeType;
		this.sound=WS_EdgeHandler.Param.TransferSound;
		for (var index=0; index<argSet.length; index++) {
			var current_arg=argSet[index];
			current_arg=current_arg.trim().toLowerCase();
			
			/* Split into direction=param:arg */
			direction_and_stuff=current_arg.split("=");
			if (direction_and_stuff.length != 2) {
				continue;
			}
			
			
			if (direction_and_stuff[0] == "fade") {
				if (!!parseInt(direction_and_stuff[1]))
					this.fade=parseInt(direction_and_stuff[1]);
				continue;
			}
			if (direction_and_stuff[0] == "sound") {
				this.sound=direction_and_stuff[1];
				continue;
			}
			
			/* The direction needs to be valid */
			direction_int=this.directionToInt(direction_and_stuff[0]);
			if (direction_int === undefined) {
				continue;
			}

			/* Split the command and parameter from cmd(param) to [cmd param]*/
			param_match=direction_and_stuff[1].match(/\([0-9]*\)/);
			cmd_and_param=[];
			if (param_match) {
				/* Pull the value out of the parenthesis */
				cmd_and_param[1]=parseInt(param_match[0].substring(1, param_match[0].length-1));
				
				/* The command comes before the value */
				cmd_and_param[0]=direction_and_stuff[1].substring(0, direction_and_stuff[1].indexOf(param_match[0]));
			}
			if (cmd_and_param.length != 2 && direction_and_stuff[1] != "none") {
				continue;
			}
			if (direction_and_stuff[1] == "none")
				cmd_and_param[0]="none";
			if (cmd_and_param[0] != "common_event" && cmd_and_param[0] != "map" &&
				cmd_and_param[0] != "none") {
				continue;
			}
			param_int=cmd_and_param[1];
			this.sides[direction_int]=[cmd_and_param[0], param_int];
		}
	}
	else
	{
		this.sides={};
	}
}

//=============================================================================
// Converts a direction (2, 4, 6, 8) to a string
//=============================================================================
Edge_Handler.prototype.directionToString = function(direction) {
	if (Edge_Handler.prototype._directions === undefined) {
		Edge_Handler.prototype._directions = [];
		/* DIRECTION VALUES: 2 = down, 4 = left, 6 = right, 8 = up */
		Edge_Handler.prototype._directions[2]="bottom";
		Edge_Handler.prototype._directions[4]="left";
		Edge_Handler.prototype._directions[6]="right";
		Edge_Handler.prototype._directions[8]="top";
	}
	return Edge_Handler.prototype._directions[direction];
}

//=============================================================================
// Converts a direction string to an integer.  Returns undefined if there
// is no match
//=============================================================================
Edge_Handler.prototype.directionToInt = function(direction) {
	if (Edge_Handler.prototype._directions === undefined) {
		Edge_Handler.prototype._directions = [];
		/* DIRECTION VALUES: 2 = down, 4 = left, 6 = right, 8 = up */
		Edge_Handler.prototype._directions[2]="bottom";
		Edge_Handler.prototype._directions[4]="left";
		Edge_Handler.prototype._directions[6]="right";
		Edge_Handler.prototype._directions[8]="top";
	}
	for (var check=2; check<10; check += 2) {
		if (direction == Edge_Handler.prototype._directions[check])
			return check;
	}
	return undefined;
}

//=============================================================================
// Play the transfer sound
//=============================================================================
Edge_Handler.prototype.playTransferSound = function(sound_effect) {
	if (!sound_effect)
		sound_effect=WS_EdgeHandler.Param.TransferSound;
	if (sound_effect)
		sound_effect=sound_effect.trim();
	
	if (!sound_effect || !sound_effect.length)
		return;
	sound_obj={};
	sound_obj.name=sound_effect;
	sound_obj.volume=100;
	sound_obj.pitch=100;
	sound_obj.pan=0;
	AudioManager.playSe(sound_obj);
}

//=============================================================================
// Loads the map and returns it.
//=============================================================================
Edge_Handler.prototype.moveToDifferentMap = function(x, y, map_id, direction, fade_type, sound) {
	$edgeHandler.edgeLoadDirection=direction;
	$edgeHandler.edgeHandler=this;
	$edgeHandler.edgeMapId=map_id;
	$edgeHandler.edgeX=x;
	$edgeHandler.edgeY=y;
	$edgeHandler.edgeHandler.playTransferSound(sound);
	
	$gamePlayer.reserveTransfer(map_id,9999, 9999, direction, fade_type);
}

//=============================================================================
// Handles moving off the top or left edges of the previous map
//=============================================================================
Edge_Handler.prototype.finishSpecialCaseEdges = function(x, y, map, direction, map_id) {
	/* Off left edge.  Here, we must find the width of the map we want to reach,
	then subtract 2 from it
	*/
	new_x=x;
	new_y=y;
	if (direction == 4) {
		new_x=$dataMap.width-2;
		if (new_x < 0)
			new_x=0;
	}

	/* Off top edge.  Get the height of the new map and subtract 2 from it */
	if (direction == 8) {
		new_y=$dataMap.height-2;
		if (new_y < 0)
			new_y=0;
	}
	
	console.log("Finish: Moving player to ("+new_x+","+new_y+") on map "+map_id);
	$edgeHandler={};
	
	/* And send the player to the new location */
	$gamePlayer.reserveTransfer(map_id, new_x, new_y, direction);
}

//=============================================================================
// Does the handling for this particular direction (2=bottom, 4=left, 6=right, 8=top)
//=============================================================================
Edge_Handler.prototype.processEdge = function(direction, cmd_map_id) {
	var current_type="common_event";
	
	var param_id=WS_EdgeHandler.Param.CommonEventID;
	if (this.sides[direction] !== undefined) {
		current_side=this.sides[direction];
		current_type=current_side[0];
		param_id=current_side[1];
	}
	
	/* Set the map ID and direction variables */
	if (!!WS_EdgeHandler.Param.DirectionVariable)
	{
		$gameVariables.setValue(WS_EdgeHandler.Param.DirectionVariable, this.directionToString(direction));
	}
	if (!!WS_EdgeHandler.Param.MapIDVariable)
	{
		$gameVariables.setValue(WS_EdgeHandler.Param.MapIDVariable, $gameMap.mapId()[0]);
	}
	
	/* If this is disabled, we do nothing */
	if (current_type == "none") {
		return;
	}
	
	/* We've turned off edge handling for this map */
	if ($gameMap._edgesDisabled) {
		return;
	}
	
	/* Easy case: We are a common event.  Just call it and return */
	if (current_type == "common_event") {
		if (!!param_id)
		{
			this.playTransferSound(this.sound);
			$gameTemp.reserveCommonEvent(param_id);
		}
		return;
	}
	
	/* The more interesting case.  If we are moving from the bottom or right, we know
	where we are going.  Bottom means Y=1 on the new map and right means X=1 on the new
	map. We want to stay off the edge so we don't end up transporting back to this map
	and creating an endless loop.
	*/
	var new_y=$gamePlayer.y;
	var new_x=$gamePlayer.x;
	var map_id=param_id;
	if (cmd_map_id)
	{
		map_id=cmd_map_id;
	}
	
	/* Off right edge */
	if (direction == 6) {
		new_x=1;
	}
	
	/* Off bottom edge */
	if (direction == 2) {
		new_y=1;
	}
	
	/* Off left edge.  Here, we must find the width of the map we want to reach,
	then subtract 2 from it
	*/
	if (direction == 4) {
		map=this.moveToDifferentMap(new_x, new_y, map_id, direction, this.fade, this.sound);
		return;
	}

	/* Off top edge.  Get the height of the new map and subtract 2 from it */
	if (direction == 8) {
		this.moveToDifferentMap(new_x, new_y, map_id, direction, this.fade, this.sound);
		return;
	}
	
	this.playTransferSound(this.sound);
	console.log("Moving player to ("+new_x+","+new_y+") on map "+map_id);
	$edgeHandler={};
	/* And send the player to the new location */
	$gamePlayer.reserveTransfer(map_id, new_x, new_y, direction);
}


//=============================================================================
// Plug-in commands
//=============================================================================
var _WS_EH_plugInCommand =
		Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	if (command === 'EdgeHandler') {
		args[0]=args[0].toLowerCase();
		switch (args[0]) {
		// * EdgeHandler entermap <map id> <edge> 
			case 'entermap':
			if (args.length < 3)
			{
				console.log("Usage: EdgeHandler entermap (map id) (edge: top, bottom, left, right)");
				return;
			}
			else
			{
				edgeHandler=new Edge_Handler($dataMap.meta);
				reversedDirection=10-edgeHandler.directionToInt(args[2]);
				console.log("Setting the player to enter map ="+args[2]);
				edgeHandler.processEdge(reversedDirection, parseInt(args[1]));
			}
			break;
			case 'setenabled':
			if (args.length < 2)
			{
				console.log("Usage: EdgeHandler SetEnabled (true or false)");
				return;
			}
			else
			{
				if (args[1].trim().toLowerCase() == "true")
				{
					$gameMap._edgesDisabled=false;
					console.log("Edge handling enabled");
				}
				else
				{
					$gameMap._edgesDisabled=true;
					console.log("Edge handling disabled");
				}
			}
			break;
		}
	}
	_WS_EH_plugInCommand.call(this, command, args);
};


//=============================================================================
// Game_Map
//=============================================================================



var WS_EW_GM_move=Game_Map.prototype.moveAfterCommonEvent;

//=============================================================================
// Make sure we don't keep trying to handle the edge once we've done it
//=============================================================================
Game_Map.prototype.moveAfterCommonEvent = function() {
    if ($gameTemp.destinationX() === $gamePlayer.x &&
      $gameTemp.destinationY() === $gamePlayer.y) {
        $gameTemp.clearDestination();
    }
	return WS_EW_GM_move.call(this);
};

//=============================================================================
// Game_Player
//=============================================================================

//=============================================================================
// See if are at an edge of the current map
//=============================================================================
Game_Player.prototype.processMapEdge = function() {
	
	if (this.x > 0 && this.y > 0 && this.x < $dataMap.width-1 &&
	this.y < $dataMap.height-1)
	{
		return;
	}
	if ($gameMap._edgesDisabled)
	{
		return;
	}
	
	if (!$edgeHandler.edgeHandler) {
		$edgeHandler.edgeHandler=new Edge_Handler($dataMap.meta);
	}
	
	if (this.x == 0)
		direction=4;
	if (this.y == 0)
		direction=8;
	if (this.x == $dataMap.width-1)
		direction=6;
	if (this.y == $dataMap.height-1)
		direction=2;
	
	/* Don't do a thing if we are already handling it */
	if ($edgeHandler.edgeLoadDirection) {
		return;
	}
	$edgeHandler.edgeHandler.processEdge(direction, 0);
};

WS_EdgeHandler.Game_Player_moveStraight =
    Game_Player.prototype.moveStraight;
Game_Player.prototype.moveStraight = function(d) {
	WS_EdgeHandler.Game_Player_moveStraight.call(this, d);
	this.processMapEdge();
};

WS_EdgeHandler.Game_Player_moveDiagonally =
    Game_Player.prototype.moveDiagonally;
Game_Player.prototype.moveDiagonally = function(horz, vert) {
    WS_EdgeHandler.Game_Player_moveDiagonally.call(this, horz, vert);
	this.processMapEdge();
};


//=============================================================================
// Game_Map
//=============================================================================
WS_EH_GM_setup=Game_Map.prototype.setup;

Game_Map.prototype.setup = function(map_id) {
	$gameMap._edgesDisabled=false;
	WS_EH_GM_setup.call(this, arguments);
	if ($edgeHandler.edgeHandler) {
		$edgeHandler.edgeHandler.finishSpecialCaseEdges(
		$edgeHandler.edgeX, $edgeHandler.edgeY, $gameMap, $edgeHandler.edgeLoadDirection, $edgeHandler.edgeMapId);
	}
}
})();
//=============================================================================
// End of File
//=============================================================================
