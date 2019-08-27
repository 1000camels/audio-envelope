/**
 * This is the main code for Audio Envelope. It uses Backbone.js and scans the page for audio elements
 * and constructs a player and playlist from that 
 */

(function($){

var app = window.AporiaPlaylist = {
	start: function(data) {
		// window.localStorage.removeItem('audio-envelope-player');
		// window.localStorage.removeItem('audio-envelope-playlist');

		this.data = data;
		this.players = new this.Collections.Players( data.players );
		delete this.data.players;


		// create an outer container for the main div
		// * this is a problem if there isn't one main div
		// :TODO: could be customised to allow specifying container
		$('body > div:first-child').wrapAll( '<section id="mejs-body-container" />' );

		// Add the playlist container
		var playlist_template = wp.template('ae-playlist-panel');
		$('#mejs-body-container').after( playlist_template() );


		// Instantiate the Players (play buttons on entryies)
		new this.Views.Players({ collection: this.players });

		// Instantiate the Playlist & Tracks
		new this.Views.Playlist({ id: 'mejs-player-panel', model: new app.Models.Playlist(), collection: this.players });
	}
};

// Extend wp.Backbone.View with .prepare() and .inject()
app.View = wp.Backbone.View.extend({
	inject: function( selector ) {
		this.render();
		this.views.ready();
	},

	prepare: function() {
		if ( ! _.isUndefined( this.model ) && _.isFunction( this.model.toJSON ) ) {
			return this.model.toJSON();
		} else {
			return {};
		}
	}
});

// Adds a `toggle` method to Backbone.Model.
// Toggles the value of an attribute and fires a `"change"`.
app.Model = Backbone.Model.extend({ 
	toggle: function(attr, options) {
		options = options ? _.clone(options) : {}
		return this.set(attr, !this.get(attr), options);
	}
});


/* -------------------------------------------------------------------------------- */
/* 									MODELS 											*/
/* -------------------------------------------------------------------------------- */

app.Models = {};

app.Models.Player = app.Model.extend({
    defaults : {
    	id: '',
    	audio_id: '',
        src: '',
        type: '',
        title: '', 
        caption: '', 
        description: '',
        artists: true,
		tracknumbers: true,
        meta: {},
        active: false,
        playing: false,
        currentTime: 0,
        //duration: 0,
        //remaining: 0,
        //buffered: 0,
        //elapsed: '',
        //elapsed_percentage: '',
        // duration_formatted: '',
        // remaining_formatted: '',
        // buffered_formatted: '',
    },

	localStorage: new Backbone.LocalStorage('audio-envelope-player'),
	//sessionStorage: new Backbone.SessionStorage('audio-envelope-player'),
    //browserStorage: new Backbone.BrowserStorage('audio-envelope-player', 'session'),

    initialize : function() {
    	this.on( "change", this.storeData );
    	//this.on( "change:currentTime", this.updatingCurrentTime );
    },

	// store data in localStorage
	storeData:  function( model, val, opts ) {
		this.save();
	},

	makeActive : function(options) {
		//console.log('making model '+this.get('title')+' active')
		this.set('active', true, options);
	},

	makeInactive : function(options) {
		//console.log('making model '+this.get('title')+' inactive')
		this.set('active', false, options);
	},

	play : function(options) {
		//console.log('making model '+this.get('title')+' not paused')
		this.set('playing', true, options);
	},

	pause : function(options) {
		//console.log('making model '+this.get('title')+' paused')
		this.set('playing', false, options);
	},

	getAudioID : function() {
		return this.get('audio_id');
	},

	// this generates a mep id from the index
	// we created this instead of storing the mep
	// getMEPID : function() {
	// 	return 'ae_'+this.collection.indexOf(this)
	// },

	getAudioProperty : function( property ) {
		if( !property ) return;

		var audio_id = this.getAudioID();
		var this_audio_player = $('#'+audio_id).get(0);
		if(!this_audio_player) return;

		return this_audio_player[property];
	},

	updatingCurrentTime : function() {
		console.log('updating cT: '+this.get('currentTime'))
	}

});

app.Models.Playlist = app.Model.extend({
	defaults : {
		id: '',
		type: "audio",
		minimised: false,
		tracklist: true,
		tracks: [],
		scrubbing: false,
		scrubbedToCurrentTime: '',
		autoplay: true,
	},

	localStorage: new Backbone.LocalStorage('audio-envelope-playlist'),
	//sessionStorage: new Backbone.SessionStorage('audio-envelope-playlist'),
    //browserStorage: new Backbone.BrowserStorage('audio-envelope-playlist', 'session'),

    initialize : function() {
    	this.on( "change", this.storeData );
    	//this.on( "change:scrubbing", this.isScrubbing );
    	//this.on( "change:scrubbedToCurrentTime", this.showScrubbedTime );
    },

	// store data in sessionStorage or localStorage
	storeData : function( model, val, opts ) {
		this.save();
	},

	isScrubbing : function( model, val, opts ) {
		console.log('scrubbing: '+this.get('scrubbing'));
	},
	showScrubbedTime : function( model, val, opts ) {
		console.log('scrubbedToCurrentTime: '+this.get('scrubbedToCurrentTime'));
	}
});


/* -------------------------------------------------------------------------------- */
/* 									COLLECTIONS										*/
/* -------------------------------------------------------------------------------- */

app.Collections = {};

app.Collections.Players = Backbone.Collection.extend({
	model: app.Models.Player,

	initialize : function() {
		this.on( "change:active", this.changeActive );
    	this.on( "change:playing", this.changePlaying );
	},

	// change active 
	changeActive: function( model, val, opts ) {
		if( val ){
			this.each( function( e ) {
				if( e != model && e.get('active') ) {
					e.makeInactive();
				}
			});
		};
	},

	// change playing 
	changePlaying: function( model, val, opts ) {
		if( val ){
			this.each( function( e ) {
				if( e != model && e.get('playing') ) e.pause();
			});
		};
	},

	getCurrentPlayer : function() {
		var currentPlayer = false;
    	_.each( this.models, function(model) {
    		if( model.get('active') ) {
    			//console.log('currentPlayer is '+model.get('src'))
	    		currentPlayer = model
	    		return false
    		}
    	});

    	// make first player as active
    	if( ! currentPlayer ) {
    		currentPlayer = this.first();
    		currentPlayer.makeActive();
    	}

    	return currentPlayer;
	}

});


/* -------------------------------------------------------------------------------- */
/* 									VIEWS											*/
/* -------------------------------------------------------------------------------- */
app.Views = {};


// Player view
app.Views.Player = app.View.extend({
	className : "ap-container",

	initialize : function() {
		//console.log('initialize app.Views.Player');

		var previous_model = this.model;
		var title = previous_model.get('title');
		var description = previous_model.get('description');

		// get data from storage
		this.model.fetch();

		// copy over new title and description, in case they have been changed
		// this is a hack to account for issues with localStorage
		this.model.set('title', title);
		this.model.set('description', description);

		// console.log(previous_model)
		// console.log(this.model)

		// jump back 2 seconds to account for time lapse when restarting play
  		this.model.set('currentTime', this.model.get('currentTime')-2);
		this.model.storeData();
		//console.log(this.model)


        this.listenTo(this.model, 'change:active', this.render);
        this.listenTo(this.model, 'change:playing', this.render);


		// Compile the template using underscore
		var button = wp.template( 'audio-player-circle-play-pause-button' );
		var buttonwrapper = $('<div class="player-button play-button light"></div>');
		buttonwrapper.append( button );

		// Load the compiled HTML into the Backbone "el"
		this.$el.prepend( buttonwrapper );

		// Show play button
		//this.$el.find('.player-button').removeClass('pause-button').addClass('play-button');

    	this.render();
	},

	events : {
		'click .player-button.play-button': 'clickPlay',
		'click .player-button.pause-button': 'clickPause'
	},

    clickPlay : function() {
  		this.model.makeActive();
  		this.model.play();
    }, 

    clickPause : function() {
  		this.model.pause();
    },
 
	renderPlay : function(e) {
		this.$el.find('.player-button').removeClass('play-button').addClass('pause-button');
	},
 
	renderPause : function(e) {
		this.$el.find('.player-button').removeClass('pause-button').addClass('play-button');
	},

	render : function() {
		//console.log('Player render '+this.model.get('id'))+' '+this.model.get('active');

		//console.log('Player.render() '+this.model.get('active'))
		var article = this.$el.closest('article');
		article.addClass('has-audio-player');
		//console.log('set player active '+this.model.get('active'))
		if( this.model.get('active') ) {
			//console.log('set player active')
			article.removeClass('inactive-player').addClass('active-player');
		} else {
			//console.log('set player inactive')
			article.removeClass('active-player').addClass('inactive-player');
		}

		// update button
    	//if( this.model.get('playing') !== this.model.previous('playing') ) {
    		if( this.model.get('playing') && this.model.get('active') ) {
    			this.renderPlay();
    		} else {
    			this.renderPause();
    		}
	    //}

	    this.controlAudio();
    },

    controlAudio : function() {
    	// if we are not paused, we are playing
		var audio_id = this.model.getAudioID();
		this_audio_player = $('#'+audio_id).get(0);
		if(!this_audio_player) return;

  		this_audio_player.currentTime = this.model.get('currentTime');

		if( this.model.get('playing') && this_audio_player.paused ) {
			// special code to deal with autoplay policy 
			// https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
	    	var promise = this_audio_player.play();

			if (promise !== undefined) {  
				promise.then(_ => {
					//console.log('no problem with autoplay')
			    })
			    .catch(error => {
					this.renderPause();
					//console.log('problem with autoplay')
			    });
			}

		}
		if( !this.model.get('playing') && !this_audio_player.paused ) {
			this_audio_player.pause();
		}
    },

    getContainer : function() {
    	
    }


});

// Playlist view
app.Views.Playlist = app.View.extend({
	el : '#mejs-player-panel',

	initialize : function(options) {
		this.model = options.model;
		this.tracks = options.collection;

		this.model.fetch();
		this.model.save();


		this.index = 0;
		this.settings = {};


		// events
        this.listenTo( this.tracks, 'change:active, change:playing', this.render ); 
        this.listenTo( this.tracks, 'change:currentTime', this.renderCurrent);


		// prepend to left side 
		var playpausebutton = wp.template( 'audio-player-play-pause-button' );
		var playpausebuttonwrapper = $('<div class="play-pause-button aap-button play-button"></div>');
		playpausebuttonwrapper.append( playpausebutton );
		$('#main-player .left-side').prepend( playpausebuttonwrapper );

		var closebutton = wp.template( 'audio-player-close-expand-button' );
		var closebuttonwrapper = $('<div class="close-expand-button opened aap-button highlighted"></div>');
		closebuttonwrapper.append( closebutton );
		$('#main-player .left-side').prepend( closebuttonwrapper );

		// append to left side
		var skipbackbutton = wp.template( 'audio-player-back15s-button' );
		var skipbackbuttonwrapper = $('<div class="skip-back-button aap-button"></div>');
		skipbackbuttonwrapper.append( skipbackbutton );
		$('#main-player .left-side').append( skipbackbuttonwrapper );

		var skipforwardbutton = wp.template( 'audio-player-skip15s-button' );
		var skipforwardbuttonwrapper = $('<div class="skip-forward-button aap-button"></div>');
		skipforwardbuttonwrapper.append( skipforwardbutton );
		$('#main-player .left-side').append( skipforwardbuttonwrapper );

		var prevbutton = wp.template( 'audio-player-previous-button' );
		var prevbuttonwrapper = $('<div class="prev-button aap-button"></div>');
		prevbuttonwrapper.append( prevbutton );
		$('#main-player .left-side').append( prevbuttonwrapper );

		var nextbutton = wp.template( 'audio-player-next-button' );
		var nextbuttonwrapper = $('<div class="next-button aap-button"></div>');
		nextbuttonwrapper.append( nextbutton );
		$('#main-player .left-side').append( nextbuttonwrapper );


		//this.data = options.metadata || this.playlist_data || $.parseJSON( this.$('script.ae-playlist-script').html() );
		this.playerNode = $( this.model.get('type') ); //$( this.data.type );


		// Compile the template using underscore
		var button = wp.template( 'audio-player-play-pause-button' );
		var buttonwrapper = $('<div class="large-button player-button play-button"></div>');
		buttonwrapper.append( button );

		// Load the compiled HTML into the Backbone "el"
		$('#main-player .right-side').append( buttonwrapper );

		// Load the compiled HTML into the Backbone "el"
		//this.$el.find('.ae-playlist').prepend( button );

		if ( this.model.get('tracklist') ) {
			this.itemTemplate = wp.template( 'ae-playlist-item' );
			this.playingClass = 'ae-playlist-playing';
			this.renderTracks();
		}

		// $('.player-timeline svg').each(function() {
		// 	//console.log('found player-timeline svg')
		// 	var bufferline = $(this).find('g').has('.mainline').clone().removeClass('mainline').addClass('bufferline');
		// 	var scrubline = $(this).find('g').has('.mainline').clone().removeClass('mainline').addClass('scrubline');
		// 	$(this).append(bufferline);
		// 	$(this).append(scrubline);
		// });


		this.render();

		this.bindMediaElement();


        if( this.model.get('minimised') ) {
        	this.hidePlayer();
        } else {
        	var width = Math.max(window.screen.width, window.innerWidth);
        	if(width > 767) {
        		this.showPlayer();
        	}
        }


		this.isPlaying();
	},

	addTrackView : function( player ) {
		this.views.add( new app.Views.Track({ id: player.id }) );
	},

	events : {
		'click .close-expand-button': 'togglePlayer',
		'click .ae-playlist-item' : 'clickTrack',
		'click .large-button.player-button.play-button': 'clickPlay',
		'click .large-button.player-button.pause-button': 'clickPause',
		'click .play-pause-button.play-button': 'clickPlay',
		'click .play-pause-button.pause-button': 'clickPause',
		'click .skip-back-button': 'clickSkipBack',
		'click .skip-forward-button': 'clickSkipForward',
		'click .prev-button' : 'prevTrack',
		'click .next-button' : 'nextTrack',

		'mousedown .player-timeline svg': 'startScrubbing',
		//'touchstart .player-timeline svg': 'startScrubbing',
		'mousemove .player-timeline svg': 'captureScrubbing',
		//'touchmove .player-timeline svg': 'captureScrubbing',
		'mouseup .player-timeline svg': 'stopScrubbing',
		//'startend .player-timeline svg': 'stopScrubbing',
	},

	bindMediaElement : function() {
  		var this_playlist = this;
		var audio_id = this.current.getAudioID();
		var this_audio_player = $('#'+audio_id).get(0);

		// unbind events for all tracks
		$('mejs-container audio').off('timeupdate');
		$('mejs-container audio').off('ended');

		if(!this_audio_player || !this.current) return;

		// Restore play position
  		this_audio_player.currentTime = this.current.get('currentTime');

  		// This is the main event that is capturing the currentTime from the ME player
		$(this_audio_player).off('timeupdate').on('timeupdate', function() {
			if( !this_playlist.model.get('scrubbing') ) {
				var currentTime = this_audio_player.currentTime;
				//console.log('getting currentTime from mep: '+currentTime);
				this_playlist.current.set('currentTime', currentTime);
			}
	  	});

	  	$(this_audio_player).off('ended').on('ended', function(e) {
	  		this_playlist.trackEnded(e);
	  	});
  	},

	startScrubbing: function(e) {
  		//console.log('touchstart');
		this.model.set('scrubbing', true);

		this.captureScrubbing(e);
	},

	captureScrubbing: function(e) {
  		//console.log('touchmove');
		if( !this.model.get('scrubbing') ) return;

	    var target = e.target;

	    // our target should be the baseline
	    if(!$(target).hasClass('baseline')) {
	    	target = $(target).parents('.player-timeline').find('.baseline').get(0);
	    }
	    if( target == undefined ) return;


        if(e.touches) this.touchobj = e.touches[0];


	    var timeline = $(target).parents('.player-timeline');

		if(!this.current) return;

	    var currentTime = this.current.get('currentTime');
	    var duration = this.current.getAudioProperty('duration');


	    var dim = target.getBoundingClientRect();
	    if( this.touchobj ) {
	    	//console.log(touchobj[0])
	    	var mouseX = this.touchobj.clientX - dim.left;
	    	var mouseY = this.touchobj.clientY - dim.top;
	    } else {
	    	var mouseX = e.clientX - dim.left;
	    	var mouseY = e.clientY - dim.top;
	    }

	    //console.log(e.clientX+' '+e.clientY);

	    if(isNaN(mouseX) || isNaN(mouseY)) return; 

    	var target_length = target.getTotalLength();
	    var target_height = target.getBoundingClientRect().height;


	    if( timeline.attr('id') == 'circle_timeline' ) {

		    var radius = dim.height/2;
		    var centerX = radius;
		    var centerY = radius;
		    var circumference = 2 * Math.PI * radius;

			var diffX = mouseX - radius;
			var diffY = mouseY - radius;
			var angle = Math.atan2(diffY, diffX) + (Math.PI / 2);
		      if(angle < 0) angle += (2 * Math.PI);
		    var point = angle*radius;
		    
		    var offset = point / circumference * target_length;
			var scrubbedToCurrentTime = point / circumference * duration;
			//console.log('setting stroke-dasharray+: '+offset+' '+target_length);
	    	timeline.find('.mainline').attr('stroke-dasharray', offset+' '+target_length);

	    } 
	    else if( timeline.attr('id') == 'horizontal_timeline' ) {
			var marker = mouseX;
			var scrubbedToCurrentTime = marker / dim.width * duration;
	    	timeline.find('.mainline').attr('stroke-dasharray', marker+' '+dim.width);
	    	//console.log('stroke-dasharray: '+marker+' '+dim.width);
	    } else {
			var marker = mouseY;
			var scrubbedToCurrentTime = marker / dim.height * duration;
	    	timeline.find('.mainline').attr('stroke-dasharray', marker+' '+dim.height);
	    }

	    //console.log('setting scrubbedToCurrentTime: '+this.model.get('scrubbedToCurrentTime'));
	    this.model.set('scrubbedToCurrentTime', scrubbedToCurrentTime);
	},

	stopScrubbing : function(e) {
  		//console.log('touchend');
	    this.updatePlayer();

		this.model.set('scrubbing', false);
	},

	updatePlayer : function(e) {
		var audio_id = this.current.getAudioID();
		this_audio_player =$('#'+audio_id).get(0);

		var isPlaying = this.current.get('playing');
		this_audio_player.pause();
	     //console.log('setting currentTime: '+this.model.get('scrubbedToCurrentTime'));
  		this_audio_player.currentTime = this.model.get('scrubbedToCurrentTime');
	    if(isPlaying) this_audio_player.play();

	    this.renderTimeline();
	},

    clickPlay : function() {
  		if(this.current) {
  			this.current.makeActive();
  			this.current.play();
  		}
    }, 

    clickPause : function() {
  		if(this.current) {
  			this.current.pause();
  		}
    }, 

    clickSkipBack : function() {
  		if(this.current) {
			var audio_id = this.current.getAudioID();
  			var this_audio_player = $('#'+audio_id).get(0);
  			currentTime = this_audio_player.currentTime;
  			this_audio_player.currentTime = currentTime-15;
  		}
    }, 

    clickSkipForward : function() {
  		if(this.current) {
			var audio_id = this.current.getAudioID();
  			var this_audio_player = $('#'+audio_id).get(0);
  			currentTime = this_audio_player.currentTime;
  			this_audio_player.currentTime = currentTime+15;
  		}
    }, 

	trackEnded : function(e) {
		//if( this.current.getAudioD() != $(e.target).parents('.mejs-container').attr('id') ) return;

		this.current.pause();
		this.current.set('currentTime',0);
	  	e.target.currentTime = -1;

		this.nextTrack();

		this.current.play();
	},

	prevTrack : function() {
		//console.log('prev - do something!');

		var playing = this.current.get('playing');
		this.current.pause();

		this.index = this.index - 1 < 0 ? this.tracks.length - 1 : this.index - 1;
		this.setCurrent(this.index);

		this.scrollToTrack();

		if( playing ) {
			this.current.play();
		}
	},

	nextTrack : function() {
		//console.log('next - do something!');

		var playing = this.current.get('playing');
		this.current.pause();

		this.index = this.index + 1 >= this.tracks.length ? 0 : this.index + 1;
		this.setCurrent(this.index);

		this.scrollToTrack();
		
		if( playing ) {
			this.current.play();
		}
	},

	scrollToTrack : function() {
		var container = $('.ae-playlist-tracks-wrapper');
		var activeTrack = $('.ae-playlist-item.ae-playlist-playing');
		var scrollTo = container.scrollTop() + (activeTrack.offset().top - container.offset().top);
		$('.ae-playlist-tracks-wrapper').animate({scrollTop: scrollTo}, 1000);
	},
    
    isPlaying : function() {
    	this.setCurrent();
    },

	togglePlayer : function() {
		//console.log('togglePlayer');
		if( $('body').hasClass('expanded-playlist-player') ) {
			$('.close-expand-button').removeClass('opened').addClass('closed');
			this.hidePlayer();
		} else {
			$('.close-expand-button').removeClass('closed').addClass('opened');
			this.showPlayer();
		}
	},

	showPlayer : function() {
		this.model.set('minimised', false);
		$('body').addClass('expanded-playlist-player').removeClass('minimized-playlist-player');
	},
	
	hidePlayer : function() {
		this.model.set('minimised', true);
		$('body').addClass('minimized-playlist-player').removeClass('expanded-playlist-player');
	},

	clickTrack : function (e) {
		e.preventDefault();
	
		this.previous_index = this.index;
		this.index = this.$( '.ae-playlist-item' ).index( e.currentTarget );
		this.current = this.tracks.at(this.index);
		this.current.makeActive();
		//this.setCurrent();

		$('.ae-playlist-tracks-wrapper').animate({scrollTop: jQuery('.ae-playlist-item.ae-playlist-playing').offset().top}, 1000);

		if(!this.current.get('playing')) { //} && this.index != this.previous_index) {
			this.current.play();
		} else {
			this.current.pause();
		}

		document.title = this.current.get('title');
		 //console.log(document.title);
	},

	bindPlayer : function (mejs) {
		console.log('bindPlayer')
		this.mejs = mejs;
		this.mejs.addEventListener( 'ended', this.ended );
	},

	bindResetPlayer : function (mejs) {
		console.log('bindResetPlayer')
		this.bindPlayer( mejs );
	},

	setCurrent : function (index) {
		if(index != null) {
			var previous = this.current;
			this.index = index;
			this.current = this.tracks.at(this.index);
		} else {
			this.current = this.tracks.getCurrentPlayer();
		}

		if(!this.current) {
			if(this.index == -1) this.index = 0;
			this.current = this.tracks.at(this.index);
		}
		this.current.makeActive();

		this.bindMediaElement();

		if ( previous && previous !== this.current) {
    		this.renderCurrent();
		}
	},

	renderTimeline : function () {
		//console.log('renderTimeline');

		if( this.model.get('scrubbing') ) return;

	    // Update times
	    var currentTime = this.current.get( 'currentTime' );

		var audio_id = this.current.getAudioID();
		var this_audio_player = $('#'+audio_id).get(0);

	    var duration = this.current.getAudioProperty('duration');
	    var buffered = this.current.getAudioProperty('buffered');
	     //console.log('buffered: '+buffered);

		var elapsed = this.formatTime(currentTime);
		var elapsed_percentage = ( currentTime / duration ) * 100;
		var remaining = this.formatTime( (duration - currentTime) );


		// update time
		$('#circle_timeline .elapsed textPath, .timelines .elapsed').text(elapsed);
		$('#circle_timeline .remaining textPath, .timelines .remaining').text(remaining);


		// update progress line
		$('.player-timeline').each(function() {
			var player_baseline = $(this).find('.baseline');
			var player_mainline = $(this).find('.mainline');
	    	if( player_baseline.get(0) == undefined ) return;

			var length = player_baseline.get(0).getTotalLength();
			var marker = (currentTime / duration) * length;

			if(marker) {
				//console.log('setting mainline stroke-dasharray for '+$(this).attr('id')+': '+marker+' '+length+' based upon currentTime: '+currentTime);
				player_mainline.attr('stroke-dasharray', marker+' '+length);
			}
			// we would love to show a buffer line, but it does not seem to be available
			if(buffered) {
				var player_bufferline = $(this).find('.bufferline');
				var buffer_marker = (buffered / duration) * length;
				//console.log('setting bufferline stroke-dasharray for '+$(this).attr('id')+': '+buffer_marker+' '+length+' based upon currentTime: '+buffered);
				player_bufferline.attr('stroke-dasharray', buffer_marker+' '+length);
			}
		});

		// Save data to sessionStorage or localStorage
		this.current.storeData();
	},

	renderCurrent : function () {
		//console.log('Playlist renderCurrent');

		// set the current to the active track
		this.current = this.tracks.getCurrentPlayer();
		this.index = this.tracks.indexOf(this.current);

		if(!this.current) return;


	    $( '.ae-playlist-item' ).find('.player-button').removeClass('dark').addClass('light');

		if ( this.model.get('tracklist') ) {
			this.$( '.ae-playlist-item' )
				.removeClass( this.playingClass )
				.eq( this.index )
					.addClass( this.playingClass )
					.find('.player-button').removeClass('light')
										   .addClass('dark');
		}
	    
	    // change buttons on track
	    this.$( '.ae-playlist-item' ).find('.player-button').removeClass('pause-button').addClass('play-button');

	    var currentTrack = this.$( '.ae-playlist-item' ).eq( this.index );
		if( this.current.get('playing') ) {
	    	currentTrack.find('.player-button').removeClass('play-button').addClass('pause-button');
	    } else {
	    	currentTrack.find('.player-button').removeClass('pause-button').addClass('play-button');
	    }

	    this.renderTimeline();
	},

	formatTime : function( string ) {
		if( !isFinite( string ) ) {
			var timecode = '';
		} else {
			var timecode = mejs.Utils.secondsToTimeCode( parseInt(string) );
		}
		return timecode;
	},

	renderTracks : function () {
		//console.log('Playlist renderTracks');

		var self = this, i = 1;
		var tracklist = this.$el.find('.ae-playlist-tracks');

		tracklist.html('');

		_.each( this.tracks.models, function(model) {
			// model.set( 'index', self.model.tracknumbers ? i : false );
			//console.log(model.toJSON())
			tracklist.append( self.itemTemplate( model.toJSON() ) );
			i += 1;
        });

		// highlight first item
		//this.$( '.ae-playlist-item' ).eq(0).addClass( this.playingClass );

		var button = wp.template( 'audio-player-circle-play-pause-button' );
		var buttonwrapper = $('<div class="player-button light play-button"></div>');
		buttonwrapper.append( button );
		this.$( '.ae-playlist-item' ).prepend( buttonwrapper );
	},

	renderButton : function() {
		//console.log('Playlist renderButton');

		if(this.current) {
			if( this.current.get('playing') ) {
	    		this.$el.find('#main-player .play-button').removeClass('play-button').addClass('pause-button');
			} else {
	    		this.$el.find('#main-player .pause-button').removeClass('pause-button').addClass('play-button');
			}
		}
	},

	render: function() {
		//console.log('Playlist render');
		
		// set the current to the first track
		this.setCurrent();

		//this.playerNode.attr( 'src', this.current.get( 'src' ) );

		//_.bindAll( this, 'bindPlayer', 'bindResetPlayer', 'setPlayer', 'ended', 'clickTrack' );

		// if ( ! _.isUndefined( window._wpmejsSettings ) ) {
		// 	this.settings = _.clone( _wpmejsSettings );
		// }
		// this.settings.success = this.bindPlayer;
		//this.setPlayer();

		this.renderButton();

		this.renderCurrent();

	},

});

app.Views.Track = app.View.extend({
	className : "ae-playlist-item",

});


app.Views.Players = app.View.extend({
	id : 'mejs-body-container',

	initialize : function() {
		_.each( this.collection.models, this.addPlayerView, this );
	},

	addPlayerView : function( player ) {
		var $el = $('#'+player.id);
		//this.views.add( new app.Views.Player({ el: $el }) );
		new app.Views.Player({ el: $el, model: player });
	},

	render : function() {
		console.log('Players render');
	}

});



/* -------------------------------------------------------------------------------- */
/* 									Functions										*/
/* -------------------------------------------------------------------------------- */

/* Provide quick way to find title */
$.fn.getTitle = function() {
	var title = ''
	var title_selector = ( audio_envelope.description_selector ) ? audio_envelope.description_selector : '.ae-title, h3, h2, h1';

	var title = this.getClosest(title_selector);
	if( title ) {
		return title;
		// if( title.find('a').length ) {
		// 	return title.find('a').html().trim();
		// } else {
		// 	return title.html().trim();
		// }
	}

	return false;
}

/* Provide quick way to find title */
$.fn.getDescription = function() {
	var description = ''
	var description_selector = ( audio_envelope.description_selector ) ? audio_envelope.description_selector : '.ae-description, p';

	var description = this.getClosest(description_selector);
	if( description ) {
		return description;
	}

	return false;
}


/**
 * get closest sibling which matches selector 
 * start with previous, then next, then travserse up to parent and repeat
 */
$.fn.getClosest = function(selector) {
	var depth = 8;

	var elem = this;

	for (i = 0; i < depth; i++) {

		var prev = elem.get(0).previousElementSibling;

		// Check all previous siblings
		while (prev) {
			// If the matching item is found, return item
			if (selector && prev.matches(selector)) {
				//console.log(prev)
				return $(prev)
			}

			// Get the previous sibling
			prev = prev.previousElementSibling
		}


		var next = elem.get(0).nextElementSibling;

		// Check all next siblings
		while (next) {
			// If the matching item is found, return item
			if (selector && next.matches(selector)) {
				//console.log(next)
				return $(next)
			}

			// Get the previous sibling
			next = next.nextElementSibling
		}

		// we haven't found a match yet, let's traverse up a level
		elem = elem.parent();
	}


	return false;
};


/**
 *
 */
function stripTag(str, tag) {
    var a, parent, div = document.createElement('div');
    div.innerHTML = str;
    a = div.getElementsByTagName( tag );
    while( a[0] ) {
        parent = a[0].parentNode;
        while (a[0].firstChild) {
            parent.insertBefore(a[0].firstChild, a[0]);
        }
        parent.removeChild(a[0]);
    }
    return div.innerHTML;
}


/**
 * Locates Audio in DOM
 */
 
function findAudio() {

	var players = [];

	var selector = ( audio_envelope.audio_selector ) ? audio_envelope.audio_selector : 'audio.wp-audio-shortcode, .wp-block-audio audio';
	 console.log('using selector: '+selector)

	var all_audio = $(selector), len = all_audio.length, i = 0;
	if( all_audio.length ) {
		all_audio.each(function() {
			var this_player = $(this);

			// guard statement: we have an audio element, but no src defined
			if( !this_player.attr('src') ) return;

			// look for the surrounding audio containers (MediaElement.JS or HTML Audio)
			var audio_container = $(this).closest('.mejs-container, figure.wp-block-audio');
			 audio_container.addClass('hidden');

			var src = this_player.attr('src').replace(/_=[0-9]+/,'').replace(/\?$/,'');
			//var type = this_player.attr('type');
			//console.log(description)

			// Using checksum code from https://codepen.io/ImagineProgramming/post/checksum-algorithms-in-javascript-checksum-js-engine
			var id = "ae_"+(new Checksum("fnv32", 0).updateStringly(src).result.toString(16));

			// if we are dealing with native HTML5 audio, there is no id. Let's add one.
			if( !this_player.attr('id') ) {
				this_player.attr('id', id+'_audio');
			}

			// Get Title, removing surrounding markup, including links
			var title_element = this_player.getTitle();
			var title = $(title_element).html().trim().replace(/(<([^>]+)>)/ig,"");

			// Get Description, removing surrounding markup, including links
			var description_element = this_player.getDescription();
			var description = stripTag($(description_element).html().trim(),'a'); //replace(/(<(/)+a([^>]+)>)/ig,"");

			// build the list of players
			players.push(
				{
					"id": id,
					"audio_id": this_player.attr('id'),
					"src": src,
					//"type": type,
					"title": title,
					"caption": "",
					"description": description,
					// "meta": {
					// 	"length_formatted": duration
					// },
				}
			);

			// while we are here, wrap all the players
			//audio_container.before('<div id="'+id+'" class="ap-container"/>');

			$(title_element).before('<div id="'+id+'" class="ap-container"/>');
			$('#'+id).append($(title_element));
			$('#'+id).append($(description_element));
			$('#'+id).append(audio_container);

		});

		//console.log(players)
	}

	// re-show any players that are not matched with the audio selector
	$('.mejs-container').not('.hidden').show();

	return players;
}


/**
 * wait a 10th of a second to load the player
 */
$( document ).ready(function(){

	// process parameters to allow for temporary disabling of player for demonstration purposes
	const newurl = new URL(location.href)
	const params = new URLSearchParams(location.search);
    var ae_deactivated = params.get('ae_deactivated') ? params.get('ae_deactivated') : false;
    if(ae_deactivated) {
    	params.delete('ae_deactivated')
    	newurl.search = params;
    	$('#ae_activation_button').html('Turn on Audio Envelope').attr('href',newurl);
    } else {
    	params.set('ae_deactivated','true')
    	newurl.search = params;
    	$('#ae_activation_button').html('Turn off Audio Envelope').attr('href',newurl);
    }

    if(audio_envelope.debug_msg) console.log(audio_envelope.debug_msg);

    // create surround container, since I am unable to do this in gutenberg
    $('.ae-block').each(function() {
    	if( $(this).find('ae-description').length > 1 ) {
    		$(this).find('ae-description').removeClass('ae-description').wrapAll('<div class="ae-description" />');
    	}
    });

	setTimeout( function() {
		console.log(audio_envelope);
		if( !ae_deactivated && audio_envelope.activate_player ) {
			var players = findAudio();
			if( players.length ) AporiaPlaylist.start({ players: players });
		}
	}, 100);
});

})(jQuery);