###
## Dg.QuickSearch

Default implementation for the quick search accross the collection. A text field
is used to get the search term and the filtering happens on the `keyup` event
from the text field.

The refresh of the collection happens in a delayed function to allow writing
more than one caracter before triggering the refresh. This will avoid strange behavior
and brings a better user experience.
###
Dg.QuickSearchView = class extends Dg.DefaultItemView
  template: templates["quicksearch"]

  events:
    "keyup input": "search"

  ui:
    term: "input"

  ###
  Intialize the view and prepare the delayed search function

  @param {Object} options The options to pass to the parent constructor
  ###
  initialize: (options) ->
    super options

    # Create the delayed function to trigger the search query
    @searchInternal = _.debounce(
      (event) =>
        @update _.object( [infoKeys.term], [@ui.term.val().trim()] )
      , 300
    )

  ###
  Refresh the view by setting the search term into the field.

  This could be quite strange but it is useful when you want the
  `Dg.QuickSearchView` on top and on bottom of your datagrid. Therfore,
  the quick search fields seems to be synced together as each field
  will be updated when one of them changed.

  @param {Object} info The metadata to retrieve the search term
  ###
  refreshView: (info) ->
    @ui.term.val info[infoKeys.term]

  ###
  Handle the quick search field changes to process
  the search query

  @param {Event} event The event triggered on `keyup`
  ###
  search: (event) ->
    @searchInternal(event)
