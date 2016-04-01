/*
This File holds the structures used to emulate
the game play, such as enimies, towers

Concept We have the toer class as outside of the compents

Compents Is then composed of towers, and handles calling render on each of them
Wepons, parts of towers, generate bullets, which componets then handles and manages


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

    that.addTower=function(at,params){
        params.center=roundXY(at);
        that.towerArray.push(new Tower(params));
        tempTower=undefined;
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
    var tempTower;
    function roundXY(at){
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
