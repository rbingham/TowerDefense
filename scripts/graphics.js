MyGame.graphics=(function(){
    
    var canvas=document.getElementById('gameWindow');
    var context=canvas.getContext('2d');
    
    
    function clear(){
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();
        FillBackground();
    }
    function writeMessage(input){
        context.textAlign="center";
        context.fillText(input, canvas.width/2, canvas.height/2); 
        
    }
    function writeSpecificMessage(input,x,y){
        context.textAlign="center";
         context.font="30px Arial";
        context.fillText(input, x,y); 
    }
    function FillBackground(color){
        if(color===undefined)
            color='#FFFFFF'
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.fillStyle=color;
		context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();
        
    }
    function drawImage(toDraw){
        context.save();
		
		context.translate(toDraw.center.x, toDraw.center.y);
		context.rotate(toDraw.rotation);
		context.translate(-toDraw.center.x, -toDraw.center.y);
		
		context.drawImage(
			toDraw.image, 
			toDraw.center.x - toDraw.size/2, 
			toDraw.center.y - toDraw.size/2,
			toDraw.size, toDraw.size);
		
		context.restore();
    }
    
    var scaleGameboard=function (x,y){
        context.save();
        context.scale(canvas.width/y,canvas.height/x);
    }
    
    var unscaleGameBoard=function(){
        context.restore();
    }
    //CHANGE TO SPITE SHEET< AND HAVE IT USE DRAW IMAGE
    function SpriteSheet(spriteinfo){
        var that={};
        var ready=false;
        var image=new Image();
        var timeElapsed=0;
        image.onload = function(){
           that.draw = function (){
                context.save();
                				
				context.translate(spriteinfo.center.x, spriteinfo.center.y);
				context.rotate(spriteinfo.rotation);
				context.translate(-spriteinfo.center.x, -spriteinfo.center.y);
                
                context.drawImage(
                    image,
                    spriteinfo.width * sprite, 0,	// Which sprite to pick out
                    spriteinfo.width, spriteinfo.height,		// The size of the sprite
                    spriteinfo.center.x - spriteinfo.width/2,	// Where to draw the sprite
                    spriteinfo.center.y - spriteinfo.height/2,
                    spriteinfo.width, spriteinfo.height
                );
                context.restore();
                
            }
        }
        image.src=stringImagsource;
        that.draw= function(){
            
        };
        
        that.update = function(elapsedTime, forward) {
			timeElapsed += elapsedTime;
			if (spec.elapsedTime >= spec.spriteTime[spec.sprite]) {
				//
				// When switching sprites, keep the leftover time because
				// it needs to be accounted for the next sprite animation frame.
				timeElapsed -= spec.spriteTime[spec.sprite];
				//
				// Depending upon the direction of the animation...
				if (forward === true) {
					spec.sprite += 1;
					//
					// This provides wrap around from the last back to the first sprite
					spec.sprite = spec.sprite % spec.spriteCount;
				} else {
					spec.sprite -= 1;
					//
					// This provides wrap around from the first to the last sprite
					if (spec.sprite <= 0) {
						spec.sprite = spec.spriteCount - 1;
					}
				}
			}
		};

        
        
    
        return that;
    }
    
    return {
        scaleGameboard:scaleGameboard,
        unscaleGameBoard:unscaleGameBoard,
        clear:clear,
        Texture:Texture,
        drawImage:drawImage,
        writeMessage:writeMessage,
        writeSpecificMessage:writeSpecificMessage
    };
    
}());