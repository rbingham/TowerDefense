

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

    var particleSystem;
    var initialize=function(){
        gameView = MyGame.GameView(model, input);
        var particleSpec = MyGame.particleSystems.DefaultParticleSpec();
        particleSpec.particlesFade = true;
        particleSpec.drawables.push(graphics.genericDrawables.greenRect);
        particleSpec.drawables.push(graphics.genericDrawables.redRect);
        particleSpec.drawables.push(graphics.genericDrawables.blueRect);

        particleSystem = MyGame.particleSystems.ParticleSystem(particleSpec);
    };

    /*
    * Game Loop Section
    *
    */
    function gameloop(timestamp){
        var elapsed=timestamp-prevTimestamp;
        prevTimestamp=timestamp;
        processInput(elapsed);
        for(var i=0;i<4;i++){
            update(elapsed/4);
        }

        particleSystem.create();
        particleSystem.create();
        particleSystem.create();
        particleSystem.update(elapsed);

        render(elapsed);

        particleSystem.draw();

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
