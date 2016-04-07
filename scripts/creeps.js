/**********************************************************
	creep components including:
		creep constructors
		shortest path algorithm
**********************************************************/
MyGame.components.creeps = (function(){

	/**********************************************************
		The Creep
			knows what it looks like
			knows where it is
			knows where it needs to go
				knows how to find out how to get there

			takes a creepListener which is just any object that has the functions:
				creepKilled(id)
				creepReachedGoal(id)

		spec:{id, canvas, drawable, initialLocation, shortestPath, initialHP, creepListener}
	**********************************************************/
	var Creep = function(spec){
		var hp = spec.initialHP;

		function hit(amount){
			//update hp
			//if dead call creepListener.creepKilled(spec.id);
		}

		/**********************************************************
		* update creep
		**********************************************************/
		function update(elapsedTime){
			//while there is elapsedTime left
				//given current location get next goal from shortestPath
				//given next goal move as close to it as elapsedTime will allow
				//update current location
				//decrement the elapsedTime used

			//if final goal is reached call creepListener.creepReachedGoal(spec.id)

			//update position
		}

		/**********************************************************
		* render creep
		**********************************************************/
		function draw(elapsedTime){
			//update sprite
			//call draw on sprite
		}

		return {

		};
	}

	/**********************************************************
		The ShortestPath
			(all points shortest path?)
			(some form of breadth first, perhaps with an optimization)

		spec:{arena, goals}
	**********************************************************/
	var ShortestPath = function(spec){
		var goalMatrix = [];

		/**********************************************************
			given a location return the location of an unobstructed goal
		**********************************************************/
		function getGoal(location){
			//lookup current location in a map or 2d array
			if (
				a[location.x] !== undefined
				&& a[location.x][location.y] !== undefined
			){
				//if goal exists return goal
				return a[location.x][location.y];
			}else{
				//else return calculate goal
				return calculateGoal(location);
			}
		}

		function clear(){
			goalMatrix = [];
		}

		function calculateGoal(location){
			//remember to take into account all goals

			//a* would be best but the amount of code is pretty heavy

			//maybe breadth first? (this would be the easiest to code)
				//maybe after breadth first optimize to find strait paths

			//durring breadth first take into account previously found paths

			//after a path or unobstructed goal is found
				//update all applicable matrix locations to reflect goal
		}

		return {

		};
	}

	return {
		Creep:Creep
	};
}(););
