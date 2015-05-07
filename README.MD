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

$.load_img.purge_cache() ; // remove all image sources from cache

```
