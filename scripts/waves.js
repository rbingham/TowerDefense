MyGame.components.waves = (function(){
	/*************************************
		WaveManager class
	*************************************/

	function WaveAdaptor(){
		return{
			levelStart:function(data){},
			levelEnd:function(data){},
			waveStart:function(data){},
			waveEnd:function(data){},
		};
	}

	function WaveListenerManager(){
		var that = {};

		var waveListeners = [];

		that.addWaveListener = function(waveListener){
			waveListener.waveListenerID = waveListeners.length;
			waveListeners.push(waveListener);
		}

		that.removeWaveListener = function(waveListener){
			if(waveListener.waveListenerID !== undefined){
				delete waveListeners[waveListener.waveListenerID];
			}
		}

		function forEach(funcName, data){
			for(let i=0; i<waveListeners.length; i++){
				if(waveListeners[i]!==undefined && waveListener.hasOwnProperty(funcName)){
					waveListener[funcName](data);
				}
			}
		}

		that.fireLevelStart = function(level){
			forEach('levelStart', {level:level});
		}

		that.fireLevelEnd = function(level){
			forEach('levelEnd', {level:level});
		}

		that.fireWaveStart = function(wave){
			forEach('waveStart', {wave:wave});
		}

		that.fireWaveEnd = function(wave){
			forEach('waveEnd', {wave:wave});
		}

		return that;
	}

	function WaveManager(spec){
		var that = {};
		var waveListenerManager = WaveListenerManager();
		var difficulty = 0;
		var levelInProgress = undefined;
		var creepManager = spec.creepManager;

		that.addWaveListener = function(waveListener){
			waveListenerManager.addWaveListener(waveListener);
		}

		that.removeWaveListener = function(waveListener){
			waveListenerManager.removeWaveListener(waveListener);
		}

		var internalWaveListener = {
			waveStart:function(wave){
				waveListenerManager.fireWaveStart(wave);
			},
			waveEnd:function(wave){
				waveListenerManager.fireWaveEnd(wave);
			}
		}

		that.initiateLevel = function(){
			if(levelInProgress===undefined){
				difficulty++;
				levelInProgress = Level(spec.creepManager, difficulty, internalWaveListener);
				waveListenerManager.fireLevelStart(levelInProgress.getDifficulty());
			}
		}

		that.update = function(elapsedTime){
			if(levelInProgress!==undefined){
				levelInProgress.update(elapsedTime);
				if(levelInProgress.isExausted()){
					waveListenerManager.fireLevelEnd(levelInProgress.getDifficulty());
					levelInProgress=undefined;
				}
			}
		}

		that.render = function(elapsedTime){
			MyGame.graphics.writeSpecificMessageOfSize("Level: "+difficulty, 80,620,20);
			if(levelInProgress!==undefined){
				levelInProgress.render(elapsedTime);
				//render wave and level
				return;
			}
		}

		return that;
	}

	function Level(creepManager, difficulty, waveListener){
		var that = {}
		var wavesExausted = 0;
		var wave = undefined;
		var timeToWait = 0;

		function resetTimeToWait(){
			timeToWait = 3000;
		}
		resetTimeToWait();

		that.getDifficulty = function(){
			return difficulty;
		}

		that.getWavesExausted = function(){
			return wavesExausted;
		}

		that.isExausted = function(){
			return wavesExausted===difficulty && creepManager.getCreepCount()===0;
		}
		that.update = function(elapsedTime){
			if(wavesExausted<difficulty){
				if(wave===undefined){
					if(timeToWait<=0){
						wave = Wave(creepManager, difficulty);
						waveListener.waveStart(wavesExausted);
					}else{
						timeToWait-=elapsedTime;
					}
				}
				if(wave!==undefined){
					wave.update(elapsedTime);
					if(wave.isExausted()){
						waveListener.waveEnd(wavesExausted);
						wavesExausted++;
						wave=undefined;
						resetTimeToWait();
					}
				}
			}
		}
		that.render = function(elapsedTime){
			if(0<timeToWait){
				MyGame.graphics.writeSpecificMessageOfSize("Next wave in:", 200,150,50);
				MyGame.graphics.writeSpecificMessageOfSize(Math.floor(timeToWait/1000)+1, 300,300,200);
			}

			if(wave!==undefined){
				wave.render(elapsedTime);
			}

			MyGame.graphics.writeSpecificMessageOfSize("Wave: "+(wavesExausted+1)+"/"+difficulty, 80,640,20);
		}

		return that;
	}

	function Wave(creepManager, difficulty){
		var that = {};
		var index = 0;
		var timeToWait = 0;
		var spawns = difficulty+3;

		that.getIndex = function(){
			return index;
		}

		that.getDifficulty = function(){
			return difficulty;
		}

		function resetTimeToWait(){
			timeToWait = 2000 + 5000/difficulty;
		}

		function spawnCreeps(){
			for(let i=0; i<(difficulty); i++){
				var creepSpec = MyGame.components.creeps.randomCreepSpec();
				creepManager.create(creepSpec, difficulty-1);
			}
		}

		that.isExausted = function(){
			return index===spawns && creepManager.getCreepCount()===0;
		}

		that.update = function(elapsedTime){
			var unusedTime = elapsedTime;
			while(0<unusedTime && index<spawns){
				if(timeToWait<unusedTime){
					unusedTime-=timeToWait;
					spawnCreeps(creepManager);
					resetTimeToWait();
					index++;
				}else{
					timeToWait-=unusedTime;
					unusedTime=0;
				}
			}
		}

		that.render = function(elapsedTime){
			if(index<spawns && 0<timeToWait){
				MyGame.graphics.writeSpecificMessageOfSize("Spawn "+(index+1)+"/"+spawns+" in: " + (Math.floor(timeToWait/1000)+1), 80,660,20);
			}
		}

		return that;
	}

	return {
		WaveManager,

	}
}());
