firstOfEach = function(array) {
  var temp = [];
  for (var i = 0; i<array.length; i++) {
    temp.push(array[i][0]);
  }
  return temp
}

isIn = function(item, array) {
  return (array.indexOf(item) != -1)
}

randomRange = function(min,max) {
  return (Math.random()*(max-min))+min
}
