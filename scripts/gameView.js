MyGame.GameView = function(model, input){
    //var waveIndicator;
    //initialize waveIndicator
    //add waveIndicator MouseListener

    //initialize buttonGrid
    var mouse = input.Mouse();
    var keyboard = input.Keyboard();

    var buttonGrid = MyGame.uiComponents.CanvasButtonGrid(mouse);


    //initialize each button
    var theButton = MyGame.uiComponents.CanvasButton({
        dims:{center:{x:700,y:100}, height:100, width:100, rotate:0},
        drawable:MyGame.graphics.RectangleDrawable({stroke:"blue",fill:"yellow"})
    });
    var theOtherButton = MyGame.uiComponents.CanvasButton({
        dims:{center:{x:700,y:200}, height:100, width:100, rotate:0},
        drawable:MyGame.graphics.RectangleDrawable({stroke:"yellow",fill:"blue"})
    });

    //for each button register event using model
    theButton.addButtonListener("logStuff", {onClick:function(){
        model.placeButtonPressed(MyGame.components.sampleTowerSpec);
    }});
    theOtherButton.addButtonListener("logStuff", {onClick:function(){
        model.placeButtonPressed(MyGame.components.otherSampleTowerSpec);
    }});

    buttonGrid.addButton(theButton);
    buttonGrid.addButton(theOtherButton);


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
