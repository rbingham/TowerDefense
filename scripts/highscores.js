

MyGame.screens['HighScore']=(function(game,highscores){
    
    
    var run=function(){
        highscores.report('Highscore_List');
    };
    
    var initialize=function(){
        document.getElementById('BackButton_HS').addEventListener(
            'click',
			function() {game.show('MainMenu'); }
        );
        document.getElementById('ClearButton_HS').addEventListener(
            'click',
			function() {highscores.clear(); run(); }
        );
    };
    
    
    return{
        run:run,
        initialize:initialize
        
    }
}(MyGame.game,MyGame.persitantScore));