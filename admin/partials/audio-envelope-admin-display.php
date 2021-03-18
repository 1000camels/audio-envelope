<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://aporia.info
 * @since      1.0.0
 *
 * @package    Audio_Envelope
 * @subpackage Audio_Envelope/admin/partials
 */
?>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->
<div class="wrap">
    
    <div id="icon-themes" class="icon32"></div>
    <h2><?php echo esc_html( get_admin_page_title() ); ?></h2>
         
    <?php
       $active_tab = isset( $_GET[ 'tab' ] ) ? $_GET[ 'tab' ] : 'display_options';
    ?>

    <h2 class="nav-tab-wrapper">
        <a href="?page=audio-envelope&tab=display_options" class="nav-tab <?php echo $active_tab == 'display_options' ? 'nav-tab-active' : ''; ?>">Display Options</a>
    </h2>

    <form action="options.php" method="post">
        <?php
        	settings_fields( $this->plugin_name . '_' . $active_tab );
            do_settings_sections( $this->plugin_name . '_' . $active_tab );

            submit_button();
        ?>
    </form>
</div>