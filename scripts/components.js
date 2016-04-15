/*
This File holds the structures used to emulate
the game play, such as enimies, towers

Concept We have the toer class as outside of the compents

Compents Is then composed of towers, and handles calling render on each of them
Wepons, parts of towers, generate bullets, which componets then handles and manages


*/



/*
Knows what it's weapon is,
Knows where it is, and where it's image source file is
*/
function Tower(spec){
    this.center=spec.center;
    this.weapon=new Weapon(spec.weaponSpec);
    this.src=spec.src;
    this.rotation=0;
    this.height=spec.height;
    this.width=spec.width;
    this.watchcreep={inRange:false,creep:{}};
    this.fireprev=1000;
    this.maxLevel=3;
    this.level=1;
    this.rotationspeed=50;
}
//tower funtions go here
Tower.prototype={
    shoot:function(){

    },
    draw:function(drawRange){
        if(drawRange!==undefined&&drawRange===true){
            MyGame.graphics.drawCircle({
                center:this.center,
                radius:this.weapon.range,
                fill: "rgba(0,0,0,1)",
                stroke: "rgba(0,0,0,1)"
            })
        }
        ImageHolder.drawImage(this.src,this);
        var tempR=this.rotation;
        this.rotation=this.weapon.rotation;
        ImageHolder.drawImage(this.weapon.src,this);
        this.rotation=tempR;
    },
    update:function(elapsed){
        //this.weapon.rotation+=elapsed/10000;
        //this.weapon.rotation%=2*Math.PI;
        //this.weapon.spriteinfo.update(elapsed,true);
        if(this.watchcreep.inRange){
            var hp=this.watchcreep.creep.getHP();
            var inrange=Collision.circleRect(this.getCircleSight(),this.watchcreep.creep.getDims());
            if(hp<=0||!inrange||this.watchcreep.creep.getDistanceFromEndGoal()==0){
                this.watchcreep.inRange=false;
                this.watchcreep.creep={};
            }else{
                //point at the watched creep
                normx=this.watchcreep.creep.getDims().center.x-this.center.x;
                normy=this.watchcreep.creep.getDims().center.y-this.center.y;
                var destang=Math.atan(normy/normx)+Math.PI/2 + (normx>=0?+Math.PI:0);
                destang-=this.weapon.rotation;
                if(destang<0){
                    destang+=Math.PI*2;
                }
                if(destang>Math.PI){
                    this.weapon.rotation-=this.rotationspeed*elapsed/10000;
                }else{
                    this.weapon.rotation+=this.rotationspeed*elapsed/10000;
                }
                if(this.weapon.rotation>=Math.PI*2){
                    this.weapon.rotation-=Math.PI*2;
                }
                
                if(this.weapon.rotation<0){
                    this.weapon.rotation+=Math.PI*2;
                }
                if(this.fireprev<0){
                    if(destang<1||destang>Math.Pi*2-1){
                        this.fireprev=1000;
                        MyGame.gameModel.addProjectile(
                            {x:this.center.x,y:this.center.y},
                            {x:-Math.cos(this.weapon.rotation-Math.PI/2)*200,
                            y:-Math.sin(this.weapon.rotation-Math.PI/2)*200});
                    }
                }else{
                    this.fireprev-=elapsed;
                }
            }
        }
        
        
    },
    getCircleSight:function(){
        that={};
        that.radius=this.weapon.range;
        that.center=this.center;
        return that;
    },
    creepNearBy:function(creep){
        if(!this.watchcreep.inRange){
            if(Collision.circleRect(this.getCircleSight(),creep.getDims())){
                this.watchcreep.inRange=true;
                this.watchcreep.creep=creep;
            }
        }
    },
    upgrade:function(){
        this.level++;
        if(this.level>this.maxLevel){
            this.level=this.maxLevel;
        }else{
            this.weapon.range+=100;
            this.weapon.src=this.weapon.srcbase+this.level+".png";
            
        }
    }
}

function Weapon(spec){
    this.srcbase=spec.src;
    this.rotation=0;
    this.range=spec.range;
    this.src=this.srcbase+1+".png";
    /*this.spriteinfo=MyGame.graphics.genSpriteInfo({
        sprite:0,
        spriteCount:3,
        spriteTime:[1000,200,100],
        height:40,
        width:40,
    });*/
}
//Weapon funtions go here

Weapon.prototype={
    shoot:function(){

    }
}




