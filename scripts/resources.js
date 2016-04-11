MyGame.resources = (function(graphics){
	var that = {};

	that.scottPilgrimSprite = graphics.genSprite("./images/scottpilgrim_multiple.png");
	that.ScottPilgrimSpriteInfo = function(){
		var spec = {}
		spec.height = 140;
		spec.width = 108;
		spec.spriteCount = 8;
		spec.spriteTime = [100, 100, 100, 100, 100, 100, 100, 100,];
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
			that.scottPilgrimSprite.draw(dims, scottPilgrimSpriteInfo);
		}

		return {draw:draw, update:update}
	}

	return that;
}(MyGame.graphics))
