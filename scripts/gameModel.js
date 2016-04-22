function Event(interval,timesRemaining,name,func){
    return {
        "timesRemaining":timesRemaining,
        "name":name,
        "interval":interval,
        "func":func,
        "timeRemaining":interval
    };
}

var circleList=[];

MyGame.GameModel=function(graphics,components,input, particleSystem){
    var eventList=[];
    var that={
            continueLoop:true,
            },
        internalRender=function(){},
        internalUpdate=function(){},
        keyboard=input.Keyboard(),
        mouse=input.Mouse();
    
    var score=0;
    var currency=1000;
    that.enoughCurrency=function(numA){
        return numA<=currency;
    }
    that.decrementCurrency = function(numA){
        currency-=numA;
        internalRender=WatchGame;
        mouse=input.Mouse();
        beginListeneingtoTowers();
    };
    that.creepKilled=function(creep){
        currency+=creep.curr;
        score+=creep.score;
    }

    var creepManager = (function(){
        var entrances = MyGame.components.entrances;


        var initialLocations = [entrances[2],entrances[0],entrances[1],entrances[3]];
        var endGoals = [entrances[0],entrances[2],entrances[3],entrances[1]];

        return MyGame.components.creeps.CreepManager({initialLocations:initialLocations, endGoals:endGoals, particleSystem:particleSystem});
    }());
    
    var creepDied=function(creep){
        score+=creep.score;
        currency+=creep.curr;
    }
    
    creepManager.addCreepKillExternalListners(creepDied);

    var waveManager = MyGame.components.waves.WaveManager({creepManager})

    var projectileManager = (function(){
    return MyGame.components.projectiles.ProjectileManager({particleSystem:particleSystem});
    }());

    var projectileCollitionDetector = (function(){
        function generateLocations(projectile){
            var location = projectile.getLocation();
            var locations=[];
            locations.push({i:location.i, j:location.j});
            locations.push({i:location.i+1, j:location.j});
            locations.push({i:location.i+1, j:location.j+1});
            locations.push({i:location.i, j:location.j+1});
            locations.push({i:location.i-1, j:location.j+1});
            locations.push({i:location.i-1, j:location.j});
            locations.push({i:location.i-1, j:location.j-1});
            locations.push({i:location.i, j:location.j-1});
            locations.push({i:location.i+1, j:location.j-1});
            return locations;
        }
        function generateLocationsLarge(projectile){
            var location = projectile.getLocation();
            var locations=[];
            for(var k=-2;k<=2;k++){
                for(var l=-2;l<=2;l++){
                    locations.push({i:location.i+k, j:location.j+l});
                }
            }
            return locations;
        }
        

        function handleProjectile(projectile){
            var locations =[];
            locations = generateLocations(projectile);
            var creepList = creepManager.getCreepListIJArray(locations);
            var projhit=false;
            for(let i=0;i<creepList.length&&!projhit;i++){
                if(Collision.circleRect(projectile.getDims(),creepList[i].getDims())){
                    creepList[i].hit(25,(projectile.type===PROJECTILETYPE.FREEZE?1000:0));
                    projhit=true;
                }
            }
            
            if(projhit){
                if(projectile.type===PROJECTILETYPE.BOMB){
                    locations=generateLocationsLarge(projectile);
                    var creepList = creepManager.getCreepListIJArray(locations);
                    p=projectile.getDims()
                    p.radius+=50;

                    circleList.push(p);
                    for(let i=0;i<creepList.length;i++){
                        if(Collision.circleRect(p,creepList[i].getDims())){
                            creepList[i].hit(25);
                        }
                    }
                }

                projectileManager.projectileKilled(projectile);
            }
        }

        function update(){
            projectileManager.forEach(handleProjectile);
        }

        return {update};
    }());


    var genCreeps = false;
    that.toggleCreepGen = function(){
        // genCreeps = !genCreeps;
        //that.addCreep();
        waveManager.initiateLevel(2);
    }
    that.addCreep = function(){
        var creepSpec;
        switch(MyGame.random.nextRange(0,2)){
            case 0:
                creepSpec = MyGame.components.creeps.ScottCreepSpec();
                break;
            case 1:
                creepSpec = MyGame.components.creeps.RamonaCreepSpec();
                break;
            case 2:
                creepSpec = MyGame.components.creeps.DemonCreepSpec();
                break;
        }
        creepManager.create(creepSpec);
    }
    that.addProjectile = function(location,velocity,type,toWatchCreep){
        /*initialLocation,initialTimeRemaining,initialVelocity, drawable,  projectileSpeed,*/
        var projecSpec = {
            initialLocation:location,
            drawable:MyGame.resources.PelletSpriteDrawable(),
            initialTimeRemaining:2000,
            projectileSpeed:100,
            initialVelocity:velocity,
            radius:5,
            type:type,
            creep:toWatchCreep

        };
        projectileManager.create(projecSpec);
    }



    that.initialize=function(initSpec){
        document.getElementById('Overlay_Menu').style.display='none';
        internalRender=WatchGame;
        internalUpdate=PlaceTowerUpdate;
    };

    function WatchGame(){
        components.arena.draw();
        components.renderTowers();
        renderScoreCurrency();
    }
    function PlaceTowerRender(){
        components.arena.draw("foobar");
        components.renderTowers();
        renderScoreCurrency();
    }
    function PlaceTowerUpdate(elapsed){
        components.updateTowers(elapsed);
        mouse.update(elapsed);
    }
    
    function renderScoreCurrency(){
        graphics.writeSpecificMessage("Score "+score,500,650);
        graphics.writeSpecificMessage("Curr  "+currency,500,700);
        
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
        waveManager.update(elapsed);
        creepManager.update(elapsed);
        projectileManager.update(elapsed);
        projectileCollitionDetector.update();
    };

    that.render=function(elapsed){
        graphics.clear();
        internalRender(elapsed);
        creepManager.render(elapsed);
        for(var i=circleList.length-1; i>=0;i--){
            if(circleList[i].stroke===undefined){
                circleList[i].stroke="red"
            }
            
            //graphics.drawCircle(circleList[i]);
        }

        projectileManager.render(elapsed);
        waveManager.render(elapsed);
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
    function beginListeneingtoTowers(){
        mouse.registerClickCommand(function(at){
            components.selectATower(at);
        },components.arena);
    }


    that.placeButtonPressed=function(towerSpecs){
        if(currency<towerSpecs.cost){
            return;
        }
        towerSpecs.projectileManager=projectileManager;
        mouse=input.Mouse();
        internalRender=PlaceTowerRender;
        mouse.registerMoveCommand(function(at){
            components.placingOver(at,towerSpecs);
        },components.arena);
        mouse.registerClickCommand(function(at){
            if(components.addTower(at,towerSpecs,creepManager)){
                creepManager.rebuildShortestPaths();
                mouse=input.Mouse();
                that.decrementCurrency(towerSpecs.cost);
                internalRender=WatchGame;
                beginListeneingtoTowers();
            }
        },components.arena);
    }


    that.keyUpdate=function(elapsed){
        keyboard.update(elapsed);
    }

    return that;
};
