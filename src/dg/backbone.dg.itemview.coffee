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
Dg.ItemView = Marionette.ItemView.extend
  ###
  Constructor to enforce the presence of the event aggregator
  used accross the datagrid.

  The refreshView method is directly bind to the event `view:refresh`
  from the event aggregator.

  @param {Object} options The options that should at least contain `vent` object
  ###
  constructor: () ->
    Marionette.ItemView.prototype.constructor.apply @, slice(arguments)

    _.extend @, _.pick(@options, _.union(@optionNames || [], ['vent']))

    throw new Error 'No event aggregator given.' unless @vent
    @vent.on 'view:refresh', @refreshView, @

    @

  ###
  Override the default render method from `Marionette.ItemView`
  to trigger the event "item:rendered" once the render method
  finished.

  The `render` function is called on the `Marionette.ItemView` to
  manage the technical rendering part. The addition comes from
  the event triggered after the rendering is done.

  @return {Dg.ItemView} This
  ###
  onRender: ->
    @vent.trigger('item:rendered', this)

  ###
  Refresh the view based on the info comming from the collection state.

  By default, this function raised an exception as she must be implemented.

  @param {Object} info The metadata that describe the collection current state
  ###
  refreshView: (info) ->
    throw new Error 'The method refreshView(info) must be defined.'

  # TODO: Add see the metadata format
  ###
  Every time the metadata of the datagrid is updated, an
  event is triggered to request a refresh of the data contained
  in the collection.

  As the responsability of the metadata processing is given to
  the collection itself, you can set anything you want as metadata.

  There is a default metadata format expected that you can see. This
  default format should be configured for the default implementation
  of the different table views.

  @param {Object} info The metadata updated by the table views
  ###
  update: (info) ->
    @vent.trigger 'update', info

  ###
  Overrides the `close` function from `Backbone.Marionette.ItemView` to
  ensure that the event binding is correctly unbinded when the view
  is closed.
  ###
  onClose: ->
    @vent.off 'view:refresh', @refreshView