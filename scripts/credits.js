BrickGame.screens['Credits']=(function(game){
    
    
    var run=function(){
            
    };
    
    var initialize=function(){
        document.getElementById('backButton_CR').addEventListener(
            'click',
			function() {game.show('MainMenu'); }
        );
    };
    
    
    return{
        run:run,
        initialize:initialize
        
    }
}(BrickGame.game));
