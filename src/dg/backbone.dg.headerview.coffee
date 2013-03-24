###
## Dg.HeaderView

As the `Dg.RowView`, the `HeaderView` is incomplete and expects to be
extended for your own data.

This view offers the mechanism to sort the column of your data collection
when they are presented in `<table />` tag. Table headers HTML tags are used
to render the headers.

The multi-sort is possible by pressing on shift key when clicks are done
on the different columns.
###
Dg.HeaderView = class extends Dg.ItemView
  tagName: "thead"
  parentTagName: "table"

  events:
    "click .sorting": "sort"

  ###
  ## TODO
  - Introduced a configuration for the CSS
  - Refactor to allow using specific tags for header container and columns
  - Refactor the styles to allow the differenciation between each column sorting in multi mode
  ###

  ###
  Refresh the view accordingly to the metadata that should contain
  the column sorting information. Which column are sorted in which
  direction.

  @param {Object} info The metadata with the column sorting configuration
  ###
  refreshView: (info) ->
    # Update the view state for each column header
    for target in @$el.find("th")
      target = $(target)

      # Check if the target is electible for sorting
      if target.hasClass("sorting")
        # Remove previous sorting classes
        target.removeClass("sorting-asc sorting-desc")

        # Check if a sorting configuration is already existing
        if info[infoKeys.sort]
          # Store the current configuration
          @sortConfiguration = info[infoKeys.sort]

          # Check if the current column header is sorted
          if @sortConfiguration[target.index()]
            # Check which sorting order must be apply
            if @sortConfiguration[target.index()] == infoKeys.asc
              target.addClass("sorting-asc")
            else
              target.addClass("sorting-desc")

  ###
  Manage the sort action to be done when an header element is
  clicked.

  @param {Event} event The click event for sorting
  ###
  sort: (event) ->
    # Retrieve the header index
    idx = $(event.target).index()

    # Be sure there is a sorting configuration
    @sortConfiguration = {} unless @sortConfiguration

    # Check if multi column sorting is disabled
    unless event.shiftKey
      # Check if the column clickd is already sorted
      if @sortConfiguration[idx]
        # Keep only this column for the new configuration
        @sortConfiguration = _.pick(@sortConfiguration, idx)
      else
        # Create a new sorting configuration
        @sortConfiguration = {}

    # Check if the column is already sorted
    if @sortConfiguration[idx] is undefined
      @sortConfiguration[idx] = infoKeys.asc

    # Check if the sort order is ascendant
    else if @sortConfiguration[idx] == infoKeys.asc
      @sortConfiguration[idx] = infoKeys.desc

    # Otherwise reset the sorting
    else
      @sortConfiguration[idx] = undefined

    # Update the collection accordingly to the sorting configuration
    @update _.object( [infoKeys.sort], [@sortConfiguration] )

  ###
  @return {int} The number of columns
  ###
  columns: ->
    @$el.find("th").length