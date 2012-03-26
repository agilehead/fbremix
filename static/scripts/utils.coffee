this.FBRemixApp = {}
this.FBRemixApp.Utils = {}

class Loader
    constructor: () ->
        @loadFonts()

    loadFonts: () ->
        window.WebFontConfig = google: { 
            families: [ 
                'Droid+Sans::latin', 
                'Abril+Fatface::latin', 
                'Bevan::latin',
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

class PeriodicEval
    constructor: (predicate, interval, callback, timeOut) ->
        timeOut = timeOut ? 5000
        startTime = new Date().getTime()
        f = () => 
            if predicate()
                if callbackDelay?
                    setTimeout callback, 0
                else
                    callback()
            else
                timeNow = new Date().getTime()
                if (timeNow - startTime) < timeOut
                    setTimeout f, interval
                else
                    console.log "Timed out #{timeOut}ms."
        f()

this.FBRemixApp.Utils.Loader = Loader
this.FBRemixApp.Utils.PeriodicEval = PeriodicEval

this.FBRemixApp.Utils.random = (n) ->
    Math.floor(Math.random() * n)

this.FBRemixApp.Utils.pickRandom = (array) ->
    rand = Math.floor(Math.random() * array.length)
    return array[rand]

