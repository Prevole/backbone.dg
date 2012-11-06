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
