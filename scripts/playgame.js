

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

    // var particleSystem;
    var outerParticleSystem;
    var initialize=function(){
        gameView = MyGame.GameView(model, input);

        // var particleSpec = MyGame.particleSystems.TinyDefaultParticleSpec();
        // // var particleSpec = MyGame.particleSystems.DefaultParticleSpec();
        // particleSpec.particlesFade = true;
        // particleSpec.drawables.push(graphics.genericDrawables.greenRect);
        // particleSpec.drawables.push(graphics.genericDrawables.redRect);
        // particleSpec.drawables.push(graphics.genericDrawables.blueRect);
        // particleSystem = MyGame.particleSystems.ParticleSystem(particleSpec);

        var outerParticleSpec = MyGame.particleSystems.DefaultParticleSpec();
        outerParticleSpec.particlesFade = true;
        // outerParticleSpec.drawables.push(particleSystem);
        outerParticleSystem = MyGame.particleSystems.ParticleSystem(outerParticleSpec);
    };

    function buildParticleSystem(){
        var particleSpec = MyGame.particleSystems.TinyDefaultParticleSpec();
        // var particleSpec = MyGame.particleSystems.DefaultParticleSpec();
        particleSpec.particlesFade = true;
        particleSpec.drawables.push(graphics.genericDrawables.greenRect);
        particleSpec.drawables.push(graphics.genericDrawables.redRect);
        particleSpec.drawables.push(graphics.genericDrawables.blueRect);
        var particleSystem = MyGame.particleSystems.ParticleSystem(particleSpec);

        // for(let i=0; i<5; i++){
        //     particleSystem.create();
        // }

        var realUpdate = particleSystem.update;

        particleSystem.update = function(elapsedTime){
            particleSystem.create();
            realUpdate(elapsedTime);
        }

        return particleSystem;
    }

    function buildParticleSystem2(){
        var particleSpec = MyGame.particleSystems.TinyDefaultParticleSpec();
        // var particleSpec = MyGame.particleSystems.DefaultParticleSpec();
        particleSpec.particlesFade = true;
        var particleSystem = MyGame.particleSystems.ParticleSystem(particleSpec);

        // for(let i=0; i<5; i++){
        //     particleSystem.create();
        // }

        var realUpdate = particleSystem.update;

        particleSystem.update = function(elapsedTime){
            particleSystem.create(buildParticleSystem());
            realUpdate(elapsedTime);
        }

        return particleSystem;
    }

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

        // particleSystem.create();
        // particleSystem.create();
        outerParticleSystem.create(buildParticleSystem2());
        // outerParticleSystem.create();
        // outerParticleSystem.create();
        // particleSystem.update(elapsed);
        outerParticleSystem.update(elapsed);

        render(elapsed);

        // particleSystem.draw();
        outerParticleSystem.draw();

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
