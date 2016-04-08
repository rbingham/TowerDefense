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
		that.create = function(pSpec) {
			var p = (function(){
				var that = {}
				var drawableIndex = MyGame.random.nextRange(0, spec.drawables.length-1);
				that.size = MyGame.random.nextGaussian(spec.size.mean, spec.size.stdev);
				that.center = {x: 0, y: 0};
				var direction = MyGame.random.nextCircleVector();
				var speed = MyGame.random.nextGaussian(spec.speed.mean, spec.speed.stdev); // pixels per second
				var rotationalSpeed = MyGame.random.nextGaussian(spec.rotationalSpeed.mean, spec.rotationalSpeed.stdev); // pixels per second
				that.rotation = 0;
				var lifetime = MyGame.random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev)*1000;	// How long the particle should live, in seconds
				var alive = 0;	// How long the particle has been alive, in seconds

				//
				// Ensure we have a valid size - gaussian numbers can be negative
				that.size = Math.max(1, that.size);
				that.width = that.size;
				that.height = that.size;

				//
				// Same thing with lifetime
				lifetime = Math.max(0.01, lifetime);

				that.isAlive = function(){
					return alive<lifetime;
				}

				that.update = function(elapsedTime){
					var seconds = elapsedTime/1000;
					//
					// Update how long it has been alive
					alive += elapsedTime;

					//
					// Update its position
					that.center.x += (seconds * speed * direction.x);
					that.center.y += (seconds * speed * direction.y);

					//
					// Rotate proportional to its speed
					that.rotation += rotationalSpeed / 500;

					//
					// alpha proportional to its life
					if(spec.particlesFade){
						that.alpha = 1-alive/lifetime;
					}

					if(pSpec && pSpec.hasOwnProperty("update")){
						pSpec.update(elapsedTime)
					}
				}

				that.draw = function(){
					if(pSpec && pSpec.hasOwnProperty("draw")){
						pSpec.draw(that);
					}else{
						spec.drawables[drawableIndex].draw(that);
					}
				}

				return that;
			}());

			// //
			// // Ensure we have a valid size - gaussian numbers can be negative
			// p.size = Math.max(1, p.size);
			// p.width = p.size;
			// p.height = p.size;
			// //
			// // Same thing with lifetime
			// p.lifetime = Math.max(0.01, p.lifetime);
			// p.alive = 0;
			//
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

			//renderKeys = [];

			//
			// We work with time in seconds, elapsedTime comes in as milliseconds
			//elapsedTime = elapsedTime / 1000;

			for(let i=startIndex; i<nextName; i++){
				particle = particles[i];

				if (particle.isAlive()) {
					particle.update(elapsedTime);

					// //
					// // Update how long it has been alive
					// particle.alive += elapsedTime;
					//
					// //
					// // Update its position
					// particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
					// particle.center.y += (elapsedTime * particle.speed * particle.direction.y);
					//
					// //
					// // Rotate proportional to its speed
					// particle.rotation += particle.rotationalSpeed / 500;
					//
					// //
					// // alpha proportional to its life
					// if(spec.particlesFade){
					// 	particle.alpha 	= 1-particle.alive/particle.lifetime;
					// }
				}
			}

			//
			// Remove all of the expired particles from front of array
			for (let i = startIndex; i<nextName && !particles[i].isAlive; i++) {
				startIndex++;
				delete particles[i];
			}
		};

		that.draw = function(systemDims) {
			graphics.pushContext();

			if(systemDims){
				graphics.applyDims(systemDims);
			}else{
				graphics.applyDims(spec);
			}

			var particle;
			for (let i = nextName-1; startIndex<=i; i--) {
				particle = particles[i];
				if (particle.isAlive()) {
					particle.draw();
				}
			}

			graphics.popContext();
		};

		return that;
	}

	/**********************************************************
		An example particle spec constructor
		drawable still needs to be added
	***********************************************************/
	var DefaultParticleSpec = function(){
		return {
			drawables:[],
			center: {x: 300, y: 300},
			size: {mean: 10, stdev: 40},
			speed: {mean: 75, stdev: 25},
			rotationalSpeed: {mean: 0, stdev: 30},
			lifetime: {mean: 4, stdev: 1}
		}
	}

	var TinyDefaultParticleSpec = function(){
		return {
			drawables:[],
			center: {x: 300, y: 300},
			size: {mean: 1, stdev: 4},
			speed: {mean: 14, stdev: 12},
			rotationalSpeed: {mean: 0, stdev: 30},
			lifetime: {mean: 4, stdev: 1}
		}
	}

	return {
		ParticleSystem:ParticleSystem,
		DefaultParticleSpec:DefaultParticleSpec,
		TinyDefaultParticleSpec:TinyDefaultParticleSpec
	};
}(MyGame.graphics));
