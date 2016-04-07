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
			nextName = 1,	// unique identifier for the next particle
			particles = {},
			renderKeys;	// Set of all active particles


		//------------------------------------------------------------------
		//
		// This creates one new particle
		//
		//------------------------------------------------------------------
		that.create = function() {
			var p = {
					//image: spec.image,
					drawableIndex: MyGame.random.nextRange(0, spec.drawables.length-1),
					size: MyGame.random.nextGaussian(spec.size.mean, spec.size.stdev),
					//center: {x: spec.center.x, y: spec.center.y},
					center: {x: 0, y: 0},
					direction: MyGame.random.nextCircleVector(),
					speed: MyGame.random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
					rotationalSpeed: MyGame.random.nextGaussian(spec.rotationalSpeed.mean, spec.rotationalSpeed.stdev), // pixels per second
					rotation: 0,
					lifetime: MyGame.random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// How long the particle should live, in seconds
					alive: 0	// How long the particle has been alive, in seconds
				};

			//
			// Ensure we have a valid size - gaussian numbers can be negative
			p.size = Math.max(1, p.size);
			//
			// Same thing with lifetime
			p.lifetime = Math.max(0.01, p.lifetime);
			//
			// Assign a unique name to each particle
			particles[nextName++] = p;
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

			renderKeys = [];

			//
			// We work with time in seconds, elapsedTime comes in as milliseconds
			elapsedTime = elapsedTime / 1000;

			for (value in particles) {
				if (particles.hasOwnProperty(value)) {
					particle = particles[value];
					//
					// Update how long it has been alive
					particle.alive += elapsedTime;

					//
					// Update its position
					particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
					particle.center.y += (elapsedTime * particle.speed * particle.direction.y);

					//
					// Rotate proportional to its speed
					particle.rotation += particle.rotationalSpeed / 500;

					//
					// If the lifetime has expired, identify it for removal
					if (particle.alive > particle.lifetime) {
						removeMe.push(value);
					}else{
						renderKeys.push(value);
					}
				}
			}

			//
			// Remove all of the expired particles
			for (particle = 0; particle < removeMe.length; particle++) {
				delete particles[removeMe[particle]];
			}
			removeMe.length = 0;
		};

		function setParticleDims(particle, dims){
			dims.center.x 	= particle.center.x;
			dims.center.y 	= particle.center.y;
			dims.width		= particle.size,
			dims.height 	= particle.size,
			dims.rotation 	= particle.rotation

			if(spec.particlesFade){
				dims.alpha 	= 1-particle.alive/particle.lifetime;
			}
		}

		that.draw = function(systemDims) {
			graphics.pushContext();

			if(systemDims){
				graphics.applyDims(systemDims);
			}else{
				graphics.applyDims(spec);
			}

			var value,
				particle,
				dims={center:{}};

			for (let i = renderKeys.length-1; 0<=i; i--) {
				particle = particles[renderKeys[i]];
				setParticleDims(particle, dims)
				spec.drawables[particle.drawableIndex].draw(dims);
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
			speed: {mean: 7.0, stdev: 2.5},
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
