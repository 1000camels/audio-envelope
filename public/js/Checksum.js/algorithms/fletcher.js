/**
 * fletcher.js - Bas Groothedde, 2015. MIT License, use where you like.
 * I should split this up in fletcher16 and fletcher32 for speed, but I was lazy. :)
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
    var Fletcher = function Fletcher() {
        this.init = 0xffffffff;
    };
    
    /**
     * The setup method which will be called when new Checksum("fletcher", ...) is called.
     * This method is supposed to initialize the checksum cipher and to recieve parameters
     * from the constructor.
     *
     * @param {Number} mode the Fletcher mode (Fletcher-16 or Fletcher-32)
     */
    Fletcher.prototype.setup = function(mode) {
        if(mode === 16) { // fletcher-16
            this.init = 0xffff;
            this.mode = 8; // 16 / 2
            this.part = 20;
            this.mask = 0xff;
        } else { // default: fletcher-32
            this.init = 0xffffffff;
            this.mode = 16; // 32 / 2
            this.part = 359;
            this.mask = 0xffff;
        }
    };
    
    /**
     * Update the fletcher checksum with an array
     * @param   {Array}  a an array of bytes to calcualte a checksum of (all values are bound to 8-bits)
     * @param   {Number} p the previous fletcher checksum or null
     * @returns {Number} the updated fletcher checksum
     */
    Fletcher.prototype.array = function(a, p) {
        var mode = this.mode,
            mask = this.mask,
            part = this.part;

        var c = p || this.init,
            s1 = (c & mask) | 0,
            s2 = ((c >>> mode) & mask) | 0,
            length = a.length,
            tlen, position = 0;

        while(length) {
            tlen = (length > part ? part : length);
            length -= tlen;
            do {
                s2 += s1 += (a[position++] & 0xff);
            } while (--tlen);

            s1 = ((s1 & mask) + (s1 >>> mode));
            s2 = ((s2 & mask) + (s2 >>> mode));
        }

        s1 = ((s1 & mask) + (s1 >>> mode));
        s2 = ((s2 & mask) + (s2 >>> mode));
        return (((s2 << mode) | s1) >>> 0);
    };
    
    /**
     * Update the fletcher checksum with a byte
     * @param   {Number} b an 8-bit numeric value (signed or unsigned)
     * @param   {Number} p the previous fletcher checksum or null
     * @returns {Number} the updated fletcher checksum
     */
    Fletcher.prototype.single = function(b, p) {
        var mode = this.mode,
            mask = this.mask,
            part = this.part;

        var c = p || this.init,
            s1 = (c & mask) | 0,
            s2 = ((c >>> mode) & mask) | 0;

        s2 += s1 += (b & 0xff);
        s1 = ((s1 & mask) + (s1 >>> mode));
        s2 = ((s2 & mask) + (s2 >>> mode));
        return (((s2 << mode) | s1) >>> 0); 
    };
    
    // Register the checksum algorithm
    Checksum.registerChecksum("fletcher", Fletcher);
}());