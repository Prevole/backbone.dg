
dataModel = class extends Backbone.Model
  match: (quickSearch) ->
    return @attributes.a.toLowerCase().indexOf(quickSearch) >= 0 or
    @attributes.b.toLowerCase().indexOf(quickSearch) >= 0 or
    @attributes.c.toLowerCase().indexOf(quickSearch) >= 0

  getFromIndex: (index) ->
    switch parseInt(index)
      when 0 then return @get("a")
      when 1 then return @get("b")
      when 2 then return @get("c")

data = [
  new dataModel(a: "test 1", b: "test f", c: "aaa")
  new dataModel(a: "test 2", b: "test e", c: "aaa")
  new dataModel(a: "test 3", b: "test d", c: "aaa")
  new dataModel(a: "test 4", b: "test c", c: "bbb")
  new dataModel(a: "test 5", b: "test b", c: "bbb")
  new dataModel(a: "test 6", b: "test a", c: "ccc")
]

dataCollection = class extends Backbone.Collection
  model: dataModel

  initialize: (options) ->
    @current =
      _.defaults {},
        page: 1
        perPage: 2
        term: ""
        sort: {}

  sync: (method, model, options, error) ->
    storedSuccess = options.success
    options.success = (collection, response) =>
      storedSuccess(collection, response)
      @trigger "fetched"

    localData = _.clone data

    localData = _.filter localData, (model) =>
      return model.match(@current.term.toLowerCase())

    # Filtered items
    @current.items = localData.length

    localData = localData.sort (a, b) =>
      for idx, direction of @current.sort
        if direction
          left = a.getFromIndex(idx).toString().toLowerCase()
          right = b.getFromIndex(idx).toString().toLowerCase()
          comp = left.localeCompare(right)
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
  "<th class='sorting'>Head 1</th>" +
  "<th class='sorting'>Head 2</th>" +
  "<th class='sorting'>Head 3</th>"

rowView = (data) ->
  "<td>#{data.a}</td>" +
  "<td>#{data.b}</td>" +
  "<td>#{data.c}</td>"

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
