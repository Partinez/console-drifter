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
  this.id = Game.building.idCount;
  Game.building.idCount++;
}

Structure.prototype.completed = function() {
  return this.effort/this.reqEff;
}

Structure.prototype.reqProgMats = function(newEffort) {
  if (this.effort + newEffort < this.reqEff) {
    var percent = newEffort/this.reqEff;
    return percent*this.reqMat; //Return the used mats
  } else if (this.effort + newEffort >= this.reqEff) {
    var percent = (this.reqEff-this.effort)/this.reqEff;
    return percent*this.reqMat
  }
}

Structure.prototype.build = function(newEffort) {
  if (this.effort + newEffort < this.reqEff) {
    var percent = newEffort/this.reqEff;
    this.effort += newEffort;
    return percent*this.reqMat; //Return the used mats
  } else if (this.effort + newEffort >= this.reqEff) {
    var percent = (this.reqEff-this.effort)/this.reqEff;
    this.effort = this.reqEff;
    this.finish();
    return percent*this.reqMat
  }
}

Structure.prototype.finish = function() {
  var type = this.type;
  if (!isIn(type,Object.keys(Game.built))) {
    Game.built[type] = {};
  }
  delete Game.building[type][this.id];
  if (Object.keys(Game.building[type]).length == 0) {
    delete Game.building[type];
  }
  Game.built[type][this.id] = this;
}

var structuresData = {
  'coldRoom' : {
    name : 'Cold room',
    reqMat : 30,
    reqEff : 600,
  },
  'storageRoom' : {
    name : 'Storage room',
    reqMat : 20,
    reqEff : 400,
  },
  'artificialWomb' : {
    name : 'Artificial womb',
    reqMat : 2000,
    reqEff : 1000,
  }
}

var builtStr = function(strType) {
  if (Game.built[strType] == undefined) {
    return -1;
  } else {
    return Object.keys(Game.built[strType]).length;
  }
}
