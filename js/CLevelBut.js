function CLevelBut(iXPos, iYPos, szTextMatch, iStars,szTextScore,bActive,oParentContainer) {
    var _bActive;
    var _iStars = iStars;
    var _aCbCompleted;
    var _aCbOwner;
    var _aButton = new Array();
    var _aParams = [];
    

    var _oLevelText;
    var _oScoreText;
    var _oButton;
    var _oContainer;
    var _oParentContainer;

    this._init = function (iXPos, iYPos, szTextMatch, szTextScore,bActive) {
        _aCbCompleted = new Array();
        _aCbOwner = new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
        _oParentContainer.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("obstacle_bg");
        var oData = {
            images: [oSprite],
            // width, height & registration point of each sprite
            frames: {width: oSprite.width / 2, height: oSprite.height, regX: (oSprite.width / 2) / 2, regY: oSprite.height / 2},
            animations: {state_true: [0], state_false: [1]}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _bActive = bActive;
        _oButton = createSprite(oSpriteSheet, "state_" + _bActive, (oSprite.width / 2) / 2, oSprite.height / 2, oSprite.width / 2, oSprite.height);
		
        if (!s_bMobile){
            _oContainer.cursor = "pointer";
        }
        
        _oContainer.addChild(_oButton);
        _aButton.push(_oButton);
        
        var iColorText = "#fff";
        if(_bActive === false){
            iColorText = "#9a9a9a";
        }

        _oLevelText = new CTLText(_oContainer, 
                    -oSprite.width / 4, -oSprite.height/2, oSprite.width / 2, oSprite.height, 
                    35, "center", iColorText, FONT_GAME, 1,
                    0, 0,
                    ""+szTextMatch,
                    true, true, true,
                    false );

   
        
        
        if(szTextScore>0){        

            _oScoreText = new CTLText(_oContainer, 
                        -oSprite.width / 2, oSprite.height/2, oSprite.width, 14, 
                        14, "center", "#fff", FONT_GAME, 1,
                        0, 0,
                        " ",
                        true, true, false,
                        false );
        }
   
        if(_iStars > 0){
            var oContainerStars = new createjs.Container();
            oContainerStars.x = 0;
            oContainerStars.y = -oSprite.height/2;
            _oContainer.addChild(oContainerStars);
            
            var iXStar = 0;
            for(var k=0;k<iStars;k++){
                var oStar = new CStar(iXStar,0,oContainerStars);
                oStar.setOn();
                oStar.setScale (0.3);
                
                iXStar += 18;
            }
            
            oContainerStars.regX = (oContainerStars.getBounds().width - 18)/2;
        }
        
        this._initListener();
    };

    this.unload = function () {
        _oContainer.off("mousedown", this.buttonDown);
        _oContainer.off("pressup", this.buttonRelease);

        _oContainer.removeChild(_oButton);
    };

    this._initListener = function () {
        _oContainer.on("mousedown", this.buttonDown);
        _oContainer.on("pressup", this.buttonRelease);
    };

    this.viewBut = function (oButton) {
        _oContainer.addChild(oButton);
    };

    this.addEventListener = function (iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };

    this.addEventListenerWithParams = function (iEvent, cbCompleted, cbOwner, aParams) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };

    this.ifClickable = function () {
        if (_oContainer.mouseEnabled === true) {
            return 1;
        }
        return 0;
    };

    this.setActive = function (iLevel, bActive) {
        _bActive = bActive;
        _aButton[iLevel].gotoAndStop("state_" + _bActive);
        _aButton[iLevel].mouseEnabled = true;
        
    };

    this.buttonRelease = function () {
        if(!_bActive){
            return;
        }
        playSound("click",1,false);
        
        _oContainer.scaleX = 1;
        _oContainer.scaleY = 1;

        if (_aCbCompleted[ON_MOUSE_UP]) {
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP], _aParams);
        }
    };

    this.buttonDown = function () {
        if(!_bActive){
            return;
        }
        
        _oContainer.scaleX = 0.9;
        _oContainer.scaleY = 0.9;
        
        if (_aCbCompleted[ON_MOUSE_DOWN]) {
            _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN], _aParams);
        }
    };

    this.setPosition = function (iXPos, iYPos) {
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
    };

    this.setVisible = function (bVisible) {
        _oContainer.visible = bVisible;
    };
    
    _oParentContainer = oParentContainer;
    this._init(iXPos, iYPos, szTextMatch, szTextScore,bActive,oParentContainer);
}