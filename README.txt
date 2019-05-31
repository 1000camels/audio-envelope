=== Audio Envelope ===
Contributors: 1000camels, standiers
Donate link: https://aporia.info
Tags: audio, player
Requires at least: 3.5
Tested up to: 5.2
Stable tag: 1.0.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

This plugin creates a player and playlist from all audio elements on the page.

== Description ==

This plugin renders an audio player and playlist for all audio elements within a page. It pulls together disparate audio files listed in posts (typically in the excerpts in posts) and provide a single player to control them. It also keeps track of the play point and can even continue to play the audio on subsequent pages that it is listed on.

== Installation ==

1. Upload `audio-envelope/` to the `/wp-content/plugins/` directory
1. Activate the plugin through the 'Plugins' menu in WordPress

== Frequently Asked Questions ==

= Why would you want to use this? =

This plugin was designed for podcasters who might want to show their episodes from one season within one player. By creating individual posts for each episode and then adding the audio to the displayed text (ie. excerpt), a central player is rendered, pulling together all the audio into a playlist and single player. It hides the individual audio players and replaces it with a simple play button that is connected to the player.

Use Audio Envelope as a way to feature a collection of audio on a single page.

= Why does the audio stop playing when I navigate through the site? =

This is a 'feature' of how your site is working. In order to support audio continuing to play, the content of your site needs to load dynamically, using something like React. If this is important to your site consider looking for a REACT-based theme, or seek out a developer who can build this functionality for you. It is possible, but beyond the scope of this plugin.

Audio Envelope does however, support continuous play if the same audio remains on all pages that you navigate to. 

We are also exploring ways to 'carry' the audio around with you, however the audio will pause because as the page changes.

== Screenshots ==

1. Expanded full player and playlist for desktop
2. Collapsed player for desktop
3. Expanded full player and playlist for mobile
4. Collapsed player for mobile


== Changelog ==

= 1.0.0 =
* Initial release

= 1.0.1 =
* Fixing issues with text and description selectors
* Adding options for adjusting these selectors

= 1.0.2 =
* Fixed issue with active state of audio
* Excluding title and description from localStorage to catch change in the page

= 1.0.3 =
* Fixed issue with state without currentTime