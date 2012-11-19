###
## Dg.LoadingView

This view is used when the collection is fetched from a source. The
purpose is to show to the user that something is happening that is
different than no data is available.
###
LoadingView = class extends Backbone.Marionette.ItemView
  template: templates["gridempty"]

#    render: ->
#      @beforeRender() if @beforeRender
#
#      @trigger("before:render", @)
#      @trigger("item:before:render", @)
#
#
#      el = $(Marionette.Renderer.render(@getTemplate(), @serializeData()))
#      @setElement el
#
#      @bindUIElements();
#
#      @onRender() if @onRender
#
#      @trigger("render", this)
#      @trigger("item:rendered", this)
