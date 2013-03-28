###
## Dg.GridLayout

This class brings all the bricks together to render each part
of the datagrid (table, headers, toolbars, pagers...)
###
Dg.GridLayout = class extends Marionette.Layout
  template: templates["grid"]

  ###
  Constructor
  @param {Object} options Options to configure the grid
  ###
  initialize: (options) ->
    # Create the event aggregator used accross all the components
    @vent = new Backbone.Wreqr.EventAggregator()

    @on "render", @renderRegions

    ###
    TODO: Refactor this part

    Listen to the different events
    ###
    @vent.on "update", @handleUpdate
    @vent.on "refresh", @handleRefresh
    @vent.on "row:edit", @handleEdit
    @vent.on "row:delete", @handleDelete
    @vent.on "create:model", @handleCreate

    # Bind the grid refresh to the collection event
    @collection.on "fetched", @refreshGrid

  ###
  Proceed to the regions rendering. Each region is created,
  configured and rendered when necessary.
  ###
  renderRegions: =>
    # Get each region
    for regionName, regionDefinition of @regions
      # The table region is manage differently
      unless regionName == "table"
        # Prepare the options by forwarding the master options to the region options
        options = _.extend({vent: @vent}, regionDefinition.options || {})

        # Show the region after its creation
        @[regionName].show new regionDefinition.view(_.extend(options, @options))

    # Start rendering the table region by showing a loading view (waiting for data)
    @table.show(new LoadingView())

    # Get the data
    @collection.fetch()

  ###
  Refresh the grid when new data are available through the collection
  ###
  refreshGrid: =>
    # This time, the table could shou the data from the collection
    @table.show new @regions.table.view(_.extend({vent: @vent, collection: @collection}, @options))

    # Refresh all the views attached to the grid with the collection metadata
    @vent.trigger "view:refresh", @collection.getInfo()

  # TODO: Review this part of code
  handleUpdate: (options) =>
    @table.show(new LoadingView())
    @collection.updateInfo options

  handleRefresh: =>
    @collection.refresh()

  handleEdit: (model) =>
    # TODO: Trigger event to update the record
#    alert model.get("name")
    @trigger "edit", model

  handleDelete: (model) =>
    @trigger "delete", model

  handleCreate: =>
    @trigger "new"

  ###
  Override the close function from `Backbone.Marionette.Layout` to
  clean the collection bindings.
  ###
  close: ->
    @collection.off "fetched", @refreshGrid
    super

###!
    @on "transition:open", =>
      @showTable()

  showTable: ->
    if @gridTable.currentView
      @gridTable.currentView.renderCollection()
    else
      @gridTable.show(new @tableView(collection: @collection))
!###