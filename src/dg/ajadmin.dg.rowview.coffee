###
## Dg.RowView

The implementation of the `Dg.RowView` needs to be extended for a proper use. The row view
have no idea of the data to render and therefore it is required to extend this view for the
specific data you have to render.

This class take care about the `delete` and `edit` button events when provided. This
basic behavior is designed to go with the `Dg.ToolbarView` which provides the `create` and
`refresh` buttons.

This row view is build around the `<tr />` and `<td />` tags that are the defaults for
the data grid rendering done by the `Dg` plugin.

A default styling is done for the column ordering to show the `asc`, `desc` and `none`
order.
###
Dg.RowView = class extends Dg.ItemView
  tagName: "tr"

  events:
    "click .edit": "edit"
    "click .delete": "delete"

  ###
  Configurable options (default values are shown):

  @param {Object} options The options to configure the view

  ```
  # Default options
  options:
    css:
      asc: "sorting-asc"
      desc: "sorting-desc"
      none: null
    cellTagName: "td"
  ```

  - **css**: Different styles applied when sorting is done. `asc` and
            `desc` styles are required. A `none` style should be defined
            to apply when ordering change from `desc` order to `none` order.
  - **cellTagName**: HTML tag name that represent a cell into the data grid
  ###
  initialize: (options) ->
    super options

    # Define the defaults CSS styles if none are provided
    @css = _.defaults(options.css || {}, {
      asc: "sorting-asc"
      desc: "sorting-desc"
    })

    @cellTagName = options.cellTagName || "td"

  ###
  Apply the different style to represent the ordering done
  on the collection.

  @param {Object} info The metadata to get the ordering data
  ###
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

  ###
  Manage the `edit` action

  @param {Event} event The `edit` button click
  ###
  edit: (event) ->
    event.preventDefault()
    @vent.trigger "row:edit", @model

  ###
  Manage the `delete` action

  @param {Event} event The `delete` button click
  ###
  delete: (event) ->
    event.preventDefault()
    @vent.trigger "row:delete", @model