/*
#=============================================================================
# Side Effects Control
# LeSideEffectsControl.js
# By Lecode
# Version 1.0
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# - Credit required
# - Keep this header
# - Not free for commercial use - Contact me
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 0.0 : Bêta
# - 1.0 : Initial release
#		: Deep code reorganization
#		: News occasions: "after this skill invoked"
#						  "after this attack invoked"
#						  "after this item invoked"
#		: Occasions can be fusioned: <leffect: x,y,z>
#		: Effects can be read from an external file
#		: Effects are now preloaded, instant of being read in real time
#=============================================================================
*/
var Imported = Imported || {};
Imported.Lecode_SideEffectsControl = true;

var Lecode = Lecode || {};
Lecode.S_SideEffects = Lecode.S_SideEffects || {};
/*:
 * @plugindesc Adds complex effects to battles
 * @author Lecode
 * @version 1.0
 *
 * @help
 * Adds complex effects to battles
 *
*/
//#=============================================================================


Lecode.S_SideEffects.vars = {};
Lecode.S_SideEffects.fileData = JsonEx.parse(MVC.ajaxLoadFile("data/SideEffects.json")); 
/*========================================================
-----------		EFFECTS SETUP AND EVALUATION	----------
=========================================================*/

//-----------------------------------------------
//- Side Effect Object
//------------------------------------------------
Lecode.S_SideEffects.SideEffect = function() {
	this.occasion = "";
	this.code = "";
	this.obj = null;
	this.parentObj = null;
	this.conditions = [];
	this.priority = 0;
}

//-----------------------------------------------
//- Are effect's conditions valid ?
//------------------------------------------------
Lecode.S_SideEffects.SideEffect.prototype.areConditionsValid = function(func) {
	for(var i = 0; i < this.conditions.length; i++) {
		var str = this.conditions[i];
		if(!Lecode.S_SideEffects.evaluate(str,func))
			return false;
	}
	return true;
};




//-----------------------------------------------
//- isDatabaseLoaded
//------------------------------------------------
Lecode.S_SideEffects.oldDM_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    if (!Lecode.S_SideEffects.oldDM_isDatabaseLoaded.call(this)) return false;
    Lecode.S_SideEffects.readSideEffectsNotes();
    return true;
};

//-----------------------------------------------
//- Read notetags and create side effect objects
//------------------------------------------------
Lecode.S_SideEffects.readSideEffectsNotes = function() {
	var group = [$dataActors,$dataClasses,$dataSkills,
				$dataArmors,$dataWeapons,$dataItems,
				$dataEnemies,$dataStates];
	//- Identifiers when effects are read from the data file
	var groupID = ["actor_","class_","skill_",
				  "armor_","weapon_","item_",
				  "enemy_","state_"];
	//- Req to add when there is "this" in the occasion
	var reqStr = ["","","req: skillID == x",
				  "","req: weapon1ID == x || weapon2ID == x","req: itemID == x",
				  "",""];
	var reg = /<leffect:[ ]?(.+)[ ]?>[ ,\n]?((.|\n)*?)[ ,\n]?<\/leffect>/ig;
	var reg2 = /<ext-leffect:[ ]?(.+)[ ]?>/ig;
	var reg3 = /req[ ]?:[ ]?(.+)/ig;
	for(var i = 0; i < group.length; i++) {
		var data = group[i];
		for(var j = 1; j < data.length; j++) {
			var obj = data[j];
			obj.leSideEffects = [];
			var note = obj.note;
			var results, effect, subResults;
			//- For each <leffect:...> detected
			while(results = reg.exec(note)) {
				var occs = String(results[1]);
				var code = String(results[2]);
				// - For each occasion
				LeUtilities.stringSplit(occs,",").forEach(function(occ){
					if(occ.contains("this")) {
						occ = occ.replace("this ","");
						code = "\n"+reqStr[i].replace("x",String(obj.id))+"\n"+code;
					}
					effect = new Lecode.S_SideEffects.SideEffect();
					effect.occasion = occ;
					effect.code = code;
					effect.obj = obj;
					while(subResults = reg3.exec(effect.code)){
						effect.conditions.push(String(subResults[1]));
					}
					effect.code = effect.code.replace(/req[ ]?:(.+)/ig,"");
					obj.leSideEffects.push(effect);
				});
			}
			//- For each <ext-leffect:...> detected
			while(results = reg2.exec(note)) {
				var id = groupID[i] + String(obj.id);
				if(!Lecode.S_SideEffects.fileData[id]) {
					throw new Error("[SideEffectsControl] Data for "+id+" isn't available !!");
				}
				var dataArray = Lecode.S_SideEffects.fileData[id];
				var occs = String(results[1]);
				LeUtilities.stringSplit(occs,",").forEach(function(occ){
					for(var k = 0; k < dataArray.length; k++) {
						if(dataArray[k] == occ) {
							var code = dataArray[k+1].join("\n");
							if(occ.contains("this")) {
								occ = occ.replace("this ","");
								code = "\n"+reqStr[i].replace("x",String(obj.id))+"\n"+code;
							}
							effect = new Lecode.S_SideEffects.SideEffect();
							effect.occasion = occ;
							effect.code = code;
							effect.obj = obj;
							while(subResults = reg3.exec(effect.code)){
								effect.conditions.push(String(subResults[1]));
							}
							effect.code = effect.code.replace(/req[ ]?:(.+)/ig,"");
							obj.leSideEffects.push(effect);
						}
					}
				});
				
			}
			Lecode.S_SideEffects.printEffect(obj);
		}
	}
};

