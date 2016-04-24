


MyGame.screens['MainMenu']=(function(game){


    var run=function(){

    };

    var initialize=function(){
        document.getElementById('NewGameButton').addEventListener(
            'click',
			function() {game.show('PlayGame'); }
        );
        document.getElementById('HighScoreButton').addEventListener(
            'click',
			function() {game.show('HighScore'); }
        );
        document.getElementById('AboutButton').addEventListener(
            'click',
			function() {game.show('Credits'); }
        );
        document.getElementById('Configure').addEventListener(
            'click',
			function() {game.show('Configurable'); }
        );
    };


    return{
        run:run,
        initialize:initialize

    }
}(MyGame.game));
