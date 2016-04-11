

MyGame.screens['PlayGame']=(function(game,graphics,input,scoring,model){
    var prevTimestamp=performance.now();
    var eventList=[];
    var gameView;

    var run=function(){
        //add functions to listen to key listners in here
        prevTimestamp=performance.now();
        model.initialize();
        if(model.continueLoop){
            requestAnimationFrame(gameloop);
        }
    };


    var initialize=function(){

        gameView = MyGame.GameView(model, input);
    };

    /*
    * Game Loop Section
    *
    */
    function gameloop(timestamp){
        var elapsed=timestamp-prevTimestamp;
        prevTimestamp=timestamp;
        processInput(elapsed);
        for(var i=0;i<4;i++)
            update(elapsed/4);
        render(elapsed);
        if(model.continueLoop){
            requestAnimationFrame(gameloop);
        }
    }


    function processInput(elapsed){
        model.keyUpdate(elapsed);
        gameView.update(elapsed);
    }

    function render(elapsed){
        model.render(elapsed);
        gameView.draw(elapsed);
    }



    function update(elapsed){
        model.update(elapsed);
    }


    return{
        run:run,
        initialize:initialize

    }
}(MyGame.game,MyGame.graphics,MyGame.input,MyGame.persistantScores,MyGame.gameModel));
