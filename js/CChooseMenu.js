function CChooseMenu(){
    var _aButFlags;
    var _aTeamPlayer;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _pStartPosExit;
    
    var _oButPlay;
    var _oButExit;
    var _oPanel;
    var _oText;
    var _oTextInfo;
    var _oTextFlag;
    var _oAudioToggle;
    var _oButFullscreen;
    var _oLoaderController;
    var _oContainerPanel;
    var _oSelectFlag;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    this._init = function(){

        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu_level'));
        s_oStage.addChild(oBg);
        
        _oContainerPanel = new createjs.Container();
        s_oStage.addChild(_oContainerPanel);
        
        var oSpritePanel = s_oSpriteLibrary.getSprite("player_selection_panel");
        _oPanel = createBitmap(oSpritePanel);
        _oContainerPanel.addChild(_oPanel);
        
        
        _oContainerPanel.x = -oSpritePanel.width/2;
        _oContainerPanel.y = CANVAS_HEIGHT/2;
        _oContainerPanel.regX = oSpritePanel.width/2;
        _oContainerPanel.regY = oSpritePanel.height/2;
        
        
        _oText = new CTLText(_oContainerPanel, 
                    CANVAS_WIDTH/2-420, 7, 336, 21, 
                    21, "left", "#01afb6", FONT_GAME, 1,
                    0, 0,
                    TEXT_SELECT_RUNNER,
                    true, true, false,
                    false);

        

                    _oTextInfo = new CTLText(_oContainerPanel, 
                    25, 7, 300, 300, 
                    21, "left", "#01afb6", FONT_GAME, 1,
                    0, 0,
                    "PRESS OK TO PLAY",
                    true, true, false,
                    false);

            
        _oTextFlag = new CTLText(_oContainerPanel, 
                    CANVAS_WIDTH/2-420, 35, 336, 17, 
                    17, "left", "#fff", FONT_GAME, 1,
                    0, 0,
                    TEAM_NAMES[s_iTeamSelected],
                    true, true, false,
                    false);
                    
                    
        _aButFlags = new Array();
        var iX  = 70;
        var iY = 111;
        
        for(var i=0;i<NUM_TEAMS;i++){
            var oFlag = new CFlagButton(iX,iY,i,_oContainerPanel);
            oFlag.addEventListenerWithParams(ON_MOUSE_UP,this._onFlagSelected,this,i);
            iX += 115;
          
            if((i+1)%2 === 0){
                iX = 20;
                iY += 130;
            }
            
            _aButFlags.push(oFlag);
        }
                
       
        var oSpriteSelect = s_oSpriteLibrary.getSprite("team_selection");
        _oSelectFlag = createBitmap(oSpriteSelect);
        _oSelectFlag.regX = oSpriteSelect.width/2;
        _oSelectFlag.regY = oSpriteSelect.height/2;
        _oSelectFlag.x = _aButFlags[s_iTeamSelected].getX();
        _oSelectFlag.y = _aButFlags[s_iTeamSelected].getY();
        _oContainerPanel.addChild(_oSelectFlag);
        
                
        _aTeamPlayer = new Array();
        for(var i=0;i<NUM_TEAMS;i++){
            var oSpritePlayer = s_oSpriteLibrary.getSprite("team_"+i);
            var oBmp = createBitmap(oSpritePlayer);
            oBmp.x = 408;
            oBmp.y = 220;
            oBmp.regX = oSpritePlayer.width/2;
            oBmp.regY = oSpritePlayer.height/2;
            _oContainerPanel.addChild(oBmp);
            
            if(i!==s_iTeamSelected){
                oBmp.visible = false;
            }
            
            _aTeamPlayer.push(oBmp);
        }
        
        _oButPlay = new CGfxButton(511,342,s_oSpriteLibrary.getSprite("but_next_big"),_oContainerPanel);
        _oButPlay.addEventListener(ON_MOUSE_UP,this._onPlay,this);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.width/2)- 10, y: (oSprite.height/2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: _pStartPosExit.x - (oSprite.width/2)- 10, y: _pStartPosExit.y};            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
  
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
            _pStartPosFullscreen = {x: oSprite.width/4 + 10,y:(oSprite.height/2) + 10};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        _oLoaderController = new CLoaderResourcesPanel(s_oStage);
        _oLoaderController.addEventListener(ON_END_LOADING,this._onEndLoading,this);
        
        var oFade = createBitmap(s_oSpriteLibrary.getSprite("fade_bg"));
        s_oStage.addChild(oFade);
        
        createjs.Tween.get(oFade).to({alpha:0}, 500).call(function(){
            oFade.visible = false;
            createjs.Tween.get(_oContainerPanel).to({x: CANVAS_WIDTH/2}, 500, createjs.Ease.quartOut).call(function(){});
        });  
        
        this.refreshButtonPos();
        window.addEventListener('keydown', this.onKeyDown , this);
    };
    

    this.onKeyDown = function(evt) {
       
        //this._onPlay();
        switch(evt.keyCode) {  
            
            case 48:
                _oAudioToggle.buttonRelease();  
            break;

            case 56:
                s_oChooseMenu.unload();
        
                s_oMain.gotoMenu();
            break;


            case 32:{
                //Space
                if(s_aTeamLoaded[s_iTeamSelected]){
                    s_oChooseMenu.unload();
                
                    s_oMain.gotoLevelMenu();
                }else{
                    var aResources = new Array();
                    if(s_iTeamSelected !== PLAYER_LANE_INDEX){
                        TEAM_IN_LANE[s_iTeamSelected] = PLAYER_LANE_INDEX;
                        TEAM_IN_LANE[PLAYER_LANE_INDEX] = s_iTeamSelected;
                        
                    }
                  
                    for(var i=0;i<NUM_TEAMS;i++){
                            //LOAD PLAYER SPRITES
                            aResources.push({name:"player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_jump",
                                             path:"./sprites/player_"+i+"/player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_jump.png"});
                                         
                            aResources.push({name:"player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_prepare",
                                             path:"./sprites/player_"+i+"/player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_prepare.png"});
                            
                            aResources.push({name:"player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_run",
                                             path:"./sprites/player_"+i+"/player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_run.png"});
                            
                            aResources.push({name:"player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_start",
                                             path:"./sprites/player_"+i+"/player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_start.png"});
                            
                            for(var k=1;k<START_SPRITESHEET_PAGES_PER_LANE[TEAM_IN_LANE[i]];k++){
                                aResources.push({name:"player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_start_"+k,
                                             path:"./sprites/player_"+i+"/player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_start_"+k+".png"});
                            }
                    }
                    
        
                    _oLoaderController.start(aResources);
                }  
               break;
            }
            case 13:{
                //Space
                if(s_aTeamLoaded[s_iTeamSelected]){
                    s_oChooseMenu.unload();
                
                    s_oMain.gotoLevelMenu();
                }else{
                    var aResources = new Array();
                    if(s_iTeamSelected !== PLAYER_LANE_INDEX){
                        TEAM_IN_LANE[s_iTeamSelected] = PLAYER_LANE_INDEX;
                        TEAM_IN_LANE[PLAYER_LANE_INDEX] = s_iTeamSelected;
                        
                    }
                  
                    for(var i=0;i<NUM_TEAMS;i++){
                            //LOAD PLAYER SPRITES
                            aResources.push({name:"player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_jump",
                                             path:"./sprites/player_"+i+"/player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_jump.png"});
                                         
                            aResources.push({name:"player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_prepare",
                                             path:"./sprites/player_"+i+"/player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_prepare.png"});
                            
                            aResources.push({name:"player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_run",
                                             path:"./sprites/player_"+i+"/player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_run.png"});
                            
                            aResources.push({name:"player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_start",
                                             path:"./sprites/player_"+i+"/player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_start.png"});
                            
                            for(var k=1;k<START_SPRITESHEET_PAGES_PER_LANE[TEAM_IN_LANE[i]];k++){
                                aResources.push({name:"player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_start_"+k,
                                             path:"./sprites/player_"+i+"/player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_start_"+k+".png"});
                            }
                    }
                    
        
                    _oLoaderController.start(aResources);
                }  
               break;
            }
        } 

    
    };

    this.unload = function(){
        createjs.Tween.removeAllTweens();
        
        for(var i=0;i<_aButFlags.length;i++){
            _aButFlags[i].unload();
        }
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        
        _oButExit.unload();
        _oLoaderController.unload();
        _oButPlay.unload();
        window.removeEventListener('keydown', this.onKeyDown);
        s_oStage.removeAllChildren();
        s_oChooseMenu = null;
    };
    
    this.refreshButtonPos = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
        
        _oButExit.setPosition(_pStartPosExit.x - s_iOffsetX,_pStartPosExit.y + s_iOffsetY);
    };

    this._onFlagSelected = function(iFlag){
        _aTeamPlayer[s_iTeamSelected].visible=false;
        
        s_iTeamSelected = iFlag;

        
        _oSelectFlag.x = _aButFlags[s_iTeamSelected].getX();
        _oSelectFlag.y = _aButFlags[s_iTeamSelected].getY();
        _oTextFlag.refreshText(TEAM_NAMES[s_iTeamSelected]);
        _aTeamPlayer[s_iTeamSelected].visible=true;
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onEndLoading = function(){
        s_aTeamLoaded[s_iTeamSelected] = true;
        
        s_oChooseMenu.unload();
        s_oMain.gotoLevelMenu();
    };
    
    this._onExit = function(){
        s_oChooseMenu.unload();
        
        s_oMain.gotoMenu();
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
    
    this._onPlay = function(){
       if(s_aTeamLoaded[s_iTeamSelected]){
            s_oChooseMenu.unload();
        
            s_oMain.gotoLevelMenu();
        }else{
            var aResources = new Array();
            if(s_iTeamSelected !== PLAYER_LANE_INDEX){
                TEAM_IN_LANE[s_iTeamSelected] = PLAYER_LANE_INDEX;
                TEAM_IN_LANE[PLAYER_LANE_INDEX] = s_iTeamSelected;
                
            }
          
            for(var i=0;i<NUM_TEAMS;i++){
                    //LOAD PLAYER SPRITES
                    aResources.push({name:"player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_jump",
                                     path:"./sprites/player_"+i+"/player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_jump.png"});
                                 
                    aResources.push({name:"player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_prepare",
                                     path:"./sprites/player_"+i+"/player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_prepare.png"});
                    
                    aResources.push({name:"player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_run",
                                     path:"./sprites/player_"+i+"/player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_run.png"});
                    
                    aResources.push({name:"player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_start",
                                     path:"./sprites/player_"+i+"/player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_start.png"});
                    
                    for(var k=1;k<START_SPRITESHEET_PAGES_PER_LANE[TEAM_IN_LANE[i]];k++){
                        aResources.push({name:"player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_start_"+k,
                                     path:"./sprites/player_"+i+"/player_"+i+"_lane_"+(TEAM_IN_LANE[i]+1)+"_start_"+k+".png"});
                    }
            }
            

            _oLoaderController.start(aResources);
        }  
    };
    
    s_oChooseMenu = this;
    
    this._init();
}

var s_oChooseMenu = null;