Dg.GridLayout = class extends Marionette.Layout
  template: templates["grid"]

  # Constructor
  # @param [Hash] options Options to configure the layout
  initialize: (options) ->
    @vent = new Marionette.EventAggregator()

    @on "render", @renderRegions

    @vent.on "update", @handleUpdate
    @vent.on "refresh", @handleRefresh
    @vent.on "row:edit", @handleEditModel

    @collection.on "fetched", @refreshGrid

  renderRegions: =>
    for regionName, regionDefinition of @regions
      @[regionName].show new regionDefinition.view(_.extend({vent: @vent}, regionDefinition.options || {})) unless regionName == "table"

    @table.show(new LoadingView())

    @collection.fetch()

  refreshGrid: =>
    @table.show new @regions.table.view(vent: @vent, collection: @collection)
    @vent.trigger "view:refresh", @collection.getInfo()

  # TODO: Review this part of code
  handleUpdate: (options) =>
    @table.show(new LoadingView())
    @collection.updateInfo options

  handleRefresh: =>
    @collection.refresh()

  handleEditModel: (model) ->
    # TODO: Trigger event to update the record
    alert model.get("name")

  close: ->
    @collection.off "fetched", @refreshGrid
    super

#      @on "transition:open", =>
#        @showTable()

#    showTable: ->
#      if @gridTable.currentView
#        @gridTable.currentView.renderCollection()
#      else
#        @gridTable.show(new @tableView(collection: @collection))
