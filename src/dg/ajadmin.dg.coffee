###
Datagrid
========

The Datagrid plugin for `Bacbkone` gives the possibility to implement
easily a data table into a `Bacbkone` application. It uses `Backbone.Marionette`
and its different views to reach the features of the data table.

Dependencies:

- [jQuery 1.8.2](http://jquery.com)
- [JSON2 2011-10-19](http://www.JSON.org/json2.js)
- [Underscore 1.4.2](http://underscorejs.org)
- [Backbone 0.9.2](http://backbonejs.org)
- [Backbone.Marionette 1.0.0-beta1](http://github.com/marionettejs/backbone.marionette)
- [Backbone.EventBinder 0.0.0](http://github.com/marionettejs/backbone.eventbinder)
- [Backbone.Wreqr 0.0.0](http://github.com/marionettejs/backbone.wreqr)

By default, a complete implementation based on `<table />` HTML tag is
provided but all the views can be overrided quickly and easily to create
an implementation based on other views and tags.

A default collection is also provided to work with the `Dg` plugin.
###
Backbone.Dg = Dg = ( (Backbone, Marionette, _, $) ->
  Dg = { version: "0.0.1" }

  #= ajadmin.dg.utils.coffee
  #= ajadmin.dg.templateregistry.coffee
  #= ajadmin.dg.itemview.coffee
  #= ajadmin.dg.defaultitemview.coffee
  #= ajadmin.dg.infoview.coffee
  #= ajadmin.dg.quicksearchview.coffee
  #= ajadmin.dg.perpageview.coffee
  #= ajadmin.dg.toolbarview.coffee
  #= ajadmin.dg.pagerview.coffee
  #= ajadmin.dg.rowview.coffee
  #= ajadmin.dg.emptyview.coffee
  #= ajadmin.dg.loadingview.coffee
  #= ajadmin.dg.headerview.coffee
  #= ajadmin.dg.tableview.coffee
  #= ajadmin.dg.tableregion.coffee
  #= ajadmin.dg.gridlayout.coffee

  ###
  Helper function to easily create a new `Dg.RowView` for a
  template and model.

  @param {Backbone.Model} model The model for which the view is done
  @param {Function,String} template The template of the view
  @return {Dg.RowView} Row view class created
  ###
  Dg.createRowView = (model, template) ->
    return Dg.RowView.extend
      template: template
      model: model

  ###
  Helper function to easily create a `Dg.HeaderView` for
  a table.

  @param {Function,String} template The template of the view
  @return {Dg.HeaderView} Header view class created
  ###
  Dg.createHeaderView = (template) ->
    return Dg.HeaderView.extend
      template: template

  ###
  Helper function to create a layout with customized options

  @param {Object} options The options to configure the layout and views
  @return {Dg.GridLayout} The layout class created
  ###
  # TODO: Improve documentation
  Dg.createDefaultLayout = (options) ->
    regions = options.gridRegions || {}

    regions = reject(
      defaults(regions, gridRegions),
      (object, key, value) ->
        not _.isObject(value)
    )

    if options.collection is undefined
      gridLayout = Dg.GridLayout.extend
        regions: regions
    else
      gridLayout = Dg.GridLayout.extend
        collection: options.collection
        regions: regions

    if not (options.template is undefined)
      gridLayout.prototype.template = options.template

    return gridLayout

  ###
  Defaults i18nKeys used in the translations if `i18n-js` is used.

  You can provide your own i18n keys to match your structure.
  ###
  i18nKeys =
    info: "datagrid.info"
    pager:
      first: "datagrid.pager.first"
      last: "datagrid.pager.last"
      next: "datagrid.pager.next"
      previous: "datagrid.pager.previous"
      filler: "datagrid.pager.filler"

  ###
  Defaults keys for the metadata used accross the data grid
  plugin.

  For more flexibility, it is possible to change the key names
  to match your collection metadata
  ###
  infoKeys =
    from: "from"
    to: "to"
    items: "items"
    totalItems: "totalItems"
    perPage: "perPage"
    pages: "pages"
    page: "page"
    term: "term"
    sort: "sort"
    asc: "A"
    desc: "D"

  ###
  Default configuration to define the data grid regions
  shown in the `Dg.GridLayout`

  This configuration could be overriden to match your
  requirements.
  ###
  gridRegions =
    table:
      selector: ".dgTable"
      regionType: Dg.TableRegion
      view: Dg.TableView
    toolbar:
      selector: ".dgToolbar"
      view: Dg.ToolbarView
    quickSearch:
      selector: ".dgQuickSearch"
      view: Dg.QuickSearchView
    perPage:
      selector: ".dgPerPage"
      view: Dg.PerPageView
    info:
      selector: ".dgInfo"
      view: Dg.InfoView
    pager:
      selector: ".dgPager",
      view: Dg.PagerView

  ###
  Helper function to define part or all the i18n keys
  you want override for all your grids.

  The options are combined with the default ones defined
  by the plugin. Your i18n keys will override the ones
  from the plugins.

  @param {Object} options The i18n keys definition
  ###
  Dg.setupDefaultI18nBindings = (options) ->
    i18nKeys = _.defaults(
      options.i18n || {},
      i18nKeys
    )

  ###
  Helper function to define the metadata keys to
  match your collection metadata structure for all
  your grids.

  The options are combined with the default ones defined
  by the plugin. Your keys will override the ones
  from the plugins.

  @param {Object} options The metadata keys definition
  ###
  Dg.setupDefaultInfoBindings = (options) ->
    infoKeys = _.defaults(
      options.bindings || {},
      infoKeys
    )

  ###
  Helper function to define the grid layout regions
  definition for all your grids.

  The options are combined with the default ones defined
  by the plugin. Your definitions will override the ones
  from the plugins.

  @param {Object} options The grid region definitions
  ###
  Dg.setupDefaultGridLayout = (options) ->
    gridRegions = defaults(
      options.gridRegions || {},
      gridRegions
    )

  return Dg
)(Backbone, Backbone.Marionette, _, $ || window.jQuery || window.Zepto || window.ender)