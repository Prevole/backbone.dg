describe "datagrid helpers functions", ->
  # Row View creation
  describe "when creating a row view without options", ->
    it "should throw an exeption", ->
      expect(-> Dg.createRowView()).toThrow()

  describe "when creating a row view with only tempalte option", ->
    it "should throw an exeption", ->
      expect(-> Dg.createRowView(template: (data) -> )).toThrow()

  describe "when creating a row view with only model option", ->
    it "should throw an exeption", ->
      expect(-> Dg.createRowView(model: new Backbone.Model())).toThrow()

  describe "when creating a row view with valid options", ->
    it "should return a valid view", ->
      expect( -> Dg.createRowView(
        template: (data) ->
        model: new Backbone.Model()
      )).not.toThrow()

      expect(Dg.createRowView(
        template: (data) ->
        model: new Backbone.Model()
      )).toBeDefined()

  # Header view creation

  describe "when creating a header view without options", ->
    it "should throw an exeption", ->
      expect(-> Dg.createHeaderView()).toThrow()

  describe "when creating a header view with valid options", ->
    it "should return a valid view", ->
      expect(-> Dg.createHeaderView(template: (data) -> )).not.toThrow()
      expect(Dg.createHeaderView(template: (data) -> )).toBeDefined()

  # Table view creation

  describe "when creating a table view without options", ->
    it "should throw an exception", ->
      expect(-> Dg.createTableView()).toThrow()

  describe "when creating a table view with only tempalte option", ->
    it "should throw an exeption", ->
      expect(-> Dg.createTableView(template: (data) -> )).toThrow()

  describe "when creating a table view with only item view container option", ->
    it "should throw an exeption", ->
      expect(-> Dg.createTableView(itemViewContainer: "div")).toThrow()

  describe "when creating a table view with only item view option", ->
    it "should throw an exeption", ->
      rowView = Dg.createRowView(
        template: (data) ->
        model: new Backbone.Model()
      )

      expect(-> Dg.createTableView(itemView: rowView)).toThrow()

  describe "when creating a table view with valid options", ->
    it "should return a valid view", ->
      rowView = Dg.createRowView(
        template: (data) ->
        model: new Backbone.Model()
      )

      expect(-> Dg.createTableView(
        template: (data) ->
        itemViewContainer: "div"
        itemView: rowView
      )).not.toThrow()

      expect(Dg.createTableView(
        template: (data) ->
        itemViewContainer: "div"
        itemView: rowView
      )).toBeDefined()
