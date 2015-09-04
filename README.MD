# Load images asynchronously with JS.

## Usage
```javascript
$.load_img(src, function (srcOrFalse, event) {
  if ( srcOrFalse ) {
      var src = srcOrFalse;
      // do something with `this` image and `src`
  }
  else {
      // error loading the image. event.type == "error"
  }
});


// Check whether an URL is in cache
if ( $.load_img.inCache(src) ) {
    // ...
}

// Check whether an image exists synchronously
switch ( $.load_img.exists(src) ) {
    case true:
        // Image loaded, it is safe to use it
    break;
    
    case false:
        // Image loaded, but doesn't exists (or some error), it is not safe to use it
    break;
    
    case undefined:
        // Image not loaded yet, call $.load_img(src) ...
    break;
}

// With callback, similar to $.load_img(src, cb):
$.load_img.exists(src, function(src) {
    if ( src ) {
        // image loaded and exists
    }
    else {
        // image doesn't exist
    }
});

// remove all image sources from cache
$.load_img.purgeCache() ; 

```
