EmptyView = class extends Dg.DefaultItemView
  template: templates["empty"]

  ui:
    empty: ".empty"

  ###
    @param: {Object} options There are options
  ###
  initialize: (options) ->
    @columns = options.columns
    super options

  onRender: ->
    @$el.attr("colspan", @columns)

  refreshView: (info) ->