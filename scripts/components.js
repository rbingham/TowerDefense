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
}
//tower funtions go here
Tower.prototype={
    shoot:function(){

    },
    draw:function(drawRange){
        if(drawRange!==undefined){
            MyGame.graphics.drawCircle({
                center:this.center,
                radius:this.weapon.range
            })
        }
        ImageHolder.drawImage(this.src,this);
        var tempR=this.rotation;
        this.rotation=this.weapon.rotation;
        ImageHolder.drawImage(this.weapon.src,this);
        this.rotation=tempR;
    },
    update(elapsed){
        this.weapon.rotation+=elapsed/10000;
        this.weapon.rotation%=2*Math.PI;
    }
}

function Weapon(spec){
    this.src=spec.src;
    this.rotation=0;
    this.range=spec.range;

}
//Weapon funtions go here

Weapon.prototype={
    shoot:function(){

    }
}



MyGame.components=(function(graphics){
    var that={};
    that.towerArray=[];
    
    function doesTowerFit(i,j,params){
        for(var icheck=i;(icheck-i)*that.arena.subGrid<params.width;icheck++){
            for(var jcheck=j;(jcheck-j)*that.arena.subGrid<params.height;jcheck++){
                if(that.takenGrid[icheck][jcheck]){
                    return false;
                }
            }   
        }
        return true;
    }
    function takeSpots(i,j,params){
        for(var icheck=i;(icheck-i)*that.arena.subGrid<params.width;icheck++){
            for(var jcheck=j;(jcheck-j)*that.arena.subGrid<params.height;jcheck++){
                that.takenGrid[icheck][jcheck]=true;
            }   
        }        
    }
    
    that.addTower=function(at,params){
        params.center=roundXY(at);
        coords=roundXY(at)
        lowerRighti=(coords.x-that.arena.center.x+that.arena.width/2)/(that.arena.subGrid);
        lowerRightj=(coords.y-that.arena.center.y+that.arena.height/2)/(that.arena.subGrid);
        if(!doesTowerFit(lowerRighti,lowerRightj,params)){
            return false;
        }
        takeSpots(lowerRighti,lowerRightj,params);
        that.towerArray.push(new Tower(params));
        tempTower=undefined;
        return true;
    };


    that.arena={
        center:{x:400,y:400},
        width:400,
        height:400,
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
                        rotation:0
                    });
                }
                for(var centery=this.center.y-this.height/2;centery<=this.center.y+this.height/2;centery+=this.subGrid){
                    graphics.drawRectangle({
                        center:{x:this.center.x,y:centery},
                        width:this.width,
                        height:1,
                        rotation:0
                    });
                }
            }else{
                ImageHolder.drawImage("./images/arena.png",this);
            }
        }
    };
    
    that.takenGrid=[];
    for(var i=0;i<that.arena.width/that.arena.subGrid;i++){
        that.takenGrid[i]=[];
        for(var j=0;j<that.arena.height/that.arena.subGrid;j++){
            that.takenGrid[i][j]=false;
        }
    }

    
    var tempTower;
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
            that.towerArray[i].draw();
        }
        if(tempTower!==undefined){
            tempTower.draw(true);
        }
    };

    /*
    function designed to render every part of componets
    rather user picking
    */
    that.renderAll=function(elapsed){
        that.renderTowers(elapsed);
        that.arena(false);
    };

    //may want an update in future

    that.sampleWeaponSpec={
        src:"./images/weapon.png",
        rotation:0,
        range:40,
    }
    that.otherSampleWeaponSpec={
        src:"./images/weapon2.png",
        rotation:0,
        range:40,
    }

    that.sampleTowerSpec={
        center:{x:0,y:0},
        weaponSpec:that.sampleWeaponSpec,
        src:"./images/tower.png",
        rotation:0,
        height:40,
        width:40,
    }

    that.otherSampleTowerSpec={
        center:{x:0,y:0},
        weaponSpec:that.otherSampleWeaponSpec,
        src:"./images/tower2.png",
        rotation:0,
        height:40,
        width:40,
    }

    return that;
}(MyGame.graphics));
