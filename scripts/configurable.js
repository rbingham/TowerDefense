MyGame.configurePersitance = (function(){

    var controls = (function(){
        var prevControls = localStorage.getItem('MyGame.controls');
        if (prevControls !== null) {
            return JSON.parse(prevControls);
        }else{
            return {};
        }
    }());

    function add(string,keyCode) {
        controls[string]=keyCode;
        localStorage['MyGame.controls'] = JSON.stringify(controls);
        console.log(controls);
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



MyGame.screens['Configurable']=(function(game){
    var run=function(){
        
    };

    var initialize=function(){
        document.getElementById('SettingSell').addEventListener(
            'click',
			function() {setSell(); }
        );
        document.getElementById('SettingUpgrade').addEventListener(
            'click',
			function() {setUpgrade();}
        );
        document.getElementById('SettingLevel').addEventListener(
            'click',
			function() { setLevel();}
        );        
        document.getElementById('BackButton_CC').addEventListener(
            'click',
			function() { 
                game.show('MainMenu');
                window.removeEventListener('keydown',grabKeySell);
                window.removeEventListener('keydown',grabKeySell);
                window.removeEventListener('keydown',grabKeySell);
            }
        );
    };
    
   function grabKeyUpgrade(e){
        MyGame.configurePersitance.add("upgrade",e.keyCode);
        document.getElementById('SettingUpgrade').innerHTML="Upgrade Key:"+e.keyCode;
        window.removeEventListener('keydown',grabKeyUpgrade);
    }
    
    var setUpgrade=function(){
        console.log("hit");
        window.addEventListener('keydown',grabKeyUpgrade);
    };

    
   function grabKeySell(e){
        document.getElementById('SettingSell').innerHTML="Sell Key:"+e.keyCode;
        MyGame.configurePersitance.add("sell",e.keyCode);
        window.removeEventListener('keydown',grabKeySell);
    }
    
    var setSell=function(){
        window.addEventListener('keydown',grabKeySell);
    };
    
    
   function grabKeyLevel(e){
        document.getElementById('SettingLevel').innerHTML="Level Key:"+e.keyCode;

        MyGame.configurePersitance.add("next_level",e.keyCode);
        window.removeEventListener('keydown',grabKeyLevel);
    }
    
    var setLevel=function(){
        window.addEventListener('keydown',grabKeyLevel);
    };
    

    return{
        run:run,
        initialize:initialize,
        /*
        setLevel:setLevel,
        setSell:setSell,
        setUpgrade:setUpgrade*/
        
    }
}(MyGame.game,MyGame.graphics,MyGame.input,MyGame.persistantScores));
