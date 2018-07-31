/*
#=============================================================================
# Lecode's Utilities
# LeUtilities.js
# By Lecode
# Version 1.2
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# - Credit required
# - Keep this header
# - Free for commercial use
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 1.0 : Initial release
# - 1.1 : stringAppendWithSym
#		: stringAppendWithComma
#		: stringSplit
#		: commandGetTextAsArg
# - 1.2 : getRandomValueInArray
#=============================================================================
*/
var Imported = Imported || {};
Imported.Lecode_Utilities = true;
/*:
 * @plugindesc Lecode's utilities plugin.
 * @author Lecode
 * @version 1.1
 *
 * @help
 * ( Nothing :B )
*/
//#=============================================================================

function LeUtilities() {
    throw new Error('This is a static class');
}

LeUtilities.findBattlerSprite = function(battler) {
	if( LeUtilities.isScene("Scene_Battle") ) {
		if( battler.isActor() ) {
			var sprites = LeUtilities.getScene()._spriteset._actorSprites;
		} else {
			var sprites = LeUtilities.getScene()._spriteset._enemySprites;
		}
		for(var i = 0; i < sprites.length; i++) {
			var sprite = sprites[i];
			if(sprite._battler === battler) return sprite;
		}
	} else {
		return null;
	}
};

LeUtilities.getScene = function() {
	return SceneManager._scene;
};

LeUtilities.isScene = function(str) {
	var scene = this.getScene();
	var bool = eval("scene instanceof "+str);
	return bool;
};

LeUtilities.stringAppendWithSym = function(str,toAppend,sym) {
	toAppend = String(toAppend);
	sym = String(sym);
	if(toAppend === "") return str;
	return (str === "") ? toAppend : str+sym+toAppend;
};

LeUtilities.stringAppendWithComma = function(str,toAppend) {
	return this.stringAppendWithSym(str,toAppend,",");
};

LeUtilities.stringSplit = function(str,sym) {
	str = String(str);
	if(str === "") {
		return [];
	} else if (!str.match(sym)) {
		return [str];
	} else {
		return str.split(sym);
	}
};

LeUtilities.CommandGetTextAsArg = function(args,start) {
    var text = "";
    for(var i = start; i < args.length; i++) {
        text += args[i];
        if(i != args.length-1) {
            text += " "; 
        }
    }
    return text;
};

LeUtilities.getRandomValueInArray = function(array) {
	var index = Math.floor((Math.random() * array.length));
	return array[index]; 
}

LeUtilities.removeInArray = function(array,element) {
	if(array.contains(element)) {
    	var index = array.indexOf(element);
    	array.splice(index,1);
	}
}

