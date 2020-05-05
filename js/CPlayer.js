function CPlayer(iLane,iTeam,iIncreaseOffsetLerp,iTimeIncreasLerp,iDecreaseOffsetLerp,oParentContainer,CurLerp){
    
    var _bUpdate;
    var _bJumping;
    var _bMustJump;
    var _bArrived;
    var _iLane = iLane-1;
    var _iTimeElaps;
    var _iTimeMoving;
    var _iIntervalId;
    var _iDecreaseOffsetLerp;
    var _iIncreaseOffsetLerp;
    var _iNumPerfectJump;
    var _fCurLerp;
    var _iTimeIncreaseLerp;
    var _aCbCompleted;
    var _aCbOwner;
    var _pStartingPoint;
    var _pEndingPoint;
    
    
    var _oSpriteJump;
    var _oSpriteRun;
    var _oSpriteStart;
    var _oSpritePrepare;
    var _oContainer;
    var _oParentContainer;
    
    var _oThis = this;
        
    this._init = function(iLane,iTeam,iIncreaseOffsetLerp,iTimeIncreasLerp,iDecreaseOffsetLerp){
        _fCurLerp = CurLerp;
        console.log(_fCurLerp); 
        _iTimeMoving = LANE_INFOS[_iLane].time_move;
        

        _aCbCompleted=new Array();
        _aCbOwner =new Array();

        _pStartingPoint = LANE_INFOS[_iLane].start;
        _pEndingPoint = LANE_INFOS[_iLane].end;

        
 
        var oPoint = tweenVectors(_pStartingPoint, _pEndingPoint, _fCurLerp);
        
        _oContainer = new createjs.Container();
        _oContainer.x = oPoint.x;
        _oContainer.y = oPoint.y;
        _oParentContainer.addChild(_oContainer);
    
      

        
        //JUMP ANIM
        var oData = {
            images: [s_oSpriteLibrary.getSprite("player_"+iTeam+"_lane_"+iLane+"_jump")],
            // width, height & registration point of each sprite
            frames: JUMP_SPRITESHEET_FRAMES[iTeam][_iLane],
            animations: {start:0,anim:[0,17,"start"]}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oSpriteJump = new createjs.Sprite(oSpriteSheet,"start");
        
        _oSpriteJump.on("animationend",this._onJumpAnimEnd,this);
        _oContainer.addChild(_oSpriteJump);


        
        //PREPARE ANIM
        var oData = {
            images: [s_oSpriteLibrary.getSprite("player_"+iTeam+"_lane_"+iLane+"_prepare")],
            // width, height & registration point of each sprite
            frames: PREPARE_SPRITESHEET_FRAMES[iTeam][_iLane],
            animations: {start:0,anim:[0,10,"stop_anim"],stop_anim:10}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oSpritePrepare = new createjs.Sprite(oSpriteSheet,"start");
        _oContainer.addChild(_oSpritePrepare);
        
       
 
        //RUN ANIM
        var oData = {
            images: [s_oSpriteLibrary.getSprite("player_"+iTeam+"_lane_"+iLane+"_run")],
            // width, height & registration point of each sprite
            frames: RUN_SPRITESHEET_FRAMES[iTeam][_iLane],
            animations: {start:0,run_0:[2,14,"anim"],run_1:[5,14,"anim"],run_2:[7,14,"anim"],anim:[0,14]}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oSpriteRun= new createjs.Sprite(oSpriteSheet,"start");
        
        _oContainer.addChild(_oSpriteRun);
        
        
        //START ANIM
        var aSprites = [s_oSpriteLibrary.getSprite("player_"+iTeam+"_lane_"+iLane+"_start")];
        for(var k=1;k<START_SPRITESHEET_PAGES_PER_LANE[_iLane];k++){
            aSprites.push(s_oSpriteLibrary.getSprite("player_"+iTeam+"_lane_"+iLane+"_start_"+k));
        }
        
        var oData = {
            images: aSprites,
            // width, height & registration point of each sprite
            frames: START_SPRITESHEET_FRAMES[iTeam][_iLane],
            animations: {start:0,anim:[0,39,"stop_anim"],stop_anim:40}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oSpriteStart= new createjs.Sprite(oSpriteSheet,"start");

        
        _oSpriteStart.on("animationend",this._onStartAnimEnd,this);
        _oContainer.addChild(_oSpriteStart);
        
        this.reset(iIncreaseOffsetLerp,iTimeIncreasLerp,iDecreaseOffsetLerp);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.reset = function(iIncreaseOffsetLerp,iTimeIncreasLerp,iDecreaseOffsetLerp){
        _bJumping = false;
        _bUpdate = false;
        _bMustJump = true;
        _bArrived = false;
        
        _iIntervalId = null;
        _iTimeElaps = 0;
        _fCurLerp = 0.35;
        _iIncreaseOffsetLerp = iIncreaseOffsetLerp;
        _iDecreaseOffsetLerp = iDecreaseOffsetLerp;
        _iTimeIncreaseLerp = iTimeIncreasLerp;
        _iNumPerfectJump = 0;
       
        _oSpritePrepare.alpha=1;
        _oSpriteJump.alpha =0;
        _oSpriteRun.alpha=0;
        _oSpriteStart.alpha = 0;
        
        _oSpritePrepare.gotoAndStop("start");
        
        var oPoint = tweenVectors(_pStartingPoint, _pEndingPoint, _fCurLerp);
        _oContainer.x = oPoint.x;
        _oContainer.y = oPoint.y;
        _oContainer.scaleX = _oContainer.scaleY = 1;
        _oContainer.visible = true;
    };
    
    this.show = function(){
        _oContainer.visible = true;
    };
    
    this.hide = function(){
        _oContainer.visible = false;
    };
    
    this.pause = function(){
        _bUpdate = false;
        if(_oSpriteJump.alpha === 1){
            _oSpriteJump.stop();
        }else if(_oSpritePrepare.alpha === 1){
            _oSpritePrepare.stop();
        }else if(_oSpriteRun.alpha === 1){
            _oSpriteRun.stop();
        }else if(_oSpriteStart.alpha === 1){
            _oSpriteStart.stop();
        }
    };
   
   this.unpause = function(){
        _bUpdate = true;
        if(_oSpriteJump.alpha === 1){
            _oSpriteJump.play();
        }else if(_oSpritePrepare.alpha === 1){
            _oSpritePrepare.play();
        }else if(_oSpriteRun.alpha === 1){
            _oSpriteRun.play();
        }else if(_oSpriteStart.alpha === 1){
            _oSpriteStart.play();
        }
    };
    
   this.prepareStart = function(){
       _oSpritePrepare.gotoAndPlay("anim");
   };
   
   this.startRun = function(){

       _oSpritePrepare.alpha = 0;
       _oSpriteStart.visible = true;
       _oSpriteStart.alpha = 1;
       _oSpriteStart.gotoAndPlay("anim");
   };
   
   this.prepareForJump = function(){
       _bMustJump = true;
   };

    
    this.jump = function(iCurJump){
        _bJumping = true;
        _bMustJump = false;
        if(iCurJump === JUMP_PERFECT){
            _iNumPerfectJump++;
        }

        _oSpriteRun.alpha = 0;
        _oSpriteJump.alpha=1;
        _oSpriteJump.gotoAndPlay("anim");
        
    };
    
    this._onJumpAnimEnd = function(evt){
        if(evt.currentTarget.currentAnimation === "anim"){
            _oSpriteJump.stop();

            _oSpriteJump.alpha=0;
            _oSpriteRun.alpha=1;
            _oSpriteRun.gotoAndPlay("anim");
            _bJumping = false;
        }
    };

    this._onStartAnimEnd = function(evt){
        if(evt.currentTarget.currentAnimation === "anim"){
            _oSpriteStart.stop();

            _oSpriteStart.alpha=0;
            _oSpriteRun.alpha=1;
            var iRandRun = Math.floor(Math.random()*3);
            _oSpriteRun.gotoAndPlay("run_"+iRandRun);
            _bUpdate = true;
        }
        
    };


    this.tweenOnTrack = function(fLerp,iTime){
        createjs.Tween.removeTweens(_oContainer);

        var oPoint = tweenVectors(_pStartingPoint, _pEndingPoint, fLerp);

        
        var iScale = tweenValue( 1.48, 0.1, fLerp );
        
        createjs.Tween.get(_oContainer).to({x:oPoint.x,y:oPoint.y,scaleX:iScale,scaleY:iScale}, iTime, createjs.Ease.circOut);
    };

    
    this.increasePositionOnTrack = function(CurLerp){
        _fCurLerp += _iIncreaseOffsetLerp;
        _fCurLerp = parseFloat(_fCurLerp.toFixed(3));
        _uPlayerPos = _fCurLerp;
        CurLerp = _fCurLerp;
        
        this.tweenOnTrack(_fCurLerp,_iTimeIncreaseLerp);
    };
    
    this.decreasePositionOnTrack = function(){

        _fCurLerp -= _iDecreaseOffsetLerp;
        _fCurLerp = parseFloat(_fCurLerp.toFixed(3));
       //trace("decrease POS "+iLane + " _iDecreaseOffsetLerp "+_iDecreaseOffsetLerp+" _fCurLerp "+_fCurLerp)
        if(_fCurLerp > 0){
            this.tweenOnTrack(_fCurLerp,TIME_DECREASE_LERP);
        }
    };
    
    this.moveOnTrack = function(){
        var oPoint = tweenVectors(_pStartingPoint, _pEndingPoint, _fCurLerp);
        
        var iScale = tweenValue( 1.48, 0.1, _fCurLerp );
        _oContainer.x = oPoint.x;
        _oContainer.y = oPoint.y;
        console.log(oPoint.y);
        _oContainer.scaleX = _oContainer.scaleY = iScale;
    };
    
    this.playFinalRun = function(){
        createjs.Tween.removeTweens(_oContainer);
        _bUpdate = false;

        var iOffsetLerp = 0.03;
        if(_fCurLerp < 0.35){
            iOffsetLerp = 0.04;
        }else if(_fCurLerp > 0.5){
            iOffsetLerp = 0.02;
        }
        
    
        _fCurLerp += iOffsetLerp;
        _oThis.moveOnTrack();  
        
        _iIntervalId = setInterval(function(){
                                      _fCurLerp += iOffsetLerp;
                                      _oThis.moveOnTrack();  
                                      
                                      if(_oContainer.y < 0){
                                        clearInterval(_iIntervalId);
                                        _oSpriteRun.stop();
                                        _oContainer.visible=false;
                                        
                                        if(_aCbCompleted[ON_PLAYER_ARRIVED]){
                                            _aCbCompleted[ON_PLAYER_ARRIVED].call(_aCbOwner[ON_PLAYER_ARRIVED],_iLane);
                                        }
                                      }else{
                                          
                                          if(iOffsetLerp <= 0.005){
                                              iOffsetLerp = 0.005;
                                          }else{
                                              iOffsetLerp -= 0.0008;
                                          }
                                      }
        },s_iTimeElaps);
    };
    
    this.setArrived = function(){
        _bUpdate = false;
        _bArrived = true;
    };
    
    this.isJumping = function(){
        return _bJumping;
    };
    
    this.isRunning = function(){
        return _oSpriteRun.alpha===0?false:true;
    };
    
    this.mustJump = function(){
        return _bMustJump;
    };
    
    this.getY = function(){
        return _oContainer.y; 
    };
    
    this.getScale = function(){
        return _oContainer.scaleY;
    };
    
    this.getNumPerfectJump = function(){
        return _iNumPerfectJump;
    };
    
    this.isArrived = function(){
        return _bArrived;
    };
    
    this.update = function(){       
        if(!_bUpdate){
            return;
        }

        _iTimeElaps += s_iTimeElaps;
        
        if(_iTimeElaps > _iTimeMoving && !createjs.Tween.hasActiveTweens(_oContainer)){
            _iTimeElaps = 0;
            this.decreasePositionOnTrack();
        }
    };

    
    _oParentContainer = oParentContainer;
    this._init(iLane,iTeam,iIncreaseOffsetLerp,iTimeIncreasLerp,iDecreaseOffsetLerp,CurLerp);
}