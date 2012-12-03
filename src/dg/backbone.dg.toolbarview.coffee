###
## Dg.ToolbarView

In general, a table is quite often used to manipulate data. Therefore,
some buttons are required to manage the data such an add button or a
refresh button.
###
Dg.ToolbarView = class extends Dg.DefaultItemView
  template: templates["toolbar"]

  events:
    "click .refresh": "refresh"
    "click .create": "create"

  ui:
    create: ".create"
    refresh: ".refresh"

  ###
  When the refresh of the view occured, the buttons deactived are
  restored to their initial status as active button.

  @param {Object} info The metadata to get information about the collection
  ###
  refreshView: (info) ->
    @ui.refresh.removeClass("disabled")
    @ui.create.removeClass("disabled")

  ###
  Manage the create button and the management of the button
  state.

  When the button is cliked, an event is triggered to delegate
  the creation operation to another component that listen for
  the event.

  @param {Event} event Create button event triggered
  ###
  create: (event) ->
    event.preventDefault()

    unless @ui.create.hasClass("disabled")
      @ui.create.addClass("disabled")
      # TODO: Implement the create event

  ###
  Manage the refresh button and the management of the
  button state.

  Delegate the update request of the collection to
  the `Dg.ItemView`.

  @param {Event} event Refresh button event triggered
  ###
  refresh: (event) ->
    event.preventDefault()

    unless @ui.refresh.hasClass("disabled")
      @ui.refresh.addClass("disabled")
      @update {}
