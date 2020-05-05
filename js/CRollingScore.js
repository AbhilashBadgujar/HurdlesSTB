var MS_ROLLING_SCORE = 800;
function CRollingScore() {

    var _oTweenText = null;

    this.rolling = function (oScore, iScore) {
        var oScoreText = oScore.getText();
        _oTweenText = createjs.Tween.get(oScoreText).to({text: iScore}, MS_ROLLING_SCORE, createjs.Ease.cubicOut).call(function () {
            createjs.Tween.removeTweens(_oTweenText);
        }).addEventListener("change", function () {
            oScore.refreshText(Math.floor(oScoreText.text));
        })

    };

    return this;
}

