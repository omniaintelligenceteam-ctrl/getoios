/* A prerecorded introduction. Playback never starts a live session. */
(function () {
  'use strict';
  var hero = document.getElementById('core');
  var video = document.getElementById('hero-video');
  var start = document.getElementById('hero-start');
  var status = document.getElementById('hero-status');
  if (!hero || !video || !start || !status) return;
  var starting = false;
  var copy = {
    idle: 'Plays a recording with sound. Your microphone stays off.',
    loading: 'Loading the recording. Your microphone stays off.',
    playing: 'Playing the prerecorded intro. Your microphone stays off.',
    paused: 'Recording paused. Resume or continue to the sample day.',
    ended: 'Intro finished. Replay or continue to the sample day.',
    error: 'The recording could not play. Try again or continue to the sample day.'
  };
  function state(value) {
    hero.dataset.heroState = value;
    status.textContent = copy[value];
    start.hidden = value === 'playing';
    start.disabled = value === 'loading';
    start.textContent = value === 'ended' ? 'Replay intro' : value === 'error' ? 'Retry intro' : value === 'paused' ? 'Resume intro' : value === 'loading' ? 'Loading intro…' : 'Tap to talk';
  }
  function play() {
    if (starting) return;
    starting = true;
    var previous = hero.dataset.heroState;
    if (previous === 'error') video.load();
    if (video.ended) video.currentTime = 0;
    state('loading');
    video.play().catch(function () { state('error'); }).finally(function () { starting = false; });
  }
  start.addEventListener('click', play);
  video.addEventListener('playing', function () { state('playing'); });
  video.addEventListener('waiting', function () { if (!video.paused) state('loading'); });
  video.addEventListener('pause', function () { if (!video.ended && !video.error) state('paused'); });
  video.addEventListener('ended', function () { state('ended'); });
  video.addEventListener('error', function () { starting = false; state('error'); });
  // Native controls remain available if scripting is unavailable.
  start.hidden = false;
  // Metadata may fail before this script attaches the error listener.
  state(video.error ? 'error' : 'idle');
  document.getElementById('hero-continue').addEventListener('click', function () {
    video.pause();
    document.getElementById('today-title').focus({ preventScroll: true });
  });
})();
