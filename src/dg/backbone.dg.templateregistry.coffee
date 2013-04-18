# ## TemplateRegistry

###
The templates provided are used to offer a simple and default
implementation that could be used out of the box to render
a DataGrid.

The templates to render a `Row` or `Headers` are not offered as
they really depends on what you want to show your data
###
templates =
  # ## empty
  # View used when the collection is empty
  empty: (data) ->
    text = "No data"
    text = I18n.t i18nKeys['nodata'] if isI18n()

    "<td class='empty'>#{text}</td>"

  # ## grid
  # General layout to present all the data grid elements
  grid: (data) ->
    '<div class="dgGrid">' +
      '<div class="clearfix">' +
        '<div class="dgPerPage" />' +
        '<div class="dgToolbar" />' +
        '<div class="dgQuickSearch" />' +
      '</div>' +
      '<div class="dgTable" />' +
      '<div class="clearfix">' +
        '<div class="dgInfo pull-left" />' +
        '<div class="dgPager pull-right" />' +
      '</div>' +
    '</div>'

  # ## gridempty
  # View used when the data are under loading
  gridempty: (data) ->
    text = 'Loading data'
    text = I18n.t i18nKeys['loading'] if isI18n()

    '<div class="dgLoading">' +
      '<div class="progress progress-striped active">' +
        "<div class='bar' style='width:100%'>#{text}</div>" +
      "</div>" +
    "</div>"

  # ## info
  # Info zone about the collection currently shown
  info: (data) ->
    '<span class="info" />'

  # ## pager
  # Pager container to present the paging elements
  pager: (data) ->
    '<div class="pagination pagination-right" />'

  # ## perpage
  # Zone for the number of items per page choice
  perpage: (data) ->
    text = 'Item per page:'
    text = I18n.t i18nKeys['perpage'] if isI18n()

    '<div class="form-inline pull-left">' +
      "<label class='checkbox'>#{text}&nbsp;</label>" +
      '<select class="per-page input-mini">' +
        '<option>2</option>' +
        '<option>5</option>' +
        '<option>10</option>' +
        '<option>25</option>' +
        '<option>50</option>' +
        '<option>100</option>' +
      '</select>' +
    '</div>'

  # ## quicksearch
  # Text search field to filter the collection
  quicksearch: (data) ->
    text = 'Quick search:'
    text = I18n.t i18nKeys['quicksearch'] if isI18n()

    '<div class="form-inline pull-right qs">' +
      "<label class='checkbox'>#{text}&nbsp;</label>" +
      '<input type="text" />' +
    '</div>'

  # ## table
  # Container for the collection rendering
  table: (data) ->
    '<table class="table table-striped table-hover table-condensed">' +
      '<tbody/>' +
    '</table>'

  # ## toolbar
  # Zone with action buttons to manage the collection (refresh, create)
  toolbar: (data) ->
    '<div class="form-inline pull-right buttons btn-group">' +
      '<button class="btn refresh">' +
        '<i class="icon-refresh" />' +
      '</button>' +
      '<button class="btn create">' +
        '<i class="icon-plus" />' +
      '</button>' +
    '</div>'

###
## registerTemplate

Utility function to add a new template entry and/or replacing
an existing one.

@param {String} templateName The name of the template
@param {Function,String} template The template to register
###
# TODO: Correct doc
Dg.registerTemplate = (templateName, template) ->
  templates[templateName] = template