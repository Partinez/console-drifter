function Citizen(id, name, surname, age, sex, occupation) {
  this.id = id;
  this.name = name;
  this.surname = surname;
  this.age = age;
  this.sex = sex;
  this.occupation = occupation;
  this.needs = {
    happiness: 100,
    hunger: 20,
  }
}

Citizen.prototype.consume = function(timeDelta,availableFood) {
  var foodPerDay = Game.policies.foodConsumption;
  var consumption = timeDelta*foodPerDay;
  if (consumption <= availableFood) {
    return consumption
  } else {
    this.needs.happiness -= consumption-availableFood;
    return availableFood;
  }
}

Citizen.prototype.changeProf = function(prof) {
  delete Game.citizens[this.occupation][this.id];
  this.occupation = prof;
  Game.citizens[prof][this.id] = this;

}
