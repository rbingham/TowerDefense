
/*Assumes the following
    twoRectangles, rectangles are accsessAligned
*/
var Collision={
    twoRect:function(a,b){
        aleft=a.center.x-a.width/2;
        bleft=b.center.x-b.width/2;
        bright=b.center.x+b.width/2;
        aright=a.center.x+a.width/2;
        abot=a.center.y-a.height/2;
        bbot=b.center.y-b.height/2;
        btop=b.center.y+b.height/2;
        atop=a.center.y+a.height/2;
        if(aleft<bright&&aright>bleft&&atop<bbot&&abot>btop){
            return false;
        }
        return true;
    },
    pointRect:function (point,rect){
        var x=point.x,
            y=point.y;
        x-=rect.center.x;
        y-=rect.center.y;
        if(rect.rotatation==='undefined'){
            rect.rotatation=0;
        }
        //x=x*Math.cos(rect.rotatation)-y*Math.sin(rect.rotatation);
        //y=x*Math.sin(rect.rotatation)+y*Math.cos(rect.rotatation);
        y+=rect.height/2;
        x+=rect.width/2;
        if(x<0||y<0||y>rect.height||x>rect.width)
            return false;
        return true;
    },
    
    
    
    
}