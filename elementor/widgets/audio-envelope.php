<?php
namespace Elementor_Audio_Envelope\Widgets;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Audio_Envelope_Widget extends \Elementor\Widget_Base {

   public function get_name() {
      return 'audio-envelope-widget';
   }

   public function get_title() {
      return __( 'Audio Envelope', 'elementor-audio-envelope' );
   }

   public function get_icon() {
      return 'fa fa-play-circle';
   }

   public function get_categories() {}

   protected function _register_controls() {

      $this->add_control(
         'section_ae_content',
         [
            'label' => __( 'Content', 'elementor-audio-envelope' ),
            'type' => \Elementor\Controls_Manager::SECTION,
         ]
      );

      $this->add_control(
         'title',
         [
            'label' => __( 'Title', 'elementor-audio-envelope' ),
            'type' => \Elementor\Controls_Manager::TEXT,
            'default' => '',
            'title' => __( 'Add a title', 'elementor-audio-envelope' ),
            'section' => 'section_ae_content',
         ]
      );

      $this->add_control(
         'description',
         [
            'label' => __( 'Description', 'elementor-audio-envelope' ),
            'type' => \Elementor\Controls_Manager::WYSIWYG,
            'default' => '',
            'title' => __( 'Write a description', 'elementor-audio-envelope' ),
            'section' => 'section_ae_content',
         ]
      );

      // $this->add_control(
      //    'audio',
      //    [
      //       'label' => __( 'Choose Audio from Media Library', 'elementor-audio-envelope' ),
      //       'type' => 'audio',
      //       'default' => [
      //          'url' => \Elementor\Utils::get_placeholder_image_src(),
      //       ],
      //       'description' => 'Or',
      //       'section' => 'section_ae_content',
      //    ]
      // );

      $this->add_control(
         'audio',
         [
            'label' => __( 'Audio URL', 'elementor-audio-envelope' ),
            'type' => \Elementor\Controls_Manager::URL,
            'placeholder' => __( 'https://aporia.info/wp-content/uploads/2019/01/What-is-audio-envelope.mp3', 'elementor-audio-envelope' ),
            'show_external' => true,
            'default' => [
               'url' => '',
               'is_external' => true,
               'nofollow' => true,
            ],
            'section' => 'section_ae_content',
         ]
      );

   }

   /**
    * Render content
    */
   protected function render() {
      $settings = $this->get_settings_for_display();

      $title = ! empty( $settings['title'] ) ? $settings['title'] : 'Title';
      $description = ! empty( $settings['description'] ) ? $settings['description'] : 'Description';
      $audio = ! empty( $settings['audio'] ) ? $settings['audio'] : 'https://aporia.info/wp-content/uploads/2019/01/What-is-audio-envelope.mp3';

      $description = $this->parse_text_editor( $description );

      $this->add_inline_editing_attributes( 'title', 'none' );
      $this->add_inline_editing_attributes( 'description', 'advanced' );

      ?>
      <div class="ae-block">
         <h2 class="ae-title" <?php echo $this->get_render_attribute_string( 'title' ); ?>><?php echo $title; ?></h2>
         <div class="ae-description" <?php echo $this->get_render_attribute_string( 'description' ); ?>>
            <?php echo $description; ?>
         </div>
         <figure class="wp-block-audio ae-audio">
            <audio controls src="<?php echo $audio; ?>"></audio>
         </figure>
      </div>
      <?php
   }

   /**
    * Dynamically render content
    */
   protected function _content_template() {
      ?>
      <#
      view.addInlineEditingAttributes( 'title', 'none' );
      view.addInlineEditingAttributes( 'description', 'basic' );
      #>
      <div class="ae-block">
         <h2 class="ae-title" {{{ view.getRenderAttributeString( 'title' ) }}}>{{{ settings.title }}}</h2>
         <div class="ae-description" {{{ view.getRenderAttributeString( 'description' ) }}}>
            {{{ settings.description }}}
         </div>
         <figure class="wp-block-audio ae-audio">
            <audio controls src="{{{ settings.audio }}}"></audio>
         </figure>
      </div>
      <?php
   }

}