var DataModel, HeaderView, RowView, data, dataCollection, gridLayout, gridLayout2, gridLayout3, gridLayout4, headerView, models, perpage, rowView, table, tableRow,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

data = [
  {
    era: "Pre Republic",
    title: "Into the Void",
    author: "Tim Lebbon",
    release: 2013,
    serie: "Dawn of the Jedi",
    timeline: -25793,
    type: "Book"
  }, {
    era: "Old Republic",
    title: "Precipice",
    author: "John Jackson Miller",
    release: 2009,
    serie: "Lost Tribe of the Sith",
    timeline: -5000,
    type: "E-book"
  }, {
    era: "Old Republic",
    title: "Skyborn",
    author: "John Jackson Miller",
    release: 2009,
    serie: "Lost Tribe of the Sith",
    timeline: -5000,
    type: "E-book"
  }, {
    era: "Old Republic",
    title: "Paragon",
    author: "John Jackson Miller",
    release: 2010,
    serie: "Lost Tribe of the Sith",
    timeline: -4985,
    type: "E-book"
  }, {
    era: "Old Republic",
    title: "Savior",
    author: "John Jackson Miller",
    release: 2010,
    serie: "Lost Tribe of the Sith",
    timeline: -4975,
    type: "E-book"
  }, {
    era: "Old Republic",
    title: "Purgatory",
    author: "John Jackson Miller",
    release: 2010,
    serie: "Lost Tribe of the Sith",
    timeline: -3960,
    type: "E-book"
  }, {
    era: "Old Republic",
    title: "Revan",
    author: "Drew Karpyshyn",
    release: 2011,
    serie: "The Old Republic",
    timeline: -3954,
    type: "Book"
  }, {
    era: "Old Republic",
    title: "Deceived",
    author: "Paul S. Kemp",
    release: 2011,
    serie: "The Old Republic",
    timeline: -3953,
    type: "Book"
  }, {
    era: "Old Republic",
    title: "Revan",
    author: "Drew Karpyshyn",
    release: 2011,
    serie: "The Old Republic",
    timeline: -3954,
    type: "Book"
  }, {
    era: "Old Republic",
    title: "Pantheon",
    author: "John Jackson Miller",
    release: 2011,
    serie: "Lost Tribe of the Sith",
    timeline: -3000,
    type: "E-book"
  }, {
    era: "Old Republic",
    title: "Secrets",
    author: "John Jackson Miller",
    release: 2012,
    serie: "Lost Tribe of the Sith",
    timeline: -3000,
    type: "E-book"
  }, {
    era: "Old Republic",
    title: "Pandemonium",
    author: "John Jackson Miller",
    release: 2012,
    serie: "Lost Tribe of the Sith",
    timeline: -2975,
    type: "E-book"
  }, {
    era: "Old Republic",
    title: "Red Harvest",
    author: "Joe Schreiber",
    release: 2010,
    serie: "-",
    timeline: -3645,
    type: "Book"
  }
];

DataModel = (function(_super) {

  __extends(_Class, _super);

  function _Class() {
    return _Class.__super__.constructor.apply(this, arguments);
  }

  _Class.prototype.fields = ["era", "serie", "title", "timeline", "author", "release", "type"];

  _Class.prototype.match = function(quickSearch) {
    return _.reduce(this.fields, function(sum, attrName) {
      return sum || this.attributes[attrName].toString().toLowerCase().indexOf(quickSearch) >= 0;
    }, false, this);
  };

  _Class.prototype.getFromIndex = function(index) {
    return this.get(this.fields[index]);
  };

  return _Class;

})(Backbone.Model);

models = _.reduce(data, function(models, modelData) {
  models.push(new DataModel(modelData));
  return models;
}, []);

