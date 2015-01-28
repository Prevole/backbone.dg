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
      spyOn(view, 'renderTemplate').and.callThrough();
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
    it("should call the renderTemplate function", function() {
      return expect(view.renderTemplate).toHaveBeenCalled();
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
