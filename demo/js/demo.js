var HeaderView, RowView, data, dataCollection, dataModel, gridLayout, headerView, rowView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

data = [
  {
    test: "test 1"
  }, {
    test: "test 2"
  }, {
    test: "test 3"
  }, {
    test: "test 4"
  }, {
    test: "test 5"
  }, {
    test: "test 6"
  }
];

dataModel = (function(_super) {

  __extends(_Class, _super);

  function _Class() {
    return _Class.__super__.constructor.apply(this, arguments);
  }

  _Class.prototype.match = function(quickSearch) {
    return this.test.toLowerCase().indexOf(quickSearch) >= 0;
  };

  return _Class;

})(Backbone.Model);

dataCollection = (function(_super) {

  __extends(_Class, _super);

  function _Class() {
    return _Class.__super__.constructor.apply(this, arguments);
  }

  _Class.prototype.model = dataModel;

  _Class.prototype.initialize = function(options) {
    return this.current = _.defaults({}, {
      page: 1,
      ipp: 2,
      quickSearch: "",
      sorting: {}
    });
  };

  _Class.prototype.sync = function(method, model, options, error) {
    var json, localData, response, storedSuccess,
      _this = this;
    storedSuccess = options.success;
    options.success = function(collection, response) {
      storedSuccess(collection, response);
      return _this.trigger("fetched");
    };
    localData = data;
    if (this.current.quickSearch !== "") {
      localData = _.filter(localData, function(model) {
        return model.match(_this.current.quickSearch.toLowerCase());
      });
    }
    json = localData;
    response = $.Deferred();
    response.resolve(json);
    options.success(json);
    console.log(localData);
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
