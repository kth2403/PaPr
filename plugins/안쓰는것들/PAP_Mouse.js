
var Imported = Imported || {};
Imported.PAP_Mouse = true;

(function() {
	TouchInput._onLeftButtonDown = function(event) {
	    var x = Graphics.pageToCanvasX(event.pageX);
	    var y = Graphics.pageToCanvasY(event.pageY);
	    if (Graphics.isInsideCanvas(x, y)) {
	    	this._mousePressed = true;
	    	this._pressedTime = 0;
	    	this._onTrigger(x, y);
	    	alert("d");
	    }
	};
	TouchInput._onRightButtonDown = function(event) {
	    var x = Graphics.pageToCanvasX(event.pageX);
	    var y = Graphics.pageToCanvasY(event.pageY);
	    if (Graphics.isInsideCanvas(x, y)) {
	        alert("이태주 바보");
	    }
	};
	
};