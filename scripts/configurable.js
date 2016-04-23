MyGame.configurePersitance = (function(){

    var controls = (function(){
        var prevControls = localStorage.getItem('MyGame.controls');
        if (prevControls !== null) {
            return JSON.parse(prevControls);
        }else{
            return {};
        }
    }());

    function setScore(string,keyCode) {
        controls[string]=keyCode;
        localStorage['MyGame.controls'] = JSON.stringify(controls);
    }


    function clear() {
        controls={};
        localStorage['MyGame.controls'] = JSON.stringify(controls);
    }

    function getKeyCode(string) {
        return controls[string];
    }


    return{
        add:add,
        clear:clear,
        getKeyCode:getKeyCode
    }
}());



MyGame.screens['Configure']=(function(game,graphics,input,scoring){
    var keys=input.Keyboard();
    var run=function(){

    };

    var initialize=function(){

    };

    return{
        run:run,
        initialize:initialize

    }
}(MyGame.game,MyGame.graphics,MyGame.input,MyGame.persistantScores));
