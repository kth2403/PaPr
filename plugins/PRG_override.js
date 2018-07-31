//Override

(function () {

	// rpg_core.js
	
	//변경 : 프레스2 추가
	var Alias_TouchInput_clear = TouchInput.clear;
	TouchInput.clear = function() {
	    Alias_TouchInput_clear.call(this);
		this._mousePressed2 = false;
	};
	
	//변경 : 프레스2 추가
	TouchInput.isPressed2 = function() {
	    return this._mousePressed2;
	};
	    
	//변경 : 오른쪽클릭에 프레스2 추가
	TouchInput._onRightButtonDown = function(event) {
	    var x = Graphics.pageToCanvasX(event.pageX);
	    var y = Graphics.pageToCanvasY(event.pageY);
	    if (Graphics.isInsideCanvas(x, y)) {
	    	this._mousePressed2 = true;
	        this._pressedTime2 = 0;
	        this._onCancel(x, y);
	    }
	};
	    
	//변경 : 버튼2 리슨 추가
	TouchInput._onMouseUp = function(event) {
	    if (event.button === 0) {
	        var x = Graphics.pageToCanvasX(event.pageX);
	        var y = Graphics.pageToCanvasY(event.pageY);
	        this._mousePressed = false;
	        this._onRelease(x, y);
	    }
	    else if (event.button === 2) {
	    	var x = Graphics.pageToCanvasX(event.pageX);
	        var y = Graphics.pageToCanvasY(event.pageY);
	        this._mousePressed2 = false;
	        this._onRelease(x, y);
	    }
	};

    //변경 : shouldPrevent tab키 추가
    var Alias_Input_shouldPreventDefault = Input._shouldPreventDefault;
    Input._shouldPreventDefault = function (keyCode) {
        if (keyCode === 9) return true;
        Alias_Input_shouldPreventDefault.call(this);

    };
	// rpg_Object.js
	
	//변경 : 스윗치10번 캔무브
	Game_Player.prototype.canMove = function() {
	    if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
	        return false;
	    }
	    if (this.isMoveRouteForcing() || this.areFollowersGathering()) {
	        return false;
	    }
	    if (this._vehicleGettingOn || this._vehicleGettingOff) {
	        return false;
	    }
	    if (this.isInVehicle() && !this.vehicle().canMove()) {
	        return false;
	    }
	    if ($gameSwitches.value(10))
	    	return false;
	    return true;
	};
	    
	    
	// rpg_scenes.js
	//변경 : 없애버림ㅋ
	Scene_Base.prototype.checkGameover = function() {
	};
	    
	//변경 : options 이후 커맨드 처리
	Scene_Title.prototype.createCommandWindow = function() {
	    this._commandWindow = new Window_TitleCommand();
	    this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
	    this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
	    this._commandWindow.setHandler('Gallery', this.commandGallery.bind(this));
	    this._commandWindow.setHandler('Credit', this.commandCredit.bind(this));
	    this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
	    this._commandWindow.setHandler('exitGame', this.commandExitGame.bind(this));
	    this.addWindow(this._commandWindow);
	};    
	
	//변경 : 바로 로드
	Scene_Title.prototype.commandContinue = function() {
	    this._commandWindow.close();
	    this.fadeOutAll();
		if(DataManager.isAnySavefileExists()){
			DataManager.loadGame(DataManager.latestSavefileId());
			$gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
		    $gamePlayer.requestMapReload();
			$gameSystem.onAfterLoad();
			SceneManager.goto(Scene_Map);
		}
		else{
			SceneManager.goto(Scene_Title);
		}
	    //SceneManager.push(Scene_Load);
	};
	
	//변경 : commandOptions 전까지 명령 추가
	Scene_Title.prototype.commandGallery = function() {
	    alert("아직 지원하지 않습니다 ^^;");
		//this._commandWindow.close();
	    //this.fadeOutAll();
	    //SceneManager.exit();
	    SceneManager.goto(Scene_Title);
	};

	Scene_Title.prototype.commandCredit = function() {
		alert("아직 지원하지 않습니다 ^^;");
		//this._commandWindow.close();
	    //this.fadeOutAll();
	    //SceneManager.exit();
		SceneManager.goto(Scene_Title);
	};

	Scene_Title.prototype.commandOptions = function() {
		this._commandWindow.close();
	    SceneManager.push(Scene_Options);
	};
	//변경 : exit도 추가
	Scene_Title.prototype.commandExitGame = function() {
		alert("게임종료하면 안돼요!");
		//this._commandWindow.close();
	    //this.fadeOutAll();
	    //SceneManager.exit();
		SceneManager.goto(Scene_Title);
	};
	

	//변경 : 게임오버 없애버림
	Scene_Map.prototype.updateScene = function() {
	    //this.checkGameover();
	    if (!SceneManager.isSceneChanging()) {
	        this.updateTransferPlayer();
	    }
	    if (!SceneManager.isSceneChanging()) {
	        this.updateEncounter();
	    }
	    if (!SceneManager.isSceneChanging()) {
	        this.updateCallMenu();
	    }
	    if (!SceneManager.isSceneChanging()) {
	        this.updateCallDebug();
	    }
	};

	//변경 : 뮤직, 백그라운드 안해
	Scene_Gameover.prototype.create = function() {
	    Scene_Base.prototype.create.call(this);
	    //this.playGameoverMusic();
	    //this.createBackground();
	};

	//변경 : 페이드인 안해
	Scene_Gameover.prototype.start = function() {
	    Scene_Base.prototype.start.call(this);
	    //this.startFadeIn(this.slowFadeSpeed(), false);
	};
	
	
	// rpg_windows.js
	
	//변경 : 페이스칩 사이즈 변경
	Window_Base.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
	    width = width || Window_Base._faceWidth;
	    height = height || Window_Base._faceHeight;
	    var bitmap = ImageManager.loadFace(faceName);
	    var pw = Window_Base._faceWidth;
	    var ph = Window_Base._faceHeight;
	    var sw = Math.min(width, pw);
	    var sh = Math.min(height, ph);
	    var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
	    var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
	    var sx = faceIndex % 4 * pw + (pw - sw) / 2;
	    var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
	    var dw = 100; //your desired portrait width
	    var dh = 110; //your desired portrait heith
	    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy, dw, dh); //notice two more params
	    //this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
	};
	
	//변경 : 타이틀 커맨드 options 이후로 추가
	Window_TitleCommand.prototype.makeCommandList = function() {
	    this.addCommand(TextManager.newGame,   'newGame');
	    this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
	    this.addCommand('Gallery', 'Gallery');
	    this.addCommand('Credit', 'Credit');
	    this.addCommand(TextManager.options,   'options');
	    this.addCommand('Exit', 'exitGame');
	};
	
	Window_Selectable.prototype.processCursorMove = function() {
	    if (this.isCursorMovable()) {
	        var lastIndex = this.index();
	        if (Input.isRepeated('down')) {
	            this.cursorDown(Input.isTriggered('down'));
	        }
	        if (Input.isRepeated('up')) {
	            this.cursorUp(Input.isTriggered('up'));
	        }
	        if (Input.isRepeated('right')) {
	            this.cursorRight(Input.isTriggered('right'));
	        }
	        if (Input.isRepeated('left')) {
	            this.cursorLeft(Input.isTriggered('left'));
	        }
	        if (!this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
	            this.cursorPagedown();
	        }
	        if (!this.isHandled('pageup') && Input.isTriggered('pageup')) {
	            this.cursorPageup();
	        }
	    }
	};
	
	Window_Selectable.prototype.onTouch = function(triggered) {
	    var lastIndex = this.index();
	    var x = this.canvasToLocalX(TouchInput.x);
	    var y = this.canvasToLocalY(TouchInput.y);
	    var hitIndex = this.hitTest(x, y);
	    if (hitIndex >= 0) {
	        if (hitIndex === this.index()) {
	            if (triggered && this.isTouchOkEnabled()) {
	                this.processOk();
	            }
	        } else if (this.isCursorMovable()) {
	            this.select(hitIndex);
	        }
	    } else if (this._stayCount >= 10) {
	        if (y < this.padding) {
	            this.cursorUp();
	        } else if (y >= this.height - this.padding) {
	            this.cursorDown();
	        }
	    }
	};
	
	Window_Selectable.prototype.processPageup = function() {
	    this.updateInputData();
	    this.deactivate();
	    this.callHandler('pageup');
	};
	
	Window_Selectable.prototype.processPagedown = function() {
	    this.updateInputData();
	    this.deactivate();
	    this.callHandler('pagedown');
	};
	
	
})();