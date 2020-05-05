function CFinalPosTextAnim(oParentContainer){
    var _oTextPosOutline;
    var _oTextPos;
    var _oTextPlaceOutline;
    var _oTextPlace;
    
    var _oContainerPos;
    var _oContainerPlace;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oParentContainer.addChild(_oContainer);
        
        _oContainerPos = new createjs.Container();
        _oContainerPos.x = -200;
        _oContainerPos.y = CANVAS_HEIGHT/2-180;
        _oContainer.addChild(_oContainerPos);
        
        _oTextPosOutline = new CTLText(_oContainerPos, 
                    0,0 , 400, 80, 
                    80, "center", "#012a2f", FONT_GAME, 1,
                    0, 0,
                    "1",
                    true, true, false,
                    false );
        
        _oTextPosOutline.setOutline(4);
        
        _oTextPos = new CTLText(_oContainerPos, 
                    0,0 , 400, 80, 
                    80, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    "1",
                    true, true, false,
                    false );
                    
        
        _oContainerPlace = new createjs.Container();
        _oContainerPlace.x = -200;
        _oContainerPlace.y = CANVAS_HEIGHT/2-100;
        _oContainer.addChild(_oContainerPlace);
        
        _oTextPlaceOutline = new CTLText(_oContainerPlace, 
                    0, 0, 400, 80, 
                    80, "center", "#012a2f", FONT_GAME, 1,
                    0, 0,
                    TEXT_PLACE,
                    true, true, false,
                    false );
        
        _oTextPlaceOutline.setOutline(4);
        
        _oTextPlace = new CTLText(_oContainerPlace, 
                    0, 0, 400, 80, 
                    80, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    TEXT_PLACE,
                    true, true, false,
                    false );
    };
    
    this.show = function(iPos){
        var szSuffix = TEXT_OTHER_POS;
        if(iPos === 1){
            szSuffix = TEXT_ST;
        }else if(iPos === 2){
            szSuffix = TEXT_ND;
        }else if(iPos === 3){
            szSuffix = TEXT_RD;
        }
        _oTextPos.refreshText(iPos+szSuffix);
        _oTextPosOutline.refreshText(iPos+szSuffix);
        _oContainer.visible=true;
        
        createjs.Tween.get(_oContainerPos).to({x:CANVAS_WIDTH/2-200}, 1500, createjs.Ease.cubicOut).to({x:CANVAS_WIDTH},300,createjs.Ease.quartIn);
        createjs.Tween.get(_oContainerPlace).wait(500).to({x:CANVAS_WIDTH/2-200}, 1000, createjs.Ease.cubicOut).to({x:CANVAS_WIDTH},500,createjs.Ease.quartIn).
                                                                        call(function(){
                                                                            _oContainer.visible = false;
                                                                        });
    };
    
    this._init();
}