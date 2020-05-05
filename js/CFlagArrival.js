function CFlagArrival(iX,iY,oParentContainer){
    var _iStartX = iX;
    var _oFlag;
    var _oText;
    
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    this._init = function(iX,iY){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("flags");
        var oData = {
            images: [oSprite],
            // width, height & registration point of each sprite
            frames: [
                    [1, 1, 105, 62, 0, 52.5, 31],
                    [108, 1, 105, 62, 0, 52.5, 31],
                    [1, 65, 105, 62, 0, 52.5, 31],
                    [108, 65, 105, 62, 0, 52.5, 31],
                    [1, 129, 105, 62, 0, 52.5, 31],
                    [108, 129, 105, 62, 0, 52.5, 31],
                    [1, 193, 105, 62, 0, 52.5, 31],
                    [108, 193, 105, 62, 0, 52.5, 31]
                ],
            animations: {flag_0: 0, flag_1: 1, flag_2: 2, flag_3: 3, flag_4: 4, flag_5: 5, flag_6: 6, flag_7: 7}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oFlag = new createjs.Sprite( oSpriteSheet,"flag_7");
        _oFlag.x = 60;
        _oFlag.y = 19;
        _oFlag.scaleX = _oFlag.scaleY = 0.54;
        _oContainer.addChild(_oFlag);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite("flag_panel"));
        _oContainer.addChild(oBg);
        
        
        _oText = new CTLText(_oContainer, 
                    8, 7, 20, 28, 
                    28, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    "1",
                    true, true, false,
                    false );
    };
    
    this.show = function(iFlag,iPlace){
        _oFlag.gotoAndStop("flag_"+iFlag);
        _oText.refreshText(iPlace);
        
        createjs.Tween.get(_oContainer).to({x: 110}, 1000, createjs.Ease.quartOut);
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainer).to({x: _iStartX}, 1000, createjs.Ease.quartOut);
    };
    
    this._init(iX,iY);
}