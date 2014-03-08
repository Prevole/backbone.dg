describe "datagrid itemview", ->
  describe "when creating an item view without [vent] option", ->
    it "should throw an exeption", ->
      expect(-> new Dg.ItemView()).toThrow()

  describe "when creating an item view with [vent] option from valid type", ->
    vent = new Backbone.Wreqr.EventAggregator()

    it "should not throw an exeption", ->
      expect(-> new Dg.ItemView(vent: vent)).not.toThrow()

    it "should have [vent] defined on itemview", ->
      expect(new Dg.ItemView(vent: vent).vent).toBeDefined()


  describe "when creating an item view", ->
    vent = null
    itemView = null

    beforeEach ->
      vent = new Backbone.Wreqr.EventAggregator()

      spyOn vent, 'on'

      itemView = new Dg.ItemView vent: vent

    it "should register an event", ->
      expect(vent.on).toHaveBeenCalled()

    it "should register only one event", ->
      expect(vent.on.calls.count()).toEqual 1

    it "should register the event [view:refresh]", ->
      expect(vent.on).toHaveBeenCalledWith 'view:refresh', itemView.refreshView, itemView

  describe "when an item view is rendered", ->
    vent = null
    itemView = null

    beforeEach ->
      vent = new Backbone.Wreqr.EventAggregator()

      spyOn vent, 'trigger'

      itemView = new Dg.ItemView(vent: vent)
      itemView.onRender()

    it "should send an event", ->
      expect(vent.trigger).toHaveBeenCalled()

    it "should send only one event", ->
      expect(vent.trigger.calls.count()).toEqual 1

    it "should send event [item:rendered]", ->
      expect(vent.trigger).toHaveBeenCalledWith 'item:rendered', itemView

  describe "when an item view is refreshed", ->
    vent = new Backbone.Wreqr.EventAggregator()
    itemView = new Dg.ItemView(vent: vent)

    it "should react to an event and then throw an error", ->
      expect(-> vent.trigger 'view:refresh').toThrow()

    it "should throw an exception when called directly", ->
      expect(itemView.refreshView).toThrow()

  describe "when an item view is updated", ->
    info =
      some: 'some'
    vent = null
    itemView = null

    beforeEach ->
      vent = new Backbone.Wreqr.EventAggregator()

      spyOn vent, 'trigger'

      itemView = new Dg.ItemView(vent: vent)
      itemView.update info

    it "should send an event", ->
      expect(vent.trigger).toHaveBeenCalled()

    it "should send only one event", ->
      expect(vent.trigger.calls.count()).toEqual 1

    it "should send event [update]", ->
      expect(vent.trigger).toHaveBeenCalledWith 'update', info

  describe "when an item view is closed", ->
    vent = null
    itemView = null

    beforeEach ->
      vent = new Backbone.Wreqr.EventAggregator()
      spyOn(vent, 'off').and.callThrough()

      itemView = new Dg.ItemView(vent: vent)
      itemView.onClose()

    it "should unbind an event", ->
      expect(vent.off).toHaveBeenCalled()

    it "should unbind only one event", ->
      expect(vent.off.calls.count()).toEqual 1

    it "should unbind event [view:refresh] for function refreshView", ->
      expect(vent.off).toHaveBeenCalledWith 'view:refresh', itemView.refreshView, itemView

    it "should not react anymore to [view:refresh] event is sent", ->
      expect(-> vent.trigger 'view:refresh').not.toThrow()

