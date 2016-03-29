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
        //spec: dims{center{x,y}, height, width}, drawable, mouseOverDrawable, mouseDownDrawable, redrawQueue
        var that={};
        var buttonListenerMap = ButtonListenerMap();
        var mouseOver=false;
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

        that.onMouseOver = function(){
            mouseOver = true;
            if (spec.hasOwnProperty("mouseOverDrawable")) {
                fireNeedsRedrawn();
            }
        }

        that.onMouseAway = function(){
            var oldMouseDown = mouseDown;
            mouseDown=false;
            mouseOver = false;
            if ((!oldMouseDown && spec.hasOwnProperty("mouseOverDrawable"))
                    || (oldMouseDown && (spec.hasOwnProperty("mouseDownDrawable")||spec.hasOwnProperty("mouseOverDrawable")))
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

            if(mouseOver){
                if(mouseDown && spec.hasOwnProperty("mouseDownDrawable")){
                    spec.mouseDownDrawable.draw(spec.dims);
                    drawn=true;
                }else if(spec.hasOwnProperty("mouseOverDrawable")){
                    spec.mouseOverDrawable.draw();
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

    return {
        CanvasButton:CanvasButton
    }
}(MyGame.graphics));
