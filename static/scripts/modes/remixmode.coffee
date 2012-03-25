class RemixMode


    init: (@fbremix) ->
        
        
    run: () ->


    previousItem: () ->
        @view.previousItem()


    nextItem: () ->
        @view.nextItem()


    refresh: () ->
        @view.displayItem()


    switchBg: () ->
        @refresh()

    
    applyStyle: (item) ->
        @fbremix.stylist.apply item


    
this.FBRemixApp.Modes = {}
this.FBRemixApp.Modes.RemixMode = RemixMode
this.FBRemixApp.modes = []
