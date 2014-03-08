
describe("datagrid default item view", function() {
  describe("several events are sent when rendering the view", function() {
    var name, vent, view, _i, _len, _ref, _results;
    vent = null;
    view = null;
    beforeEach(function() {
      spyOn(Marionette.Renderer, 'render').and.returnValue(function() {
        return '<div/>';
      });
      vent = new Backbone.Wreqr.EventAggregator();
      spyOn(vent, 'trigger');
      view = new Dg.DefaultItemView({
        vent: vent
      });
      spyOn(view, 'trigger');
      spyOn(view, 'setElement');
      spyOn(view, 'getTemplate');
      spyOn(view, 'serializeData');
      spyOn(view, 'bindUIElements');
      spyOn(view, 'onRender');
      return view.render();
    });
    it("should send 4 events", function() {
      return expect(view.trigger.calls.count()).toEqual(4);
    });
    it("should send event [before:render] first", function() {
      return expect(view.trigger.calls.argsFor(0)).toEqual(['before:render', view]);
    });
    it("should send event [item:before:render] second", function() {
      return expect(view.trigger.calls.argsFor(1)).toEqual(['item:before:render', view]);
    });
    it("should send event [render] third", function() {
      return expect(view.trigger.calls.argsFor(2)).toEqual(['render', view]);
    });
    it("should send event [item:rendered] fourth", function() {
      return expect(view.trigger.calls.argsFor(3)).toEqual(['item:rendered', view]);
    });
    it("should send event only one to all components", function() {
      return expect(vent.trigger.calls.count()).toEqual(1);
    });
    it("should send event [item:rendered] to all components", function() {
      return expect(vent.trigger).toHaveBeenCalledWith('item:rendered', view);
    });
    _ref = ['getTemplate', 'serializeData', 'bindUIElements', 'onRender'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      it("should call function " + name, function() {
        return expect(view[name]).toHaveBeenCalled();
      });
      _results.push(it("should call function " + name + " only once", function() {
        return expect(view[name].calls.count()).toEqual(1);
      }));
    }
    return _results;
  });
  return describe("when pre-rendering defined", function() {
    var vent, view;
    vent = null;
    view = null;
    beforeEach(function() {
      var ViewWithPreRender;
      spyOn(Marionette.Renderer, 'render').and.returnValue(function() {
        return '<div/>';
      });
      vent = new Backbone.Wreqr.EventAggregator();
      spyOn(vent, 'trigger');
      ViewWithPreRender = Dg.DefaultItemView.extend({
        beforeRender: function() {}
      });
      view = new ViewWithPreRender({
        vent: vent
      });
      spyOn(view, 'beforeRender');
      return view.render();
    });
    it("should call pre-rendering function at the rendering time", function() {
      return expect(view.beforeRender).toHaveBeenCalled();
    });
    return it("should call pre-rendering function at the rendering time only once", function() {
      return expect(view.beforeRender.calls.count()).toEqual(1);
    });
  });
});