//-----------------------------------------------
//- For debug
//------------------------------------------------
Lecode.S_SideEffects.printEffect = function(obj) {
	/*console.log("--Obj: ",obj);
	console.log("Side Effects: ",obj.leSideEffects);*/
};




//-----------------------------------------------
//- Execute a side effect
//------------------------------------------------
Lecode.S_SideEffects.executeEffect = function(func,obj,str) {
	if( obj == undefined || obj == null) return;

	var effects;
	if(obj instanceof Game_Actor) {
		effects = Lecode.S_SideEffects.getSideEffects(obj.actor(),str);
		effects = effects.concat(Lecode.S_SideEffects.getSideEffects(obj.currentClass(),str));
		obj.skills().forEach(function(skill){
			effects = effects.concat(Lecode.S_SideEffects.getSideEffects(skill,str));
		});
		obj.equips().forEach(function(equip){
			effects = effects.concat(Lecode.S_SideEffects.getSideEffects(equip,str));
		});
	} else if(obj instanceof Game_Enemy)
		effects = Lecode.S_SideEffects.getSideEffects(obj.enemy(),str);
	if(obj instanceof Game_Battler){
		obj.states().forEach(function(state){
			effects = effects.concat(Lecode.S_SideEffects.getSideEffects(state,str));
		});
	}
	if(effects.length == 0) return;

	effects = effects.sort(function(a,b){
		return (a.priority - b.priority).clamp(-1,1);
	});

	for(var i = 0; i < effects.length; i++) {
		var effect = effects[i];
		if(effect.areConditionsValid(func))
			Lecode.S_SideEffects.evaluate(effect.code,func);
	}
};

//-----------------------------------------------
//- Evalue a string according to a given informations
//------------------------------------------------
Lecode.S_SideEffects.evaluate = function(str,func) {
	var hpDmgWpopup = Lecode.S_SideEffects.hpDmgWpopup;
	var mpDmgWpopup = Lecode.S_SideEffects.mpDmgWpopup;
	var anim = Lecode.S_SideEffects.anim;
	var castSkill = Lecode.S_SideEffects.castSkill;
	var castAtk = Lecode.S_SideEffects.castAtk;
	var silentCastSkill = Lecode.S_SideEffects.silentCastSkill;
	var silentCastSAtk = Lecode.S_SideEffects.silentCastAtk;
	var logW = Lecode.S_SideEffects.logW;
	var logNewText = Lecode.S_SideEffects.logNewText;
	var setVar = Lecode.S_SideEffects.setVar;
	var changeVar = Lecode.S_SideEffects.changeVar;
	var getVar = Lecode.S_SideEffects.getVar;
	var chance = Lecode.S_SideEffects.chance;
	var getActor = Lecode.S_SideEffects.getActor;
	var getRandomActor = Lecode.S_SideEffects.getRandomActor;
	var getEnemy = Lecode.S_SideEffects.getEnemy;
	var getRandomEnemy = Lecode.S_SideEffects.getRandomEnemy;
	var getAllies = Lecode.S_SideEffects.getAllies;
	var getEnemies = Lecode.S_SideEffects.getEnemies;
	var getWeakestAlly = Lecode.S_SideEffects.getWeakestAlly;
	var getWeakestEnemy = Lecode.S_SideEffects.getWeakestEnemy;
	var getStrongestAlly = Lecode.S_SideEffects.getStrongestAlly;
	var getStrongestEnemy = Lecode.S_SideEffects.getStrongestEnemy;

	var a = func.a;
	var b = func.b;
	var ally = func.ally;
	var enemy = func.enemy;
	var action = func.action;
	var result = func.result;
	var value = func.value;
	var effectCode = func.effectCode;
	if(action){
		var toHp = action.isHpEffect();
		var toMp = action.isMpEffect();
		var isDrain = action.isDrain();
		var obj = action.item();
		if(action.isSkill()) {
			var skill = action.item();
			var skillID = action.item().id;
		}
		if(action.isItem()) {
			var item = action.item();
			var itemID = action.item().id;
		}
	}
	var stateID = func.stateID;

	var ___Owner = null;
	if( str.contains("by ally"))
		___Owner = ally;
	else if(str.contains("by enemy"));
	else if(str.contains("on ally") || str.contains("on enemy"))
		___Owner = b;
	else
		___Owner = a;
	var weapon1 = (___Owner && ___Owner.isActor()) ? ___Owner.weapons()[0] : null;
	var weapon2 = (___Owner && ___Owner.isActor()) ? ___Owner.weapons()[0] : null;
	var weapon1ID = (___Owner && ___Owner.isActor()) ? weapon1.id : null;
	var weapon2ID = (___Owner && ___Owner.isActor()) ? weapon2.id : null;

	var ____Evalresult = eval(str);
	func.value = value;
	return ____Evalresult;
};

//-----------------------------------------------
//- Get effects of the same occasion
//------------------------------------------------
Lecode.S_SideEffects.getSideEffects = function(obj,occ) {
	if(obj == null || obj == undefined) return [];
	if(obj.leSideEffects == null || obj.leSideEffects == undefined) return [];
	var effects = [];
	for(var i = 0; i < obj.leSideEffects.length; i++)
		if(obj.leSideEffects[i].occasion == occ)
			effects.push(obj.leSideEffects[i]);
	return effects;
};




/*=========================================
-----------		KEY FUNCTIONS	-----------
===========================================*/

//-----------------------------------------------
//- HP damage with popup
//------------------------------------------------
Lecode.S_SideEffects.hpDmgWpopup = function(battler,value) {
	if(!LeUtilities.isScene("Scene_Battle")) return;
	if(battler.isDead()) return;
    var result = new Game_ActionResult();
    value = Math.floor(value);
    result.used = true;
    result.hpAffected = true;
    result.hpDamage = value;
    battler._damagePopup.push(result);
    battler.setHp(battler.hp - value);
};

