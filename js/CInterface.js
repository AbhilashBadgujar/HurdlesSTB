function CInterface(iScore,iCurLevel){
    var _iTotObstalces;
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosScore;
    var _pStartPosFullscreen;
    var _pStartPosFlags;
    var _oRollingScore;
	
    var _oAmountScoreText;
    
    var _oLevelText;
    var _oObstaclesText;
    var _oButExit;
    var _oAudioToggle;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oGUIExpandible;
    var _oContainerScore;
    var _oFlagArrivalController;
    var _oFinalText;
    var _oAreYouSurePanel;
    var _GameInfo;
    
    this._init = function(iScore,iCurLevel){ 
        
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
	_pStartPosExit = {x:CANVAS_WIDTH - (oSprite.width/2) -10,y:(oSprite.height/2) +10};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _pStartPosAudio = {x:_pStartPosExit.x - oSprite.width,y:_pStartPosExit.y}
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            
            _pStartPosFullscreen = {x: _pStartPosAudio.x - oSprite.width/2,y:_pStartPosAudio.y};
        }else{
            _pStartPosFullscreen = {x:_pStartPosExit.x - oSprite.width,y:_pStartPosExit.y}
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
       

        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        var oSprite = s_oSpriteLibrary.getSprite('but_settings');
        _oGUIExpandible = new CGUIExpandible(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oGUIExpandible.addButton(_oButExit);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oGUIExpandible.addButton(_oAudioToggle);
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oGUIExpandible.addButton(_oButFullscreen);
        }
        
        
        _pStartPosScore = {x:10,y:10};
        
        _oContainerScore = new createjs.Container();
        _oContainerScore.x = _pStartPosScore.x;
        _oContainerScore.y = _pStartPosScore.y;
        s_oStage.addChild(_oContainerScore);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite("best_score_panel"));
        _oContainerScore.addChild(oBg);


        _oAmountScoreText = new CTLText(_oContainerScore, 
                    52, 3, 126, 21, 
                    21, "left", "#fff", FONT_GAME, 1,
                    0, 0,
                    ""+iScore,
                    true, true, false,
                    false );
                    
                    
        _oLevelText = new CTLText(_oContainerScore, 
                    52, 26, 126, 11, 
                    11, "left", "#0f2920", FONT_GAME, 1,
                    0, 0,
                    "Socre",
                    true, true, false,
                    false );
        
      
        var oBg = createBitmap(s_oSpriteLibrary.getSprite("obstacle_bg"));
        oBg.y = 46;
        _oContainerScore.addChild(oBg);
        var oBg = createBitmap(s_oSpriteLibrary.getSprite("obstacle_bg"));
        oBg.y = 100;
        _oContainerScore.addChild(oBg);
        
        var oObstacleIcon = createBitmap(s_oSpriteLibrary.getSprite("obstacle_icon"));
        oObstacleIcon.x = 20;
        oObstacleIcon.y = 58;
        _oContainerScore.addChild(oObstacleIcon);
        
        _oObstaclesText = new CTLText(_oContainerScore, 
                    72, 62, 120, 20, 
                    20, "left", "#f00", FONT_GAME, 1,
                    0, 0,
                    "10/",
                    true, true, false,
                    false );
        oText = new CTLText(_oContainerScore, 
            -130, CANVAS_HEIGHT/2 - 160, 400, 30, 
            30, "center", "#fff", FONT_GAME, 1,
            0, 0,
            "1st",
            true, true, true,
            false);
        _oFinalText = new CFinalPosTextAnim(s_oStage);
        
        
        _pStartPosFlags = {x:-100,y:140}
        _oFlagArrivalController = new CFlagArrivalController(_pStartPosFlags.x,_pStartPosFlags.y,s_oStage);
        
        _oAreYouSurePanel = new CAreYouSurePanel();
        _oAreYouSurePanel.addEventListener(ON_BUT_YES_DOWN,this._onExitYes,this);
        
        _oRollingScore = new CRollingScore();
        
    this.refreshButtonPos();	
    
    window.addEventListener('keydown', this.onKeyDown , this);	
    };

    this.onKeyDown = function(evt) {
       
       
        switch(evt.keyCode) {  
            

            case 48:
                
                Howler.mute(s_bAudioActive);
                s_bAudioActive = !s_bAudioActive;
            break;

        }
    }
    
    this.unload = function(){
        //_oButExit.unload();
        _oButExit = null;
        _oGUIExpandible.unload();
        _oAreYouSurePanel.unload();
        window.removeEventListener('keydown', this.onKeyDown);
        if(DISABLE_SOUND_MOBILE === false){
            
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        
       
        this.removeKeyListener();

        
        s_oStage.removeAllChildren();
	s_oInterface = null;
    };
    
    this.reset = function(iScore,iLevel){
        
        _iTotObstalces = 3;
        _oAmountScoreText.refreshText( iScore);
        _oLevelText.refreshText("Score");
        _oObstaclesText.refreshText("0/"+ "3");
        oText.refreshText("1ST");

        //if(!s_bMobile) {
            //KEY LISTENER
        //    document.onkeydown   = s_oGame.onKeyDown;
        //}
    };

    
    this.removeKeyListener = function(){
        if(!s_bMobile) {
            document.onkeydown   = null;
        }
    };

    this.refreshButtonPos = function(){
        _oContainerScore.x = _pStartPosScore.x + s_iOffsetX;
        _oContainerScore.y = _pStartPosScore.y + s_iOffsetY;

        _oFlagArrivalController.setX(_pStartPosFlags.x + s_iOffsetX);
        _oGUIExpandible.refreshPos();

    };
    
    this.refreshScore = function(iScore){
        _oRollingScore.rolling(_oAmountScoreText, iScore);
    };
    
    this.refreshObstacles = function(iNum, bNum, ipos){
        _oObstaclesText.refreshText(iNum+"/"+bNum);
        if(ipos == 1){
            oText.refreshText("1ST");
        }else if(ipos == 2){
            oText.refreshText("2ND");
        }else if(ipos == 3){
            oText.refreshText("3RD");
        }else{
            oText.refreshText(ipos + "TH");
        }
        

    };
    
    this.setFlagArrival = function(iPos,iFlag){
        _oFlagArrivalController.setFlagArrival(iPos,iFlag);
    };
    
    this.hideFlagArrival = function(){
        _oFlagArrivalController.hide();
    };
    
    this.showFinalPosAnim = function(iPos){
        _oFinalText.show(iPos);
    };

    this._onExit = function(){
        _oAreYouSurePanel.show(TEXT_ARE_SURE);
    };

    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
	s_bAudioActive = !s_bAudioActive;
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
		_oButFullscreen.setActive(s_bFullscreen);
	}
    };
    
    this._onFullscreenRelease = function(){
        if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
   
    this._onExitYes = function(){
        s_oGame.onExit();  
    };
    
    s_oInterface = this;
    
    this._init(iScore,iCurLevel);
    
    return this;
}

var s_oInterface = null;