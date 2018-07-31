//=============================================================================
// btr_map_grid.js
//=============================================================================

/*:
 * @plugindesc v1.01 Extension to btr_map_core
 * @author Biterkid (Lantiz)
 *
 * @help
 * =============================================================================
 * btr_map_grid by Biterkid (Lantiz)
 * =============================================================================
 * Terms of use
 * ------------
 * You can use it for free with proper credits given
 * You can edit it as long as you share any improvement on RPG Maker Web Forum
 * The purpose of sharing this is to improve it, so help us help you!
 * =============================================================================
 * Tiles - add the tiles at these coordinates on the map
 * -----------------------------------------------------
 * [0, 0] - ground
 * [0, 1] - blockTop
 * [0, 2] - blockBase
 * =============================================================================
 * Map note tags
 * -------------
 * <type:grid>        - map size must follow <grid> option
 * <entrance:2/4/6/8> - up/right/down/left
 * <skipshadows>      - skip shadows drawing
 * =============================================================================
 * Event note tags
 * ---------------
 * <tile:xxxx> - blockTop, blockBase, fTop, fRight, fBottom, fLeft, fCenter
 * =============================================================================
 */

//==============================================================================
// ** Room
//==============================================================================
function Game_MapRoom() {
   return this.initialize.apply(this, arguments); 
}   

Game_MapRoom.prototype.initialize = function(x, y, width, height, doors) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.doors = doors;
};

Game_Map.prototype.buildCacheGrid = function() {
    this._roomWidth  = Math.floor(Graphics.boxWidth / this.tileWidth());
    this._roomHeight = Math.floor(Graphics.boxHeight / this.tileHeight());
    this._horzCount = Math.floor(this.width() / this._roomWidth);
    this._vertCount = Math.floor(this.height() / this._roomHeight);
    this._start = {x: 0, y: 0};
    this._end = {x: 0, y: 0};
    this._rooms = [];
    
    if(this._horzCount < 1 || this._vertCount < 1) {
        throw new Error('btr_map_grid: Invalid map size');
    }
    
    this._values = {
        ground: 0,
        blockTop: 1,
        blockBase: 2,
    };
    
    this._names = [
        'ground',
        'blockTop',
        'blockBase'
    ];
    
    this._tiles = {
        ground: [],
        blockTop: [],
        blockBase: []
    };

    for(var z = 0; z < 6; z++) {
        this._tiles.ground[z] = this.loadedTileId(0, 0, z);
        this._tiles.blockTop[z] = this.loadedTileId(0, 1, z);
        this._tiles.blockBase[z] = this.loadedTileId(0, 2, z);
    }
};

Game_Map.prototype.tileNameGrid = function(x, y) {
    return this._names[this._map[x][y]];  
};

Game_Map.prototype.canPlaceEventGrid = function(meta, x, y) {
    return this._map[x][y] == this._values[meta.tile];
};

Game_Map.prototype.placeEntranceExitGrid = function() {    
    $dataMap._entranceSide = $dataMap.meta.entrance || (Math.rand(1, 4) * 2);
    
    switch($dataMap._entranceSide) {
        case 2:
            this._start.x = Math.rand(1, this._horzCount) - 1;
            this._start.y = this._vertCount - 1;
            this._end.x = Math.rand(1, this._horzCount) - 1;
            this._end.y = 0;
            $dataMap._exitSide = 8;
            break;
            
        case 4:
            this._start.x = 0;
            this._start.y = Math.rand(1, this._vertCount) - 1;
            this._end.x = this._horzCount - 1;
            this._end.y = Math.rand(1, this._vertCount) - 1;
            $dataMap._exitSide = 6;
            break;
            
        case 6:
            this._start.x = this._horzCount - 1;
            this._start.y = Math.rand(1, this._vertCount) - 1;
            this._end.x = 0;
            this._end.y = Math.rand(1, this._vertCount) - 1;
            $dataMap._exitSide = 4;
            break;
            
        case 8:
            this._start.x = Math.rand(1, this._horzCount) - 1;
            this._start.y = 0;
            this._end.x = Math.rand(1, this._horzCount) - 1;
            this._end.y = this._vertCount - 1;
            $dataMap._exitSide = 2;
            break;
    }
    
    $dataMap._entrance = {
        x: (this._start.x * this._roomWidth) + Math.floor(this._roomWidth / 2), 
        y: (this._start.y * this._roomHeight) + Math.floor(this._roomHeight / 2)
    };
    
    $dataMap._exit = {
        x: (this._end.x * this._roomWidth) + Math.floor(this._roomWidth / 2), 
        y: (this._end.y * this._roomHeight) + Math.floor(this._roomHeight / 2)
    };
};

