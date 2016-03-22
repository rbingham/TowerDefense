function Event(interval,timesRemaining,name,func){
    return {
        "timesRemaining":timesRemaining,
        "name":name,
        "interval":interval,
        "func":func,
        "timeRemaining":interval
    };
}

MyGame.screens['PlayGame']=(function(game,graphics,input,scoring){
    var prevTimestamp=performance.now();
    var keyBoard=input.Keyboard();
    var gameObjects={};
    var eventList=[];
    var lives=3;
    var bricksDestroyed=0;
    var score=0;
    
    var countdown=0;
    var countdownImages=[];
    var lifeImage;
    
    var run=function(){
        initializeGameObjects();
        //add functions to listen to key listners in here
        addmovementKeylistners();
        addFlowkeyListeners();
        BeginCountDown();
        lives=3;
        score=0;
        tobeat=100;
        prevTimestamp=performance.now();
        requestAnimationFrame(gameloop)
    };
    var incountdown=false;
    function BeginCountDown(){
        
        if(!incountdown){
            gameObjects.balls=gameObjects.createBall(bricksDestroyed);
            countdown=3;
            incountdown=true
            document.getElementById('overlay_menu').style.display='none';
            eventList.push(Event(1000,3,"Countdown",function(){
                countdown--;
                if(countdown==0){
                    gameObjects.balls[0].launch();
                    incountdown=false;
                }
                if(countdown<0)
                    countdown=0;
            }));}
    }
    
    
    var hasShrunk=false;

    function BeginShrink(){
        if(hasShrunk)
            return;
        hasShrunk=true;
        eventList.push(Event(30,50,"shrinker",function(){
            gameObjects.paddle.shrink(1);
        }));
    }
    
    function Gameover(){
        countdown=4;
         document.getElementById('continueButton').style.display='none';
        document.getElementById('overlay_menu').style.display='block';
        cleanUp();
        addFlowkeyListeners();
        incountdown=false;
        eventList.length=0;
        scoring.add(score);
    }
    function PauseGame(){
        countdown=6;
                 document.getElementById('continueButton').style.display='inline-block';

        document.getElementById('overlay_menu').style.display='block';
        cleanUp();
        addFlowkeyListeners();
        incountdown=false;
        //eventList.length=0;
        //scoring.add(score);
    }
    
    
    var hit=false;
    function reset(){
        cleanUp();
        initializeGameObjects();
        addmovementKeylistners();
        addFlowkeyListeners();
        

        lives=3;
        bricksDestroyed=0;
        score=0;
        tobeat=100;
        BeginCountDown();
        hit=true;
    }
    
    function exitGame(){
        cleanUp();
        game.show('MainMenu');
    }
    
    
    function gameloop(timestamp){
        var elapsed=timestamp-prevTimestamp;
        prevTimestamp=timestamp;
        processInput(elapsed);
        for(var i=0;i<4;i++)
            update(elapsed/4);
        render(elapsed);
        requestAnimationFrame(gameloop);
    }
    
    
    function processInput(elapsed){
        keyBoard.update(elapsed);
    }
    
    function render(elapsed){
        graphics.clear();
        graphics.scaleGameboard(gameObjects.width,gameObjects.length);
        //graphics.writeSpecificMessage(lives,10,450)
        for(var i=0;i<lives;i++){
            lifeImage.render({
                size:10,
                x:20+i*20,
                y:800
            });
        }
        graphics.writeSpecificMessage("score "+score,700,800)

        //render gameObjects
        for(var i=0;i<gameObjects.bricks.length;i++){
            gameObjects.bricks[i].texture.draw(gameObjects.bricks[i]);
        }
        for(var i=0;i<gameObjects.balls.length;i++){
            gameObjects.balls[i].texture.draw(gameObjects.balls[i]);
        }
        gameObjects.paddle.texture.draw(gameObjects.paddle);
        
        gameObjects.particles.render();
        if(hit){
            //console.log(countdownImages);
            //console.log(countdown);
            
        }
        countdownImages[(countdown)+0].render();
        graphics.unscaleGameBoard();
    }
    
   
    function removeDoneEvents(){
        for(var i=eventList.length-1; i>=0;i--){
            if(eventList[i].timesRemaining===0){
                eventList.splice(i,1);
            }
        }
    }
   
    function updateEventQueue(elapsed){
        removeDoneEvents();
        
        for(var i=0; i<eventList.length;i++){
            eventList[i].timeRemaining-=elapsed;
            if(eventList[i].timeRemaining<=0){
                eventList[i].timeRemaining=eventList[i].interval;
                eventList[i].timesRemaining-=1;
                
                eventList[i].func();
                                
            }
        }
    }
    var tobeat=100;
    function update(elapsed){
        updateEventQueue(elapsed);
        if(countdown<4){
            var outofboundPaddle=CheckBoundPaddle(gameObjects.paddle,gameObjects.width,gameObjects.length);
            for(var k=0;k<gameObjects.balls.length;k++){
                if(outofboundPaddle&&gameObjects.balls[k].isStuck){
                    var left_t=(gameObjects.paddle.right-gameObjects.paddle.getLength()/2)-gameObjects.balls[k].getLength()/2;
                    var right_t=(gameObjects.paddle.right-gameObjects.paddle.getLength()/2)+gameObjects.balls[k].getLength()/2;
                    gameObjects.balls[k].left=left_t;
                    gameObjects.balls[k].right=right_t;
                }
                gameObjects.balls[k].move(elapsed);
                for(var i=0;i<gameObjects.bricks.length;i++){
                    gameObjects.bricks[i].mark=false;
                    if(collide(gameObjects.balls[k],gameObjects.bricks[i])){
                        gameObjects.bricks[i].mark=true;
                        
                    }
                }
                for(var i=gameObjects.bricks.length-1;i>=0;i--){
                    
                    if(gameObjects.bricks[i].mark){
                        for(var j=0;j<100;j++)
                            gameObjects.particles.create({
                                x:Math.random()*gameObjects.bricks[i].getLength()+gameObjects.bricks[i].left,
                                y:Math.random()*gameObjects.bricks[i].getWidth()+gameObjects.bricks[i].bot
                                },{
                                x:gameObjects.bricks[i].getLength()/2+gameObjects.bricks[i].left,
                                y:gameObjects.bricks[i].getWidth()/2+gameObjects.bricks[i].bot
                                });
                        fixCollision(gameObjects.balls[k],gameObjects.bricks[i]);
                        if(gameObjects.bricks[i].type=='G'){
                            BeginShrink();
                            score+=5;
                        }else if(gameObjects.bricks[i].type=='B'){
                            score+=3;
                        }else if(gameObjects.bricks[i].type=='O'){
                            score+=2;
                        }else if(gameObjects.bricks[i].type=='Y'){
                            score+=1;
                        }
                        gameObjects.rowCounter[gameObjects.bricks[i].row]--;
                        if(gameObjects.rowCounter[gameObjects.bricks[i].row]==0)
                            score+=25;
                        gameObjects.bricks.splice(i,1);
                        bricksDestroyed++;
                        if(bricksDestroyed==62||bricksDestroyed==36||bricksDestroyed==12||bricksDestroyed==4){
                            gameObjects.balls[k].speedUp();
                        }
                    }
                }
                
                if(!gameObjects.balls[k].isStuck&&collide(gameObjects.balls[k],gameObjects.paddle)){
                    fixCollision(gameObjects.balls[k],gameObjects.paddle);
                }
                CheckBound(gameObjects.balls[k],gameObjects.width,gameObjects.length);
                if(bricksDestroyed==112)
                    Gameover();
            }
            if(score>=tobeat){
                gameObjects.addBall(gameObjects.paddle,bricksDestroyed);
                tobeat+=100;
            }
            if(score===508){
                Gameover();
                tobeat+=100;
            }
        }
        gameObjects.particles.update(elapsed);
        
    }
    
    
    var initialize=function(){
        lifeImage=new genericimage({imageSrc:'images/paddle.png'},graphics);
            
        countdownImages=[
            new timerImage({imageSrc:'images/blank.png'},graphics),
            new timerImage({imageSrc:'images/one.png'},graphics),
            new timerImage({imageSrc:'images/two.png'},graphics),
            new timerImage({imageSrc:'images/three.png'},graphics),
            new timerImage({imageSrc:'images/gameOver.png'},graphics),
            new timerImage({imageSrc:'images/blank.png'},graphics),
            new timerImage({imageSrc:'images/blank.png'},graphics),
        ];
        document.getElementById('RetryButtton').addEventListener(
            'click',
			function() {reset(); }
        );
        document.getElementById('backButton_PG').addEventListener(
            'click',
			function() {exitGame(); }
        );
        document.getElementById('continueButton').addEventListener(
            'click',
			function() {countdown=0;             addmovementKeylistners();document.getElementById('overlay_menu').style.display='none';}
        );
        
    };
    function initializeGameObjects(){
        var gameString= '              '+'\n'+ 
                        '              '+'\n'+ 
                        'GGGGGGGGGGGGGG'+'\n'+
                        'GGGGGGGGGGGGGG'+'\n'+
                        'BBBBBBBBBBBBBB'+'\n'+
                        'BBBBBBBBBBBBBB'+'\n'+
                        'OOOOOOOOOOOOOO'+'\n'+
                        'OOOOOOOOOOOOOO'+'\n'+
                        'YYYYYYYYYYYYYY'+'\n'+
                        'YYYYYYYYYYYYYY'+'\n'+
                        '              '+'\n'+ 
                        '              '+'\n'+
                        '              '+'\n'+
                        '              '+'\n'+
                        '              '+'\n'+
                        '              '+'\n'+
                        '              '+'\n'+
                        '              '+'\n'+
                        '              '+'\n'+
                        '              '+'\n'+
                        '              '+'\n'+
                        '              '+'\n'+
                        '              '+'\n'+
                        '              '+'\n'+
                        '              '+'\n'+
                        '      PP      '+'\n'+
                        '              '+'\n';
        var textures={
            brickText:{
                B:graphics.Texture('images/brickblue.png'),
                Y:graphics.Texture('images/brickyell.png'),
                O:graphics.Texture('images/brickoran.png'),
                G:graphics.Texture('images/brickgren.png')
            },
            ballText:graphics.Texture('images/ball.png'),
            paddleText:graphics.Texture('images/paddle.png')
        };
        gameObjects=GenerateGenericMyGame(gameString,textures);
        gameObjects.particles= new particleGroup({
            imageSrc:'images/fire.png'
        },graphics);
        
    }
    
    
    function addmovementKeylistners(){
        keyBoard.registerCommand(KeyEvent.DOM_VK_LEFT,function(elapsed){gameObjects.paddle.moveLeft(elapsed);});
        keyBoard.registerCommand(KeyEvent.DOM_VK_RIGHT,function(elapsed){gameObjects.paddle.moveRight(elapsed);});
        keyBoard.registerCommand(KeyEvent.DOM_VK_LEFT,function(elapsed){gameObjects.balls[0].moveLeft(elapsed);});
        keyBoard.registerCommand(KeyEvent.DOM_VK_RIGHT,function(elapsed){gameObjects.balls[0].moveRight(elapsed);});
    }
    function addFlowkeyListeners(){
        //keyBoard.registerCommand(KeyEvent.DOM_VK_R,function(elapsed){reset();});
        keyBoard.registerCommand(KeyEvent.DOM_VK_ESCAPE,function(elapsed){ if(!incountdown){PauseGame();}});
    }
    
    function cleanUp(){
        //remove keyListners
        keyBoard=input.Keyboard();
    }
    
    function collide(Rect1,Rect2){
/*         
        var temp1=Rect1.left>Rect2.right,
            temp2=Rect1.right<Rect2.left,
            temp3=Rect1.top>Rect2.bot,
            temp4=Rect1.top>Rect2.bot; */
        return !(  Rect1.left>Rect2.right
                 ||Rect1.right<Rect2.left
                 ||Rect1.top<Rect2.bot
                 ||Rect1.bot>Rect2.top)
    }
    //assumes collide has been calles
    
    /****
    http://gamedev.stackexchange.com/questions/24078/which-side-was-hit
    *****/
    function fixCollision(toFix,stationary){
            
            //generate points
            var cb=collideSide(stationary,[{x:toFix.left+toFix.getWidth()/4,y:toFix.bot},{x:toFix.right-toFix.getWidth()/4,y:toFix.bot}],1);
            var ct=collideSide(stationary,[{x:toFix.left+toFix.getWidth()/4,y:toFix.top},{x:toFix.right-toFix.getWidth()/4,y:toFix.top}],1);
            var cr=collideSide(stationary,[{x:toFix.right,y:toFix.top-toFix.getLength()/4},{x:toFix.right,y:toFix.bot+toFix.getLength()/4}],1);
            var cl=collideSide(stationary,[{x:toFix.left,y:toFix.top-toFix.getLength()/4},{x:toFix.left,y:toFix.bot+toFix.getLength()/4}],1);
            var yadjust=0,xadjust=0;
            if(ct){
                yadjust=stationary.bot-toFix.top;
            }
            else if(cb){
                yadjust=stationary.top-toFix.bot;
            }
            if(cl){
                xadjust=stationary.right-toFix.left;
            }
            else if(cr){
                xadjust=stationary.left-toFix.right;
            }
            if(cl|cr)
                toFix.velocity.x=-toFix.velocity.x
            if(ct|cb)
                toFix.velocity.y=-toFix.velocity.y
            toFix.adjustRight(xadjust);
            toFix.adjustUp(yadjust);
    }
    
    function CheckBound(toFix,maxY,maxX){
        if(toFix.right>maxX){
            toFix.left=maxX-toFix.getWidth();
            toFix.right=maxX;
            toFix.velocity.x=-toFix.velocity.x;
        }
        if(toFix.left<0){
            toFix.right=toFix.getWidth();
            toFix.left=0;
            toFix.velocity.x=-toFix.velocity.x;
        }
        if(toFix.top>maxY){
            toFix.bot=maxY-toFix.getLength();
            toFix.top=maxY;
            ballGoneoutofbounds(toFix)
        }
        if(toFix.bot<0){
            toFix.top=toFix.getLength();
            toFix.bot=0;
            toFix.velocity.y=-toFix.velocity.y;
        }
    }
    function CheckBoundPaddle(toFix,maxY,maxX){
        if(toFix.right>maxX){
            toFix.left=maxX-toFix.getLength();
            toFix.right=maxX;
            return true;
        }
        if(toFix.left<0){
            toFix.right=toFix.getLength();
            toFix.left=0;
            return true;
        }
        if(toFix.top>maxY){
            toFix.bot=maxY-toFix.getWidth();
            toFix.top=maxY;
            return true;
        }
        if(toFix.bot<0){
            toFix.top=toFix.getWidth();
            toFix.bot=0;
            return true;
       }
       return false;
    }
    
    
    
    function ballGoneoutofbounds(outofBounds){
        if(gameObjects.balls.length>1){
            var place=gameObjects.balls.findIndex(function(toFind){return toFind===outofBounds;});
            gameObjects.balls.splice(place,1);
        }
        else if(gameObjects.balls.length===1){
            lives-=1;
            if(lives<=0){
                Gameover();
            }else{
                BeginCountDown();
                gameObjects.paddle.recenter();

            }
        }
    }
    
    
    
    function collideSide(toCheck,sidePoint,numRequired){
        var numHit=0;
        for(var i=0;i<sidePoint.length;i++){
            if(sidePoint[i].x>toCheck.left&&sidePoint[i].x<toCheck.right&&sidePoint[i].y<toCheck.top&&sidePoint[i].y>toCheck.bot)
                numHit++;
        }
        if(numHit>=numRequired)
            return true;
        return false;
    }
    
    
    
    
    
    return{
        run:run,
        initialize:initialize
        
    }
}(MyGame.game,MyGame.graphics,MyGame.input,MyGame.persitantScore));