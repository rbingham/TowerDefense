MyGame.particleSystems = (function(){

	/**********************************************************
		The ParticleSystem
		spec:{
				drawable,
				center:{x, y},
				speed:{mean, stdev},
				lifetime:{mean, stdev},
				size:{mean, stdev}
			}

		implements drawable
	***********************************************************/
	function ParticleSystem(spec) {
		'use strict';
		var that = {},
			nextName = 1,	// unique identifier for the next particle
			particles = {};	// Set of all active particles


		//------------------------------------------------------------------
		//
		// This creates one new particle
		//
		//------------------------------------------------------------------
		that.create = function() {
			var p = {
					//image: spec.image,
					size: Math.abs(Random.nextGaussian(spec.size.mean, spec.size.stdev)),
					//center: {x: spec.center.x, y: spec.center.y},
					center: {x: 0, y: 0},
					direction: Random.nextCircleVector(),
					speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
					rotation: 0,
					lifetime: Math.abs(Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev)),	// How long the particle should live, in seconds
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
					particle.rotation += particle.speed / 500;

					//
					// If the lifetime has expired, identify it for removal
					if (particle.alive > particle.lifetime) {
						removeMe.push(value);
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
			dims.center.x 	= spec.center.x+particle.center.x;
			dims.center.y 	= spec.center.y+particle.center.y;
			dims.width		= particle.size,
			dims.height 	= particle.size,
			dims.rotation 	= particle.rotation
		}

		that.draw = function() {
			var value,
				particle,
				dims;

			for (value in particles) {
				if (particles.hasOwnProperty(value)) {
					particle = particles[value];
					setParticleDims(particle, dims)
					spec.drawable.draw(dims);
				}
			}
		};

		return that;
	}

	/**********************************************************
		An example particle spec constructor
		drawable still needs to be added
	***********************************************************/
	var DefaultParticleSpec = function(){
		return {
			center: {x: 300, y: 300},
			size: {mean: 10, stdev: 40},
			speed: {mean: 50, stdev: 25},
			lifetime: {mean: 4, stdev: 1}
		}
	}

	return {
		ParticleSystem:ParticleSystem,
		DefaultParticleSpec:DefaultParticleSpec
	};
}());
