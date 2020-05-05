function CFinalPanel(){
    var _iStartY;
    var _iHalfWidthPanel;
    var _iEventToLaunch;
    var _aCbCompleted;
    var _aCbOwner;
    var _oListener;
    
    var _oTotScoreText;
    var _oButHome;
    var _oButRestart;
    var _oFade;
    var _oContainerPanel;
    var _oContainer;

    var _oHighScore;
    
    var _oThis = this;
    
    this._init = function(){
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
        
        var oTitleText = new CTLText(_oContainerPanel,
                    _iHalfWidthPanel - 200, 20, 400, 80,
                    40, "center", "#ffffff", FONT_GAME, 1,
                    0, 0,
                    "GAME OVER!",
                    true, true, true,
                    false);
                    

        var oTitleText = new CTLText(_oContainerPanel,
            _iHalfWidthPanel - 200, 80, 400, 40,
            20, "center", "#ffffff", FONT_GAME, 1,
            0, 0,
            "PRESS DOWN KEY TO GO BACK",
            true, true, true,
            false);
        
        _oTotScoreText = new CTLText(_oContainerPanel, 
                    _iHalfWidthPanel - 200, oSpriteBg.height/2-30, 400, 60, 
                    30, "center", "#ffffff", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );
                    
        _oButHome = new CGfxButton(_iHalfWidthPanel,oSpriteBg.height/2 + 100,s_oSpriteLibrary.getSprite("but_home"),_oContainerPanel);
        _oButHome.addEventListener(ON_MOUSE_UP,this._onHome,this);
        
        _oButRestart = new CGfxButton(_iHalfWidthPanel +170,oSpriteBg.height/2+100,s_oSpriteLibrary.getSprite("but_restart"),_oContainerPanel);
        _oButRestart.addEventListener(ON_MOUSE_UP,this._onRestart,this);
        
        _iStartY = -oSpriteBg.height/2;
        
        _oContainerPanel.regX = _iHalfWidthPanel;
        _oContainerPanel.regY = oSpriteBg.height/2;

        window.addEventListener('keydown', this.onKeyDown , this);
    };

    this.onKeyDown = function(evt) {

       
    
        if(!evt){ 
            evt = window.event;
        }  
        //NextPanel 
       


        if(evt.keyCode == 40 && STRICKNO >= 3 ){
            
            _oThis.disableButtons();
            $(s_oMain).trigger("show_interlevel_ad");
            _iEventToLaunch = ON_BACK_MENU;
            
            _oThis.hide();
           
            
        }

       /* if(evt.keyCode == 32 && STRICKNO >= 3 ){
            console.log(STRICKNO);
            _oThis.disableButtons();
            $(s_oMain).trigger("show_interlevel_ad");
            _iEventToLaunch = ON_BACK_MENU;
            
            _oThis.hide();
            
        }*/

        
        
        evt.preventDefault();
        return false;
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.show = function(iTotScore, iPOs){
        var oSound = playSound("level_win",1,false);
        oSound.on('end', function(){
            setVolume("soundtrack",1);
        });

        _oHighScore = getLevelScore(1);
        _oTotScoreText.refreshText("Score" + " " + iTotScore + "\n HighScore is " + getLevelScore(1));
        
        _oFade.alpha=0;
        _oContainerPanel.y = _iStartY;
        _oContainer.visible = true;
        
        createjs.Tween.get(_oFade).to({alpha:0.7}, 500);
        createjs.Tween.get(_oContainerPanel).wait(500).to({y:CANVAS_HEIGHT/2}, 800,createjs.Ease.cubicOut).call(function(){
                                                                                                                        _oThis.enableButtons();
                                                                                                                  
                                                                                                                    });
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainerPanel).to({y:_iStartY}, 1000,createjs.Ease.backIn).call(function(){
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
        $(s_oMain).trigger("show_interlevel_ad");
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


    
    this._init();
}