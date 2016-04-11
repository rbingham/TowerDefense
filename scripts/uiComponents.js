MyGame.uiComponents = (function(graphics){
    //ButtonListener: onClick()

    function ButtonListenerMap(){
        var that={};
        var listenerMap={};
        that.addListener = function(key, listener){
            listenerMap[key]=listener;
        }
        that.removeListener = function(key){
            delete listenerMap[key];
        }
        that.onClick = function(evt){
            for (var key in listenerMap) {
                  listenerMap[key].onClick(evt);
            }
        }

        return that;
    }

    function CanvasButton(spec){
        //spec: dims{center{x,y}, height, width, rotate}, drawable, mouseEnterDrawable, mouseDownDrawable, redrawQueue
        var that={};
        var buttonListenerMap = ButtonListenerMap();
        var mouseEnter=false;
        var mouseDown=false;
        var drawable = spec.drawable;
        var needsRedrawn = true;

        function fireNeedsRedrawn(){
            needsRedrawn = true;
            if (spec.hasOwnProperty("redrawQueue")) {
                spec.redrawQueue.push(that);
            }
        }

        that.getDims = function(){
            return spec.dims;
        }

        that.addButtonListener = function(key, listener){
            buttonListenerMap.addListener(key, listener);
        }
        that.removeButtonListener = function(key){
            buttonListenerMap.removeListener(key);
        }

        that.onMouseEnter = function(){
            mouseEnter = true;
            if (spec.hasOwnProperty("mouseEnterDrawable")) {
                fireNeedsRedrawn();
            }
        }

        that.onMouseExit = function(){
            var oldMouseDown = mouseDown;
            mouseDown=false;
            mouseEnter = false;
            if ((!oldMouseDown && spec.hasOwnProperty("mouseEnterDrawable"))
                    || (oldMouseDown && (spec.hasOwnProperty("mouseDownDrawable")||spec.hasOwnProperty("mouseEnterDrawable")))
            ) {
                fireNeedsRedrawn();
            }
            mouseDown = false;
        }

        that.onMouseDown = function(){
            mouseDown = true;
            if (spec.hasOwnProperty("mouseDownDrawable")) {
                fireNeedsRedrawn();
            }
        }

        that.onMouseUp = function(){
            mouseDown = false
            if (spec.hasOwnProperty("mouseDownDrawable")) {
                fireNeedsRedrawn();
            }
            buttonListenerMap.onClick();
        }

        that.onMouseClick = function(){
            that.onMouseDown();
            that.onMouseUp();
        }

        that.draw = function(){
            var drawn=false;

            if(mouseEnter){
                if(mouseDown && spec.hasOwnProperty("mouseDownDrawable")){
                    spec.mouseDownDrawable.draw(spec.dims);
                    drawn=true;
                }else if(spec.hasOwnProperty("mouseEnterDrawable")){
                    spec.mouseEnterDrawable.draw();
                    drawn=true;
                }
            }

            if(!drawn){
                spec.drawable.draw(spec.dims);
            }
            needsRedrawn = false;
        }

        return that;
    }

    function CanvasButtonGrid(mouse){
        var buttons = [];

        //add self to mouse as mouse listener

        function onMouseClick(evt){

        }

        function addButton(button){
            buttons.push(button);
            mouse.registerClickCommand(button.onMouseClick,button.getDims());
            mouse.registerMoveCommand(function(){},button.getDims(),button.onMouseEnter,button.onMouseExit);
        }

        function draw(){
            "use strict"
            for(let i=0; i<buttons.length; i++){
                buttons[i].draw();
            }
        }

        return {
            addButton:addButton,
            draw:draw
        }
    }

    return {
        CanvasButton:CanvasButton,
        CanvasButtonGrid:CanvasButtonGrid
    }
}(MyGame.graphics));
