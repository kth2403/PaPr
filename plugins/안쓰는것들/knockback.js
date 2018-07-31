var Imported = Imported || {};
Imported.knockback = true;

(function() {
	
	Game_PlayerBullet.executeDamage = function(character) {
		var radian = Game_Character.shotAngleFromDirection();
		alert('왜안댐?');
		Game_CharacterBase.prototype.jump(Math.cos(radian), Math.sin(radian));
	}
}