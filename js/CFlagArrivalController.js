function CFlagArrivalController(iX,iY,oParentContainer){
    
    var _aFlags;
    
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    this._init = function(iX,iY){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer.addChild(_oContainer);
        
        _aFlags = new Array();
        
        var iFlagY = 0;
        for(var i=0;i<NUM_TEAMS;i++){
            var oFlag = new CFlagArrival(0,iFlagY,_oContainer);
            
            _aFlags[i] = oFlag;
            
            iFlagY += 40;
        }
    };
    
    this.setX = function(iNewX){
        _oContainer.x = iNewX;
    };
    
    this.setFlagArrival = function(iPos,iFlag){
        _aFlags[iPos-1].show(iFlag,iPos);
    };
    
    this.hide = function(){
        for(var i=0;i<_aFlags.length;i++){
            _aFlags[i].hide();
        }
    };
    
    this._init(iX,iY);
}