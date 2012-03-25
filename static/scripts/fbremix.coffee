class FBRemix
    
    constructor: (@FB) ->
        @window = window
        @window.$j = jQuery.noConflict()
        @cache = new FBRemixApp.Cache @
        @stylist = new FBRemixApp.Styling.NormalStylist()
        
    setupAuthLinks: () ->
        #respond to clicks on the login and logout links
        $j('#auth-loginlink').click () =>
            @FB.login()
        $j('#auth-logoutlink').click () =>
            @FB.logout()

        
    onAuthStatusChange: (response) ->
        if (response.authResponse) 
            #user has auth'd your app and is logged into Facebook
            @FB.api '/me', (me) ->
                if (me.name)                
                    $j('#auth-displayname').html me.name
                    $j('#auth-loggedout').css 'display', 'none'
                    $j('#auth-loggedin').css 'display', 'block'
                    
            @init()
        else
            #user has not auth'd your app, or is not logged into Facebook
            $j('#auth-loggedout').css 'display', 'block'
            $j('#auth-loggedin').css 'display', 'none'
            
    
    init: () ->
        @setupDOM()
        @loadModes()

    
    setupDOM: () ->
        $j('body').append '<div id="remix-container"></div>'
        @container = $j('#remix-container')
    
        
    loadModes: () ->
        for modeInfo in FBRemixApp.modes
            modeInfo.mode.init @
            if modeInfo.default
                defaultMode = modeInfo.mode
            console.log "Loaded mode #{modeInfo.mode.getName()}."
        
        @switchMode defaultMode


    switchMode: (mode) ->
        @mode = mode
        @mode.run()
        console.log "Switched to mode #{@mode.getName()}."

    
    previousItem: () ->
        @mode.previousItem()
            
    
    nextItem: () ->
        @mode.nextItem()
        
    
    refresh: () ->
        @mode.refresh()
                

this.FBRemixApp.FBRemix = FBRemix
