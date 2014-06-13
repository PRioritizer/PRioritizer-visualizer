'use strict';

if (typeof String.prototype.startsWith !== 'function') {
  String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
  };
}

if (typeof String.prototype.endsWith !== 'function') {
  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}

if (typeof Array.prototype.distinct !== 'function') {
  Array.prototype.distinct = function() {
    var values = [];
    for (var i = 0; i < this.length; i += 1)
      if (values.indexOf(this[i]) === -1)
        values.push(this[i]);
    return values;
  };
}
