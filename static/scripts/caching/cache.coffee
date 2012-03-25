class Cache

    constructor: ()->
        @items = []
        
    
    add: (keys, value) ->
        items.add { keys: keys, value: value, timestamp: new Date().getTime() }
        
        
    get: (keys) ->
        for item in @items
            found = true
            for k,v of keys
                if item[k] != v
                    found = false
                    break
            if found
                return item.value
        
        
this.FBRemixApp.Cache = Cache
