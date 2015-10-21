function Structure(name, type, materials, effort) {
  this.name = name;
  this.materials = materials;
  this.effort = effort;
  if (!isIn(type, Object.keys(structuresData))) {
    throw 'Structure ' + name + "'s type " + type + ' invalid.'
  } else {
    this.type = type
    this.reqEff = structuresData[type].reqEff;
    this.reqMat = structuresData[type].reqMat;
  }
}

Structure.prototype.start = function() {
  this.materials = 0;
  this.effort = 0;
  var type = this.type;
  if (!isIn(type,Object.keys(Game.building))) {
    Game.building[type] = {};
  }
  Game.building[type][Game.building.idCount] = this;
  Game.building.idCount++;
}

Structure.prototype.completed = function() {
  return this.effort/this.reqEff;
}




var structuresData = {
  'coldRoom' : {
    reqMat : 1000,
    reqEff : 1000,
  },
}