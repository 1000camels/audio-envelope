/**
 * bsd16.js - Bas Groothedde, 2015. MIT License, use where you like.
*/

;(function() {
    'use strict';
    
    if(typeof(window.Checksum) === "undefined") {
        throw "The Checksum class is required for this code.";
    }
    
    /**
     * Initialize anything you want in the constructor, such as setting up a lookup
     * table of bytes. Make sure to cache your calculations, so they only have to be
     * done once.
     */
    var BSD16 = function BSD16() {
        this.init = 0;
    };
    
    /**
     * bsd16 for arrays, each value must be numeric and will be bound to 8-bits (Int8Array or Uint8Array works best!)
     * @param   {Array}  a input (8-bit array)
     * @param   {Number} p previous checksum state
     * @returns {Number} new checksum state
     */
    BSD16.prototype.array = function(a, p) {
        var c = p || 0, i = 0, l = a.length;
        for(; i < l; i++) c = (((((c >>> 1) + ((c & 1) << 15)) | 0) + (a[i] & 0xff)) & 0xffff) | 0;
        return c;
    };
    
    /**
     * bsd16 for a single value, update a checksum with a new byte
     * @param   {Number} b byte (0-255)
     * @param   {Number} p previous checksum state
     * @returns {Number} new checksum state
     */
    BSD16.prototype.single = function(b, p) {
        var c = p || 0;
        return (((((c >>> 1) + ((c & 1) << 15)) | 0) + (b & 0xff)) & 0xffff) | 0;
    };
    
    // Register the checksum algorithm
    Checksum.registerChecksum("bsd16", BSD16);
}());