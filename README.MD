# Load images asynchronously with JS.

## Install

#### With `npm`

```sh
npm i -S jquery.load_img
```

If you are using a build system:

```js
import jQuery from 'jquery'; // we need jQuery
import load_img_init from 'jquery.load_img'; // import the init function of the plugin

load_img = load_img_init(jQuery); // init the plugin on this copy of jQuery
```

#### Without `npm`

Download the [production version][min] or the [development version][max]
or use [unpkg version][unpkg] directly in your HTML.

[min]: https://raw.github.com/duzun/jquery.load_img/master/dist/load_img.min.js
[max]: https://raw.github.com/duzun/jquery.load_img/master/dist/load_img.js
[unpkg]: https://unpkg.com/jquery.load_img

In your web page:

```html
<script src="jquery.js"></script>

<!-- Include local copy of the lib -->
<script src="dist/jquery.load_img.min.js"></script>

<!-- or CDN version -->
<script src="//unpkg.com/jquery.load_img"></script>
```

## Usage

```javascript
// Callback version
$.load_img(src, function (srcOrFalse, event) {
  if ( srcOrFalse ) {
      var src = srcOrFalse;
      // do something with `this` image and `src`
  }
  else {
      // error loading the image. event.type == "error"
  }
});

// Promise version
$.load_img(src)
.then(
    function onLoad(event) {
        var src = event.src;
        // do something with `event.target` and `src`
    },
    function onError(event) {
        // error loading the image. event.type == "error"
    }
)

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
