function CAlertSavingBox(szText,oParentContainer){
    var _oMsg;
    var _oButOk;
    var _oThis;
    var _oContainer;
    var _oParentContainer;

    this._init = function (szText) {
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);

        var oFade = createBitmap(s_oSpriteLibrary.getSprite("fade_bg"));
        oFade.alpha = 0.5;
        oFade.on("click", function () {});
        _oContainer.addChild(oFade);
       
        var oSpriteBg = s_oSpriteLibrary.getSprite('msg_box');
        var oBg = createBitmap(oSpriteBg);

        oBg.x = CANVAS_WIDTH * 0.5;
        oBg.y = CANVAS_HEIGHT * 0.5;
        oBg.regX = oSpriteBg.width * 0.5;
        oBg.regY = oSpriteBg.height * 0.5;
        _oContainer.addChild(oBg);

        _oMsg =  new CTLText(_oContainer, 
                    CANVAS_WIDTH / 2 -oSpriteBg.width/2+10, CANVAS_HEIGHT/2-100, oSpriteBg.width-20, 120, 
                    28, "center", "#ffffff", FONT_GAME, 1,
                    14, 7,
                    szText,
                    true, true, true,
                    false );

        _oButOk = new CGfxButton(CANVAS_WIDTH / 2 , 332, s_oSpriteLibrary.getSprite('but_yes'), _oContainer);
        _oButOk.addEventListener(ON_MOUSE_UP, this._onButOk, this);
    };

    this._onButOk = function () {
        _oThis.unload();
    };

    this.unload = function () {
        _oButOk.unload();
        _oParentContainer.removeChild(_oContainer);
    };
    
    _oThis = this;
    _oParentContainer = oParentContainer;

    this._init(szText);
}