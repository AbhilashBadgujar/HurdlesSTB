function CArrivalPanel(){
    var _bShow;
    var _iStartY;
    var _iEventToLaunch;
    var _iHalfWidthPanel;
    var _aCbCompleted;
    var _aCbOwner;
    var _aStars;
    var _oListener;
    
    var _oFade;
    var _oPlaceText;
    var _oTrackScoreText;
    var _oTotScoreText;
    var _oTitleText;
    var _oButHome;
    var _oButRestart;
    var _oButNext;
    var _oContainer;
    var _oContainerStar;
    var _oContainerPanel;
    
    var _oThis = this;

    
    this._init = function(){
        _bShow = false;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        s_oStage.addChild(_oContainer);
        
        _oFade = createBitmap(s_oSpriteLibrary.getSprite("fade_bg"));
        _oFade.alpha = 0;
        _oListener = _oFade.on("click", function () {});
        _oContainer.addChild(_oFade);
        
       
       
        _oContainerPanel = new createjs.Container();
        _oContainerPanel.x = CANVAS_WIDTH/2;
        _oContainer.addChild(_oContainerPanel);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box_high");
        var oBg = createBitmap(oSpriteBg);
        _oContainerPanel.addChild(oBg);
        
        _iHalfWidthPanel = oSpriteBg.width/2;
        
        _oPlaceText = new CTLText(_oContainerPanel,
                    _iHalfWidthPanel - 400, 10, 800, 50,
                    40, "center", "#ffffff", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false);
        
        _oTitleText = new CTLText(_oContainerPanel,
                    _iHalfWidthPanel - 400, 20, 800, 50,
                    50, "center", "#ffffff", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false);
        
        _oTrackScoreText = new CTLText(_oContainerPanel, 
                    _iHalfWidthPanel - 400, oSpriteBg.height/2-20, 800, 30, 
                    30, "center", "#ffffff", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
        
        _oTotScoreText = new CTLText(_oContainerPanel, 
                    _iHalfWidthPanel - 400, oSpriteBg.height/2+20, 800, 30, 
                    30, "center", "#ffffff", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
        
        _oContainerStar = new createjs.Container();
        _oContainerStar.x = _iHalfWidthPanel;
        _oContainerStar.y = oSpriteBg.height/2-100;
        _oContainerPanel.addChild(_oContainerStar);
        
        _aStars = new Array();
        
        var iXPos = 35;
        for(var i=0;i<3;i++){
            
            var oStar = new CStar(iXPos,35,_oContainerStar)
            
            iXPos += 85;
            
            _aStars.push(oStar);
        }
        
        _oContainerStar.regX = _oContainerStar.getBounds().width/2;
        
        _oButHome = new CGfxButton(_iHalfWidthPanel - 170,oSpriteBg.height/2 + 100,s_oSpriteLibrary.getSprite("but_home"),_oContainerPanel);
        _oButHome.addEventListener(ON_MOUSE_UP,this._onHome,this);
        
        _oButRestart = new CGfxButton(_iHalfWidthPanel ,oSpriteBg.height/2+100,s_oSpriteLibrary.getSprite("but_restart"),_oContainerPanel);
        _oButRestart.addEventListener(ON_MOUSE_UP,this._onRestart,this);
        
        _oButNext = new CGfxButton(_iHalfWidthPanel + 170,oSpriteBg.height/2+100,s_oSpriteLibrary.getSprite("but_next"),_oContainerPanel);
        _oButNext.addEventListener(ON_MOUSE_UP,this._onNext,this);
        
        _iStartY = -oSpriteBg.height/2;
        
        _oContainerPanel.regX = _iHalfWidthPanel;
        _oContainerPanel.regY = oSpriteBg.height/2;
    };
    
    this.unload = function(){
        _oButHome.unload();
        _oButRestart.unload();
        
        _oFade.off("click", _oListener);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.show = function(iLevelScore,iTotScore,iPlayerPos,iNumStars){
        _iEventToLaunch = null;
        setVolume("soundtrack",0);
        var oSound;
        if(iPlayerPos < 4){
            //RESET STARS
            for(var i=0;i<_aStars.length;i++){
                _aStars[i].reset();
            }
            
            oSound = playSound("level_win",1,false);
            var iTime  = 1500;
            for(var i=0;i<iNumStars;i++){
                _aStars[i].show(iTime);
                iTime += 800;
            }
            
            _oPlaceText.setY(20);
            _oTitleText.refreshText(" ");
            _oContainerStar.visible = true;
            _oButNext.setVisible(true);
            _oButRestart.setX(_iHalfWidthPanel);
            
            _oTrackScoreText.refreshText(TEXT_LEVEL_SCORE + ": "+iLevelScore);
            _oTotScoreText.refreshText( TEXT_TOT_SCORE+": "+iTotScore);
        }else{
            oSound = playSound("game_over",1,false);
            _oContainerStar.visible = false;
            _oPlaceText.setY(110);
            _oTitleText.refreshText(TEXT_YOU_LOST);
            _oButNext.setVisible(false);
            _oButRestart.setX(_iHalfWidthPanel+170);
            
            _oTrackScoreText.refreshText(" ");
            _oTotScoreText.refreshText(" ");
        }
        
        oSound.on('end', function(){
            if(_iEventToLaunch === null){
                setVolume("soundtrack",1);
            }
        });
        
        var szSuffix = TEXT_OTHER_POS;
        if(iPlayerPos === 1){
            szSuffix = TEXT_ST;
        }else if(iPlayerPos === 2){
            szSuffix = TEXT_ND;
        }else if(iPlayerPos === 3){
            szSuffix = TEXT_RD;
        }
        _oPlaceText.refreshText( iPlayerPos+szSuffix+ " " + TEXT_PLACE);
        
        
        _oFade.alpha=0;
        _oContainerPanel.y = _iStartY;
        _oContainer.visible = true;
        
        createjs.Tween.get(_oFade).to({alpha:0.7}, 500);
        createjs.Tween.get(_oContainerPanel).wait(500).to({y:CANVAS_HEIGHT/2}, 800,createjs.Ease.cubicOut).call(function(){
                                                                                                                        _oThis.enableButtons();
                                                                                                                        _bShow = true;
                                                                                                                    });
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainerPanel).to({y:_iStartY}, 1000,createjs.Ease.backIn).call(function(){
                                                                                                        _bShow = false;

                                                                                                        _oContainer.visible = false;
                                                                    
                                                                                                        if(_aCbCompleted[_iEventToLaunch]){
                                                                                                            _aCbCompleted[_iEventToLaunch].call(_aCbOwner[_iEventToLaunch]);
                                                                                                        }
                                                                })
    };
    
    this.enableButtons = function(){
        _oButHome.enable();
        _oButRestart.enable();
    };
    
    this.disableButtons = function(){
        _oButHome.disable();
        _oButRestart.disable();
    };
    
    this._onHome = function(){
        _oThis.disableButtons();
        
        _iEventToLaunch = ON_BACK_MENU;
        
        _oThis.hide();
    };
    
    this._onRestart = function(){
        _oThis.disableButtons();
        s_oInterface.removeKeyListener();
        
        $(s_oMain).trigger("show_interlevel_ad");
        
        _iEventToLaunch = ON_RESTART;
        
        _oThis.hide();
    };
    
    this._onNext = function(){
        _oThis.disableButtons();
        s_oInterface.removeKeyListener();
        
        $(s_oMain).trigger("show_interlevel_ad");
        
        _iEventToLaunch = ON_NEXT_LEVEL;
        
        _oThis.hide();
    };
    
    this.isVisible = function(){
        return _bShow;
    };
    
    this._init();
}
