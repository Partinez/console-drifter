function gameFile(name, content, options) {
  this.name = name;
  this.content = content;
  this.readOnly = true;
  this.location = null;
  //this.options = options;
  if (options) {
    this.options = options;
  } else {
    this.options = [];
  }
}

gameFile.prototype.deleteFile = function() {

  if (this.location !== null) {
    var index = firstOfEach(this.location.options).indexOf(this.name);
    if (index > -1) {
      this.location['options'].splice(index, 1);
    }
    delete this.location.file[this.name];
    return true
  } else {
    return false
  }

}

function gameFolder(name) {
  this.name = name;
  this.options = [];
  this.file = {};
  this.actions = [];
  this.location = null;
}

gameFolder.prototype.add = function(gFile, type) {
  type = typeof type !== 'undefined' ? type : 'file';
  this.file[gFile.name] = gFile;
  this.options.push([gFile.name, type]);
  gFile.location = this;
}

gameFolder.prototype.addFolder = function(gFolder) {
  this.file[gFolder.name] = gFolder;
  this.options.push([gFolder.name, 'folder']);
  gFolder.location = this;
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
