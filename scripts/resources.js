MyGame.resources = (function(graphics){
	var that = {};

	function handleUpdsideDown(dims){
		while(dims.rotation<0){
			dims.rotation+=(Math.PI*2);
		}
		while((Math.PI*2-0.1)<=dims.rotation){
			dims.rotation-=(Math.PI*2);
		}

		if((Math.PI/2-Math.PI/8)<dims.rotation && dims.rotation<(3*Math.PI/2+Math.PI/8)){;
			dims.flip = true;
			dims.rotation += Math.PI;
		}else{
			dims.flip = false;
		}
	}

	function addWidthsHeightsAndTimes(spec, time){
		for(let i=0; i<spec.spriteLocations.length; i++){
			spec.spriteTime[i]=time;
			spec.spriteLocations[i].width = (spec.spriteLocations[i].x2-spec.spriteLocations[i].x1);
			spec.spriteLocations[i].height = (spec.spriteLocations[i].y2-spec.spriteLocations[i].y1);
		}
		spec.spriteCount = spec.spriteLocations.length;
	}

	function maintainAspectRatio(dims, spriteInfo){
		dims.width = dims.height
		*spriteInfo.spriteLocations[spriteInfo.sprite].width
		/spriteInfo.spriteLocations[spriteInfo.sprite].height;
	}

	that.scottPilgrimSprite = graphics.genSprite("./images/Scott-Pilgrim-transparent.png");
	that.ScottPilgrimSpriteInfo = function(){
		var spec = {}
		var time = 100;
		spec.spriteTime = [];
		spec.movementSprite = true;
		spec.sprite = 0;
		spec.spriteLocations = [
			{x1:10, y1:76, x2:48, y2:138},
			{x1:50, y1:76, x2:94, y2:138},
			{x1:96, y1:76, x2:150, y2:138},
			{x1:152, y1:76, x2:199, y2:138},
			{x1:201, y1:76, x2:241, y2:138},
			{x1:242, y1:76, x2:285, y2:138},
			{x1:286, y1:76, x2:338, y2:138},
			{x1:339, y1:76, x2:388, y2:138},
		]

		addWidthsHeightsAndTimes(spec, time);

		return graphics.genSpriteInfo(spec);
	}
	that.ScottPilgrimSpriteDrawable = function(){
		var spriteInfo = that.ScottPilgrimSpriteInfo();
		function update(elapsedTime){
			spriteInfo.update(elapsedTime, true, true);
		}

		function draw(dims){
			maintainAspectRatio(dims, spriteInfo);

			handleUpdsideDown(dims);

			that.scottPilgrimSprite.draw(dims, spriteInfo);
		}

		return {draw:draw, update:update}
	}

	that.ramonaFlowersSprite = graphics.genSprite("./images/Ramona-Flowers-transparent.png");
	that.RamonaFlowersSpriteInfo = function(){
		var spec = {}
		var time = 100;
		spec.spriteTime = [];
		spec.movementSprite = true;
		spec.sprite = 0;
		spec.spriteLocations = [
			{x1:631, y1:124, x2:680, y2:191},
			{x1:681, y1:124, x2:725, y2:191},
			{x1:726, y1:124, x2:775, y2:191},
			{x1:776, y1:124, x2:823, y2:191},
			{x1:824, y1:124, x2:872, y2:191},
			{x1:873, y1:124, x2:915, y2:191},
			{x1:916, y1:124, x2:964, y2:191},
			{x1:965, y1:124, x2:1011, y2:191},
		];

		addWidthsHeightsAndTimes(spec, time);

		return graphics.genSpriteInfo(spec);
	}
	that.RamonaFlowersSpriteDrawable = function(){
		var spriteInfo = that.RamonaFlowersSpriteInfo();
		function update(elapsedTime){
			spriteInfo.update(elapsedTime, true, true);
		}

		function draw(dims){

			maintainAspectRatio(dims, spriteInfo);

			handleUpdsideDown(dims);

			that.ramonaFlowersSprite.draw(dims, spriteInfo);
		}

		return {draw:draw, update:update}
	}

	that.matthewPatelSprite = graphics.genSprite("./images/Matthew-Patel-transparent.png");
	that.DemonSpriteInfo = function(){
		var spec = {}
		var time = 100;
		spec.spriteTime = [];
		spec.movementSprite = true;
		spec.sprite = 0;
		spec.spriteLocations = [
			{x1:179, y1:2007, x2:270, y2:2073},
			{x1:271, y1:2007, x2:360, y2:2073},
			{x1:27, y1:2007, x2:90, y2:2073},
			{x1:91, y1:2007, x2:134, y2:2073},
			{x1:135, y1:2007, x2:178, y2:2073},
			{x1:91, y1:2007, x2:134, y2:2073},
			{x1:27, y1:2007, x2:90, y2:2073},
			{x1:271, y1:2007, x2:360, y2:2073},
		];
		addWidthsHeightsAndTimes(spec, time);

		return graphics.genSpriteInfo(spec);
	}
	that.DemonSpriteDrawable = function(){
		var spriteInfo = that.DemonSpriteInfo();
		function update(elapsedTime){
			spriteInfo.update(elapsedTime, true, true);
		}

		function draw(dims){
			maintainAspectRatio(dims, spriteInfo);
			handleUpdsideDown(dims);

			that.matthewPatelSprite.draw(dims, spriteInfo);
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
