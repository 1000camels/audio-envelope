!function(e){var t={};function i(n){if(t[n])return t[n].exports;var a=t[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,i),a.l=!0,a.exports}i.m=e,i.c=t,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)i.d(n,a,function(t){return e[t]}.bind(null,a));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=0)}([function(e,t){!function(e){var t=window.AporiaPlaylist={start:function(i){this.data=i,this.players=new this.Collections.Players(i.players),delete this.data.players,e("body > div:first-child").wrapAll('<section id="mejs-body-container" />');var n=wp.template("ae-playlist-panel");e("#mejs-body-container").after(n()),new this.Views.Players({collection:this.players}),new this.Views.Playlist({id:"mejs-player-panel",model:new t.Models.Playlist,collection:this.players})}};t.View=wp.Backbone.View.extend({inject:function(e){this.render(),this.views.ready()},prepare:function(){return!_.isUndefined(this.model)&&_.isFunction(this.model.toJSON)?this.model.toJSON():{}}}),t.Model=Backbone.Model.extend({toggle:function(e,t){return t=t?_.clone(t):{},this.set(e,!this.get(e),t)}}),t.Models={},t.Models.Player=t.Model.extend({defaults:{id:"",audio_id:"",src:"",type:"",title:"",caption:"",description:"",artists:!0,tracknumbers:!0,meta:{},active:!1,playing:!1,currentTime:0},localStorage:new Backbone.LocalStorage("audio-envelope-player"),initialize:function(){this.on("change",this.storeData)},storeData:function(e,t,i){this.save()},makeActive:function(e){this.set("active",!0,e)},makeInactive:function(e){this.set("active",!1,e)},play:function(e){this.set("playing",!0,e)},pause:function(e){this.set("playing",!1,e)},getAudioID:function(){return this.get("audio_id")},getAudioProperty:function(t){if(t){var i=this.getAudioID();return e("#"+i).get(0)[t]}},updatingCurrentTime:function(){console.log("updating cT: "+this.get("currentTime"))}}),t.Models.Playlist=t.Model.extend({defaults:{id:"",type:"audio",minimised:!1,tracklist:!0,tracks:[],scrubbing:!1,scrubbedToCurrentTime:"",autoplay:!0},localStorage:new Backbone.LocalStorage("audio-envelope-playlist"),initialize:function(){this.on("change",this.storeData)},storeData:function(e,t,i){this.save()},isScrubbing:function(e,t,i){console.log("scrubbing: "+this.get("scrubbing"))},showScrubbedTime:function(e,t,i){console.log("scrubbedToCurrentTime: "+this.get("scrubbedToCurrentTime"))}}),t.Collections={},t.Collections.Players=Backbone.Collection.extend({model:t.Models.Player,initialize:function(){this.on("change:active",this.changeActive),this.on("change:playing",this.changePlaying)},changeActive:function(e,t,i){t&&this.each(function(t){t!=e&&t.get("active")&&t.makeInactive()})},changePlaying:function(e,t,i){t&&this.each(function(t){t!=e&&t.get("playing")&&t.pause()})},getCurrentPlayer:function(){var e=!1;return _.each(this.models,function(t){if(t.get("active"))return e=t,!1}),e||(e=this.first()).makeActive(),e}}),t.Views={},t.Views.Player=t.View.extend({className:"ap-container",initialize:function(){var t=this.model,i=t.get("title"),n=t.get("description");this.model.fetch(),this.model.set("title",i),this.model.set("description",n),this.model.set("currentTime",this.model.get("currentTime")-2),this.model.storeData(),this.listenTo(this.model,"change:active",this.render),this.listenTo(this.model,"change:playing",this.render);var a=wp.template("audio-player-circle-play-pause-button"),r=e('<div class="player-button play-button light"></div>');r.append(a),this.$el.append(r),this.render()},events:{"click .player-button.play-button":"clickPlay","click .player-button.pause-button":"clickPause"},clickPlay:function(){this.model.makeActive(),this.model.play()},clickPause:function(){this.model.pause()},renderPlay:function(e){this.$el.find(".player-button").removeClass("play-button").addClass("pause-button")},renderPause:function(e){this.$el.find(".player-button").removeClass("pause-button").addClass("play-button")},render:function(){var e=this.$el.closest("article");e.addClass("has-audio-player"),this.model.get("active")?e.removeClass("inactive-player").addClass("active-player"):e.removeClass("active-player").addClass("inactive-player"),this.model.get("playing")&&this.model.get("active")?this.renderPlay():this.renderPause(),this.controlAudio()},controlAudio:function(){var t=this,i=this.model.getAudioID();if(this_audio_player=e("#"+i).get(0),this_audio_player){if(this_audio_player.currentTime=this.model.get("currentTime"),this.model.get("playing")&&this_audio_player.paused){var n=this_audio_player.play();void 0!==n&&n.then(function(e){}).catch(function(e){t.renderPause()})}this.model.get("playing")||this_audio_player.paused||this_audio_player.pause()}},getContainer:function(){}}),t.Views.Playlist=t.View.extend({el:"#mejs-player-panel",initialize:function(t){this.model=t.model,this.tracks=t.collection,this.model.fetch(),this.model.save(),this.index=0,this.settings={},this.listenTo(this.tracks,"change:active, change:playing",this.render),this.listenTo(this.tracks,"change:currentTime",this.renderCurrent);var i=wp.template("audio-player-play-pause-button"),n=e('<div class="play-pause-button aap-button play-button"></div>');n.append(i),e("#main-player .left-side").prepend(n);var a=wp.template("audio-player-close-expand-button"),r=e('<div class="close-expand-button opened aap-button highlighted"></div>');r.append(a),e("#main-player .left-side").prepend(r);var s=wp.template("audio-player-back15s-button"),l=e('<div class="skip-back-button aap-button"></div>');l.append(s),e("#main-player .left-side").append(l);var o=wp.template("audio-player-skip15s-button"),c=e('<div class="skip-forward-button aap-button"></div>');c.append(o),e("#main-player .left-side").append(c);var u=wp.template("audio-player-previous-button"),d=e('<div class="prev-button aap-button"></div>');d.append(u),e("#main-player .left-side").append(d);var p=wp.template("audio-player-next-button"),h=e('<div class="next-button aap-button"></div>');h.append(p),e("#main-player .left-side").append(h),this.playerNode=e(this.model.get("type"));var y=wp.template("audio-player-play-pause-button"),m=e('<div class="large-button player-button play-button"></div>');(m.append(y),e("#main-player .right-side").append(m),this.model.get("tracklist")&&(this.itemTemplate=wp.template("ae-playlist-item"),this.playingClass="ae-playlist-playing",this.renderTracks()),this.render(),this.bindMediaElement(),this.model.get("minimised"))?this.hidePlayer():Math.max(window.screen.width,window.innerWidth)>767&&this.showPlayer();this.isPlaying()},addTrackView:function(e){this.views.add(new t.Views.Track({id:e.id}))},events:{"click .close-expand-button":"togglePlayer","click .ae-playlist-item":"clickTrack","click .large-button.player-button.play-button":"clickPlay","click .large-button.player-button.pause-button":"clickPause","click .play-pause-button.play-button":"clickPlay","click .play-pause-button.pause-button":"clickPause","click .skip-back-button":"clickSkipBack","click .skip-forward-button":"clickSkipForward","click .prev-button":"prevTrack","click .next-button":"nextTrack","mousedown .player-timeline svg":"startScrubbing","mousemove .player-timeline svg":"captureScrubbing","mouseup .player-timeline svg":"stopScrubbing"},bindMediaElement:function(){var t=this,i=this.current.getAudioID(),n=e("#"+i).get(0);e("mejs-container audio").off("timeupdate"),e("mejs-container audio").off("ended"),n.currentTime=this.current.get("currentTime"),e(n).off("timeupdate").on("timeupdate",function(){if(!t.model.get("scrubbing")){var e=n.currentTime;t.current.set("currentTime",e)}}),e(n).off("ended").on("ended",function(e){t.trackEnded(e)})},startScrubbing:function(e){this.model.set("scrubbing",!0),this.captureScrubbing(e)},captureScrubbing:function(t){if(this.model.get("scrubbing")){var i=t.target;if(e(i).hasClass("baseline")||(i=e(i).parents(".player-timeline").find(".baseline").get(0)),null!=i){t.touches&&(this.touchobj=t.touches[0]);var n=e(i).parents(".player-timeline"),a=(this.current.get("currentTime"),this.current.getAudioProperty("duration")),r=i.getBoundingClientRect();if(this.touchobj)var s=this.touchobj.clientX-r.left,l=this.touchobj.clientY-r.top;else s=t.clientX-r.left,l=t.clientY-r.top;if(!isNaN(s)&&!isNaN(l)){var o=i.getTotalLength();i.getBoundingClientRect().height;if("circle_timeline"==n.attr("id")){var c=r.height/2,u=2*Math.PI*c,d=s-c,p=l-c,h=Math.atan2(p,d)+Math.PI/2;h<0&&(h+=2*Math.PI);var y=h*c,m=y/u*o,f=y/u*a;n.find(".mainline").attr("stroke-dasharray",m+" "+o)}else if("horizontal_timeline"==n.attr("id")){f=(g=s)/r.width*a;n.find(".mainline").attr("stroke-dasharray",g+" "+r.width)}else{var g;f=(g=l)/r.height*a;n.find(".mainline").attr("stroke-dasharray",g+" "+r.height)}this.model.set("scrubbedToCurrentTime",f)}}}},stopScrubbing:function(e){this.updatePlayer(),this.model.set("scrubbing",!1)},updatePlayer:function(t){var i=this.current.getAudioID();this_audio_player=e("#"+i).get(0);var n=this.current.get("playing");this_audio_player.pause(),this_audio_player.currentTime=this.model.get("scrubbedToCurrentTime"),n&&this_audio_player.play(),this.renderTimeline()},clickPlay:function(){this.current&&(this.current.makeActive(),this.current.play())},clickPause:function(){this.current&&this.current.pause()},clickSkipBack:function(){if(this.current){var t=this.current.getAudioID(),i=e("#"+t).get(0);currentTime=i.currentTime,i.currentTime=currentTime-15}},clickSkipForward:function(){if(this.current){var t=this.current.getAudioID(),i=e("#"+t).get(0);currentTime=i.currentTime,i.currentTime=currentTime+15}},trackEnded:function(e){this.current.pause(),this.current.set("currentTime",0),e.target.currentTime=-1,this.nextTrack(),this.current.play()},prevTrack:function(){var e=this.current.get("playing");this.current.pause(),this.index=this.index-1<0?this.tracks.length-1:this.index-1,this.setCurrent(this.index),this.scrollToTrack(),e&&this.current.play()},nextTrack:function(){var e=this.current.get("playing");this.current.pause(),this.index=this.index+1>=this.tracks.length?0:this.index+1,this.setCurrent(this.index),this.scrollToTrack(),e&&this.current.play()},scrollToTrack:function(){var t=e(".ae-playlist-tracks-wrapper"),i=e(".ae-playlist-item.ae-playlist-playing"),n=t.scrollTop()+(i.offset().top-t.offset().top);e(".ae-playlist-tracks-wrapper").animate({scrollTop:n},1e3)},isPlaying:function(){this.setCurrent()},togglePlayer:function(){e("body").hasClass("expanded-playlist-player")?(e(".close-expand-button").removeClass("opened").addClass("closed"),this.hidePlayer()):(e(".close-expand-button").removeClass("closed").addClass("opened"),this.showPlayer())},showPlayer:function(){this.model.set("minimised",!1),e("body").addClass("expanded-playlist-player").removeClass("minimized-playlist-player")},hidePlayer:function(){this.model.set("minimised",!0),e("body").addClass("minimized-playlist-player").removeClass("expanded-playlist-player")},clickTrack:function(t){t.preventDefault(),this.previous_index=this.index,this.index=this.$(".ae-playlist-item").index(t.currentTarget),this.current=this.tracks.at(this.index),this.current.makeActive(),e(".ae-playlist-tracks-wrapper").animate({scrollTop:jQuery(".ae-playlist-item.ae-playlist-playing").offset().top},1e3),this.current.get("playing")?this.current.pause():this.current.play(),document.title=this.current.get("title")},bindPlayer:function(e){console.log("bindPlayer"),this.mejs=e,this.mejs.addEventListener("ended",this.ended)},bindResetPlayer:function(e){console.log("bindResetPlayer"),this.bindPlayer(e)},setCurrent:function(e){if(null!=e){var t=this.current;this.index=e,this.current=this.tracks.at(this.index)}else this.current=this.tracks.getCurrentPlayer();this.current||(-1==this.index&&(this.index=0),this.current=this.tracks.at(this.index)),this.current.makeActive(),this.bindMediaElement(),t&&t!==this.current&&this.renderCurrent()},renderTimeline:function(){if(!this.model.get("scrubbing")){var t=this.current.get("currentTime"),i=this.current.getAudioID(),n=(e("#"+i).get(0),this.current.getAudioProperty("duration")),a=this.current.getAudioProperty("buffered"),r=this.formatTime(t),s=this.formatTime(n-t);e("#circle_timeline .elapsed textPath, .timelines .elapsed").text(r),e("#circle_timeline .remaining textPath, .timelines .remaining").text(s),e(".player-timeline").each(function(){var i=e(this).find(".baseline"),r=e(this).find(".mainline");if(null!=i.get(0)){var s=i.get(0).getTotalLength(),l=t/n*s;if(l&&r.attr("stroke-dasharray",l+" "+s),a){var o=e(this).find(".bufferline"),c=a/n*s;o.attr("stroke-dasharray",c+" "+s)}}}),this.current.storeData()}},renderCurrent:function(){if(this.current=this.tracks.getCurrentPlayer(),this.index=this.tracks.indexOf(this.current),this.current){e(".ae-playlist-item").find(".player-button").removeClass("dark").addClass("light"),this.model.get("tracklist")&&this.$(".ae-playlist-item").removeClass(this.playingClass).eq(this.index).addClass(this.playingClass).find(".player-button").removeClass("light").addClass("dark"),this.$(".ae-playlist-item").find(".player-button").removeClass("pause-button").addClass("play-button");var t=this.$(".ae-playlist-item").eq(this.index);this.current.get("playing")?t.find(".player-button").removeClass("play-button").addClass("pause-button"):t.find(".player-button").removeClass("pause-button").addClass("play-button"),this.renderTimeline()}},formatTime:function(e){if(isFinite(e))t=mejs.Utils.secondsToTimeCode(parseInt(e));else var t="unknown";return t},renderTracks:function(){var t=this,i=this.$el.find(".ae-playlist-tracks");i.html(""),_.each(this.tracks.models,function(e){i.append(t.itemTemplate(e.toJSON())),1});var n=wp.template("audio-player-circle-play-pause-button"),a=e('<div class="player-button light play-button"></div>');a.append(n),this.$(".ae-playlist-item").prepend(a)},renderButton:function(){this.current&&(this.current.get("playing")?this.$el.find("#main-player .play-button").removeClass("play-button").addClass("pause-button"):this.$el.find("#main-player .pause-button").removeClass("pause-button").addClass("play-button"))},render:function(){this.setCurrent(),this.renderButton(),this.renderCurrent()}}),t.Views.Track=t.View.extend({className:"ae-playlist-item"}),t.Views.Players=t.View.extend({id:"mejs-body-container",initialize:function(){_.each(this.collection.models,this.addPlayerView,this)},addPlayerView:function(i){var n=e("#"+i.id);new t.Views.Player({el:n,model:i})},render:function(){console.log("Players render")}}),e.fn.getTitle=function(){var t="",i=audio_envelope.description_selector?audio_envelope.description_selector:"h3, h2, h1",n=this.closest(i);return n.length&&n.find("a").length&&(t=n.find("a").html().trim()),t.length||this.parents().each(function(){var n=e(this).children(i);if(n.length)return n.find("a").length?(t=n.find("a").html().trim(),!1):(t=n.html().trim(),!1)}),console.log(t),t},e.fn.getDescription=function(){var t="",i=audio_envelope.description_selector?audio_envelope.description_selector:"p";return this.parents("div,article").each(function(){var n=e(this).children(i);if(n.length)return t=n.html().trim(),!1}),t},e(document).ready(function(){var t=new URL(location.href),i=new URLSearchParams(location.search),n=!!i.get("ae_deactivated")&&i.get("ae_deactivated");n?(i.delete("ae_deactivated"),t.search=i,e("#ae_activation_button").html("Turn on Audio Envelope").attr("href",t)):(i.set("ae_deactivated","true"),t.search=i,e("#ae_activation_button").html("Turn off Audio Envelope").attr("href",t)),setTimeout(function(){if(!n){var t=function(){var t=[],i=audio_envelope.audio_selector?audio_envelope.audio_selector:"audio.wp-audio-shortcode, .wp-block-audio audio";console.log("using selector: "+i);var n=e(i);return n.length,n.length&&n.each(function(){var i=e(this),n=e(this).closest(".mejs-container, figure.wp-block-audio");n.addClass("hidden");var a=i.attr("src").replace(/_=[0-9]+/,"").replace(/\?$/,""),r=i.getTitle(),s=i.getDescription().replace(/(<([^>]+)>)/gi,""),l="ae_"+new Checksum("fnv32",0).updateStringly(a).result.toString(16);i.attr("id")||i.attr("id",l+"_audio"),t.push({id:l,audio_id:i.attr("id"),src:a,title:r,caption:"",description:s}),n.before('<div id="'+l+'" class="ap-container"/>')}),e(".mejs-container").not(".hidden").show(),t}();t.length&&AporiaPlaylist.start({players:t})}},100)})}(jQuery)}]);