//-----------------------------------------------
//- MP damage with popup
//------------------------------------------------
Lecode.S_SideEffects.mpDmgWpopup = function(battler,value) {
	if(!LeUtilities.isScene("Scene_Battle")) return;
	if(battler.isDead()) return;
    var result = new Game_ActionResult();
    value = Math.floor(value);
    result.used = true;
    result.mpAffected = true;
    result.mpDamage = value;
    battler._damagePopup.push(result);
    battler.setMp(battler.mp - value);
};

//-----------------------------------------------
//- Play an animation
//------------------------------------------------
Lecode.S_SideEffects.anim = function(targets,animId,mirror) {
	if(!LeUtilities.isScene("Scene_Battle")) return;
	if(!(targets instanceof Array)) {
		targets = [targets];
	}
	BattleManager._logWindow.showNormalAnimation(targets, animId, mirror || false);
};

//-----------------------------------------------
//- Force the battler to cast a skill
//------------------------------------------------
Lecode.S_SideEffects.castSkill = function(battler,target,id) {
	if(!LeUtilities.isScene("Scene_Battle")) return;
	if(battler.isDead() || target.isDead()) return;
	var info = {};
	var actions = battler._actions;
	battler.forceAction(id,target.index());
	var action = battler.currentAction();
	info.battler = battler;
	info.action = action;
	BattleManager.leStackForceAction(info);
	battler._actions = actions;
	var bmSubject = BattleManager._subject;
	var actionState = battler._actionState;
	battler._leSEafterActions = [actions,bmSubject,actionState];
};

//-----------------------------------------------
//- Force the battler to attack
//------------------------------------------------
Lecode.S_SideEffects.castAtk = function(battler,target) {
	if(!LeUtilities.isScene("Scene_Battle")) return;
	if(battler.isDead() || target.isDead()) return;
	var info = {};
	var actions = battler._actions;
	battler.forceAction(1,target.index());
	battler.currentAction().setAttack();
	var action = battler.currentAction();
	info.battler = battler;
	info.action = action;
	BattleManager.leStackForceAction(info);
	battler._actions = actions;
	var bmSubject = BattleManager._subject;
	var actionState = battler._actionState;
	//if(!battler._leSEafterActions)
	battler._leSEafterActions = [actions,bmSubject,actionState];
};

//-----------------------------------------------
//- Cast skill but without moves
//------------------------------------------------
Lecode.S_SideEffects.silentCastSkill = function(battler,target,id,dmgPopup) {
	if(!LeUtilities.isScene("Scene_Battle")) return;
	if(battler.isDead() || target.isDead()) return;
	var actions = battler._actions;
	battler.forceAction(id,target.index());
	var action = battler.currentAction();
	action.apply(target);
	if(dmgPopup)
		target.startDamagePopup();
	battler._actions = actions;
};

//-----------------------------------------------
//- Attack but without moves
//------------------------------------------------
Lecode.S_SideEffects.silentCastAtk = function(battler,target,dmgPopup) {
	if(!LeUtilities.isScene("Scene_Battle")) return;
	if(battler.isDead() || target.isDead()) return;
	var actions = battler._actions;
	battler.forceAction(1,target.index());
	battler.currentAction().setAttack();
	var action = battler.currentAction();
	action.apply(target);
	if(dmgPopup)
		target.startDamagePopup();
	battler._actions = actions;
};

//-----------------------------------------------
//- Return the log window
//------------------------------------------------
Lecode.S_SideEffects.logW = function() {
	if(!LeUtilities.isScene("Scene_Battle")) return null;
	return BattleManager._logWindow;
};

//-----------------------------------------------
//- Pop a text at the log window
//------------------------------------------------
Lecode.S_SideEffects.logNewText = function(str,icon) {
	if(!Lecode.S_SideEffects.logW()) return;
	if(icon)
		Lecode.S_SideEffects.logW()._actionIcon = icon;
	Lecode.S_SideEffects.logW().push('addText','<SIMPLE>' + str);
};

//-----------------------------------------------
//- Set a variable's value
//------------------------------------------------
Lecode.S_SideEffects.setVar = function(id,val,obj) {
	if(obj) {
		obj._le_SE_vArs = obj._le_SE_vArs || {};
		obj._le_SE_vArs[id] = val;
	} else
		Lecode.S_SideEffects.vars[id] = val;
};

//-----------------------------------------------
//- Get a variable's value
//-----------------------------------------------
Lecode.S_SideEffects.getVar = function(id,obj) {
	if(obj) {
		obj._le_SE_vArs = obj._le_SE_vArs || {};
		return obj._le_SE_vArs[id];
	} else
		return Lecode.S_SideEffects.vars[id];
};

//-----------------------------------------------
//- Change a variable's value
//-----------------------------------------------
Lecode.S_SideEffects.changeVar = function(id,val,obj) {
	if(obj) {
		obj._le_SE_vArs = obj._le_SE_vArs || {};
		obj._le_SE_vArs[id] += val;
	} else
		Lecode.S_SideEffects.vars[id] += val;
};

//-----------------------------------------------
//- if nbr% ?
//-----------------------------------------------
Lecode.S_SideEffects.chance = function(nbr) {
	return Math.random() <= nbr*0.01;
};

//-----------------------------------------------
//- Look for a battler following a property
//-----------------------------------------------
Lecode.S_SideEffects.searchBattlerInPt = function(pt,type,arg) {
	for(var i = 0; i < pt.length; i++) {
		var battler = pt[i];
		if(eval("battler."+type+" == arg")) {
			return battler;
		}
	}
};

