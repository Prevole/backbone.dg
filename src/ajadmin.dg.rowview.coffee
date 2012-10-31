# Default and incomplete implementation of a row view of the grid. The row
# is the ItemView of the CompositeView that represents the data grid. This
# class should be extended to define the layout to be rendered by the view.
# This view offer the default "edit" and "delete" action for a row. The rendering
# of the column sorting is also handled by applying styling on each cell of a row.
# The styles should be overriden through the initializer (refer to initialize(options)
# for more information).
# TODO: Review this comment
# This default implementation is based on HTML <table /> element and therefore the view
# is expected to be a collection of <td /> wrapped into <tr /> that is part of the view
# definition.
Dg.RowView = class extends Dg.TableItemView
  tagName: "tr"

  events:
    "click .edit": "edit"
    "click .delete": "delete"

  # The following options are configurable (default values are shown):
  # options:
  #   css:
  #     asc: "sorting-asc"
  #     desc: "sorting-desc"
  #     none: null
  #   cellTagName: "td"
  #
  # css: Define the different style applied when sorting is done. "asc" and
  #      "desc" styles are required. Define a "none" style to apply when
  #      ordering change from desc order to none order.
  # cellTagName: Define the HTML tag name that represent a cell into the data grid
  initialize: (options) ->
    super options

    # Define the defaults CSS styles if none are provided
    @css = _.defaults(options.css || {}, {
      asc: "sorting-asc"
      desc: "sorting-desc"
    })

    @cellTagName = options.cellTagName || "td"

  # Apply the different style to represent the ordering done
  # on the collection.
  refreshView: (info) ->
    if info[infoKeys.sort]
      # Update the view state for each column header
      for target in @$el.find(@cellTagName)
        target = $(target)

        # Remove previous sorting classes
        target.removeClass("#{@css.asc} #{@css.desc}")
        target.removeClass(@css.none) if @css.none

        # Check if the current column header is sorted
        if info[infoKeys.sort][target.index()]
          # Check which sorting order is to apply
          if info[infoKeys.sort][target.index()] == infoKeys.asc
            target.addClass(@css.asc)
          else
            target.addClass(@css.desc)
        else if @css.none
          target.addClass(@css.none)

  # Handle the edit action
  # @param [Event] event The event triggered
  edit: (event) ->
    event.preventDefault()
    @vent.trigger "row:edit", @model

  # Handle the delete action
  # @param [Event] event The event triggered
  delete: (event) ->
    event.preventDefault()
  @vent.trigger "row:delete", @model