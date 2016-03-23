
function vectorfromOrigin(placemnet,origin){
    var temp={
        x:placemnet.x-origin.x,
        y:placemnet.y-origin.y
    };
    temp.x=temp.x/Math.sqrt(temp.x*temp.x+temp.y*temp.y);
    temp.y=temp.y/Math.sqrt(temp.x*temp.x+temp.y*temp.y);
    return temp;
}


function particleEngine(particleStuff,graphics){
    
    this.image=new Image();
    var ready=false;
    this.image.onload=function(){
        ready=true;
    };
    this.getReady=function(){return ready;};
    this.image.src=particleStuff.imageSrc;
    this.particles=[];
    this.graphics=graphics;
}

particleEngine.prototype={
    create:function(center,origin){
        this.particles.push({
            image:this.image,
            size: Math.random()*10,
            center:center,
            direction:vectorfromOrigin(center,origin),
            speed:Math.random()/4,
            rotation:0,
            lifetime:Math.random()*400,
            alive:0
        });
    },
    update:function(elapsed){
        for(var i=this.particles.length-1;i>=0;i--){
            this.particles[i].alive+=elapsed;
            this.particles[i].center.x+=(elapsed*this.particles[i].speed*this.particles[i].direction.x);
            this.particles[i].center.y+=(elapsed*this.particles[i].speed*this.particles[i].direction.y);
            
            
            this.particles[i].rotation+=this.particles[i].speed/500;
            //graphics.drawImage(this.particles[i]);
            
            if(this.particles[i].alive>this.particles[i].lifetime){
                this.particles.splice(i,1);
            }
        }
        
    },
    render:function(){
        if(!this.getReady())
            return;
        for(var i=0;i<this.particles.length;i++){
            this.graphics.drawImage(this.particles[i]);
        }
    }

};