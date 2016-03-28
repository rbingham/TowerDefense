/*
This File holds the structures used to emulate
the game play, such as enimies, towers

Concept We have the toer class as outside of the compents

Compents Is then composed of towers, and handles calling render on each of them
Wepons, parts of towers, generate bullets, which componets then handles and manages


*/
function Tower(spec){
    this.center=spec.center;
    this.weapon=spec.weapon;
    this.image=spec.image;
    this.rotation=0;
    this.height=spec.height;
    this.length=spec.length;
}
//tower funtions go here
Tower.prototype={
    shoot:function(){
        
    },
    draw:function(drawRange){
        if(drawRange==='undefined'){
            //Draw a circle for range.
        }
        image.draw();
        weapon.draw();//draw the weapon on top the turret
    }
}

function Weapon(spec){
    this.center=spec.center;
    this.weapon=spec.weapon;
    this.image=spec.image;
    this.rotation=0;
    this.height=spec.height;
    this.length=spec.length;
    this.range=spec.range;

}
//Weapon funtions go here

Weapon.prototype={
    shoot:function(){
        
    },
    draw:function(){
        image.draw();
    }
}



MyGame.components=(function(){
    var that={};

    that.towerArray=[];
    
    that.addTower=function(spec){
        that.towerArray.push(new Tower(spec));
    };
    
    that.renderTowers(elapsed){
        for(int i=0;i<toers.length;i++){
            that.towerArray[i].draw();
        }
    }
    //may want an update in future
    
    
    return that;
}());
