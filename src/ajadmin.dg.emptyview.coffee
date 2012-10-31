EmptyView = class extends Dg.DefaultItemView
  template: "layouts/dg/empty"

  ui:
    empty: ".empty"

  initialize: (options) ->
    @columns = options.columns
    super options

  onRender: ->
    @$el.attr("colspan", @columns)

  refreshView: (info) ->