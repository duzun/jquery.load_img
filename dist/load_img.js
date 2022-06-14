(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.loadImg = factory());
})(this, (function () { 'use strict';

    /**
     *  Load images asynchronously and cache them.
     *
     *  @license MIT
     *  @git https://github.com/duzun/jquery.load_img
     *  @author Dumitru Uzun (DUzun.Me)
     *  @version 1.5.2
     */
    // ---------------------------------------------------------------------------
    var VERSION = '1.5.2';
    init.VERSION = VERSION;
    function init($, global) {
      if (!global) global = getGlobal();
      var undefined$1; //jshint ignore:line
      // ---------------------------------------------------------------------------

      var _global = global,
          document = _global.document,
          cache = {},
          errors = {};
      /**
       * Load an image to cache.
       *
       * @param string src - source URL of the iamge
       * @param callback clb.call(img: $(Image), src|false, event: $.Event)
       *
       * @return $(Image) element
       */

      function load_img(src, options, clb) {
        if (!clb && typeof options == 'function') {
          clb = options;
          options = undefined$1;
        }

        options = options ? $.extend({}, load_img.settings, options) : load_img.settings;

        var img = $('<img />'),
            hasClb = 'function' == typeof clb,
            defered = hasClb ? undefined$1 : new $.Deferred(),
            onEvent = function onEvent(evt) {
          var type = evt.type,
              error = type == 'error';

          if (!evt.timeStamp) {
            evt.timeStamp = Date.now();
          }

          evt.src = src;

          if (error) {
            errors[src] = evt;
          } else {
            delete errors[src];
          }

          cache[src] = !error;
          img.off(error ? 'load' : 'error', onEvent).remove();
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
          defered.promise(img);
        }

        img.hide().one('load', onEvent).one('error', onEvent);
        var errorEvt = errors[src];
        var _options = options,
            errorExpires = _options.errorExpires;

        if (errorEvt && errorExpires && errorExpires < Date.now() - errorEvt.timeStamp) {
          errorEvt = undefined$1;
        }

        if (errorEvt) {
          img.prop('src', src).trigger(errorEvt);
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

      function loadSrc(src, options) {
        if (exists(src)) {
          var defered = $.Deferred();
          var promise = defered.promise();
          defered.resolve(src);
          return promise;
        }

        return load_img(src, options).then(function (evt) {
          var src = evt.src,
              target = evt.target;
          return src || target && target.src;
        });
      }

      function isImgOk(img) {
        if (!img.complete) return false;
        /* Only IE is correct here */

        if (typeof img.naturalWidth != 'undefined' && img.naturalWidth == 0) return false;
        /* Other Browsers */

        return true;
        /* No other way of checking: assume it's ok. */
      }
      /**
       * Purce the cache.
       */


      function purgeCache() {
        $.each(cache, function (n, v) {
          delete cache[n];
        });
        $.each(errors, function (n, v) {
          delete errors[n];
        });
      } // Export


      load_img.exists = exists;
      load_img.src = loadSrc;
      load_img.inCache = load_img.in_cache = inCache;
      load_img.isImgOk = load_img.is_ok = isImgOk;
      load_img.purgeCache = load_img.purge_cache = purgeCache;
      load_img.cache = cache;
      load_img.errors = errors;
      load_img.VERSION = VERSION;
      load_img.settings = {
        errorExpires: 1e3 // after how many milliseconds to allow to retry loading an image which errored

      };
      return $.load_img = load_img;
    }

    function getGlobal() {
      return typeof globalThis != 'undefined' ? globalThis : typeof window != 'undefined' ? window : global;
    }

    (function (global) {
      var $ = global.jQuery || global.Zepto;
      if ($) init($, global);
    })(getGlobal());

    return init;

}));
//# sourceMappingURL=load_img.js.map
