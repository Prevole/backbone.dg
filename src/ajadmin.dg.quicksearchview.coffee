# Default implementation for the quick search accross the collection. A text field
# is used to gather the search term and the filtering happens on the keyup event
# from the text field.
#
# The refresh of the collection happens in a delayed function to allow writing
# multiple caracters before triggering the refresh. This will avoid strange behavior
# and brings a better user experience.
alert "There"
Dg.QuickSearchView = class extends Dg.DefaultItemView
  template: templates["quicksearch"]

  events:
    "keyup input": "search"

  ui:
    term: "input"

  # Intialize the view and prepare the delayed search function
  initialize: (options) ->
    super options
    @searchInternal = _.debounce(
      (event) =>
        @update _.object( [infoKeys.term], [@ui.term.val().trim()] )
      , 300
    )

  # Refresh the view by setting the search term into the field
  # @param [Object] info The data to get the search term
  refreshView: (info) ->
    @ui.term.val info[infoKeys.term]

  # Handle the quick search field changes
  # @param [Event] event The event triggered
  search: (event) ->
    @searchInternal(event)
