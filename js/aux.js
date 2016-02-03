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

auxFunctions = {
  'rebellion' : function() {
    console.log('You lost!');
  }
}

function repeat(pattern, count) {
    if (count < 1) return '';
    var result = '';
    while (count > 1) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result + pattern;
}