dataCollection = (function(_super) {

  __extends(_Class, _super);

  function _Class() {
    return _Class.__super__.constructor.apply(this, arguments);
  }

  _Class.prototype.model = DataModel;

  _Class.prototype.initialize = function(models, options) {
    var customs;
    if (options === void 0 || options.meta === void 0) {
      customs = {};
    } else {
      customs = options.meta;
    }
    return this.meta = _.defaults(customs, {
      page: 1,
      perPage: 5,
      term: "",
      sort: {}
    });
  };

  _Class.prototype.sync = function(method, model, options) {
    var localData, storedSuccess,
      _this = this;
    storedSuccess = options.success;
    options.success = function(collection, response, options) {
      storedSuccess(collection, response, options);
      return _this.trigger("fetched");
    };
    localData = _.clone(models);
    localData = _.filter(localData, function(model) {
      return model.match(_this.meta.term.toLowerCase());
    });
    this.meta.items = localData.length;
    localData = localData.sort(function(a, b) {
      var comp, direction, idx, left, right, _ref;
      _ref = _this.meta.sort;
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
    this.meta.pages = Math.ceil(localData.length / this.meta.perPage);
    this.meta.totalItems = localData.length;
    this.meta.from = (this.meta.page - 1) * this.meta.perPage;
    this.meta.to = this.meta.from + this.meta.perPage;
    localData = localData.slice(this.meta.from, this.meta.to);
    this.meta.from = this.meta.from + 1;
    return options.success(this, localData, {
      update: false
    });
  };

  _Class.prototype.refresh = function() {
    this.reset();
    return this.fetch();
  };

  _Class.prototype.getInfo = function() {
    return this.meta;
  };

  _Class.prototype.updateInfo = function(options) {
    this.meta = _.defaults(options, this.meta);
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
  collection: new dataCollection(data),
  gridRegions: {
    table: {
      view: Dg.TableView.extend({
        itemView: RowView,
        headerView: HeaderView
      })
    }
  }
});

Dg.registerTemplate("grid2", function(data) {
  return "<div class='dgGrid'>" + "<div class='clearfix'>" + "<div class='dgPagerTop pull-right' />" + "</div>" + "<div class='clearfix'>" + "<div class='dgPerPage' />" + "<div class='dgToolbar' />" + "<div class='dgQuickSearch' />" + "</div>" + "<div class='dgTable' />" + "<div class='clearfix'>" + "<div class='dgPerPageBottom' />" + "<div class='dgToolbarBottom' />" + "<div class='dgQuickSearchBottom' />" + "</div>" + "<div class='clearfix'>" + "<div class='dgInfo pull-left' />" + "<div class='dgPager pull-right' />" + "</div>" + "</div>";
});

gridLayout2 = Dg.createDefaultLayout({
  collection: new dataCollection(data),
  template: "grid2",
  gridRegions: {
    perPageBottom: {
      selector: ".dgPerPageBottom",
      view: Dg.PerPageView
    },
    toolbarBottom: {
      selector: ".dgToolbarBottom",
      view: Dg.ToolbarView
    },
    quickSearchBottom: {
      selector: ".dgQuickSearchBottom",
      view: Dg.QuickSearchView
    },
    pagerTop: {
      selector: ".dgPagerTop",
      view: Dg.PagerView
    },
    table: {
      view: Dg.TableView.extend({
        itemView: RowView,
        headerView: HeaderView
      })
    }
  }
});

gridLayout3 = Dg.createDefaultLayout({
  collection: new dataCollection(data),
  gridRegions: {
    perPage: false,
    toolbar: false,
    table: {
      view: Dg.TableView.extend({
        itemView: RowView,
        headerView: HeaderView
      })
    }
  }
});

table = function(data) {
  return "<div>" + "<div class=\"clearfix\" />" + "</div>";
};

tableRow = function(data) {
  return ("<span><strong>Era:&nbsp;</strong>" + data.era + " (" + data.serie + ")</span><br/>") + ("<span><strong>Title:&nbsp;</strong>" + data.title + "</span><br/>") + ("<span><strong>Timeline:&nbsp;</strong>" + data.timeline + "</span><br/>") + ("<span><strong>Author:&nbsp;</strong>" + data.author + "</span></br>") + ("<span><strong>Release:&nbsp;</strong>" + data.release + "</span><br/>") + ("<span><strong>Type:&nbsp;</strong>" + data.type + "</span>");
};

perpage = function(data) {
  return "<div class='form-inline pull-left'>" + "<label class='checkbox'>Item per page:&nbsp;</label>" + "<select class='per-page input-mini'>" + "<option>3</option>" + "<option>6</option>" + "<option>9</option>" + "<option>30</option>" + "<option>60</option>" + "<option>90</option>" + "</select>" + "</div>";
};

gridLayout4 = Dg.createDefaultLayout({
  collection: new dataCollection(data, {
    meta: {
      perPage: 6
    }
  }),
  gridRegions: {
    toolbar: false,
    perPage: {
      selector: ".dgPerPage",
      view: Dg.PerPageView.extend({
        template: perpage
      })
    },
    table: {
      view: Dg.createTableView({
        template: table,
        itemViewContainer: "div",
        itemView: Dg.createRowView({
          model: DataModel,
          template: tableRow,
          tagName: "div",
          className: "pull-left card"
        })
      })
    }
  }
});

$(document).ready(function() {
  new Marionette.Region({
    el: "#dg1"
  }).show(new gridLayout());
  new Marionette.Region({
    el: "#dg2"
  }).show(new gridLayout2());
  new Marionette.Region({
    el: "#dg3"
  }).show(new gridLayout3());
  return new Marionette.Region({
    el: "#dg4"
  }).show(new gridLayout4());
});
