/*
 * Backbone.Dg - v0.0.1
 * Copyright (c) 2014-03-28 Laurent Prévost (Prevole) <prevole@prevole.ch>
 * Distributed under MIT license
 * https://github.com/prevole/backbone.dg
 */

/*
Datagrid
========

The Datagrid plugin for `Bacbkone` gives the possibility to implement
easily a data table into a `Bacbkone` application. It uses `Backbone.Marionette`
and its different views to reach the features of the data table.

Dependencies:

- [jQuery 2.1.0](http://jquery.com)
- [JSON2 2011-10-19](http://www.JSON.org/json2.js)
- [Underscore 1.6.0](http://underscorejs.org)
- [Backbone 1.1.2](http://backbonejs.org)
- [Backbone.Marionette 1.6.4](http://github.com/marionettejs/backbone.marionette)

By default, a complete implementation based on `<table />` HTML tag is
provided but all the views can be overrided quickly and easily to create
an implementation based on other views and tags.

A default collection is also provided to work with the `Dg` plugin.
 */

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Backbone.Dg = window.Dg = (function(Backbone, Marionette, _, $) {
    var Dg, LoadingView, defaults, gridRegions, i18nKeys, infoKeys, isI18n, mandatoryOptions, reject, slice;
    Dg = {
      version: '0.1.0'
    };

    /*
    Defaults i18nKeys used in the translations if `i18n-js` is used.
    
    You can provide your own i18n keys to match your structure.
     */
    i18nKeys = {
      info: 'datagrid.info',
      nodata: 'datagrid.nodata',
      loading: 'datagrid.loading',
      perpage: 'datagrid.perpage',
      quicksearch: 'datagrid.quicksearch'
    };

    /*
    defaults
    
    In the same idea of `_.defaults(object, *defaults)`, this function
    will recurse the object structure to use defaults values at any
    depth of the object.
    
    @param {Object} object The objet to get the overriden values
    @param {Object} defs Defaults to apply when no value is provided
    @return {Object} Object enriched
     */
    defaults = function(object, defs) {
      var key, value;
      if (object === void 0) {
        object = {};
      }
      for (key in defs) {
        value = defs[key];
        if (object[key] === void 0 || object[key] === null) {
          object[key] = defs[key];
        } else if (_.isObject(defs[key]) && _.isObject(object[key])) {
          object[key] = defaults(object[key], defs[key]);
        }
      }
      return object;
    };

    /*
    reject
    
    Like `_.reject(list, iterator, [context])`, this function reject entries
    that satisfies the iterator function.
    
    @param {Object} object The objet that contains entries to reject
    @param {Function} filter The function to reject unwanted entries
    @return {Object} Object that contains only elements wanted
     */
    reject = function(object, filter) {
      var key, newObject, value;
      newObject = {};
      for (key in object) {
        value = object[key];
        if (!filter(object, key, value)) {
          newObject[key] = value;
        }
      }
      return newObject;
    };

    /*
    Check if the options given contains the options wanted
    
    @param {Object} options The options to check
    @param {Array(String)} optionNames The array of option names expected to be there
    @return {Boolean} True if the options are correct, false otherwise
     */
    mandatoryOptions = function(options, optionNames) {
      var optionName, _i, _len;
      if (!(options && _.isObject(options))) {
        return false;
      }
      for (_i = 0, _len = optionNames.length; _i < _len; _i++) {
        optionName = optionNames[_i];
        if (options[optionName] === void 0) {
          return false;
        }
      }
      return true;
    };

    /*
    Check if the I18n library is available or not
    
    @return {Boolean} True if the lib is available
     */
    isI18n = function() {
      return !(window.I18n === void 0);
    };

    /*
    Shortcut to the slice method from Array
     */
    slice = Function.prototype.call.bind(Array.prototype.slice);

    /*
     *# ItemView
    
    This is the general view used in the `DataGrid` plugin to ensure
    the rendering and the update of information arround the collection
    rendered. The view is based on the `Marionette.ItemView`.
    
    The both methods `refreshView` and `update` are mandatory. The `refreshView`
    raise an error if not overriden while the `update` has a default implementation.
    
    This view expect to have an event aggregator given from the datagrid layout. If not given,
    an error is raised.
     */
    Dg.ItemView = Marionette.ItemView.extend({

      /*
      Constructor to enforce the presence of the event aggregator
      used accross the datagrid.
        
      The refreshView method is directly bind to the event `view:refresh`
      from the event aggregator.
        
      @param {Object} options The options that should at least contain `vent` object
       */
      constructor: function() {
        Marionette.ItemView.prototype.constructor.apply(this, arguments);
        _.extend(this, _.pick(this.options, _.union(this.optionNames || [], ['vent'])));
        if (!this.vent) {
          throw new Error('No event aggregator given.');
        }
        this.vent.on('view:refresh', this.refreshView, this);
        return this;
      },
      getTemplate: function() {
        return Dg.getTemplate(this.template);
      },

      /*
      Override the default render method from `Marionette.ItemView`
      to trigger the event "item:rendered" once the render method
      finished.
        
      The `render` function is called on the `Marionette.ItemView` to
      manage the technical rendering part. The addition comes from
      the event triggered after the rendering is done.
        
      @return {Dg.ItemView} This
       */
      onRender: function() {
        return this.vent.trigger('item:rendered', this);
      },

      /*
      Refresh the view based on the info comming from the collection state.
        
      By default, this function raised an exception as she must be implemented.
        
      @param {Object} info The metadata that describe the collection current state
       */
      refreshView: function(info) {
        throw new Error('The method refreshView(info) must be defined.');
      },

      /*
      Every time the metadata of the datagrid is updated, an
      event is triggered to request a refresh of the data contained
      in the collection.
        
      As the responsability of the metadata processing is given to
      the collection itself, you can set anything you want as metadata.
        
      There is a default metadata format expected that you can see. This
      default format should be configured for the default implementation
      of the different table views.
        
      @param {Object} info The metadata updated by the table views
       */
      update: function(info) {
        return this.vent.trigger('update', info);
      },

      /*
      Overrides the `close` function from `Backbone.Marionette.ItemView` to
      ensure that the event binding is correctly unbinded when the view
      is closed.
       */
      onClose: function() {
        return this.vent.off('view:refresh', this.refreshView, this);
      }
    });

    /*
     *# DefaultItemView
    
    Use the `Dg.DefaultItemView` is a specialized view from `Dg.ItemView`. It is designed
    to be used to generate views that are not wrapped in a `<div />` tag.
    
    The specialization comes from the fact that all the view extending this one will not
    create the `el` tag based on view configuration but create the `el` directly from
    the template rendering. Therefore, setting the `className`, `tagName` or `el` directly
    must not be used directly.
     */
    Dg.DefaultItemView = Dg.ItemView.extend({

      /*
      Constructor
       */
      constructor: function() {
        return Dg.ItemView.prototype.constructor.apply(this, arguments);
      },

      /*
      Override the default render method from `Dg.TableItemView` to
      set the element to the result of template rendering. This will
      suppress the additional `<div />` element.
        
      Take care that using this `Dg.DefaultItemView` will not allow to specify
      any selector or tag as el.
        
      The code is based on the `Backbone.Marionette.ItemView` render method with
      two main differences. The element is set from the template rendering and
      an additional `item:rendered` event is triggered.
       */
      render: function() {
        var data;
        this.isClosed = false;
        if (this.beforeRender) {
          this.beforeRender();
        }
        this.trigger('before:render', this);
        this.trigger('item:before:render', this);
        data = this.serializeData();
        data = this.mixinTemplateHelpers(data);
        this.setElement($(this.renderTemplate(data)), true);
        this.bindUIElements();
        this.onRender();
        this.trigger('render', this);
        this.trigger('item:rendered', this);
        this.vent.trigger('item:rendered', this);
        return this;
      },

      /*
      Render data a take care to get the template and do something with it
        
      @param Object data to render
       */
      renderTemplate: function(data) {
        return Marionette.Renderer.render(this.getTemplate(), data);
      }
    });

    /*
     *# Dg.InfoView
    
    Default implementation to present general information about the collection
    currently displayed.
    
    The following information are shown:
    
      - from: The number of the first entry shown
      - to: The number of the last entry shown
      - total: The total number of entries shown
    
    A translation is done for the message shown through `I18n-js` if present. Otherwise,
    the default message is used:
    
      - default message: `Showing ${from} to ${to} of ${total} entries`
     */
    Dg.InfoView = Dg.DefaultItemView.extend({
      template: 'info',

      /*
      Show the metadata that describes the collection currently shown
      to the user such the number of entries, the first record, the last
      record.
        
      @param {Object} info The metadata to collect the data to show
       */
      refreshView: function(info) {
        if (isI18n()) {
          return this.$el.text(I18n.t(i18nKeys.info, {
            from: info[infoKeys.from],
            to: info[infoKeys.to],
            total: info[infoKeys.items]
          }));
        } else {
          return this.$el.text("Showing " + info[infoKeys.from] + " to " + info[infoKeys.to] + " of " + info[infoKeys.items] + " entries");
        }
      }
    });

    /*
     *# Dg.PerPageView
    
    Default implementation for the region which allow changing the number of lines
    shown in the table. The implementation is based on a select box.
     */
    Dg.PerPageView = Dg.DefaultItemView.extend({
      template: 'perpage',
      events: {
        'change .per-page': 'perPage'
      },
      ui: {
        perPage: '.per-page'
      },

      /*
      Refresh the view by setting the number of entries per page to the select box.
        
      As the `refresh` function from `Dg.QuickSearchView`, this function is used to
      synchronize multiple views.
        
      @param {Object} info The metadata to get the number of lines per page
       */
      refreshView: function(info) {
        return this.ui.perPage.val(info[infoKeys.perPage]);
      },

      /*
      Manage the changes occured to change the number of entries
      shown on a page.
        
      @param {Event} event The event triggered on `change`
       */
      perPage: function(event) {
        return this.update(_.object([infoKeys.perPage], [parseInt(this.ui.perPage.val())]));
      }
    });

    /*
     *# Dg.ToolbarView
    
    In general, a table is quite often used to manipulate data. Therefore,
    some buttons are required to manage the data such an add button or a
    refresh button.
     */
    Dg.ToolbarView = (function(_super) {
      __extends(_Class, _super);

      function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
      }

      _Class.prototype.template = 'toolbar';

      _Class.prototype.ui = {
        search: '[data-control=search]',
        refresh: '[data-control=refresh]',
        create: '[data-control=add]'
      };

      _Class.prototype.events = {
        'keyup @ui.search': 'search',
        'click @ui.refresh': 'refresh',
        'click @ui.create': 'create'
      };

      _Class.prototype._searchInternal = _.debounce(function(event) {
        return this.update(_.object([infoKeys.term], [this.ui.search.val().trim()]));
      }, 300);


      /*
      When the refresh of the view occured, the buttons deactived are
      restored to their initial status as active button.
        
      @param {Object} info The metadata to get information about the collection
       */

      _Class.prototype.refreshView = function(info) {
        this.ui.search.val(info[infoKeys.term]);
        this.ui.refresh.removeClass('disabled');
        return this.ui.create.removeClass('disabled');
      };


      /*
      Handle the quick search field changes to process
      the search query
        
      @param {Event} event The event triggered on `keyup`
       */

      _Class.prototype.search = function(event) {
        return this._searchInternal(event);
      };


      /*
      Manage the create button and the management of the button
      state.
        
      When the button is cliked, an event is triggered to delegate
      the creation operation to another component that listen for
      the event.
        
      @param {Event} event Create button event triggered
       */

      _Class.prototype.create = function(event) {
        event.preventDefault();
        if (!this.ui.create.hasClass('disabled')) {
          this.ui.create.addClass('disabled');
        }
        return this.vent.trigger('create:model');
      };


      /*
      Manage the refresh button and the management of the
      button state.
        
      Delegate the update request of the collection to
      the `Dg.ItemView`.
        
      @param {Event} event Refresh button event triggered
       */

      _Class.prototype.refresh = function(event) {
        event.preventDefault();
        if (!this.ui.refresh.hasClass('disabled')) {
          this.ui.refresh.addClass('disabled');
          return this.update({});
        }
      };

      return _Class;

    })(Dg.DefaultItemView);

    /*
     *# Dg.PagerView
    
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
     * Default options
    options:
      deltaPage: 2
      css:
        active: "active"
        disabled: "disabled"
      numbers: true
    ```
    
    - **delatePage**: Number of pages shown before and after the active one (if available)
    - **css**: Different style added for link `disabled`, `active` or `page`
     */
    Dg.PagerView = Dg.DefaultItemView.extend({
      optionNames: ['deltaPage', 'css'],
      template: 'pager',
      ui: {
        first: '[data-page-type=first]',
        prev: '[data-page-type=prev]',
        page: '[data-page-type=page]',
        next: '[data-page-type=next]',
        last: '[data-page-type=last]'
      },
      events: {
        'click @ui.first': 'firstPage',
        'click @ui.prev': 'previousPage',
        'click @ui.page': 'toPage',
        'click @ui.next': 'nextPage',
        'click @ui.last': 'lastPage'
      },
      deltaPage: 2,
      css: {
        active: 'active',
        disabled: 'disabled'
      },

      /*
      Constructor
       */
      constructor: function(options) {
        Dg.DefaultItemView.prototype.constructor.apply(this, arguments);
        this.info = {};
        this.info[infoKeys.page] = 0;
        return this.info[infoKeys.pages] = 0;
      },

      /*
      Render the pager component based on the metadata given. Calculation
      is done to know how to render the actual page, first/last, next/previous
      links.
        
      @param {Object} info The metadata to get the pagging data
       */
      refreshView: function(info) {
        var css, i, maxPage, minPage, page, pagerTemplate, pages, state, _i;
        this.info = info;
        this.$el.empty();
        pagerTemplate = this._getPageElements();
        page = this.info[infoKeys.page];
        pages = this.info[infoKeys.pages];
        if (page > 0 && pages > 1) {
          minPage = page - this.deltaPage;
          maxPage = page + this.deltaPage;
          if (minPage <= 0) {
            minPage = 1;
          }
          if (maxPage >= pages) {
            maxPage = pages;
          }
          state = page === 1 ? this.css.disabled : '';
          if (pagerTemplate.first !== void 0) {
            this.$el.append(this._createLink(pagerTemplate.first, state));
          }
          if (pagerTemplate.prev !== void 0) {
            this.$el.append(this._createLink(pagerTemplate.prev, state));
          }
          if (pagerTemplate.page !== void 0) {
            if (pagerTemplate.before !== void 0 && minPage > 1) {
              this.$el.append(this._createLink(pagerTemplate.before, this.css.disabled));
            }
            for (i = _i = minPage; minPage <= maxPage ? _i <= maxPage : _i >= maxPage; i = minPage <= maxPage ? ++_i : --_i) {
              css = i === page ? this.css.active : '';
              this.$el.append(this._createPageLink(pagerTemplate.page, i, css));
            }
            if (pagerTemplate.after !== void 0 && maxPage < pages) {
              this.$el.append(this._createLink(pagerTemplate.after, this.css.disabled));
            }
          }
          state = page === pages ? this.css.disabled : '';
          if (pagerTemplate.next !== void 0) {
            this.$el.append(this._createLink(pagerTemplate.next, state));
          }
          if (pagerTemplate.last !== void 0) {
            this.$el.append(this._createLink(pagerTemplate.last, state));
          }
          return this.bindUIElements();
        }
      },

      /*
      Override the default behavior of rendering a template
        
      @param [Object] data The data to render (not used)
       */
      renderTemplate: function(data) {
        return this._getPageElements().container.clone();
      },

      /*
      Action to go to the first page
        
      @param {Event} event The event for the page change
       */
      firstPage: function(event) {
        return this._changePage(1);
      },

      /*
      Action to go to the previous page
        
      @param {Event} event The event for the page change
       */
      previousPage: function(event) {
        var page;
        page = this.info[infoKeys.page] - 1 > 0 ? this.info[infoKeys.page] - 1 : this.info[infoKeys.page];
        return this._changePage(page);
      },

      /*
      Action to go to a specific page
        
      @param {Event} event The event for the page change
       */
      toPage: function(event) {
        return this._changePage(parseInt($(event.target).text()));
      },

      /*
      Action to go to the next page
        
      @param {Event} event The event for the page change
       */
      nextPage: function(event) {
        var page;
        page = (this.info[infoKeys.page] + 1) < this.info[infoKeys.pages] ? this.info[infoKeys.page] + 1 : this.info[infoKeys.pages];
        return this._changePage(page);
      },

      /*
      Action to go to the last page
        
      @param {Event} event The event for the page change
       */
      lastPage: function(event) {
        return this._changePage(this.info[infoKeys.pages]);
      },

      /*
      Do the effective action to change the page
        
      @param {int} toPage The page where to go
       */
      _changePage: function(toPage) {
        if (toPage !== this.info[infoKeys.page]) {
          return this.update(_.object([infoKeys.page], [toPage]));
        }
      },

      /*
      Retrieve the pager elements to use as template for each
      elements of the pager.
        
      The first time the function is called, the template structure
      is created from the template of this class and cached for the
      future calls.
        
      @return {Hash} The pager elements templates
       */
      _getPageElements: function() {
        var container, find, pager;
        if (this.pagerTemplate === void 0) {
          pager = $(this.getTemplate()(null));
          find = function(selector) {
            return pager.filter(selector).add(pager.find(selector));
          };
          if (pager.length > 1) {
            container = $('<div />');
          } else {
            container = pager.clone().empty();
          }
          this.pagerTemplate = {
            first: find('[data-page-type="first"]').clone(),
            prev: find('[data-page-type="prev"]').clone(),
            before: find('[data-page-type="more-before"]').clone(),
            page: find('[data-page-type="page"]').clone(),
            after: find('[data-page-type="more-after"]').clone(),
            next: find('[data-page-type="next"]').clone(),
            last: find('[data-page-type="last"]').clone(),
            container: container
          };
        }
        return this.pagerTemplate;
      },

      /*
      Create a link for one element in the pager.
        
      @param {jQueryObject} element The element that is used as a template to create the page link
      @param {String} type The type of link
      @param {String} state The state of the link
      @return {jQueryObject} Page link element
       */
      _createLink: function(element, state) {
        return element.clone().addClass(state);
      },

      /*
      Create a link for one element in the pager.
        
      @param {jQueryObject} element The element that is used as a template to create the page link
      @param {String} state The state of the link
      @return {jQueryObject} Page link element
       */
      _createPageLink: function(element, pageNumber, state) {
        var pageElement, pageElementContent, pageType;
        pageElement = element.clone();
        if (pageElement.attr("data-page-content") === void 0) {
          pageElementContent = pageElement.find("*[data-page-content]");
        } else {
          pageElementContent = pageElement;
        }
        pageType = pageElementContent.attr("data-page-content");
        if (pageType === "arabic") {
          pageElementContent.text("" + pageNumber);
        }
        return pageElement.addClass(state).attr('data-page', "" + pageNumber);
      }
    });

    /*
     *# Dg.RowView
    
    The implementation of the `Dg.RowView` needs to be extended for a proper use. The row view
    have no idea of the data to render and therefore it is required to extend this view for the
    specific data you have to render.
    
    This class take care about the `delete` and `edit` button events when provided. This
    basic behavior is designed to go with the `Dg.ToolbarView` which provides the `create` and
    `refresh` buttons.
    
    This row view is build around the `<tr />` and `<td />` tags that are the defaults for
    the data grid rendering done by the `Dg` plugin.
    
    A default styling is done for the column ordering to show the `asc`, `desc` and `none`
    order.
    
    ```
     * Default options
    options:
      css:
        asc: "sorting-asc"
        desc: "sorting-desc"
        none: null
      cellTagName: "td"
    ```
    
    - **css**: Different styles applied when sorting is done. `asc` and
              `desc` styles are required. A `none` style should be defined
              to apply when ordering change from `desc` order to `none` order.
    - **cellTagName**: HTML tag name that represent a cell into the data grid
     */
    Dg.RowView = Dg.ItemView.extend({
      optionNames: ['css', 'cellTagName'],
      tagName: 'tr',
      events: {
        'click .edit': 'edit',
        'click .delete': 'delete'
      },
      css: {
        asc: 'sorting-asc',
        desc: 'sorting-desc',
        none: null
      },
      cellTagName: 'td',

      /*
      Apply the different style to represent the ordering done
      on the collection.
        
      @param {Object} info The metadata to get the ordering data
       */
      refreshView: function(info) {
        var target, _i, _len, _ref, _results;
        if (info[infoKeys.sort]) {
          _ref = this.$el.find(this.cellTagName);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            target = _ref[_i];
            target = $(target);
            target.removeClass("" + this.css.asc + " " + this.css.desc);
            if (this.css.none) {
              target.removeClass(this.css.none);
            }
            if (info[infoKeys.sort][target.index()]) {
              if (info[infoKeys.sort][target.index()] === infoKeys.asc) {
                _results.push(target.addClass(this.css.asc));
              } else {
                _results.push(target.addClass(this.css.desc));
              }
            } else if (this.css.none) {
              _results.push(target.addClass(this.css.none));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      },

      /*
      Manage the `edit` action
        
      @param {Event} event The `edit` button click
       */
      edit: function(event) {
        event.preventDefault();
        return this.vent.trigger('row:edit', this.model);
      },

      /*
      Manage the `delete` action
        
      @param {Event} event The `delete` button click
       */
      "delete": function(event) {
        event.preventDefault();
        return this.vent.trigger('row:delete', this.model);
      }
    });

    /*
     *# Dg.EmptyView
    
    When there is no data available in the collection, this view
    is used to show to the user this state of the collection.
    
    The empty view is based on the `<table />` tag and then
    will use a `</td colspan="n">` tag where `n` is the number
    of columns shown in the data table.
     */
    Dg.EmptyView = Dg.DefaultItemView.extend({
      optionNames: ['columns'],
      template: 'empty',
      ui: {
        empty: '.empty'
      },

      /*
      When the view is rendered, the number of columns is set
       */
      onRender: function() {
        return this.$el.attr('colspan', this.columns);
      },

      /*
      Nothing fancy is done for this refresh function
        
      @param {Object} info The collection metadata
       */
      refreshView: function(info) {}
    });

    /*
     *# Dg.LoadingView
    
    This view is used when the collection is fetched from a source. The
    purpose is to show to the user that something is happening that is
    different than no data is available.
     */
    LoadingView = Backbone.Marionette.ItemView.extend({
      template: 'gridempty',
      getTemplate: function() {
        return Dg.getTemplate(this.template);
      }
    });

    /*!
        render: ->
          @beforeRender() if @beforeRender
    
          @trigger("before:render", @)
          @trigger("item:before:render", @)
    
    
          el = $(Marionette.Renderer.render(@getTemplate(), @serializeData()))
          @setElement el
    
          @bindUIElements();
    
          @onRender() if @onRender
    
          @trigger("render", this)
          @trigger("item:rendered", this)
    !
     */

    /*
     *# Dg.HeaderView
    
    As the `Dg.RowView`, the `HeaderView` is incomplete and expects to be
    extended for your own data.
    
    This view offers the mechanism to sort the column of your data collection
    when they are presented in `<table />` tag. Table headers HTML tags are used
    to render the headers.
    
    The multi-sort is possible by pressing on shift key when clicks are done
    on the different columns.
     */
    Dg.HeaderView = Dg.ItemView.extend({
      optionNames: ['parentSelector', 'appendMode', 'columnTag', 'sortTag', 'css'],
      tagName: 'thead',
      parentSelector: 'table',
      appendMode: 'prepend',
      columnTag: 'th',
      sortTag: 'th',
      css: {
        sortable: 'sorting',
        asc: 'sorting-asc',
        desc: 'sorting-desc',
        none: 'sorting-none'
      },
      events: {
        'click .sorting': 'sort'
      },

      /*
       *# TODO
      - Refactor the styles to allow the differenciation between each column sorting in multi mode
       */

      /*
      Refresh the view accordingly to the metadata that should contain
      the column sorting information. Which column are sorted in which
      direction.
        
      @param {Object} info The metadata with the column sorting configuration
       */
      refreshView: function(info) {
        var idx, sorter, target, _i, _len, _ref, _results;
        idx = 0;
        _ref = this.$el.find("" + this.sortTag + "." + this.css.sortable);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          target = _ref[_i];
          sorter = $(target);
          sorter.removeClass("" + this.css.asc + " " + this.css.desc + " " + this.css.none);
          if (info[infoKeys.sort]) {
            this.sortConfiguration = info[infoKeys.sort];
            if (this.sortConfiguration[idx]) {
              if (this.sortConfiguration[idx] === infoKeys.asc) {
                sorter.addClass(this.css.asc);
              } else {
                sorter.addClass(this.css.desc);
              }
            } else {
              sorter.addClass(this.css.none);
            }
          }
          _results.push(idx++);
        }
        return _results;
      },

      /*
      Manage the sort action to be done when an header element is
      clicked.
        
      @param {Event} event The click event for sorting
       */
      sort: function(event) {
        var idx;
        idx = $("." + this.css.sortable, this.$el).index($(event.target));
        if (!this.sortConfiguration) {
          this.sortConfiguration = {};
        }
        if (!event.altKey) {
          if (this.sortConfiguration[idx]) {
            this.sortConfiguration = _.pick(this.sortConfiguration, idx);
          } else {
            this.sortConfiguration = {};
          }
        }
        if (this.sortConfiguration[idx] === void 0) {
          this.sortConfiguration[idx] = infoKeys.asc;
        } else if (this.sortConfiguration[idx] === infoKeys.asc) {
          this.sortConfiguration[idx] = infoKeys.desc;
        } else {
          this.sortConfiguration[idx] = void 0;
        }
        return this.update(_.object([infoKeys.sort], [this.sortConfiguration]));
      },

      /*
      @return {int} The number of columns
       */
      columns: function() {
        return this.$el.find(this.columnTag).length;
      }
    });

    /*
     *# Dg.TableView
    
    The core view that present the data collection with
    the headers and rows.
    
    The view is based on `<table />` tag element. The collection
    content is wrapped into a `<tbody />` tag and the headers are
    appended before this tag.
     */
    Dg.TableView = Marionette.CompositeView.extend({
      template: 'table',
      itemViewContainer: 'tbody',
      emptyView: Dg.EmptyView,

      /*
      This function allows the `ItemView` of a `Model` to
      get some information to render itself correctly.
        
      The `EventAggregator` is provided to the `ItemView` throuhg
      this function as the columns information.
        
      @param {Backbone.Model} model The model to render
       */
      itemViewOptions: function() {
        return {
          vent: this.vent,
          columns: this.columns()
        };
      },

      /*
      Constructor
        
      @param {Object} options The options to configure the view
        
      ```
       * Options expected
      options:
        vent:
        collection:
      ```
       */
      constructor: function() {
        Marionette.CompositeView.prototype.constructor.apply(this, slice(arguments));
        return _.extend(this, _.pick(this.options, 'vent'));
      },
      getTemplate: function() {
        return Dg.getTemplate(this.template);
      },
      onCompositeModelRendered: function() {
        var selector;
        if (this.headerView) {
          this.header = new this.headerView(this.options);
          if (this.header.parentSelector === void 0 || this.header.parentSelector === '') {
            selector = 'table';
          } else {
            selector = this.header.parentSelector;
          }
          if (this.header.appendMode === void 0 || this.header.appendMode !== 'prepend') {
            this.$el.find(selector).append(this.header.render().el);
          } else {
            this.$el.find(selector).prepend(this.header.render().el);
          }
        }
        return this.trigger('render');
      },

      /*
      As the render function do custom operations, we
      need to close the custom additions in a proper way.
        
      In this callback function called before the remaining
      close operations, we close the header view to manage
      properly the event unbinding.
       */
      beforeClose: function() {
        if (this.header) {
          return this.header.close();
        }
      },

      /*
      @return {int} The number of columns, zero if no header view
       */
      columns: function() {
        if (this.header) {
          return this.header.columns();
        } else {
          return 0;
        }
      }
    });

    /*
     *# Dg.TableRegion
    
    This class offers the possibility to add some transition effects
    when the whole data grid is shown to the user.
     */
    Dg.TableRegion = Marionette.Region.extend;

    /*!
        Open
        @param [Backbone.View] view The view to open
        open: (view) ->
          @$el.html view.el
          @$el.show "slide", { direction: "up" }, 1000
    
        Show
        @param [Backbone.View] view The view to show
        show: (view) ->
          if @$el
            $(@el).hide "slide", { direction: "up" }, 1000, =>
              super view
          else
            super view
    !
     */

    /*
     *# Dg.GridLayout
    
    This class brings all the bricks together to render each part
    of the datagrid (table, headers, toolbars, pagers...)
     */
    Dg.GridLayout = Marionette.Layout.extend({
      template: 'grid',

      /*
      Constructor
       */
      constructor: function() {
        this.vent = new Backbone.Wreqr.EventAggregator();
        Marionette.Layout.prototype.constructor.apply(this, slice(arguments));
        this.on('render', this.renderRegions);

        /*
        TODO: Refactor this part
          
        Listen to the different events
         */
        this.listenTo(this.vent, 'update', this.handleUpdate);
        this.listenTo(this.vent, 'refresh', this.handleRefresh);
        this.listenTo(this.vent, 'row:edit', this.handleEdit);
        this.listenTo(this.vent, 'row:delete', this.handleDelete);
        this.listenTo(this.vent, 'create:model', this.handleCreate);
        this.listenTo(this.collection, 'fetched', this.refreshGrid);
        return this.listenTo(this.collection, 'info:updated', this.refreshGrid);
      },
      getTemplate: function() {
        return Dg.getTemplate(this.template);
      },

      /*
      Proceed to the regions rendering. Each region is created,
      configured and rendered when necessary.
       */
      renderRegions: function() {
        var options, regionDefinition, regionName, _ref;
        _ref = this.regions;
        for (regionName in _ref) {
          regionDefinition = _ref[regionName];
          if (regionName !== 'table') {
            options = _.extend({
              vent: this.vent
            }, regionDefinition.options || {});
            this[regionName].show(new regionDefinition.view(_.extend(options, this.options)));
          }
        }
        this.table.show(new LoadingView());
        return this.collection.fetch();
      },

      /*
      Refresh the grid when new data are available through the collection
       */
      refreshGrid: function() {
        this.table.show(new this.regions.table.view(_.extend({
          vent: this.vent,
          collection: this.collection
        }, this.options)));
        return this.refreshInfo();
      },

      /*
      Ask for a refresh of the views arround the table
       */
      refreshInfo: function() {
        return this.vent.trigger('view:refresh', this.collection.getInfo());
      },
      handleUpdate: function(options) {
        this.table.show(new LoadingView());
        return this.collection.updateInfo(options);
      },
      handleRefresh: function() {
        return this.collection.refresh();
      },
      handleEdit: function(model) {
        return this.trigger('edit', model);
      },
      handleDelete: function(model) {
        return this.trigger('delete', model);
      },
      handleCreate: function() {
        return this.trigger('new');
      },

      /*
      Override the close function from `Backbone.Marionette.Layout` to
      clean the collection bindings.
       */
      onClose: function() {
        return this.collection.off('fetched', this.refreshGrid);
      }
    });

    /*!
        @on "transition:open", =>
          @showTable()
    
      showTable: ->
        if @gridTable.currentView
          @gridTable.currentView.renderCollection()
        else
          @gridTable.show(new @tableView(collection: @collection))
    !
     */

    /*
    Helper function to easily create a new `Dg.RowView` for a
    template and model.
    
    @param {Backbone.Model} model The model for which the view is done
    @param {Function,String} template The template of the view
    @param {Object} options The options to configure the view
    
    ```
    Options allowed:
    options:
      tagName: "tr"
    ```
    
    @return {Dg.RowView} Row view class created
     */
    Dg.createRowView = function(options) {
      if (!mandatoryOptions(options, ['template', 'model'])) {
        throw new Error('template or model is missing in the options');
      }
      return Dg.RowView.extend(options);
    };

    /*
    Helper function to easily create a `Dg.HeaderView` for
    a table.
    
    @param {Function,String} template The template of the view
    @return {Dg.HeaderView} Header view class created
     */
    Dg.createHeaderView = function(options) {
      if (!mandatoryOptions(options, ['template'])) {
        throw new Error('template is missing in the options');
      }
      return Dg.HeaderView.extend(options);
    };
    Dg.createTableView = function(options) {
      if (!mandatoryOptions(options, ['template', 'itemViewContainer', 'itemView'])) {
        throw new Error('template, itemViewContainer or itemView is missing in the options');
      }
      return Dg.TableView.extend(options);
    };

    /*
    Helper function to create a layout with options that overrides the
    default options.
    
    ```
     * Usable options
    options:
      gridRegions: {...}
      collection: ...
      template: ...
    ```
    
    @param {Object} options The options to configure the layout and views
    @return {Dg.GridLayout} The layout class created
     */
    Dg.createGridLayout = function(options) {
      var gridLayout, regions;
      options = options || {};
      regions = options.gridRegions || {};
      regions = reject(defaults(regions, gridRegions), function(object, key, value) {
        return !_.isObject(value);
      });
      if (options.collection === void 0) {
        gridLayout = Dg.GridLayout.extend({
          regions: regions
        });
      } else {
        gridLayout = Dg.GridLayout.extend({
          collection: options.collection,
          regions: regions
        });
      }
      if (!(options.template === void 0)) {
        gridLayout.prototype.template = options.template;
      }
      return gridLayout;
    };

    /*
    Defaults keys for the metadata used accross the data grid
    plugin.
    
    For more flexibility, it is possible to change the key names
    to match your collection metadata
     */
    infoKeys = {
      from: 'from',
      to: 'to',
      items: 'items',
      totalItems: 'totalItems',
      perPage: 'perPage',
      pages: 'pages',
      page: 'page',
      term: 'term',
      sort: 'sort',
      asc: 'A',
      desc: 'D'
    };

    /*
    Default configuration to define the data grid regions
    shown in the `Dg.GridLayout`
    
    This configuration could be overriden to match your
    requirements.
     */
    gridRegions = {
      table: {
        selector: '.dgTable',
        view: Dg.TableView
      },
      toolbar: {
        selector: '.dgToolbar',
        view: Dg.ToolbarView
      },
      perPage: {
        selector: '.dgPerPage',
        view: Dg.PerPageView
      },
      info: {
        selector: '.dgInfo',
        view: Dg.InfoView
      },
      pager: {
        selector: '.dgPager',
        view: Dg.PagerView
      }
    };

    /*
    Helper function to define part or all the i18n keys
    you want override for all your grids.
    
    The options are combined with the default ones defined
    by the plugin. Your i18n keys will override the ones
    from the plugins.
    
    @param {Object} options The i18n keys definition
     */
    Dg.setupDefaultI18nBindings = function(options) {
      return Dg.i18nKeys = _.defaults(options.i18n || {}, Dg.i18nKeys);
    };

    /*
    Helper function to define the metadata keys to
    match your collection metadata structure for all
    your grids.
    
    The options are combined with the default ones defined
    by the plugin. Your keys will override the ones
    from the plugins.
    
    @param {Object} options The metadata keys definition
     */
    Dg.setupDefaultInfoBindings = function(options) {
      return infoKeys = _.defaults(options.bindings || {}, infoKeys);
    };

    /*
    Helper function to define the grid layout regions
    definition for all your grids.
    
    The options are combined with the default ones defined
    by the plugin. Your definitions will override the ones
    from the plugins.
    
    @param {Object} options The grid region definitions
     */
    Dg.setupDefaultGridLayout = function(options) {
      return gridRegions = defaults(options.gridRegions || {}, gridRegions);
    };
    Dg.getTemplate = function(name) {
      console.log("Get template root " + name);
      throw new Error("There is no template engine available");
    };
    return Dg;
  })(Backbone, Backbone.Marionette, _, $ || window.jQuery || window.Zepto || window.ender);

}).call(this);