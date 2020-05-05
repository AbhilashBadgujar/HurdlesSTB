
function CMenu(){
    var _pStartPosAudio;
    var _pStartPosCredits;
    var _pStartPosFullscreen;
    var _pStartPosDelete;
	var _oTextFlag;
    var _oLogo;
    var _oBg;
    var _oButPlay;
    var _oAudioToggle;
    var justbool;
    //var _oButCredits;
    var _oButDeleteSave = null;
    var _oFade;
    var _oAreYouSurePanel;
    //var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oLoaderController;
    var _pStartPosScore;
    
    this._init = function(){
        STRICKNO = 0;
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
	s_oStage.addChild(_oBg);
    s_bAudioActive = false;
    justbool = true;
        var oSpriteLogo = s_oSpriteLibrary.getSprite("logo_menu");
	_oLogo = createBitmap(oSpriteLogo);
        _oLogo.regX = oSpriteLogo.width/2;
        _oLogo.regY = oSpriteLogo.height/2;
        _oLogo.x = CANVAS_WIDTH/2;
        _oLogo.y = 110;
        s_oStage.addChild(_oLogo);

        _pStartPosScore = {x:10,y:10};
        _oContainerScore = new createjs.Container();
        _oContainerScore.x = _pStartPosScore.x;
        _oContainerScore.y = _pStartPosScore.y;
        s_oStage.addChild(_oContainerScore);

        _oButPlay = new CGfxButton((CANVAS_WIDTH/2),CANVAS_HEIGHT - 130,s_oSpriteLibrary.getSprite('but_play'),s_oStage);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlaySingle, this);
        _oTextFlag = new CTLText(_oContainerScore, 
            350, 460, 336, 50, 
            50, "center", "#fff", FONT_GAME, 1,
            0, 0,
            "PRESS OK TO CONTINUE \n\nPRESS 0 KEY FOR THE SOUND ",
            true, true, false,
            false);
        s_bAudioActive = true;
        Howler.mute(!s_bAudioActive);
        
     
        
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height/2)-10, y: (oSprite.height/2)+10};      
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
		
        var oSprite = s_oSpriteLibrary.getSprite('but_credits');
        _pStartPosCredits = {x:(oSprite.width/2) + 10,y:(oSprite.height/2) + 10};
        //_oButCredits = new CGfxButton(_pStartPosCredits.x,_pStartPosCredits.y,oSprite,s_oStage);
        //_oButCredits.addEventListener(ON_MOUSE_UP, this._onButCreditsRelease, this);
	
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x: _pStartPosCredits.x + oSprite.width/2 + 10,y:_pStartPosCredits.y};

            //_oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            //_oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        if(s_bStorageAvailable && getStoredTeamSelected() !== null){
            var oSprite = s_oSpriteLibrary.getSprite("but_delete_save");
            _pStartPosDelete = {x:oSprite.width/2 + 10,y:CANVAS_HEIGHT-oSprite.height/2-10};
            _oButDeleteSave = new CGfxButton(_pStartPosDelete.x - 200,_pStartPosDelete.y-200,oSprite,s_oStage);
            _oButDeleteSave.addEventListener(ON_MOUSE_UP,this._onDelete,this);
            
            s_iTeamSelected = parseInt(getStoredTeamSelected());
   
            s_iLastLevel = parseInt(getSavedLevel());
        }
        
        if(!s_bStorageAvailable){
            new CAlertSavingBox(TEXT_ERR_LS,s_oStage);
        }
        
        _oAreYouSurePanel = new CAreYouSurePanel();
        _oAreYouSurePanel.addEventListener(ON_BUT_YES_DOWN,this._onConfirmDelete,this);
        
        _oLoaderController = new CLoaderResourcesPanel(s_oStage);
        _oLoaderController.addEventListener(ON_END_LOADING,this._onEndLoading,this);
        
        _oFade = createBitmap(s_oSpriteLibrary.getSprite("fade_bg"));      
        s_oStage.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0}, 400).call(function(){_oFade.visible = false;}); 
        
        setVolume("soundtrack",1);
    this.refreshButtonPos();	
    window.addEventListener('keydown', this.onKeyDown , this);	
    
    };
    
  
    this.onKeyDown = function(evt) {
       
       
        switch(evt.keyCode) {  
            

            case 48:
                _oAudioToggle.buttonRelease();
            
            break;

            case 32:{
                //Center
                

                if(_oButDeleteSave === null){
                    s_oMenu.unload();
                    //s_oMain.levelSelected(1);
        
                   
                    s_oMain.gotoChooseMenu();
                }else if(s_aTeamLoaded[s_iTeamSelected]){
                    s_oMenu.unload();
                    
                    s_oMain.gotoLevelMenu();
                   
                }else{
                    if(s_iTeamSelected !== PLAYER_LANE_INDEX){
                        TEAM_IN_LANE[s_iTeamSelected] = PLAYER_LANE_INDEX;
                        TEAM_IN_LANE[PLAYER_LANE_INDEX] = s_iTeamSelected;
                        
                    }
        
                    
                    var aResources = new Array();
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
        
                $(s_oMain).trigger("start_session");
               break;
            }

            
            case 13:{
                //Center
                

                if(_oButDeleteSave === null){
                    s_oMenu.unload();
                    //s_oMain.levelSelected(1);
        
                   
                    s_oMain.gotoChooseMenu();
                }else if(s_aTeamLoaded[s_iTeamSelected]){
                    s_oMenu.unload();
                    
                    s_oMain.gotoLevelMenu();
                   
                }else{
                    if(s_iTeamSelected !== PLAYER_LANE_INDEX){
                        TEAM_IN_LANE[s_iTeamSelected] = PLAYER_LANE_INDEX;
                        TEAM_IN_LANE[PLAYER_LANE_INDEX] = s_iTeamSelected;
                        
                    }
        
                    
                    var aResources = new Array();
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
        
                $(s_oMain).trigger("start_session");
               break;
            }
           
        } 

    
    };

    this.unload = function(){
        _oLoaderController.unload();
        window.removeEventListener('keydown', this.onKeyDown);
        _oButPlay.unload(); 
        //_oButCredits.unload();
        if(_oButDeleteSave !== null){
            _oButDeleteSave.unload();
        }

        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            //_oButFullscreen.unload();
        }
        
        s_oStage.removeAllChildren();
	s_oMenu = null;
    };
	
    this.refreshButtonPos = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            //_oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
	//_oButCredits.setPosition(_pStartPosCredits.x + s_iOffsetX,_pStartPosCredits.y + s_iOffsetY);
        
        if(_oButDeleteSave !== null){
            _oButDeleteSave.setPosition(_pStartPosDelete.x + s_iOffsetX,_pStartPosDelete.y-s_iOffsetY);
        }
    };
    
    this._onButPlaySingle = function(){
        if(_oButDeleteSave === null){
            s_oMenu.unload();
            //s_oMain.levelSelected(1);

           
            s_oMain.gotoChooseMenu();
        }else if(s_aTeamLoaded[s_iTeamSelected]){
            s_oMenu.unload();
            
            s_oMain.gotoLevelMenu();
           
        }else{
            if(s_iTeamSelected !== PLAYER_LANE_INDEX){
                TEAM_IN_LANE[s_iTeamSelected] = PLAYER_LANE_INDEX;
                TEAM_IN_LANE[PLAYER_LANE_INDEX] = s_iTeamSelected;
                
            }

            
            var aResources = new Array();
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

        $(s_oMain).trigger("start_session");
    };

    
    
    this._onEndLoading = function(){
        s_aTeamLoaded[s_iTeamSelected] = true;
        
        s_oMenu.unload();
        s_oMain.gotoLevelMenu();
    };
	
    this._onButCreditsRelease = function(){
        new CCreditsPanel();
    };

    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
	s_bAudioActive = !s_bAudioActive;
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
		//_oButFullscreen.setActive(s_bFullscreen);
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
    
    this._onDelete = function(){
        _oAreYouSurePanel.show(TEXT_CONFIRM_DELETE);
    };
    
    this._onConfirmDelete = function(){
        clearLocalStorage();
        _oButDeleteSave.unload();
        _oButDeleteSave = null;
    };
    
    s_oMenu = this;
	
    this._init();
}

var s_oMenu = null;