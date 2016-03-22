

var MyGame={
    screens:{},
    persitantScore:(function(){
        
        var highScores = {},
            previousScores = localStorage.getItem('MyGame.highScores');
		if (previousScores !== null) {
			highScores = JSON.parse(previousScores);
		}

		function add(value) {
            var temp=numscores();
            var highhit=false;
			highScores[temp] = value;
            if(temp>=5){
                var sortedHigh=[];
                for (key in highScores) {
                     sortedHigh.push(highScores[key]);
                }
                sortedHigh.sort(function(a,b){return b-a;});
                highScores={};
                for(var i=0;i<5;i++){
                    highScores[i]=sortedHigh[i];
                    if(value===sortedHigh[i])
                        highhit=true;
                }
            }
			localStorage['MyGame.highScores'] = JSON.stringify(highScores);
            return highhit;
		}

		function remove(key) {
			delete highScores[key];
			localStorage['MyGame.highScores'] = JSON.stringify(highScores);
		}

		function output(placeID) {
			var htmlNode = document.getElementById(placeID),
				key;
			
			htmlNode.innerHTML = '';
            var sortedHigh=[];
			for (key in highScores) {
				sortedHigh.push(highScores[key]);
			}
            sortedHigh.sort(function(a,b){return b-a;});
            for(var i=0;i<sortedHigh.length;i++){
                htmlNode.innerHTML += ((i+1)+ ' : ' + sortedHigh[i] + '<br/>');
            }
            for(var i=sortedHigh.length;i<5;i++){
                htmlNode.innerHTML += ((i+1)+' : ' + 0+'<br/>');
            }
			htmlNode.scrollTop = htmlNode.scrollHeight;
		}
        
        function clear(){
            highScores={};
            localStorage['MyGame.highScores']=JSON.stringify(highScores);
            
        }
        
        
        return{
            add:add,
            remove:remove,
            output:output,
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

