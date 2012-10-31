# Use the TableItemView to create any view attached to the datagrid.
# The both methods refreshView and update are mandatory. The refreshView
# raise an error if not overriden while the update has a default implementation.
# This view expect to have an event aggregator given from the datagrid layout.
# If not, an error is raised.
Dg.ItemView = class extends Marionette.ItemView
  # Constructor to enforce the presence of the event aggregator
  # used accross the datagrid.
  # The refreshView method is directly bind to the event view:refresh
  # from the event aggregator.
  initialize: (options) ->
    throw new Error "No event aggregator given." unless options.vent
    @vent = options.vent
    @vent.on "view:refresh", @refreshView, @

  # Override the default render method from Marionette.ItemView
  # to trigger the event "item:rendered" once the render method
  # finished.
  render: ->
    super
    @vent.trigger("item:rendered", this)
    return @

  # TODO: Better comment
  # Refresh the view with the information given in parameters.
  # @param [Object] info The metadata that defines the grid collection
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
