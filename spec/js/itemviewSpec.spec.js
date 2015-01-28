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
