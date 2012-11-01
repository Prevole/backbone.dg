(function() {
  var data, dataCollection, dataModel,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  data = {};

  dataModel = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    return _Class;

  })(Backbone.Model);

  dataCollection = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.model = dataModel;

    _Class.prototype.comparator = function(model) {};

    _Class.prototype.filter = function(model) {};

    return _Class;

  })(Backbone.Collection);

}).call(this);
