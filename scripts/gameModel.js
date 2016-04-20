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



    var projectileMangaer = (function(){
        return MyGame.components.projectiles.ProjectileManager();
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
            for(var k=-1;k<=1;k++){
                for(var l=-1;l<=1;l++){
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
                    for(let i=0;i<creepList.length&&!projhit;i++){
                        p.radius+=10;
                        if(Collision.circleRect(p,creepList[i].getDims())){
                            creepList[i].hit(25);
                        }
                    }
                }

                projectileMangaer.projectileKilled(projectile);
            }
        }

        function update(){
            projectileMangaer.forEach(handleProjectile);
        }

        return {update};
    }());


    var genCreeps = false;
    that.toggleCreepGen = function(){
        // genCreeps = !genCreeps;
        that.addCreep();
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
        projectileMangaer.create(projecSpec);
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
        projectileMangaer.update(elapsed);
        projectileCollitionDetector.update();
    };

    that.render=function(elapsed){
        graphics.clear();
        internalRender(elapsed);
        creepManager.render(elapsed);
        projectileMangaer.render(elapsed);
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
        mouse=input.Mouse();
        internalRender=PlaceTowerRender;
        mouse.registerMoveCommand(function(at){
            components.placingOver(at,towerSpecs);
        },components.arena);
        mouse.registerClickCommand(function(at){
            if(components.addTower(at,towerSpecs,creepManager)){
                creepManager.rebuildShortestPaths();
                mouse=input.Mouse();
                internalRender=WatchGame;
                beginListeneingtoTowers();
            }
        },components.arena);
    }


    that.keyUpdate=function(elapsed){
        keyboard.update(elapsed);
    }

    return that;
}(MyGame.graphics,MyGame.components,MyGame.input));
