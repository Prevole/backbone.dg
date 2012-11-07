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

  Dg.createRowView = (model, templatePath) ->
    return Dg.RowView.extend
      template: templatePath
      model: model

  Dg.createTableHeaderView = (templatePath) ->
    return Dg.HeaderView.extend
      template: templatePath

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

    return gridLayout

  i18nKeys =
    info: "datagrid.info"
    pager:
      first: "datagrid.pager.first"
      last: "datagrid.pager.last"
      next: "datagrid.pager.next"
      previous: "datagrid.pager.previous"
      filler: "datagrid.pager.filler"

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

  Dg.setupDefaultI18nBindings = (options) ->
    i18nKeys = _.defaults(
      options.i18n || {},
      i18nKeys
    )

  Dg.setupDefaultInfoBindings = (options) ->
    infoKeys = _.defaults(
      options.bindings || {},
      infoKeys
    )

  Dg.setupDefaultGridLayout = (options) ->
    gridRegions = defaults(
      options.gridRegions || {},
      gridRegions
    )

  return Dg
)(Backbone, Backbone.Marionette, _, $ || window.jQuery || window.Zepto || window.ender)