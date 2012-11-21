var DataModel, HeaderView, RowView, data, dataCollection, gridLayout, headerView, rowView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DataModel = (function(_super) {

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
  new DataModel({
    era: "Pre Republic",
    title: "Into the Void",
    author: "Tim Lebbon",
    release: "2013",
    series: "Dawn of the Jedi",
    timeline: "-25793",
    type: "Book"
  }), new DataModel({
    era: "Old Republic",
    title: "Precipice",
    author: "John Jackson Miller",
    release: "2009",
    series: "Lost Tribe of the Sith",
    timeline: "-5000",
    type: "E-book"
  }), new DataModel({
    era: "Old Republic",
    title: "Skyborn",
    author: "John Jackson Miller",
    release: "2009",
    series: "Lost Tribe of the Sith",
    timeline: "-5000",
    type: "E-book"
  }), new DataModel({
    era: "Old Republic",
    title: "Paragon",
    author: "John Jackson Miller",
    release: "2010",
    series: "Lost Tribe of the Sith",
    timeline: "-4985",
    type: "E-book"
  }), new DataModel({
    era: "Old Republic",
    title: "Savior",
    author: "John Jackson Miller",
    release: "2010",
    series: "Lost Tribe of the Sith",
    timeline: "-4975",
    type: "E-book"
  }), new DataModel({
    era: "Old Republic",
    title: "Purgatory",
    author: "John Jackson Miller",
    release: "2010",
    series: "Lost Tribe of the Sith",
    timeline: "-3960",
    type: "E-book"
  }), new DataModel({
    era: "Old Republic",
    title: "Revan",
    author: "Drew Karpyshyn",
    release: "2011",
    series: "The Old Republic",
    timeline: "-3954",
    type: "Book"
  }), new DataModel({
    era: "Old Republic",
    title: "Deceived",
    author: "Paul S. Kemp",
    release: "2011",
    series: "The Old Republic",
    timeline: "-3953",
    type: "Book"
  }), new DataModel({
    era: "Old Republic",
    title: "Revan",
    author: "Drew Karpyshyn",
    release: "2011",
    series: "The Old Republic",
    timeline: "-3954",
    type: "Book"
  }), new DataModel({
    era: "Old Republic",
    title: "Pantheon",
    author: "John Jackson Miller",
    release: "2011",
    series: "Lost Tribe of the Sith",
    timeline: "-3000",
    type: "E-book"
  }), new DataModel({
    era: "Old Republic",
    title: "Secrets",
    author: "John Jackson Miller",
    release: "2012",
    series: "Lost Tribe of the Sith",
    timeline: "-3000",
    type: "E-book"
  }), new DataModel({
    era: "Old Republic",
    title: "Pandemonium",
    author: "John Jackson Miller",
    release: "2012",
    series: "Lost Tribe of the Sith",
    timeline: "-2975",
    type: "E-book"
  }), new DataModel({
    era: "Old Republic",
    title: "Red Harvest",
    author: "Joe Schreiber",
    release: "2010",
    series: "-",
    timeline: "-3645",
    type: "Book"
  })
];

dataCollection = (function(_super) {

  __extends(_Class, _super);

  function _Class() {
    return _Class.__super__.constructor.apply(this, arguments);
  }

  _Class.prototype.model = DataModel;

  _Class.prototype.initialize = function(options) {
    return this.current = _.defaults({}, {
      page: 1,
      perPage: 5,
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
  return "<th class='sorting'>Era</th>" + "<th class='sorting'>Serie</th>" + "<th class='sorting'>Title</th>" + "<th class='sorting'>Timeline</th>" + "<th class='sorting'>Author</th>" + "<th class='sorting'>Release</th>" + "<th class='sorting'>Type</th>";
};

rowView = function(data) {
  return ("<td>" + data.era + "</td>") + ("<td>" + data.serie + "</td>") + ("<td>" + data.title + "</td>") + ("<td>" + data.timeline + "</td>") + ("<td>" + data.author + "</td>") + ("<td>" + data.release + "</td>") + ("<td>" + data.type + "</td>");
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
