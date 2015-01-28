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
  window.Backbone.Dg.Semantic = window.Dg.Semantic = (function(Dg) {
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
        return '<div class="dgGrid">' + '<div class="ui middle aligned grid">' + '<div class="dgPerPage eight wide column" />' + '<div class="dgToolbar eight wide column aligned right" />' + '</div>' + '<div class="dgTable" />' + '<div class="ui middle aligned grid">' + '<div class="dgInfo five wide column" />' + '<div class="dgPager eleven wide column right aligned" />' + '</div>' + '</div>';
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
        return '<div class="ui secondary borderless pagination menu">' + '<a class="item" data-page-type="first">' + '<i class="double angle left icon" />' + '</a>' + '<a class="item" data-page-type="prev">' + '<i class="angle left icon" />' + '</a>' + '<a class="item" data-page-type="more-before">' + '<i class="ellipsis horizontal icon" />' + '</a>' + '<a class="item" data-page-type="page" data-page-content="arabic" />' + '<a class="item" data-page-type="more-after">' + '<i class="ellipsis horizontal icon" />' + '</a>' + '<a class="item" data-page-type="next">' + '<i class="angle right icon" />' + '</a>' + '<a class="item" data-page-type="last">' + '<i class="double angle right icon"/>' + '</a>' + '</div>';
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
        return '<table class="ui celled table segment">' + '<tbody/>' + '</table>';
      },
      toolbar: function(data) {
        return '<div>' + '<div class="ui small left icon input" style="width:250px">' + '<input type="text" data-control="search" placeholder="Quick search..." />' + '<i class="circular search icon"></i>' + '</div>' + '<div class="ui small icon buttons">' + '<div class="ui button" data-control="add" >' + '<i class="add icon" />' + '</div>' + '<div class="ui button" data-control="refresh" >' + '<i class="refresh icon" />' + '</div>' + '</div>' + '</div>';
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