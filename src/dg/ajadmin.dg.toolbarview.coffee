# Default tool bar implementation for the grid. It contains a refresh
# button that allows to refresh the collection from your backend. A
# create button is also present. Buttons are deactivated when they
# are clicked.
Dg.ToolbarView = class extends Dg.DefaultItemView
  template: templates["toolbar"]

  events:
    "click .refresh": "refresh"
    "click .create": "create"

  ui:
    create: ".create"
    refresh: ".refresh"

  # Reactivate the buttons
  refreshView: (info) ->
    @ui.refresh.removeClass("disabled")
    @ui.create.removeClass("disabled")

  # Handle the create action
  # @param [Event] event The event triggered
  create: (event) ->
    event.preventDefault()

    # Check if the button is active
    unless @ui.create.hasClass("disabled")
      @ui.create.addClass("disabled")
      # TODO: Implement the create event

  # Handle the refresh action
  # @param [Event] event The event triggered
  refresh: (event) ->
    event.preventDefault()

    # Check if the button is active
    unless @ui.refresh.hasClass("disabled")
      @ui.refresh.addClass("disabled")
      @update {}
