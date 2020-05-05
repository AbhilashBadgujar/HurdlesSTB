function CHelpPanel(){
    var _iCurText;
    var _iIntervalId;
    var _aHelpText;
    var _aCbCompleted;
    var _aCbOwner;
    var _oListener;
    
    var _oFade;
    var _oFade2;
    var _oButNext;
    var _oContainer;
    
    var _oThis = this;
    
    this._init = function(){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        s_oStage.addChild(_oContainer);
        
        _oFade = createBitmap(s_oSpriteLibrary.getSprite("fade_help"));
        _oContainer.addChild(_oFade);
        
        _oFade2 = createBitmap(s_oSpriteLibrary.getSprite("fade_help_2"));
        _oFade2.visible=false;
        _oContainer.addChild(_oFade2);
        
        _aHelpText = new Array();
        var oText = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-380, 34, 300, 114, 
                    80, "right", "#fff", FONT_GAME, 1,
                    0, 0,
                    TEXT_TUTORIAL_0,
                    true, true, true,
                    false);
                    
        _aHelpText.push(oText);
        
        var oText = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2+80, 34, 300, 114, 
                    80, "left", "#fff", FONT_GAME, 1,
                    0, 0,
                    "",
                    true, true, true,
                    false);
                    
        _aHelpText.push(oText);
        
        var oText = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-200, 304, 400, 114, 
                    80, "center", "#f00", FONT_GAME, 1,
                    0, 0,
                    "",
                    true, true, true,
                    false);
                    
        _aHelpText.push(oText);
        
        
        _oButNext = new CGfxButton(CANVAS_WIDTH/2,CANVAS_HEIGHT/2-50,s_oSpriteLibrary.getSprite("but_next"),_oContainer);
        _oButNext.addEventListener(ON_MOUSE_UP,this._onNext,this);

        window.addEventListener('keydown', this.onKeyDown , this);	
    };

    this.onKeyDown = function(evt) {

        
        if(!evt){ 
            evt = window.event;
        }  
        //NextPanel 
       

        if(evt.keyCode == 32 || evt.keyCode == 13){
            _oThis._showNextText();
            //console.log(evt.keyCode);
        }

        
        
        evt.preventDefault();
        return false;
    };
    


    this.unload = function(){
        _oFade.off("click",_oListener);
        window.removeEventListener("keydown", this.onKeyDown);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.show = function(){
        _iCurText = 0;
        
        _oContainer.alpha = 0;
        _oContainer.visible = true;
        createjs.Tween.get(_oContainer).to({alpha:1},500);
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainer).to({alpha:0} , 500,createjs.Ease.cubicOut).call(function(){
                                                                                    clearInterval(_iIntervalId);
                                                                                    _oContainer.visible = false;
                                                                                    s_oGame.unpauseGame();
                                                                                });
    };
    
    this._showNextText = function(){
        _iCurText++;
        
        switch(_iCurText){
            case 1:{
                    _aHelpText[_iCurText-1].refreshText("");
                    _aHelpText[_iCurText].refreshText(TEXT_TUTORIAL_1);
                    break;
            }
            case 2:{
                    _oFade.visible = false;
                    _oFade2.visible=true;
                    _aHelpText[_iCurText-1].refreshText("");
                    _aHelpText[_iCurText].refreshText(TEXT_TUTORIAL_2);
                    break;
            }
            case 3:{
                    _oThis.hide();
                    break;
            }
        }
        
        if(_aCbCompleted[ON_REFRESH_TUTORIAL_INFO]){
            _aCbCompleted[ON_REFRESH_TUTORIAL_INFO].call(_aCbOwner[ON_REFRESH_TUTORIAL_INFO],_iCurText);
        }
    };
    
    this._onNext = function(){
        _oThis._showNextText();
    };
    
    this.isVisible = function(){
        return _oContainer.visible;
    };
    
    this._init();
}