###
## Dg.TableView

The core view that present the data collection with
the headers and rows.

The view is based on `<table />` tag element. The collection
content is wrapped into a `<tbody />` tag and the headers are
appended before this tag.
###
Dg.TableView = Marionette.CompositeView.extend
  template: 'table'
  itemViewContainer: 'tbody'
  emptyView: Dg.EmptyView

  ###
  This function allows the `ItemView` of a `Model` to
  get some information to render itself correctly.

  The `EventAggregator` is provided to the `ItemView` throuhg
  this function as the columns information.

  @param {Backbone.Model} model The model to render
  ###
  itemViewOptions: ->
    return { vent: @vent, columns: @columns() }

  ###
  Constructor

  @param {Object} options The options to configure the view

  ```
  # Options expected
  options:
    vent:
    collection:
  ```
  ###
  constructor: ->
    Marionette.CompositeView.prototype.constructor.apply @, slice(arguments)
    _.extend @, _.pick(@options, 'vent')


  getTemplate: ->
    Dg.getTemplate @template

  onCompositeModelRendered: ->
    # If necessary, the header view is rendered
    if @headerView
      @header = new @headerView(@options)

      if @header.parentSelector is undefined or @header.parentSelector == ''
        selector = 'table'
      else
        selector = @header.parentSelector

      if @header.appendMode is undefined or @header.appendMode != 'prepend'
        @$el.find(selector).append(@header.render().el)
      else
        @$el.find(selector).prepend(@header.render().el)

    @trigger 'render'

  ###
  As the render function do custom operations, we
  need to close the custom additions in a proper way.

  In this callback function called before the remaining
  close operations, we close the header view to manage
  properly the event unbinding.
  ###
  beforeClose: ->
    @header.close() if @header

  ###
  @return {int} The number of columns, zero if no header view
  ###
  columns: ->
    if @header
      @header.columns()
    else
      0
