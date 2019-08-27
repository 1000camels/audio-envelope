<?php
/**
 * Functions to register client-side assets (scripts and stylesheets) for the
 * Gutenberg block.
 *
 * @package audio-envelope
 */

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 *
 * @see https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type/#enqueuing-block-scripts
 */
function audio_envelope_block_init() {
	$dir = dirname( __FILE__ );

	$index_js = 'audio-envelope/index.js';
	wp_register_script(
		'audio-envelope-block-editor',
		plugins_url( $index_js, __FILE__ ),
		array(
			'wp-blocks',
			'wp-i18n',
			'wp-element',
		),
		filemtime( "$dir/$index_js" )
	);

	$editor_css = 'audio-envelope/editor.css';
	wp_register_style(
		'audio-envelope-block-editor',
		plugins_url( $editor_css, __FILE__ ),
		array(
			'wp-blocks',
		),
		filemtime( "$dir/$editor_css" )
	);

	$style_css = 'audio-envelope/style.css';
	wp_register_style(
		'audio-envelope-block',
		plugins_url( $style_css, __FILE__ ),
		array(
			'wp-blocks',
		),
		filemtime( "$dir/$style_css" )
	);

	register_block_type( 'audio-envelope/audio-envelope', array(
		'editor_script' => 'audio-envelope-block-editor',
		'editor_style'  => 'audio-envelope-block-editor',
		'style'         => 'audio-envelope-block',
	) );

  //   register_post_meta( 'post', 'audio_envelope_meta_block_field', array(
		// 'show_in_rest' => true,
		// 'single' => true,
		// 'type' => 'string',,
	 //    'auth_callback' => function() {
	 //        return current_user_can( 'edit_posts' );
	 //    }
  //   ) );

}
add_action( 'init', 'audio_envelope_block_init' );
