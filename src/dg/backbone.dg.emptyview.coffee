###
## Dg.EmptyView

When there is no data available in the collection, this view
is used to show to the user this state of the collection.

The empty view is based on the `<table />` tag and then
will use a `</td colspan="n">` tag where `n` is the number
of columns shown in the data table.
###
Dg.EmptyView = Dg.DefaultItemView.extend
  optionNames: ['columns']

  template: 'empty'

  ui:
    empty: '.empty'

  ###
  When the view is rendered, the number of columns is set
  ###
  onRender: ->
    @$el.attr('colspan', @columns)

  ###
  Nothing fancy is done for this refresh function

  @param {Object} info The collection metadata
  ###
  refreshView: (info) ->