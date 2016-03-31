
ImageHolder=(function(graphics){
    var that={},
        imagehold=[];
    that.drawImage=function(src,specs){
        if(imagehold[src]===undefined){
            imagehold[src]=graphics.genImage(src);
            imagehold[src].draw(specs); 
        }
        else{
            imagehold[src].draw(specs); 
        }
    }
    
    that.drawSpite=function(src,specs,spriteInfo){
        if(imagehold[src]===undefined){
            imagehold[src]=graphics.genSprite(src,spriteInfo);
            imagehold[src].draw(specs,spriteInfo); 
        }
        else{
            imagehold[src].draw(specs,spriteInfo); 
        }
    }
    
    
    return that;
}(MyGame.graphics));