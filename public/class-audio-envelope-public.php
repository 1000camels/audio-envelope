<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://aporia.info
 * @since      1.0.0
 *
 * @package    Audio_Envelope
 * @subpackage Audio_Envelope/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Audio_Envelope
 * @subpackage Audio_Envelope/public
 * @author     Darcy Christ <darcy@aporia.info>
 */
class Audio_Envelope_Public {

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
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		wp_enqueue_style( 'load-first', plugin_dir_url( __FILE__ ) . '/css/load_first.css', null, null, 'all'); 

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/audio-envelope-public.css', array( 'wp-mediaelement' ), $this->version, 'all' );

		//wp_enqueue_style( 'loading-bar', plugin_dir_url( __FILE__ ) . 'js/loading-bar/loading-bar.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		// for backbone support
		wp_enqueue_script( 'wp-api' );
		wp_enqueue_script( 'wp-backbone' );
		// wp_enqueue_script( 'jquery-ui-draggable' );

		$type = 'audio';

		/**
		 * These next 5 lines are taken from WP's media.php
		 */
		// wp_enqueue_style( 'wp-mediaelement' );
		// wp_enqueue_script( 'wp-playlist' );
	?>
	<!--[if lt IE 9]><script>document.createElement('<?php echo esc_js( $type ) ?>');</script><![endif]-->
	<?php
		// :TODO: what happens if these are already in the page, because there is a [playlist]?
		add_action( 'wp_footer', array( $this, 'wp_underscore_playlist_templates' ), 0 );
		add_action( 'admin_footer', array( $this, 'wp_underscore_playlist_templates' ), 0 );


		wp_enqueue_script( 'checksum', plugin_dir_url( __FILE__ ) . 'js/Checksum.js/checksum.min.js', array(), $this->version, false );

		wp_enqueue_script( 'backbone-storage', plugin_dir_url( __FILE__ ) . 'js/backbone.localStorage.min.js', array(), $this->version, false );

		// we are manually creating the SVG, so we no longer need to dynamically create them
		//wp_enqueue_script( 'loading-bar', plugin_dir_url( __FILE__ ) . 'js/loading-bar/loading-bar.js', array(), $this->version, false );


