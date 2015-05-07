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
 *      $.load_img.purge_cache() ; // remove all image sources from cache
 *
 *  @git https://github.com/duzun/jquery.load_img
 *
 *  @author Dumitru Uzun (DUzun.Me)
 *  @version 1.0.0
 */
;(function (win) {
    'use strict';
    // ---------------------------------------------------------------------------
    var $        = win.jQuery || win.Zepto
    ,   undefined
    ,   UNDEFINED = undefined + ''
    ,   FUNCTION = 'function'
    ;
    (typeof define !== FUNCTION || !define.amd
        ? typeof module == UNDEFINED || !module.exports
            ? function (deps, factory) { factory($); } // Browser
            : function (deps, factory) { module.exports = factory($||require('jquery')); } // CommonJs
        : define // AMD
    )
    /*define*/(/*name, */[$?null:'jquery'], function factory($) {
        // ---------------------------------------------------------------------------
        var doc   = win.document
        ,   cache = {}
        ;
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
                if(!ctx || !ctx.length || ctx[0] == doc) {
                    ctx = $(doc.body||'body');
                }
                if(!ctx.length) {
                    var tio = setInterval(function () {
                        if(doc.body) {
                            clearInterval(tio);
                            ctx = $(doc.body);
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

        function is_ok(img) {
            if ( !img.complete ) return false; /* Only IE is correct here */
            if ( typeof img.naturalWidth != UNDEFINED && img.naturalWidth == 0 ) return false; /* Other Browsers */
            return true; /* No other way of checking: assume it's ok. */
        }

        function purge_cache() {
            $.each(cache, function (n,v) {
                delete cache[n];
            })
        }

        // Export
        load_img.is_ok = is_ok;
        load_img.purge_cache = purge_cache;
        load_img.cache = cache;

        return $.load_img = load_img;
    });
}
(this));