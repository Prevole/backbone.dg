describe "datagrid pagerview", ->
  vent = null

  beforeEach(->
    vent = new Backbone.Wreqr.EventAggregator()
  )

  describe "when creating a pager view without option", ->
    it "should be well constructed with defaults", ->
      view = new Dg.PagerView(vent: vent)

      expect(view.info).not.toBeNull()
      expect(view.info['page']).toEqual(0)
      expect(view.info['pages']).toEqual(0)
      expect(view.css.active).toEqual('active')
      expect(view.css.disabled).toEqual('disabled')
      expect(view.deltaPage).toEqual(2)

  describe "when creating a pager view with options", ->
    it "should be well constructed with these options", ->
      view = new Dg.PagerView(
        vent: vent
        css:
          active: 'a'
          disabled: 'd'
        deltaPage: 3
      )

      expect(view.info).not.toBeNull()
      expect(view.info['page']).toEqual(0)
      expect(view.info['pages']).toEqual(0)
      expect(view.css.active).toEqual('a')
      expect(view.css.disabled).toEqual('d')
      expect(view.deltaPage).toEqual(3)

  describe "_changePage must be called", ->
    view = null

    beforeEach ->
      view = new Dg.PagerView( vent: new Backbone.Wreqr.EventAggregator() )

      spyOn(view, '_changePage').and.callThrough()

    it "when firstPage is called", ->
      view.firstPage()
      expect(view._changePage).toHaveBeenCalled()

    it "when previousPage is called", ->
      view.previousPage()
      expect(view._changePage).toHaveBeenCalled()

    it "when toPage is called", ->
      view.toPage(
        target: $('<div>1</div>')
      )
      expect(view._changePage).toHaveBeenCalled()

    it "when nextPage is called", ->
      view.nextPage()
      expect(view._changePage).toHaveBeenCalled()

    it "when lastPage is called", ->
      view.lastPage()
      expect(view._changePage).toHaveBeenCalled()


  describe "page info state must be correct", ->
    view = null
    vent = null
    testInfo = null

    beforeEach ->
      vent = new Backbone.Wreqr.EventAggregator()

      vent.on 'update', (info) ->
        testInfo = info

      view = new Dg.PagerView( vent:  vent)

    it "when nextPage is called", ->
      view.info =
        page: 5
        pages: 10

      view.nextPage()
      expect(testInfo.page).toEqual(6)
      expect(testInfo.pages).toBeUndefined()

    it "when lastPage is called", ->
      view.info =
        page: 5
        pages: 10

      view.lastPage()
      expect(testInfo.page).toEqual(10)
      expect(testInfo.pages).toBeUndefined()

  describe "first page handling is working", ->
    view = null
    vent = null
    testInfo = null

    beforeEach ->
      vent = new Backbone.Wreqr.EventAggregator()

      vent.on 'update', (info) ->
        testInfo = info

      view = new Dg.PagerView( vent:  vent)

      spyOn(view, 'update').and.callThrough()

    it "when the current page is not the first", ->
      view.info =
        page: 5
        pages: 5

      view.firstPage()

      expect(view.update).toHaveBeenCalled()
      expect(testInfo.page).toEqual(1)
      expect(testInfo.pages).toBeUndefined()

    it "when the current page is already the first", ->
      view.info =
        page: 1
        pages: 5

      view.firstPage()

      expect(view.update).not.toHaveBeenCalled()

    it "when the current page is the last", ->
      view.info =
        page: 5
        pages: 5

      view.firstPage()

      expect(view.update).toHaveBeenCalled()
      expect(testInfo.page).toEqual(1)
      expect(testInfo.pages).toBeUndefined()

  describe "previous page handling is working", ->
    view = null
    vent = null
    testInfo = null

    beforeEach ->
      vent = new Backbone.Wreqr.EventAggregator()

      vent.on 'update', (info) ->
        testInfo = info

      view = new Dg.PagerView( vent:  vent)

      spyOn(view, 'update').and.callThrough()

    it "when the current page is not the first", ->
      view.info =
        page: 3
        pages: 5

      view.previousPage()

      expect(view.update).toHaveBeenCalled()
      expect(testInfo.page).toEqual(2)
      expect(testInfo.pages).toBeUndefined()

    it "when the current page is already the first", ->
      view.info =
        page: 1
        pages: 5

      view.previousPage()

      expect(view.update).not.toHaveBeenCalled()

    it "when the current page is the last", ->
      view.info =
        page: 5
        pages: 5

      view.previousPage()

      expect(view.update).toHaveBeenCalled()
      expect(testInfo.page).toEqual(4)
      expect(testInfo.pages).toBeUndefined()

  describe "specific page handling is working", ->
    view = null
    vent = null
    testInfo = null

    beforeEach ->
      vent = new Backbone.Wreqr.EventAggregator()

      vent.on 'update', (info) ->
        testInfo = info

      view = new Dg.PagerView( vent:  vent)

      spyOn(view, 'update').and.callThrough()

    it "when the current page is not the first or the last", ->
      view.info =
        page: 3
        pages: 5

      view.toPage(target: $('<div>2</div>'))

      expect(view.update).toHaveBeenCalled()
      expect(testInfo.page).toEqual(2)
      expect(testInfo.pages).toBeUndefined()

    it "when the current page is the first", ->
      view.info =
        page: 1
        pages: 5

      view.toPage(target: $('<div>2</div>'))

      expect(view.update).toHaveBeenCalled()
      expect(testInfo.page).toEqual(2)
      expect(testInfo.pages).toBeUndefined()

    it "when the current page is the last", ->
      view.info =
        page: 5
        pages: 5

      view.toPage(target: $('<div>2</div>'))

      expect(view.update).toHaveBeenCalled()
      expect(testInfo.page).toEqual(2)
      expect(testInfo.pages).toBeUndefined()

    it "when the current page is already the page to go", ->
      view.info =
        page: 2
        pages: 5

      view.toPage(target: $('<div>2</div>'))

      expect(view.update).not.toHaveBeenCalled()

  describe "next page handling is working", ->
    view = null
    vent = null
    testInfo = null

    beforeEach ->
      vent = new Backbone.Wreqr.EventAggregator()

      vent.on 'update', (info) ->
        testInfo = info

      view = new Dg.PagerView( vent:  vent)

      spyOn(view, 'update').and.callThrough()

    it "when the current page is not the last", ->
      view.info =
        page: 3
        pages: 5

      view.nextPage()

      expect(view.update).toHaveBeenCalled()
      expect(testInfo.page).toEqual(4)
      expect(testInfo.pages).toBeUndefined()

    it "when the current page is already the last", ->
      view.info =
        page: 5
        pages: 5

      view.nextPage()

      expect(view.update).not.toHaveBeenCalled()

    it "when the current page is the first", ->
      view.info =
        page: 1
        pages: 5

      view.nextPage()

      expect(view.update).toHaveBeenCalled()
      expect(testInfo.page).toEqual(2)
      expect(testInfo.pages).toBeUndefined()

  describe "last page handling is working", ->
    view = null
    vent = null
    testInfo = null

    beforeEach ->
      vent = new Backbone.Wreqr.EventAggregator()

      vent.on 'update', (info) ->
        testInfo = info

      view = new Dg.PagerView( vent:  vent)

      spyOn(view, 'update').and.callThrough()

    it "when the current page is not the last", ->
      view.info =
        page: 3
        pages: 5

      view.lastPage()

      expect(view.update).toHaveBeenCalled()
      expect(testInfo.page).toEqual(5)
      expect(testInfo.pages).toBeUndefined()

    it "when the current page is already the last", ->
      view.info =
        page: 5
        pages: 5

      view.lastPage()

      expect(view.update).not.toHaveBeenCalled()

    it "when the current page is the first", ->
      view.info =
        page: 1
        pages: 5

      view.lastPage()

      expect(view.update).toHaveBeenCalled()
      expect(testInfo.page).toEqual(5)
      expect(testInfo.pages).toBeUndefined()

  describe "with a real use case of navigation", ->
    view = null
    vent = null

    vent = new Backbone.Wreqr.EventAggregator()

    view = new Dg.PagerView( vent:  vent)

    view.info =
      page: 1
      pages: 10

    vent.on 'update', (info) ->
      view.info.page = info.page

    beforeEach ->
      spyOn(view, 'update').and.callThrough()

    it "should start on page one", ->
      expect(view.update).not.toHaveBeenCalled()
      expect(view.info.page).toEqual(1)

    it "should be the page two when next page is clicked", ->
      view.nextPage()

      expect(view.update).toHaveBeenCalled()
      expect(view.info.page).toEqual(2)

    it "should be the page three when next page is clicked again", ->
      view.nextPage()

      expect(view.update).toHaveBeenCalled()
      expect(view.info.page).toEqual(3)

    it "should be the last page when last page is clicked", ->
      view.lastPage()

      expect(view.update).toHaveBeenCalled()
      expect(view.info.page).toEqual(10)

    it "should be the page nine when previous page is clicked", ->
      view.previousPage()

      expect(view.update).toHaveBeenCalled()
      expect(view.info.page).toEqual(9)

    it "should be the page eight when previous page is clicked again", ->
      view.previousPage()

      expect(view.update).toHaveBeenCalled()
      expect(view.info.page).toEqual(8)

    it "should be the first page when first page is clicked", ->
      view.firstPage()

      expect(view.update).toHaveBeenCalled()
      expect(view.info.page).toEqual(1)

    it "should be the page five when page five is clicked directly", ->
      view.toPage(target: $('<div>5</div>'))

      expect(view.update).toHaveBeenCalled()
      expect(view.info.page).toEqual(5)

    it "should be the page two when page two is clicked directly", ->
      view.toPage(target: $('<div>2</div>'))

      expect(view.update).toHaveBeenCalled()
      expect(view.info.page).toEqual(2)

  describe "a template should be interpreted correctly when right elements are available", ->
    flatTemplate = ->
      '<a data-page-type="first" />' +
      '<a data-page-type="prev" />' +
      '<a data-page-type="more-before" />' +
      '<a data-page-type="page" />' +
      '<a data-page-type="more-after" />' +
      '<a data-page-type="next" />' +
      '<a data-page-type="last" />'

    nonFlatTemplate = ->
      '<div class="container">' +
        '<ul>' +
          '<li><a data-page-type="first" /></li>' +
          '<li><a data-page-type="prev" /></li>' +
          '<li><a data-page-type="more-before" /></li>' +
          '<li><a data-page-type="page" /></li>' +
          '<li><a data-page-type="more-after" /></li>' +
          '<li><a data-page-type="next" /></li>' +
          '<li><a data-page-type="last" /></li>' +
        '</ul>' +
      '</div>'

    assertTemplateElementToBeValid = (element, type) ->
      expect(element).not.toBeNull()
      expect(element).toHaveLength(1)
      expect(element).toEqual('a')
      expect(element.attr('data-page-type')).toBe(type)

    view = null
    vent = null

    beforeEach ->
      vent = new Backbone.Wreqr.EventAggregator()

      view = new Dg.PagerView( vent:  vent)

    it "elements should be cached", ->
      spyOn(view, "getTemplate").and.callFake ->
        flatTemplate

      elements1 = view._getPageElements()
      expect(view.getTemplate).toHaveBeenCalled()
      expect(elements1).not.toBeNull()

      view.getTemplate.calls.reset()

      elements2 = view._getPageElements()
      expect(view.getTemplate).not.toHaveBeenCalled()
      expect(elements2).not.toBeNull()
      expect(elements2).toEqual elements1


    it "should find elements when they are at the root level", ->
      spyOn(view, "getTemplate").and.callFake ->
        flatTemplate

        elements = view._getPageElements()
        expect(view.getTemplate).toHaveBeenCalled()
        expect(elements).not.toBeNull()

        assertTemplateElementToBeValid elements.first, 'first'
        assertTemplateElementToBeValid elements.prev, 'first'
        assertTemplateElementToBeValid elements.before, 'more-before'
        assertTemplateElementToBeValid elements.page, 'page'
        assertTemplateElementToBeValid elements.after, 'more-after'
        assertTemplateElementToBeValid elements.next, 'next'
        assertTemplateElementToBeValid elements.last, 'last'

    it "should find elements when they are not at the root level", ->
      spyOn(view, "getTemplate").and.callFake ->
        nonFlatTemplate

        elements = view._getPageElements()
        expect(view.getTemplate).toHaveBeenCalled()
        expect(elements).not.toBeNull()

        assertTemplateElementToBeValid elements.first, 'first'
        assertTemplateElementToBeValid elements.prev, 'first'
        assertTemplateElementToBeValid elements.before, 'more-before'
        assertTemplateElementToBeValid elements.page, 'page'
        assertTemplateElementToBeValid elements.after, 'more-after'
        assertTemplateElementToBeValid elements.next, 'next'
        assertTemplateElementToBeValid elements.last, 'last'

    it "should have a default container when none is provided", ->
      spyOn(view, "getTemplate").and.callFake ->
        flatTemplate

      elements = view._getPageElements()

      expect(elements.container).not.toBeNull()
      expect(elements.container).toEqual('div')
      expect(elements.container).toBeEmpty()

    it "should have the provided container when one is provided", ->
      spyOn(view, "getTemplate").and.callFake ->
        nonFlatTemplate

      elements = view._getPageElements()

      expect(elements.container).not.toBeNull()
      expect(elements.container).toEqual('div')
      expect(elements.container).toHaveClass('container')
      expect(elements.container).toBeEmpty()

  describe "doing the rendering should be correct", ->
    view = null
    vent = null

    beforeEach ->
      vent = new Backbone.Wreqr.EventAggregator()
      view = new Dg.PagerView( vent:  vent )

      spyOn(view, '_getPageElements').and.callFake( ->
        {
          container: $('<div class="container" />')
        }
      )

    it "the getPageElements should be called when renderTemplate is called and the right container should be returned", ->
      container = $(view.renderTemplate(null))

      expect(view._getPageElements).toHaveBeenCalled()
      expect(container).not.toBeNull()
      expect(container).toEqual('div')
      expect(container).toHaveClass('container')

    it "the getPageElements should be called and the rendering should use the container", ->
      view.render()

      expect(view._getPageElements).toHaveBeenCalled()
      expect(view.$el).not.toBeNull()
      expect(view.$el).toEqual('div')
      expect(view.$el).toHaveClass('container')


  describe "calling the change page method", ->
    vent = null
    view = null

    beforeEach ->
      vent = new Backbone.Wreqr.EventAggregator()
      view = new Dg.PagerView( vent:  vent )

      view.info =
        page: 1
        pages: 10

      spyOn(view, 'update').and.callThrough()
      spyOn(vent, 'trigger').and.callThrough()

    it "should raise an event when page is difference from the current one", ->
      view._changePage 2
      expect(view.update).toHaveBeenCalled()
      expect(vent.trigger).toHaveBeenCalled()

    it "should not raise an event when page is the same as the current one", ->
      view._changePage 1
      expect(view.update).not.toHaveBeenCalled()
      expect(vent.trigger).not.toHaveBeenCalled()

  describe "the link creation must be correct", ->
    flatTemplate = ->
      '<a data-page-type="first" />' +
      '<a data-page-type="prev" />' +
      '<a data-page-type="more-before" />' +
      '<a data-page-type="page" data-page-content="arabic" />' +
      '<a data-page-type="more-after" />' +
      '<a data-page-type="next" />' +
      '<a data-page-type="last" />'

    vent = null
    view = null

    beforeEach ->
      vent = new Backbone.Wreqr.EventAggregator()
      view = new Dg.PagerView( vent:  vent )

      spyOn(view, 'getTemplate').and.callFake ->
        flatTemplate

    for control in ['first', 'prev', 'before', 'after', 'next', 'last']
      for state in ['active', 'disabled']
        it "when #{control} link is created with #{state} state", ->
          elements = view._getPageElements()

          pageElement = view._createLink elements[control], state

          expect(pageElement).not.toBeNull()
          expect(pageElement).not.toEqual(elements[control])
          expect(pageElement).toEqual('a')
          expect(pageElement.attr('data-page-type')).toBe(control)
          expect(pageElement).toHaveClass(state)

    for page in [1, 2, 3]
      for state in ['active', 'disabled']
        it "when page #{page} link is created with #{state} state", ->
          elements = view._getPageElements()

          pageElement = view._createPageLink elements.page, page, state

          expect(pageElement).not.toBeNull()
          expect(pageElement).not.toEqual(elements.page)
          expect(pageElement).toEqual('a')
          expect(pageElement.attr('data-page-type')).toBe('page')
          expect(pageElement).toHaveClass(state)
          expect(pageElement).toHaveText("#{page}")
          expect(pageElement).toHaveAttr('data-page', "#{page}")

  describe "refreshing the ui should produce the correct pager", ->
    vent = null
    view = null

    assertControlPresent = (view, type, content) ->
      control = view.$el.find("[data-page-type=#{type}]")
      expect(control).not.toBeNull()
      expect(control).toHaveLength(1)
      expect(control).toEqual('a')
      expect(control).toContainText(content)

    assertControlPresentAndDisabled = (view, type, content) ->
      control = view.$el.find("[data-page-type=#{type}]")
      expect(control).not.toBeNull()
      expect(control).toHaveLength(1)
      expect(control).toEqual('a')
      expect(control).toContainText(content)
      expect(control).toHaveClass('disabled')

    assertControlAbsent = (view, type) ->
      control = view.$el.find("[data-page-type=#{type}]")
      expect(control).not.toBeNull()
      expect(control).toHaveLength(0)

    assertPageControlPresent = (view, page) ->
      control = view.$el.find("[data-page-type=page][data-page=#{page}]")
      expect(control).not.toBeNull()
      expect(control).toHaveLength(1)
      expect(control).toEqual('a')
      expect(control).toContainText(page)

    assertPageControlPresentAndActive = (view, page) ->
      control = view.$el.find("[data-page-type=page][data-page=#{page}]")
      expect(control).not.toBeNull()
      expect(control).toHaveLength(1)
      expect(control).toEqual('a')
      expect(control).toContainText(page)
      expect(control).toHaveClass('active')

    assertPageControlAbsent = (view, page) ->
      control = view.$el.find("[data-page-type=page][data-page=#{page}]")
      expect(control).not.toBeNull()
      expect(control).toHaveLength(0)

    assertFillerPresent = (view, type) ->
      control = view.$el.find("[data-page-type=#{type}]")
      expect(control).not.toBeNull()
      expect(control).toHaveLength(1)
      expect(control).toEqual('a')
      expect(control).toContainText('...')
      expect(control).toHaveClass('disabled')

    beforeEach ->
      vent = new Backbone.Wreqr.EventAggregator()
      view = new Dg.PagerView( vent:  vent )

    it "by default all controls must be there when there are 10 pages and the current page is 5", ->
      spyOn(view, 'getTemplate').and.callFake ->
        ->
          '<a data-page-type="first">first</a>' +
          '<a data-page-type="prev">prev</a>' +
          '<a data-page-type="more-before">...</a>' +
          '<a data-page-type="page" data-page-content="arabic" />' +
          '<a data-page-type="more-after">...</a>' +
          '<a data-page-type="next">next</a>' +
          '<a data-page-type="last">last</a>'

      view.refreshView
        page: 5
        pages: 10

      assertControlPresent view, 'first', 'first'
      assertControlPresent view, 'prev', 'prev'
      assertFillerPresent view, 'more-before'
      assertPageControlAbsent view, "1"
      assertPageControlAbsent view, "2"
      assertPageControlPresent view, "3"
      assertPageControlPresent view, "4"
      assertPageControlPresentAndActive view, "5"
      assertPageControlPresent view, "6"
      assertPageControlPresent view, "7"
      assertPageControlAbsent view, "8"
      assertPageControlAbsent view, "9"
      assertPageControlAbsent view, "10"
      assertFillerPresent view, 'more-after'
      assertControlPresent view, 'next', 'next'
      assertControlPresent view, 'last', 'last'

    it "only pages control must be there for 10 pages and the current page is 5 when there is no other control setup", ->
      spyOn(view, 'getTemplate').and.callFake ->
        ->
          '<a data-page-type="page" data-page-content="arabic" />'

      view.refreshView
        page: 5
        pages: 10

      assertControlAbsent view, 'first', 'first'
      assertControlAbsent view, 'prev', 'prev'
      assertControlAbsent view, 'more-before'
      assertPageControlAbsent view, "1"
      assertPageControlAbsent view, "2"
      assertPageControlPresent view, "3"
      assertPageControlPresent view, "4"
      assertPageControlPresentAndActive view, "5"
      assertPageControlPresent view, "6"
      assertPageControlPresent view, "7"
      assertPageControlAbsent view, "8"
      assertPageControlAbsent view, "9"
      assertPageControlAbsent view, "10"
      assertControlAbsent view, 'more-after'
      assertControlAbsent view, 'next', 'next'
      assertControlAbsent view, 'last', 'last'

    it "first/previous control must be disabled and filler before absent when there are 10 pages and the current page is 1", ->
      spyOn(view, 'getTemplate').and.callFake ->
        ->
          '<a data-page-type="first">first</a>' +
          '<a data-page-type="prev">prev</a>' +
          '<a data-page-type="more-before">...</a>' +
          '<a data-page-type="page" data-page-content="arabic" />' +
          '<a data-page-type="more-after">...</a>' +
          '<a data-page-type="next">next</a>' +
          '<a data-page-type="last">last</a>'

      view.refreshView
        page: 1
        pages: 10

      assertControlPresentAndDisabled view, 'first', 'first'
      assertControlPresentAndDisabled view, 'prev', 'prev'
      assertControlAbsent view, 'more-before'
      assertPageControlPresentAndActive view, "1"
      assertPageControlPresent view, "2"
      assertPageControlPresent view, "3"
      assertPageControlAbsent view, "4"
      assertPageControlAbsent view, "5"
      assertPageControlAbsent view, "6"
      assertPageControlAbsent view, "7"
      assertPageControlAbsent view, "8"
      assertPageControlAbsent view, "9"
      assertPageControlAbsent view, "10"
      assertFillerPresent view, 'more-after'
      assertControlPresent view, 'next', 'next'
      assertControlPresent view, 'last', 'last'


    it "last/next control must be disabled and filler after absent when there are 10 pages and the current page is 10", ->
      spyOn(view, 'getTemplate').and.callFake ->
        ->
          '<a data-page-type="first">first</a>' +
          '<a data-page-type="prev">prev</a>' +
          '<a data-page-type="more-before">...</a>' +
          '<a data-page-type="page" data-page-content="arabic" />' +
          '<a data-page-type="more-after">...</a>' +
          '<a data-page-type="next">next</a>' +
          '<a data-page-type="last">last</a>'

      view.refreshView
        page: 10
        pages: 10

      assertControlPresent view, 'first', 'first'
      assertControlPresent view, 'prev', 'prev'
      assertFillerPresent view, 'more-before'
      assertPageControlAbsent view, "1"
      assertPageControlAbsent view, "2"
      assertPageControlAbsent view, "3"
      assertPageControlAbsent view, "4"
      assertPageControlAbsent view, "5"
      assertPageControlAbsent view, "6"
      assertPageControlAbsent view, "7"
      assertPageControlPresent view, "8"
      assertPageControlPresent view, "9"
      assertPageControlPresentAndActive view, "10"
      assertControlAbsent view, 'more-after'
      assertControlPresentAndDisabled view, 'next', 'next'
      assertControlPresentAndDisabled view, 'last', 'last'

    it "no filler must be present when there are 5 pages and page 3 is the current page", ->
      spyOn(view, 'getTemplate').and.callFake ->
        ->
          '<a data-page-type="first">first</a>' +
          '<a data-page-type="prev">prev</a>' +
          '<a data-page-type="more-before">...</a>' +
          '<a data-page-type="page" data-page-content="arabic" />' +
          '<a data-page-type="more-after">...</a>' +
          '<a data-page-type="next">next</a>' +
          '<a data-page-type="last">last</a>'

      view.refreshView
        page: 3
        pages: 5

      assertControlPresent view, 'first', 'first'
      assertControlPresent view, 'prev', 'prev'
      assertControlAbsent view, 'more-before'
      assertPageControlPresent view, "1"
      assertPageControlPresent view, "2"
      assertPageControlPresentAndActive view, "3"
      assertPageControlPresent view, "4"
      assertPageControlPresent view, "5"
      assertControlAbsent view, 'more-after'
      assertControlPresent view, 'next', 'next'
      assertControlPresent view, 'last', 'last'


    it "no filler must be present when no page control is present", ->
      spyOn(view, 'getTemplate').and.callFake ->
        ->
          '<a data-page-type="first">first</a>' +
          '<a data-page-type="prev">prev</a>' +
          '<a data-page-type="more-before">...</a>' +
          '<a data-page-type="more-after">...</a>' +
          '<a data-page-type="next">next</a>' +
          '<a data-page-type="last">last</a>'

      view.refreshView
        page: 3
        pages: 5

      assertControlPresent view, 'first', 'first'
      assertControlPresent view, 'prev', 'prev'
      assertControlAbsent view, 'more-before'
      assertPageControlAbsent view, "1"
      assertPageControlAbsent view, "2"
      assertPageControlAbsent view, "3"
      assertPageControlAbsent view, "4"
      assertPageControlAbsent view, "5"
      assertControlAbsent view, 'more-after'
      assertControlPresent view, 'next', 'next'
      assertControlPresent view, 'last', 'last'

    it "pager must be empty when the number of page to display is 1", ->
      spyOn(view, 'getTemplate').and.callFake ->
        ->
          '<a data-page-type="first">first</a>' +
          '<a data-page-type="prev">prev</a>' +
          '<a data-page-type="more-before">...</a>' +
          '<a data-page-type="more-after">...</a>' +
          '<a data-page-type="next">next</a>' +
          '<a data-page-type="last">last</a>'

      view.refreshView
        page: 1
        pages: 1

      expect(view.$el).not.toBeNull()
      expect(view.$el).toHaveLength(1)