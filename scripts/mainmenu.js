


BrickGame.screens['MainMenu']=(function(game){
    
    
    var run=function(){
            
    };
    
    var initialize=function(){
        document.getElementById('newGameButton').addEventListener(
            'click',
			function() {game.show('PlayGame'); }
        );
        document.getElementById('highScoreButton').addEventListener(
            'click',
			function() {game.show('HighScore'); }
        );
        document.getElementById('AboutButton').addEventListener(
            'click',
			function() {game.show('Credits'); }
        );
    };
    
    
    return{
        run:run,
        initialize:initialize
        
    }
}(BrickGame.game));

/*
BrickGame.screens['MainMenu']=(function(){
    
    
    run=function(){
            
    };
    
    initialize=function(){
        
        
    };
    
    
    return{
        run:run,
        initialize:initialize
        
    }
}());
*/