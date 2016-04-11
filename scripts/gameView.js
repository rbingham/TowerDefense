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
    
    buttonGrid.addButton(GroundBomb);
    buttonGrid.addButton(GroundFreeze);
    buttonGrid.addButton(MixedProjectile);
    buttonGrid.addButton(AirMissile);


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
