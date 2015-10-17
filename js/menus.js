function gameFile(name, content, options, readOnly) {
  this.name = name;
  this.content = content;
  this.readOnly = readOnly;
  this.location = null;
  this.options = options;
}

gameFile.prototype.deleteFile = function() {
  if (this.readOnly) {
    return false
  } else {
    if (this.location !== null) {
      var index = this.location['options'].indexOf(this.name);
      if (index > -1) {
        this.location['options'].splice(index, 1);
      }
      delete this.location.file[this.name];
      return true
    } else {
      return false
    }
  }
}

function gameFolder(name) {
  this.name = name;
  this.options = [];
  this.file = {};
  this.actions = [];
}

gameFolder.prototype.add = function(gFile) {
  this.file[gFile.name] = gFile;
  this.options.push([gFile.name, 'file']);
  gFile.location = this;
}

gameFolder.prototype.addActions = function(actions) {
  for (var i = 0; i < actions.length; i++) {
    this.actions.push(actions[i]);
  }

}




firstOfEach = function(array) {
  var temp = [];
  for (var i = 0; i<array.length; i++) {
    temp.push(array[i][0]);
  }
  return temp
}
