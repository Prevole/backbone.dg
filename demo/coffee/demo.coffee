
dataModel = class extends Backbone.Model
  match: (quickSearch) ->
    return @attributes.test.toLowerCase().indexOf(quickSearch) >= 0

  getFromIndex: (index) ->
    switch parseInt(index)
      when 0 then return @get("test")

data = [
  new dataModel(test: "test 1")
  new dataModel(test: "test 2")
  new dataModel(test: "test 3")
  new dataModel(test: "test 4")
  new dataModel(test: "test 5")
  new dataModel(test: "test 6")
]

dataCollection = class extends Backbone.Collection
  model: dataModel

  initialize: (options) ->
     @current =
       _.defaults {},
         page: 1
         perPage: 2
         quickSearch: ""
         sort: {}

  sync: (method, model, options, error) ->
    storedSuccess = options.success
    options.success = (collection, response) =>
      storedSuccess(collection, response)
      @trigger "fetched"

    localData = _.clone data

    if @current.term and @current.term != ""
      localData = _.filter localData, (model) =>
        return model.match(@current.term.toLowerCase())

    # Filtered items
    @current.items = localData.length

    if @current.sort
      localData = localData.sort (a, b) =>
        for idx, direction of @current.sort
          if direction
            a = a.getFromIndex(idx).toString().toLowerCase()
            b = b.getFromIndex(idx).toString().toLowerCase()

            comp = a.localeCompare b

            return comp * (if direction == 'A' then 1 else -1) if comp != 0

        return 0

    @current.pages = Math.ceil(localData.length / @current.perPage)
    @current.totalItems = localData.length

    @current.from = (@current.page - 1) * @current.perPage
    @current.to = @current.from + @current.perPage
    localData = localData.slice(@current.from, @current.to)
    @current.from = @current.from + 1

    response = $.Deferred()
    response.resolve(localData)
    options.success(localData)

    response

  refresh: ->
    @reset()
    @fetch()

  getInfo: ->
    @current

  updateInfo: (options) ->
    @current = _.defaults options, @current
    @fetch()

headerView = (data) ->
  return "<th class='sorting'>TestHeader</th>"

rowView = (data) ->
  return "<td>#{data.test}</td>"

#Dg.registerTemplate("rowView", rowView)
#Dg.registerTemplate("headerView", headerView)

HeaderView = class extends Dg.HeaderView
  template: headerView

RowView = class extends Dg.RowView
  template: rowView

gridLayout = Dg.createDefaultLayout(
  collection: new dataCollection()
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
