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

    resizeByLength: (text) ->
        if text.length < 6
            fontSizeClass = 'font-size-largest'
        else if text.length < 20
            fontSizeClass = 'font-size-larger'
        else if text.length < 60
            fontSizeClass = 'font-size-large'
        else if text.length < 300
            fontSizeClass = 'font-size-medium'
        else
            fontSizeClass = 'font-size-small'
        return fontSizeClass    

this.FBRemixApp.Modes.Browse = {}
this.FBRemixApp.modes.push { mode: new BrowseMode(), default: true }

