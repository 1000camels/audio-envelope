<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://aporia.info
 * @since      1.0.0
 *
 * @package    Audio_Envelope
 * @subpackage Audio_Envelope/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Audio_Envelope
 * @subpackage Audio_Envelope/admin
 * @author     Darcy Christ <darcy@aporia.info>
 */
class Audio_Envelope_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * The options name to be used in this plugin
	 *
	 * @since  	1.0.0
	 * @access 	private
	 * @var  	string 		$option_name 	Option name of this plugin
	 */
	private $option_name = 'audio_envelope_options';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Audio_Envelope_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Audio_Envelope_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/audio-envelope-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Audio_Envelope_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Audio_Envelope_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		if( defined('WP_DEBUG') && true === WP_DEBUG ) {
			wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . '/js/audio-envelope-admin.js', array( 'jquery' ), $this->version, false );
		} else {
			wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . '../assets/js/admin.js', array( 'jquery' ), $this->version, false );
		}
	}

	/**
	 * Add an options page under the Settings submenu
	 *
	 * @since  1.0.0
	 */
	public function add_options_page() {
	
		$this->plugin_screen_hook_suffix = add_options_page(
			__( 'Audio Envelope Settings', 'audio-envelope' ),
			__( 'Audio Envelope', 'audio-envelope' ),
			'manage_options',
			$this->plugin_name,
			array( $this, 'display_options_page' )
		);
	
	}

	/**
	 * Render the options page for plugin
	 *
	 * @since  1.0.0
	 */
	public function display_options_page() {
		include_once 'partials/audio-envelope-admin-display.php';
	}

	/**
	 * Register all related settings of this plugin
	 *
	 * @since  1.0.0
	 */
	public function register_setting() {
		add_settings_section(
			$this->option_name . '_general',
			__( 'General', 'audio-envelope' ),
			array( $this, $this->option_name . '_general_cb' ),
			$this->plugin_name
		);
		add_settings_field(
			$this->option_name . '_audio_selector',
			__( 'Audio Selector', 'audio-envelope' ),
			array( $this, $this->option_name . '_audio_selector_cb' ),
			$this->plugin_name,
			$this->option_name . '_general',
			array( 'label_for' => $this->option_name . '_audio_selector' )
		);
		register_setting( $this->plugin_name, $this->option_name . '_audio_selector', 'string' );
	}

	/**
	 * Render the text for the general section
	 *
	 * @since  1.0.0
	 */
	public function audio_envelope_options_general_cb() {
		echo '<p>' . __( 'Please change the settings accordingly.', 'audio-envelope' ) . '</p>';
	}

	/**
	 * Render the treshold day input for this plugin
	 *
	 * @since  1.0.0
	 */
	public function audio_envelope_options_audio_selector_cb() {
		$audio_selector = get_option( $this->option_name . '_audio_selector' );
		echo '<input type="text" name="' . $this->option_name . '_audio_selector' . '" id="' . $this->option_name . '_audio_selector' . '" value="' . $audio_selector . '" placeholder="audio.wp-audio-shortcode"> ';
	}

}
