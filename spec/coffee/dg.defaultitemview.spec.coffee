describe "datagrid default item view", ->
  describe "several events are sent when rendering the view", ->
    vent = null
    view = null

    beforeEach ->
      spyOn(Marionette.Renderer, 'render').and.returnValue ->
        '<div/>'

      vent = new Backbone.Wreqr.EventAggregator()

      spyOn vent, 'trigger'

      view = new Dg.DefaultItemView vent: vent

      spyOn view, 'trigger'
      spyOn view, 'setElement'
      spyOn view, 'getTemplate'
      spyOn view, 'serializeData'
      spyOn view, 'bindUIElements'
      spyOn view, 'onRender'
#      spyOn view, 'beforeRender'

      view.render()

    it "should send 4 events", ->
      expect(view.trigger.calls.count()).toEqual 4

    it "should send event [before:render] first", ->
      expect(view.trigger.calls.argsFor(0)).toEqual ['before:render', view]

    it "should send event [item:before:render] second", ->
      expect(view.trigger.calls.argsFor(1)).toEqual ['item:before:render', view]

    it "should send event [render] third", ->
      expect(view.trigger.calls.argsFor(2)).toEqual ['render', view]

    it "should send event [item:rendered] fourth", ->
      expect(view.trigger.calls.argsFor(3)).toEqual ['item:rendered', view]

    it "should send event only one to all components", ->
      expect(vent.trigger.calls.count()).toEqual 1

    it "should send event [item:rendered] to all components", ->
      expect(vent.trigger).toHaveBeenCalledWith 'item:rendered', view

    for name in ['getTemplate', 'serializeData', 'bindUIElements', 'onRender']
      it "should call function #{name}", ->
        expect(view[name]).toHaveBeenCalled()

      it "should call function #{name} only once", ->
        expect(view[name].calls.count()).toEqual 1

  describe "when pre-rendering defined", ->
    vent = null
    view = null

    beforeEach ->
      spyOn(Marionette.Renderer, 'render').and.returnValue ->
        '<div/>'

      vent = new Backbone.Wreqr.EventAggregator()

      spyOn vent, 'trigger'

      ViewWithPreRender = Dg.DefaultItemView.extend
        beforeRender: ->


      view = new ViewWithPreRender vent: vent

      spyOn view, 'beforeRender'

      view.render()

    it "should call pre-rendering function at the rendering time", ->
      expect(view.beforeRender).toHaveBeenCalled()

    it "should call pre-rendering function at the rendering time only once", ->
      expect(view.beforeRender.calls.count()).toEqual 1