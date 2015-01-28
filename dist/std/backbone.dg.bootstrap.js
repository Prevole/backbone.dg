/*
 * Backbone.Dg - v0.0.1
 * Copyright (c) 2014-03-28 Laurent Prévost (Prevole) <prevole@prevole.ch>
 * Distributed under MIT license
 * https://github.com/prevole/backbone.dg
 */

/*
The templates provided are used to offer a simple and default
implementation that could be used out of the box to render
a DataGrid.

The templates to render a `Row` or `Headers` are not offered as
they really depends on what you want to show your data
 */

(function() {
  window.Backbone.Dg.Bootstrap = window.Dg.Bootstrap = (function(Dg) {
    var isI18n, templates;
    isI18n = function() {
      return !(window.I18n === void 0);
    };
    templates = {
      empty: function(data) {
        var text;
        text = "No data";
        if (isI18n()) {
          text = I18n.t(i18nKeys.nodata);
        }
        return "<td class='empty'>" + text + "</td>";
      },
      grid: function(data) {
        return '<div class="dgGrid">' + '<div class="clearfix">' + '<div class="dgPerPage" />' + '<div class="dgToolbar" />' + '<div class="dgQuickSearch" />' + '</div>' + '<div class="dgTable" />' + '<div class="clearfix">' + '<div class="dgInfo pull-left" />' + '<div class="dgPager pull-right" />' + '</div>' + '</div>';
      },
      gridempty: function(data) {
        var text;
        text = 'Loading data';
        if (isI18n()) {
          text = I18n.t(i18nKeys.loading);
        }
        return '<div class="dgLoading">' + '<div class="progress progress-striped active">' + ("<div class='bar' style='width:100%'>" + text + "</div>") + "</div>" + "</div>";
      },
      info: function(data) {
        return '<span class="info" />';
      },
      pager: function(data) {
        return '<ul class="pagination pagination-right">' + '<li data-page-type="first">' + '<a class="page">' + '&lt;&lt;' + '</a>' + '</li>' + '<li data-page-type="prev">' + '<a class="page">' + '&lt;' + '</a>' + '</li>' + '<li data-page-type="more-before">' + '<a class="page">' + '...' + '</a>' + '</li>' + '<li data-page-type="page">' + '<a class="page" data-page-content="arabic" />' + '</li>' + '<li data-page-type="more-after">' + '<a class="page">' + '...' + '</a>' + '</li>' + '<li data-page-type="next">' + '<a class="page">' + '&gt;' + '</a>' + '</li>' + '<li data-page-type="last">' + '<a class="page">' + '&gt;&gt;' + '</a>' + '</li>' + '</ul>';
      },
      perpage: function(data) {
        var text;
        text = 'Item per page:';
        if (isI18n()) {
          text = I18n.t(i18nKeys.perpage);
        }
        return '<div class="form-inline pull-left">' + ("<label class='checkbox'>" + text + "&nbsp;</label>") + '<select class="per-page input-mini">' + '<option>2</option>' + '<option>5</option>' + '<option>10</option>' + '<option>25</option>' + '<option>50</option>' + '<option>100</option>' + '</select>' + '</div>';
      },
      table: function(data) {
        return '<table class="table table-striped table-hover table-condensed">' + '<tbody/>' + '</table>';
      },
      toolbar: function(data) {
        return '<div class="form-inline pull-right buttons btn-group">' + '<div class="form-inline pull-right qs">' + ("<label class='checkbox' data-control='search'>" + text + "&nbsp;</label>") + '<input type="text" class="form-control" />' + '</div>' + '<button class="btn refresh" data-control="refresh" >' + '<i class="glyphicon glyphicon-refresh" />' + '</button>' + '<button class="btn create" data-control="add" >' + '<i class="glyphicon glyphicon-plus" />' + '</button>' + '</div>';
      }
    };
    Dg.getTemplate = function(name) {
      if (_.isFunction(name)) {
        return name;
      } else {
        return templates[name];
      }
    };

    /*
     *# registerTemplate
    
    Utility function to add a new template entry and/or replacing
    an existing one.
    
    @param {String} templateName The name of the template
    @param {Function,String} template The template to register
     */
    return Dg.registerTemplate = function(templateName, template) {
      return templates[templateName] = template;
    };
  })(Dg);

}).call(this);