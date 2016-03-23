

var MyGame={
    screens:{},
    persitantScore:(function(){
        
        var highScores = [],
            previousScores = localStorage.getItem('MyGame.highScores');
		if (previousScores !== null) {
			highScores = JSON.parse(previousScores);
		}

        function add(score) {
            highScores.push(score);
            highScores.sort();
            highScores.reverse();
            localStorage['MyGame.highScores'] = JSON.stringify(highScores);
        }

		function remove(key) {
			delete highScores[key];
			localStorage['MyGame.highScores'] = JSON.stringify(highScores);
		}

        function clear() {
            highScores = [];
            localStorage['MyGame.highScores'] = JSON.stringify(highScores);
        }

        function report(id) {
            var htmlNode = document.getElementById(id);
            htmlNode.innerHTML = '';

            if(highScores.length==0){
                htmlNode.innerHTML += '<li>No highscores</li>'
            }else for(let i=0;i<highScores.length && i<5 ;i++){
                htmlNode.innerHTML += '<li>' + highScores[i]+ '</li>'
            }
        }
            
        
        return{
            add:add,
            remove:remove,
            report:report,
            clear:clear,
            
        }
    }())
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

