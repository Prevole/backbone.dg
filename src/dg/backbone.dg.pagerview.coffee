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

```
# Default options
options:
  deltaPage: 2
  css:
    active: "active"
    disabled: "disabled"
  numbers: true
```

- **delatePage**: Number of pages shown before and after the active one (if available)
- **css**: Different style added for link `disabled`, `active` or `page`
###
Dg.PagerView = Dg.DefaultItemView.extend
  optionNames: ['deltaPage', 'css']

  template: 'pager'

  # The bindings to handle the right behavior from the events
  ui:
    first: '[data-page-type=first]'
    prev: '[data-page-type=prev]'
    page: '[data-page-type=page]'
    next: '[data-page-type=next]'
    last: '[data-page-type=last]'

  # Events binded to the right elements
  events:
    'click @ui.first': 'firstPage'
    'click @ui.prev': 'previousPage'
    'click @ui.page': 'toPage'
    'click @ui.next': 'nextPage'
    'click @ui.last': 'lastPage'

  # Define the default value for the number of links shown before
  # and after the active link
  deltaPage: 2

  # Define the defaults CSS styles if part or none are provided
  css:
    active: 'active'
    disabled: 'disabled'

  ###
  Constructor
  ###
  constructor: (options) ->
    Dg.DefaultItemView.prototype.constructor.apply @, arguments

    # Define default values for rendering when no info available
    @info = {}
    @info[infoKeys.page] = 0
    @info[infoKeys.pages] = 0

  ###
  Render the pager component based on the metadata given. Calculation
  is done to know how to render the actual page, first/last, next/previous
  links.

  @param {Object} info The metadata to get the pagging data
  ###
  refreshView: (info) ->
    # Keep the metadata
    @info = info

    # Reset el
    @$el.empty()

    pagerTemplate = @_getPageElements()

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
      state = if page == 1 then @css.disabled else ''
      @$el.append(@_createLink pagerTemplate.first, state) if pagerTemplate.first != undefined
      @$el.append(@_createLink pagerTemplate.prev, state) if pagerTemplate.prev != undefined

      # Create page links
      if pagerTemplate.page != undefined
        # Create filler
        if pagerTemplate.before != undefined and minPage > 1
          @$el.append(@_createLink pagerTemplate.before, @css.disabled)

        for i in [minPage..maxPage]
          css = if i == page then @css.active else ''
          @$el.append(@_createPageLink pagerTemplate.page, i, css)

        # Create filler
        if pagerTemplate.after != undefined and maxPage < pages
          @$el.append(@_createLink pagerTemplate.after, @css.disabled)

      # Create last and next links
      state = if page == pages then @css.disabled else ''
      @$el.append(@_createLink pagerTemplate.next, state) if pagerTemplate.next != undefined
      @$el.append(@_createLink pagerTemplate.last, state) if pagerTemplate.last != undefined

      # Rebind the UI elements
      @bindUIElements()

  ###
  Override the default behavior of rendering a template

  @param [Object] data The data to render (not used)
  ###
  renderTemplate: (data) ->
    @_getPageElements().container.clone()

  ###
  Action to go to the first page

  @param {Event} event The event for the page change
  ###
  firstPage: (event) ->
    @_changePage 1

  ###
  Action to go to the previous page

  @param {Event} event The event for the page change
  ###
  previousPage: (event) ->
    page = if @info[infoKeys.page] - 1 > 0 then @info[infoKeys.page] - 1 else @info[infoKeys.page]
    @_changePage page

  ###
  Action to go to a specific page

  @param {Event} event The event for the page change
  ###
  toPage: (event) ->
    @_changePage parseInt($(event.target).text())

  ###
  Action to go to the next page

  @param {Event} event The event for the page change
  ###
  nextPage: (event) ->
    page =
      if (@info[infoKeys.page] + 1) < @info[infoKeys.pages] then @info[infoKeys.page] + 1 else @info[infoKeys.pages]
    @_changePage page

  ###
  Action to go to the last page

  @param {Event} event The event for the page change
  ###
  lastPage: (event) ->
    @_changePage @info[infoKeys.pages]

  ###
  Do the effective action to change the page

  @param {int} toPage The page where to go
  ###
  _changePage: (toPage) ->
    # Update the collection only if required
    @update _.object( [infoKeys.page], [toPage] ) if toPage != @info[infoKeys.page]


  ###
  Retrieve the pager elements to use as template for each
  elements of the pager.

  The first time the function is called, the template structure
  is created from the template of this class and cached for the
  future calls.

  @return {Hash} The pager elements templates
  ###
  _getPageElements: ->
    if @pagerTemplate == undefined
      pager = $(@getTemplate()(null))

      # Find function that take care to lookup the root and the subelements
      find = (selector) ->
        pager.filter(selector).add(pager.find(selector))

      if pager.length > 1
        container = $('<div />')
      else
        container = pager.clone().empty()

      @pagerTemplate = {
        first: find('[data-page-type="first"]').clone()
        prev: find('[data-page-type="prev"]').clone()
        before: find('[data-page-type="more-before"]').clone()
        page: find('[data-page-type="page"]').clone()
        after: find('[data-page-type="more-after"]').clone()
        next: find('[data-page-type="next"]').clone()
        last: find('[data-page-type="last"]').clone()
        container: container
      }

    @pagerTemplate

  ###
  Create a link for one element in the pager.

  @param {jQueryObject} element The element that is used as a template to create the page link
  @param {String} type The type of link
  @param {String} state The state of the link
  @return {jQueryObject} Page link element
  ###
  _createLink: (element, state) ->
    element.clone().addClass(state)

  ###
  Create a link for one element in the pager.

  @param {jQueryObject} element The element that is used as a template to create the page link
  @param {String} state The state of the link
  @return {jQueryObject} Page link element
  ###
  _createPageLink: (element, pageNumber, state) ->
    pageElement = element.clone()

    # Check if the page element is also the page content
    if pageElement.attr("data-page-content") is undefined
      pageElementContent = pageElement.find("*[data-page-content]")
    else
      pageElementContent = pageElement

    # Retrieve the type of page representation
    pageType = pageElementContent.attr("data-page-content")

    # Use simple arabic page representation
    pageElementContent.text("#{pageNumber}") if pageType == "arabic"

    # Return the page element in the correct state
    pageElement.addClass(state).attr('data-page', "#{pageNumber}")