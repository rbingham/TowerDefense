

MyGame.screens['PlayGame']=(function(game,graphics,input,scoring){
    var prevTimestamp=performance.now();
    var eventList=[];
    var gameView;
    var gameModel;
    var particleSystem = MyGame.particleSystems.ParticleSystem(MyGame.particleSystems.DefaultParticleSpec());

    var run=function(){
        //add functions to listen to key listners in here
        MyGame.components.reset();
        prevTimestamp=performance.now();
        gameModel = MyGame.GameModel(MyGame.graphics,MyGame.components,MyGame.input, particleSystem);
        gameView = MyGame.GameView(gameModel, input,MyGame.configurePersitance);
        gameModel.initialize();
        if(gameModel.continueLoop){
            requestAnimationFrame(gameloop);
        }else{
            //recordHighScore!!!!
            //go to mainMenue
            game.show('MainMenu');
        }
    };


    var initialize=function(){

    };

    /*
    * Game Loop Section
    *
    */
    function gameloop(timestamp){
        var elapsed=timestamp-prevTimestamp;
        prevTimestamp=timestamp;
        processInput(elapsed);
//        for(var i=0;i<4;i++)
            update(elapsed);
        render(elapsed);
        if(gameModel.continueLoop){
            requestAnimationFrame(gameloop);
        }else{
            //recordHighScore!!!!
            //go to mainMenue
            game.show('MainMenu');
        }
    }


    function processInput(elapsed){
        gameModel.keyUpdate(elapsed);
        gameView.update(elapsed);
    }

    function render(elapsed){
        gameModel.render(elapsed);
        gameView.draw(elapsed);
        particleSystem.draw();
    }



    function update(elapsed){
        gameModel.update(elapsed);
        particleSystem.update(elapsed);
    }


    return{
        run:run,
        initialize:initialize

    }
}(MyGame.game,MyGame.graphics,MyGame.input,MyGame.persistantScores));
