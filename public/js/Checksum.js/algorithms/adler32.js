/**
 * adler32.js - Bas Groothedde, 2015. MIT License, use where you like.
*/

;(function() {
    'use strict';
    
    if(typeof(window.Checksum) === "undefined") {
        throw "The Checksum class is required for this code.";
    }
    
    var BASE = 65521; // largest prime smaller than 65536
    var NMAX = 5552;
    
    /**
     * Initialize anything you want in the constructor, such as setting up a lookup
     * table of bytes. Make sure to cache your calculations, so they only have to be
     * done once.
     */
    var Adler32 = function Adler32() {
        this.init = 1; // default adler value
    };
    
    /**
     * Update the adler checksum with an array of bytes
     * @param   {Array}  a an array of numeric values between 0 and 255. The algorithm will ensure the 8-bit range.
     * @param   {Number} p the previous checksum state
     * @returns {Number} the updated checksum state
     */
    Adler32.prototype.array = function(a, p) {
        var c = p || this.init;
        var len = a.length,
            s1 = (c & 0xffff) | 0,
            s2 = ((c >>> 16) & 0xffff) | 0,
            b = 0, k;

        if(!a || len === 0) return this.init;

        /**
         * Unrolling a loop is much faster than using a for loop and accessing
         * the iteration counter each time, checking for end of loop each iteration
         * and incrementing the counter each iteration... 
         *
         * We only still deal with upvalues, which kinda sucks. 
         */
        var DO16 = function(o) {
            s1 += a[o],      s2 += s1; // 1
            s1 += a[o + 1],  s2 += s1; // 2
            s1 += a[o + 2],  s2 += s1; // 3
            s1 += a[o + 3],  s2 += s1; // 4

            s1 += a[o + 4],  s2 += s1; // 5
            s1 += a[o + 5],  s2 += s1; // 6
            s1 += a[o + 6],  s2 += s1; // 7
            s1 += a[o + 7],  s2 += s1; // 8

            s1 += a[o + 8],  s2 += s1; // 9
            s1 += a[o + 9],  s2 += s1; // 10
            s1 += a[o + 10], s2 += s1; // 11
            s1 += a[o + 11], s2 += s1; // 12

            s1 += a[o + 12], s2 += s1; // 13
            s1 += a[o + 13], s2 += s1; // 14
            s1 += a[o + 14], s2 += s1; // 15
            s1 += a[o + 15], s2 += s1; // 16
        };

        while(len > 0) {
            k = len < NMAX ? len : NMAX, len -= k;
            while(k >= 16) DO16(b), b += 16, k -= 16;

            if(k !== 0) do {
                s1 += a[b++], s2 += s1;
            } while(--k);

            s1 %= BASE, s2 %= BASE;
        }

        return (((s2 << 16) | s1) >>> 0);
    };
    
    /**
     * Update the adler checksum state with a single byte value
     * @param   {Number} b a numeric byte value in the range 0-255.
     * @param   {Number} p the previous checksum state
     * @returns {Number} the updated checksum state
     */
    Adler32.prototype.single = function(b, p) {
        var c = p || this.init;
        var s1 = (c & 0xffff) | 0,
            s2 = ((c >>> 16) & 0xffff) | 0;

        s1 += b, s2 += s1, s1 %= BASE, s2 %= BASE;
        return (((s2 << 16) | s1) >>> 0);
    };
    
    // Register the checksum algorithm
    Checksum.registerChecksum("adler32", Adler32);
}());