###
## Dg.PagerView

The `Dg.PagerView` is probably one of the most complicated view
as the numbering paging require calculation to render correctly.

The pager includes numbers and page first/last, previous/next
controlls. A delta of number of pages shown is used to render
the number controls.

Last and First keywords are converted to the real number of last
and first page corresponding to the collection.

Previous and Next keywords are converted to +1 and -1 based on
the current page number.

Checks are done to correct bad page numbers or out of bounds in
regards of the collection metadata.
###
Dg.PagerView = class extends Dg.DefaultItemView
  template: templates["pager"]

  events:
    "click a": "pagging"

  ###
  Create a default configuration to start calculation on
  first rendering such number of pages and actual page.

  @param {Object} options The options to configure the view

  ```
  # Default options
  options:
    deltaPage: 2
    css:
      active: "active"
      disabled: "disabled"
      page: "page"
    texts:
      first: "<<"
      previous: "<"
      next: ">"
      last: ">>"
      filler: "..."
    numbers: true
    firstAndLast: true
    previousAndNext: true
  ```

  - **delatePage**: Number of pages shown before and after the active one (if available)
  - **css**: Different style added for link `disabled`, `active` or `page`
  - **texts**: Texts used for each link excepted the page numbers
  - **numbers**: Enable/Disable page number links
  - **firstAndLast**: Enable/Disable first and last links
  - **previousAndNext**: Enable/Disable previous and next links
  ###
  initialize: (options) ->
    super options

    # Define the default value for the number of links shown before
    # and after the active link
    @deltaPage = options.deltaPage || 2

    # Define the defaults CSS styles if part or none are provided
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

  ###
  Render the pager component based on the metadata given. Calculation
  is done to know how to render the actual page, first/last, next/previous
  links.

  The pagger is done through a list of element:

  ```
  <ul>
    <li><a href="...">...</a></li>
    ...
  </ul>
  ```
  @param {Object} info The metadata to get the pagging data
  ###
  refreshView: (info) ->
    # Keep the metadata
    @info = info

    # Reset el
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

      # If number must be shown
      if @numbers
        # Create filler
        ul.append(createLink.call @, @texts.filler, "", @css.disabled) if minPage > 1

        # Create page links
        css = if i == page then @css.active else ""
        ul.append(createLink.call @, "#{i}", "page", css) for i in [minPage..maxPage]

        # Create filler
        ul.append(createLink.call @, @texts.filler, "", @css.disabled) if maxPage < pages

      # Create last and next links
      state = if page == pages then @css.disabled else ""
      ul.append(createLink.call @, @texts.next, "n", state) if @previousAndNext
      ul.append(createLink.call @, @texts.last, "l", state) if @firstAndLast

      @$el.append(ul).show()

  ###
  Manage the clicks done on any button of the pager

  @param {Event} event Pager button click event
  ###
  pagging: (event) ->
    event.preventDefault()

    target = $(event.target)

    # Check if clickable
    unless target.parent().hasClass(@css.disabled) or target.parent().hasClass(@css.active)
      # Retrieve the type of page link clicked
      type = target.data("type")

      # Calculate the correct page
      switch type
        # First page
        when "f"
          page = 1

        # Previous page
        when "p"
          if @info[infoKeys.page] - 1 > 0
            page = @info[infoKeys.page] - 1
          else
            page = @info[infoKeys.page]

        # Next page
        when "n"
          if (@info[infoKeys.page] + 1) < @info[infoKeys.pages]
            page = @info[infoKeys.page] + 1
          else
            page = @info[infoKeys.pages]

        # Last page
        when "l"
          page = @info[infoKeys.pages]

        # Specific page
        else
          page = parseInt($(event.target).text())

      # Update the collection only if required
      @update _.object( [infoKeys.page], [page] ) if page != @info[infoKeys.page]

  ###
  Create a link for one element in the pager.

  @param {String} text The text shown to the user
  @param {String} type The type of link
  @param {String} state The state of the link
  @return {jQueryObject} Link element is wrapped into a `li` tag
  ###
  createLink = (text, type, state) ->
    a = $("<a/>").attr("href", "#").data("type", type).addClass(@css.page).html("#{text}")
    li = $("<li />").html(a)
    li.addClass(state) if state
    return li
