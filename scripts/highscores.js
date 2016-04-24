
MyGame.screens['HighScore']=(function(game,persistantScores){
    

    var run=function(){
        persistantScores.report('Highscore_List');
    };

    var initialize=function(){
        document.getElementById('BackButton_HS').addEventListener(
            'click',
			function() {game.show('MainMenu'); }
        );
        document.getElementById('ClearButton_HS').addEventListener(
            'click',
			function() {persistantScores.clear(); run(); }
        );
    };

    return{
        run:run,
        initialize:initialize

    }
}(MyGame.game,MyGame.persistantScores));
