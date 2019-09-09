<?php
namespace Elementor_Audio_Envelope;

/**
 * Plugin Name: Elementor Audio Envelope
 * Description: This adds Audio Envelope to Elementor
 * Plugin URI: https://aporia.info/wp/audio-envelope/
 * Version: 0.0.1
 * Author: Darcy Christ
 * Author URI: https://aporia.info
 * Text Domain: elementor-audio-envelope
 */

final class Elementor_Audio_Envelope {

/**
    * Plugin Version
    *
    * @since 1.0.0
    *
    * @var string The plugin version.
    */
   const VERSION = '1.0.0';

   /**
    * Minimum Elementor Version
    *
    * @since 1.0.0
    *
    * @var string Minimum Elementor version required to run the plugin.
    */
   const MINIMUM_ELEMENTOR_VERSION = '2.0.0';

   /**
    * Minimum PHP Version
    *
    * @since 1.0.0
    *
    * @var string Minimum PHP version required to run the plugin.
    */
   const MINIMUM_PHP_VERSION = '7.0';

   /**
    * Instance
    *
    * @since 1.0.0
    *
    * @access private
    * @static
    *
    * @var Elementor_Test_Extension The single instance of the class.
    */
   private static $_instance = null;

   /**
    * Instance
    *
    * Ensures only one instance of the class is loaded or can be loaded.
    *
    * @since 1.0.0
    *
    * @access public
    * @static
    *
    * @return Elementor_Test_Extension An instance of the class.
    */
   public static function instance() {

      if ( is_null( self::$_instance ) ) {
         self::$_instance = new self();
      }
      return self::$_instance;

   }

   /**
    * Constructor
    *
    * @since 1.0.0
    *
    * @access public
    */
   public function __construct() {

      add_action( 'init', [ $this, 'i18n' ] );
      add_action( 'plugins_loaded', [ $this, 'init' ] );

   }

   /**
    * Load Textdomain
    *
    * Load plugin localization files.
    *
    * Fired by `init` action hook.
    *
    * @since 1.0.0
    *
    * @access public
    */
   public function i18n() {

      load_plugin_textdomain( 'elementor-audio-envelope' );

   }

   /**
    * Initialize the plugin
    *
    * Load the plugin only after Elementor (and other plugins) are loaded.
    * Checks for basic plugin requirements, if one check fail don't continue,
    * if all check have passed load the files required to run the plugin.
    *
    * Fired by `plugins_loaded` action hook.
    *
    * @since 1.0.0
    *
    * @access public
    */
   public function init() {

      // Check if Elementor installed and activated
      if ( ! did_action( 'elementor/loaded' ) ) {
         add_action( 'admin_notices', [ $this, 'admin_notice_missing_main_plugin' ] );
         return;
      }

      // Check for required Elementor version
      if ( ! version_compare( ELEMENTOR_VERSION, self::MINIMUM_ELEMENTOR_VERSION, '>=' ) ) {
         add_action( 'admin_notices', [ $this, 'admin_notice_minimum_elementor_version' ] );
         return;
      }

      // Check for required PHP version
      if ( version_compare( PHP_VERSION, self::MINIMUM_PHP_VERSION, '<' ) ) {
         add_action( 'admin_notices', [ $this, 'admin_notice_minimum_php_version' ] );
         return;
      }


      // Add Plugin actions
      add_action( 'elementor/frontend/before_enqueue_scripts', [ $this, 'init_scripts' ] );
      add_action( 'elementor/frontend/after_enqueue_styles', [ $this, 'init_styles' ] );

      add_action( 'elementor/widgets/widgets_registered', [ $this, 'init_widgets' ] );
      add_action( 'elementor/controls/controls_registered', [ $this, 'init_controls' ] );

      add_action( 'elementor/widget/posts/skins_init', [ $this, 'add_elementor_skins' ] );

   }

