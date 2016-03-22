function Brick(brickInfo){
    this.texture=brickInfo.texture;
    this.left=brickInfo.left;
    this.right=brickInfo.right;
    this.bot=brickInfo.bot;
    this.top=brickInfo.top;
    this.type=brickInfo.type;
    this.row=brickInfo.row;
}

Brick.prototype={
    getLength:function(){
        return (this.right-this.left);
    },
    getWidth:function(){
        return (this.top-this.bot);
    },
    centerX:function(){
        return (this.right+this.left)/2
    },
    centerY:function(){
        return (this.top+this.bot)/2
    }

}

function Paddle(paddleInfo){
    this.texture=paddleInfo.texture;
    this.left=paddleInfo.left;
    this.right=paddleInfo.right;
    this.bot=paddleInfo.bot;
    this.top=paddleInfo.top;
    this.speed=paddleInfo.speed;
                this.originalLength=(this.right-this.left);

    this.origin={
        left:this.left,
        top:this.top
    };
}

Paddle.prototype={
    getLength:function(){
        return (this.right-this.left);
    },
    getWidth:function(){
        return (this.top-this.bot);
    },
    moveLeft:function(elapsed){
        this.left-=this.speed*(elapsed/1000);
        this.right-=this.speed*(elapsed/1000);
    },  

    moveRight:function(elapsed){
        this.left+=this.speed*(elapsed/1000);
        this.right+=this.speed*(elapsed/1000);
    },

    adjustRight:function(amount){
        this.right+=amount;
        this.left+=amount;
    },

    adjustUp:function(amount){
        this.top+=amount;
        this.bot+=amount;
    },
    centerX:function(){
        return (this.right+this.left)/2
    },
    centerY:function(){
        return (this.top+this.bot)/2
    },
    recenter:function(){
        var nbot=this.origin.top-this.getWidth();
        var nright=this.origin.left+this.getLength();
        
        this.left=this.origin.left;
        this.top=this.origin.top;
        this.right=nright;
        this.bot=nbot;
    },
    shrink:function(amount){
        this.left+=amount/2;
        this.right-=amount/2;
        this.origin.left+=amount/2;
        this.origin.right-=amount/2;
        if(this.getLength()<this.originalLength/2){
            this.left-=(this.originalLength/2-this.getLength())/2;
            this.right+=(this.originalLength/2-this.getLength())/2;
            this.origin.right+=(this.originalLength/2-this.getLength())/2;
            this.origin.left-=(this.originalLength/2-this.getLength())/2;
        }        
    }
}


function Ball(ballInfo,givenVelocity){
    this.texture=ballInfo.texture;
    this.left=ballInfo.left;
    this.right=ballInfo.right;
    this.bot=ballInfo.bot;
    this.top=ballInfo.top;
    this.speed=ballInfo.speed;

    
    this.velocity=typeof givenVelocity!=='undefined' ? givenVelocity: {x:0,y:0};
    this.isStuck=(typeof givenVelocity==='undefined'); 
    this.origin={
        left:this.left,
        top:this.top
    };
    this.startVelocity={x:-150,y:150};
}



Ball.prototype={
    getLength:function(){
        return (this.right-this.left);
    },
    getWidth:function(){
        return (this.top-this.bot);
    },
    launch:function(){
        if(this.isStuck){
            this.velocity=this.startVelocity;
            this.isStuck=false;
            console.log(this.startVelocity)
        }
    },
    centerX:function(){
        return (this.right+this.left)/2
    },
    centerY:function(){
        return (this.top+this.bot)/2
    },
    recenter:function(){
        this.isStuck=true;
        var nbot=this.origin.top-this.getWidth();
        var nright=this.origin.left+this.getLength();
        
        this.left=this.origin.left;
        this.top=this.origin.top;
        this.right=nright;
        this.bot=nbot;
    },
    speedUp:function(){
        this.velocity.x*=1.2;
        this.velocity.y*=1.2;
        this.startVelocity.y*=1.2;
        this.startVelocity.x*=1.2;
        //this.speed*=1.5;
    }

}



Ball.prototype.move=function(elapsed){
    if(!this.isStuck){

        this.top+=this.velocity.y*(elapsed/1000);
        this.bot+=this.velocity.y*(elapsed/1000);
        this.left+=this.velocity.x*(elapsed/1000);
        this.right+=this.velocity.x*(elapsed/1000);
    }
}

Ball.prototype.moveLeft=function(elapsed){
    if(this.isStuck){
        this.left-=this.speed*(elapsed/1000);
        this.right-=this.speed*(elapsed/1000);
    }
}
Ball.prototype.moveRight=function(elapsed){
    if(this.isStuck){
        this.left+=this.speed*(elapsed/1000);
        this.right+=this.speed*(elapsed/1000);
    }
}


Ball.prototype.adjustRight=function(amount){
    this.right+=amount;
    this.left+=amount;
}

Ball.prototype.adjustUp=function(amount){
    this.top+=amount;
    this.bot+=amount;
}


