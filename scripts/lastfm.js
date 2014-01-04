(function(ns) {
    var lastfm = ns.lastfm = {};
    var token = undefined;
    var session_key = undefined;
    var api_key = '8c51ae859dd656bf61e56fc1fc5f5439';
    var track_start_time = undefined;
    var scrobler_timer = undefined;
    var auth_getToken = function(type, url, cb) {
        chrome.identity.launchWebAuthFlow({url: url, interactive: true},
        function(responseURL) {
            if (responseURL === undefined) {
                console.log("Auth", type, "URL not found!");
                return;
            }
            var token = undefined;
            if (responseURL.indexOf("token=") !== -1) {
                token = responseURL.replace(/.*token=([^&]*).*/, "$1");
            }
            if (token !== undefined) {
                var obj = {};
                obj[type + '_token'] = token;
                chrome.storage.local.set(obj);
                cb(token);
            } else {
                console.log("Auth", type, "Token not found!", responseURL);
            }
        });
    };
    var auth = function(cb) {
        var type = 'lastfm';
        var url = 'http://www.last.fm/api/auth/?api_key=' + api_key;
        auth_getToken(type, url, function(tkn) {
            token = tkn;
            session_key = undefined;
            cb(tkn);
        });
    };
    var getToken = function(cb) {
        if (token !== undefined) {
            cb(token);
            return;
        }
        chrome.storage.local.get('lastfm_token', function(obj) {
            if (obj.lastfm_token !== undefined) {
                token = obj.lastfm_token;
                cb(token);
            } else {
                auth(cb);
            }
        });
    };
    var clear_data = function() {
        chrome.storage.local.remove('lastfm_token');
        token = undefined;
    };
    var apiCallSignature = function(params) {
        var secret = 'e7599b43e138572644a2c49a629af6b2';
        var keys = new Array();
        var o = '';

        for (var x in params)
            keys.push(x);

        // params has to be ordered alphabetically
        keys.sort();

        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === 'format' || keys[i] === 'api_sig' || keys[i] === 'callback')
                continue;
            o = o + keys[i] + params[keys[i]];
        }
        return MD5(o + secret);
    };
    var getSessionKey = function(cb) {
        var param = {
            method: 'auth.getsession',
            api_key: api_key,
            token: token,
            format: 'json'
        };
        param.api_sig = apiCallSignature(param);
        var url = 'http://ws.audioscrobbler.com/2.0/';
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'JSON',
            data: param,
            statusCode: {
                200: function(data) {
                    if (data.error === 4 || data.error === 15 || data.error === 14) {
                        clear_data();
                        return;
                    }
                    if (data.error === 9) {
                        session_key = undefined;
                        return;
                    }
                    if (data.error !== undefined) {
                        return;
                    }
                    if (data.session === undefined || data.session.key === undefined) {
                        console.log('getSessionKey error!', data);
                        return;
                    }
                    cb(data.session.key);
                }
            },
            error: function() {
                clear_data();
            }
        });
    };
    var getSession = function(cb) {
        if (session_key !== undefined) {
            cb(session_key);
            return;
        }
        getSessionKey(function(sk) {
            session_key = sk;
            cb(sk);
        });
    };
    var updateNowPlaying = function(artist, track, album, duration) {
        var data = {
            method: 'track.updateNowPlaying',
            artist: artist || '',
            track: track || '',
            api_key: api_key,
            format: 'json',
            sk: session_key
        };
        if (album !== undefined) {
            data.album = album;
        }
        duration = parseInt(duration);
        if (!isNaN(duration)) {
            data.duration = duration;
        }
        var api_sig = apiCallSignature(data);
        $.ajax({
            type: "POST",
            url: 'http://ws.audioscrobbler.com/2.0/?' + $.param(data) + '&api_sig=' + api_sig,
            dataType: 'JSON',
            data: data,
            statusCode: {
                200: function(data) {
                    if (data.error === 9) {
                        session_key = undefined;
                        return;
                    }
                    if (data.error === 4) {
                        clear_data();
                        return;
                    }
                    if (data.error !== undefined) {
                        return;
                    }
                    var start_timer = function() {
                        scrobler_timer = setTimeout(function() {
                            var audio = engine.getAudio();
                            var pos = parseInt(audio.currentTime);
                            if (isNaN(pos)) {
                                return;
                            }
                            if (pos > 30) {
                                lastfm.trackScrobble(artist, track, album, duration);
                            } else {
                                start_timer();
                            }
                        }, 35000);
                    };
                    start_timer();
                }
            },
            error: function() {
                clear_data();
            }
        });
    };
    var trackScrobble = function(artist, track, album, duration) {
        var data = {
            method: 'track.scrobble',
            timestamp: track_start_time || parseInt(new Date().getTime() / 1000) - 30,
            artist: artist || '',
            track: track || '',
            api_key: api_key,
            format: 'json',
            sk: session_key
        };
        if (album !== undefined) {
            data.album = album;
        }
        duration = parseInt(duration);
        if (!isNaN(duration)) {
            data.duration = duration;
        }
        var api_sig = apiCallSignature(data);
        $.ajax({
            type: "POST",
            url: 'http://ws.audioscrobbler.com/2.0/?' + $.param(data) + '&api_sig=' + api_sig,
            dataType: 'JSON',
            data: data,
            statusCode: {
                200: function(data) {
                    if (data.error === 9) {
                        session_key = undefined;
                        return;
                    }
                    if (data.error === 4) {
                        clear_data();
                        return;
                    }
                    if (data.error !== undefined) {
                        return;
                    }
                }
            }
        });
    };
    lastfm.updateNowPlaying = function(a, b, c, d) {
        clearTimeout(scrobler_timer);
        track_start_time = parseInt(new Date().getTime() / 1000);
        getToken(function() {
            getSession(function() {
                updateNowPlaying(a, b, c, d);
            });
        });
    };
    lastfm.trackScrobble = function(a, b, c, d) {
        getToken(function() {
            getSession(function() {
                trackScrobble(a, b, c, d);
            });
        });
    };
})(this);