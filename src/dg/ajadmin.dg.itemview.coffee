###
## ItemView

This is the general view used in the `DataGrid` plugin to ensure
the rendering and the update of information arround the collection
rendered. The view is based on the `Marionette.ItemView`.

The both methods `refreshView` and `update` are mandatory. The `refreshView`
raise an error if not overriden while the `update` has a default implementation.

This view expect to have an event aggregator given from the datagrid layout. If not given,
an error is raised.
###
Dg.ItemView = class extends Marionette.ItemView
  ###
  Constructor to enforce the presence of the event aggregator
  used accross the datagrid.

  The refreshView method is directly bind to the event `view:refresh`
  from the event aggregator.

  @param {Object} options The options that should at least contain `vent` object
  ###
  initialize: (options) ->
    throw new Error "No event aggregator given." unless options.vent
    @vent = options.vent
    @vent.on "view:refresh", @refreshView, @

  ###
  Override the default render method from `Marionette.ItemView`
  to trigger the event "item:rendered" once the render method
  finished.

  The `render` function is called on the `Marionette.ItemView` to
  manage the technical rendering part. The addition comes from
  the event triggered after the rendering is done.

  @return {Dg.ItemView} This
  ###
  render: ->
    super
    @vent.trigger("item:rendered", this)
    return @

  ###
  Refresh the view based on the info comming from the collection state.

  By default, this function raised an exception as she must be implemented.

  @param {Object} info The metadata that describe the collection current state
  ###
  refreshView: (info) ->
    throw new Error "The method refreshView(info) must be defined."

  # TODO: Better comment
  # Trigger an event to update the info
  # @param [Object] info The metadata updated by the table view (could be part of the whole data)
  update: (info) ->
    @vent.trigger "update", info

  close: ->
    @vent.off "view:refresh", @refreshView
    super
