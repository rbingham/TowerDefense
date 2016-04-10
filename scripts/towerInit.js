
/*Tower initialization*/
var TowerTemplate=(function(){
    var that={};
    that.GroundBombWeapon={
        src:"./images/weaponsprite.png",
        rotation:0,
        range:40,
    };
    that.GroundFreezeWeapon={
        src:"./images/weaponsprite.png",
        rotation:0,
        range:40,
    };

    that.GroundBomb={
        center:{x:0,y:0},
        weaponSpec:that.GroundBombWeapon,
        src:"./images/tower.png",
        rotation:0,
        height:40,
        width:40,
    };

    that.GroundFreeze={
        center:{x:0,y:0},
        weaponSpec:that.GroundFreezeWeapon,
        src:"./images/tower2.png",
        rotation:0,
        height:40,
        width:40,
    };
    return that;
}());