		// load player
		if( defined('WP_DEBUG') && true === WP_DEBUG ) {
			wp_register_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/audio-envelope.js', 
				array( 'jquery', 'wp-backbone', 'wp-playlist', 'checksum', 'backbone-storage' ), 
				$this->version, 
				false 
			);
		} else {	
			wp_register_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . '../assets/js/frontend.js', 
				array( 'jquery', 'wp-backbone', 'wp-playlist', 'checksum', 'backbone-storage' ), 
				$this->version, 
				false 
			);
		}

		global $post;

		// add options if they do not exist already
		$default_options = array(
			'activate_player' => 1, 
			'continuous_play' => 1,
			'active_post_types' => array('post','page'),
		);
		add_option( 'audio_envelope_plugin_options', $default_options );

		$options = get_option( 'audio_envelope_plugin_options' );


		$activate_player = ($options['activate_player']) ? $options['activate_player'] : 0;
		$debug_msg = null;
		if( $activate_player ) {
			// if activated globally, see if there is a local deactivation
			if( in_array( '_ae_deactivate_player', get_post_custom_keys( $post->ID ) ) && ! get_post_meta( $post->ID, '_ae_deactivate_player', true ) ) {
				$activate_player = 0;
				if(WP_DEBUG) $debug_msg = 'Audio Envelope: globally activated; locally deactivated';
			} else {
				if(WP_DEBUG) $debug_msg = 'Audio Envelope: globally activated';
			}
		} else {
			// if deactivated globally, see if there is a local activation
			if( in_array( '_ae_activate_player', get_post_custom_keys( $post->ID ) ) && get_post_meta( $post->ID, '_ae_activate_player', true ) ) {
				$activate_player = 1;
				if(WP_DEBUG) $debug_msg = 'Audio Envelope: globally deactivated; locally activated';
			} else {
				if(WP_DEBUG) $debug_msg = 'Audio Envelope: globally deactivated';
			}
		}

		if( !isset($options['continuous_play']) ) $options['continuous_play'] = 0;
		if( !isset($options['loop_playlist']) ) $options['loop_playlist'] = 0;
		if( !isset($options['body_wrapper_selector']) ) $options['body_wrapper_selector'] = null;
		if( !isset($options['audio_selector']) ) $options['audio_selector'] = null;
		if( !isset($options['title_selector']) ) $options['title_selector'] = null;
		if( !isset($options['description_selector']) ) $options['description_selector'] = null;

		// Add localised variables
		$localised_data = array(
			'activate_player' => $activate_player,
			'continuous_play' => $options['continuous_play'],
			'loop_playlist' => $options['loop_playlist'],
			'body_wrapper_selector' => $options['body_wrapper_selector'],
			'audio_selector' => $options['audio_selector'],
			'title_selector' => $options['title_selector'],
			'description_selector' => $options['description_selector'],
			'debug_msg' => $debug_msg
		);
		wp_localize_script( $this->plugin_name, 'audio_envelope', $localised_data );
		wp_enqueue_script( $this->plugin_name );


		/**
		 * Add additional custom css
		 */
		$custom_css = '';
        $colour = $options['player_colour'];
        if($colour) {
	        $custom_css .= "
				.aap-button svg path,
				.aap-button.highlighted:hover, .aap-button.highlighted:hover svg path,
				.player-button.light svg .circle path, .player-button.light svg .circle path, .player-button.light svg .ring,
				.player-button.light:hover svg .ring, .player-button.light:hover svg .play, .player-button.light:hover svg .pause,
				.player-button.dark svg .ring, .player-button.dark svg .play, .player-button.dark svg .pause,
				.player-button.dark:hover svg .circle path,
				.large-button.player-button svg .play, .large-button.player-button svg .pause path,
				#circle_timeline .elapsed textPath {
					fill: {$colour};
					stroke: {$colour};
				}
				.player-timeline svg .mainline {
				  	stroke: {$colour};
				}
				.aap-button:hover svg, .aap-button:hover svg path,
				.aap-button.highlighted, .aap-button.highlighted svg,
				.ae-playlist-item.ae-playlist-playing {
					background-color: {$colour};
				}
				.timelines .elapsed {
					color: {$colour};
				}
				.expanded-playlist-player .ae-playlist-tracks-wrapper {
					border-top: 2px solid {$colour} !important;
				}
				@media all and (max-width: 767px) {
				  .expanded-playlist-player .ae-playlist-tracks-wrapper {
				    border-top: 2px solid {$colour} !important;
				  }
				}
			";
    	}

        $top_offset = ( $options['player_top_offset'] ) ? $options['player_top_offset'] : 0;
        $bottom_offset = ( $options['player_bottom_offset'] ) ? $options['player_bottom_offset'] : 0;
        if( $top_offset || $bottom_offset ) {
	        $custom_css .= "
	        	#mejs-player-panel .ae-playlist {
				  top: {$top_offset};
				  bottom; {$bottom_offset};
				  height: calc( 100vh  - ({$top_offset} + {$bottom_offset}) );
				}
				.admin-bar #mejs-player-panel .ae-playlist {
				  top: calc( {$top_offset} + 32px );
				  bottom; {$bottom_offset};
				  height: calc( 100vh - ({$top_offset} + {$bottom_offset} + 32px) );
				}
			";
		}
        wp_add_inline_style( $this->plugin_name, $custom_css );
	}

	/**
	 * Add an HTML class to MediaElement.js container elements to aid styling.
	 *
	 * Extends the core _wpmejsSettings object to add a new feature via the
	 * MediaElement.js plugin API.
	 */
	function mejs_add_container_class() {
		if ( ! wp_script_is( 'mediaelement', 'done' ) ) {
			return;
		}
		?>
		<script>
		(function() {
			var settings = window._wpmejsSettings || {};
			settings.features = settings.features || mejs.MepDefaults.features;
			settings.features.push( 'containerclass' );
			MediaElementPlayer.prototype.buildcontainerclass = function( player ) {
		  		player.container.addClass( 'or-mejs-container' );
			};
		})();
		</script>
		<?php
	}

	/**
	 * Automatically load embedded audio files' metadata. Out of the box, WordPress has this set to 'none' for audio files. 
	 * When none, the duration of audio tracks doesn't show on the frontend. 
	 */
	function load_audio_metadata_by_default( $out, $pairs, $atts ) {
	    if ( !isset($atts['preload']) ) {
	    	$out['preload'] = 'auto';
	  	}
	    return $out;
	}

	/**
	 * Outputs the templates used by playlists.
	 *
	 * @since 3.9.0
	 */
	function wp_underscore_playlist_templates() {
		//include_once( "templates/wp-player-button.php" );
		include_once( "templates/ae-playlist-panel.php" );
		//include_once( "templates/wp-playlist-current-item.php" );
		include_once( "templates/ae-playlist-item.php" );

		//$buttons = ['play-pause','play','pause','stop','close','hamburger','previous','next','back15s','skip15s'];
		$buttons = ['play-pause','close-expand','back15s','skip15s','previous','next'];
		foreach( $buttons as $button ) {
			print '<script type="text/html" id="tmpl-audio-player-'.$button.'-button">';
			include_once( 'images/'.$button.'.svg' );
			print '</script>'."\n";
		}

		print '<script type="text/html" id="tmpl-audio-player-circle-play-pause-button">';
		include_once( 'images/circle-play-pause.svg' );
		print '</script>'."\n";

	}

}
