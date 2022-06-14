/**
 *  Load images asynchronously and cache them.
 *
 *  @license MIT
 *  @git https://github.com/duzun/jquery.load_img
 *  @author Dumitru Uzun (DUzun.Me)
 *  @version 1.5.1
 */

// ---------------------------------------------------------------------------
const VERSION   = '1.5.1';

init.VERSION = VERSION;

export default function init($, global) {
    global = typeof globalThis != 'undefined' ? globalThis : window;

        var undefined; //jshint ignore:line

        // ---------------------------------------------------------------------------
        const { document } = global
        ,   cache = {}
        ,   errors = {}
        ;

        /**
         * Load an image to cache.
         *
         * @param string src - source URL of the iamge
         * @param callback clb.call(img: $(Image), src|false, event: $.Event)
         *
         * @return $(Image) element
         */
        function load_img(src, options, clb) {
            if(!clb && typeof options == 'function') {
                clb = options;
                options = undefined;
            }

            options = options ? $.extend({}, load_img.settings, options) : load_img.settings;

            var img = $('<img />')
            ,   hasClb = 'function' == typeof clb
            ,   defered = hasClb ? undefined : new $.Deferred()
            ,   onEvent = function (evt) {
                    var type = evt.type
                    ,   error = type == 'error'
                    ;

                    if (!evt.timeStamp) {
                        evt.timeStamp = Date.now();
                    }
                    evt.src = src;
                    if(error) {
                        errors[src] = evt;
                    }
                    else {
                        delete errors[src];
                    }
                    cache[src] = !error;
                    img.off(error ? 'load' : 'error', onEvent).remove();
                    img.show();
                    if(hasClb) {
                        clb.call(img, error?false:src, evt);
                    }
                    else if ( defered ) {
                        if ( error ) {
                            defered.reject(evt);
                        }
                        else {
                            defered.resolve(evt, src);
                        }
                    }
                }
            ,   that = this
            ,   ctx = that && that != $ && that.$ctx
            ;

            if ( defered ) {
                img.then = $.proxy(defered.then, defered);
                img.promise = $.proxy(defered.promise, defered);
            }

            img
                .hide()
                .one('load', onEvent)
                .one('error', onEvent)
            ;

            let errorEvt = errors[src];
            const { errorExpires } = options;
            if (errorEvt && errorExpires && errorExpires < Date.now() - errorEvt.timeStamp) {
                errorEvt = undefined;
            }

            if (errorEvt) {
                img.prop('src', src).trigger(errorEvt);
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
                    }, 50);
                }
                else {
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
            if ( typeof img.naturalWidth != 'undefined' && img.naturalWidth == 0 ) return false; /* Other Browsers */
            return true; /* No other way of checking: assume it's ok. */
        }

        /**
         * Purce the cache.
         */
        function purgeCache() {
            $.each(cache, function (n,v) {
                delete cache[n];
            });

            $.each(errors, function (n,v) {
                delete errors[n];
            });
        }

        // Export

        load_img.exists      = exists;
        load_img.inCache     = load_img.in_cache    = inCache;
        load_img.isImgOk     = load_img.is_ok       = isImgOk;
        load_img.purgeCache  = load_img.purge_cache = purgeCache;

        load_img.cache       = cache;
        load_img.errors      = errors;
        load_img.VERSION     = VERSION;

        load_img.settings = {
            errorExpires: 1e3, // after how many milliseconds to allow to retry loading an image which errored
        };

        return $.load_img = load_img;
}

;(function (global) {
    const $ = global.jQuery || global.Zepto;
    if ($) init($, global);
}(typeof globalThis != 'undefined' ? globalThis : typeof window != 'undefined' ? window : global));
