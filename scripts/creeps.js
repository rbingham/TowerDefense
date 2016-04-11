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

		spec:{initialLocations[][], goals[][], creepListener}
	**********************************************************/
	var CreepManager = function(spec){
		var that = {};
		var startCreepId = 0;
		var nextCreepId = 0;
		var creeps = [];

		var creepCountMatrix = (function(){
			//initialize all matrix values at 0
			return [];
		}());


		function buildShortestPaths(){
			var shortestPaths = [];
			for(let i=0; i<spec.endGoals.length; i++){
				shortestPaths[i] = ShortestPath({goals:spec.endGoals[i]});
			}
			return shortestPaths;
		}

		var shortestPaths = buildShortestPaths();

		that.rebuildShortestPaths = function(){
			shortestPaths = buildShortestPaths();

			for(let i=startCreepId; i<nextCreepId; i++){
				if(creeps[i] !== undefined){
					creeps[i].shortestPath = shortestPaths[creep[i].locationGoalIndex];
				}
			}
		}



		that.getCreepCountIJ = function(ij){
			return creepCountMatrix[ij.i, ij.j];
		}

		that.getCreepCountXY = function(xy){
			var ij = MyGame.components.xy2ij(xy);
			return getCreepCountIJ(ij);
		}

		that.isArenaStateGood = function(){
			var potentialShortestPaths = buildShortestPaths();
			var potentialShortestPath;
			var distanceToEndGoal;

			for(let i=startCreepId; i<nextCreepId; i++){
				if(creeps[i] !== undefined){
					potentialShortestPath = potentialShortestPaths[creep[i].locationGoalIndex];
					distanceToEndGoal = creeps[i].getDistanceFromEndGoal(potentialShortestPath);
					if(distanceToEndGoal === undefined) return false;
				}
			}
			return true;
		}

		/**********************************************************
			Creep Creator
			creepSpec:{locationGoalIndex, drawable, initialHP, creepSpeed}
		**********************************************************/
		that.create = function(creepSpec){
			creepSpec.id = nextCreepId++;
			var initialLocationIndex = MyGame.random.nextRange(0, spec.initialLocations[creepSpec.locationGoalIndex].length-1);
			creepSpec.initialLocation = spec.initialLocations[creepSpec.locationGoalIndex][initialLocationIndex];
			creepSpec.shortestPath = shortestPaths[creepSpec.locationGoalIndex];
			creepSpec.creepListener = that;

			var creep = Creep(creepSpec);

			creeps[creepSpec.id] = creep;
			//increment creepCountMatrix
		}

		function cleenUpCreeps(){
			let done = false;
			for(let i=startCreepId; i<nextCreepId && !done; i++){
				if(creeps[i] === undefined){
					startCreepId = i+1;
				}else{
					done = true;
				}
			}
		}

		that.update = function(elapsedTime){
			for(let i=startCreepId; i<nextCreepId; i++){
				if(creeps[i] !== undefined){
					creeps[i].update(elapsedTime);
				}
			}

			cleenUpCreeps();
		}

		that.render = function(elapsedTime){
			for(let i=startCreepId; i<nextCreepId; i++){
				if(creeps[i] !== undefined){
					creeps[i].draw(elapsedTime);
				}
			}
		}

		//creep listener functions
		that.creepKilled = function(creep){
			if(spec.creepListener !== undefined){
				spec.creepListener.creepKilled(creep);
			}

			//decrement creepCountMatrix

			delete creeps[creep.getID()];
		}

		that.creepReachedGoal = function(creep){
			if(spec.creepListener !== undefined){
				spec.creepListener.creepReachedGoal(creep);
			}

			//decrement creepCountMatrix

			delete creeps[creep.getID()];
		}

		that.creepMoved = function(creep, oldLocation, newLocation){
			//update creepCountMatrix
		}

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

		spec:{id, locationGoalIndex, initialLocation, shortestPath, drawable, initialHP, creepSpeed, creepListener}
	**********************************************************/
	var Creep = function(spec){
		var that = {};

		var hp = spec.initialHP;

		var shortestPath = spec.shortestPath;
		var currentLocation = (function(){
			var xy = MyGame.components.ij2xy(spec.initialLocation);
			return {
				x:xy.x, y:xy.y, i:spec.initialLocation.i, j:spec.initialLocation.j
			}
		}());
		var currentGoal;
		var distanceToGoal;
		var velocity;

		function updateCurrentLocationIJ(){
			var oldLocation = {i:currentLocation.i, j:currentLocation.j};

			//convert currentLocation x,y to i,j
			var ij = MyGame.components.xy2ij(currentLocation);
			//and add to currentLocation
			currentLocation.i=ij.i;
			currentLocation.j=ij.j;

			if(oldLocation.i!==currentLocation.i || oldLocation.j!==currentLocation.j){
				spec.creepListener.creepMoved(that, oldLocation);
			}
		}
		updateCurrentLocationIJ();

		function updateCurrentGoal(){
			currentGoal = spec.shortestPath.getNextGoal(currentLocation);
			var xy = MyGame.components.ij2xy(currentGoal.location);
			currentGoal.location.x=xy.x;
			currentGoal.location.y=xy.y;
		}
		updateCurrentGoal();

		function updateDistanceToGoal(){
			distanceToGoal = {x:(currentGoal.location.x-currentLocation.x), y:(currentGoal.location.y-currentLocation.y)};
			distanceToGoal.total = Math.sqrt(Math.pow(distanceToGoal.x,2)+Math.pow(distanceToGoal.y,2));
			distanceToGoal.time = distanceToGoal.total/spec.creepSpeed;
		}
		updateDistanceToGoal();

		function updateVelocity(){
			var unitDistance = {x:distanceToGoal.x/distanceToGoal.total, y:distanceToGoal.y/distanceToGoal.total};
			velocity = {x:unitDistance.x*spec.creepSpeed, y:unitDistance.y*spec.creepSpeed};
			velocity.rotation = Math.atan2(unitDistance.x, unitDistance.y);
		}
		updateVelocity();

		that.getID = function(){
			return spec.id;
		}

		that.getLocationGoalIndex = function(){
			return spec.locationGoalIndex;
		}

		that.getHP = function(){
			return hp;
		}

		that.hit = function(amount){
			hp-=amount;
			if(hp<=0) creepListener.creepKilled(that);
		}

		that.isShortestPathValid = function(potentialShortestPath){
			var distanceToEndGoal = that.getDistanceFromGoal(potentialShortestPath);
			return distanceToEndGoal !== undefined;
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

			return shortestPathToTest.getDistanceFromEndGoal(currentLocation);
		}



		/**********************************************************
		* update creep
		**********************************************************/
		that.update = function(elapsedTime){
			var localElapsedTime = elapsedTime/1000;
			//while there is elapsedTime left
			while(0<localElapsedTime){
				//if there is time to reach the next goal, reach it and decrement elapsedTime
				if(distanceToGoal.time<=localElapsedTime){
					currentLocation.x = currentGoal.location.x;
					currentLocation.y = currentGoal.location.y;
					localElapsedTime-=distanceToGoal.time;
					updateCurrentLocationIJ();

					if(that.getDistanceFromEndGoal()===0){
						spec.creepListener.creepReachedGoal(that);
						return;
					}

					updateCurrentGoal();
					updateDistanceToGoal();
					updateVelocity();
				}else{
					currentLocation.x += velocity.x*localElapsedTime;
					currentLocation.y += velocity.y*localElapsedTime;
					localElapsedTime=0;
					updateCurrentLocationIJ();
					updateDistanceToGoal();
				}
			}
		}

		/**********************************************************
		* render creep
		**********************************************************/
		var dims = {};
		dims.height = MyGame.components.arena.subGrid;
		dims.width = dims.height;
		that.draw = function(elapsedTime){
			dims.center = currentLocation;
			dims.rotation = velocity.rotation;//get rotation from direction

			//update sprite
			if(spec.drawable.hasOwnProperty("update")){
				drawable.update(elapsedTime);
			}

			spec.drawable.draw(dims);
		}

		return that;
	}

	/**********************************************************
		The ShortestPath
			(all points shortest path?)
			(some form of breadth first, perhaps with an optimization)

		spec:{goals}
	**********************************************************/
	var ShortestPath = function(spec){
		//[][] {location,distance}
		var that = {};
		var adjacentDistance = 1;
		var diagonalDistance = Math.sqrt(2);

		var distanceToEndGoalMatrix = (function(){
			var i,j;

			//initialize the matrix
			var matrix = [];
			var columnCount = MyGame.components.getArenaColumnCount();
			for(i=0; i<columnCount; i++){
				matrix[i]=[];
			}

			//add all final goals to work array with a distance of zero
			var endIndex=0;
			var workQueue = [];
			for(let workIndex=0; workIndex<spec.goals.length; workIndex++){
				workQueue.push({location:spec.goals[workIndex], distance:0});
				endIndex++;
			}

			function arenaLocationIsValidAndUnoccupied(i,j){
				//needs to check for towers, should take into account towers being placed
				return MyGame.components.isValidIJ({i:i,j:j});
			}

			//use workQueue to perform a breadth first search
			//the goal is to update every location of the matrix with a distance from goal
			var work;
			var nextDistance;
			for(let workIndex=0; workIndex<endIndex; workIndex++){
				work = workQueue[workIndex];
				i=work.location.i;
				j=work.location.j;

				//if location is valid and better than any current option
				if(
					arenaLocationIsValidAndUnoccupied(i,j)
					&& (
						matrix[i][j] === undefined
						|| work.distance < matrix[i][j].distance
					)
				){
					//set matrix location to be {location, distance}
					matrix[i][j] = work;

					//add all adjacent matrix locations to workQueue
					nextDistance = work.distance+adjacentDistance;
					workQueue.push({location:{i:i+1,j:j}, distance:nextDistance});
					workQueue.push({location:{i:i,j:j+1}, distance:nextDistance});
					workQueue.push({location:{i:i-1,j:j}, distance:nextDistance});
					workQueue.push({location:{i:i,j:j-1}, distance:nextDistance});

					//add all diagonal matrix locations to workQueue
					nextDistance = work.distance+diagonalDistance;
					workQueue.push({location:{i:i+1,j:j+1}, distance:nextDistance});
					workQueue.push({location:{i:i-1,j:j+1}, distance:nextDistance});
					workQueue.push({location:{i:i+1,j:j-1}, distance:nextDistance});
					workQueue.push({location:{i:i-1,j:j-1}, distance:nextDistance});

					//take note that 8 new locations have been added
					endIndex+=8;
				}
				delete workQueue[workIndex];
			}

			return matrix;
		}());

		that.getDistanceFromEndGoal = function(location){
			if(distanceToEndGoalMatrix[location.i]===undefined
					|| distanceToEndGoalMatrix[location.i][location.j] === undefined){
				return undefined;
			}

			return distanceToEndGoalMatrix[location.i][location.j].distance;
		}

		that.getNextGoal = function(location){
			var goals = getNextGoals(location);

			if(goals.length===0) return undefined;

			var index = MyGame.random.nextRange(0,goals.length-1);
			return goals[index];
		}

		function addGoalToBestGoals(i, j, goals, distance){
			if(
				distanceToEndGoalMatrix[i]!==undefined
				&& distanceToEndGoalMatrix[i][j]!==undefined
			){
				var goal = distanceToEndGoalMatrix[i][j];
				var goalDistance = goal.distance+distance;
				var push = false;
				if(goals.length===0 || goalDistance===goals[0].distance){
					push = true;
				}else if(goalDistance<goals[0].distance){
					goals = [];
					push=true;
				}

				if(push){
					goals.push({distance:goalDistance,location:goal.location});
				}
			}

			return goals;
		}

		function getNextGoals(location){
			var goals = [];
			var i = location.i;
			var j = location.j;
			var addedDistance;

			//add adjacents
			addedDistance = adjacentDistance;
			goals = addGoalToBestGoals(i+1, j,   goals, addedDistance);
			goals = addGoalToBestGoals(i,   j+1, goals, addedDistance);
			goals = addGoalToBestGoals(i-1, j,   goals, addedDistance);
			goals = addGoalToBestGoals(i,   j-1, goals, addedDistance);

			//addDiagonals
			addedDistance = diagonalDistance;
			// addedDistance = adjacentDistance;
			goals = addGoalToBestGoals(i+1, j+1, goals, addedDistance);
			goals = addGoalToBestGoals(i-1, j+1, goals, addedDistance);
			goals = addGoalToBestGoals(i+1, j-1, goals, addedDistance);
			goals = addGoalToBestGoals(i-1, j-1, goals, addedDistance);

			return goals;
		}

		return that;
	}

	return {
		CreepManager:CreepManager
	};
}());
