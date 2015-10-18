
var setUpGenerators = function() {

  Game.maleNameG = new ROT.StringGenerator();
  var r = new XMLHttpRequest();
  r.open("get", "data/malenames.txt", true);
  r.send();

  r.onreadystatechange = function() {
    if (r.readyState != 4) { return; }

    var lines = r.responseText.split("\n");
    while (lines.length) {
        var line = lines.pop().trim();
        if (!line) { continue; }
        Game.maleNameG.observe(line);
    }
    Game.createInitialCitizens();
  }

  Game.femaleNameG = new ROT.StringGenerator();
  var r1 = new XMLHttpRequest();
  r1.open("get", "data/femalenames.txt", true);
  r1.send();

  r1.onreadystatechange = function() {
    if (r1.readyState != 4) { return; }

    var lines = r1.responseText.split("\n");
    while (lines.length) {
        var line = lines.pop().trim();
        if (!line) { continue; }
        Game.femaleNameG.observe(line);
    }
    Game.createInitialCitizens();
  }
  Game.surnameG = new ROT.StringGenerator();
  var r2 = new XMLHttpRequest();
  r2.open("get", "data/surnames.txt", true);
  r2.send();

  r2.onreadystatechange = function() {
    if (r2.readyState != 4) { return; }

    var lines = r2.responseText.split("\n");
    while (lines.length) {
        var line = lines.pop().trim();
        if (!line) { continue; }
        Game.surnameG.observe(line);
    }
    Game.createInitialCitizens();
  }

}
