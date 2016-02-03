function Citizen(id, name, surname, age, sex, occupation, stats) {
  this.id = id;
  this.name = name;
  this.surname = surname;
  this.age = age;
  this.sex = sex;
  this.occupation = occupation;
  this.stats = stats;
  this.genes = this.generateGenes();
  this.factions = [];
}

Citizen.prototype.generateGenes = function() {
  var genes = {
    'str' : (Math.random()+Math.random())/2,
    'con' : (Math.random()+Math.random())/2,
    'dex' : (Math.random()+Math.random())/2,
    'int' : (Math.random()+Math.random())/2,
    'wis' : (Math.random()+Math.random())/2,
    'cha' : (Math.random()+Math.random())/2,

  }
  return genes
}

Citizen.prototype.update = function(timeDelta,info) {
  var answer = {
    consumed : {
      food : 0,
    },
    produced : {
      food : 0,
      building : 0,
    }
  };

  //consumption
  var foodPerDay = Game.policies.foodConsumption;
  var consumption = timeDelta*foodPerDay; //what it is going to try to eat.
  var foodAvailable = info['foodAvailable'];
  if (consumption <= foodAvailable) {
    this.react('eat', consumption);
    answer.consumed.food = consumption;
  } else {
    this.react('noFood', 2*(consumption-foodAvailable));
    answer.consumed.food = foodAvailable;
  }

  //updatestats The order is like this because stats are ussualy affected by
  //consumption and production is affected by stats
  this.stats.productivity = (this.stats.happiness+this.stats.intTec)/2;
  this.age += timeDelta;
  if (this.occupation == 'embryo' && this.age >= 0) {
    this.occupation == 'child';
  } else if (this.occupation == 'child' && this.age >= 280) {
    this.occupation == 'unemployed';
  }





  //production
  if (this.occupation == 'farming') {
    answer.produced.food = timeDelta*(this.stats.productivity/100)*(1+this.genes.str+this.genes.wis);
  } else if (this.occupation == 'engineering') {
    answer.produced.building = timeDelta*(this.stats.productivity/100)*(1+this.genes.int+this.genes.con);
  }

  return answer;
}

Citizen.prototype.react = function(event, multiplier) {
  multiplier = multiplier * ((Math.random()*0.4)+0.8)
  //This adds 20% randomness to the reaction.
  var genes = this.genes;
  if (event == 'eat') {
    this.stats.happiness += (1+genes.con+genes.wis)*multiplier;
  }
  if (event == 'noFood') {
    this.stats.happiness -= (1+genes.con+genes.wis)*multiplier*(1-this.stats.intEmo/200);
  }
  if (this.stats.happiness > 100) {
    this.stats.happiness = 100;
  } else  if (this.stats.happiness < 0) {
    this.stats.happiness = 0;
  }
}

Citizen.prototype.changeProf = function(prof) {
  delete Game.citizens[this.occupation][this.id];
  this.occupation = prof;
  Game.citizens[prof][this.id] = this;

}

Citizen.prototype.checkFactions = function() {
  actions = {
    leave : [],
    join : []
  }
  //leave
  this.factions.forEach(function(factionName) {
    faction = Game.factions[factionName];
    var stat = faction.leaveCondStat;
    var value = faction.leaveCondValue;
    var level = faction.leaveCondLevel;
    if (level == 'higher' && this.stats[stat] > value) {
      if (Math.random() < 0.6 ) { //60% to leave
        actions.leave.push(faction);
      }
    } else if (level == 'lower' && this.stats[stat] < value) {
      if (Math.random() < 0.6 ) { //60% to leave
        actions.leave.push(faction);
      }
    }
  }, this);

  //join
  for (var key in Game.factions) {
    if(Game.factions.hasOwnProperty(key)) {
      var faction = Game.factions[key];
      var stat = faction.joinCondStat;
      var value = faction.joinCondValue;
      var level = faction.joinCondLevel;
      if (level == 'higher' && this.stats[stat] > value) {
        if (Math.random() < 0.2 ) { //20% to join
          actions.join.push(faction);
        }
      } else if (level == 'lower' && this.stats[stat] < value) {
        if (Math.random() < 0.2 ) { //20% to join
          actions.join.push(faction);
        }
      }
    }
  }
  return actions
}


Citizen.prototype.ageInYears = function() {
  return Math.floor(this.age/52)
}
