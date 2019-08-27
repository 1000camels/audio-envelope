/**
 * fnv32.js - Bas Groothedde, 2015. MIT License, use where you like.
*/

;(function() {
    'use strict';
    
    if(typeof(window.Checksum) === "undefined") {
        throw "The Checksum class is required for this code.";
    }
    
    var prime = 0x01000193;
    
    /**
     * Initialize anything you want in the constructor, such as setting up a lookup
     * table of bytes. Make sure to cache your calculations, so they only have to be
     * done once.
     */
    var FNV32 = function FNV32() {
        this.init = 2166136261; // fnv-1!
    };
    
    /**
     * The setup method which will be called when new Checksum("fletcher", ...) is called.
     * This method is supposed to initialize the checksum cipher and to recieve parameters
     * from the constructor.
     *
     * @param {Number} mode the FNV32 mode (FNV-1 (default) or FNV-0)
     */
    FNV32.prototype.setup = function(mode) {
        if(mode === 0) {
            this.init = 0; // fnv-0.
        }
    };
    
    /**
     * Update the fnv32 checksum with an array
     * @param   {Array}  a an array of bytes to calcualte a checksum of (all values are bound to 8-bits)
     * @param   {Number} p the previous fnv32 checksum or null
     * @returns {Number} the updated fnv32 checksum
     */
    FNV32.prototype.array = function(a, p) {
        var len = a.length,
            fnv = p || this.init;

        for(var i = 0; i < len; i++) {
            fnv = (fnv + (((fnv << 1) + (fnv << 4) + (fnv << 7) + (fnv << 8) + (fnv << 24)) >>> 0)) ^ (a[i] & 0xff);
        }

        return fnv >>> 0;
    };
    
    /**
     * Update the fnv32 checksum with a byte
     * @param   {Number} b an 8-bit numeric value (signed or unsigned)
     * @param   {Number} p the previous fnv32 checksum or null
     * @returns {Number} the updated fnv32 checksum
     */
    FNV32.prototype.single = function(b, p) {
        var fnv = p || this.init;
        return ((fnv + (((fnv << 1) + (fnv << 4) + (fnv << 7) + (fnv << 8) + (fnv << 24)) >>> 0)) ^ (b & 0xff)) >>> 0;
    };
    
    // Register the checksum algorithm
    Checksum.registerChecksum("fnv32", FNV32);
}());