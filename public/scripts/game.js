

var MyGame={
    screens:{},
    
};


MyGame.game=(function(screens){
    var initialize=function(){
        for(var curr in screens){
            screens[curr].initialize();
        }
        show("MainMenu");
    }

    var show=function (name){

        var active=document.getElementsByClassName('active');
        for(var screenIndex=0;screenIndex<active.length;screenIndex++){
            active[screenIndex].classList.remove('active');
        }

        screens[name].run();
        document.getElementById(name).classList.add('active');
    }
    return{
        show:show,
        initialize:initialize
    };

}(MyGame.screens));
