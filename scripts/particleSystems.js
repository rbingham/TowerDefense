MyGame.particleSystems = (function(graphics){

	/**********************************************************
		The ParticleSystem
		spec:{
				drawables[],
				center:{x, y},
				speed:{mean, stdev},
				rotationalSpeed:{mean, stdev},
				lifetime:{mean, stdev},
				size:{mean, stdev},
				particlesFade
			}

		implements drawable
	***********************************************************/
	function ParticleSystem(spec) {
		'use strict';
		if(spec===undefined){
			spec = DefaultParticleSpec();
			// spec.center = {x: 0, y: 0};
		}


		var that = {},
			nextName = 0,	// unique identifier for the next particle
			startIndex=0,
			particles = [],
			renderKeys;	// Set of all active particles


		//------------------------------------------------------------------
		//
		// This creates one new particle
		//
		//------------------------------------------------------------------
		function Particle(pSpec){
			var that={};
			that.size = 100;
			that.center = {x: 0, y: 0};
			that.direction = {x: 1, y: 0};
			that.speed = 10
			that.rotationalSpeed = 10
			that.rotation = 0;
			that.lifetime = 1000;
			var alive = 0;	// How long the particle has been alive, in seconds

			that.isAlive = function(){
				return alive<that.lifetime;
			}

			that.update = function(elapsedTime){
				var seconds = elapsedTime/1000;
				//
				// Update how long it has been alive
				alive += elapsedTime;

				//
				// Update its position
				that.center.x += (seconds * that.speed * that.direction.x);
				that.center.y += (seconds * that.speed * that.direction.y);

				//
				// Rotate proportional to its speed
				that.rotation += that.rotationalSpeed / 500;

				//
				// alpha proportional to its life
				if(that.particlesFade){
					that.alpha = 1-alive/that.lifetime;
				}

				if(pSpec && pSpec.hasOwnProperty("update")){
					pSpec.update(elapsedTime)
				}
			}

			that.draw = function(){
				that.width = that.size;
				that.height = that.size;
				if(pSpec && pSpec.hasOwnProperty("draw")){
					pSpec.draw(that);
				}else if(that.hasOwnProperty("drawable")){
					that.drawable.draw(that)
				}
			}

			return that;
		}

		that.createParticleWithDefaultEffect = function(){
			var p = Particle();

			// var drawableIndex = MyGame.random.nextRange(0, spec.drawables.length-1);
			p.drawable = MyGame.graphics.genericDrawables.greenRect;
			p.size = MyGame.random.nextGaussian(spec.size.mean, spec.size.stdev);
			p.direction = MyGame.random.nextCircleVector();
			p.speed = MyGame.random.nextGaussian(spec.speed.mean, spec.speed.stdev); // pixels per second
			p.rotationalSpeed = MyGame.random.nextGaussian(spec.rotationalSpeed.mean, spec.rotationalSpeed.stdev); // pixels per second
			p.lifetime = MyGame.random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev)*1000;	// How long the particle should live, in seconds
			p.particlesFade = true;
			//
			// Ensure we have a valid size - gaussian numbers can be negative
			p.size = Math.max(1, p.size);

			//
			// Same thing with lifetime
			p.lifetime = Math.max(0.01, p.lifetime);

			addParticle(p);
		}

		function addParticle(p){
			// Assign a unique name to each particle
			particles[nextName] = p;
			nextName++;
		};

		//------------------------------------------------------------------
		//
		// Update the state of all particles.  This includes remove any that
		// have exceeded their lifetime.
		//
		//------------------------------------------------------------------
		that.update = function(elapsedTime) {
			var removeMe = [],
				value,
				particle;

			for(let i=startIndex; i<nextName; i++){
				particle = particles[i];

				if (particle.isAlive()) {
					particle.update(elapsedTime);
				}
			}

			//
			// Remove all of the expired particles from front of array
			for (let i = startIndex; i<nextName && !particles[i].isAlive; i++) {
				startIndex++;
				delete particles[i];
			}
		};

		that.draw = function() {
			//graphics.pushContext();

			// if(systemDims){
			// 	graphics.applyDims(systemDims);
			// }else{
			// 	graphics.applyDims(spec);
			// }

			var particle;
			for (let i = nextName-1; startIndex<=i; i--) {
				particle = particles[i];
				if (particle.isAlive()) {
					particle.draw();
				}
			}

			// graphics.popContext();
		};

		///////////////////////////////////////////////////////////////////
		// Effects

		//creep death
		that.createCreepDeathParticles = function(creep){
			var p;

			for(let i=0; i<50; i++){

				p = Particle();

				// var drawableIndex = MyGame.random.nextRange(0, spec.drawables.length-1);
				p.drawable = creep.getDrawable();
				p.center = creep.getDims().center;
				p.size = MyGame.random.nextGaussian(MyGame.components.arena.subGrid, MyGame.components.arena.subGrid/2);
				p.direction = MyGame.random.nextCircleVector();
				p.speed = MyGame.random.nextGaussian(100, 50); // pixels per second
				p.rotationalSpeed = MyGame.random.nextGaussian(20, 45); // pixels per second
				p.lifetime = MyGame.random.nextGaussian(.5, .25)*1000;	// How long the particle should live, in seconds
				p.particlesFade = true;
				//
				// Ensure we have a valid size - gaussian numbers can be negative
				p.size = Math.max(1, p.size);

				//
				// Same thing with lifetime
				p.lifetime = Math.max(0.01, p.lifetime);

				addParticle(p);
			}
		}

		//bombTrail
        that.createBombTrailParticles = function(proj){

			for(let i=0; i<20; i++){

				let p = Particle();

				// var drawableIndex = MyGame.random.nextRange(0, spec.drawables.length-1);
				p.drawable = proj.getDrawable();
				p.center ={};
                p.center.x=proj.getDims().center.x;
                p.center.y=proj.getDims().center.y;
				p.size = MyGame.random.nextGaussian(MyGame.components.arena.subGrid, MyGame.components.arena.subGrid/2);
				p.direction = MyGame.random.nextCircleVector();
				p.speed = MyGame.random.nextGaussian(10,1); // pixels per second
				p.rotationalSpeed = MyGame.random.nextGaussian(20, 45); // pixels per second
				p.lifetime = MyGame.random.nextGaussian(2, .25)*1000;	// How long the particle should live, in seconds
				p.particlesFade = true;
				//
				// Ensure we have a valid size - gaussian numbers can be negative
				p.size = Math.max(1, p.size);

				//
				// Same thing with lifetime
				p.lifetime = Math.max(0.01, p.lifetime);

				addParticle(p);
			}
		}
		//bombHit

		//missleTrail

		//towerSold

		/////////////////////////////////////////////////////////////////

		return that;
	}

	/**********************************************************
		An example particle spec constructor
		drawable still needs to be added
	***********************************************************/
	var DefaultParticleSpec = function(){
		return {
			// drawables:[],
			// center: {x: 300, y: 300},
			size: {mean: 10, stdev: 40},
			speed: {mean: 75, stdev: 25},
			rotationalSpeed: {mean: 10, stdev: 30},
			lifetime: {mean: 4, stdev: 1}
		}
	}

	var TinyDefaultParticleSpec = function(){
		return {
			// drawables:[],
			// center: {x: 300, y: 300},
			size: {mean: 1, stdev: 4},
			speed: {mean: 14, stdev: 12},
			rotationalSpeed: {mean: 10, stdev: 30},
			lifetime: {mean: 4, stdev: 1}
		}
	}

	return {
		ParticleSystem:ParticleSystem,
		DefaultParticleSpec:DefaultParticleSpec,
		TinyDefaultParticleSpec:TinyDefaultParticleSpec
	};
}(MyGame.graphics));
