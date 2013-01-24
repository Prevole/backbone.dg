describe "datagrid initialization", ->

  describe "when a grid is created with", ->

    grid = null

    beforeEach ->
      grid =  Dg.createDefaultLayout()

    describe "defaults", ->
      it "should have default table region", ->
        expect(grid.prototype.regions.table).toBeDefined()

      it "should have default toolbar region", ->
        expect(grid.prototype.regions.toolbar).toBeDefined()

      it "should have default quickSearch region", ->
        expect(grid.prototype.regions.quickSearch).toBeDefined()

      it "should have default perPage region", ->
        expect(grid.prototype.regions.perPage).toBeDefined()

      it "should have default info region", ->
        expect(grid.prototype.regions.info).toBeDefined()

      it "should have default pager region", ->
        expect(grid.prototype.regions.pager).toBeDefined()

      it "should not have any collection", ->
        expect(grid.prototype.collection).toBeUndefined()

      it "should have a default template", ->
        expect(grid.prototype.template).toBeDefined()

  describe "when a grid is created without", ->
    grid = null
    template = null
    collection = null

    beforeEach ->
      template = (data) ->
        "something"

      Dg.registerTemplate "template", template

      collection = new Backbone.Collection()

      grid =  Dg.createDefaultLayout(
        collection: collection
        template: "template"
        gridRegions:
          perPage: false
          toolbar: false
          quickSearch: false
          pager: false
          info: false
          table: false
      )

    describe "defaults", ->
      it "should not have table region", ->
        expect(grid.prototype.regions.table).toBeUndefined()

      it "should not have toolbar region", ->
        expect(grid.prototype.regions.toolbar).toBeUndefined()

      it "should not have quickSearch region", ->
        expect(grid.prototype.regions.quickSearch).toBeUndefined()

      it "should not have perPage region", ->
        expect(grid.prototype.regions.perPage).toBeUndefined()

      it "should not have info region", ->
        expect(grid.prototype.regions.info).toBeUndefined()

      it "should not have pager region", ->
        expect(grid.prototype.regions.pager).toBeUndefined()

      it "should have the collection given", ->
        expect(grid.prototype.collection).toBe(collection)

      it "should have the template give", ->
        expect(grid.prototype.template).toBe(template)
