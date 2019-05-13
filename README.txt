=== Audio Envelope ===
Contributors: 1000camels
Donate link: https://aporia.info
Tags: audio, player
Requires at least: 3.0.1
Tested up to: 5.2
Stable tag: 4.3
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

This plugin creates a player and playlist from all audio elements on the page.

== Description ==

This plugin renders an audio player and playlist for all audio elements within a page. It pulls together disparate audio files listed in posts (typically in the excepts in posts) and provide a single player to control them. It also keeps track of the play point and can even continue to play the audio on subsequent pages that it is listed on.

== Installation ==

1. Upload `audio-envelope/` to the `/wp-content/plugins/` directory
1. Activate the plugin through the 'Plugins' menu in WordPress

== Frequently Asked Questions ==

= Why would you want to use this? =

This plugin was designed for podcasters who might want to show their episodes from one season within one player. By creating individual posts for each episode and then adding the audio to the exposed text (ie. excerpt), a central player is rendered, pulling together all the audio into a playlist and single player. It hides the individual audio players and then adds a simple play button.

= Why does the audio stop playing when I navigate through the site? =

This is an affect of how your site is working. In order to keep a player playing, the content of your site needs to load dynamically, using something like React. This plugin does support continuous play if the same audio remains on all pages that you navigate to. We are also exploring ways to 'carry' the audio around with you, however the audio will pause because page changes.

== Screenshots ==


== Changelog ==

= 1.0 =
* Initial release