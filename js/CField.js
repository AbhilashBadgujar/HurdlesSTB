function CField(oParentContainer){
    var ARRIVAL_LINE_Y;
    var _aCbCompleted;
    var _aCbOwner;
    
    var _oStartSprite;
    var _oLoopSprite;
    var _oArrivalSprite;
    var _oContainer;
    var _oParentContainer;
    
    this._init = function(){
        ARRIVAL_LINE_Y = [0,0,0,0,3,3,3,3,6,6,6,9,9,12,12,15,18,20,22,24,26,29,32,34,36,40,43,47,
                     50,55,59,65,65,70,75,80,87,94,102,110,118,128,138,149,161,174,
                     187,202,218,235,252,271,291,311,331,352,371,390,407,421];
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);

        var oSpriteRef = s_oSpriteLibrary.getSprite('bg_game_0');
        var iWidth = oSpriteRef.width;
        var iHeight = oSpriteRef.height;
        //ARRIVAL ANIM
        var aSprites = new Array();
        for(var i=51;i<111;i++){
            
            aSprites.push(s_oSpriteLibrary.getSprite('bg_game_'+i))
        }
       
        var oData = {
            framerate:30,
            images: aSprites,
            // width, height & registration point of each sprite
            frames: {width: iWidth, height: iHeight},
            animations: {start:0,anim:[0,59,"stop"],stop:59}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oArrivalSprite = createSprite(oSpriteSheet,"start",0,0,iWidth,iHeight);
        _oArrivalSprite.on("animationend",this.onArrivalAnimationEnd,this);
        _oContainer.addChild(_oArrivalSprite);
        
        //LOOP ANIM
        aSprites = new Array();
        for(var i=20;i<51;i++){
            aSprites.push(s_oSpriteLibrary.getSprite('bg_game_'+i))
        }
       
        var oData = {
            framerate:30,
            images: aSprites,
            // width, height & registration point of each sprite
            frames: {width: iWidth, height: iHeight},
            animations: {start:0,anim:[0,30]}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oLoopSprite = createSprite(oSpriteSheet,"start",0,0,iWidth,iHeight);
        _oContainer.addChild(_oLoopSprite);
        
        
        //START ANIM
        aSprites = new Array();
        for(var i=0;i<20;i++){
            aSprites.push(s_oSpriteLibrary.getSprite('bg_game_'+i))
        }
       
        var oData = {
            framerate:30,
            images: aSprites,
            // width, height & registration point of each sprite
            frames: {width: iWidth, height: iHeight},
            animations: {start:0,anim:[0,19,"stop"],stop:19}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oStartSprite = createSprite(oSpriteSheet,"start",0,0,iWidth,iHeight);
        _oStartSprite.on("animationend",this.onStartAnimationEnd,this);
        _oContainer.addChild(_oStartSprite);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.reset = function(){
        _oStartSprite.gotoAndStop("start");
        _oLoopSprite.gotoAndStop("start");
        _oArrivalSprite.gotoAndStop("start");
        _oStartSprite.visible = true;
        _oLoopSprite.visible = true;
        _oArrivalSprite.visible = true;
    };
    
    this.unpause = function(){
      
        _oLoopSprite.play();

    };
    
    this.pause = function(){
   
        _oLoopSprite.stop();

    };
    
    this.onStartAnimationEnd = function(evt){
   
      if(evt.name === "anim"){
          _oStartSprite.stop();
          _oStartSprite.visible = false;
          _oLoopSprite.gotoAndPlay("anim");
      }
    };
    
    this.onArrivalAnimationEnd = function(evt){
        if(evt.name === "anim"){
          if(_aCbCompleted[ON_ARRIVAL]){
            _aCbCompleted[ON_ARRIVAL].call(_aCbOwner[ON_ARRIVAL]);
          }
      }
    };
    
    this.start = function(){
        _oStartSprite.gotoAndPlay("anim");
    };
    
    this.playArrival = function(){
        _oLoopSprite.stop();
        _oLoopSprite.visible = false;
        _oArrivalSprite.gotoAndPlay("anim");
    };
    
    this.hide = function(){
        _oContainer.visible = false;
    };
    
    this.getCurArrivalLineY = function(){
        return ARRIVAL_LINE_Y[_oArrivalSprite.currentFrame];
    };

    _oParentContainer = oParentContainer;
    this._init();
}