/*
Takes a string in the folowing manner
Canvas will adjust to the size of the gameboard, need to have a size object
Each Column adds x space of 60

------------
Size_Column, Size_Row
BBBBBB...BBB
BBBBBB...BBB
B    B...BBB
BBB BB...BBB



    PPP
------------
*/
const BRICK_LENGTH=60;
const BRICK_WIDTH=30;
const BRICK_MARGIN=2;
const BALL_WIDTH=20;
const BALL_LENGTH=20;
const PADDLE_SPEED=500;

function GenerateGenericMyGame(GameSave,textures){
    var lines=GameSave.split('\n');
    lines=lines.filter(Boolean)
    var that={
        bricks:[],
        length:0,
        width:0,
        rowCounter:[]
    };
    var paddlestart=false;
    var paddleft=0;
    for(var j=0;j<lines.length;j++){
        that.rowCounter[j]=0;
        for(var i=0;i<lines[j].length;i++){
            that.length=(lines[j].length)*BRICK_LENGTH;
            if(lines[j][i]!=='P'&&lines[j][i]!==' '){
                that.bricks.push(new Brick({
                    texture:textures.brickText[lines[j][i]],
                    left:i*BRICK_LENGTH+BRICK_MARGIN,
                    right:(i+1)*BRICK_LENGTH-BRICK_MARGIN,
                    top:(j+1)*BRICK_WIDTH-BRICK_MARGIN,
                    bot:(j)*BRICK_WIDTH+BRICK_MARGIN,
                    type:lines[j][i],
                    row:j
                }));
                that.rowCounter[j]++;
            }
            if(!paddlestart && lines[j][i]==='P'){
                paddleft=i;
                paddlestart=true;
            }
            if(paddlestart && lines[j][i]!='P'){
                that.paddle=new Paddle({
                    texture:textures.paddleText,
                    left:paddleft*BRICK_LENGTH,
                    right:(i+1)*BRICK_LENGTH,
                    top:(j+1)*BRICK_WIDTH,
                    bot:(j)*BRICK_WIDTH,
                    speed:PADDLE_SPEED
                });
                paddlestart=false;
            }
        }
        that.width=(lines.length)*BRICK_WIDTH;
    }
    var MidPaddle=that.paddle.right-that.paddle.getLength()/2;
    that.createBall=function(bricksDestroyed){
        var toReturn=[(new Ball({
            texture:textures.ballText,
            left:MidPaddle-BALL_LENGTH/2,
            right:MidPaddle+BALL_LENGTH/2,
            top:that.paddle.bot,
            bot:that.paddle.bot-BALL_WIDTH,
            speed:PADDLE_SPEED
        }))];
        if(bricksDestroyed>=62){
            toReturn[0].speedUp();
        }
        if(bricksDestroyed>=32){
            toReturn[0].speedUp();
        }
        if(bricksDestroyed>=16){
            toReturn[0].speedUp();
        }
        if(bricksDestroyed>=4){
            toReturn[0].speedUp();
        }
        return toReturn;
    }
    that.addBall=function(paddle,bricksDestroyed){
        this.balls.push(new Ball({
            texture:textures.ballText,
            left:MidPaddle-BALL_LENGTH/2,
            right:MidPaddle+BALL_LENGTH/2,
            top:paddle.bot,
            bot:paddle.bot-BALL_WIDTH,
            speed:PADDLE_SPEED
        }));
        this.balls[this.balls.length-1].left=paddle.right-paddle.getLength()/2-BALL_LENGTH/2;
        this.balls[this.balls.length-1].right=paddle.right-paddle.getLength()/2+BALL_LENGTH/2;
        if(bricksDestroyed>=62){
            this.balls[this.balls.length-1].speedUp();
        }
        if(bricksDestroyed>=32){
            this.balls[this.balls.length-1].speedUp();
        }
        if(bricksDestroyed>=16){
            this.balls[this.balls.length-1].speedUp();
        }
        if(bricksDestroyed>=4){
            this.balls[this.balls.length-1].speedUp();
        }
        this.balls[this.balls.length-1].launch();

    }
    that.balls=that.createBall(0);
    return that;
}



function timerImage(imageStuff,graphics){
    this.image=new Image();
    var ready=false;
    this.image.onload=function(){
        ready=true;
    };
    this.getReady=function(){return ready;};
    this.image.src=imageStuff.imageSrc;
    this.graphics=graphics;
}
timerImage.prototype={
    render:function(){
        if(!this.getReady())
            return;
        this.graphics.drawImage({
            image:this.image,
            center:{x:420,y:210},
            size:500,
            rotation:0
        });
    }
};


function genericimage(imageStuff,graphics){
    this.image=new Image();
    var ready=false;
    this.image.onload=function(){
        ready=true;
    };
    this.getReady=function(){return ready;};
    this.image.src=imageStuff.imageSrc;
    this.graphics=graphics;
}
genericimage.prototype={
    render:function(proportions){
        if(!this.getReady())
            return;
        this.graphics.drawImage({
            image:this.image,
            center:{x:proportions.x,y:proportions.y},
            size:proportions.size,
            rotation:0
        });
    }

};
