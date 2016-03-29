MyGame.persistantScores = (function(){

    var highScores = (function(){
        var previousScores = localStorage.getItem('MyGame.highScores');
        if (previousScores !== null) {
            return JSON.parse(previousScores);
        }else{
            return [];
        }
    }());

    function add(score) {
        highScores.push(score);
        highScores.sort(function(a,b){return b-a;});
        localStorage['MyGame.highScores'] = JSON.stringify(highScores);
    }

    function remove(index) {
        if(0<index && index<highScores.length){
            highScores.splice(index,1);
            localStorage['MyGame.highScores'] = JSON.stringify(highScores);
        }
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