Game_Map.prototype.generateGrid = function() {
    
    //fill map
    for(var x = 0; x < this.width(); x++) {
        
        for(var y = 0; y < this.height(); y++) {
        
            this._map[x][y] = this._values.ground;
        }
    }
    
    //make rooms
    for(var x = 0; x < this._horzCount; x++) {
        this._rooms[x] = [];
        
        for(var y = 0; y < this._vertCount; y++) {
            var px = (x * this._roomWidth );
            var py = (y * this._roomHeight);
            var dx = (px + Math.round(this._roomWidth  / 2)) - 1;
            var dy = (py + Math.round(this._roomHeight / 2)) - 2;
            
            var doors = [
                {x: dx, y: 0 , d: 2, open: false}, 
                {x: 0 , y: dy, d: 4, open: false}, 
                {x: 0 , y: dy, d: 6, open: false}, 
                {x: dx, y: 0 , d: 8, open: false}
            ];
            
            if(y == (this._vertCount - 1)) {
                doors.splice(0, 1);
            }
            
            if(!x) {
                doors.splice(1, 1);
            }
            
            if(x == (this._horzCount - 1)) {
                doors.splice(2, 1);
            }
            
            if(!y) {
                doors.splice(3, 1);
            }
            
            //at last one open
            doors[Math.rand(0, (doors.length - 1))].open = true;
            
            for(var idx = 0; idx < doors.length; idx++) {                
                if(Math.rand(1, 100) <= 33) {
                    doors[idx].open = true;
                }
            }
            
            this._rooms[x][y] = new Game_MapRoom(px, py, this._roomWidth, this._roomHeight, doors);
        }
    }

    //fill rooms walls
    this._rooms.forEach(function(col) {
        col.forEach(function(room) {            
            var mx = (room.x + room.width  - 1);
            var my = (room.y + room.height - 1);

            for(var x = room.x; x < (room.x + room.width); x++) {
                this._map[x][room.y] = this._values.blockTop;
                this._map[x][my]  = this._values.blockTop;
            }

            for(var y = room.y; y < (room.y + room.height); y++) {

                this._map[room.x][y] = this._values.blockTop;
                this._map[mx][y] = this._values.blockTop;
            }

            room.doors.forEach(function(door) {

                if(door.open) {

                    switch(door.d) {
                        case 2:
                            for(var x = door.x; x < (door.x + 3); x++) {
                                if(my < (this.height() - 1)) {
                                    this._map[x][my] = this._values.ground;
                                }
                            }
                            break;


                        case 4:
                            for(var y = door.y; y < (door.y + 3); y++) {
                                if(room.x > 0) {
                                    this._map[room.x][y] = this._values.ground;
                                }
                            }
                            break;

                        case 6:
                            for(var y = door.y; y < (door.y + 3); y++) {
                                if(mx < (this.width() - 1)) {
                                    this._map[mx][y] = this._values.ground;
                                }
                            }
                            break;

                        case 8:
                            for(var x = door.x; x < (door.x + 3); x++) {
                                if(room.y > 0) {
                                    this._map[x][room.y] = this._values.ground;
                                }
                            }
                            break;
                    }
                }
            }, this);
        }, this);
    }, this);
    
    //open remaining doors
    for(var x = 0; x < this.width(); x++) {
        for(var y = 0; y < this.height(); y++) {
            
            if(x > 0 && x < (this.width() - 1) && y > 0 && y < (this.height() - 1) &&
               this._map[x][y] == this._values.blockTop &&
               ((this._map[x - 1][y] == this._values.ground && this._map[x + 1][y] == this._values.ground) ||
                (this._map[x][y - 1] == this._values.ground && this._map[x][y + 1] == this._values.ground)) ) {
                
                this._map[x][y] = this._values.ground;
            }
        }
    }

    this.fixBlockTiles(this._values.blockTop, this._values.blockBase);
    this.placeEntranceExitGrid();
    this.drawMap();
    
    if(!$dataMap.meta.skipshadows) {
        this.castShadows(this._values.blockTop, this._values.blockBase);
    }
    
    this.updateAllAutoTiles();
};

Game_Map.prototype.clearCacheGrid = function() {
    this._roomWidth;
    this._roomHeight;
    this._horzCount;
    this._vertCount;
    this._start;
    this._end;
    this._rooms;
};