

MyGame.screens['HighScore']=(function(game,highscores){
    
    
    var run=function(){
        highscores.output('highscore_list');
    };
    
    var initialize=function(){
        document.getElementById('backButton_HS').addEventListener(
            'click',
			function() {game.show('MainMenu'); }
        );
        document.getElementById('clearButton_HS').addEventListener(
            'click',
			function() {highscores.clear(); run(); }
        );
    };
    
    
    return{
        run:run,
        initialize:initialize
        
    }
}(MyGame.game,MyGame.persitantScore));