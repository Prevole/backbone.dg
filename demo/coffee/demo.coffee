data = [
  {test: "test 1"}
  {test: "test 2"}
  {test: "test 3"}
  {test: "test 4"}
  {test: "test 5"}
  {test: "test 6"}
]

dataModel = class extends Backbone.Model
  match: (quickSearch) ->
    return @test.toLowerCase().indexOf(quickSearch) >= 0

dataCollection = class extends Backbone.Collection
  model: dataModel

  initialize: (options) ->
     @current =
       _.defaults {},
         page: 1
         ipp: 2
         quickSearch: ""
         sorting: {}

  sync: (method, model, options, error) ->
    storedSuccess = options.success
    options.success = (collection, response) =>
      storedSuccess(collection, response)
      @trigger "fetched"

    localData = data

    if @current.quickSearch != ""
      localData = _.filter localData, (model) =>
        return model.match(@current.quickSearch.toLowerCase())

#    if (req.sort) {
#      data = data.sort(function(a, b) {
#
#        for (var i = 0; i < req.sort.length; i++) {
#
#          var parts = req.sort[i].split(' ');
#          var attr = parts[0]
#          var direction = parts[1];
#
#          a = a[attr].toString().toLowerCase();
#          b = b[attr].toString().toLowerCase();
#
#          var comp = a.localeCompare(b);
#          if (comp != 0) {
#            return comp * (direction == 'asc' ? 1 : -1);
#          }
#        }
#        return 0;
#      });
#    }

    json = localData
#    json = {
#      info: data.length
#      data: data
#    }

    response = $.Deferred()
    response.resolve(json)
    options.success(json)

    console.log localData

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
