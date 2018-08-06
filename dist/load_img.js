(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('loadImg', ['exports'], factory) :
  (factory((global.loadImg = {})));
}(this, (function (exports) { 'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  /**
   *  Load images asynchronously and cache them.
   *
   *  @license MIT
   *  @git https://github.com/duzun/jquery.load_img
   *  @author Dumitru Uzun (DUzun.Me)
   *  @version 1.3.0
   */

  // ---------------------------------------------------------------------------
  var VERSION = '1.3.0';

  function init($) {
      var undefined; //jshint ignore:line
      var UNDEFINED = undefined + '';

      // ---------------------------------------------------------------------------
      var document = window.document,
          cache = {};

      /**
       * Load an image to cache.
       *
       * @param string src - source URL of the iamge
       * @param callback clb.call(img: $(Image), src|false, event: $.Event)
       *
       * @return $(Image) element
       */
      function load_img(src, clb) {
          var img = $('<img />'),
              hasClb = 'function' == typeof clb,
              defered = hasClb ? undefined : new $.Deferred(),
              ret = function ret(evt) {
              var type = evt.type,
                  error = type == 'error';
              evt.src = src;
              cache[src] = !error;
              img.off(error ? 'load' : 'error', ret).remove();
              img.show();
              if (hasClb) {
                  clb.call(img, error ? false : src, evt);
              } else if (defered) {
                  if (error) {
                      defered.reject(evt);
                  } else {
                      defered.resolve(evt, src);
                  }
              }
          },
              that = this,
              ctx = that && that != $ && that.$ctx;
          if (defered) {
              img.then = $.proxy(defered.then, defered);
              img.promise = $.proxy(defered.promise, defered);
          }
          img.hide().one('load', ret).one('error', ret);
          if (cache[src] === false) {
              img.trigger('error');
          } else {
              if (!ctx || !ctx.length || ctx[0] == document) {
                  ctx = $(document.body || 'body');
              }
              if (!ctx.length) {
                  var tio = setInterval(function () {
                      if (document.body) {
                          clearInterval(tio);
                          ctx = $(document.body);
                          img.prop('src', src);
                          ctx.append(img);
                      }
                  }, 50);
              } else {
                  img.prop('src', src);
                  ctx.append(img);
              }
          }
          return img;
      }

      /**
       * Check whether src has beed loaded (either success or error)
       *
       * @param string src - source URL of the iamge
       *
       * @return bool true if src in cache, false otherwise
       */
      function inCache(src) {
          return src in cache;
      }

      /**
       * Check whether image with src exists.
       *
       * @param string src - source URL of the iamge
       * @param callback cb(src|false)
       *
       * Note: If cb supplied and src not in cache, it will trigger
       *
       * @return bool|undefined true if exists (and cached), false if doesn't exist (error on load), undefined if never loaded (not in cache)
       */
      function exists(src, cb) {
          if (src in cache) {
              cb && cb(cache[src] && src);
              return cache[src];
          } else {
              cb && load_img(src, cb);
          }
      }

      function isImgOk(img) {
          if (!img.complete) return false; /* Only IE is correct here */
          if (_typeof(img.naturalWidth) != UNDEFINED && img.naturalWidth == 0) return false; /* Other Browsers */
          return true; /* No other way of checking: assume it's ok. */
      }

      /**
       * Purce the cache.
       */
      function purgeCache() {
          $.each(cache, function (n, v) {
              delete cache[n];
          });
      }

      // Export

      load_img.exists = exists;
      load_img.inCache = load_img.in_cache = inCache;
      load_img.isImgOk = load_img.is_ok = isImgOk;
      load_img.purgeCache = load_img.purge_cache = purgeCache;

      load_img.cache = cache;
      load_img.VERSION = VERSION;

      return $.load_img = load_img;
  }

  if (typeof window !== 'undefined') {
      var $ = window.jQuery || window.Zepto;
      if ($) init($);
  }

  exports.VERSION = VERSION;
  exports.default = init;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=load_img.js.map
