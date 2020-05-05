function CObstacleJumpArea(iDifficulty,oParentContainer){
    var _iPathHeight;
    var _iFinalY;
    var _iStartPos;
    var _iStartScale;
    var _iDifficulty = iDifficulty;
    var _aCbCompleted;
    var _aCbOwner;
    
    var _oTweenAlpha = null;
    var _oTweenPos = null;
    var _oPath;
    var _oPathPerfect;
    var _oHighlight;
    var _oHighlightPerfect;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    var _oThis = this;



    
    this._init = function(){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oParentContainer.addChild(_oContainer);
        
        var oSpritePath = s_oSpriteLibrary.getSprite("path_"+_iDifficulty);
        _oPath = createBitmap(oSpritePath);
        _oContainer.addChild(_oPath);
        
        _oHighlight = createBitmap(s_oSpriteLibrary.getSprite("path_highlight_"+iDifficulty));
        _oHighlight.x = JUMP_AREA_HIGHLIGHT[iDifficulty].offsetx;
        _oHighlight.y = JUMP_AREA_HIGHLIGHT[iDifficulty].offsety;
        _oHighlight.alpha = 0;
        _oContainer.addChild(_oHighlight);
        
        _oPathPerfect = createBitmap(s_oSpriteLibrary.getSprite("path_perfect_"+_iDifficulty));
        _oContainer.addChild(_oPathPerfect);
        
        _oHighlightPerfect = createBitmap(s_oSpriteLibrary.getSprite("path_perfect_highlight_"+iDifficulty));
        _oHighlightPerfect.alpha = 0;
        _oContainer.addChild(_oHighlightPerfect);
        
        _iPathHeight = oSpritePath.height;
        
        _iStartScale = 0.09;
        _iFinalY = CANVAS_HEIGHT+(OBSTACLE_HEIGHT*1.4);
        
        _oContainer.regX = oSpritePath.width/2;
        _oContainer.scaleX = _oContainer.scaleY = _iStartScale;
        
        
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.removeEventListener = function(iEvent){
        _aCbCompleted[iEvent] = null;
        _aCbOwner[iEvent] = null;
    };
    
    this.unpause = function(){
        if(_oTweenAlpha !== null){
            _oTweenAlpha.paused = false;
        }
        
        if(_oTweenPos !== null){
            _oTweenPos.paused = false;
        }
    };
    
    this.pause = function(){
        if(_oTweenAlpha !== null){
            _oTweenAlpha.paused = true;
        }
        
        if(_oTweenPos !== null){
            _oTweenPos.paused = true;
        }
    };
    
    this.show = function(iX,iY){
        _oContainer.alpha = 0;
        
        _iStartPos = iY;
        _oContainer.x = iX;
        _oContainer.y = iY*_iStartScale;
        
        _oContainer.visible = true;
        
        _oTweenAlpha = createjs.Tween.get(_oContainer).wait(400).to({alpha:1}, 1000, createjs.Ease.cubicOut).call(function(){
                                                                                            if(_aCbCompleted[ON_SHOW_JUMP_AREA]){
                                                                                                _aCbCompleted[ON_SHOW_JUMP_AREA].call(_aCbOwner[ON_SHOW_JUMP_AREA]);
                                                                                            }
                                                                                });
        _oTweenPos = createjs.Tween.get(_oContainer).to({y: _iFinalY+iY, scaleX: 1.4, scaleY:1.4}, TIME_SPAWN_OBSTACLE, createjs.Ease.getPowIn(4)).call(function(){
                                                                                        _oThis.reset();
                                                                                });
    };
    
    this.checkIfPlayerInGreenArea = function(){
        
        var iPointEnd = _oContainer.y+(_iPathHeight*_oContainer.scaleY); 

        if(_oContainer.y < JUMP_Y_CHECKPOINT && iPointEnd>JUMP_Y_CHECKPOINT){
            var iPointPerfectEnd = (_oContainer.y + (RECT_PERFECT_AREAS[_iDifficulty].y*_oContainer.scaleY)) + (RECT_PERFECT_AREAS[_iDifficulty].height*_oContainer.scaleY); 
            if( (_oContainer.y + (RECT_PERFECT_AREAS[_iDifficulty].y*_oContainer.scaleY))<JUMP_Y_CHECKPOINT && iPointPerfectEnd>JUMP_Y_CHECKPOINT) {
                return JUMP_PERFECT;
            }
            return JUMP_GOOD;
        }
        
        return JUMP_BAD;
        
    };
    
    this.reset = function(){
        this.stopHighlightPerfectArea();
        this.stopHighlightArea();
        _oContainer.y = _iStartPos;
        _oContainer.scaleX = _oContainer.scaleY = _iStartScale;
        _oContainer.visible = false;
        
        
    };
    
    this.highlightArea = function(bLoop){
        var iNumLoop = bLoop?-1:1;
        createjs.Tween.get(_oHighlight,{loop:iNumLoop}).to({alpha: 1}, 1000, createjs.Ease.cubicOut).to({alpha:0},1000,createjs.Ease.cubicOut);
    };
    
    this.stopHighlightArea = function(){
        _oHighlight.alpha = 0;
        createjs.Tween.removeTweens(_oHighlight);
    };
    
    this.highlightPerfectArea = function(bLoop){
        var iNumLoop = bLoop?-1:1;
        createjs.Tween.get(_oHighlightPerfect,{loop:iNumLoop}).to({alpha: 1}, 1000, createjs.Ease.cubicOut).to({alpha:0},1000,createjs.Ease.cubicOut);
    };
    
    this.stopHighlightPerfectArea = function(){
        _oHighlightPerfect.alpha = 0;
        createjs.Tween.removeTweens(_oHighlightPerfect);
    };
    
    this.getY = function(){
        return _oContainer.y;
    };
 
    this._init(iDifficulty);
}