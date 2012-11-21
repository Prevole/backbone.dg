
DataModel = class extends Backbone.Model
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
  new DataModel({
    era: "Pre Republic",
    title: "Into the Void",
    author: "Tim Lebbon",
    release: "2013",
    series: "Dawn of the Jedi",
    timeline: "-25793",
    type: "Book"
  }),
  new DataModel({
    era: "Old Republic",
    title: "Precipice",
    author: "John Jackson Miller",
    release: "2009",
    series: "Lost Tribe of the Sith",
    timeline: "-5000",
    type: "E-book"
  }),
  new DataModel({
    era: "Old Republic",
    title: "Skyborn",
    author: "John Jackson Miller",
    release: "2009",
    series: "Lost Tribe of the Sith",
    timeline: "-5000",
    type: "E-book"
  }),
  new DataModel({
    era: "Old Republic",
    title: "Paragon",
    author: "John Jackson Miller",
    release: "2010",
    series: "Lost Tribe of the Sith",
    timeline: "-4985",
    type: "E-book"
  }),
  new DataModel({
    era: "Old Republic",
    title: "Savior",
    author: "John Jackson Miller",
    release: "2010",
    series: "Lost Tribe of the Sith",
    timeline: "-4975",
    type: "E-book"
  }),
  new DataModel({
    era: "Old Republic",
    title: "Purgatory",
    author: "John Jackson Miller",
    release: "2010",
    series: "Lost Tribe of the Sith",
    timeline: "-3960",
    type: "E-book"
  }),
  new DataModel({
    era: "Old Republic",
    title: "Revan",
    author: "Drew Karpyshyn",
    release: "2011",
    series: "The Old Republic",
    timeline: "-3954",
    type: "Book"
  }),
  new DataModel({
    era: "Old Republic",
    title: "Deceived",
    author: "Paul S. Kemp",
    release: "2011",
    series: "The Old Republic",
    timeline: "-3953",
    type: "Book"
  }),
  new DataModel({
    era: "Old Republic",
    title: "Revan",
    author: "Drew Karpyshyn",
    release: "2011",
    series: "The Old Republic",
    timeline: "-3954",
    type: "Book"
  }),
  new DataModel({
    era: "Old Republic",
    title: "Pantheon",
    author: "John Jackson Miller",
    release: "2011",
    series: "Lost Tribe of the Sith",
    timeline: "-3000",
    type: "E-book"
  }),
  new DataModel({
    era: "Old Republic",
    title: "Secrets",
    author: "John Jackson Miller",
    release: "2012",
    series: "Lost Tribe of the Sith",
    timeline: "-3000",
    type: "E-book"
  }),
  new DataModel({
    era: "Old Republic",
    title: "Pandemonium",
    author: "John Jackson Miller",
    release: "2012",
    series: "Lost Tribe of the Sith",
    timeline: "-2975",
    type: "E-book"
  }),
  new DataModel({
    era: "Old Republic",
    title: "Red Harvest",
    author: "Joe Schreiber",
    release: "2010",
    series: "-",
    timeline: "-3645",
    type: "Book"
  })
]

dataCollection = class extends Backbone.Collection
  model: DataModel

  initialize: (options) ->
    @current =
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