describe("datagrid helpers functions", function() {
  describe("when creating a row view without options", function() {
    return it("should throw an exeption", function() {
      return expect(function() {
        return Dg.createRowView();
      }).toThrow();
    });
  });
  describe("when creating a row view with only tempalte option", function() {
    return it("should throw an exeption", function() {
      return expect(function() {
        return Dg.createRowView({
          template: function(data) {}
        });
      }).toThrow();
    });
  });
  describe("when creating a row view with only model option", function() {
    return it("should throw an exeption", function() {
      return expect(function() {
        return Dg.createRowView({
          model: new Backbone.Model()
        });
      }).toThrow();
    });
  });
  describe("when creating a row view with valid options", function() {
    return it("should return a valid view", function() {
      expect(function() {
        return Dg.createRowView({
          template: function(data) {},
          model: new Backbone.Model()
        });
      }).not.toThrow();
      return expect(Dg.createRowView({
        template: function(data) {},
        model: new Backbone.Model()
      })).toBeDefined();
    });
  });
  describe("when creating a header view without options", function() {
    return it("should throw an exeption", function() {
      return expect(function() {
        return Dg.createHeaderView();
      }).toThrow();
    });
  });
  describe("when creating a header view with valid options", function() {
    return it("should return a valid view", function() {
      expect(function() {
        return Dg.createHeaderView({
          template: function(data) {}
        });
      }).not.toThrow();
      return expect(Dg.createHeaderView({
        template: function(data) {}
      })).toBeDefined();
    });
  });
  describe("when creating a table view without options", function() {
    return it("should throw an exception", function() {
      return expect(function() {
        return Dg.createTableView();
      }).toThrow();
    });
  });
  describe("when creating a table view with only tempalte option", function() {
    return it("should throw an exeption", function() {
      return expect(function() {
        return Dg.createTableView({
          template: function(data) {}
        });
      }).toThrow();
    });
  });
  describe("when creating a table view with only item view container option", function() {
    return it("should throw an exeption", function() {
      return expect(function() {
        return Dg.createTableView({
          itemViewContainer: "div"
        });
      }).toThrow();
    });
  });
  describe("when creating a table view with only item view option", function() {
    return it("should throw an exeption", function() {
      var rowView;
      rowView = Dg.createRowView({
        template: function(data) {},
        model: new Backbone.Model()
      });
      return expect(function() {
        return Dg.createTableView({
          itemView: rowView
        });
      }).toThrow();
    });
  });
  describe("when creating a table view with valid options", function() {
    return it("should return a valid view", function() {
      var rowView;
      rowView = Dg.createRowView({
        template: function(data) {},
        model: new Backbone.Model()
      });
      expect(function() {
        return Dg.createTableView({
          template: function(data) {},
          itemViewContainer: "div",
          itemView: rowView
        });
      }).not.toThrow();
      return expect(Dg.createTableView({
        template: function(data) {},
        itemViewContainer: "div",
        itemView: rowView
      })).toBeDefined();
    });
  });
  describe("when a grid layout is created with default options", function() {
    var grid;
    grid = Dg.createGridLayout();
    it("should have default table region", function() {
      return expect(grid.prototype.regions.table).toBeDefined();
    });
    it("should have default toolbar region", function() {
      return expect(grid.prototype.regions.toolbar).toBeDefined();
    });
    it("should have default quickSearch region", function() {
      return expect(grid.prototype.regions.quickSearch).toBeDefined();
    });
    it("should have default perPage region", function() {
      return expect(grid.prototype.regions.perPage).toBeDefined();
    });
    it("should have default info region", function() {
      return expect(grid.prototype.regions.info).toBeDefined();
    });
    it("should have default pager region", function() {
      return expect(grid.prototype.regions.pager).toBeDefined();
    });
    it("should not have any collection", function() {
      return expect(grid.prototype.collection).toBeUndefined();
    });
    return it("should have a default template", function() {
      return expect(grid.prototype.template).toBeDefined();
    });
  });
  return describe("when a grid is created without default options", function() {
    var collection, grid, template;
    template = function(data) {
      return "something";
    };
    Dg.registerTemplate("template", template);
    collection = new Backbone.Collection();
    grid = Dg.createGridLayout({
      collection: collection,
      template: "template",
      gridRegions: {
        perPage: false,
        toolbar: false,
        quickSearch: false,
        pager: false,
        info: false,
        table: false
      }
    });
    it("should not have table region", function() {
      return expect(grid.prototype.regions.table).toBeUndefined();
    });
    it("should not have toolbar region", function() {
      return expect(grid.prototype.regions.toolbar).toBeUndefined();
    });
    it("should not have quickSearch region", function() {
      return expect(grid.prototype.regions.quickSearch).toBeUndefined();
    });
    it("should not have perPage region", function() {
      return expect(grid.prototype.regions.perPage).toBeUndefined();
    });
    it("should not have info region", function() {
      return expect(grid.prototype.regions.info).toBeUndefined();
    });
    it("should not have pager region", function() {
      return expect(grid.prototype.regions.pager).toBeUndefined();
    });
    it("should have the collection given", function() {
      return expect(grid.prototype.collection).toBe(collection);
    });
    return it("should have the template given", function() {
      return expect(grid.prototype.template).toBe(template);
    });
  });
});


