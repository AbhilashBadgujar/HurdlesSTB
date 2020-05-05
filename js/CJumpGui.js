function CJumpGui(iX,iY,oParentContainer){
    var _bDisable;
    var _aCbCompleted;
    var _aCbOwner;
    var _oListener;
    
    var _oText;
    var _oBg;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    
    this._init = function(iX,iY){
        _bDisable = true;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oListener = _oContainer.on("mousedown",this._onJump,this);
        _oParentContainer.addChild(_oContainer);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite("fade_bg"));
        oBg.alpha = 0.01;
        _oContainer.addChild(oBg);
        
        var oSprite = s_oSpriteLibrary.getSprite("but_jump");
        var oData = {
            images: [oSprite],
            // width, height & registration point of each sprite
            frames: {width: 380, height: 76,regX:oSprite.width/2,regY:38},
            animations: {idle: 0,jump_green:1,jump_yellow:2,jump_red:3}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oBg = createSprite(oSpriteSheet,"idle",oSprite.width/2,38,380,76);
        _oBg.x = iX;
        _oBg.y = iY;
        _oContainer.addChild(_oBg);
        
        _oText = new CTLText(_oContainer, 
                    iX-93, iY-8, 250, 35, 
                    35, "center", "#ffffff", FONT_GAME, 1,
                    0, 0,
                    TEXT_JUMP,
                    true, true, false,
                    false );

    };
    
    this.unload = function(){
        _oContainer.off("mousedown",_oListener);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.reset = function(){
        _oContainer.visible = false;
        _bDisable = false;
        _oText.setColor("#fff");
        _oBg.gotoAndStop("idle");
    };
    
    this.disable = function(bDisable){
        _bDisable = bDisable;
    };
    
    this.show = function(){
        this.reset();
        
        _oContainer.visible = true;
        _oContainer.alpha = 0;
        createjs.Tween.get(_oContainer).to({alpha:1}, 400, createjs.Ease.cubicOut);
        
       
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainer).to({alpha:0}, 400, createjs.Ease.cubicOut);
    };

    this.setState = function(iCorrectJump){
        switch(iCorrectJump){
            case JUMP_BAD:{
                    _oText.setColor("#ce1b12");
                    _oBg.gotoAndStop("jump_red");
                    break;
            }
            case JUMP_GOOD:{
                    _oText.setColor("#ebdd00");
                    _oBg.gotoAndStop("jump_yellow");
                    break;
            }
            case JUMP_PERFECT:{
                    _oText.setColor("#12ce57");
                    _oBg.gotoAndStop("jump_green");
                    break;
            }
        }
        
    };
    
    this._onJump = function(){
        if(_bDisable){
            return;
        }
        
        _bDisable = true;
        
        if(_aCbCompleted[ON_JUMP]){
           _aCbCompleted[ON_JUMP].call(_aCbOwner[ON_JUMP]);
        }

    };
    
    this.isDisabled = function(){
        return _bDisable;
    };
    
    this._init(iX,iY);
}