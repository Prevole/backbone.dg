###
## Dg.PerPageView

Default implementation for the region which allow changing the number of lines
shown in the table. The implementation is based on a select box.
###
Dg.PerPageView = class extends Dg.DefaultItemView
  template: templates["perpage"]

  events:
    "change .per-page": "perPage"

  ui:
    perPage: ".per-page"

  ###
  Refresh the view by setting the number of entries per page to the select box.

  As the `refresh` function from `Dg.QuickSearchView`, this function is used to
  synchronize multiple views.

  @param {Object} info The metadata to get the number of lines per page
  ###
  refreshView: (info) ->
    @ui.perPage.val(info[infoKeys.perPage])

  ###
  Manage the changes occured to change the number of entries
  shown on a page.

  @param {Event} event The event triggered on `change`
  ###
  perPage: (event) ->
    @update _.object( [infoKeys.perPage], [parseInt(@ui.perPage.val())] )
