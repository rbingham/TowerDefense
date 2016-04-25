



/*Tower initialization*/
var TowerTemplate=(function(){
    var that={};

    that.GroundBombWeapon={
        src:"./images/turret-3-",
        rotation:0,
        range:100,
    };
    that.GroundBomb={
        center:{x:0,y:0},
        weaponSpec:that.GroundBombWeapon,
        src:"./images/turret-base.png",
        rotation:0,
        height:40,
        width:40,
        targetAir:false,
        targetGround:true,
        type:PROJECTILETYPE.BOMB,
        cost:100,
        updgradeTier:[100,200,800],
    };


    that.GroundFreezeWeapon={
        src:"./images/turret-4-",
        rotation:0,
        range:100,
    };
    that.GroundFreeze={
        center:{x:0,y:0},
        weaponSpec:that.GroundFreezeWeapon,
        src:"./images/turret-base.png",
        rotation:0,
        height:40,
        width:40,
        targetAir:false,
        targetGround:true,
        type:PROJECTILETYPE.FREEZE,
        cost:100,
        updgradeTier:[100,200,800],
    };


    that.MixedProjectileWeapon={
        src:"./images/turret-6-",
        rotation:0,
        range:100,
    };
    that.MixedProjectile={
        center:{x:0,y:0},
        weaponSpec:that.MixedProjectileWeapon,
        src:"./images/turret-base.png",
        rotation:0,
        height:40,
        width:40,
        targetAir:true,
        targetGround:true,
        type:PROJECTILETYPE.PELLET,
        cost:100,
        updgradeTier:[100,200,800],
    };

    that.AirMissileWeapon={
        src:"./images/turret-7-",
        rotation:0,
        range:100,
    };
    that.AirMissile={
        center:{x:0,y:0},
        weaponSpec:that.AirMissileWeapon,
        src:"./images/turret-base.png",
        rotation:0,
        height:40,
        width:40,
        targetAir:true,
        targetGround:false,
        type:PROJECTILETYPE.MISSILE,
        cost:100,
        updgradeTier:[100,200,800],
    };

    return that;
}());
