function Citizen(id, name, surname, age, sex, occupation) {
  this.id = id;
  this.name = name;
  this.surname = surname;
  this.age = age;
  this.sex = sex;
  this.occupation = occupation;
  this.stats = {
    happiness: 99,
    hunger: 20,
    intEmo : 20, //Emotional intelligence, reduces impact of negative events.
    intTec : 50,
    productivity : 0, //updated real-time average of intTec and happiness
  },
  this.genes = this.generateGenes();
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
