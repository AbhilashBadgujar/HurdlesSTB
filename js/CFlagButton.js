function CFlagButton(iX,iY,iIndex,oParentContainer){
    var _bDisable;
    var _aCbCompleted;
    var _aCbOwner;
    var _aParams = [];
    var _oListenerDown;
    var _oListenerRelease;
    
    var _oButton;
    var _oParentContainer = oParentContainer;
    
    this._init =function(iXPos,iYPos,iIndex){
        _bDisable = false;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
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
        _oButton = new createjs.Sprite( oSpriteSheet,"flag_"+iIndex);
        _oButton.x = iXPos;
        _oButton.y = iYPos; 
        _oButton.cursor = "pointer";
        _oParentContainer.addChild(_oButton);
        
        
        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown", _oListenerDown);
       _oButton.off("pressup" , _oListenerRelease); 
       
       _oParentContainer.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this._initListener = function(){
       _oListenerDown = _oButton.on("mousedown", this.buttonDown);
       _oListenerRelease = _oButton.on("pressup" , this.buttonRelease);      
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.addEventListenerWithParams = function(iEvent,cbCompleted, cbOwner,aParams){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };
    
    this.enable = function(){
        _bDisable = false;
    };
    
    this.disable = function(){
        _bDisable = true;
    };
    
    this.buttonRelease = function(){
        if(_bDisable){
            return;
        }
        
        playSound("click",1,false);
        
        _oButton.scaleX = 1;
        _oButton.scaleY = 1;

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_aParams);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisable){
            return;
        }
        
        _oButton.scaleX = 0.9;
        _oButton.scaleY = 0.9;

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN],_aParams);
       }
    };
    
    this.setPosition = function(iXPos,iYPos){
        _oButton.x = iXPos;
        _oButton.y = iYPos;
    };
    
    this.setX = function(iXPos){
         _oButton.x = iXPos;
    };
    
    this.setY = function(iYPos){
        _oButton.y = iYPos;
    };
    
    this.getButtonImage = function(){
        return _oButton;
    };
    
    
    this.getX = function(){
        return _oButton.x;
    };
    
    this.getY = function(){
        return _oButton.y;
    };

    this._init(iX,iY,iIndex);
    
}