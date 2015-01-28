# ## TemplateRegistry

###
The templates provided are used to offer a simple and default
implementation that could be used out of the box to render
a DataGrid.

The templates to render a `Row` or `Headers` are not offered as
they really depends on what you want to show your data
###
window.Backbone.Dg.Bootstrap = window.Dg.Bootstrap = ( (Dg) ->
  isI18n = ->
    return not (window.I18n is undefined)

  templates =
    # ## empty
    # View used when the collection is empty
    empty: (data) ->
      text = "No data"
      text = I18n.t(i18nKeys.nodata) if isI18n()

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
      text = I18n.t(i18nKeys.loading) if isI18n()

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
      '<ul class="pagination pagination-right">' +
        '<li data-page-type="first">' +
          '<a class="page">' +
            '&lt;&lt;' +
          '</a>' +
        '</li>' +
        '<li data-page-type="prev">' +
          '<a class="page">' +
            '&lt;' +
          '</a>' +
        '</li>' +
        '<li data-page-type="more-before">' +
          '<a class="page">' +
            '...' +
          '</a>' +
        '</li>' +
        '<li data-page-type="page">' +
          '<a class="page" data-page-content="arabic" />' +
        '</li>' +
        '<li data-page-type="more-after">' +
          '<a class="page">' +
            '...' +
          '</a>' +
        '</li>' +
        '<li data-page-type="next">' +
          '<a class="page">' +
            '&gt;' +
          '</a>' +
        '</li>' +
        '<li data-page-type="last">' +
          '<a class="page">' +
            '&gt;&gt;' +
          '</a>' +
        '</li>' +
      '</ul>'

    # ## perpage
    # Zone for the number of items per page choice
    perpage: (data) ->
      text = 'Item per page:'
      text = I18n.t(i18nKeys.perpage) if isI18n()

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
        '<div class="form-inline pull-right qs">' +
          "<label class='checkbox' data-control='search'>#{text}&nbsp;</label>" +
          '<input type="text" class="form-control" />' +
        '</div>' +
        '<button class="btn refresh" data-control="refresh" >' +
          '<i class="glyphicon glyphicon-refresh" />' +
        '</button>' +
        '<button class="btn create" data-control="add" >' +
          '<i class="glyphicon glyphicon-plus" />' +
        '</button>' +
      '</div>'

  Dg.getTemplate = (name) ->
    if _.isFunction(name) then name else templates[name]

  ###
  ## registerTemplate

  Utility function to add a new template entry and/or replacing
  an existing one.

  @param {String} templateName The name of the template
  @param {Function,String} template The template to register
  ###
  Dg.registerTemplate = (templateName, template) ->
    templates[templateName] = template

#  ###
#  ## getTemplate
#
#  Retrieve a template from the template registry
#
#  @param {String} templateName The name of the template
#  @return {Function,String} The template found, throw an error if the template name is unknown
#  ###
#  Dg.getTemplate = (templateName) ->
#    throw new Error 'Unknown template' unless templates[templateName]
#    return templates[templateName]
)(Dg)