class NormalStylist extends FBRemixApp.Styling.Stylist
    
    @fontStyles = {                
        text: "'Droid Sans', sans-serif;", 
        heading: "'Droid Serif', serif"
    }
    
    @palettes = {
        heading: '#555', 
        text: '#333',
        random: {
            white: {
                dark: [
                    [ "#403634", "#735D49", "#593939" ]
                ]
            }
        }
    }
    
    constructor: (options) ->
        super options
        
        fonts = NormalStylist.fontStyles

        fontSizes = {
            tiny: 10,
            smallest: 12,
            small: 14,
            medium: 18,
            large: 24,
            larger: 40
            largest: 64,
            huge: 96
        }
            
        palette = NormalStylist.palettes
        
        @theme = {
            fonts: fonts,
            fontSizes: fontSizes,
            palette: palette,
            randomPalette: FBRemixApp.Utils.pickRandom palette.random.white.dark
        }

    apply: (element) ->
        @applyProperty element, 'color', (elem, matchedType) =>
                                                if matchedType is 'random'
                                                    color = FBRemixApp.Utils.pickRandom @theme.randomPalette
                                                else
                                                    color = @theme.palette[matchedType] ? '#999'
                                                elem.css 'color', color
    
        @applyProperty element, 'font-size', (elem, matchedType) =>
                                                fontSize = @theme.fontSizes[matchedType] ? '12px'
                                                elem.css 'font-size', @getResponsiveFontSize(fontSize)
                                                
                                                if fontSize <= 16
                                                    elem.css 'line-height', '1.4em'
                                                else if fontSize <= 24
                                                    elem.css 'line-height', '1.2em'
                                                else if fontSize <= 40
                                                    elem.css 'line-height', '1.1em'
                                                else if fontSize <= 60
                                                    elem.css 'line-height', '1.1em'
                                                else
                                                    elem.css 'line-height', '0.9em'
        
        @applyProperty element, 'font-family-', (elem, matchedType) =>
                                        elem.css 'font-family', @theme.fonts[matchedType]

        
this.FBRemixApp.Styling.NormalStylist = NormalStylist




