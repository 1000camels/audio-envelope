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
	private $display_options = 'audio-envelope_display_options';
	private $advanced_options = 'audio-envelope_advanced_options';

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
	 * Register Hello Gutenbert Meta Box
	 */
	function add_meta_box() {
    	$options = get_option( 'audio_envelope_plugin_options' );
    	$active_post_types = $options['active_post_types'];

		add_meta_box( 'audio_envelope_meta_box', __( 'Audio Envelope', 'audio-envelope' ), array( $this, 'metabox_callback' ), $active_post_types );
	}

	/**
	 * Hello Gutenberg Metabox Callback
	 */
	function metabox_callback( $post ) {
		$activate_player_globally = checked(1, get_option( $this->plugin_name . '_activate_player'), false);
		$activated = get_post_meta( $post->ID, '_ae_activate_player', true );

		if($activate_player_globally) {
			echo '<p>'.__('Player is ON globally','audio-envelope').'</p>';
			echo '<input type="checkbox" name="ae_activate_player" id="ae_activate_player" value="0" '.(checked(0, $activated, false)).'/>';
			echo '<label for="ae_activate_player">'.__( 'Disable player for this page', 'audio-envelope' ).'</label>';
		} else {
			echo '<p>'.__('Player is OFF globally','audio-envelope').'</p>';
			echo '<br/>';
			echo '<input type="checkbox" name="ae_activate_player" id="ae_activate_player" value="1" '.(checked(1, $activated, false)).'/>';
			echo '<label for="ae_activate_player">'.__( 'Enable player for this page', 'audio-envelope' ).'</label>';
		}
		?>
		<?php
	}

	/**
	 * Save Hello Gutenberg Metabox
	 */
	function save_metabox_postdata( $post_id ) {
		if ( array_key_exists( 'ae_activate_player', $_POST ) ) {
			update_post_meta( $post_id, '_ae_activate_player', $_POST['ae_activate_player'] );
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
		// Display Options
		add_settings_section(
			$this->display_options,
			__( 'Display', 'audio-envelope' ),
			array( $this, 'audio_envelope_options_general_cb' ),
			$this->display_options
		);
		add_settings_field(
			$this->plugin_name . '_activate_player', 
			__( 'Activate Player', 'audio-envelope' ),
			array( $this, 'audio_envelope_options_activate_player_cb' ), 
			$this->display_options,
			$this->display_options,
			array( 'label_for' => 'audio_envelope_options_activate_player' )
		);  
		register_setting( $this->display_options, $this->plugin_name . '_activate_player', 'string' );


		// Advanced Options
		add_settings_section(
			$this->advanced_options,
			__( 'Advanced', 'audio-envelope' ),
			array( $this, 'audio_envelope_options_general_cb' ),
			$this->advanced_options
		);
		add_settings_field(
			$this->plugin_name . '_active_post_types',
			__( 'Active Post Types', 'audio-envelope' ),
			array( $this, 'audio_envelope_options_active_post_types_cb' ),
			$this->advanced_options,
			$this->advanced_options,
			array( 'label_for' => 'audio_envelope_options_active_post_types' )
		);
		add_settings_field(
			$this->plugin_name . '_audio_selector',
			__( 'Audio Selector', 'audio-envelope' ),
			array( $this, 'audio_envelope_options_audio_selector_cb' ),
			$this->advanced_options,
			$this->advanced_options,
			array( 'label_for' => 'audio_envelope_options_audio_selector' )
		);
		add_settings_field(
			$this->plugin_name . '_title_selector',
			__( 'Title Selector', 'audio-envelope' ),
			array( $this, 'audio_envelope_options_title_selector_cb' ),
			$this->advanced_options,
			$this->advanced_options,
			array( 'label_for' => 'audio_envelope_options_title_selector' )
		);
		add_settings_field(
			$this->plugin_name . '_description_selector',
			__( 'Description Selector', 'audio-envelope' ),
			array( $this, 'audio_envelope_options_description_selector_cb' ),
			$this->advanced_options,
			$this->advanced_options,
			array( 'label_for' => 'audio_envelope_options_description_selector' )
		);
		register_setting( $this->advanced_options, $this->plugin_name . '_audio_selector', 'string' );
		register_setting( $this->advanced_options, $this->plugin_name . '_title_selector', 'string' );
		register_setting( $this->advanced_options, $this->plugin_name . '_description_selector', 'string' );

    	register_setting( $this->advanced_options, 'audio_envelope_plugin_options' );
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
	 * Render a checkbox for each post type
	 *
	 * @since  1.0.0
	 */
	function audio_envelope_options_active_post_types_cb() {
    	$options = get_option( 'audio_envelope_plugin_options' );
    	$active_post_types = $options['active_post_types'];
    	error_log(print_r($active_post_types,True));

		$args = array(
		   'public'   => true
		);
		$post_types = get_post_types($args, 'objects');
		foreach( $post_types as $key => $type ) {
        	echo '<input type="checkbox" name="audio_envelope_plugin_options[active_post_types][]" value="'.$key.'" '.checked( in_array($key, $active_post_types), 1, false).' /><label>'.$type->label.'</label><br/>';
		}
	}


	/**
	 * Render the checkbox for the general section
	 *
	 * @since  1.0.0
	 */
	function audio_envelope_options_activate_player_cb() {
		// Here we are comparing stored value with 1. Stored value is 1 if user checks the checkbox otherwise empty string. 
		$activate_player_checked = checked(1, get_option( 'audio_envelope_plugin_options' )['activate_player'], false);
        echo '<input type="checkbox" name="audio_envelope_plugin_options[activate_player]" value="1" '.$activate_player_checked.' /><br/>';
        echo '<p>If you activate the player site-wide, you can turn it off on individual pages. Otherwise you can selectively activate it on individual pages.</p>';
	}

	/**
	 * Render the audio_selector field for the advanced section
	 *
	 * @since  1.0.0
	 */
	public function audio_envelope_options_audio_selector_cb() {
		$audio_selector = get_option( 'audio_envelope_plugin_options' )['audio_selector'];
		echo '<input type="text" name="audio_envelope_plugin_options[audio_selector]" id="' . $this->plugin_name . '_audio_selector' . '" value="' . $audio_selector . '" placeholder="audio.wp-audio-shortcode, .wp-block-audio audio" class="audio_envelope_text_options"> ';
	}

	/**
	 * Render the title_selector field for the advanced section
	 *
	 * @since  1.0.0
	 */
	public function audio_envelope_options_title_selector_cb() {
		$audio_selector = get_option( 'audio_envelope_plugin_options' )['title_selector'];
		echo '<input type="text" name="audio_envelope_plugin_options[title_selector]" id="' . $this->plugin_name . '_title_selector' . '" value="' . $audio_selector . '" placeholder=".ae-title, h3, h2, h1" class="audio_envelope_text_options"> ';
	}

	/**
	 * Render the description_selector field for the advanced section
	 *
	 * @since  1.0.0
	 */
	public function audio_envelope_options_description_selector_cb() {
		$audio_selector = get_option( 'audio_envelope_plugin_options' )['description_selector'];
		//$placeholder = ".elementor-post__excerpt p:first-child";
		$placeholder = ".ae-description, p";
		echo '<input type="text" name="audio_envelope_plugin_options[description_selector]" id="' . $this->plugin_name . '_description_selector' . '" value="' . $audio_selector . '" placeholder="' . $placeholder . '" class="audio_envelope_text_options"> ';
	}

}
