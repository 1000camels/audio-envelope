<?php
/**
 * This provides a skin for Posts sourcing Winner post types
 *
 * @author: 			Darcy Christ
 */
namespace Elementor_Audio_Envelope\Skins;

use Elementor\Group_Control_Image_Size;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}


class AE_Cards extends \ElementorPro\Modules\Posts\Skins\Skin_Base {

	public function get_id() {
		return 'ae-cards';
	}
	public function get_title() {
		return __( 'Audio Envelope Cards', 'elementor-audio-envelope' );
	}


	public function render() {
		$this->parent->query_posts();

		/** @var \WP_Query $query */
		$query = $this->parent->get_query();

		if ( ! $query->found_posts ) {
			return;
		}

		$this->render_loop_header();

		// It's the global `wp_query` it self. and the loop was started from the theme.
		if ( $query->in_the_loop ) {
			$this->current_permalink = get_permalink();
			$this->render_card();
		} else {
			while ( $query->have_posts() ) {
				$query->the_post();

				$this->current_permalink = get_permalink();
				$this->render_card();
			}
		}

		wp_reset_postdata();

		$this->render_loop_footer();
	}


	public function render_card() {
		?>
		<div class="elementor-post__excerpt">
			<?php 
			$blocks = parse_blocks( get_the_content() );
			error_log(count($blocks));
			foreach( $blocks as $block ) {
				if( null == $block['blockName'] ) {
					$this->render_post();
					break;
				}
				if( 'audio-envelope/audio-envelope' == $block['blockName'] ) {
					error_log(print_r($blocks,true));

					$this->render_post_header();

					// $this->render_thumbnail();
					// $this->render_text_header();
					$this->render_title();
					// $this->render_meta_data();
					echo render_block( $block );
					//echo do_shortcode( $block['innerHTML'] );
					// $this->render_excerpt();
					// $this->render_read_more();
					// $this->render_text_footer();

					$this->render_post_footer();
					break;
				}
			}

			?>
		</div>
		<?php
	}
	
}