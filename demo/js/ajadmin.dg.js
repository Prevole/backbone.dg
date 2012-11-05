var Dg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Backbone.Dg = Dg = (function(Backbone, Marionette, _, $) {
  var EmptyView, LoadingView, defaults, gridRegions, i18nKeys, infoKeys, reject, templates;
  Dg = {
    version: "0.0.1"
  };
  defaults = function(object, defs) {
    var key, value;
    if (object === void 0) {
      object = {};
    }
    for (key in defs) {
      value = defs[key];
      if (object[key] === void 0 || object[key] === null) {
        object[key] = defs[key];
      } else if (_.isObject(defs[key]) && _.isObject(object[key])) {
        object[key] = defaults(object[key], defs[key]);
      }
    }
    return object;
  };
  reject = function(object, filter) {
    var key, newObject, value;
    newObject = {};
    for (key in object) {
      value = object[key];
      if (!filter(object, key, value)) {
        newObject[key] = value;
      }
    }
    return newObject;
  };
  templates = {
    empty: function(data) {
      return "<td class='empty'>No Data</td>";
    },
    grid: function(data) {
      return "<div class='dgGrid'>" + "<div class='clearfix'>" + "<div class='dgPerPage' />" + "<div class='dgToolbar' />" + "<div class='dgQuickSearch' />" + "</div>" + "<div class='dgTable' />" + "<div class='clearfix'>" + "<div class='dgPager' />" + "</div>" + "</div>";
    },
    gridempty: function(data) {
      return "<div class='dgLoading'>" + "<div class='progress progress-striped active'>" + "<div class='bar' style='width:100%'>Loading data</div>" + "</div>" + "</div>";
    },
    info: function(data) {
      return "<span class='info' />";
    },
    pager: function(data) {
      return "<div class='pagination pagination-right' />";
    },
    perpage: function(data) {
      return "<div class='form-inline pull-left'>" + "<label class='checkbox'>Item per page: </label>" + "<select class='per-page input-mini'>" + "<option>2</option>" + "<option>5</option>" + "<option>10</option>" + "<option>25</option>" + "<option>50</option>" + "<option>100</option>" + "</select>" + "</div>";
    },
    quicksearch: function(data) {
      return "<div class='form-inline pull-right qs'>" + "<label class='checkbox'>Quick search: </label>" + "<input type='text' />" + "</div>";
    },
    table: function(data) {
      return "<table class='table table-striped table-hover table-condensed'>" + "<tbody/>" + "</table>";
    },
    toolbar: function(data) {
      return "<div class='form-inline pull-right buttons btn-group'>" + "<button class='btn refresh'>" + "<i class='icon-refresh'/>" + "</button>" + "<button class='btn create'>" + "<i class='icon-plus'/>" + "</button>" + "</div>";
    }
  };
  Dg.registerTemplate = function(templateName, template) {
    return templates[templateName] = template;
  };
  Dg.ItemView = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.initialize = function(options) {
      if (!options.vent) {
        throw new Error("No event aggregator given.");
      }
      this.vent = options.vent;
      return this.vent.on("view:refresh", this.refreshView, this);
    };

    _Class.prototype.render = function() {
      _Class.__super__.render.apply(this, arguments);
      this.vent.trigger("item:rendered", this);
      return this;
    };

    _Class.prototype.refreshView = function(info) {
      throw new Error("The method refreshView(info) must be defined.");
    };

    _Class.prototype.update = function(info) {
      return this.vent.trigger("update", info);
    };

    _Class.prototype.close = function() {
      this.vent.off("view:refresh", this.refreshView);
      return _Class.__super__.close.apply(this, arguments);
    };

    return _Class;

  })(Marionette.ItemView);
  Dg.DefaultItemView = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.render = function() {
      if (this.beforeRender) {
        this.beforeRender();
      }
      this.trigger("before:render", this);
      this.trigger("item:before:render", this);
      this.setElement($(Marionette.Renderer.render(this.getTemplate(), this.serializeData())), true);
      this.bindUIElements();
      if (this.onRender) {
        this.onRender();
      }
      this.trigger("render", this);
      this.trigger("item:rendered", this);
      this.vent.trigger("item:rendered", this);
      return this;
    };

    return _Class;

  })(Dg.ItemView);
  Dg.InfoView = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.template = templates["info"];

    _Class.prototype.refreshView = function(info) {
      return this.$el.text("Showing " + info[infoKeys.from] + " to " + info[infoKeys.to] + " of " + info[infoKeys.items] + " entries");
    };

    return _Class;

  })(Dg.DefaultItemView);
  Dg.QuickSearchView = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.template = templates["quicksearch"];

    _Class.prototype.events = {
      "keyup input": "search"
    };

    _Class.prototype.ui = {
      term: "input"
    };

    _Class.prototype.initialize = function(options) {
      var _this = this;
      _Class.__super__.initialize.call(this, options);
      return this.searchInternal = _.debounce(function(event) {
        return _this.update(_.object([infoKeys.term], [_this.ui.term.val().trim()]));
      }, 300);
    };

    _Class.prototype.refreshView = function(info) {
      return this.ui.term.val(info[infoKeys.term]);
    };

    _Class.prototype.search = function(event) {
      return this.searchInternal(event);
    };

    return _Class;

  })(Dg.DefaultItemView);
  Dg.PerPageView = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.template = templates["perpage"];

    _Class.prototype.events = {
      "change .per-page": "perPage"
    };

    _Class.prototype.ui = {
      perPage: ".per-page"
    };

    _Class.prototype.refreshView = function(info) {
      return this.ui.perPage.val(info[infoKeys.perPage]);
    };

    _Class.prototype.perPage = function(event) {
      return this.update(_.object([infoKeys.perPage], [this.ui.perPage.val()]));
    };

    return _Class;

  })(Dg.DefaultItemView);
  Dg.ToolbarView = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.template = templates["toolbar"];

    _Class.prototype.events = {
      "click .refresh": "refresh",
      "click .create": "create"
    };

    _Class.prototype.ui = {
      create: ".create",
      refresh: ".refresh"
    };

    _Class.prototype.refreshView = function(info) {
      this.ui.refresh.removeClass("disabled");
      return this.ui.create.removeClass("disabled");
    };

    _Class.prototype.create = function(event) {
      event.preventDefault();
      if (!this.ui.create.hasClass("disabled")) {
        return this.ui.create.addClass("disabled");
      }
    };

    _Class.prototype.refresh = function(event) {
      event.preventDefault();
      if (!this.ui.refresh.hasClass("disabled")) {
        this.ui.refresh.addClass("disabled");
        return this.update({});
      }
    };

    return _Class;

  })(Dg.DefaultItemView);
  Dg.PagerView = (function(_super) {
    var createLink;

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.template = templates["pager"];

    _Class.prototype.events = {
      "click a": "pagging"
    };

    _Class.prototype.initialize = function(options) {
      _Class.__super__.initialize.call(this, options);
      this.deltaPage = options.deltaPage || 2;
      this.css = _.defaults(options.css || {}, {
        active: "active",
        disabled: "disabled",
        page: "page"
      });
      this.texts = _.defaults(options.texts || {}, {
        first: "<<",
        previous: "<",
        next: ">",
        last: ">>",
        filler: "..."
      });
      this.numbers = true;
      if (options.numbers !== void 0) {
        this.numbers = options.numbers;
      }
      this.firstAndLast = true;
      if (options.firstAndLast !== void 0) {
        this.firstAndLast = options.firstAndLast;
      }
      this.previousAndNext = true;
      if (options.previousAndNext !== void 0) {
        this.previousAndNext = options.previousAndNext;
      }
      this.info = {};
      this.info[infoKeys.page] = 0;
      return this.info[infoKeys.pages] = 0;
    };

    _Class.prototype.refreshView = function(info) {
      var i, maxPage, minPage, page, pages, state, ul, _i;
      this.info = info;
      this.$el.empty().hide();
      ul = $("<ul />");
      page = this.info[infoKeys.page];
      pages = this.info[infoKeys.pages];
      if (page > 0 && pages > 1) {
        minPage = page - this.deltaPage;
        maxPage = page + this.deltaPage;
        if (minPage <= 0) {
          minPage = 1;
        }
        if (maxPage >= pages) {
          maxPage = pages;
        }
        state = page === 1 ? this.css.disabled : "";
        if (this.firstAndLast) {
          ul.append(createLink.call(this, this.texts.first, "f", state));
        }
        if (this.previousAndNext) {
          ul.append(createLink.call(this, this.texts.previous, "p", state));
        }
        if (this.numbers) {
          if (minPage > 1) {
            ul.append(createLink.call(this, this.texts.filler, "", this.css.disabled));
          }
          for (i = _i = minPage; minPage <= maxPage ? _i <= maxPage : _i >= maxPage; i = minPage <= maxPage ? ++_i : --_i) {
            ul.append(createLink.call(this, "" + i, "page", i === page ? this.css.active : ""));
          }
          if (maxPage < pages) {
            ul.append(createLink.call(this, this.texts.filler, "", this.css.disabled));
          }
        }
        state = page === pages ? this.css.disabled : "";
        if (this.previousAndNext) {
          ul.append(createLink.call(this, this.texts.next, "n", state));
        }
        if (this.firstAndLast) {
          ul.append(createLink.call(this, this.texts.last, "l", state));
        }
        return this.$el.append(ul).show();
      }
    };

    _Class.prototype.pagging = function(event) {
      var page, target, type;
      event.preventDefault();
      target = $(event.target);
      if (!(target.parent().hasClass(this.css.disabled) || target.parent().hasClass(this.css.active))) {
        type = target.data("type");
        switch (type) {
          case "f":
            page = 1;
            break;
          case "p":
            page = (this.info[infoKeys.page] - 1 > 0 ? this.info[infoKeys.page] - 1 : this.info[infoKeys.page]);
            break;
          case "n":
            page = ((this.info[infoKeys.page] + 1) < this.info[infoKeys.pages] ? this.info[infoKeys.page] + 1 : this.info[infoKeys.pages]);
            break;
          case "l":
            page = this.info[infoKeys.pages];
            break;
          default:
            page = parseInt($(event.target).text());
        }
        if (page !== this.info[infoKeys.page]) {
          return this.update(_.object([infoKeys.page], [page]));
        }
      }
    };

    createLink = function(text, type, state) {
      var a, li;
      a = $("<a/>").attr("href", "#").data("type", type).addClass(this.css.page).html("" + text);
      li = $("<li />").html(a);
      if (state) {
        li.addClass(state);
      }
      return li;
    };

    return _Class;

  })(Dg.DefaultItemView);
  Dg.RowView = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.tagName = "tr";

    _Class.prototype.events = {
      "click .edit": "edit",
      "click .delete": "delete"
    };

    _Class.prototype.initialize = function(options) {
      _Class.__super__.initialize.call(this, options);
      this.css = _.defaults(options.css || {}, {
        asc: "sorting-asc",
        desc: "sorting-desc"
      });
      return this.cellTagName = options.cellTagName || "td";
    };

    _Class.prototype.refreshView = function(info) {
      var target, _i, _len, _ref, _results;
      if (info[infoKeys.sort]) {
        _ref = this.$el.find(this.cellTagName);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          target = _ref[_i];
          target = $(target);
          target.removeClass("" + this.css.asc + " " + this.css.desc);
          if (this.css.none) {
            target.removeClass(this.css.none);
          }
          if (info[infoKeys.sort][target.index()]) {
            if (info[infoKeys.sort][target.index()] === infoKeys.asc) {
              _results.push(target.addClass(this.css.asc));
            } else {
              _results.push(target.addClass(this.css.desc));
            }
          } else if (this.css.none) {
            _results.push(target.addClass(this.css.none));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    _Class.prototype.edit = function(event) {
      event.preventDefault();
      return this.vent.trigger("row:edit", this.model);
    };

    _Class.prototype["delete"] = function(event) {
      event.preventDefault();
      return this.vent.trigger("row:delete", this.model);
    };

    return _Class;

  })(Dg.ItemView);
  EmptyView = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.template = templates["empty"];

    _Class.prototype.ui = {
      empty: ".empty"
    };

    _Class.prototype.initialize = function(options) {
      this.columns = options.columns;
      return _Class.__super__.initialize.call(this, options);
    };

    _Class.prototype.onRender = function() {
      return this.$el.attr("colspan", this.columns);
    };

    _Class.prototype.refreshView = function(info) {};

    return _Class;

  })(Dg.DefaultItemView);
  LoadingView = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.template = templates["gridempty"];

    return _Class;

  })(Backbone.Marionette.ItemView);
  Dg.HeaderView = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.tagName = "thead";

    _Class.prototype.events = {
      "click .sorting": "sort"
    };

    _Class.prototype.refreshView = function(info) {
      var target, _i, _len, _ref, _results;
      _ref = this.$el.find("th");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        target = $(target);
        if (target.hasClass("sorting")) {
          target.removeClass("sorting-asc sorting-desc");
          if (info[infoKeys.sort]) {
            this.sortConfiguration = info[infoKeys.sort];
            if (this.sortConfiguration[target.index()]) {
              if (this.sortConfiguration[target.index()] === infoKeys.asc) {
                _results.push(target.addClass("sorting-asc"));
              } else {
                _results.push(target.addClass("sorting-desc"));
              }
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    _Class.prototype.sort = function(event) {
      var idx;
      idx = $(event.target).index();
      if (!this.sortConfiguration) {
        this.sortConfiguration = {};
      }
      if (!event.shiftKey) {
        if (this.sortConfiguration[idx]) {
          this.sortConfiguration = _.pick(this.sortConfiguration, idx);
        } else {
          this.sortConfiguration = {};
        }
      }
      if (this.sortConfiguration[idx] === void 0) {
        this.sortConfiguration[idx] = infoKeys.asc;
      } else if (this.sortConfiguration[idx] === infoKeys.asc) {
        this.sortConfiguration[idx] = infoKeys.desc;
      } else {
        this.sortConfiguration[idx] = void 0;
      }
      return this.update(_.object([infoKeys.sort], [this.sortConfiguration]));
    };

    _Class.prototype.columns = function() {
      return this.$el.find("th").length;
    };

    Dg.TableView = Marionette.CompositeView.extend({
      template: templates["table"],
      itemViewContainer: "tbody",
      emptyView: Dg.EmptyView,
      itemViewOptions: function(model) {
        return {
          vent: this.vent,
          columns: this.columns()
        };
      },
      initialize: function(options) {
        this.vent = options.vent;
        return this.collection = options.collection;
      },
      render: function() {
        var tableHeader;
        this.resetItemViewContainer();
        this.setElement(this.renderModel());
        if (this.headerView) {
          this.header = new this.headerView({
            vent: this.vent
          });
          tableHeader = this.header.render().el;
          this.$el.prepend(tableHeader);
        }
        this.bindUIElements();
        this.trigger("composite:model:rendered");
        this.trigger("render");
        this.renderCollection();
        this.trigger("composite:rendered");
        return this;
      },
      beforeClose: function() {
        if (this.header) {
          return this.header.close();
        }
      },
      columns: function() {
        if (this.header) {
          return this.header.columns();
        } else {
          return 0;
        }
      }
    });

    return _Class;

  })(Dg.ItemView);
  Dg.TableRegion = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    return _Class;

  })(Marionette.Region);
  Dg.GridLayout = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      this.handleRefresh = __bind(this.handleRefresh, this);

      this.handleUpdate = __bind(this.handleUpdate, this);

      this.refreshGrid = __bind(this.refreshGrid, this);

      this.renderRegions = __bind(this.renderRegions, this);
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.template = templates["grid"];

    _Class.prototype.initialize = function(options) {
      this.vent = new Marionette.EventAggregator();
      this.on("render", this.renderRegions);
      this.vent.on("update", this.handleUpdate);
      this.vent.on("refresh", this.handleRefresh);
      this.vent.on("row:edit", this.handleEditModel);
      return this.collection.on("fetched", this.refreshGrid);
    };

    _Class.prototype.renderRegions = function() {
      var regionDefinition, regionName, _ref;
      _ref = this.regions;
      for (regionName in _ref) {
        regionDefinition = _ref[regionName];
        if (regionName !== "table") {
          this[regionName].show(new regionDefinition.view(_.extend({
            vent: this.vent
          }, regionDefinition.options || {})));
        }
      }
      this.table.show(new LoadingView());
      return this.collection.fetch();
    };

    _Class.prototype.refreshGrid = function() {
      this.table.show(new this.regions.table.view({
        vent: this.vent,
        collection: this.collection
      }));
      return this.vent.trigger("view:refresh", this.collection.getInfo());
    };

    _Class.prototype.handleUpdate = function(options) {
      this.table.show(new LoadingView());
      return this.collection.updateInfo(options);
    };

    _Class.prototype.handleRefresh = function() {
      return this.collection.refresh();
    };

    _Class.prototype.handleEditModel = function(model) {
      return alert(model.get("name"));
    };

    _Class.prototype.close = function() {
      this.collection.off("fetched", this.refreshGrid);
      return _Class.__super__.close.apply(this, arguments);
    };

    return _Class;

  })(Marionette.Layout);
  Dg.createRowView = function(model, templatePath) {
    return Dg.RowView.extend({
      template: templatePath,
      model: model
    });
  };
  Dg.createTableHeaderView = function(templatePath) {
    return Dg.HeaderView.extend({
      template: templatePath
    });
  };
  Dg.createDefaultLayout = function(options) {
    var gridLayout, regions;
    regions = options.gridRegions || {};
    regions = reject(defaults(regions, gridRegions), function(object, key, value) {
      return !_.isObject(value);
    });
    if (options.collection === void 0) {
      gridLayout = Dg.GridLayout.extend({
        regions: regions
      });
    } else {
      gridLayout = Dg.GridLayout.extend({
        collection: options.collection,
        regions: regions
      });
    }
    return gridLayout;
  };
  i18nKeys = {
    info: "datagrid.info",
    pager: {
      first: "datagrid.pager.first",
      last: "datagrid.pager.last",
      next: "datagrid.pager.next",
      previous: "datagrid.pager.previous",
      filler: "datagrid.pager.filler"
    }
  };
  infoKeys = {
    from: "from",
    to: "to",
    items: "items",
    totalItems: "totalItems",
    perPage: "perPage",
    pages: "pages",
    page: "page",
    term: "term",
    sort: "sort",
    asc: "A",
    desc: "D"
  };
  gridRegions = {
    table: {
      selector: ".dgTable",
      regionType: Dg.TableRegion,
      view: Dg.TableView
    },
    toolbar: {
      selector: ".dgToolbar",
      view: Dg.ToolbarView
    },
    quickSearch: {
      selector: ".dgQuickSearch",
      view: Dg.QuickSearchView
    },
    perPage: {
      selector: ".dgPerPage",
      view: Dg.PerPageView
    },
    info: {
      selector: ".dgInfo",
      view: Dg.InfoView
    },
    pager: {
      selector: ".dgPager",
      view: Dg.PagerView
    }
  };
  Dg.setupDefaultI18nBindings = function(options) {
    return i18nKeys = _.defaults(options.i18n || {}, i18nKeys);
  };
  Dg.setupDefaultInfoBindings = function(options) {
    return infoKeys = _.defaults(options.bindings || {}, infoKeys);
  };
  Dg.setupDefaultGridLayout = function(options) {
    return gridRegions = defaults(options.gridRegions || {}, gridRegions);
  };
  return Dg;
})(Backbone, Backbone.Marionette, _, $ || window.jQuery || window.Zepto || window.ender);
