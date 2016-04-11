/**********************************************************
	creep components including:
		creep constructors
		shortest path algorithm
**********************************************************/
MyGame.components.creeps = (function(){
	"use strict"
	/**********************************************************
		The Creep Manager
			Knows about all the creeps
			Creates creeps

		spec:{arena, initialLocations[][], goals[][]}
	**********************************************************/
	var CreepManager = function(spec){
		var that = {};
		var nextCreepId = 0;
		var creeps = {};

		var shortestPaths = (function(){
			var sp = [];
			for(let i=0; i<spec.endGoals.length; i++){
				sp[i] = SortestPath({arena:arena, goals:goals[i]});
			}
			return sp;
		}());

		//maybe keep track of creeps by endGoal

		/**********************************************************
			Creep Creator
			spec:{creepSpec[], counts[], intervals[]}
		**********************************************************/
		that.create = function(spec){
			spec.id = nextCreepId
		}

		that.testPotentialArena(){

		}

		//could also just reset shortests paths if arena is not a new instance
		that.setCurrentArena(){

		}

		that.update(elapsedTime){

		}

		that.render

		return that;
	}


	/**********************************************************
		The Creep
			knows what it looks like
			knows where it is
			knows where it needs to go
				knows how to find out how to get there

			the difference between air and land creep is their shortest path

			takes a creepListener which is just any object that has the functions:
				creepKilled(id)
				creepReachedGoal(id)

		spec:{id, arena, drawable, initialLocation, initialHP, creepSpeed, shortestPath, creepListener}
	**********************************************************/
	var Creep = function(spec){
		var that = {};

		var hp = spec.initialHP;

		var shortestPath = spec.shortestPath;
		var currentGoal = {};
		var currentLocation = spec.initialLocation;

		that.getHP(){
			return hp;
		}

		that.hit = function(amount){
			hp-=amount;
			if(hp<=0) creepListener.creepKilled(that);
		}

		that.isShortestPathValid = function(potentialShortestPath){
			var distanceFromGoal = that.getDistanceFromGoal(potentialShortestPath);
			return typeof distanceFromGoal !== undefined;
		}

		that.setShortestPath = function(newShortestPath){
			shortestPath = newShortestPath;
		}

		/**********************************************************
			getDistanceFromEndGoal()
			uses shortestPath to find out distance from goal
			if return value is undefined than path is obstructed
		**********************************************************/
		that.getDistanceFromEndGoal = function(potentialShortestPath){
			var shortestPathToTest;
			if(potentialShortestPath){
				shortestPathToTest = potentialShortestPath;
			}else{
				shortestPathToTest = spec.shortestPath;
			}

			//get current rounded x,y
			//get distance from rounded currentXY
		}



		/**********************************************************
		* update creep
		**********************************************************/
		that.update = function(elapsedTime){
			//while there is elapsedTime left
				//given current location and next goal
					//move as close to it as elapsedTime will allow
				//update current location
				//decrement the elapsedTime used

			//if final goal is reached call creepListener.creepReachedGoal(spec.id)

			//update position
		}

		/**********************************************************
		* render creep
		**********************************************************/
		that.draw = function(elapsedTime){
			//update sprite?
			//call draw on sprite
		}

		return that;
	}

	/**********************************************************
		The ShortestPath
			(all points shortest path?)
			(some form of breadth first, perhaps with an optimization)

		spec:{arena, goals}
	**********************************************************/
	var ShortestPath = function(spec){
		//[][] {location,distance}
		var distanceFromEndGoalMatrix = (function(){
			var i;

			var matrix = [];
			for(i=0; i<spec.arena.rowCount; i++){
				arena[i]=[];
			}

			var endIndex=0;
			var workQueue = [];
			for(i=0; i<spec.goals.length; i++){
				workQueue.push({location:spec.goals[i], distance:0});
				endIndex++;
			}

			var work;
			var x,y;
			var nextDistance;

			for(i=0; i<endIndex; i++){
				work = workQueue[i];
				x=work.location.x;
				y=work.location.y;
				if(
					//arena @ x,y is valid and not occupied
					&& (
						typeof matrix[x][y] === undefined
						|| work.distance < matrix[x][y].distance
					)
				){

					matrix[x][y] = work;

					nextDistance = work.distance+1;
					workQueue.push({location:{x:x+1,y:y}}, distance:nextDistance});
					workQueue.push({location:{x:x-1,y:y}}, distance:nextDistance});
					workQueue.push({location:{x:x,y:y+1}}, distance:nextDistance});
					workQueue.push({location:{x:x,y:y-1}}, distance:nextDistance});

					nextDistance = work.distance+Math.sqrt(2);
					workQueue.push({location:{x:x+1,y:y+1}}, distance:nextDistance});
					workQueue.push({location:{x:x-1,y:y+1}}, distance:nextDistance});
					workQueue.push({location:{x:x+1,y:y-1}}, distance:nextDistance});
					workQueue.push({location:{x:x-1,y:y-1}}, distance:nextDistance});

					endIndex+=8;
				}
				delete workQueue[i];
			}

			return matrix;
		}());

		function getNextGoal(location){
			var goals = getNextGoals(location);
			
		}

		function getNextGoals(location){
			//lookup all adjacent and diagonal location in the matrix
			//return all locations that have the lowest distance from endGoal
		}

		function getDistanceFromGoal(location){
			return distanceFromEndGoalMatrix[location.x][location.y];
		}

		return {
			getNextGoals:getNextGoals,
			getDistanceFromGoal:getDistanceFromGoal;
		};
	}

	return {
		Creep:Creep
	};
}(););
