<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://aporia.info
 * @since      1.0.0
 *
 * @package    Audio_Envelope
 * @subpackage Audio_Envelope/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Audio_Envelope
 * @subpackage Audio_Envelope/includes
 * @author     Darcy Christ <darcy@aporia.info>
 */
class Audio_Envelope_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'audio-envelope',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
