function Event(interval,timesRemaining,name,func){
    return {
        "timesRemaining":timesRemaining,
        "name":name,
        "interval":interval,
        "func":func,
        "timeRemaining":interval
    };
}

MyGame.gameModel=(function(graphics,components,input){
    var eventList=[];
    var that={
            continueLoop:true,
            },
        internalRender=function(){},
        internalUpdate=function(){},
        keyboard=input.Keyboard(),
        mouse=input.Mouse();

    var creepManager = (function(){
        var entrances = MyGame.components.entrances;

        var initialLocations = [entrances[2],entrances[3],entrances[0],entrances[1]];
        var endGoals = [entrances[0],entrances[1],entrances[2],entrances[3]];

        return MyGame.components.creeps.CreepManager({initialLocations:initialLocations, endGoals:endGoals});
    }());

    that.addCreep = function(){
        //creepSpec:{locationGoalIndex, drawable, initialHP, creepSpeed}
        var creepSpec = {
            locationGoalIndex:0,
            // drawable:MyGame.resources.ScottPilgrimSpriteDrawable(),
            drawable:MyGame.graphics.genericDrawables.greenRect,
            initialHP:100,
            creepSpeed:100
        };
        creepManager.create(creepSpec);
    }

    that.initialize=function(){
        document.getElementById('Overlay_Menu').style.display='none';
        internalRender=WatchGame;
        internalUpdate=PlaceTowerUpdate;
    };

    function WatchGame(){
        components.arena.draw();
                components.renderTowers();

    }
    function PlaceTowerRender(){
        components.arena.draw("foobar");
        components.renderTowers();
    }
    function PlaceTowerUpdate(elapsed){
        components.updateTowers(elapsed);
        mouse.update(elapsed);
    }


    /*    The concept of the internal update is that if you change states in the game,
        internalUpdate=PauseGameUpdate
        internalRender=PauseGameRender
        to pause the game, and a seperate render/update for each state,whatever the state is.
        Similar in concept to the game screens;
    */
    that.update=function(elapsed){
        updateEventQueue(elapsed);
        internalUpdate(elapsed);
        creepManager.update(elapsed);

    };

    that.render=function(elapsed){
        graphics.clear();
        internalRender(elapsed);
        creepManager.render(elapsed);
    };




    function removeDoneEvents(){
        for(var i=eventList.length-1; i>=0;i--){
            if(eventList[i].timesRemaining===0){
                eventList.splice(i,1);
            }
        }
    }

    function updateEventQueue(elapsed){
        removeDoneEvents();
        for(var i=0; i<eventList.length;i++){
            eventList[i].timeRemaining-=elapsed;
            if(eventList[i].timeRemaining<=0){
                eventList[i].timeRemaining=eventList[i].interval;
                eventList[i].timesRemaining-=1;
                eventList[i].func(elapsed);

            }
        }
    }


    that.placeButtonPressed=function(towerSpecs){
        internalRender=PlaceTowerRender;
        mouse.registerMoveCommand(function(at){
            components.placingOver(at,towerSpecs);
        },components.arena);
        mouse.registerClickCommand(function(at){
            if(components.addTower(at,towerSpecs)){
                mouse=input.Mouse();
                internalRender=WatchGame;
            }
        },components.arena);
    }


    that.keyUpdate=function(elapsed){
        keyboard.update(elapsed);
    }

    return that;
}(MyGame.graphics,MyGame.components,MyGame.input));
