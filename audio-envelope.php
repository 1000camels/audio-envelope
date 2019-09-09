<?php
/**
 * @link    https://aporia.info
 * @since   1.0.0
 * @package Audio_Envelope
 *
 * @wordpress-plugin
 * Plugin Name:       Audio Envelope
 * Plugin URI:        https://aporia.info/wp/audio-envelope/
 * Description:       This plugin renders an audio player and playlist for all audio elements within a page. It pulls together disparate audio files listed in posts (typically in the excepts in posts) and provide a single player to control them. It also keeps track of play point and can even continue to play the audio on subsequent pages that it is listed on.
 * Version:           1.0.7
 * Author:            Darcy Christ
 * Author URI:        https://aporia.info
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       audio-envelope
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined('WPINC') ) {
    die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define('AUDIO_ENVELOPE_VERSION', '1.0.7');

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-audio-envelope-activator.php
 */
function activate_audio_envelope()
{
    include_once plugin_dir_path(__FILE__) . 'includes/class-audio-envelope-activator.php';
    Audio_Envelope_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-audio-envelope-deactivator.php
 */
function deactivate_audio_envelope()
{
    include_once plugin_dir_path(__FILE__) . 'includes/class-audio-envelope-deactivator.php';
    Audio_Envelope_Deactivator::deactivate();
}

register_activation_hook(__FILE__, 'activate_audio_envelope');
register_deactivation_hook(__FILE__, 'deactivate_audio_envelope');

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path(__FILE__) . 'includes/class-audio-envelope.php';


/**
 * Load the gutenberg block
 */
require plugin_dir_path(__FILE__) . 'blocks/audio-envelope.php';


/**
 * Load Elementor extensions
 */
include_once( plugin_dir_path( __FILE__ ) . 'elementor/init.php' );



function add_blocks_in_excerpt( $allowed_blocks ) {
    $allowed_blocks[] = 'core/audio';
    $allowed_blocks[] = 'audio-envelope/audio-envelope';
    //error_log(print_r($allowed_blocks,TRUE));
    return $allowed_blocks;
}


/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since 1.0.0
 */
function run_audio_envelope()
{

    add_filter( 'excerpt_allowed_blocks', 'add_blocks_in_excerpt' );
	add_filter( 'the_excerpt', 'shortcode_unautop');
	add_filter( 'the_excerpt', 'do_shortcode');
	add_filter( 'get_the_excerpt', 'do_shortcode', 5 );

    //remove_filter( 'get_the_excerpt', 'wp_trim_excerpt', 10, 2 );

    $plugin = new Audio_Envelope();
    $plugin->run();

}
run_audio_envelope();
