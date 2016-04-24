MyGame.configurePersitance = (function(){

    var controls = (function(){
        var prevControls = localStorage.getItem('MyGame.controls');
        if (prevControls !== null) {
            return JSON.parse(prevControls);
        }else{
            return {};
        }
    }());

    function add(string,e) {
        controls[string]={
                key:e.keyCode,
                alt:e.altKey,
                ctrl:e.ctrlKey,
                shift:e.shiftKey
            };
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
        var name=MyGame.configurePersitance.getKeyCode("upgrade");
        document.getElementById('SettingUpgrade').innerHTML="Upgrade Key:"+(name===undefined?"unset":String.fromCharCode(name.key));
        name=MyGame.configurePersitance.getKeyCode("sell");
        document.getElementById('SettingSell').innerHTML="Sell Key:"+(name===undefined?"unset":String.fromCharCode(name.key));
        name=MyGame.configurePersitance.getKeyCode("next_level");
        document.getElementById('SettingLevel').innerHTML="Level Key:"+(name===undefined?"unset":String.fromCharCode(name.key));
    };

    var initialize=function(){
        document.getElementById('SettingSell').addEventListener(
            'click',
			function() {setShortcut("Sell","SettingSell") }
        );
        document.getElementById('SettingUpgrade').addEventListener(
            'click',
			function() {setShortcut("Upgrade","SettingUpgrade")}
        );
        document.getElementById('SettingLevel').addEventListener(
            'click',
			function() { setShortcut("Level","SettingLevel");}
        );        
        document.getElementById('BackButton_CC').addEventListener(
            'click',
			function() { 
                game.show('MainMenu');
                window.removeEventListener('keydown',grabKey);
                settingMutex=false;
            }
        );

    };
    
    function grabKey(e){
        if(e.keyCode===KeyEvent.DOM_VK_CONTROL||e.keyCode===KeyEvent.DOM_VK_ALT||e.keyCode===KeyEvent.DOM_VK_SHIFT){
            return;
        }
        
        MyGame.configurePersitance.add(funcname,e);
        document.getElementById(buttonname).innerHTML=funcname+" Key:"+String.fromCharCode(e.keyCode);
        window.removeEventListener('keydown',grabKey);
        settingMutex=false;
    }
    var settingMutex=false;
    
    var setShortcut=function(funcname,buttonname){
        if(settingMutex){
            return;
        }
        settingMutex=true;
        
        document.getElementById(buttonname).innerHTML="Setting...";
        window.addEventListener('keydown', grabKey  );
    };
    
  /*  
   function grabKeyUpgrade(e){
        MyGame.configurePersitance.add("upgrade",e.keyCode);
        document.getElementById('SettingUpgrade').innerHTML="Upgrade Key:"+String.fromCharCode(e.keyCode);
        window.removeEventListener('keydown',grabKeyUpgrade);
    }
    
    var setUpgrade=function(){
        document.getElementById('SettingUpgrade').innerHTML="Setting";
        window.addEventListener('keydown',grabKeyUpgrade);
    };

    
   function grabKeySell(e){
        document.getElementById('SettingSell').innerHTML="Sell Key:"+String.fromCharCode(e.keyCode);
        MyGame.configurePersitance.add("sell",e.keyCode);
        window.removeEventListener('keydown',grabKeySell);
    }
    
    var setSell=function(){
        document.getElementById('SettingSell').innerHTML="Setting";
        window.addEventListener('keydown',grabKeySell);
    };
    
    
   function grabKeyLevel(e){
        document.getElementById('SettingLevel').innerHTML="Level Key:"+String.fromCharCode(e.keyCode);

        MyGame.configurePersitance.add("next_level",e.keyCode);
        window.removeEventListener('keydown',grabKeyLevel);
    }
    
    var setLevel=function(){
        document.getElementById('SettingLevel').innerHTML="Setting";
        window.addEventListener('keydown',grabKeyLevel);
    };
    */

    return{
        run:run,
        initialize:initialize,
        /*
        setLevel:setLevel,
        setSell:setSell,
        setUpgrade:setUpgrade*/
        
    }
}(MyGame.game,MyGame.graphics,MyGame.input,MyGame.persistantScores));