//-----------------------------------------------
//- Get an actor following his name or index
//-----------------------------------------------
Lecode.S_SideEffects.getActor = function(arg) {
	if(typeof(arg) === "string") {
		return Lecode.S_SideEffects.searchBattlerInPt($gameParty.battleMembers(),"name",arg);
	} else if(typeof(arg) === "number") {
		return Lecode.S_SideEffects.searchBattlerInPt($gameParty.battleMembers(),"index()",arg);
	}
};

//-----------------------------------------------
//- Get a random actor
//-----------------------------------------------
Lecode.S_SideEffects.getRandomActor = function() {
	var pt = $gameParty.battleMembers();
	return LeUtilities.getRandomValueInArray(pt);
};

//-----------------------------------------------
//- Get an enemy following his name or index
//-----------------------------------------------
Lecode.S_SideEffects.getEnemy = function(arg) {
	if(typeof(arg) === "string") {
		return Lecode.S_SideEffects.searchBattlerInPt($gameTroop.members(),"name",arg);
	} else if(typeof(arg) === "number") {
		return Lecode.S_SideEffects.searchBattlerInPt($gameTroop.members(),"index()",arg);
	}
};

//-----------------------------------------------
//- Get a random enemy
//-----------------------------------------------
Lecode.S_SideEffects.getRandomEnemy = function() {
	var pt = $gameTroop.members();
	return LeUtilities.getRandomValueInArray(pt);
};

//-----------------------------------------------
//- Get allies of the battler
//-----------------------------------------------
Lecode.S_SideEffects.getAllies = function(battler) {
	var pt = [];
	var unit = battler.friendsUnit().members();
	for(var i = 0; i < unit.length; i++) {
		var ally = unit[i];
		if(!(ally === battler)) pt.push(ally);
	}
	return pt;
};

//-----------------------------------------------
//- Get enemies of the battler
//-----------------------------------------------
Lecode.S_SideEffects.getEnemies = function(battler) {
	return battler.opponentsUnit().members();
};

//-----------------------------------------------------------
//- Get the weakest battler in a party following a parameter
//------------------------------------------------------------
Lecode.S_SideEffects.getWeakestBattler = function(param,pt) {
	pt = pt.filter(function(member) {
        return !member.isDead();
    });
	return pt.sort(function(a,b){
		var a_param = eval("a."+param);
		var b_param = eval("b."+param);
		return (a_param > b_param) ? 1 : ( (a_param < b_param) ? -1 : 0 );
	});
};

//-----------------------------------------------------------
//- Get the weakest ally of the battler following a parameter
//------------------------------------------------------------
Lecode.S_SideEffects.getWeakestAlly = function(param,battler) {
	return Lecode.S_SideEffects.getWeakestBattler(param,battler.friendsUnit().members())[0];
};

//-----------------------------------------------------------
//- Get the weakest enemy of the battler following a parameter
//------------------------------------------------------------
Lecode.S_SideEffects.getWeakestEnemy = function(param,battler) {
	return Lecode.S_SideEffects.getWeakestBattler(param,battler.opponentsUnit().members())[0];
};

//-----------------------------------------------------------
//- Get the strongest ally of the battler following a parameter
//------------------------------------------------------------
Lecode.S_SideEffects.getStrongestAlly = function(param,battler) {
	return Lecode.S_SideEffects.getWeakestBattler(param,battler.friendsUnit().members()).last;
};

//-----------------------------------------------------------
//- Get the strongest enemy of the battler following a parameter
//------------------------------------------------------------
Lecode.S_SideEffects.getStrongestEnemy = function(param,battler) {
	return Lecode.S_SideEffects.getWeakestEnemy(param,battler.opponentsUnit().members()).last;
};


/*==================================================
-----------		EFFECTS PRE-PROCESSING	-----------
===================================================*/

//-----------------------------------------------------------
//- When Battle Starts/Ends
//------------------------------------------------------------
Lecode.S_SideEffects.processWhenBattleTime = function(info,occ,time) {
	Lecode.S_SideEffects.user_BattleTime(info,occ,time);
	Lecode.S_SideEffects.SayToAllies_BattleTime(info,occ,time);
	Lecode.S_SideEffects.SayToEnemies_BattleTime(info,occ,time);
};

Lecode.S_SideEffects.user_BattleTime = function(info,occ,time) {
	this.a = info.user;
	var str = occ + " user battle " + time;
	Lecode.S_SideEffects.executeEffect(this,this.a,str);
};

Lecode.S_SideEffects.SayToAllies_BattleTime = function(info,occ,time) {
	//- Tell to user's allies that he started/ended his battle
	//- The user become the ally and each ally, the user
	var party = Lecode.S_SideEffects.getAllies(info.user);
	this.ally = info.user;
	for(var i = 0; i < party.length; i++){
		var ally = party[i];
		this.a = ally;
		var str = occ + " ally battle " + time;
		Lecode.S_SideEffects.executeEffect(this,this.a,str);
	}
};

Lecode.S_SideEffects.SayToEnemies_BattleTime = function(info,occ,time) {
	//info = MVC.deepClone(info);
	var party = Lecode.S_SideEffects.getEnemies(info.user);
	this.enemy = info.user;
	for(var i = 0; i < party.length; i++){
		var enemy = party[i];
		this.a = enemy;
		var str = occ + " enemy battle " + time;
		Lecode.S_SideEffects.executeEffect(this,this.a,str);
	}
};

