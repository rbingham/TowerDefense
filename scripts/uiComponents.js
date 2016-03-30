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

        that.addButtonListener = function(key, listener){
            buttonListenerMap.add(key, listener);
        }
        that.removeButtonListener = function(key){
            buttonListenerMap.remove(key);
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

        that.onMouseDown(){
            mouseDown = true;
            if (spec.hasOwnProperty("mouseDownDrawable")) {
                fireNeedsRedrawn();
            }
        }

        that.onMouseUp(){
            mouseDown = false
            if (spec.hasOwnProperty("mouseDownDrawable")) {
                fireNeedsRedrawn();
            }
            buttonListenerMap.onClick();
        }

        that.draw(){
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
                drawable.draw(spec.dims);
            }
            needsRedrawn = false;
        }

        return that;
    }

    function CanvasButtonGrid(){

    }

    return {
        CanvasButton:CanvasButton
    }
}(MyGame.graphics));
