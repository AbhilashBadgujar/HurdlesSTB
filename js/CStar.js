function CStar(iX,iY,oParentContainer){
    var _iCurScale = 1;
    var _oStarBg;
    var _oStarFg;
    
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    this._init = function(iX,iY){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer.addChild(_oContainer);
        
        
        var oStarSprite = s_oSpriteLibrary.getSprite("star");
        var oData = {
            images: [oStarSprite],
            // width, height & registration point of each sprite
            frames: {width: oStarSprite.width/2, height: oStarSprite.height,regX:(oStarSprite.width/2)/2,regY:oStarSprite.height/2},
            animations: {star_off:0,star_on:1}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oStarBg = createSprite(oSpriteSheet,"star_off",(oStarSprite.width/2)/2,oStarSprite.height/2,oStarSprite.width/2,oStarSprite.height);
        _oContainer.addChild(_oStarBg);
        
        _oStarFg = createSprite(oSpriteSheet,"star_on",(oStarSprite.width/2)/2,oStarSprite.height/2,oStarSprite.width/2,oStarSprite.height);
        _oStarFg.visible = false;
        _oContainer.addChild(_oStarFg);
    };
    
    this.reset = function(){
        _oStarFg.visible = false;
    };
    
    this.show = function(iWaitTime){
        _oStarFg.scaleX = _oStarFg.scaleY = 0.01;
        _oStarFg.visible = true;
        createjs.Tween.get(_oStarFg).wait(iWaitTime).to({scaleX: _iCurScale,scaleY:_iCurScale}, 800, createjs.Ease.backOut).call(function(){});
    };
    
    this.setOn = function(){
        _oStarFg.visible = true;
        _oStarBg.visible = false;
        
    };
    
    this.setScale = function(iScale){
        _iCurScale = iScale;
        _oContainer.scaleX = _oContainer.scaleY = iScale;
    };
    
    this._init(iX,iY);
}