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

  initialize: (options) ->
    @meta =
      _.defaults {},
        page: 1
        perPage: 5
        term: ""
        sort: {}

  sync: (method, model, options, error) ->
    storedSuccess = options.success
    options.success = (collection, response) =>
      storedSuccess(collection, response)
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

    response = $.Deferred()
    response.resolve(localData)
    options.success(localData)

    response

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

$(document).ready ->
  new Marionette.Region(
    el: "#dg"
  ).show new gridLayout()
