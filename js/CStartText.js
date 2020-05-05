function CStartText(iX,iY,oParentContainer){
    var _iStartX = iX;
    var _oTextOutline;
    var _oText;
    var _oContainer;
    var _oParentContainer = oParentContainer;

    
    this._init = function(iX,iY){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer.addChild(_oContainer);
        
        _oTextOutline = new CTLText(_oContainer, 
                    0, 0, 560, 56, 
                    56, "center", "#012a2f", FONT_GAME, 1,
                    0, 0,
                    TEXT_START_0,
                    true, true, false,
                    false );
        
        _oTextOutline.setOutline(4);
        
        _oText = new CTLText(_oContainer, 
                    0, 0, 560, 56, 
                    56, "center", "#ffffff", FONT_GAME, 1,
                    0, 0,
                    TEXT_START_0,
                    true, true, false,
                    false );
    };
    
    this.reset = function(){
       
        _oContainer.x = _iStartX;
        _oContainer.alpha = 1;
        _oText.refreshText(TEXT_START_0);
        _oTextOutline.refreshText(TEXT_START_0);
    };
    
    this.show = function(){
        playSound("on_your_marks",1,false);
        createjs.Tween.get(_oContainer).wait(2000).to({x:-560}, 400, createjs.Ease.quartOut).call(function(){
                                                                    _oContainer.x = CANVAS_WIDTH;
                                                                    _oText.refreshText(TEXT_START_1);
                                                                    _oTextOutline.refreshText(TEXT_START_1);
                                                                    playSound("set",1,false);
                                                                    createjs.Tween.get(_oContainer).to({x:CANVAS_WIDTH/2-280}, 400, createjs.Ease.quartOut);
                                                                    
                                                                    s_oGame.prepareRunners();
                                                                });
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainer).to({alpha:0}, 800, createjs.Ease.quartOut).call(function(){});
    };
   
    
    this._init(iX,iY);
}