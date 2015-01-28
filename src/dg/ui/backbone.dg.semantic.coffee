# ## TemplateRegistry

###
The templates provided are used to offer a simple and default
implementation that could be used out of the box to render
a DataGrid.

The templates to render a `Row` or `Headers` are not offered as
they really depends on what you want to show your data
###
window.Backbone.Dg.Semantic = window.Dg.Semantic = ( (Dg) ->
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
        '<div class="ui middle aligned grid">' +
          '<div class="dgPerPage eight wide column" />' +
          '<div class="dgToolbar eight wide column aligned right" />' +
        '</div>' +
        '<div class="dgTable" />' +
        '<div class="ui middle aligned grid">' +
          '<div class="dgInfo five wide column" />' +
          '<div class="dgPager eleven wide column right aligned" />' +
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
      '<div class="ui secondary borderless pagination menu">' +
        '<a class="item" data-page-type="first">' +
          '<i class="double angle left icon" />' +
        '</a>' +
        '<a class="item" data-page-type="prev">' +
          '<i class="angle left icon" />' +
        '</a>' +
        '<a class="item" data-page-type="more-before">' +
          '<i class="ellipsis horizontal icon" />' +
        '</a>' +
        '<a class="item" data-page-type="page" data-page-content="arabic" />' +
        '<a class="item" data-page-type="more-after">' +
          '<i class="ellipsis horizontal icon" />' +
        '</a>' +
        '<a class="item" data-page-type="next">' +
          '<i class="angle right icon" />' +
        '</a>' +
        '<a class="item" data-page-type="last">' +
          '<i class="double angle right icon"/>' +
        '</a>' +
      '</div>'

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
      '<table class="ui celled table segment">' +
        '<tbody/>' +
      '</table>'

    # ## toolbar
    # Zone with action buttons to manage the collection (refresh, create)
    toolbar: (data) ->
      '<div>' +
        '<div class="ui small left icon input" style="width:250px">' +
          '<input type="text" data-control="search" placeholder="Quick search..." />' +
          '<i class="circular search icon"></i>' +
        '</div>' +
        '<div class="ui small icon buttons">' +
          '<div class="ui button" data-control="add" >' +
            '<i class="add icon" />' +
          '</div>' +
          '<div class="ui button" data-control="refresh" >' +
            '<i class="refresh icon" />' +
          '</div>' +
        '</div>' +
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