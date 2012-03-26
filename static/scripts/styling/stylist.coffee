class Stylist

    constructor: (@options) ->

    applyProperty: (element, className, func) ->
        selector = "[class^=\"#{className}-\"], [class*=\" #{className}-\"]"
        toBeStyled = element.find(selector).andSelf().filter(selector)
        for elem in toBeStyled
            elem = jQuery(elem)
            if not elem.hasClass "#{className}-applied"                
                classes = elem.attr('class').split(/\s+/)
                matchedType = (c.split('-')[c.split('-').length-1] for c in classes when new RegExp("^#{className}\-").test c)[0]
                elem.addClass "#{className}-applied"
                func elem, matchedType
        
        
    getResponsiveFontSize: (size) ->
        return size + 'px'


    #http://jsfiddle.net/xLF38/
    # We don't use this right now, since facebook images are mostly cross domain (served via akamai)
    # Check CORS issues with drawImage.
    getDominantColor: (imgEl) ->
        blockSize = 5 #only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0} #for non-supporting envs
        canvas = document.createElement('canvas')
        context = canvas.getContext && canvas.getContext('2d')
        i = -4
        rgb = {r:0,g:0,b:0}
        count = 0
        
        if (!context)
            return defaultRGB
        
        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height
        width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width
        
        context.drawImage(imgEl, 0, 0)
        
        try 
            data = context.getImageData(0, 0, width, height)
        
        catch e
            # security error, img on diff domain */alert('x')
            return defaultRGB
        
        length = data.data.length
        
        while ( (i += blockSize * 4) < length ) 
            ++count
            rgb.r += data.data[i]
            rgb.g += data.data[i+1]
            rgb.b += data.data[i+2]
        
        # ~~ used to floor values
        rgb.r = ~~(rgb.r/count)
        rgb.g = ~~(rgb.g/count)
        rgb.b = ~~(rgb.b/count)
        
        return rgb;


this.FBRemixApp.Styling = {}
this.FBRemixApp.Styling.Stylist = Stylist

