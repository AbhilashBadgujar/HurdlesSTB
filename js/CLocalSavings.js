function clearLocalStorage(){
    s_iLastLevel = 1;
    s_iTeamSelected = 3;
    for(var i=0;i<NUM_TEAMS;i++){
        s_aTeamLoaded[i] = false;
    }
    
    if(s_bStorageAvailable){       
        var iCont = 0;
        while(localStorage.key(iCont) !== null){
            var szKey = localStorage.key(iCont);
            if(szKey.indexOf(LOCALSTORAGE_STRING) !== -1){
                localStorage.removeItem(szKey);
            }else{
                iCont++;
            }
        }    
    }
};


function setLocalStorageLevel(iLevel){
    if(!s_bStorageAvailable){
        return;
    }
    var iSavedLevel = getItem(LOCALSTORAGE_STRING+"level");
    if(iSavedLevel === null || iSavedLevel < iLevel){
        s_iLastLevel = iLevel;
        saveItem(LOCALSTORAGE_STRING+"level", s_iLastLevel);
    }
};

function setLocalStorageScore(iCurScore,iLevel){
    if(!s_bStorageAvailable){
        return;
    }
    saveItem(LOCALSTORAGE_STRING+"score_level_"+iLevel, iCurScore);
};



function setTeam(){
    saveItem(LOCALSTORAGE_STRING+"team",s_iTeamSelected);
};


function setStarsPerLevel(iNumStarts,iLevel){
    if(!s_bStorageAvailable){
        return;
    }
    
    saveItem(LOCALSTORAGE_STRING+"stars_level_"+iLevel, iNumStarts);
};

function getLevelScore(iLevel){
    if(!s_bStorageAvailable){
        return 0;
    }
    
    var iScore = getItem(LOCALSTORAGE_STRING+"score_level_"+iLevel );
    if(iScore){
        return iScore;
    }else{
        return 0;
    }
}

function getScoreTillLevel(iLevel){
    if(!s_bStorageAvailable){
        return 0;
    }

    var iScore = 0;
    for(var i=0;i<iLevel-1;i++){
        iScore += parseInt(getItem(LOCALSTORAGE_STRING+"score_level_"+(i+1) ));
    }

    return iScore;
};
    
function getSavedLevel(){
    if(!s_bStorageAvailable){
        return 1;
    }

    var iSavedLevel = getItem(LOCALSTORAGE_STRING+"level");
    if(iSavedLevel === null){
        return 1;
    }else{
        return iSavedLevel;
    }
};

function getStoredStarsPerLevel(iLevel){
    if(!s_bStorageAvailable){
        return 0;
    }
    var iSavedStars = getItem(LOCALSTORAGE_STRING+"stars_level_"+iLevel);
    if(iSavedStars === null){
        return 0;
    }else{
        return iSavedStars;
    }
}


function getStoredTeamSelected(){
    if(!s_bStorageAvailable){
        return 0;
    }
    
    return getItem(LOCALSTORAGE_STRING+"team");

};