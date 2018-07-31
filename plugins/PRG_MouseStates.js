/*: 
 * @plugindesc Turns on updating of MouseX and MouseY coordinates (so you can use 
 * TouchInput.x and TouchInput.y to check where the mouse is. 
 * @author Astra Cat 
 * @param Activate MouseX and Y Updating 
 * @desc Turn on updating of MouseX and MouseY (when no clicked)? 
 * @default true 
 * @help Simple input settings plugin. 
 */
/*: * @plugindesc Turns on updating of MouseX and MouseY coordinates (so you can use 
 * * TouchInput.x and TouchInput.y to check where the mouse is. 
 * * @author Astra Cat * @param Activate MouseX and Y Updating
 *  * @desc Turn on updating of MouseX and MouseY (when no clicked)?
 *   * @default true * @help Simple input settings plugin. */
var parameter = PluginManager.parameters('AstraCat_MouseXandY');
var EnableMouseCoords = String(parameters['Activate MouseX and Y Updating'] || 'true');
if (EnableMouseCoords == 'true') {    
	TouchInput._onMouseMove = function(event) {  
		//if (this._mousePressed) {            
		var x = Graphics.pageToCanvasX(event.pageX);      
		var y = Graphics.pageToCanvasY(event.pageY);      
		this._onMove(x, y);       
		//}    
		};}else if (EnableMouseCoords == 'false') {   
			TouchInput._onMouseMove = function(event) {    
				if (this._mousePressed) {     
					var x = Graphics.pageToCanvasX(event.pageX);  
					var y = Graphics.pageToCanvasY(event.pageY);    
					this._onMove(x, y);     
					}    
				};
				}
	}
	
	
	/*
}
var MouseStates = {};
(function() {
	TouchInput._onMove = function(x, y) {
	    this._events.moved = true;
	    this._x = x;
	    this._y = y;
	};
	TouchInput._onMouseMove = function(event) {        
		//if (this._mousePressed) {           
		var x = Graphics.pageToCanvasY(event.pageY);            
		var y = Graphics.pageToCanvasX(event.pageX);
		this._onMove(x, y);  
		//}    };
	}
})();
	*/