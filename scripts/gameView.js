MyGame.GameView = function(model, input){
    //var waveIndicator;
    //initialize waveIndicator
    //add waveIndicator MouseListener

    //initialize buttonGrid
    var mouse = input.Mouse();
    var keyboard = input.Keyboard();

    var buttonGrid = MyGame.uiComponents.CanvasButtonGrid(mouse);


    //initialize each button
    var GroundBomb = MyGame.uiComponents.CanvasButton({
        dims:{center:{x:700,y:100}, height:100, width:100, rotate:0},
        drawable:MyGame.graphics.RectangleDrawable({stroke:"black",fill:"red"})
    });


    var GroundFreeze = MyGame.uiComponents.CanvasButton({
        dims:{center:{x:700,y:200}, height:100, width:100, rotate:0},
        drawable:MyGame.graphics.RectangleDrawable({stroke:"aqua",fill:"blue"})
    });

    var MixedProjectile = MyGame.uiComponents.CanvasButton({
        dims:{center:{x:700,y:300}, height:100, width:100, rotate:0},
        drawable:MyGame.graphics.RectangleDrawable({stroke:"Chocolate",fill:"BlueViolet "})
    });
    var AirMissile = MyGame.uiComponents.CanvasButton({
        dims:{center:{x:700,y:400}, height:100, width:100, rotate:0},
        drawable:MyGame.graphics.RectangleDrawable({stroke:"DarkOrange",fill:"yellow"})
    });

    var creep = MyGame.uiComponents.CanvasButton({
        dims:{center:{x:700,y:600}, height:100, width:100, rotate:0},
        drawable:MyGame.graphics.RectangleDrawable({stroke:"DarkOrange",fill:"yellow"})
    });
    
    
    var Upgrade = MyGame.uiComponents.CanvasButton({
        dims:{center:{x:100,y:800}, height:25, width:75, rotate:0},
        drawable:MyGame.graphics.RectangleDrawable({stroke:"black",fill:"Green"})
    });

    var Sell = MyGame.uiComponents.CanvasButton({
        dims:{center:{x:200,y:800}, height:25, width:75, rotate:0},
        drawable:MyGame.graphics.RectangleDrawable({stroke:"black",fill:"red"})
    });
    

    //for each button register event using model
    GroundBomb.addButtonListener("logStuff", {onClick:function(){
        model.placeButtonPressed(TowerTemplate.GroundBomb);
    }});
    GroundFreeze.addButtonListener("logStuff", {onClick:function(){
        model.placeButtonPressed(TowerTemplate.GroundFreeze);
    }});
    MixedProjectile.addButtonListener("logStuff", {onClick:function(){
        model.placeButtonPressed(TowerTemplate.MixedProjectile);
    }});
    AirMissile.addButtonListener("logStuff", {onClick:function(){
        model.placeButtonPressed(TowerTemplate.AirMissile);
    }});
    creep.addButtonListener("logStuff", {onClick:function(){
        model.toggleCreepGen();
    }});
    Upgrade.addButtonListener("logStuff", {onClick:function(){
       MyGame.components.upgradeTower();
    }});
    Sell.addButtonListener("logStuff", {onClick:function(){
        MyGame.components.removeTower();
    }});

    
    
    
    buttonGrid.addButton(GroundBomb);
    buttonGrid.addButton(GroundFreeze);
    buttonGrid.addButton(MixedProjectile);
    buttonGrid.addButton(AirMissile);
    buttonGrid.addButton(creep);
    buttonGrid.addButton(Upgrade);
    buttonGrid.addButton(Sell);

    function update(elapsedTime){
        mouse.update(elapsedTime);
        keyboard.update(elapsedTime);
        // buttonGrid.update(update);
        // waveIndicator.update(update);
    }

    function draw(elapsedTime){
        // buttonGrid.render(update);
        buttonGrid.draw();
        // waveIndicator.render(update);
    }

    return {
        update:update,
        draw:draw
    }
}
