function Faction(name, leader, joinCond, leaveCond, support, opposite, perk) {
  this.name = name;
  this.leader = leader;
  if (joinCond !== null) {
    this.joinCondStat = joinCond.stat;
    this.joinCondLevel = joinCond.level;
    this.joinCondValue = joinCond.value;
  }
  if (leaveCond !== null) {
    this.leaveCondStat = leaveCond.stat;
    this.leaveCondLevel = leaveCond.level;
    this.leaveCondValue = leaveCond.value;
  }

  this.support = support;
  this.opposite = opposite;
  this.members = [];
  this.perkProgress = 0;
  this.perk = perk;
  this.news = {};
}

Faction.prototype.newLeader = function(citizen) {
  if (this.isMember(citizen)) {
    this.leader = leader;
    return true
  } else {
    return false
  }

}

Faction.prototype.memberCount = function() {
  return this.members.length;
}

Faction.prototype.isMember = function(citizen) {
  if (isIn(citizen, this.members)) {
    return true
  } else {
    return false
  }
}

Faction.prototype.addMember = function(citizen) {
  if (this.isMember(citizen)) {
    return false
  } else {
    this.members.push(citizen);
    citizen.factions.push(this.name);
    console.log('Citizen has joined a faction')
    return this.memberCount()
  }
}
Faction.prototype.addMembers = function(list) {
  list.forEach(function(citizen){
    this.addMember(citizen)
  }, this)
  return this.memberCount()
}
Faction.prototype.removeMembers = function(list) {
  list.forEach(function(citizen){
    this.removeMember(citizen)
  }, this)
  return this.memberCount()
}


Faction.prototype.removeMember = function(citizen) { //NOTE if leader, set new leader, if last, delete progress
  console.log('Remove');
  if (this.isMember(citizen)) {
    var index = this.members.indexOf(citizen);
    this.members.splice(index,1);
    var index = citizen.factions.indexOf(this.name);
    citizen.factions.splice(index,1);
    console.log('Citizen has left a faction')
    return this.memberCount()
  } else {
    return false
  }
}