describe("datagrid itemview", function() {
  describe("when creating an item view without [vent] option", function() {
    return it("should throw an exeption", function() {
      return expect(function() {
        return new Dg.ItemView();
      }).toThrow();
    });
  });
  describe("when creating an item view with [vent] option from valid type", function() {
    var vent;
    vent = new Backbone.Wreqr.EventAggregator();
    it("should not throw an exeption", function() {
      return expect(function() {
        return new Dg.ItemView({
          vent: vent
        });
      }).not.toThrow();
    });
    return it("should have [vent] defined on itemview", function() {
      return expect(new Dg.ItemView({
        vent: vent
      }).vent).toBeDefined();
    });
  });
  describe("when creating an item view", function() {
    var itemView, vent;
    vent = null;
    itemView = null;
    beforeEach(function() {
      vent = new Backbone.Wreqr.EventAggregator();
      spyOn(vent, 'on');
      return itemView = new Dg.ItemView({
        vent: vent
      });
    });
    it("should register an event", function() {
      return expect(vent.on).toHaveBeenCalled();
    });
    it("should register only one event", function() {
      return expect(vent.on.calls.count()).toEqual(1);
    });
    return it("should register the event [view:refresh]", function() {
      return expect(vent.on).toHaveBeenCalledWith('view:refresh', itemView.refreshView, itemView);
    });
  });
  describe("when an item view is rendered", function() {
    var itemView, vent;
    vent = null;
    itemView = null;
    beforeEach(function() {
      vent = new Backbone.Wreqr.EventAggregator();
      spyOn(vent, 'trigger');
      itemView = new Dg.ItemView({
        vent: vent
      });
      return itemView.onRender();
    });
    it("should send an event", function() {
      return expect(vent.trigger).toHaveBeenCalled();
    });
    it("should send only one event", function() {
      return expect(vent.trigger.calls.count()).toEqual(1);
    });
    return it("should send event [item:rendered]", function() {
      return expect(vent.trigger).toHaveBeenCalledWith('item:rendered', itemView);
    });
  });
  describe("when an item view is refreshed", function() {
    var itemView, vent;
    vent = new Backbone.Wreqr.EventAggregator();
    itemView = new Dg.ItemView({
      vent: vent
    });
    it("should react to an event and then throw an error", function() {
      return expect(function() {
        return vent.trigger('view:refresh');
      }).toThrow();
    });
    return it("should throw an exception when called directly", function() {
      return expect(itemView.refreshView).toThrow();
    });
  });
  describe("when an item view is updated", function() {
    var info, itemView, vent;
    info = {
      some: 'some'
    };
    vent = null;
    itemView = null;
    beforeEach(function() {
      vent = new Backbone.Wreqr.EventAggregator();
      spyOn(vent, 'trigger');
      itemView = new Dg.ItemView({
        vent: vent
      });
      return itemView.update(info);
    });
    it("should send an event", function() {
      return expect(vent.trigger).toHaveBeenCalled();
    });
    it("should send only one event", function() {
      return expect(vent.trigger.calls.count()).toEqual(1);
    });
    return it("should send event [update]", function() {
      return expect(vent.trigger).toHaveBeenCalledWith('update', info);
    });
  });
  return describe("when an item view is closed", function() {
    var itemView, vent;
    vent = null;
    itemView = null;
    beforeEach(function() {
      vent = new Backbone.Wreqr.EventAggregator();
      spyOn(vent, 'off').and.callThrough();
      itemView = new Dg.ItemView({
        vent: vent
      });
      return itemView.onClose();
    });
    it("should unbind an event", function() {
      return expect(vent.off).toHaveBeenCalled();
    });
    it("should unbind only one event", function() {
      return expect(vent.off.calls.count()).toEqual(1);
    });
    it("should unbind event [view:refresh] for function refreshView", function() {
      return expect(vent.off).toHaveBeenCalledWith('view:refresh', itemView.refreshView, itemView);
    });
    return it("should not react anymore to [view:refresh] event is sent", function() {
      return expect(function() {
        return vent.trigger('view:refresh');
      }).not.toThrow();
    });
  });
});