//-----------------------------------------------------------
//- When Turn Starts/Ends
//------------------------------------------------------------
Lecode.S_SideEffects.processWhenTurnTime = function(info,occ,time) {
	Lecode.S_SideEffects.user_TurnTime(info,occ,time);
	Lecode.S_SideEffects.SayToAllies_TurnTime(info,occ,time);
	Lecode.S_SideEffects.SayToEnemies_TurnTime(info,occ,time);
};

Lecode.S_SideEffects.user_TurnTime = function(info,occ,time) {
	this.a = info.user;
	var str = occ + " user turn " + time;
	Lecode.S_SideEffects.executeEffect(this,this.a,str);
};

Lecode.S_SideEffects.SayToAllies_TurnTime = function(info,occ,time) {
	var party = Lecode.S_SideEffects.getAllies(info.user);
	this.ally = info.user;
	for(var i = 0; i < party.length; i++){
		var ally = party[i];
		this.a = ally;
		var str = occ + " ally turn " + time;
		Lecode.S_SideEffects.executeEffect(this,this.a,str);
	}
};

Lecode.S_SideEffects.SayToEnemies_TurnTime = function(info,occ,time) {
	var party = Lecode.S_SideEffects.getEnemies(info.user);
	this.enemy = info.user;
	for(var i = 0; i < party.length; i++){
		var enemy = party[i];
		this.a = enemy;
		var str = occ + " enemy turn " + time;
		Lecode.S_SideEffects.executeEffect(this,this.a,str);
	}
};

//-----------------------------------------------------------
//- When Action Starts/Ends
//------------------------------------------------------------
Lecode.S_SideEffects.processWhenActionTime = function(info,occ,time) {
	Lecode.S_SideEffects.user_ActionTime(info,occ,time);
	Lecode.S_SideEffects.SayToAllies_ActionTime(info,occ,time);
	Lecode.S_SideEffects.SayToEnemies_ActionTime(info,occ,time);
};

Lecode.S_SideEffects.user_ActionTime = function(info,occ,time) {
	this.a = info.user;
	this.action = info.action;
	var str = occ + " user action " + time;
	Lecode.S_SideEffects.executeEffect(this,this.a,str);
};

Lecode.S_SideEffects.SayToAllies_ActionTime = function(info,occ,time) {
	var party = Lecode.S_SideEffects.getAllies(info.user);
	this.ally = info.user;
	this.action = info.action;
	for(var i = 0; i < party.length; i++){
		var ally = party[i];
		this.a = ally;
		var str = occ + " ally action " + time;
		Lecode.S_SideEffects.executeEffect(this,this.a,str);
	}
};

Lecode.S_SideEffects.SayToEnemies_ActionTime = function(info,occ,time) {
	var party = Lecode.S_SideEffects.getEnemies(info.user);
	this.enemy = info.user;
	this.action = info.action;
	for(var i = 0; i < party.length; i++){
		var enemy = party[i];
		this.a = enemy;
		var str = occ + " enemy action " + time;
		Lecode.S_SideEffects.executeEffect(this,this.a,str);
	}
};


//-----------------------------------------------------------
//- When Attack/Skill/Item/Any Obj invoked
//------------------------------------------------------------
Lecode.S_SideEffects.processWhenObjInvoked = function(info,type,occ) {
	Lecode.S_SideEffects.ObjInvoked_byUser(info,occ,type);
	Lecode.S_SideEffects.ObjInvoked_onTarget(info,occ,type);
	Lecode.S_SideEffects.sayToUserAllies_ObjInvoked(info,occ,type);
	Lecode.S_SideEffects.sayToUserEnemies_ObjInvoked(info,occ,type);
	Lecode.S_SideEffects.sayToTargetAllies_ObjInvoked(info,occ,type);
	Lecode.S_SideEffects.sayToTargetEnemies_ObjInvoked(info,occ,type);
};

Lecode.S_SideEffects.ObjInvoked_byUser = function(info,occ,type) {
	this.a = info.user;
	this.b = info.target;
	this.action = info.action;
	this.result = info.result;
	var str = occ + " " + type + " invoked";
	Lecode.S_SideEffects.executeEffect(this,this.a,str);
};

Lecode.S_SideEffects.ObjInvoked_onTarget = function(info,occ,type) {
	this.a = info.target;
	this.b = info.user;
	this.action = info.action;
	this.result = info.result;
	var str = occ + " " + type + " invoked on me";
	Lecode.S_SideEffects.executeEffect(this,this.a,str);
};

Lecode.S_SideEffects.sayToUserAllies_ObjInvoked = function(info,occ,type) {
	var party = Lecode.S_SideEffects.getAllies(info.user);
	this.ally = info.user;
	this.b = info.target;
	this.action = info.action;
	this.result = info.result;
	for(var i = 0; i < party.length; i++){
		var ally = party[i];
		this.a = ally;
		var str = occ + " " + type + " invoked by ally";
		Lecode.S_SideEffects.executeEffect(this,this.a,str);
	}
};

Lecode.S_SideEffects.sayToUserEnemies_ObjInvoked = function(info,occ,type) {
	var party = Lecode.S_SideEffects.getEnemies(info.user);
	this.enemy = info.user;
	this.b = info.target;
	this.action = info.action;
	this.result = info.result;
	for(var i = 0; i < party.length; i++){
		var enemy = party[i];
		this.a = enemy;
		var str = occ + " " + type + " invoked by enemy";
		Lecode.S_SideEffects.executeEffect(this,this.a,str);
	}
};

Lecode.S_SideEffects.sayToTargetAllies_ObjInvoked = function(info,occ,type) {
	var party = Lecode.S_SideEffects.getAllies(info.target);
	this.ally = info.target;
	this.b = info.user;
	this.action = info.action;
	this.result = info.result;
	for(var i = 0; i < party.length; i++){
		var ally = party[i];
		this.a = ally;
		var str = occ + " " + type + " invoked on ally";
		Lecode.S_SideEffects.executeEffect(this,this.a,str);
	}
};

