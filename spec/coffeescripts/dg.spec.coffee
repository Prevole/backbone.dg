describe "datagrid initialization", ->

  describe "when a grid is created", ->

    grid = null

    beforeEach ->
      grid =  Dg.createDefaultLayout()

    describe "with defaults", ->
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

      it "should have default table region", ->
        expect(grid.prototype.regions.pager).toBeDefined()

      it "should not have any collection", ->
        expect(grid.prototype.collection).toBeUndefined()

      it "should have a default template", ->
        expect(grid.prototype.template).toBeDefined()