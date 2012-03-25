this.FBRemixApp = {}

class Loader
    constructor: () ->
        @loadFonts()

    loadFonts: () ->
        window.WebFontConfig = google: { 
            families: [ 
                'Droid+Sans::latin', 
                'Droid+Serif::latin', 
                'Open+Sans+Condensed:700:latin', 
                'Bevan::latin',
                'Ubuntu::latin'
            ]}
        googleApiSrc = if 'https:' == window.document.location.protocol then 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js' else 'http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js'
        @loadScript googleApiSrc, { async: 'true' }
        
    loadScript: (src, attributes) ->
        console.log "loading #{src}."

        script = window.document.createElement('script')
        script.type = 'text/javascript'
        script.src = src
        
        for name, val of attributes
            script[name] = val
            
        window.document.getElementsByTagName('head')[0].appendChild(script)

this.FBRemixApp.Loader = Loader
