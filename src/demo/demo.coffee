#= demo-data.coffee

DataModel = class extends Backbone.Model
  fields: ["era", "serie", "title", "timeline", "author", "release", "type"]

  match: (quickSearch) ->
    _.reduce(@fields, (sum, attrName) ->
      sum || @attributes[attrName].toString().toLowerCase().indexOf(quickSearch) >= 0
    , false, @)

  getFromIndex: (index) ->
    @get(@fields[index])

models = _.reduce(data, (models, modelData) ->
  models.push new DataModel(modelData)
  models
, [])

dataCollection = class extends Backbone.Collection
  model: DataModel

  initialize: (models, options) ->
    if options is undefined or options.meta is undefined
      customs = {}
    else
      customs = options.meta

    @meta =
      _.defaults customs,
        page: 1
        perPage: 5
        term: ""
        sort: {}

  sync: (method, model, options) ->
    storedSuccess = options.success
    options.success = (collection, response, options) =>
      storedSuccess(collection, response, options)
      @trigger "fetched"

    localData = _.clone(models)

    localData = _.filter localData, (model) =>
      return model.match(@meta.term.toLowerCase())

    # Filtered items
    @meta.items = localData.length

    localData = localData.sort (a, b) =>
      for idx, direction of @meta.sort
        if direction
          left = a.getFromIndex(idx).toString().toLowerCase()
          right = b.getFromIndex(idx).toString().toLowerCase()
          comp = left.localeCompare(right)
          return comp * (if direction == 'A' then 1 else -1) if comp != 0

      return 0

    @meta.pages = Math.ceil(localData.length / @meta.perPage)
    @meta.totalItems = localData.length

    @meta.from = (@meta.page - 1) * @meta.perPage
    @meta.to = @meta.from + @meta.perPage
    localData = localData.slice(@meta.from, @meta.to)
    @meta.from = @meta.from + 1

    options.success(@, localData, update: false)

  refresh: ->
    @reset()
    @fetch()

  getInfo: ->
    @meta

  updateInfo: (options) ->
    @meta = _.defaults options, @meta
    @fetch()

headerView = (data) ->
  "<th class='sorting'>Era</th>" +
  "<th class='sorting'>Serie</th>" +
  "<th class='sorting'>Title</th>" +
  "<th class='sorting'>Timeline</th>" +
  "<th class='sorting'>Author</th>" +
  "<th class='sorting'>Release</th>" +
  "<th class='sorting'>Type</th>"

rowView = (data) ->
  "<td>#{data.era}</td>" +
  "<td>#{data.serie}</td>" +
  "<td>#{data.title}</td>" +
  "<td>#{data.timeline}</td>" +
  "<td>#{data.author}</td>" +
  "<td>#{data.release}</td>" +
  "<td>#{data.type}</td>"

#Dg.registerTemplate("rowView", rowView)
#Dg.registerTemplate("headerView", headerView)

HeaderView = class extends Dg.HeaderView
  template: headerView

RowView = class extends Dg.RowView
  template: rowView

gridLayout = Dg.createDefaultLayout(
  collection: new dataCollection(data)
  gridRegions:
    table:
      view: Dg.TableView.extend
        itemView: RowView
        headerView: HeaderView
)

Dg.registerTemplate "grid2", (data) ->
  "<div class='dgGrid'>" +
    "<div class='clearfix'>" +
      "<div class='dgPagerTop pull-right' />" +
    "</div>" +
    "<div class='clearfix'>" +
      "<div class='dgPerPage' />" +
      "<div class='dgToolbar' />" +
      "<div class='dgQuickSearch' />" +
    "</div>" +
    "<div class='dgTable' />" +
    "<div class='clearfix'>" +
      "<div class='dgPerPageBottom' />" +
      "<div class='dgToolbarBottom' />" +
      "<div class='dgQuickSearchBottom' />" +
    "</div>" +
    "<div class='clearfix'>" +
      "<div class='dgInfo pull-left' />" +
      "<div class='dgPager pull-right' />" +
    "</div>" +
  "</div>"

gridLayout2 = Dg.createDefaultLayout(
  collection: new dataCollection(data)
  template: "grid2"
  gridRegions:
    perPageBottom:
      selector: ".dgPerPageBottom",
      view: Dg.PerPageView
    toolbarBottom:
      selector: ".dgToolbarBottom",
      view: Dg.ToolbarView
    quickSearchBottom:
      selector: ".dgQuickSearchBottom",
      view: Dg.QuickSearchView
    pagerTop:
      selector: ".dgPagerTop",
      view: Dg.PagerView
    table:
      view: Dg.TableView.extend
        itemView: RowView
        headerView: HeaderView
)

gridLayout3 = Dg.createDefaultLayout(
  collection: new dataCollection(data)
  gridRegions:
    perPage: false
    toolbar: false
    table:
      view: Dg.TableView.extend
        itemView: RowView
        headerView: HeaderView
)

table = (data) ->
  "<div>" +
    "<div class=\"clearfix\" />" +
  "</div>"

tableRow = (data) ->
  "<span><strong>Era:&nbsp;</strong>#{data.era} (#{data.serie})</span><br/>" +
  "<span><strong>Title:&nbsp;</strong>#{data.title}</span><br/>" +
  "<span><strong>Timeline:&nbsp;</strong>#{data.timeline}</span><br/>" +
  "<span><strong>Author:&nbsp;</strong>#{data.author}</span></br>" +
  "<span><strong>Release:&nbsp;</strong>#{data.release}</span><br/>" +
  "<span><strong>Type:&nbsp;</strong>#{data.type}</span>"

perpage = (data) ->
  "<div class='form-inline pull-left'>" +
    "<label class='checkbox'>Item per page:&nbsp;</label>" +
    "<select class='per-page input-mini'>" +
      "<option>3</option>" +
      "<option>6</option>" +
      "<option>9</option>" +
      "<option>30</option>" +
      "<option>60</option>" +
      "<option>90</option>" +
    "</select>" +
  "</div>"

gridLayout4 = Dg.createDefaultLayout(
  collection: new dataCollection(data, meta: { perPage: 6 })
  gridRegions:
    toolbar: false
    perPage:
      selector: ".dgPerPage",
      view: Dg.PerPageView.extend
        template: perpage
    table:
      view: Dg.createTableView
        template: table
        itemViewContainer: "div"
        itemView: Dg.createRowView
          model: DataModel
          template: tableRow
          tagName: "div"
          className: "pull-left card"
)

$(document).ready ->
  new Marionette.Region(
    el: "#dg1"
  ).show new gridLayout()

  new Marionette.Region(
    el: "#dg2"
  ).show new gridLayout2()

  new Marionette.Region(
    el: "#dg3"
  ).show new gridLayout3()

  new Marionette.Region(
    el: "#dg4"
  ).show new gridLayout4()
