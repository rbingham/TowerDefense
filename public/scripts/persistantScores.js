MyGame.persistantScores = (function(){

    var highScores = [];
    function Response(xhttp){
        return function(){
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                highScores = JSON.parse(xhttp.responseText);
            }
        }
    }

    function executeGetRequest(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = Response(xhttp);
        xhttp.open("GET", "scores", true);
        xhttp.send();
    }
    executeGetRequest();

    function executePostRequest(newScore){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = Response(xhttp);
        xhttp.open("POST", "scores", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("newScore="+newScore);
    }

    function add(score) {
        executePostRequest(score);
    }

    function remove(index) {
        // if(0<index && index<highScores.length){
        //     highScores.splice(index,1);
        //     localStorage['MyGame.highScores'] = JSON.stringify(highScores);
        // }
    }

    function clear() {
        // highScores = [];
        // localStorage['MyGame.highScores'] = JSON.stringify(highScores);
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
