# Default implementation of the pager view attached to the grid and
# the current state of the collection rendered.
# The pager includes numbers and page first/last, previous/next
# controlls.
# Last and First keywords are converted to the real number of last
# and first page corresponding to the collection.
# Previous and Next keywords are converted to +1 and -1 based on
# the current page number.
# Checks are done to correct bad page numbers or out of bounds.
# The view is customizable through the options hash given to the
# initializer. Refer to initialize(options) function for more
# details of different possibilities.
Dg.PagerView = class extends Dg.DefaultItemView
  template: templates["pager"]

  events:
    "click a": "pagging"

  # Create a default configuration to start calculation on
  # first rendering such number of pages and actual page.
  #
  # The following options are configurable (default values are shown):
  # options:
  #   deltaPage: 2
  #   css:
  #     active: "active"
  #     disabled: "disabled"
  #     page: "page"
  #   texts:
  #     first: "<<"
  #     previous: "<"
  #     next: ">"
  #     last: ">>"
  #     filler: "..."
  #   numbers: true
  #   firstAndLast: true
  #   previousAndNext: true
  #
  # delatePage: Define the number of pages shown before and after the active one
  # css: Define the different style added for link "disabled", "active" or "page"
  # texts: Define the texts used for each link excepted the page numbers
  # numbers: Define if the page number links are used
  # firstAndLast: Define if first and last links are used
  # previousAndNext: Define if previous and next links are used
  initialize: (options) ->
    super options

    # Define the default value for the number of links show before
    # and after the active link
    @deltaPage = options.deltaPage || 2

    # Define the defaults CSS styles if none are provided
    @css = _.defaults(options.css || {}, {
      active: "active"
      disabled: "disabled"
      page: "page"
    })

    # Define the texts if none are provided. Use I18n-js if defined
    # TODO: Check how to do that
#    if I18n is undefined
    @texts = _.defaults(options.texts || {}, {
      first: "<<"
      previous: "<"
      next: ">"
      last: ">>"
      filler: "..."
    })
#    else
#    @texts = _.defaults(options.texts || {}, {
#      first: I18n.t i18nKeys.pager.first
#      previous: I18n.t i18nKeys.pager.previous
#      next: I18n.t i18nKeys.pager.next
#      last: I18n.t i18nKeys.pager.last
#      filler: I18n.t i18nKeys.pager.filler
#    })

    # Show the numbers by default
    @numbers = true
    @numbers = options.numbers unless options.numbers is undefined

    # Show the first and last links by default
    @firstAndLast = true
    @firstAndLast = options.firstAndLast unless options.firstAndLast is undefined

    # Show the previous and next links by default
    @previousAndNext = true
    @previousAndNext = options.previousAndNext unless options.previousAndNext is undefined

    # Define default values for rendering when no info available
    @info = {}
    @info[infoKeys.page] = 0
    @info[infoKeys.pages] = 0

  # Render the pager component based on the info given. Calculation
  # is done to know how to render the actual page, first/last, next/previous
  # links.
  refreshView: (info) ->
    # Save the info
    @info = info

    # Empty element
    @$el.empty().hide()

    ul = $("<ul />")

    # Shortcuts to number of pages and current page
    page = @info[infoKeys.page]
    pages = @info[infoKeys.pages]

    # Check if there is something to render
    if page > 0 and pages > 1
      # Calculate the bounds
      minPage = page - @deltaPage
      maxPage = page + @deltaPage

      # Correct the overflows of the bounds
      minPage = 1 if minPage <= 0
      maxPage = pages if maxPage >= pages

      # Create first and previous links
      state = if page == 1 then @css.disabled else ""
      ul.append(createLink.call @, @texts.first, "f", state) if @firstAndLast
      ul.append(createLink.call @, @texts.previous, "p", state) if @previousAndNext

      # Check if number must be shown
      if @numbers
        # Create filler
        ul.append(createLink.call @, @texts.filler, "", @css.disabled) if minPage > 1

        # Create page links
        ul.append(createLink.call @, "#{i}", "page", if i == page then @css.active else "") for i in [minPage..maxPage]

        # Create filler
        ul.append(createLink.call @, @texts.filler, "", @css.disabled) if maxPage < pages

      # Create last and next links
      state = if page == pages then @css.disabled else ""
      ul.append(createLink.call @, @texts.next, "n", state) if @previousAndNext
      ul.append(createLink.call @, @texts.last, "l", state) if @firstAndLast

      @$el.append(ul).show()

  # Handle the pagging event when a page link is clicked
  # @param [Event] event The event triggered
  pagging: (event) ->
    event.preventDefault()

    target = $(event.target)

    # Check that the link clicked is clickable
    unless target.parent().hasClass(@css.disabled) or target.parent().hasClass(@css.active)
      # Retrieve the type of page link clicked
      type = target.data("type")

      # Calculate the correct page
      switch type
        when "f" then page = 1
        when "p" then page = (if @info[infoKeys.page] - 1 > 0 then @info[infoKeys.page] - 1 else @info[infoKeys.page])
        when "n" then page = (if (@info[infoKeys.page] + 1) < @info[infoKeys.pages] then (@info[infoKeys.page] + 1) else @info[infoKeys.pages])
        when "l" then page = @info[infoKeys.pages]
        else page = parseInt($(event.target).text())

      # Update the collection only if page is different from the current one
      @update _.object( [infoKeys.page], [page] ) if page != @info[infoKeys.page]

  # Create a link for one element in the pager
  # @param [String] text The text shown to the user
  # @param [String] type The type of bookmark
  # @param [String] state The state of the bookmark
  createLink = (text, type, state) ->
    a = $("<a/>").attr("href", "#").data("type", type).addClass(@css.page).html("#{text}")
    li = $("<li />").html(a)
    li.addClass(state) if state
    return li
