var HeaderView, RowView, data, dataCollection, dataModel, gridLayout, headerView, rowView,
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

headerView = function(data) {
  return "<th>TestHeader</th>";
};

rowView = function(data) {
  return "<td>TestRow</td>";
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
  var layout;
  layout = new gridLayout();
  return layout.render();
});