   /**
    * Admin notice
    *
    * Warning when the site doesn't have Elementor installed or activated.
    *
    * @since 1.0.0
    *
    * @access public
    */
   public function admin_notice_missing_main_plugin() {

      if ( isset( $_GET['activate'] ) ) unset( $_GET['activate'] );

      $message = sprintf(
         /* translators: 1: Plugin name 2: Elementor */
         esc_html__( '"%1$s" requires "%2$s" to be installed and activated.', 'elementor-audio-envelope' ),
         '<strong>' . esc_html__( 'Elementor Test Extension', 'elementor-audio-envelope' ) . '</strong>',
         '<strong>' . esc_html__( 'Elementor', 'elementor-audio-envelope' ) . '</strong>'
      );

      printf( '<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>', $message );

   }

   /**
    * Admin notice
    *
    * Warning when the site doesn't have a minimum required Elementor version.
    *
    * @since 1.0.0
    *
    * @access public
    */
   public function admin_notice_minimum_elementor_version() {

      if ( isset( $_GET['activate'] ) ) unset( $_GET['activate'] );

      $message = sprintf(
         /* translators: 1: Plugin name 2: Elementor 3: Required Elementor version */
         esc_html__( '"%1$s" requires "%2$s" version %3$s or greater.', 'elementor-audio-envelope' ),
         '<strong>' . esc_html__( 'Elementor Test Extension', 'elementor-audio-envelope' ) . '</strong>',
         '<strong>' . esc_html__( 'Elementor', 'elementor-audio-envelope' ) . '</strong>',
          self::MINIMUM_ELEMENTOR_VERSION
      );

      printf( '<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>', $message );

   }

   /**
    * Admin notice
    *
    * Warning when the site doesn't have a minimum required PHP version.
    *
    * @since 1.0.0
    *
    * @access public
    */
   public function admin_notice_minimum_php_version() {

      if ( isset( $_GET['activate'] ) ) unset( $_GET['activate'] );

      $message = sprintf(
         /* translators: 1: Plugin name 2: PHP 3: Required PHP version */
         esc_html__( '"%1$s" requires "%2$s" version %3$s or greater.', 'elementor-audio-envelope' ),
         '<strong>' . esc_html__( 'Elementor Test Extension', 'elementor-audio-envelope' ) . '</strong>',
         '<strong>' . esc_html__( 'PHP', 'elementor-audio-envelope' ) . '</strong>',
          self::MINIMUM_PHP_VERSION
      );

      printf( '<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>', $message );

   }

   /**
    * init_scripts
    *
    * Load required plugin core files.
    *
    * @since 1.2.0
    * @access public
    */
   public function init_scripts() {

      // wp_enqueue_script( 
      //    'audio-envelope-elementor', 
      //    plugins_url( '/assets/js/scripts.js', __FILE__ ), 
      //    [
      //       'jquery',
      //       'elementor-sticky',
      //    ], 
      //    false, 
      //    true 
      // );

   }

   /**
    * init_styles
    *
    * Load required css files.
    *
    * @since 1.2.0
    * @access public
    */
   public function init_styles() {

      wp_register_style( 'elementor-extensions-styles', plugins_url( '/assets/css/style.css', __FILE__ ) );
      wp_enqueue_style( 'elementor-extensions-styles' );

   }

   public function init_widgets() {

      require_once( plugin_dir_path( __FILE__ ) . 'widgets/audio-envelope.php' );
      \Elementor\Plugin::instance()->widgets_manager->register_widget_type( new Widgets\Audio_Envelope_Widget() );

   }

   public function init_controls() {

      require_once( plugin_dir_path( __FILE__ ) . 'controls/audio.php' );
      $controls_manager = \Elementor\Plugin::$instance->controls_manager;
      $controls_manager->register_control( 'audio', new Controls\Control_Audio() );

   }

   public function add_elementor_skins( $widget ) {

      require_once( plugin_dir_path( __FILE__ ) . 'skins/ae-cards.php' );
      $widget->add_skin( new Skins\AE_Cards( $widget ) );

   }

}
Elementor_Audio_Envelope::instance();