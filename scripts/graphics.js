BrickGame.graphics=(function(){
    
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
    function FillBackground(){
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.fillStyle="#FFFFFF";
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
    //takes an object with top,bot, left and right
    function Texture(stringImagsource){
        var that={};
        var ready=false;
        var image=new Image();
        image.onload = function(){
            ready = true;
        }
        image.src=stringImagsource;
        
        
        that.draw = function (BrickLike){
                    //context.fillRect(BrickLike.right,BrickLike.top,10,10);
            
            if(ready){
                context.save();
                //context.fillRect(BrickLike.left,BrickLike.bot,BrickLike.getLength(),BrickLike.getWidth());

                
                context.drawImage(
                    image,
                    BrickLike.left,
                    BrickLike.bot,
                    BrickLike.getLength(),
                    BrickLike.getWidth()
                );
                context.restore();
            }
        }
    
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