Dg.TableRegion = class extends Marionette.Region
#    # Open
#    # @param [Backbone.View] view The view to open
#    open: (view) ->
#      @$el.html view.el
#      @$el.show "slide", { direction: "up" }, 1000
#
#    # Show
#    # @param [Backbone.View] view The view to show
#    show: (view) ->
#      if @$el
#        $(@el).hide "slide", { direction: "up" }, 1000, =>
#          super view
#      else
#        super view