Lecode.S_SideEffects.sayToTargetEnemies_ObjInvoked = function(info,occ,type) {
	var party = Lecode.S_SideEffects.getEnemies(info.target);
	this.enemy = info.target;
	this.b = info.user;
	this.action = info.action;
	this.result = info.result;
	for(var i = 0; i < party.length; i++){
		var enemy = party[i];
		this.a = enemy;
		var str = occ + " " + type + " invoked on enemy";
		Lecode.S_SideEffects.executeEffect(this,this.a,str);
	}
};

//-----------------------------------------------------------
//- When Attack/Skill/Item/Any Obj damage
//------------------------------------------------------------
Lecode.S_SideEffects.processWhenObjDamage = function(info,type,occ) {
	Lecode.S_SideEffects.ObjDamage_byUser(info,occ,type);
	Lecode.S_SideEffects.ObjDamage_onTarget(info,occ,type);
	Lecode.S_SideEffects.sayToUserAllies_ObjDamage(info,occ,type);
	Lecode.S_SideEffects.sayToUserEnemies_ObjDamage(info,occ,type);
	Lecode.S_SideEffects.sayToTargetAllies_ObjDamage(info,occ,type);
	Lecode.S_SideEffects.sayToTargetEnemies_ObjDamage(info,occ,type);
	return info.value;
};

Lecode.S_SideEffects.ObjDamage_byUser = function(info,occ,type) {
	this.a = info.user;
	this.b = info.target;
	this.action = info.action;
	this.result = info.result;
	this.value = info.value;
	var str = occ + " " + type + " dmg applied";
	Lecode.S_SideEffects.executeEffect(this,this.a,str);
	info.value = this.value;
};

Lecode.S_SideEffects.ObjDamage_onTarget = function(info,occ,type) {
	this.a = info.target;
	this.b = info.user;
	this.action = info.action;
	this.result = info.result;
	this.value = info.value;
	var str = occ + " " + type + " dmg received";
	Lecode.S_SideEffects.executeEffect(this,this.a,str);
	info.value = this.value;
};

Lecode.S_SideEffects.sayToUserAllies_ObjDamage = function(info,occ,type) {
	var party = Lecode.S_SideEffects.getAllies(info.user);
	this.ally = info.user;
	this.b = info.target;
	this.action = info.action;
	this.result = info.result;
	this.value = info.value;
	for(var i = 0; i < party.length; i++){
		var ally = party[i];
		this.a = ally;
		var str = occ + " " + type + " dmg applied by ally";
		Lecode.S_SideEffects.executeEffect(this,this.a,str);
		info.value = this.value;
	}
};

Lecode.S_SideEffects.sayToUserEnemies_ObjDamage = function(info,occ,type) {
	var party = Lecode.S_SideEffects.getEnemies(info.user);
	this.enemy = info.user;
	this.b = info.target;
	this.action = info.action;
	this.result = info.result;
	this.value = info.value;
	for(var i = 0; i < party.length; i++){
		var enemy = party[i];
		this.a = enemy;
		var str = occ + " " + type + " dmg applied by enemy";
		Lecode.S_SideEffects.executeEffect(this,this.a,str);
		info.value = this.value;
	}
};

Lecode.S_SideEffects.sayToTargetAllies_ObjDamage = function(info,occ,type) {
	var party = Lecode.S_SideEffects.getAllies(info.target);
	this.ally = info.target;
	this.b = info.user;
	this.action = info.action;
	this.result = info.result;
	this.value = info.value;
	for(var i = 0; i < party.length; i++){
		var ally = party[i];
		this.a = ally;
		var str = occ + " " + type + " dmg received on ally";
		Lecode.S_SideEffects.executeEffect(this,this.a,str);
		info.value = this.value;
	}
};

Lecode.S_SideEffects.sayToTargetEnemies_ObjDamage = function(info,occ,type) {
	var party = Lecode.S_SideEffects.getEnemies(info.target);
	this.enemy = info.target;
	this.b = info.user;
	this.action = info.action;
	this.result = info.result;
	this.value = info.value;
	for(var i = 0; i < party.length; i++){
		var enemy = party[i];
		this.a = enemy;
		var str = occ + " " + type + " dmg received on enemy";
		Lecode.S_SideEffects.executeEffect(this,this.a,str);
		info.value = this.value;
	}
};

//-----------------------------------------------------------
//- When State Added/Removed
//------------------------------------------------------------
Lecode.S_SideEffects.processWhenStateSomething = function(info,occ,type) {
	Lecode.S_SideEffects.user_StateSomething(info,occ,type);
	Lecode.S_SideEffects.SayToAllies_StateSomething(info,occ,type);
	Lecode.S_SideEffects.SayToEnemies_StateSomething(info,occ,type);
};

Lecode.S_SideEffects.user_StateSomething = function(info,occ,type) {
	this.a = info.user;
	this.stateID = info.stateID;
	var str = occ + " user state " + type;
	Lecode.S_SideEffects.executeEffect(this,this.a,str);
};

Lecode.S_SideEffects.SayToAllies_StateSomething = function(info,occ,type) {
	var party = Lecode.S_SideEffects.getAllies(info.user);
	this.ally = info.user;
	this.stateID = info.stateID;
	for(var i = 0; i < party.length; i++){
		var ally = party[i];
		this.a = ally;
		var str = occ + " ally state " + type;
		Lecode.S_SideEffects.executeEffect(this,this.a,str);
	}
};

