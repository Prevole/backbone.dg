describe "datagrid helpers functions", ->

  describe "when creating a row view", ->
    describe "without options", ->
      it "should throw an exeption", ->
        expect(-> Dg.createRowView()).toThrow()

    describe "with only tempalte option", ->
      it "should throw an exeption", ->
        expect(-> Dg.createRowView(template: (data) -> )).toThrow()

    describe "with only model option", ->
      it "should throw an exeption", ->
        expect(-> Dg.createRowView(model: new Backbone.Model())).toThrow()

    describe "with valid options", ->
      it "should return a valid view", ->
        expect( -> Dg.createRowView(
          template: (data) ->
          model: new Backbone.Model()
        )).not.toThrow()

        expect(Dg.createRowView(
          template: (data) ->
          model: new Backbone.Model()
        )).toBeDefined()

  describe "when creating a header view", ->
    describe "without options", ->
      it "should throw an exeption", ->
        expect(-> Dg.createHeaderView()).toThrow()

    describe "with valid options", ->
      it "should return a valid view", ->
        expect( -> Dg.createHeaderView(template: (data) -> )).not.toThrow()
        expect(Dg.createHeaderView(template: (data) -> )).toBeDefined()
