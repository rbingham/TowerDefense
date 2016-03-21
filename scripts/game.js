

var BrickGame={
    screens:{},
    persitantScore:(function(){
        
        var highScores = {},
            previousScores = localStorage.getItem('BrickGame.highScores');
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
			localStorage['BrickGame.highScores'] = JSON.stringify(highScores);
            return highhit;
		}

		function remove(key) {
			delete highScores[key];
			localStorage['BrickGame.highScores'] = JSON.stringify(highScores);
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
        function numscores(){
            var num=0;
            for (var key in highScores) {
                num++;
			}
            return num;
        }
        function clear(){
            highScores={};
            localStorage['BrickGame.highScores']=highScores;
            
        }
        
        
        return{
            add:add,
            remove:remove,
            output:output,
            numscores:numscores,
            clear:clear,
            
        }
    }())
};


BrickGame.game=(function(screens){
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
    
}(BrickGame.screens));

