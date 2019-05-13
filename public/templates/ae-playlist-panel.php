<script type="text/html" id="tmpl-ae-playlist-panel">
	<section id="mejs-player-panel">
		<div class="ae-playlist">
			<div id="main-player">
				<div class="left-side">
					<div class="timelines">
						<div class="elapsed"></div>
						<div id="vertical_timeline" class="player-vertical-timeline player-timeline ldBar2"
						  data-value="1"
						  data-preset="line"
						  data-min="0"
						  data-max="100000"
						  data-stroke-width="14"
						  data-stroke-trail-width="14"
					      data-path="M 0 0 L 0 600"
					      data-bbox="0 0 2 600"
						>
							<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" width="100%" height="100%" viewBox="-21 -21 44 642">
								<path d="M 0 0 L 0 600" fill="none" class="baseline" stroke="#ddd" stroke-width="14"></path>
								<path d="M 0 0 L 0 600" class="mainline" clip-path="" fill="none" stroke-width="14" stroke="#25b" stroke-dasharray="450.7861346417072 600"></path>
							</svg>
						</div>
						<div id="horizontal_timeline" class="player-horizontal-timeline player-timeline ldBar2"
						  data-value="1"
						  data-preset="line"
						  data-min="0"
						  data-max="100000"
						  data-stroke-width="14"
						  data-stroke-trail-width="14"
					      data-path="M 0 0 L 700 0"
					      data-bbox="0 0 700 2"
						>
							<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" width="100%" height="100%" viewBox="-21 -21 742 44">
								<path d="M 0 0 L 700 0" fill="none" class="baseline" stroke="#ddd" stroke-width="14"></path>
								<path d="M 0 0 L 700 0" class="mainline" clip-path="" fill="none" stroke-width="14" stroke="#25b" stroke-dasharray="525.9171570819917 700"></path>
							</svg>
						</div>
						<div class="remaining"></div>
					</div>
				</div>
				<div class="right-side">
					<div id="circle_timeline" class="player-circle-timeline player-timeline ldBar2"
					  data-value="1"
					  data-preset="circle"
					  data-min="0"
					  data-max="100000"
					  data-stroke-width="14"
					  data-stroke-trail-width="14"
					>
						<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" width="100%" height="100%" viewBox="0 0 100 100">
							<defs xmlns="http://www.w3.org/2000/svg">
								<path id="upper_text_path" d="M20,35 C 35 10, 65 10, 80 35"/>
								<path id="lower_text_path" d="M20,65 C 35 90, 65 90, 80 65"/>
							</defs>
							<path d="M50 10A40 40 0 0 1 50 90A40 40 0 0 1 50 10" class="baseline" fill="none" stroke="#fff" stroke-width="14"></path>
							<path d="M50 10A40 40 0 0 1 50 90A40 40 0 0 1 50 10" fill="none" class="bufferline" stroke-width="14" stroke="#e6e6e6"></path>
							<path d="M50 10A40 40 0 0 1 50 90A40 40 0 0 1 50 10" fill="none" class="scrubline" stroke-width="14" stroke="#b3b3b3"></path>
							<path d="M50 10A40 40 0 0 1 50 90A40 40 0 0 1 50 10" class="mainline" fill="none" stroke-width="14" stroke="#189e98"></path>
							<text class="elapsed" dy="10">
								<textPath stroke="black" href="#upper_text_path" startOffset="50%">01:25</textPath>
							</text>
							<text class="remaining" dy="-4">
								<textPath stroke="black" href="#lower_text_path" startOffset="51%">25:32</textPath>
							</text>
						</svg>
					</div>
				</div>
			</div>
			<div class="ae-playlist-tracks-wrapper">
				<div id="tracks" class="ae-playlist-tracks"></div>
			</div>
			<script type="application/json" class="ae-playlist-script"></script>
		</div>
	</section>
</script>