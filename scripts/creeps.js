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

			//initialize the matrix
			var matrix = [];
			for(i=0; i<spec.arena.rowCount; i++){
				arena[i]=[];
			}

			//add all final goals to work array with a distance of zero
			var endIndex=0;
			var workQueue = [];
			for(i=0; i<spec.goals.length; i++){
				workQueue.push({location:spec.goals[i], distance:0});
				endIndex++;
			}

			//use workQueue to perform a breadth first search
			//the goal is to update every location of the matrix with a distance from goal
			var work;
			var x,y;
			var nextDistance;
			for(i=0; i<endIndex; i++){
				work = workQueue[i];
				x=work.location.x;
				y=work.location.y;

				//if location is valid and better than any current option
				if(
					//arena @ x,y is valid and not occupied
					&& (
						typeof matrix[x][y] === undefined
						|| work.distance < matrix[x][y].distance
					)
				){
					//set matrix location to be {location, distance}
					matrix[x][y] = work;

					//add all adjacent matrix locations to workQueue
					nextDistance = work.distance+1;
					workQueue.push({location:{x:x+1,y:y}}, distance:nextDistance});
					workQueue.push({location:{x:x,y:y+1}}, distance:nextDistance});
					workQueue.push({location:{x:x-1,y:y}}, distance:nextDistance});
					workQueue.push({location:{x:x,y:y-1}}, distance:nextDistance});

					//add all diagonal matrix locations to workQueue
					nextDistance = work.distance+Math.sqrt(2);
					workQueue.push({location:{x:x+1,y:y+1}}, distance:nextDistance});
					workQueue.push({location:{x:x-1,y:y+1}}, distance:nextDistance});
					workQueue.push({location:{x:x+1,y:y-1}}, distance:nextDistance});
					workQueue.push({location:{x:x-1,y:y-1}}, distance:nextDistance});

					//take note that 8 new locations have been added
					endIndex+=8;
				}
				delete workQueue[i];
			}

			return matrix;
		}());

		function getNextGoal(location){
			var goals = getNextGoals(location);
			var index = MyGame.random.nextRange(0,goals.length-1);
			return goals[index];
		}

		function addGoalToBestGoals(goal, goals){
			if(typeof goal !== undefined){
				if(goals.length===0 || goal.distance===goals[0].distance){
					goals.push(goal);
				}else if(goal.distance<goals[0].distance){
					goals = [];
					goals.push(goal);
				}
			}

			return goals;
		}

		function getNextGoals(location){
			var goals = [];
			var x = location.x;
			var y = location.y;

			//add adjacents
			goals = addGoalToBestGoals(matrix[x+1][y], goals);
			goals = addGoalToBestGoals(matrix[x][y+1], goals);
			goals = addGoalToBestGoals(matrix[x-1][y], goals);
			goals = addGoalToBestGoals(matrix[x][y-1], goals);

			//addDiagonals
			goals = addGoalToBestGoals(matrix[x+1][y+1], goals);
			goals = addGoalToBestGoals(matrix[x-1][y+1], goals);
			goals = addGoalToBestGoals(matrix[x+1][y-1], goals);
			goals = addGoalToBestGoals(matrix[x-1][y-1], goals);

			return goals;
		}

		function getDistanceFromGoal(location){
			return distanceFromEndGoalMatrix[location.x][location.y];
		}

		return {
			getNextGoal:getNextGoal,
			getNextGoals:getNextGoals,
			getDistanceFromGoal:getDistanceFromGoal;
		};
	}

	return {
		Creep:Creep
	};
}(););
