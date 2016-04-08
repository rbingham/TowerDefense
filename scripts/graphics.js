MyGame.graphics=(function(){

    var canvas=document.getElementById('GameWindow');
    var context=canvas.getContext('2d');


    function clear(){
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();
        fillBackground();
    }
    function writeMessage(input){
        context.textAlign="center";
        context.fillText(input, canvas.width/2, canvas.height/2);

    }
    //may want to rewrite
    function writeSpecificMessage(input,x,y){
        context.textAlign="center";
         context.font="30px Arial";
        context.fillText(input, x,y);
    }
    function fillBackground(color){
        if(color===undefined)
            color='#FFFFFF'
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.fillStyle=color;
		context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();

    }

    function scaleGameboard(x,y){
        context.save();
        context.scale(canvas.width/y,canvas.height/x);
    }

    function unscaleGameBoard(){
        context.restore();
    }

    function pushContext(){
        context.save();
    }

    function popContext(){
        context.restore();
    }

    function genImage(srcFile){
        var that={},
            image=new Image();
        image.onload=function(){
            that.draw=function(spec){
                context.save();
                context.translate(spec.center.x, spec.center.y);
                context.rotate(spec.rotation);
                context.translate(-spec.center.x, -spec.center.y);
                context.drawImage(
                    image,
                    spec.center.x - spec.width/2,
                    spec.center.y - spec.height/2,
                    spec.width, spec.height);
                context.restore();

            }
        };
        image.src=srcFile;
        that.draw=function(spec){};
        return that;
    }

    /*
    Expects an onbject of with top right x, top right y,
    width, hieght, rotation
    fill ="rgba(r,g,b,a)"\storke style, is the stroke of the outer areana
    */
    function drawCircle(spec){
        context.save();
        context.strokeStyle = spec.stroke;
        context.beginPath();
        context.arc(spec.center.x, spec.center.y,spec.radius,0,2*Math.PI);
        context.stroke();
        context.restore();
    };

    function drawRectangle(spec){
        context.save();
        context.translate(spec.center.x , spec.center.y);
        context.rotate(spec.rotation);
        context.translate(-(spec.center.x), -(spec.center.y));
        context.fillStyle = spec.fill;
        context.fillRect(spec.center.x-spec.width/2, spec.center.y-spec.height/2, spec.width, spec.height);
        context.strokeStyle = spec.stroke;
        context.strokeRect(spec.center.x-spec.width/2, spec.center.y-spec.height/2, spec.width, spec.height);

        context.restore();
    };


    /*
    takes,
    */
    function genSprite(src){
        var that={};
        var image=new Image();
        image.onload = function(){
           that.draw = function (spec,spriteinfo){
                context.save();

				context.translate(spec.center.x, spec.center.y);
				context.rotate(spec.rotation);
				context.translate(-spec.center.x, -spec.center.y);

                context.drawImage(
                    image,
                    spec.width * spriteinfo.sprite, 0,	// Which sprite to pick out
                    spec.width, spec.height,		// The size of the sprite
                    spec.center.x - spec.width/2,	// Where to draw the sprite
                    spec.center.y - spec.height/2,
                    spec.width, spec.height
                );
                context.restore();

            }
        }
        image.src=spriteinfo.src;
        that.draw= function(){

        };
        return that;
    }

    function genSpriteInfo(spec){
        var timeElapsed=0;
        spec.update=function(elapsedTime, forward) {
			timeElapsed += elapsedTime;
			if (timeElapsed >= spec.spriteTime[spec.sprite]) {
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

        return spec;
    }




    function applyDims(dims){

        if(dims.hasOwnProperty("center")){
            context.translate(dims.center.x, dims.center.y);
        }

        if(dims.hasOwnProperty("rotation")){
            context.rotate(dims.rotation);
        }

        if(dims.hasOwnProperty("alpha")){
            context.globalAlpha *= dims.alpha;
        }
    }

    function drawImageWithDims(img, spec){
        context.save();

        applyDims(dims);

		context.drawImage(
			img,
			-dims.width/2,
			-dims.height/2,
			dims.width, dims.height);

		context.restore();
    }

    function drawRectangleWithDims(spec, dims){
        context.save();

        applyDims(dims);

        if (spec.hasOwnProperty("fill")) {
            context.fillStyle = spec.fill;
            context.fillRect(-dims.width/2, -dims.height/2, dims.width, dims.height);
        }

        if (spec.hasOwnProperty("stroke")) {
            context.strokeStyle = spec.stroke;
            context.strokeRect(-dims.width/2, -dims.height/2, dims.width, dims.height);
        }

        context.restore();
    }


    function ImageDrawable(srcFile){
        var that={},
            image=new Image();
        image.onload=function(){
            that.draw=function(spec){
                drawImageWithDims(image ,spec);
            }
        };
        image.src=srcFile;
        that.draw=function(spec){};
        return that;
    }

    function RectangleDrawable(spec){
        function draw(dims){
            drawRectangleWithDims(spec, dims);
        }
        return {draw:draw};
    }

    var genericDrawables={
        // redRect:RectangleDrawable({fill:"red",stroke:"black"}),
        // greenRect:RectangleDrawable({fill:"green",stroke:"black"}),
        // blueRect:RectangleDrawable({fill:"blue",stroke:"black"}),
        redRect:RectangleDrawable({fill:"red"}),
        greenRect:RectangleDrawable({fill:"green"}),
        blueRect:RectangleDrawable({fill:"blue"}),
    }

    return {
        scaleGameboard:scaleGameboard,
        unscaleGameBoard:unscaleGameBoard,
        clear:clear,
        genImage:genImage,
        genericDrawables:genericDrawables,
        ImageDrawable:ImageDrawable,
        RectangleDrawable:RectangleDrawable,
        genSpriteInfo:genSpriteInfo,
        genSprite:genSprite,
        writeMessage:writeMessage,
        writeSpecificMessage:writeSpecificMessage,
        drawRectangle:drawRectangle,
        drawCircle:drawCircle,
        canvas:canvas,
        pushContext:pushContext,
        popContext:popContext,
        applyDims:applyDims
    };

}());
