
function CGame(){
    var _noOfHelpPannel = 0;
    var _bUpdate = false;
    var _bArrivalPlaying;
    var _bReadyForArrival;
    var _bGameOver;
    var _iCurJump;
    var _iPlayerPos;
    var _iPlayerPosExtra;
    var _iPlayerPosGJump;
    var _uPlayerPos;
    var jumpCountP;
    var _iTimeSpawn;
    var _iTotScore;
    var _iCurLevelScore;
    var _iCurLevel;
    var _iObstacleTimeSpawnElaps;
    var _iCurNumObstacles;
    var _iContPlayerArrived;
    var _aPlayers;
    var _aArrivalPos;
    
    var _oTextStart;
    var _textinfo;
    var _oField;
    var _oObstacleController;
    var _oObstacleJumpArea;
    var _oInterface;
    var _oContainerField;
    var _oContainerPlayers;
    var _oJumpBut;
    var _oHelpPanel;
    var _oArrivalPanel;
    var _oFinalPanel;
    var _oPaused;
    var oText;

    var Posi;


    var _oFpsText;
    
    this._init = function(){
        setTeam();
        _iPlayerPosExtra = 0;
        _iPlayerPos = 8;
        _uPlayerPos = 1;
        _oPaused = false;
        _iCurLevel = s_iLevelSelected;
        _iTimeSpawn = SPAWN_TIME[_iCurLevel-1];
        jumpCountP = 0;
        Posi = new Array();
        Posi[0] = 0.33;
        Posi[1] = 0.35;
        Posi[2] = 0.35;
        Posi[3] = 0.35;
        Posi[4] = 0.35;
        Posi[5] = 0.35;
        Posi[6] = 0.35;
        Posi[7] = 0.33;
       
        _iPlayerPosGJump = 0;
        _oContainerField = new createjs.Container();
        s_oStage.addChild(_oContainerField);
        
        
        _oField = new CField(_oContainerField);
        _oField.addEventListener(ON_ARRIVAL,this._onArrival,this);
        
       
        
        _oObstacleController = new CObstacleController(_oContainerField);
        _oObstacleJumpArea = new CObstacleJumpArea(TRACK_INFOS[_iCurLevel-1].difficulty,_oContainerField);
        if(_iCurLevel === 1){
            _oObstacleJumpArea.addEventListener(ON_SHOW_JUMP_AREA,this._onShowHelp,this);
            _noOfHelpPannel++;
            
        }
       
       _oContainerPlayers = new createjs.Container();
       _oContainerField.addChild(_oContainerPlayers);
       
        _aPlayers = new Array();
        for(var i=0;i<NUM_TEAMS;i++){
            var oPlayer = new CPlayer(i+1,TEAM_IN_LANE[i],OFFSET_INCREASE_LERP[_iCurLevel-1],TIME_INCREASE_LERP[_iCurLevel-1],OFFSET_DECREASE_LERP[_iCurLevel-1],_oContainerPlayers, Posi[i]);
            //oPlayer.addEventListener(ON_PLAYER_ARRIVED,this._onPlayerArrival,this);
            //console.log(Posi[i]);
            _aPlayers[i] = oPlayer;
        }
      

        _oTextStart = new CStartText(CANVAS_WIDTH/2-280,CANVAS_HEIGHT/2-70,s_oStage); 

        oText = new CTLText(_oContainerField, 
            CANVAS_WIDTH/2-200, 20, 400, 30, 
            20, "center", "#fff", FONT_GAME, 1,
            0, 0,
            " ",
            true, true, true,
            false);
            

        
        //_textinfo.push(oText);
        
        _oJumpBut = new CJumpGui(CANVAS_WIDTH/2,CANVAS_HEIGHT-50,s_oStage);
        _oJumpBut.addEventListener(ON_JUMP,this._onJump,this);
        
        _oInterface = new CInterface(_iTotScore,_iCurLevel);
        
        this.reset();
        
        _oHelpPanel = new CHelpPanel();
        _oHelpPanel.addEventListener(ON_REFRESH_TUTORIAL_INFO,this._onRefreshTutorial,this);

        

        _oArrivalPanel = new CArrivalPanel();
        _oArrivalPanel.addEventListener(ON_RESTART,this.restart,this);
        _oArrivalPanel.addEventListener(ON_BACK_MENU,this.onExit,this);
        _oArrivalPanel.addEventListener(ON_NEXT_LEVEL,this._onNextLevel,this);
        
        _oFinalPanel = new CFinalPanel();
        _oFinalPanel.addEventListener(ON_RESTART,this.restart,this);
        _oFinalPanel.addEventListener(ON_BACK_MENU,this.onExit,this);
        
        setTimeout(function(){_oTextStart.show();},1000);
        
        window.addEventListener("keydown", this.onKeyDown, this);
        window.addEventListener("keyup", this.OnKeyUp, this);
       
        /*
        _oFpsText = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-90, 100, 180, 70, 
                    70, "center", "red", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );*/
    };
    

    this.OnKeyUp = function(evt){
        if(evt.keyCode == 56){
            _oPaused = !_oPaused;
            console.log(_oPaused);
            if(_oPaused){
                oText.refreshText(" ");
                _bUpdate = false;
        
            for(var i=0;i<_aPlayers.length;i++){
                _aPlayers[i].pause();
            }
            
            _oObstacleController.pause();
            _oObstacleJumpArea.pause();
            _oField.pause();
            
            _oJumpBut.disable(true);
           
        }else{
            
            oText.refreshText(" ");
                _bUpdate = true;
        
            for(var i=0;i<_aPlayers.length;i++){
                _aPlayers[i].unpause();
            }
            
            _oObstacleController.unpause();
            _oObstacleJumpArea.unpause();
            _oField.unpause();
            
            _oJumpBut.disable(false);
            
            }
        }
    };
  
 //Abhilash
    this.onKeyDown = function(evt) {

        if (_aPlayers[PLAYER_LANE_INDEX].isJumping() || _oJumpBut.isDisabled() || !_aPlayers[PLAYER_LANE_INDEX].isRunning()){
            evt.preventDefault();
            return false;
        }
    
        if(!evt){ 
            evt = window.event;
        }  
        //NextPanel 
       
       /* if(evt.keyCode == 56){
            _oPaused = true;
            console.log(_oPaused);*/
            
            /*if(_oPaused){
                
                _bUpdate = false;
        
            for(var i=0;i<_aPlayers.length;i++){
                _aPlayers[i].pause();
            }
            
            _oObstacleController.pause();
            _oObstacleJumpArea.pause();
            _oField.pause();
            
            _oJumpBut.disable(true);
           
        }else{
            
                _bUpdate = true;
        
            for(var i=0;i<_aPlayers.length;i++){
                _aPlayers[i].unpause();
            }
            
            _oObstacleController.unpause();
            _oObstacleJumpArea.unpause();
            _oField.unpause();
            
            _oJumpBut.disable(false);
            
            }*/
        //}

        if(evt.keyCode == 32 || evt.keyCode == 13){
            if( _bGameOver || !_aPlayers[PLAYER_LANE_INDEX].isRunning()){
                return;
            }
          
            //CHECK IF PLAYER IS IN THE GREEN AREA
            _iCurJump = _oObstacleJumpArea.checkIfPlayerInGreenArea(PLAYER_POS);
    
            
            _oJumpBut.setState(_iCurJump);
            

            
            
            
            if(_iCurJump === JUMP_BAD){
                playSound("bad_jump",1,false);
                _aPlayers[PLAYER_LANE_INDEX].jump(_iCurJump);
                _aPlayers[PLAYER_LANE_INDEX].prepareForJump();
                
                for(var k=0;k<_aPlayers.length;k++){
                    if(k !== PLAYER_LANE_INDEX){
                        _aPlayers[k].increasePositionOnTrack(_uPlayerPos);
                    }
                }
            }else{
               
                if(_iCurJump === JUMP_GOOD){
                    playSound("good_jump",1,false);
                    _oObstacleJumpArea.highlightArea(false);
                }else{
                    playSound("perfect",1,false);
                    _oObstacleJumpArea.highlightPerfectArea(false);
                }
            }

            
        _iCurLevelScore += SCORE_JUMP[_iCurJump];
        _iTotScore += SCORE_JUMP[_iCurJump];
        
        _oInterface.refreshScore(_iTotScore);
            //console.log(evt.keyCode);
        }

        
        
        evt.preventDefault();
        return false;
    };
    
    this.unload = function(){
        _bUpdate = false;
        stopSound("crowd_idle");
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.OnKeyUp);
        _oInterface.unload();
       
        s_oStage.removeAllChildren();
    };
    
    this.reset = function(){    
        _bGameOver = false;
        _bReadyForArrival = false;
        _bArrivalPlaying = false;
        _bUpdate = false;
        STRICKNO = 0;
        _iCurLevelScore = 0;
        _iObstacleTimeSpawnElaps = 0;
        _iCurNumObstacles = 0;
        _iContPlayerArrived = 0;
        _iPlayerPos = 0;
        _aArrivalPos = new Array();

        _iTotScore = getScoreTillLevel(_iCurLevel);

        _oInterface.reset(_iTotScore,_iCurLevel);
        _oJumpBut.reset();
        
        playSound("crowd_idle",0.5,true);
        setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);
        
        $(s_oMain).trigger("start_level",_iCurLevel);
    };
    
    this.restart = function(){
        $(s_oMain).trigger("restart_level",_iCurLevel);

        this.reset();
        _oInterface.hideFlagArrival();
        _oField.reset();
        _oObstacleController.reset();
        _oTextStart.reset();
        for(var i=0;i<_aPlayers.length;i++){
            _aPlayers[i].reset(OFFSET_INCREASE_LERP[_iCurLevel-1],TIME_INCREASE_LERP[_iCurLevel-1],OFFSET_DECREASE_LERP[_iCurLevel-1]);
        }
        setTimeout(function(){_oTextStart.show();},2500);
    };
    
    this.refreshButtonPos = function(){
        _oInterface.refreshButtonPos();

    };
    
    this.pauseGame = function(){
        _bUpdate = false;
        
        for(var i=0;i<_aPlayers.length;i++){
            _aPlayers[i].pause();
        }
        
        _oObstacleController.pause();
        _oObstacleJumpArea.pause();
        _oField.pause();
        
        _oJumpBut.disable(true);
    };

    function TestPause(){
        _bUpdate = false;
        
        for(var i=0;i<_aPlayers.length;i++){
            _aPlayers[i].pause();
        }
        
        _oObstacleController.pause();
        _oObstacleJumpArea.pause();
        _oField.pause();
        
        _oJumpBut.disable(true);
    }

    this.unpauseGame = function(){
        _bUpdate = true;
        
        for(var i=0;i<_aPlayers.length;i++){
            _aPlayers[i].unpause();
        }
        
        _oObstacleController.unpause();
        _oObstacleJumpArea.unpause();
        _oField.unpause();
        
        _oJumpBut.disable(false);
    };
    
    this._onShowHelp = function(){
        _oObstacleJumpArea.removeEventListener(ON_SHOW_JUMP_AREA);
        this.pauseGame();
        _oHelpPanel.show();
        
        _oObstacleJumpArea.highlightArea(true);
    };
    
    this._onRefreshTutorial = function(iCnt){
        switch(iCnt){
            case 1:{
                    _oObstacleJumpArea.stopHighlightArea();
                    _oObstacleJumpArea.highlightPerfectArea(true);
                    break;
            }
            case 2:{
                    _oObstacleJumpArea.stopHighlightPerfectArea();
                    break;
            }
        }
    };
    
    this.prepareRunners = function(){
        for(var i=0;i<NUM_TEAMS;i++){
            _aPlayers[i].prepareStart();
        }

        setTimeout(function(){s_oGame.startRace();},2000);
    };
    
    this.startRace = function(){
        playSound("start_race",1,false);
        _oTextStart.hide();
       
       
        for(var i=0;i<NUM_TEAMS;i++){
            _aPlayers[i].startRun();
        }
        
        _aPlayers[PLAYER_LANE_INDEX].startRun();
        _oField.start();
        
        _bUpdate = true;
    };
    
    this.sortRunnerFunction = function(obj1, obj2, options) {
        if (obj1.y > obj2.y) { return 1; }
        if (obj1.y < obj2.y) { return -1; }
        return 0;
    };
    
    this._spawnObstacles = function(){
        _iCurJump = JUMP_BAD;
        _oObstacleController.showObstacleRow();
        _oObstacleJumpArea.show(CANVAS_WIDTH/2,0);
        _oJumpBut.show();
        
        for(var k=0;k<_aPlayers.length;k++){
            _aPlayers[k].prepareForJump();
        }
        
        //SORT RUNNERS
        _oContainerPlayers.sortChildren(this.sortRunnerFunction);
    };
    
    this.checkRaceOver = function(){
        _iCurNumObstacles++;
        _oInterface.refreshObstacles(STRICKNO, 3, _uPlayerPos + " ");
        if(_iCurNumObstacles === NUM_OBSTACLES_PER_LEVEL[_iCurLevel-1]){
            _bReadyForArrival = true;
        }
       
    };
    


    
   
    
    this._onJump = function(){
        if( _bGameOver || !_aPlayers[PLAYER_LANE_INDEX].isRunning()){
            return;
        }
      
        //CHECK IF PLAYER IS IN THE GREEN AREA
        _iCurJump = _oObstacleJumpArea.checkIfPlayerInGreenArea(PLAYER_POS);

        
        _oJumpBut.setState(_iCurJump);
        
        

        
        this.refreshScore(SCORE_JUMP[_iCurJump]);
        
        if(_iCurJump === JUMP_BAD){
            playSound("bad_jump",1,false);
            _aPlayers[PLAYER_LANE_INDEX].jump(_iCurJump);
            _aPlayers[PLAYER_LANE_INDEX].prepareForJump();
            
            for(var k=0;k<_aPlayers.length;k++){
                if(k !== PLAYER_LANE_INDEX){
                    _aPlayers[k].increasePositionOnTrack(_uPlayerPos);
                }
            }
        }else{
            this.performJump(PLAYER_LANE_INDEX);
            if(_iCurJump === JUMP_GOOD){
                playSound("good_jump",1,false);
                _oObstacleJumpArea.highlightArea(false);
            }else{
                playSound("perfect",1,false);
                _oObstacleJumpArea.highlightPerfectArea(false);
            }
        }
        
    };

    
    
    this.performJump = function(iLane){
        

        if(iLane === PLAYER_LANE_INDEX){
            _aPlayers[iLane].jump(_iCurJump);
            if(_iCurJump === JUMP_BAD){
                playSound("bad_jump",1,false);
                _oObstacleController.topple(iLane);
                for(var k=0;k<_aPlayers.length;k++){
                    if(k !== PLAYER_LANE_INDEX){
                        _aPlayers[k].increasePositionOnTrack(Posi[k]);
                       
                    }
                    
                   
                }
                
                STRICKNO++;
                
                var temp = 0;
               
                if(_uPlayerPos == 1){
                    
                    temp = _iPlayerPosExtra - 1;
                    console.log("Current player pos " + _uPlayerPos);
                    if(temp <= 1){
                        _uPlayerPos += Math.abs(temp);
                        console.log(_uPlayerPos + " update player pos");
                    }

                }else{
                    
                    _uPlayerPos += 1;
                    if(_uPlayerPos > 8)
                        _uPlayerPos = 8;
                }
                    
                
                console.warn(STRICKNO);
                if(STRICKNO >= 3){
                    console.warn(STRICKNO);
                    if(getLevelScore(1) <= _iCurLevelScore){
                        setLocalStorageScore(_iCurLevelScore,_iCurLevel);
                    }
                   console.log(getLevelScore(1) + " " + _iCurLevel + " " + _iCurLevelScore);
                    setTimeout(function(){  TestPause(); }, 500);
                    _bReadyForArrival = true;
                    _bGameOver = true;
                    $(s_oMain).trigger("end_level",_iCurLevel);
                    $(s_oMain).trigger("save_score",_iTotScore);
                    //abhilash 
                    console.log(_iPlayerPos);
                    setTimeout(function(){_oFinalPanel.show(_iTotScore,"8");},10);
                    
                }
                new CJumpText(TEXT_BAD_JUMP,CANVAS_WIDTH/2,JUMP_Y_CHECKPOINT,"#ce1b12",s_oStage);
            }else if(_iCurJump === JUMP_PERFECT){
                for(var k=0;k<_aPlayers.length;k++){
                    if(k !== PLAYER_LANE_INDEX){
                        _aPlayers[k].decreasePositionOnTrack();
                       
                        
                    }
                }
                jumpCountP++;
                console.log(jumpCountP + "Jump Count");
                if(jumpCountP >= 1){
                    jumpCountP = 0;
                    if(_uPlayerPos > 1){
                        _uPlayerPos -= 1;
                       
                    }
                    if(_uPlayerPos == 1){
                        _iPlayerPosExtra++;
                        console.log(_iPlayerPosExtra + " player exta jump");
                    }
                    _oInterface.refreshObstacles(STRICKNO, 3, _uPlayerPos + " ");
                }
                new CJumpText(TEXT_PERFECT_JUMP,CANVAS_WIDTH/2,JUMP_Y_CHECKPOINT,"#12ce57",s_oStage);
            }else{
                new CJumpText(TEXT_GOOD_JUMP,CANVAS_WIDTH/2,JUMP_Y_CHECKPOINT,"#ebdd00",s_oStage);
                _iPlayerPosGJump++;
                console.log(_iPlayerPosGJump + " good jump");
                /*if(_iPlayerPosGJump >= 2){
                    _uPlayerPos += 1;
                    _iPlayerPosGJump = 0;
                }*/
            }
            
            _oJumpBut.hide();

        }else{        
            
            //IF OPPONENT MAKES A BAD JUMP, DECREASE THE POSITION
            var iRand = Math.random();
            if( iRand<= LANE_INFOS[iLane].bad_jump_perc){
                _aPlayers[iLane].decreasePositionOnTrack();
                console.log(iLane + " pos");
                _oObstacleController.topple(iLane);
                _aPlayers[iLane].jump(JUMP_BAD);
                console.log(iLane + " bad jump");
                return;
            }
            
            var iRand = Math.random();
            if(_aPlayers[iLane].getNumPerfectJump() < MAX_PERFECT_JUMP_OPPONENT[_iCurLevel-1] && iRand<= LANE_INFOS[iLane].perfect_jump_perc){
                _aPlayers[iLane].increasePositionOnTrack(_uPlayerPos);
                console.log(iLane);
                _aPlayers[iLane].jump(JUMP_PERFECT);
                console.log(iLane + " perfect jump");
            }
            
            _aPlayers[iLane].jump(JUMP_GOOD);
        }        
    };

    this.startJumpIndicator = function(){
    
    };
    
    this.refreshScore = function(iAmount){
        _iCurLevelScore += iAmount;
        _iTotScore += iAmount;
        
        _oInterface.refreshScore(_iTotScore);
    };
    
    this._onArrival = function(){
        //ALL RUNNERS MUST GO TOWARDS Y=0
        for(var i=0;i<_aPlayers.length;i++){
            _aPlayers[i].playFinalRun();
        }
        
        playSound("crowd_arrival",1,false);
    };
    
    this._onPlayerArrival = function(){
        _iContPlayerArrived++;

        if(_iContPlayerArrived === _aPlayers.length){
            //ALL RUNNERS ARRIVED
            $(s_oMain).trigger("end_level",_iCurLevel);
            
        
            stopSound("crowd_idle");
            
            var iStarsGained = 4 -_iPlayerPos;
            
            
                setLocalStorageScore(_iCurLevelScore,_iCurLevel);
                setStarsPerLevel(iStarsGained,_iCurLevel);
            
            if(_iCurLevel === NUM_LEVELS && iStarsGained>0){
                setTimeout(function(){_oFinalPanel.show(_iTotScore,"GAME OVER! ");},2000);
            }else{
                if(iStarsGained>0){
                    $(s_oMain).trigger("save_score",_iTotScore);
                    setLocalStorageLevel(_iCurLevel+1);
                    
                }
                
                setTimeout(function(){
                    _oArrivalPanel.show(_iCurLevelScore,_iTotScore,_iPlayerPos,iStarsGained);
                    //HIDE ARRIVAL FLAGS
                    _oInterface.hideFlagArrival();
                },2000);
            }
            
        }
    };

    
    this._onNextLevel = function(){
        s_oGame.unload();
        s_oMain.gotoLevelMenu();
    };

    this.onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
        
    $(s_oMain).trigger("show_interlevel_ad");
        
        $(s_oMain).trigger("end_session");
        //abhilash
        
        $(s_oMain).trigger("share_event",_iTotScore);
    };

    
    this.update = function(){
        //_oFpsText.refreshText(s_iCurFps+ " FPS")
        
        if(_bUpdate === false){
            return;
        }
        
        
        if(_bArrivalPlaying){
            var iLineY = _oField.getCurArrivalLineY();
            for(var k=0;k<_aPlayers.length;k++){
                if(_aPlayers[k].getY() < iLineY && _aPlayers[k].isArrived() === false){
                    _aPlayers[k].setArrived();
                    _aArrivalPos.push(k);
                    
                    _oInterface.setFlagArrival(_aArrivalPos.length,TEAM_IN_LANE[k]);
                    
                    if(k === PLAYER_LANE_INDEX){
                        _oInterface.showFinalPosAnim(_aArrivalPos.length);
                        _iPlayerPos = _aArrivalPos.length;
                    }
                }
            }
        }else{
            
            if(!_oObstacleController.isVisible()){
                _iObstacleTimeSpawnElaps += s_iTimeElaps;
                if(_iObstacleTimeSpawnElaps > _iTimeSpawn){
                    _iObstacleTimeSpawnElaps  = 0;

                    if(_bReadyForArrival){
                        _bArrivalPlaying = true;
                        _oField.playArrival();
                    }else{
                        this._spawnObstacles();
                    }
                }
            }


            //CHECK OBSTACLES Y FOR RUNNERS JUMP
            var iY =_oObstacleController.getY();
            
            if(iY > 0){
                for(var k=0;k<_aPlayers.length;k++){

                    if(_aPlayers[k].getY() - (140*_aPlayers[k].getScale())< iY && _aPlayers[k].mustJump() && k !== PLAYER_LANE_INDEX){
                        this.performJump(k);
                    }
                }

                if(_aPlayers[PLAYER_LANE_INDEX].getY() < _oObstacleJumpArea.getY()+70 &&
                                _aPlayers[PLAYER_LANE_INDEX].getY() > _oObstacleJumpArea.getY()
                                 && _aPlayers[PLAYER_LANE_INDEX].mustJump() && !_aPlayers[PLAYER_LANE_INDEX].isJumping()){
                    _iCurJump === JUMP_BAD;
                    //DISABLE JUMP BUT
                    _oJumpBut.disable(true);
                    this.performJump(PLAYER_LANE_INDEX);
                }
            }
        }
        
        
        for(var k=0;k<_aPlayers.length;k++){
            if(k !== PLAYER_LANE_INDEX){
                _aPlayers[k].update();
            }
        }
        
        
    };
    
    s_oGame = this;

        
    this._init();
}

var s_oGame = null;
