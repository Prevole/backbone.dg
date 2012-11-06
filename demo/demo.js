var HeaderView, RowView, data, dataCollection, dataModel, gridLayout, headerView, rowView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

dataModel = (function(_super) {

  __extends(_Class, _super);

  function _Class() {
    return _Class.__super__.constructor.apply(this, arguments);
  }

  _Class.prototype.match = function(quickSearch) {
    return this.attributes.test.toLowerCase().indexOf(quickSearch) >= 0;
  };

  _Class.prototype.getFromIndex = function(index) {
    switch (parseInt(index)) {
      case 0:
        return this.get("test");
    }
  };

  return _Class;

})(Backbone.Model);

data = [
  new dataModel({
    test: "test 1"
  }), new dataModel({
    test: "test 2"
  }), new dataModel({
    test: "test 3"
  }), new dataModel({
    test: "test 4"
  }), new dataModel({
    test: "test 5"
  }), new dataModel({
    test: "test 6"
  })
];

dataCollection = (function(_super) {

  __extends(_Class, _super);

  function _Class() {
    return _Class.__super__.constructor.apply(this, arguments);
  }

  _Class.prototype.model = dataModel;

  _Class.prototype.initialize = function(options) {
    return this.current = _.defaults({}, {
      page: 1,
      perPage: 2,
      term: "",
      sort: {}
    });
  };

  _Class.prototype.sync = function(method, model, options, error) {
    var localData, response, storedSuccess,
      _this = this;
    storedSuccess = options.success;
    options.success = function(collection, response) {
      storedSuccess(collection, response);
      return _this.trigger("fetched");
    };
    localData = _.clone(data);
    localData = _.filter(localData, function(model) {
      return model.match(_this.current.term.toLowerCase());
    });
    this.current.items = localData.length;
    localData = localData.sort(function(a, b) {
      var comp, direction, idx, _ref;
      _ref = _this.current.sort;
      for (idx in _ref) {
        direction = _ref[idx];
        if (direction) {
          a = a.getFromIndex(idx).toString().toLowerCase();
          b = b.getFromIndex(idx).toString().toLowerCase();
          comp = a.localeCompare(b);
          if (comp !== 0) {
            return comp * (direction === 'A' ? 1 : -1);
          }
        }
      }
      return 0;
    });
    this.current.pages = Math.ceil(localData.length / this.current.perPage);
    this.current.totalItems = localData.length;
    this.current.from = (this.current.page - 1) * this.current.perPage;
    this.current.to = this.current.from + this.current.perPage;
    localData = localData.slice(this.current.from, this.current.to);
    this.current.from = this.current.from + 1;
    response = $.Deferred();
    response.resolve(localData);
    options.success(localData);
    return response;
  };

  _Class.prototype.refresh = function() {
    this.reset();
    return this.fetch();
  };

  _Class.prototype.getInfo = function() {
    return this.current;
  };

  _Class.prototype.updateInfo = function(options) {
    this.current = _.defaults(options, this.current);
    return this.fetch();
  };

  return _Class;

})(Backbone.Collection);

headerView = function(data) {
  return "<th class='sorting'>TestHeader</th>";
};

rowView = function(data) {
  return "<td>" + data.test + "</td>";
};

HeaderView = (function(_super) {

  __extends(_Class, _super);

  function _Class() {
    return _Class.__super__.constructor.apply(this, arguments);
  }

  _Class.prototype.template = headerView;

  return _Class;

})(Dg.HeaderView);

RowView = (function(_super) {

  __extends(_Class, _super);

  function _Class() {
    return _Class.__super__.constructor.apply(this, arguments);
  }

  _Class.prototype.template = rowView;

  return _Class;

})(Dg.RowView);

gridLayout = Dg.createDefaultLayout({
  collection: new dataCollection(),
  gridRegions: {
    table: {
      view: Dg.TableView.extend({
        itemView: RowView,
        headerView: HeaderView
      })
    }
  }
});

$(document).ready(function() {
  return new Marionette.Region({
    el: "#dg"
  }).show(new gridLayout());
});
