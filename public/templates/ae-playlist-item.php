<script type="text/html" id="tmpl-ae-playlist-item">
	<div class="ae-playlist-item">
		<a class="ae-playlist-caption" href="{{ data.src }}">
			{{ data.index ? ( data.index + '. ' ) : '' }}
			<h5 class="ae-playlist-item-title"><?php
				/* translators: playlist item title */
				printf( _x( '%s', 'playlist item title' ), '{{{ data.title }}}' );
			?></h5>
			<# if ( data.description ) { #>
				<div class="ae-playlist-item-description">{{{ data.description }}}</div>
			<# } #>
		</a>
		<# if ( data.meta.length_formatted ) { #>
		<div class="ae-playlist-item-length">{{ data.meta.length_formatted }}</div>
		<# } #>
	</div>
</script>