Lecode.S_SideEffects.SayToEnemies_StateSomething = function(info,occ,type) {
	var party = Lecode.S_SideEffects.getEnemies(info.user);
	this.enemy = info.user;
	this.stateID = info.stateID;
	for(var i = 0; i < party.length; i++){
		var enemy = party[i];
		this.a = enemy;
		var str = occ + " enemy state " + type;
		Lecode.S_SideEffects.executeEffect(this,this.a,str);
	}
};

/*=============================================
-----------	 EFFECTS CALLING	---------------
===============================================*/


//-----------------------------------------------------------
//- Call "when battle start" effects
//------------------------------------------------------------
Lecode.S_SideEffects.oldGB_onBattleStart = Game_Battler.prototype.onBattleStart;
Game_Battler.prototype.onBattleStart = function() {
    var info = {
    	user: this
    }
    Lecode.S_SideEffects.processWhenBattleTime(info,"before","start"); // <-
	Lecode.S_SideEffects.oldGB_onBattleStart.call(this);
    Lecode.S_SideEffects.processWhenBattleTime(info,"after","start"); // <-
};

//-----------------------------------------------------------
//- Call "when battle end" effects
//------------------------------------------------------------
Lecode.S_SideEffects.oldGB_onBattleEnd = Game_Battler.prototype.onBattleEnd;
Game_Battler.prototype.onBattleEnd = function() {
    var info = {
    	user: this
    }
    Lecode.S_SideEffects.processWhenBattleTime(info,"before","end"); // <-
	Lecode.S_SideEffects.oldGB_onBattleStart.call(this);
    Lecode.S_SideEffects.processWhenBattleTime(info,"after","end"); // <-
};

//-----------------------------------------------------------
//- Call "when turn start" effects
//-----------------------------------------------------------
Lecode.S_SideEffects.oldBM_processTurn = BattleManager.processTurn;
BattleManager.processTurn = function() {
    var info = {
    	user: this._subject
    }
    if (this._subject.currentAction()) {
		Lecode.S_SideEffects.processWhenTurnTime(info,"before","start");
    	Lecode.S_SideEffects.oldBM_processTurn.call(this);
		Lecode.S_SideEffects.processWhenTurnTime(info,"after","start");
	} else {
    	Lecode.S_SideEffects.oldBM_processTurn.call(this);
	}
};

//-----------------------------------------------------------
//- Call "when turn end" effects
//-----------------------------------------------------------
Lecode.S_SideEffects.oldGB_onTurnEnd = Game_Battler.prototype.onTurnEnd;
Game_Battler.prototype.onTurnEnd = function() {
    var info = {
    	user: this
    }
	Lecode.S_SideEffects.processWhenTurnTime(info,"before","end");
    Lecode.S_SideEffects.oldGB_onTurnEnd.call(this);
	Lecode.S_SideEffects.processWhenTurnTime(info,"after","end");
};

//-----------------------------------------------------------
//- Call "when action start" effects
//------------------------------------------------------------
Lecode.S_SideEffects.oldGA_startAction = BattleManager.startAction;
BattleManager.startAction = function() {
    var info = {
    	user: this._subject,
    	action: this._subject.currentAction()
    }
	Lecode.S_SideEffects.processWhenActionTime(info,"before","start");
	Lecode.S_SideEffects.oldGA_startAction.call(this);
	Lecode.S_SideEffects.processWhenActionTime(info,"after","start");
};

//-----------------------------------------------------------
//- Call "when action end" effects
//------------------------------------------------------------
Lecode.S_SideEffects.oldGA_endAction = BattleManager.endAction;
BattleManager.endAction = function() {
    var info = {
    	user: this._subject,
    	action: this._subject.currentAction()
    }
	Lecode.S_SideEffects.processWhenActionTime(info,"before","end");
	Lecode.S_SideEffects.oldGA_endAction.call(this);
	Lecode.S_SideEffects.processWhenActionTime(info,"after","end");
};

//-----------------------------------------------------------
//- Call "when obj invoked" effects
//-----------------------------------------------------------
Lecode.S_SideEffects.oldBM_invokeNormalAction = BattleManager.invokeNormalAction;
BattleManager.invokeNormalAction = function(subject, target) {
    var info = {
    	user: subject,
    	target: target,
    	action: this._action
    }
    var action = info.action;
	if(action.isSkill()) {
		if(action.isAttack()) {
			Lecode.S_SideEffects.processWhenObjInvoked(info,"attack","before");
			Lecode.S_SideEffects.processWhenObjInvoked(info,"any obj","before");
			Lecode.S_SideEffects.oldBM_invokeNormalAction.call(this,subject,target);
			info.result = target.result();
			Lecode.S_SideEffects.processWhenObjInvoked(info,"attack","after");
			Lecode.S_SideEffects.processWhenObjInvoked(info,"any obj","after");
		} else if (action.isGuard()) {
			Lecode.S_SideEffects.processWhenObjInvoked(info,"guard","before");
			Lecode.S_SideEffects.processWhenObjInvoked(info,"any obj","before");
			Lecode.S_SideEffects.oldBM_invokeNormalAction.call(this,subject,target);
			info.result = target.result();
			Lecode.S_SideEffects.processWhenObjInvoked(info,"guard","after");
			Lecode.S_SideEffects.processWhenObjInvoked(info,"any obj","after");
		} else {
			Lecode.S_SideEffects.processWhenObjInvoked(info,"skill","before");
			Lecode.S_SideEffects.processWhenObjInvoked(info,"any obj","before");
			Lecode.S_SideEffects.oldBM_invokeNormalAction.call(this,subject,target);
			info.result = target.result();
			Lecode.S_SideEffects.processWhenObjInvoked(info,"skill","after");
			Lecode.S_SideEffects.processWhenObjInvoked(info,"any obj","after");
		}
	} else if (action.isItem()) {
		Lecode.S_SideEffects.processWhenObjInvoked(info,"item","before");
		Lecode.S_SideEffects.processWhenObjInvoked(info,"any obj","before");
		Lecode.S_SideEffects.oldBM_invokeNormalAction.call(this,subject,target);
		info.result = target.result();
		Lecode.S_SideEffects.processWhenObjInvoked(info,"item","after");
		Lecode.S_SideEffects.processWhenObjInvoked(info,"any obj","after");
	} else {
		Lecode.S_SideEffects.processWhenObjInvoked(info,"any obj","before");
		Lecode.S_SideEffects.oldBM_invokeNormalAction.call(this,subject,target);
		info.result = target.result();
		Lecode.S_SideEffects.processWhenObjInvoked(info,"any obj","after");
	}
};