function validPathExists(grid,start,exits){
    var queue=[];
    var by=[];
    var toReset=[];
    queue.push(start);
    by.push('foobar');
    var found=false;
    while(!found&&queue.length!==0){
        var i=queue.shift();
        if(grid[i.x][i.y].hit||grid[i.x][i.y].taken){
            continue;
        }
        grid[i.x][i.y].hit=true;
        toReset.push(i);

        //set found to true if any match, thats what the or is for
        for(var j=0;j<exits.length;j++){
            if((exits[j].x===i.x&&exits[j].y===i.y)){
                found=true;
            }
        }


        for(var j=0;j<grid[i.x][i.y].adjacent.length;j++){
            queue.push(grid[i.x][i.y].adjacent[j]);
        }
    }
    /*console.log(start);
    var t="";
    for(var j=0;j<grid.length;j++){
        for(var k=0;k<grid[j].length;k++){
            t+=grid[j][k].hit?"X":"_";
        }
        t+='\n'
    }
    console.log(t);*/


    for(var j=0;j<toReset.length;j++){
        grid[toReset[j].x][toReset[j].y].hit=false;
    }
    return found;

}

MyGame.components=(function(graphics){
    var that={};
    that.towerArray=[];

    function doesTowerFit(i,j,params,creepManager){
        if(i<=0||j<=0||i>=that.arena.width/that.arena.subGrid||j>=that.arena.height/that.arena.subGrid){
            return false
        }

        var toReset=[];
        for(var icheck=i;(i-icheck)*that.arena.subGrid<params.width;icheck--){
            for(var jcheck=j;(j-jcheck)*that.arena.subGrid<params.height;jcheck--){
                if(that.takenGrid[icheck][jcheck].taken){
                    for(var j=0;j<toReset.length;j++){
                        that.takenGrid[toReset[j].x][toReset[j].y].hit=false;
                    }
                    return false;
                }
                that.takenGrid[icheck][jcheck].hit=true;
                toReset.push({x:icheck,y:jcheck});
            }
        }


        var hit = creepManager.whatIf();

        //check if any exits are impossible
        // var hit=true;
        // for(var i=0;i<4;i++){
        //     hit=hit&&validPathExists(that.takenGrid,that.entrances[(i+2)%4][0],that.entrances[i]);
        // }
        for(var j=0;j<toReset.length;j++){
            that.takenGrid[toReset[j].x][toReset[j].y].hit=false;
        }

        return hit;
    }
    function takeSpots(i,j,params){
        for(var icheck=i;(i-icheck)*that.arena.subGrid<params.width;icheck--){
            for(var jcheck=j;(j-jcheck)*that.arena.subGrid<params.height;jcheck--){
                that.takenGrid[icheck][jcheck].taken=true;
            }
        }
    }

    that.isTaken = function(at){
        return that.takenGrid[at.i][at.j].taken;
    }

    that.isHit = function(at){
        return that.takenGrid[at.i][at.j].hit;
    }

    that.addTower=function(at,params,creepManager){
        params.center=roundXY(at);
        coords=roundXY(at)
        lowerRighti=(coords.x-that.arena.center.x+that.arena.width/2)/(that.arena.subGrid);
        lowerRightj=(coords.y-that.arena.center.y+that.arena.height/2)/(that.arena.subGrid);
        if(!doesTowerFit(lowerRighti,lowerRightj,params,creepManager)){
            return false;
        }
        takeSpots(lowerRighti,lowerRightj,params);
        that.towerArray.push(new Tower(params));
        tempTower=undefined;
        addTowerListeners(that.towerArray[that.towerArray.length-1]);
        
        return true;
    };
    that.checkTowerPlacement=function(at,params){
        params.center=roundXY(at);
        coords=roundXY(at)
        lowerRighti=(coords.x-that.arena.center.x+that.arena.width/2)/(that.arena.subGrid);
        lowerRightj=(coords.y-that.arena.center.y+that.arena.height/2)/(that.arena.subGrid);
        if(!doesTowerFit(lowerRighti,lowerRightj,params)){
            return false;
        }
        return true;
    };
    
    
    function addTowerListeners(tower){
        for(var i=0;i<that.towerListeners.length;i++){
            for(var j=0;j<that.towerListeners[i].length;j++){
                var gridspace={
                        center:{
                            x:that.arena.subGrid*i+that.arena.subGrid/2+that.arena.center.x-that.arena.width/2,
                            y:that.arena.subGrid*j+that.arena.subGrid/2+that.arena.center.x-that.arena.width/2
                        },
                        width:that.arena.subGrid,
                        height:that.arena.subGrid
                    };

                if(Collision.circleRect(tower.getCircleSight(),gridspace)){
                    that.towerListeners[i][j].push(tower);
                }
            }
        }
    }


    that.arena={
        center:{x:300,y:300},
        width:600,
        height:600,
        subGrid:20,
		fill : 'rgba(0, 150, 250, 1)',
		stroke : 'rgba(255, 0, 0, 1)',
        draw:function(drawGrid){
            if(drawGrid!==undefined){
                ImageHolder.drawImage("./images/arena.png",this);
                for(var centerx=this.center.x-this.width/2;centerx<=this.center.x+this.width/2;centerx+=this.subGrid){
                    graphics.drawRectangle({
                        center:{x:centerx,y:this.center.y},
                        width:1,
                        height:this.height,
                        rotation:0,
                        fill: "rgba(0,0,0,1)",
                        stroke: "rgba(0,0,0,1)"
                    });
                }
                for(var centery=this.center.y-this.height/2;centery<=this.center.y+this.height/2;centery+=this.subGrid){
                    graphics.drawRectangle({
                        center:{x:this.center.x,y:centery},
                        width:this.width,
                        height:1,
                        rotation:0,
                        fill: "rgba(0,0,0,1)",
                        stroke: "rgba(0,0,0,1)"
                    });
                }
            }else{
                ImageHolder.drawImage("./images/arena.png",this);
            }
        }
    };

    that.towerListeners=[];
    that.takenGrid=[];
    //should allow us to add diagnals in the future
    for(var i=0;i<that.arena.width/that.arena.subGrid;i++){
        that.takenGrid[i]=[];
        that.towerListeners[i]=[];
        for(var j=0;j<that.arena.height/that.arena.subGrid;j++){
            that.takenGrid[i][j]={taken:false,hit:false,adjacent:[]};
            that.towerListeners[i][j]=[];
        }
    }
    for(var i=0;i<that.takenGrid.length;i++){
        for(var j=0;j<that.takenGrid[i].length;j++){
            if(i-1>=0){
                that.takenGrid[i][j].adjacent.push({x:i-1,y:j});
            }
            if(i+1<that.takenGrid.length){
                that.takenGrid[i][j].adjacent.push({x:i+1,y:j});
            }
            if(j-1>=0){
                that.takenGrid[i][j].adjacent.push({x:i,y:j-1});
            }
            if(j+1<that.takenGrid[i].length){
                that.takenGrid[i][j].adjacent.push({x:i,y:j+1});
            }
        }
    }

    function roundXY(at){
        return {
            x:at.x-at.x%that.arena.subGrid,
            y:at.y-at.y%that.arena.subGrid
        };
    }
    function xyToGridSpace(at){
        return {
            x:at.x-at.x%that.arena.subGrid,
            y:at.y-at.y%that.arena.subGrid
        };
    }

    that.xy2ij = function(xy){
        var xy = roundXY(xy);
        var lowerRighti=(xy.x-that.arena.center.x+that.arena.width/2)/(that.arena.subGrid);
        var lowerRightj=(xy.y-that.arena.center.y+that.arena.height/2)/(that.arena.subGrid);
        return {
            i:lowerRighti,
            j:lowerRightj
        }
    }

    that.ij2xy = function(ij){
        var centerX=(that.arena.center.x-that.arena.width/2)+(ij.i*that.arena.subGrid)+(that.arena.subGrid/2);
        var centerY=(that.arena.center.y-that.arena.height/2)+(ij.j*that.arena.subGrid)+(that.arena.subGrid/2);
        return {
            x:centerX,
            y:centerY
        }
    }

    that.isValidIJ = function(ij){
        var startX = that.arena.center.x-that.arena.width/2;
        var endX = startX + that.arena.width;
        var startY = that.arena.center.y-that.arena.height/2;
        var endY = startX + that.arena.height;
        var xy = that.ij2xy(ij);
        return startX<xy.x && xy.x<endX && startY<xy.y && xy.y < endY;
    }

    that.getArenaColumnCount = function(){
        return (that.arena.width+that.arena.subGrid)/that.arena.subGrid - 1;
    }


    //0:east 1:north?, 2:west, 3:south?
    that.entrances=[[],[],[],[]]
    for(var i=0;i<4;i++){
        that.entrances[0].push({x:that.takenGrid.length-1,y:(that.takenGrid.length/2-2)+i});
        that.entrances[2].push({x:0,y:(that.takenGrid.length/2-2)+i});
        that.entrances[1].push({x:(that.takenGrid.length/2-2)+i,y:0});
        that.entrances[3].push({x:(that.takenGrid.length/2-2)+i,y:that.takenGrid[0].length-1});
    }
    for(let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            // let ij = that.xy2ij(xythat.entrances[i][j]);
            // that.entrances[i][j].i=ij.i;
            // that.entrances[i][j].j=ij.j;
            that.entrances[i][j].i=that.entrances[i][j].x;
            that.entrances[i][j].j=that.entrances[i][j].y;
        }
    }

    var tempTower;
    that.placingOver=function(at,params){
        params.center=roundXY(at);
        tempTower=new Tower(params);
    }

    that.mousePlacingExitFrame=function(){

    }
    that.updateTowers=function(elapsed){
        for(var i=0;i<that.towerArray.length;i++){
            that.towerArray[i].update(elapsed);
        }
    }


    that.renderTowers=function(elapsed){
        for(var i=0;i<that.towerArray.length;i++){
            that.towerArray[i].draw(i==prevSelected.index);
        }
        if(tempTower!==undefined){
            tempTower.draw(true);
        }
    };
    that.TowerMovementDetector=function(creep,location){
        for(var i=0;i<that.towerListeners[location.i][location.j].length;i++){
            that.towerListeners[location.i][location.j][i].creepNearBy(creep);
        }
    }
    
    
    var prevSelected={onSelected:false,is:{},index:-1};
    //must be passed as xytoij takes them as it will call that function
    that.selectATower=function(coords){
        var ij=that.xy2ij(coords);
        
        if(that.takenGrid[ij.i][ij.j].taken){
            prevSelected.onSelected=true;
            
            var i=0;
            for(i=0;i<that.towerArray.length;i++){
                
                var disx=that.towerArray[i].center.x-(coords.x);
                var disy=that.towerArray[i].center.y-(coords.y);
                
                var dis2=disx*disx+disy*disy;
                if(dis2<=that.arena.subGrid*that.arena.subGrid*2){  
                    prevSelected.index=i;
                }
            }
            prevSelected.is=that.xy2ij(that.towerArray[prevSelected.index].center);
        }
        else{
            prevSelected.onSelected=false;
            prevSelected.is={};
            prevSelected.index=-1;
        }
    }
    
    //Selected tower must be called before this function
    that.removeTower=function(){
        if(!prevSelected.onSelected){
            return;
        }
        //remove from taken and from the tower arrray
        //remove all its tower listeners        
        var t=that.towerArray[prevSelected.index].width;
        for(var i=prevSelected.is.i;i>=prevSelected.is.i-that.towerArray[prevSelected.index].width/that.arena.subGrid;i--){
            for(var j=prevSelected.is.j;j>=prevSelected.is.j-that.towerArray[prevSelected.index].height/that.arena.subGrid;j--){
                that.takenGrid[i][j].taken=false;
            }
        }
        var t="";
        for(var j=0;j<that.takenGrid.length;j++){
            for(var k=0;k<that.takenGrid[i].length;k++){
                t+=that.takenGrid[j][k].taken?"X":"_";
            }
            t+='\n'
        }
        console.log(t);
        //triple loop to look for the listeners
        for(var i=0;i<that.towerListeners.length;i++){
            for(var j=0;j<that.towerListeners[i].length;j++){
                for(var k=that.towerListeners[i][j].length-1;k>=0;k--){
                    if(that.towerListeners[i][j][k].center.x===that.towerArray[prevSelected.index].center.x
                        &&that.towerListeners[i][j][k].center.y===that.towerArray[prevSelected.index].center.y){
                        that.towerListeners[i][j].splice(k,1);
                    }
                }
            }
        }
        that.towerArray.splice(prevSelected.index,1);
        prevSelected.onSelected=false;
        prevSelected.is={};
        prevSelected.index=-1;
    }
    
    //Selected tower must be called before this function
    that.upgradeTower=function(){
        if(!prevSelected.onSelected){
            return;
        }
        //increeaes range
        that.towerArray[prevSelected.index].upgrade();
        //triple loop to add the listeners for expanded range, upgrade does not move towers so we are good
        for(var i=0;i<that.towerListeners.length;i++){
            for(var j=0;j<that.towerListeners[i].length;j++){
                var alreadyexists=false;
                for(var k=that.towerListeners[i][j].length-1;k>=0;k--){
                    if(that.towerListeners[i][j][k].center.x===that.towerArray[prevSelected.index].center.x
                        &&that.towerListeners[i][j][k].center.y===that.towerArray[prevSelected.index].center.y){
                            
                        alreadyexists=true;


                    }
                }
                var gridspace={
                    center:{
                        x:that.arena.subGrid*i+that.arena.subGrid/2+that.arena.center.x-that.arena.width/2,
                        y:that.arena.subGrid*j+that.arena.subGrid/2+that.arena.center.x-that.arena.width/2
                    },
                    width:that.arena.subGrid,
                    height:that.arena.subGrid
                };
                if(!alreadyexists&&Collision.circleRect(that.towerArray[prevSelected.index].getCircleSight(),gridspace)){
                    that.towerListeners[i][j].push(that.towerArray[prevSelected.index]);
                }
            }
        }

    }
    
    
    
    
    
    

    /*
    function designed to render every part of componets
    rather user picking
    */
    that.renderAll=function(elapsed){
        that.renderTowers(elapsed);
        that.arena(false);
    };

    //may want an update in future



    return that;
}(MyGame.graphics));
