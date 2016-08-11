/*!
* jQuery Google CSE v0.2.0 (https://github.com/abemedia/jquery-gcse)
* Copyright (c) 2016 Adam Bouqdib
* Licensed under GPL-3.0 (http://abemedia.co.uk/license) 
*/

/*global define */

;(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery, window );
	}
}(function ( $, window ) {

  var pluginName = 'gcse',
      defaults = {
        // Your Google Custom Search Key
        cseKey: null,
        // Your AdSense Publisher ID (for making cash with ads)
        adsenseId: null,
        // Search only URLs on this site (e.g. example.com/blog)
        site: null,
        // URL of results page
        url: window.location.href,
        // URL param holding search query
        param: 'q',
        // Enable auto-complete in the searchbox
        autoComplete: true,
        // Hide the search box
        resultsOnly: false,
        // Enable safe-search - can be 'moderate', 'strict' or false
        safe: false,
        language: 'en',
        // Override the function to generate results page title
        setPageTitle: function(query) {
          document.title = query + ' ' + document.title;
        },
      };

  function Plugin( element, options, callback ) {
    this.element = element;
    this.options = $.extend( {}, defaults, options) ;
    this.callback = callback;
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype.getQuery = function () {
    var param, self = this;
    location.search.substr(1).split("&").some(function(item) {
      return item.split("=")[0] === self.options.param && (param = item.split("=")[1]);
    });
    return param;
  };

  Plugin.prototype.setQuery = function (q) {
    this.cse.execute(q);
  };

  Plugin.prototype.init = function () {
    var self = this;
    var options = $.extend(this.options, $(this.element).data());

    // update URL & page-title
    function setQuery(query){
      // build URL params array
      var found, params = location.search.substr(1).split("&");
      for (var i = 0; i < params.length; i++){
        if(params[i].split('=')[0] === options.param){
          params[i] = options.param + "=" + query;
          found = true;
        }
      }
      if(!found) {
        params.push(options.param + "=" + query);
      }

      // update URL
      var url = location.href.replace(location.search.substr(1), params.join("&"));
      if (typeof(window.history.pushState) === 'function') {
        window.history.pushState(null, url, url);
      } else {
        // todo: better hash handling
        window.location.hash = '#!' + url;
      }

      //update page title
      options.setPageTitle(query);
    }

    var loadCSE = function() {
      google.load('search', '1', {
        language: options.language,
        nocss: true,
        callback: ''
      });
      google.setOnLoadCallback(function () {
        var cseOptions = {};
        if(options.site) {
          cseOptions[google.search.Search.RESTRICT_EXTENDED_ARGS] = {
            'as_sitesearch': options.site,
          };
        }
        var cse = new google.search.CustomSearchControl(options.cseKey, cseOptions);
        cse.setResultSetSize(google.search.Search.FILTERED_CSE_RESULTSET);

        if(options.adsenseId) {
          cse.enableAds(options.adsenseId);
        }

        var drawOptions = new google.search.DrawOptions();
        drawOptions.setAutoComplete(options.autoComplete);
        if(options.resultsOnly) {
          drawOptions.enableSearchResultsOnly();
        }
        cse.draw(self.element, drawOptions);

        cse.setSearchStartingCallback({}, function () {
          setQuery(cse.getInputQuery());
        });

        cse.execute(self.getQuery());
        self.cse = cse;

        // execute callback
        if(typeof(self.callback) === 'function') {
          self.callback();
        }
      }, true);
    };

    /* Load Google JS API */
    if($('script[src^="https://www.google.com/jsapi"]').length > 0) {
      loadCSE();
    } else {
      $.ajax({
        url: 'https://www.google.com/jsapi',
        dataType: 'script',
        cache: true, // otherwise will get fresh copy every page load
        success: loadCSE
      });
    }

  };

  /* Todo: proper destroy (unload jsapi etc.) */
  Plugin.prototype.destroy = function () {
    var el = $(this.element);
    el.html('');
    $.data(el, 'plugin_' + pluginName, null);
  };

  $.fn[pluginName] = function ( options, callback ) {
    return this.each(function () {
      if( $.data(this, 'plugin_' + pluginName) && Object.prototype.toString.call(options) === '[object String]' ) {
        $.data(this, 'plugin_' + pluginName)[options](callback);
      }
      else if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin( this, options, callback ));
      }
    });
  };
}));
