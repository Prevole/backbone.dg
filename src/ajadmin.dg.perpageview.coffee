# Default implementation for changing the number of entries displayed on a
# single page. The selector is select box.
Dg.PerPageView = class extends Dg.DefaultItemView
  template: templates["perpage"]

  events:
    "change .per-page": "perPage"

  ui:
    perPage: ".per-page"

  # Refresh the view by setting the number of entries per page to the select box
  # @param [Object] info The data to get the number of entries
  refreshView: (info) ->
    @ui.perPage.val(info[infoKeys.perPage])

  # Handle the select box changes
  # @param [Event] event The event triggered
  perPage: (event) ->
    @update _.object( [infoKeys.perPage], [@ui.perPage.val()] )
