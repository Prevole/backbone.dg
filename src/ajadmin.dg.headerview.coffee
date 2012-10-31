Dg.HeaderView = class extends Dg.DefaultItemView
  events:
    "click .sorting": "sort"

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
            # Check which sorting order is to apply
            if @sortConfiguration[target.index()] == infoKeys.asc
              target.addClass("sorting-asc")
            else
              target.addClass("sorting-desc")

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

    # Ask for a collection update
    @update _.object( [infoKeys.sort], [@sortConfiguration] )

  columns: ->
    @$el.find("th").length