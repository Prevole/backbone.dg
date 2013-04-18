###
## Dg.TableRegion

This class offers the possibility to add some transition effects
when the whole data grid is shown to the user.
###
Dg.TableRegion = Marionette.Region.extend
###!
    Open
    @param [Backbone.View] view The view to open
    open: (view) ->
      @$el.html view.el
      @$el.show "slide", { direction: "up" }, 1000

    Show
    @param [Backbone.View] view The view to show
    show: (view) ->
      if @$el
        $(@el).hide "slide", { direction: "up" }, 1000, =>
          super view
      else
        super view
!###