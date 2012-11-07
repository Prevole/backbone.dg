var HeaderView, RowView, data, dataCollection, dataModel, gridLayout, headerView, rowView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

dataModel = (function(_super) {

  __extends(_Class, _super);

  function _Class() {
    return _Class.__super__.constructor.apply(this, arguments);
  }

  _Class.prototype.match = function(quickSearch) {
    return this.attributes.a.toLowerCase().indexOf(quickSearch) >= 0 || this.attributes.b.toLowerCase().indexOf(quickSearch) >= 0 || this.attributes.c.toLowerCase().indexOf(quickSearch) >= 0;
  };

  _Class.prototype.getFromIndex = function(index) {
    switch (parseInt(index)) {
      case 0:
        return this.get("a");
      case 1:
        return this.get("b");
      case 2:
        return this.get("c");
    }
  };

  return _Class;

})(Backbone.Model);

data = [
  new dataModel({
    a: "test 1",
    b: "test f",
    c: "aaa"
  }), new dataModel({
    a: "test 2",
    b: "test e",
    c: "aaa"
  }), new dataModel({
    a: "test 3",
    b: "test d",
    c: "aaa"
  }), new dataModel({
    a: "test 4",
    b: "test c",
    c: "bbb"
  }), new dataModel({
    a: "test 5",
    b: "test b",
    c: "bbb"
  }), new dataModel({
    a: "test 6",
    b: "test a",
    c: "ccc"
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
      var comp, direction, idx, left, right, _ref;
      _ref = _this.current.sort;
      for (idx in _ref) {
        direction = _ref[idx];
        if (direction) {
          left = a.getFromIndex(idx).toString().toLowerCase();
          right = b.getFromIndex(idx).toString().toLowerCase();
          comp = left.localeCompare(right);
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
  return "<th class='sorting'>Head 1</th>" + "<th class='sorting'>Head 2</th>" + "<th class='sorting'>Head 3</th>";
};

rowView = function(data) {
  return ("<td>" + data.a + "</td>") + ("<td>" + data.b + "</td>") + ("<td>" + data.c + "</td>");
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
