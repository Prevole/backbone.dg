templates =
  empty: (data) ->
    "<td class='empty'>No Data</td>"

  grid: (data) ->
    "<div class='dgGrid'>" +
      "<div class='clearfix'>" +
        "<div class='dgPerPage' />" +
        "<div class='dgToolbar' />" +
        "<div class='dgQuickSearch' />" +
      "</div>" +
      "<div class='dgTable' />" +
      "<div class='clearfix'>" +
        "<div class='dgInfo pull-left' />" +
        "<div class='dgPager pull-right' />" +
      "</div>" +
    "</div>"

  gridempty: (data) ->
    "<div class='dgLoading'>" +
      "<div class='progress progress-striped active'>" +
        "<div class='bar' style='width:100%'>Loading data</div>" +
      "</div>" +
    "</div>"

  info: (data) ->
    "<span class='info' />"

  pager: (data) ->
    "<div class='pagination pagination-right' />"

  perpage: (data) ->
    "<div class='form-inline pull-left'>" +
      "<label class='checkbox'>Item per page: </label>" +
      "<select class='per-page input-mini'>" +
        "<option>2</option>" +
        "<option>5</option>" +
        "<option>10</option>" +
        "<option>25</option>" +
        "<option>50</option>" +
        "<option>100</option>" +
      "</select>" +
    "</div>"

  quicksearch: (data) ->
    "<div class='form-inline pull-right qs'>" +
      "<label class='checkbox'>Quick search: </label>" +
      "<input type='text' />" +
    "</div>"

  table: (data) ->
    "<table class='table table-striped table-hover table-condensed'>" +
      "<tbody/>" +
    "</table>"

  toolbar: (data) ->
    "<div class='form-inline pull-right buttons btn-group'>" +
      "<button class='btn refresh'>" +
        "<i class='icon-refresh'/>" +
      "</button>" +
      "<button class='btn create'>" +
        "<i class='icon-plus'/>" +
      "</button>" +
    "</div>"

Dg.registerTemplate = (templateName, template) ->
  templates[templateName] = template