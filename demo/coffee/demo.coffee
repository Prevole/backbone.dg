data = {

}

dataModel = class extends Backbone.Model

dataCollection = class extends Backbone.Collection
  model: dataModel

  comparator: (model) ->
    return

  filter: (model) ->

headerView = (data) ->
  return "<th>TestHeader</th>"

rowView = (data) ->
  return "<td>TestRow</td>"

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
  layout = new gridLayout()
  layout.render()