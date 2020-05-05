function CObstacleController(oParentContainer){

    var _iStartPos;
    var _iStartScale;
    var _iFinalY;

    var _aObstacles;
    var _oTween = null;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    var _oThis = this;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oParentContainer.addChild(_oContainer);
        
        _iStartPos = 0;
        _iStartScale = 0.09;
        _iFinalY = CANVAS_HEIGHT+(OBSTACLE_HEIGHT*1.4);
        var iX = 0;
        _aObstacles = new Array();
        for(var i=0;i<NUM_TEAMS;i++){
            var oData = {
                images: [s_oSpriteLibrary.getSprite("obstacle_"+i)],
                // width, height & registration point of each sprite
                frames:OBSTACLE_SPRITESHEET_FRAMES[i],
                animations: {start:0,fall:[1,11,"fallen"],fallen:11}
            };

            var oSpriteSheet = new createjs.SpriteSheet(oData);

            var oObstacleSprite = new createjs.Sprite(oSpriteSheet,"start");
            oObstacleSprite.x = iX;
            
            _oContainer.addChild(oObstacleSprite);
        
            _aObstacles.push(oObstacleSprite);
            
            iX += 283;
        }
        
        
        _oContainer.x = CANVAS_WIDTH/2;
        _oContainer.y = _iStartPos;
        _oContainer.regX = iX/2;
        _oContainer.scaleX = _oContainer.scaleY = _iStartScale;
    };
    
    this.reset = function(){
        _oContainer.y = _iStartPos;
        _oContainer.scaleX = _oContainer.scaleY = _iStartScale;
    };
    
    this.unpause = function(){
        if(_oTween !== null){
            _oTween.paused = false;
        }
    };
    
    this.pause = function(){
        if(_oTween !== null){
            _oTween.paused = true;
        }
    };
    
    this.showObstacleRow = function(){

        _oContainer.visible = true;
        
        for(var i=0;i<_aObstacles.length;i++){
            _aObstacles[i].gotoAndStop("start");
        }
        
   
        _oTween = createjs.Tween.get(_oContainer).to({y: _iFinalY, scaleX: 1.4, scaleY:1.4}, TIME_SPAWN_OBSTACLE, createjs.Ease.getPowIn(4)).call(function(){
                                                                                        s_oGame.checkRaceOver();
                                                                                        _oThis.resetObstacleRow();
                                                                                    });

    };
    
    this.resetObstacleRow = function(){
        _oContainer.y = _iStartPos;
        _oContainer.scaleX = _oContainer.scaleY = _iStartScale;
        _oContainer.visible = false;
    };
    
    
    this.topple = function(iIndex){
        _aObstacles[iIndex].gotoAndPlay("fall");
    };
    
    this.getY = function(){
        return _oContainer.y;
    };
    
    this.isVisible = function(){
        return _oContainer.visible;
    };

    
    this._init();
}