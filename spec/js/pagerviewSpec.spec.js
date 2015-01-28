describe("datagrid pagerview", function() {
  var vent;
  vent = null;
  beforeEach(function() {
    return vent = new Backbone.Wreqr.EventAggregator();
  });
  describe("when creating a pager view without option", function() {
    return it("should be well constructed with defaults", function() {
      var view;
      view = new Dg.PagerView({
        vent: vent
      });
      expect(view.info).not.toBeNull();
      expect(view.info['page']).toEqual(0);
      expect(view.info['pages']).toEqual(0);
      expect(view.css.active).toEqual('active');
      expect(view.css.disabled).toEqual('disabled');
      return expect(view.deltaPage).toEqual(2);
    });
  });
  describe("when creating a pager view with options", function() {
    return it("should be well constructed with these options", function() {
      var view;
      view = new Dg.PagerView({
        vent: vent,
        css: {
          active: 'a',
          disabled: 'd'
        },
        deltaPage: 3
      });
      expect(view.info).not.toBeNull();
      expect(view.info['page']).toEqual(0);
      expect(view.info['pages']).toEqual(0);
      expect(view.css.active).toEqual('a');
      expect(view.css.disabled).toEqual('d');
      return expect(view.deltaPage).toEqual(3);
    });
  });
  describe("_changePage must be called", function() {
    var view;
    view = null;
    beforeEach(function() {
      view = new Dg.PagerView({
        vent: new Backbone.Wreqr.EventAggregator()
      });
      return spyOn(view, '_changePage').and.callThrough();
    });
    it("when firstPage is called", function() {
      view.firstPage();
      return expect(view._changePage).toHaveBeenCalled();
    });
    it("when previousPage is called", function() {
      view.previousPage();
      return expect(view._changePage).toHaveBeenCalled();
    });
    it("when toPage is called", function() {
      view.toPage({
        target: $('<div>1</div>')
      });
      return expect(view._changePage).toHaveBeenCalled();
    });
    it("when nextPage is called", function() {
      view.nextPage();
      return expect(view._changePage).toHaveBeenCalled();
    });
    return it("when lastPage is called", function() {
      view.lastPage();
      return expect(view._changePage).toHaveBeenCalled();
    });
  });
  describe("page info state must be correct", function() {
    var testInfo, view;
    view = null;
    vent = null;
    testInfo = null;
    beforeEach(function() {
      vent = new Backbone.Wreqr.EventAggregator();
      vent.on('update', function(info) {
        return testInfo = info;
      });
      return view = new Dg.PagerView({
        vent: vent
      });
    });
    it("when nextPage is called", function() {
      view.info = {
        page: 5,
        pages: 10
      };
      view.nextPage();
      expect(testInfo.page).toEqual(6);
      return expect(testInfo.pages).toBeUndefined();
    });
    return it("when lastPage is called", function() {
      view.info = {
        page: 5,
        pages: 10
      };
      view.lastPage();
      expect(testInfo.page).toEqual(10);
      return expect(testInfo.pages).toBeUndefined();
    });
  });
  describe("first page handling is working", function() {
    var testInfo, view;
    view = null;
    vent = null;
    testInfo = null;
    beforeEach(function() {
      vent = new Backbone.Wreqr.EventAggregator();
      vent.on('update', function(info) {
        return testInfo = info;
      });
      view = new Dg.PagerView({
        vent: vent
      });
      return spyOn(view, 'update').and.callThrough();
    });
    it("when the current page is not the first", function() {
      view.info = {
        page: 5,
        pages: 5
      };
      view.firstPage();
      expect(view.update).toHaveBeenCalled();
      expect(testInfo.page).toEqual(1);
      return expect(testInfo.pages).toBeUndefined();
    });
    it("when the current page is already the first", function() {
      view.info = {
        page: 1,
        pages: 5
      };
      view.firstPage();
      return expect(view.update).not.toHaveBeenCalled();
    });
    return it("when the current page is the last", function() {
      view.info = {
        page: 5,
        pages: 5
      };
      view.firstPage();
      expect(view.update).toHaveBeenCalled();
      expect(testInfo.page).toEqual(1);
      return expect(testInfo.pages).toBeUndefined();
    });
  });
  describe("previous page handling is working", function() {
    var testInfo, view;
    view = null;
    vent = null;
    testInfo = null;
    beforeEach(function() {
      vent = new Backbone.Wreqr.EventAggregator();
      vent.on('update', function(info) {
        return testInfo = info;
      });
      view = new Dg.PagerView({
        vent: vent
      });
      return spyOn(view, 'update').and.callThrough();
    });
    it("when the current page is not the first", function() {
      view.info = {
        page: 3,
        pages: 5
      };
      view.previousPage();
      expect(view.update).toHaveBeenCalled();
      expect(testInfo.page).toEqual(2);
      return expect(testInfo.pages).toBeUndefined();
    });
    it("when the current page is already the first", function() {
      view.info = {
        page: 1,
        pages: 5
      };
      view.previousPage();
      return expect(view.update).not.toHaveBeenCalled();
    });
    return it("when the current page is the last", function() {
      view.info = {
        page: 5,
        pages: 5
      };
      view.previousPage();
      expect(view.update).toHaveBeenCalled();
      expect(testInfo.page).toEqual(4);
      return expect(testInfo.pages).toBeUndefined();
    });
  });
  describe("specific page handling is working", function() {
    var testInfo, view;
    view = null;
    vent = null;
    testInfo = null;
    beforeEach(function() {
      vent = new Backbone.Wreqr.EventAggregator();
      vent.on('update', function(info) {
        return testInfo = info;
      });
      view = new Dg.PagerView({
        vent: vent
      });
      return spyOn(view, 'update').and.callThrough();
    });
    it("when the current page is not the first or the last", function() {
      view.info = {
        page: 3,
        pages: 5
      };
      view.toPage({
        target: $('<div>2</div>')
      });
      expect(view.update).toHaveBeenCalled();
      expect(testInfo.page).toEqual(2);
      return expect(testInfo.pages).toBeUndefined();
    });
    it("when the current page is the first", function() {
      view.info = {
        page: 1,
        pages: 5
      };
      view.toPage({
        target: $('<div>2</div>')
      });
      expect(view.update).toHaveBeenCalled();
      expect(testInfo.page).toEqual(2);
      return expect(testInfo.pages).toBeUndefined();
    });
    it("when the current page is the last", function() {
      view.info = {
        page: 5,
        pages: 5
      };
      view.toPage({
        target: $('<div>2</div>')
      });
      expect(view.update).toHaveBeenCalled();
      expect(testInfo.page).toEqual(2);
      return expect(testInfo.pages).toBeUndefined();
    });
    return it("when the current page is already the page to go", function() {
      view.info = {
        page: 2,
        pages: 5
      };
      view.toPage({
        target: $('<div>2</div>')
      });
      return expect(view.update).not.toHaveBeenCalled();
    });
  });
  describe("next page handling is working", function() {
    var testInfo, view;
    view = null;
    vent = null;
    testInfo = null;
    beforeEach(function() {
      vent = new Backbone.Wreqr.EventAggregator();
      vent.on('update', function(info) {
        return testInfo = info;
      });
      view = new Dg.PagerView({
        vent: vent
      });
      return spyOn(view, 'update').and.callThrough();
    });
    it("when the current page is not the last", function() {
      view.info = {
        page: 3,
        pages: 5
      };
      view.nextPage();
      expect(view.update).toHaveBeenCalled();
      expect(testInfo.page).toEqual(4);
      return expect(testInfo.pages).toBeUndefined();
    });
    it("when the current page is already the last", function() {
      view.info = {
        page: 5,
        pages: 5
      };
      view.nextPage();
      return expect(view.update).not.toHaveBeenCalled();
    });
    return it("when the current page is the first", function() {
      view.info = {
        page: 1,
        pages: 5
      };
      view.nextPage();
      expect(view.update).toHaveBeenCalled();
      expect(testInfo.page).toEqual(2);
      return expect(testInfo.pages).toBeUndefined();
    });
  });
  describe("last page handling is working", function() {
    var testInfo, view;
    view = null;
    vent = null;
    testInfo = null;
    beforeEach(function() {
      vent = new Backbone.Wreqr.EventAggregator();
      vent.on('update', function(info) {
        return testInfo = info;
      });
      view = new Dg.PagerView({
        vent: vent
      });
      return spyOn(view, 'update').and.callThrough();
    });
    it("when the current page is not the last", function() {
      view.info = {
        page: 3,
        pages: 5
      };
      view.lastPage();
      expect(view.update).toHaveBeenCalled();
      expect(testInfo.page).toEqual(5);
      return expect(testInfo.pages).toBeUndefined();
    });
    it("when the current page is already the last", function() {
      view.info = {
        page: 5,
        pages: 5
      };
      view.lastPage();
      return expect(view.update).not.toHaveBeenCalled();
    });
    return it("when the current page is the first", function() {
      view.info = {
        page: 1,
        pages: 5
      };
      view.lastPage();
      expect(view.update).toHaveBeenCalled();
      expect(testInfo.page).toEqual(5);
      return expect(testInfo.pages).toBeUndefined();
    });
  });
  describe("with a real use case of navigation", function() {
    var view;
    view = null;
    vent = null;
    vent = new Backbone.Wreqr.EventAggregator();
    view = new Dg.PagerView({
      vent: vent
    });
    view.info = {
      page: 1,
      pages: 10
    };
    vent.on('update', function(info) {
      return view.info.page = info.page;
    });
    beforeEach(function() {
      return spyOn(view, 'update').and.callThrough();
    });
    it("should start on page one", function() {
      expect(view.update).not.toHaveBeenCalled();
      return expect(view.info.page).toEqual(1);
    });
    it("should be the page two when next page is clicked", function() {
      view.nextPage();
      expect(view.update).toHaveBeenCalled();
      return expect(view.info.page).toEqual(2);
    });
    it("should be the page three when next page is clicked again", function() {
      view.nextPage();
      expect(view.update).toHaveBeenCalled();
      return expect(view.info.page).toEqual(3);
    });
    it("should be the last page when last page is clicked", function() {
      view.lastPage();
      expect(view.update).toHaveBeenCalled();
      return expect(view.info.page).toEqual(10);
    });
    it("should be the page nine when previous page is clicked", function() {
      view.previousPage();
      expect(view.update).toHaveBeenCalled();
      return expect(view.info.page).toEqual(9);
    });
    it("should be the page eight when previous page is clicked again", function() {
      view.previousPage();
      expect(view.update).toHaveBeenCalled();
      return expect(view.info.page).toEqual(8);
    });
    it("should be the first page when first page is clicked", function() {
      view.firstPage();
      expect(view.update).toHaveBeenCalled();
      return expect(view.info.page).toEqual(1);
    });
    it("should be the page five when page five is clicked directly", function() {
      view.toPage({
        target: $('<div>5</div>')
      });
      expect(view.update).toHaveBeenCalled();
      return expect(view.info.page).toEqual(5);
    });
    return it("should be the page two when page two is clicked directly", function() {
      view.toPage({
        target: $('<div>2</div>')
      });
      expect(view.update).toHaveBeenCalled();
      return expect(view.info.page).toEqual(2);
    });
  });
  describe("a template should be interpreted correctly when right elements are available", function() {
    var assertTemplateElementToBeValid, flatTemplate, nonFlatTemplate, view;
    flatTemplate = function() {
      return '<a data-page-type="first" />' + '<a data-page-type="prev" />' + '<a data-page-type="more-before" />' + '<a data-page-type="page" />' + '<a data-page-type="more-after" />' + '<a data-page-type="next" />' + '<a data-page-type="last" />';
    };
    nonFlatTemplate = function() {
      return '<div class="container">' + '<ul>' + '<li><a data-page-type="first" /></li>' + '<li><a data-page-type="prev" /></li>' + '<li><a data-page-type="more-before" /></li>' + '<li><a data-page-type="page" /></li>' + '<li><a data-page-type="more-after" /></li>' + '<li><a data-page-type="next" /></li>' + '<li><a data-page-type="last" /></li>' + '</ul>' + '</div>';
    };
    assertTemplateElementToBeValid = function(element, type) {
      expect(element).not.toBeNull();
      expect(element).toHaveLength(1);
      expect(element).toEqual('a');
      return expect(element.attr('data-page-type')).toBe(type);
    };
    view = null;
    vent = null;
    beforeEach(function() {
      vent = new Backbone.Wreqr.EventAggregator();
      return view = new Dg.PagerView({
        vent: vent
      });
    });
    it("elements should be cached", function() {
      var elements1, elements2;
      spyOn(view, "getTemplate").and.callFake(function() {
        return flatTemplate;
      });
      elements1 = view._getPageElements();
      expect(view.getTemplate).toHaveBeenCalled();
      expect(elements1).not.toBeNull();
      view.getTemplate.calls.reset();
      elements2 = view._getPageElements();
      expect(view.getTemplate).not.toHaveBeenCalled();
      expect(elements2).not.toBeNull();
      return expect(elements2).toEqual(elements1);
    });
    it("should find elements when they are at the root level", function() {
      return spyOn(view, "getTemplate").and.callFake(function() {
        flatTemplate;
        var elements;
        elements = view._getPageElements();
        expect(view.getTemplate).toHaveBeenCalled();
        expect(elements).not.toBeNull();
        assertTemplateElementToBeValid(elements.first, 'first');
        assertTemplateElementToBeValid(elements.prev, 'first');
        assertTemplateElementToBeValid(elements.before, 'more-before');
        assertTemplateElementToBeValid(elements.page, 'page');
        assertTemplateElementToBeValid(elements.after, 'more-after');
        assertTemplateElementToBeValid(elements.next, 'next');
        return assertTemplateElementToBeValid(elements.last, 'last');
      });
    });
    it("should find elements when they are not at the root level", function() {
      return spyOn(view, "getTemplate").and.callFake(function() {
        nonFlatTemplate;
        var elements;
        elements = view._getPageElements();
        expect(view.getTemplate).toHaveBeenCalled();
        expect(elements).not.toBeNull();
        assertTemplateElementToBeValid(elements.first, 'first');
        assertTemplateElementToBeValid(elements.prev, 'first');
        assertTemplateElementToBeValid(elements.before, 'more-before');
        assertTemplateElementToBeValid(elements.page, 'page');
        assertTemplateElementToBeValid(elements.after, 'more-after');
        assertTemplateElementToBeValid(elements.next, 'next');
        return assertTemplateElementToBeValid(elements.last, 'last');
      });
    });
    it("should have a default container when none is provided", function() {
      var elements;
      spyOn(view, "getTemplate").and.callFake(function() {
        return flatTemplate;
      });
      elements = view._getPageElements();
      expect(elements.container).not.toBeNull();
      expect(elements.container).toEqual('div');
      return expect(elements.container).toBeEmpty();
    });
    return it("should have the provided container when one is provided", function() {
      var elements;
      spyOn(view, "getTemplate").and.callFake(function() {
        return nonFlatTemplate;
      });
      elements = view._getPageElements();
      expect(elements.container).not.toBeNull();
      expect(elements.container).toEqual('div');
      expect(elements.container).toHaveClass('container');
      return expect(elements.container).toBeEmpty();
    });
  });
  describe("doing the rendering should be correct", function() {
    var view;
    view = null;
    vent = null;
    beforeEach(function() {
      vent = new Backbone.Wreqr.EventAggregator();
      view = new Dg.PagerView({
        vent: vent
      });
      return spyOn(view, '_getPageElements').and.callFake(function() {
        return {
          container: $('<div class="container" />')
        };
      });
    });
    it("the getPageElements should be called when renderTemplate is called and the right container should be returned", function() {
      var container;
      container = $(view.renderTemplate(null));
      expect(view._getPageElements).toHaveBeenCalled();
      expect(container).not.toBeNull();
      expect(container).toEqual('div');
      return expect(container).toHaveClass('container');
    });
    return it("the getPageElements should be called and the rendering should use the container", function() {
      view.render();
      expect(view._getPageElements).toHaveBeenCalled();
      expect(view.$el).not.toBeNull();
      expect(view.$el).toEqual('div');
      return expect(view.$el).toHaveClass('container');
    });
  });
  describe("calling the change page method", function() {
    var view;
    vent = null;
    view = null;
    beforeEach(function() {
      vent = new Backbone.Wreqr.EventAggregator();
      view = new Dg.PagerView({
        vent: vent
      });
      view.info = {
        page: 1,
        pages: 10
      };
      spyOn(view, 'update').and.callThrough();
      return spyOn(vent, 'trigger').and.callThrough();
    });
    it("should raise an event when page is difference from the current one", function() {
      view._changePage(2);
      expect(view.update).toHaveBeenCalled();
      return expect(vent.trigger).toHaveBeenCalled();
    });
    return it("should not raise an event when page is the same as the current one", function() {
      view._changePage(1);
      expect(view.update).not.toHaveBeenCalled();
      return expect(vent.trigger).not.toHaveBeenCalled();
    });
  });
  describe("the link creation must be correct", function() {
    var control, flatTemplate, page, state, view, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
    flatTemplate = function() {
      return '<a data-page-type="first" />' + '<a data-page-type="prev" />' + '<a data-page-type="more-before" />' + '<a data-page-type="page" data-page-content="arabic" />' + '<a data-page-type="more-after" />' + '<a data-page-type="next" />' + '<a data-page-type="last" />';
    };
    vent = null;
    view = null;
    beforeEach(function() {
      vent = new Backbone.Wreqr.EventAggregator();
      view = new Dg.PagerView({
        vent: vent
      });
      return spyOn(view, 'getTemplate').and.callFake(function() {
        return flatTemplate;
      });
    });
    _ref = ['first', 'prev', 'before', 'after', 'next', 'last'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      _ref1 = ['active', 'disabled'];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        state = _ref1[_j];
        it("when " + control + " link is created with " + state + " state", function() {
          var elements, pageElement;
          elements = view._getPageElements();
          pageElement = view._createLink(elements[control], state);
          expect(pageElement).not.toBeNull();
          expect(pageElement).not.toEqual(elements[control]);
          expect(pageElement).toEqual('a');
          expect(pageElement.attr('data-page-type')).toBe(control);
          return expect(pageElement).toHaveClass(state);
        });
      }
    }
    _ref2 = [1, 2, 3];
    _results = [];
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      page = _ref2[_k];
      _results.push((function() {
        var _l, _len3, _ref3, _results1;
        _ref3 = ['active', 'disabled'];
        _results1 = [];
        for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
          state = _ref3[_l];
          _results1.push(it("when page " + page + " link is created with " + state + " state", function() {
            var elements, pageElement;
            elements = view._getPageElements();
            pageElement = view._createPageLink(elements.page, page, state);
            expect(pageElement).not.toBeNull();
            expect(pageElement).not.toEqual(elements.page);
            expect(pageElement).toEqual('a');
            expect(pageElement.attr('data-page-type')).toBe('page');
            expect(pageElement).toHaveClass(state);
            expect(pageElement).toHaveText("" + page);
            return expect(pageElement).toHaveAttr('data-page', "" + page);
          }));
        }
        return _results1;
      })());
    }
    return _results;
  });
  return describe("refreshing the ui should produce the correct pager", function() {
    var assertControlAbsent, assertControlPresent, assertControlPresentAndDisabled, assertFillerPresent, assertPageControlAbsent, assertPageControlPresent, assertPageControlPresentAndActive, view;
    vent = null;
    view = null;
    assertControlPresent = function(view, type, content) {
      var control;
      control = view.$el.find("[data-page-type=" + type + "]");
      expect(control).not.toBeNull();
      expect(control).toHaveLength(1);
      expect(control).toEqual('a');
      return expect(control).toContainText(content);
    };
    assertControlPresentAndDisabled = function(view, type, content) {
      var control;
      control = view.$el.find("[data-page-type=" + type + "]");
      expect(control).not.toBeNull();
      expect(control).toHaveLength(1);
      expect(control).toEqual('a');
      expect(control).toContainText(content);
      return expect(control).toHaveClass('disabled');
    };
    assertControlAbsent = function(view, type) {
      var control;
      control = view.$el.find("[data-page-type=" + type + "]");
      expect(control).not.toBeNull();
      return expect(control).toHaveLength(0);
    };
    assertPageControlPresent = function(view, page) {
      var control;
      control = view.$el.find("[data-page-type=page][data-page=" + page + "]");
      expect(control).not.toBeNull();
      expect(control).toHaveLength(1);
      expect(control).toEqual('a');
      return expect(control).toContainText(page);
    };
    assertPageControlPresentAndActive = function(view, page) {
      var control;
      control = view.$el.find("[data-page-type=page][data-page=" + page + "]");
      expect(control).not.toBeNull();
      expect(control).toHaveLength(1);
      expect(control).toEqual('a');
      expect(control).toContainText(page);
      return expect(control).toHaveClass('active');
    };
    assertPageControlAbsent = function(view, page) {
      var control;
      control = view.$el.find("[data-page-type=page][data-page=" + page + "]");
      expect(control).not.toBeNull();
      return expect(control).toHaveLength(0);
    };
    assertFillerPresent = function(view, type) {
      var control;
      control = view.$el.find("[data-page-type=" + type + "]");
      expect(control).not.toBeNull();
      expect(control).toHaveLength(1);
      expect(control).toEqual('a');
      expect(control).toContainText('...');
      return expect(control).toHaveClass('disabled');
    };
    beforeEach(function() {
      vent = new Backbone.Wreqr.EventAggregator();
      return view = new Dg.PagerView({
        vent: vent
      });
    });
    it("by default all controls must be there when there are 10 pages and the current page is 5", function() {
      spyOn(view, 'getTemplate').and.callFake(function() {
        return function() {
          return '<a data-page-type="first">first</a>' + '<a data-page-type="prev">prev</a>' + '<a data-page-type="more-before">...</a>' + '<a data-page-type="page" data-page-content="arabic" />' + '<a data-page-type="more-after">...</a>' + '<a data-page-type="next">next</a>' + '<a data-page-type="last">last</a>';
        };
      });
      view.refreshView({
        page: 5,
        pages: 10
      });
      assertControlPresent(view, 'first', 'first');
      assertControlPresent(view, 'prev', 'prev');
      assertFillerPresent(view, 'more-before');
      assertPageControlAbsent(view, "1");
      assertPageControlAbsent(view, "2");
      assertPageControlPresent(view, "3");
      assertPageControlPresent(view, "4");
      assertPageControlPresentAndActive(view, "5");
      assertPageControlPresent(view, "6");
      assertPageControlPresent(view, "7");
      assertPageControlAbsent(view, "8");
      assertPageControlAbsent(view, "9");
      assertPageControlAbsent(view, "10");
      assertFillerPresent(view, 'more-after');
      assertControlPresent(view, 'next', 'next');
      return assertControlPresent(view, 'last', 'last');
    });
    it("only pages control must be there for 10 pages and the current page is 5 when there is no other control setup", function() {
      spyOn(view, 'getTemplate').and.callFake(function() {
        return function() {
          return '<a data-page-type="page" data-page-content="arabic" />';
        };
      });
      view.refreshView({
        page: 5,
        pages: 10
      });
      assertControlAbsent(view, 'first', 'first');
      assertControlAbsent(view, 'prev', 'prev');
      assertControlAbsent(view, 'more-before');
      assertPageControlAbsent(view, "1");
      assertPageControlAbsent(view, "2");
      assertPageControlPresent(view, "3");
      assertPageControlPresent(view, "4");
      assertPageControlPresentAndActive(view, "5");
      assertPageControlPresent(view, "6");
      assertPageControlPresent(view, "7");
      assertPageControlAbsent(view, "8");
      assertPageControlAbsent(view, "9");
      assertPageControlAbsent(view, "10");
      assertControlAbsent(view, 'more-after');
      assertControlAbsent(view, 'next', 'next');
      return assertControlAbsent(view, 'last', 'last');
    });
    it("first/previous control must be disabled and filler before absent when there are 10 pages and the current page is 1", function() {
      spyOn(view, 'getTemplate').and.callFake(function() {
        return function() {
          return '<a data-page-type="first">first</a>' + '<a data-page-type="prev">prev</a>' + '<a data-page-type="more-before">...</a>' + '<a data-page-type="page" data-page-content="arabic" />' + '<a data-page-type="more-after">...</a>' + '<a data-page-type="next">next</a>' + '<a data-page-type="last">last</a>';
        };
      });
      view.refreshView({
        page: 1,
        pages: 10
      });
      assertControlPresentAndDisabled(view, 'first', 'first');
      assertControlPresentAndDisabled(view, 'prev', 'prev');
      assertControlAbsent(view, 'more-before');
      assertPageControlPresentAndActive(view, "1");
      assertPageControlPresent(view, "2");
      assertPageControlPresent(view, "3");
      assertPageControlAbsent(view, "4");
      assertPageControlAbsent(view, "5");
      assertPageControlAbsent(view, "6");
      assertPageControlAbsent(view, "7");
      assertPageControlAbsent(view, "8");
      assertPageControlAbsent(view, "9");
      assertPageControlAbsent(view, "10");
      assertFillerPresent(view, 'more-after');
      assertControlPresent(view, 'next', 'next');
      return assertControlPresent(view, 'last', 'last');
    });
    it("last/next control must be disabled and filler after absent when there are 10 pages and the current page is 10", function() {
      spyOn(view, 'getTemplate').and.callFake(function() {
        return function() {
          return '<a data-page-type="first">first</a>' + '<a data-page-type="prev">prev</a>' + '<a data-page-type="more-before">...</a>' + '<a data-page-type="page" data-page-content="arabic" />' + '<a data-page-type="more-after">...</a>' + '<a data-page-type="next">next</a>' + '<a data-page-type="last">last</a>';
        };
      });
      view.refreshView({
        page: 10,
        pages: 10
      });
      assertControlPresent(view, 'first', 'first');
      assertControlPresent(view, 'prev', 'prev');
      assertFillerPresent(view, 'more-before');
      assertPageControlAbsent(view, "1");
      assertPageControlAbsent(view, "2");
      assertPageControlAbsent(view, "3");
      assertPageControlAbsent(view, "4");
      assertPageControlAbsent(view, "5");
      assertPageControlAbsent(view, "6");
      assertPageControlAbsent(view, "7");
      assertPageControlPresent(view, "8");
      assertPageControlPresent(view, "9");
      assertPageControlPresentAndActive(view, "10");
      assertControlAbsent(view, 'more-after');
      assertControlPresentAndDisabled(view, 'next', 'next');
      return assertControlPresentAndDisabled(view, 'last', 'last');
    });
    it("no filler must be present when there are 5 pages and page 3 is the current page", function() {
      spyOn(view, 'getTemplate').and.callFake(function() {
        return function() {
          return '<a data-page-type="first">first</a>' + '<a data-page-type="prev">prev</a>' + '<a data-page-type="more-before">...</a>' + '<a data-page-type="page" data-page-content="arabic" />' + '<a data-page-type="more-after">...</a>' + '<a data-page-type="next">next</a>' + '<a data-page-type="last">last</a>';
        };
      });
      view.refreshView({
        page: 3,
        pages: 5
      });
      assertControlPresent(view, 'first', 'first');
      assertControlPresent(view, 'prev', 'prev');
      assertControlAbsent(view, 'more-before');
      assertPageControlPresent(view, "1");
      assertPageControlPresent(view, "2");
      assertPageControlPresentAndActive(view, "3");
      assertPageControlPresent(view, "4");
      assertPageControlPresent(view, "5");
      assertControlAbsent(view, 'more-after');
      assertControlPresent(view, 'next', 'next');
      return assertControlPresent(view, 'last', 'last');
    });
    it("no filler must be present when no page control is present", function() {
      spyOn(view, 'getTemplate').and.callFake(function() {
        return function() {
          return '<a data-page-type="first">first</a>' + '<a data-page-type="prev">prev</a>' + '<a data-page-type="more-before">...</a>' + '<a data-page-type="more-after">...</a>' + '<a data-page-type="next">next</a>' + '<a data-page-type="last">last</a>';
        };
      });
      view.refreshView({
        page: 3,
        pages: 5
      });
      assertControlPresent(view, 'first', 'first');
      assertControlPresent(view, 'prev', 'prev');
      assertControlAbsent(view, 'more-before');
      assertPageControlAbsent(view, "1");
      assertPageControlAbsent(view, "2");
      assertPageControlAbsent(view, "3");
      assertPageControlAbsent(view, "4");
      assertPageControlAbsent(view, "5");
      assertControlAbsent(view, 'more-after');
      assertControlPresent(view, 'next', 'next');
      return assertControlPresent(view, 'last', 'last');
    });
    return it("pager must be empty when the number of page to display is 1", function() {
      spyOn(view, 'getTemplate').and.callFake(function() {
        return function() {
          return '<a data-page-type="first">first</a>' + '<a data-page-type="prev">prev</a>' + '<a data-page-type="more-before">...</a>' + '<a data-page-type="more-after">...</a>' + '<a data-page-type="next">next</a>' + '<a data-page-type="last">last</a>';
        };
      });
      view.refreshView({
        page: 1,
        pages: 1
      });
      expect(view.$el).not.toBeNull();
      return expect(view.$el).toHaveLength(1);
    });
  });
});
