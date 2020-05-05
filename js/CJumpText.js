function CJumpText (szText,x,y,szColor,oParentContainer){
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    this._init = function(szText,x,y,szColor){
        _oContainer = new createjs.Container();
        _oContainer.x = x;
        _oContainer.y = y;
        _oContainer.alpha = 0;
        _oParentContainer.addChild(_oContainer);
        
        var oText = new createjs.Text(szText,"40px "+FONT_GAME, szColor);
        oText.textAlign="center";
        oText.shadow = new createjs.Shadow("#000", 1, 1, 1);
        _oContainer.addChild(oText);
        
        var oRect = _oContainer.getBounds();
        _oContainer.cache(oRect.x, oRect.y, oRect.width, oRect.height);
        
        var oParent = this;
        createjs.Tween.get(_oContainer).to({alpha:1}, 200, createjs.Ease.quadIn).call(function(){oParent.moveUp();});  
    };
	
    this.moveUp = function(){
        var iNewY = _oContainer.y-400;
        var oParent = this;
        createjs.Tween.get(_oContainer).to({y:iNewY}, 1500, createjs.Ease.sineIn).call(function(){oParent.unload();});
        createjs.Tween.get(_oContainer).wait(800).to({alpha:0}, 500);
    };
	
    this.unload = function(){
        _oParentContainer.removeChild(_oContainer);
    };
	
    this._init(szText,x,y,szColor);
    
}