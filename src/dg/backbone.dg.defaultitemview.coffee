###
## DefaultItemView

Use the `Dg.DefaultItemView` is a specialized view from `Dg.ItemView`. It is designed
to be used to generate views that are not wrapped in a `<div />` tag.

The specialization comes from the fact that all the view extending this one will not
create the `el` tag based on view configuration but create the `el` directly from
the template rendering. Therefore, setting the `className`, `tagName` or `el` directly
must not be used directly.
###
Dg.DefaultItemView = Dg.ItemView.extend
  ###
  Constructor
  ###
  constructor: () ->
    Dg.ItemView.prototype.constructor.apply @, arguments

  # ### render
  ###
  Override the default render method from `Dg.TableItemView` to
  set the element to the result of template rendering. This will
  suppress the additional `<div />` element.

  Take care that using this `Dg.DefaultItemView` will not allow to specify
  any selector or tag as el.

  The code is based on the `Backbone.Marionette.ItemView` render method with
  two main differences. The element is set from the template rendering and
  an additional `item:rendered` event is triggered.
  ###
  render: ->
    @beforeRender() if @beforeRender

    @trigger 'before:render', @
    @trigger 'item:before:render', @

    # Override the `el` with the template rendered
    @setElement($(Marionette.Renderer.render(@getTemplate(), @serializeData())), true)

    @bindUIElements()

    @onRender()

    @trigger 'render', @
    @trigger 'item:rendered', @

    # Trigger the additional event through the `Backbone.Marionette.EventBinder`
    # set for the `Dg` views.
    @vent.trigger 'item:rendered', @

    return @
