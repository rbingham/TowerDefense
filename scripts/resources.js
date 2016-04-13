MyGame.resources = (function(graphics){
	var that = {};

	that.scottPilgrimSprite = graphics.genSprite("./images/scottpilgrim_multiple.png");
	that.ScottPilgrimSpriteInfo = function(){
		var spec = {}
		var time = 150;
		spec.height = 140;
		spec.width = 108;
		spec.spriteCount = 8;
		spec.spriteTime = [time, time, time, time, time, time, time, time,];
		spec.movementSprite = true;
		spec.sprite = 0;

		return graphics.genSpriteInfo(spec);
	}
	that.ScottPilgrimSpriteDrawable = function(){
		var scottPilgrimSpriteInfo = that.ScottPilgrimSpriteInfo();
		function update(elapsedTime){
			scottPilgrimSpriteInfo.update(elapsedTime, true, true);
		}

		function draw(dims){
			dims.width = dims.height*scottPilgrimSpriteInfo.width/scottPilgrimSpriteInfo.height;

			if(dims.rotation<Math.PI/2){
				scottPilgrimSpriteInfo.row = 0;
			}else{
				scottPilgrimSpriteInfo.row = 1;
				dims.rotation = dims.rotation-Math.PI;
			}

			that.scottPilgrimSprite.draw(dims, scottPilgrimSpriteInfo);
		}

		return {draw:draw, update:update}
	}

    
    
    
    
    
    
	that.PelletSprite = graphics.genSprite("./images/tower.png");
	that.PelletSpriteInfo = function(){
		var spec = {}
		var time = 1000;
		spec.height = 10;
		spec.width = 10;
		spec.spriteCount = 1;
		spec.spriteTime = [time];
		spec.movementSprite = true;
		spec.sprite = 0;

		return graphics.genSpriteInfo(spec);
	}
	that.PelletSpriteDrawable = function(){
		var pelletSpriteInfo = that.PelletSpriteInfo();
		function update(elapsedTime){
            pelletSpriteInfo.update(elapsedTime, true, true);
		}

		function draw(dims){
            dims.width = dims.radius*2;
            dims.height = dims.radius*2;
            normx=dims.center.x;
            normy=dims.center.y;
            dims.rotation=Math.atan(normy/normx)+Math.PI/2 + (normx>=0?+Math.PI:0);
            pelletSpriteInfo.row = 0;
			that.PelletSprite.draw(dims, pelletSpriteInfo);
		}

		return {draw:draw, update:update}
	}
    
    
    
    
    
    
    
    
	return that;
}(MyGame.graphics))
