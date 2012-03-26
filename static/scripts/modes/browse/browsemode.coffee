class BrowseMode extends FBRemixApp.Modes.RemixMode

    run: () ->
        super()
        $j('body').addClass 'mode-browse'
        @view = @getView @fbremix.location
        @view.init()
        

    getView: (location) ->
        new FBRemixApp.Modes.Browse.WallView(@)
        
        
    getName: () ->
        return 'Browse'


this.FBRemixApp.Modes.Browse = {}
this.FBRemixApp.modes.push { mode: new BrowseMode(), default: true }

