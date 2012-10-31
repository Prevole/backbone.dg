# Use the DefaultTableItemView is a specialized view from TableItemView. It offers
# a default behavior wanted for the general datagrid implementation.
# The specialization comes from the fact that all the view extending this one will not
# create the el tag based on view configuration but create the el directly from
# the template rendering. Therefore, setting the className, tagName or el directly
# has no result on this kind of view.
Dg.DefaultItemView = class extends Dg.ItemView
  # Override the default render method for TableItemView to
  # set the element to the result of template rendering. This will
  # suppress the additional <div /> element.
  # Take care that using this DefaultTableItemView will not allow to specify
  # any selector or tag as el.
  # In addition, "item:rendered" is triggered once the view is rendered
  render: ->
    @beforeRender() if @beforeRender

    @trigger("before:render", @)
    @trigger("item:before:render", @)

    @setElement($(Marionette.Renderer.render(@getTemplate(), @serializeData())), true)

    @bindUIElements();

    @onRender() if @onRender

    @trigger("render", this)
    @trigger("item:rendered", this)
    @vent.trigger("item:rendered", this)

    return @
