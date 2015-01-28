describe("datagrid helpers functions", function() {
  describe("when creating a row view without options", function() {
    return it("should throw an exeption", function() {
      return expect(function() {
        return Dg.createRowView();
      }).toThrow();
    });
  });
  describe("when creating a row view with only tempalte option", function() {
    return it("should throw an exeption", function() {
      return expect(function() {
        return Dg.createRowView({
          template: function(data) {}
        });
      }).toThrow();
    });
  });
  describe("when creating a row view with only model option", function() {
    return it("should throw an exeption", function() {
      return expect(function() {
        return Dg.createRowView({
          model: new Backbone.Model()
        });
      }).toThrow();
    });
  });
  describe("when creating a row view with valid options", function() {
    return it("should return a valid view", function() {
      expect(function() {
        return Dg.createRowView({
          template: function(data) {},
          model: new Backbone.Model()
        });
      }).not.toThrow();
      return expect(Dg.createRowView({
        template: function(data) {},
        model: new Backbone.Model()
      })).toBeDefined();
    });
  });
  describe("when creating a header view without options", function() {
    return it("should throw an exeption", function() {
      return expect(function() {
        return Dg.createHeaderView();
      }).toThrow();
    });
  });
  describe("when creating a header view with valid options", function() {
    return it("should return a valid view", function() {
      expect(function() {
        return Dg.createHeaderView({
          template: function(data) {}
        });
      }).not.toThrow();
      return expect(Dg.createHeaderView({
        template: function(data) {}
      })).toBeDefined();
    });
  });
  describe("when creating a table view without options", function() {
    return it("should throw an exception", function() {
      return expect(function() {
        return Dg.createTableView();
      }).toThrow();
    });
  });
  describe("when creating a table view with only tempalte option", function() {
    return it("should throw an exeption", function() {
      return expect(function() {
        return Dg.createTableView({
          template: function(data) {}
        });
      }).toThrow();
    });
  });
  describe("when creating a table view with only item view container option", function() {
    return it("should throw an exeption", function() {
      return expect(function() {
        return Dg.createTableView({
          itemViewContainer: "div"
        });
      }).toThrow();
    });
  });
  describe("when creating a table view with only item view option", function() {
    return it("should throw an exeption", function() {
      var rowView;
      rowView = Dg.createRowView({
        template: function(data) {},
        model: new Backbone.Model()
      });
      return expect(function() {
        return Dg.createTableView({
          itemView: rowView
        });
      }).toThrow();
    });
  });
  describe("when creating a table view with valid options", function() {
    return it("should return a valid view", function() {
      var rowView;
      rowView = Dg.createRowView({
        template: function(data) {},
        model: new Backbone.Model()
      });
      expect(function() {
        return Dg.createTableView({
          template: function(data) {},
          itemViewContainer: "div",
          itemView: rowView
        });
      }).not.toThrow();
      return expect(Dg.createTableView({
        template: function(data) {},
        itemViewContainer: "div",
        itemView: rowView
      })).toBeDefined();
    });
  });
  describe("when a grid layout is created with default options", function() {
    var grid;
    grid = Dg.createGridLayout();
    it("should have default table region", function() {
      return expect(grid.prototype.regions.table).toBeDefined();
    });
    it("should have default toolbar region", function() {
      return expect(grid.prototype.regions.toolbar).toBeDefined();
    });
    it("should have default perPage region", function() {
      return expect(grid.prototype.regions.perPage).toBeDefined();
    });
    it("should have default info region", function() {
      return expect(grid.prototype.regions.info).toBeDefined();
    });
    it("should have default pager region", function() {
      return expect(grid.prototype.regions.pager).toBeDefined();
    });
    it("should not have any collection", function() {
      return expect(grid.prototype.collection).toBeUndefined();
    });
    return it("should have a default template", function() {
      return expect(grid.prototype.template).toBeDefined();
    });
  });
  return describe("when a grid is created without default options", function() {
    var collection, grid, template;
    template = function(data) {
      return "something";
    };
    Dg.registerTemplate("template", template);
    collection = new Backbone.Collection();
    grid = Dg.createGridLayout({
      collection: collection,
      template: "template",
      gridRegions: {
        perPage: false,
        toolbar: false,
        quickSearch: false,
        pager: false,
        info: false,
        table: false
      }
    });
    it("should not have table region", function() {
      return expect(grid.prototype.regions.table).toBeUndefined();
    });
    it("should not have toolbar region", function() {
      return expect(grid.prototype.regions.toolbar).toBeUndefined();
    });
    it("should not have quickSearch region", function() {
      return expect(grid.prototype.regions.quickSearch).toBeUndefined();
    });
    it("should not have perPage region", function() {
      return expect(grid.prototype.regions.perPage).toBeUndefined();
    });
    it("should not have info region", function() {
      return expect(grid.prototype.regions.info).toBeUndefined();
    });
    it("should not have pager region", function() {
      return expect(grid.prototype.regions.pager).toBeUndefined();
    });
    return it("should have the collection given", function() {
      return expect(grid.prototype.collection).toBe(collection);
    });
  });
});
