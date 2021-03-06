###
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
###
window.Backbone.Dg = window.Dg = ( (Backbone, Marionette, _, $) ->
  Dg = { version: '0.1.0' }

  ###
  Defaults i18nKeys used in the translations if `i18n-js` is used.

  You can provide your own i18n keys to match your structure.
  ###
  i18nKeys =
    info: 'datagrid.info'
    nodata: 'datagrid.nodata'
    loading: 'datagrid.loading'
    perpage: 'datagrid.perpage'
    quicksearch: 'datagrid.quicksearch'

  #= backbone.dg.utils.coffee
  #= backbone.dg.itemview.coffee
  #= backbone.dg.defaultitemview.coffee
  #= backbone.dg.infoview.coffee
  #= backbone.dg.perpageview.coffee
  #= backbone.dg.toolbarview.coffee
  #= backbone.dg.pagerview.coffee
  #= backbone.dg.rowview.coffee
  #= backbone.dg.emptyview.coffee
  #= backbone.dg.loadingview.coffee
  #= backbone.dg.headerview.coffee
  #= backbone.dg.tableview.coffee
  #= backbone.dg.tableregion.coffee
  #= backbone.dg.gridlayout.coffee

  ###
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
  ###
  Dg.createRowView = (options) ->
    unless mandatoryOptions(options, ['template', 'model'])
      throw new Error('template or model is missing in the options')

    return Dg.RowView.extend options

  ###
  Helper function to easily create a `Dg.HeaderView` for
  a table.

  @param {Function,String} template The template of the view
  @return {Dg.HeaderView} Header view class created
  ###
  Dg.createHeaderView = (options) ->
    unless mandatoryOptions(options, ['template'])
      throw new Error('template is missing in the options')

    return Dg.HeaderView.extend options

  # TODO: Comments
  Dg.createTableView = (options) ->
    unless mandatoryOptions(options, ['template', 'itemViewContainer', 'itemView'])
      throw new Error('template, itemViewContainer or itemView is missing in the options')

    return Dg.TableView.extend options

  ###
  Helper function to create a layout with options that overrides the
  default options.

  ```
  # Usable options
  options:
    gridRegions: {...}
    collection: ...
    template: ...
  ```

  @param {Object} options The options to configure the layout and views
  @return {Dg.GridLayout} The layout class created
  ###
  Dg.createGridLayout = (options) ->
    options = options || {}

    regions = options.gridRegions || {}

    # Remove the region flagged to false or are not a region definition
    regions = reject(
      defaults(regions, gridRegions),
      (object, key, value) ->
        not _.isObject(value)
    )

    # Check if the collection is given
    if options.collection is undefined
      gridLayout = Dg.GridLayout.extend
        regions: regions
    else
      gridLayout = Dg.GridLayout.extend
        collection: options.collection
        regions: regions

    # Check if the template is given or use the default one
    if not (options.template is undefined)
      gridLayout.prototype.template = options.template

    return gridLayout

  ###
  Defaults keys for the metadata used accross the data grid
  plugin.

  For more flexibility, it is possible to change the key names
  to match your collection metadata
  ###
  infoKeys =
    from: 'from'
    to: 'to'
    items: 'items'
    totalItems: 'totalItems'
    perPage: 'perPage'
    pages: 'pages'
    page: 'page'
    term: 'term'
    sort: 'sort'
    asc: 'A'
    desc: 'D'

  ###
  Default configuration to define the data grid regions
  shown in the `Dg.GridLayout`

  This configuration could be overriden to match your
  requirements.
  ###
  gridRegions =
    table:
      selector: '.dgTable'
#      regionType: Dg.TableRegion
      view: Dg.TableView
    toolbar:
      selector: '.dgToolbar'
      view: Dg.ToolbarView
    perPage:
      selector: '.dgPerPage'
      view: Dg.PerPageView
    info:
      selector: '.dgInfo'
      view: Dg.InfoView
    pager:
      selector: '.dgPager',
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
    Dg.i18nKeys = _.defaults(
      options.i18n || {},
      Dg.i18nKeys
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

  Dg.getTemplate = (name) ->
    console.log "Get template root #{name}"
    throw new Error "There is no template engine available"

  return Dg
)(
  Backbone,
  Backbone.Marionette,
  _,
  $ || window.jQuery || window.Zepto || window.ender
)