  # The main view to manage the data table
  Dg.TableView = Marionette.CompositeView.extend
    template: "layouts/dg/table"
    itemViewContainer: "tbody"
    emptyView: DefaultTableEmptyView

    itemViewOptions: (model) ->
      return { vent: @vent, columns: @columns() }

    initialize: (options) ->
      @vent = options.vent
      @collection = options.collection

    # Override the rendering to be able to do exactly what is required
    render: ->
      @resetItemViewContainer()

      @setElement @renderModel()

      if @headerView
        @header = new @headerView(vent: @vent)
        tableHeader =  @header.render().el
        @$el.prepend(tableHeader)

      @bindUIElements()
      @trigger("composite:model:rendered")
      @trigger("render")

      @renderCollection()
      @trigger("composite:rendered")

      @

    # Be sure that the header view is closed before closing normally
    beforeClose: () ->
      @header.close() if @header

    columns: ->
      if @header
        @header.columns()
      else
        0
