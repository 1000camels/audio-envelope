<script type="text/html" id="tmpl-ae-playlist-current-item">
	<# if ( data.image ) { #>
	<img src="{{ data.thumb.src }}" alt="" />
	<# } #>
	<div class="\">
		<span class="ae-playlist-item-meta ae-playlist-item-title"><?php
			/* translators: playlist item title */
			printf( _x( '%s', 'playlist item title' ), '{{ data.title }}' );
		?></span>
		<# if ( data.meta.album ) { #><span class="ae-playlist-item-meta ae-playlist-item-album">{{ data.meta.album }}</span><# } #>
		<# if ( data.meta.artist ) { #><span class="ae-playlist-item-meta ae-playlist-item-artist">{{ data.meta.artist }}</span><# } #>
		<div class="ae-playlist-item-currenttime">Time: {{ data.currentTime_formatted }}</div>
		<div class="ae-playlist-item-remaining">Remaining: {{ data.remaining_formatted }}</div>
		<div class="ae-playlist-item-duration">Duration: {{ data.duration_formatted }}</div>
		<div class="ae-playlist-item-buffered">Buffered: {{ data.buffered_formatted }}</div>
	</div>
</script>