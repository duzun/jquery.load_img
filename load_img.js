/**
 *  Load images asynchronously and cache them.
 *
 *  Usage:
 *      $.load_img(src, function (srcOrFalse, event) {
 *          if ( srcOrFalse ) {
 *              var src = srcOrFalse;
 *              // do something with `this` image and `src`
 *          }
 *          else {
 *              // error loading the image. event.type == "error"
 *          }
 *      });
 *
 *      $.load_img.inCache(src)      ; // check whether an URL is in cache
 *      $.load_img.exists(src[, cb]) ; // true if exists, false if not (error), undefined if never loaded, load if cb
 *      $.load_img.purgeCache()      ; // remove all image sources from cache
 *
 *  @license MIT
 *  @git https://github.com/duzun/jquery.load_img
 *  @author Dumitru Uzun (DUzun.Me)
 *  @version 1.1.1
 */
;(function (window) {
    'use strict';
    // ---------------------------------------------------------------------------
    var undefined
    ,   UNDEFINED = undefined + ''
    ,   FUNCTION  = 'function'
    ,   jq        = window.jQuery || window.Zepto
    ;
    (typeof define !== FUNCTION || !define.amd
        ? typeof module == UNDEFINED || !module.exports
            ? function (deps, factory) { factory(jq); } // Browser
            : function (deps, factory) { module.exports = factory(jq||require('jquery')); } // CommonJs
        : define // AMD
    )
    /*define*/(/*name, */[jq?null:'jquery'], function factory(jQuery) {
        // ---------------------------------------------------------------------------
        var document = window.document
        ,   $ = jQuery || jq
        ,   cache = {}
        ;

        /**
         * Load an image to cache.
         *
         * @param string src - source URL of the iamge
         * @param callback clb.call(img: $(Image), src|false, event: $.Event)
         *
         * @return $(Image) element
         */
        function load_img(src, clb) {
            var img = $('<img />')
            ,   ret = function ret(evt) {
                    var type = evt.type
                    ,   error = type == 'error'
                    ;
                    evt.src = src;
                    cache[src] = !error;
                    img.off(error?'load':'error', ret).remove()
                    img.show();
                    if('function' == typeof clb) clb.call(img, error?false:src, evt);
                }
            ,   ctx = this.$ctx
            ;
            img
                .hide()
                .one('load', ret)
                .one('error', ret)
            ;
            if(cache[src] === false) {
                img.trigger('error')
            }
            else {
                if(!ctx || !ctx.length || ctx[0] == document) {
                    ctx = $(document.body||'body');
                }
                if(!ctx.length) {
                    var tio = setInterval(function () {
                        if(document.body) {
                            clearInterval(tio);
                            ctx = $(document.body);
                            img.prop('src', src);
                            ctx.append(img);
                        }
                    }, 50)
                }
                else {
                    img.prop('src', src);
                    ctx.append(img);
                }
            }
            return img;
        };

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
            if ( src in cache ) {
                cb && cb(cache[src]&&src);
                return cache[src];
            }
            else {
                cb && load_img(src, cb);
            }
        }

        function isImgOk(img) {
            if ( !img.complete ) return false; /* Only IE is correct here */
            if ( typeof img.naturalWidth != UNDEFINED && img.naturalWidth == 0 ) return false; /* Other Browsers */
            return true; /* No other way of checking: assume it's ok. */
        }

        /**
         * Purce the cache.
         */
        function purgeCache() {
            $.each(cache, function (n,v) {
                delete cache[n];
            });
        }

        // Export

        load_img.exists      = exists;
        load_img.inCache     = load_img.in_cache    = inCache;
        load_img.isImgOk     = load_img.is_ok       = isImgOk;
        load_img.purgeCache  = load_img.purge_cache = purgeCache;

        load_img.cache       = cache;

        return $.load_img = load_img;
    });
}
(this));