//-----------------------------------------------------------
//- Call "when obj damage" effects
//-----------------------------------------------------------
Lecode.S_SideEffects.oldGA_executeDamage = Game_Action.prototype.executeDamage;
Game_Action.prototype.executeDamage = function(target, value) {
    var info = {
    	user: this.subject(),
    	target: target,
    	value: value,
    	action: this,
    	result: target.result()
    }
    if(this.isSkill()) {
    	if(this.isAttack()) {
    		value = Lecode.S_SideEffects.processWhenObjDamage(info,"attack","before");
    		value = Lecode.S_SideEffects.processWhenObjDamage(info,"any","before");
    		Lecode.S_SideEffects.oldGA_executeDamage.call(this,target,value);
    		value = Lecode.S_SideEffects.processWhenObjDamage(info,"attack","after");
    		value = Lecode.S_SideEffects.processWhenObjDamage(info,"any","after");
    	} else {
    		value = Lecode.S_SideEffects.processWhenObjDamage(info,"skill","before");
    		value = Lecode.S_SideEffects.processWhenObjDamage(info,"any","before");
    		Lecode.S_SideEffects.oldGA_executeDamage.call(this,target,value);
    		value = Lecode.S_SideEffects.processWhenObjDamage(info,"skill","after");
    		value = Lecode.S_SideEffects.processWhenObjDamage(info,"any","after");
    	}
    } else if(this.isItem()) {
    		value = Lecode.S_SideEffects.processWhenObjDamage(info,"item","before");
    		value = Lecode.S_SideEffects.processWhenObjDamage(info,"any","before");
    		Lecode.S_SideEffects.oldGA_executeDamage.call(this,target,value);
    		value = Lecode.S_SideEffects.processWhenObjDamage(info,"item","after");
    		value = Lecode.S_SideEffects.processWhenObjDamage(info,"any","after");
    } else {
    	value = Lecode.S_SideEffects.processWhenObjDamage(info,"any","before");
    	Lecode.S_SideEffects.oldGA_executeDamage.call(this,target,value);
    	value = Lecode.S_SideEffects.processWhenObjDamage(info,"any","after");
    }
};


//-----------------------------------------------------------
//- Call "when state added" effects
//-----------------------------------------------------------
Lecode.S_SideEffects.oldGB_addNewState = Game_Battler.prototype.addNewState;
Game_Battler.prototype.addNewState = function(stateId) {
    var info = {
    	user: this,
    	stateID: stateId
    }
    Lecode.S_SideEffects.processWhenStateSomething(info,"before","added");
    Lecode.S_SideEffects.oldGB_addNewState.call(this,stateId);
    Lecode.S_SideEffects.processWhenStateSomething(info,"after","added");
};

//-----------------------------------------------------------
//- Call "when state removed" effects
//-----------------------------------------------------------
Lecode.S_SideEffects.oldGBB_eraseState = Game_BattlerBase.prototype.eraseState;
Game_BattlerBase.prototype.eraseState = function(stateId) {
    var info = {
    	user: this,
    	stateID: stateId
    }
    Lecode.S_SideEffects.processWhenStateSomething(info,"before","removed");
    Lecode.S_SideEffects.oldGBB_eraseState.call(this,stateId);
    Lecode.S_SideEffects.processWhenStateSomething(info,"before","removed");
};

/*=============================================
----------------  RTP MODIFS	---------------
===============================================*/

Lecode.S_SideEffects.oldBM_iniMembers = BattleManager.initMembers;
BattleManager.initMembers = function() {
	Lecode.S_SideEffects.oldBM_iniMembers.call(this);
	this._forcedActionStack = [];
};

BattleManager.leStackForceAction = function(info) {
    this._forcedActionStack.push(info);
};

Lecode.S_SideEffects.oldBM_update = BattleManager.update;
BattleManager.update = function() {
	this.leCheckForceActionStack();
	Lecode.S_SideEffects.oldBM_update.call(this);
};

BattleManager.leCheckForceActionStack = function() {
	if(this._actionForcedBattler == null) {
		var info = this._forcedActionStack.shift();
		if( info ) {
			var battler = info.battler;
			var action = info.action;
			battler.clearActions();
    		battler._actions.push(action);
			this.forceAction(battler);
		}
	}
};

Lecode.S_SideEffects.oldBM_endAction = BattleManager.endAction;
BattleManager.endAction = function() {
    Lecode.S_SideEffects.oldBM_endAction.call(this);
    var subject = this._subject;
    if (subject && subject._leSEafterActions && this._actionForcedBattler != subject){
    	var info = subject._leSEafterActions;
        subject._actions = info[0];
        this._subject = info[1];
        subject.setActionState(info[2]);
        subject._leSEafterActions = null;
    	$gameParty.requestMotionRefresh();
    }
};