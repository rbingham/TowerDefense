MyGame.screens['Credits']=(function(game){


    var run=function(){

    };

    var initialize=function(){
        document.getElementById('BackButton_CR').addEventListener(
            'click',
			function() {game.show('MainMenu'); }
        );
    };


    return{
        run:run,
        initialize:initialize

    }
}(MyGame.game));
