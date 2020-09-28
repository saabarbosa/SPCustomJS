var i9ti = {} || i9ti;
$(document).ready(function() {
	moment.locale("pt-br");
	i9ti.configurationTermSetId = "71f750a4-0a3b-4fce-8b58-0fd851f3a57f";

	
	function iterateNavigation (nodes) {
		var result = "";
		for(var i = 0; i < nodes.results.length; i++) {
			var currentNode = nodes.results[i];
			if(currentNode.Nodes.results.length == 0) {
				var title = currentNode.Title;
				var url = currentNode.SimpleUrl;
				result += "<li><a href='" + url + "'>" + title + "</a></li>";
			} else {
				result += "<li class='sub-menu'>";
				result += "<a href='http://www.i9ti.com.br'>" + currentNode.Title + "<b class='sf-sub-indicator'></b><span></span></a></a>";
				result += "<ul>" + iterateNavigation(currentNode.Nodes) + "</ul></li>";
			}
        }
        
        return result;
	}
	
	i9ti.loadNavigation = function () {
		var createNavigation = function(data) {
			var result = "";
			var suiteBar = _.findWhere(data.d.MenuState.Nodes.results, {Title: "Suite Bar"}).Nodes;
			result = iterateNavigation(suiteBar);
			$(".second-suite-bar").html(result);
			var header = _.findWhere(data.d.MenuState.Nodes.results, {Title: "Header"}).Nodes;		    			
			result = iterateNavigation(header);
			$(".nav.sf-menu").html(result);
		}
		
		if(lscache.get("Navigation")) {
			createNavigation(lscache.get("Navigation"));
		} else {
			$.ajax({
			    url: _spPageContextInfo.siteAbsoluteUrl + "/_api/navigation/menustate?mapprovidername='GlobalNavigationSwitchableProvider'",
			    type: "GET",
			    dataType: "json",
			    headers: { "ACCEPT": "application/json;odata=verbose" },
			    success: function (data) {
			    	if(data.d) {		    		
			    		if(data.d.MenuState.Nodes.results) {
			    			createNavigation(data);
			    			lscache.set("Navigation", data, 10);
			    		}
			    	}		        
			    },
			    error: function (xhr, ajaxOptions, thrownError) {
			        alert(xhr.status);
			        alert(thrownError);
			    }
			});
		}		
	}
	
	i9ti.getItemsFromList = function (listName, viewFields, query, rowLimit, queryOptions) {
		var deferred = jQuery.Deferred();
		jQuery().SPServices({
		    operation: "GetListItems",
		    async: true,
		    listName: listName,
		    CAMLViewFields: viewFields,
		    CAMLQuery: query,
		    CAMLRowLimit: rowLimit,
		    CAMLQueryOptions: queryOptions, 
		    completefunc: function (xData, Status) {
		  	    var result = { xml: xData, status: Status};
			    deferred.resolve(result);
		    }
		});
		
		return deferred.promise();
	}
 
 	i9ti.inDesignMode = function () {
	    var result = (window.MSOWebPartPageFormName != undefined) && ((document.forms[window.MSOWebPartPageFormName] && document.forms[window.MSOWebPartPageFormName].MSOLayout_InDesignMode && ("1" == document.forms[window.MSOWebPartPageFormName].MSOLayout_InDesignMode.value)) || (document.forms[window.MSOWebPartPageFormName] && document.forms[window.MSOWebPartPageFormName]._wikiPageMode && ("Edit" == document.forms[window.MSOWebPartPageFormName]._wikiPageMode.value)));
	    return result || false;
	}
	

	i9ti.getTermSetById = function (id, callback) {
		SP.SOD.loadMultiple(['sp.js'], function () {
            // Make sure taxonomy library is registered
            SP.SOD.registerSod('sp.taxonomy.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.taxonomy.js'));

            SP.SOD.loadMultiple(['sp.taxonomy.js'], function () {
                var ctx = SP.ClientContext.get_current(),
                    taxonomySession = SP.Taxonomy.TaxonomySession.getTaxonomySession(ctx),
                    termStore = taxonomySession.getDefaultSiteCollectionTermStore(),
                    termSet = termStore.getTermSet(id);

                ctx.load(termSet);
                ctx.executeQueryAsync(Function.createDelegate(this, function (sender, args) {
                    callback(termSet);
                }),

                Function.createDelegate(this, function (sender, args) { }));
            });
        });
	};
	
	i9ti.getTerms = function (termSetid, callback) {
		SP.SOD.loadMultiple(['sp.js'], function () {
            // Make sure taxonomy library is registered
            SP.SOD.registerSod('sp.taxonomy.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.taxonomy.js'));

            SP.SOD.loadMultiple(['sp.taxonomy.js'], function () {
                var ctx = SP.ClientContext.get_current(),
                    taxonomySession = SP.Taxonomy.TaxonomySession.getTaxonomySession(ctx),
                    termStore = taxonomySession.getDefaultSiteCollectionTermStore(),
                    termSet = termStore.getTermSet(termSetid),
                    terms = termSet.get_terms();
					
                ctx.load(terms);
                ctx.executeQueryAsync(Function.createDelegate(this, function (sender, args) {
                    callback(terms);
                }),

                Function.createDelegate(this, function (sender, args) { }));
            });
        });
	};

	
	i9ti.loadConfiguration = function () {
		var deferred = jQuery.Deferred();
		
		var iterateProperties = function (props) {
			var properties = {};
			jQuery.each(props, function( key, value ) {
			  i9ti[key] = value;
			  properties[key] = value;
			});
			
			return properties;
		}
		
		if(lscache.get("ConfigProperties")) {
			iterateProperties(lscache.get("ConfigProperties"));
			deferred.resolve(lscache.get("ConfigProperties"));
		} else {
			i9ti.getTermSetById(i9ti.configurationTermSetId, function(configurationTermSet) {						
				var properties = iterateProperties(configurationTermSet.get_customProperties());
				lscache.set("ConfigProperties", properties, 10);
				deferred.resolve(properties);			
			});
		}		
		
		return deferred.promise();

	};
	
	i9ti.getMyYammerFeed = function (){
		var deferred = jQuery.Deferred();
		var tokenToSend = "Bearer " + localStorage.getItem("YammerToken");

		console.log("authorization bearer : " + tokenToSend);
		yam.platform.request(
		   	{ 
		   	   url: "https://api.yammer.com/api/v1/messages/in_group/" + i9ti.YammerGroupId + ".json?threaded=true&limit=4", 
		   	   method: "GET",
		   	   beforeSend: function (xhr){
		   	   	xhr.setRequestHeader('Authorization', tokenToSend)
		   	  },
		   	  success: function (data) { 
		         try{
		              deferred.resolve(data);
		     	}catch(error){ 
		     		console.log("error getMyFeed process : " + error); 
		     		deferred.reject();
		     	}
   		 	 },
		     error: function (msg) { 
		     	console.log("error getMyFeed ajax : " + msg.value); 
		     	deferred.reject();
		     }
		    }
		  );
		  
		  return deferred.promise();
	}
	
	i9ti.bindYammerButton = function() {		
		//i9ti.YammerClientId  i9ti.YammerRedirect;
		var deferred = jQuery.Deferred();
		yam.connect.loginButton('#yammer-login', function (resp) {
		    if (resp.authResponse) {
		
		      localStorage.setItem("YammerToken", JSON.stringify(resp.access_token.token).replace(/"/g, ""));
		      console.log("token " + localStorage.getItem("YammerToken"));		      
		      //Hiding the login button because the user is logged in
		      document.getElementById('yammer-login').style.display = 'none';
		      deferred.resolve();		      
		    }
		});
		
		return deferred.promise();			
	}
	

	i9ti.init = function() {
		var deferred = jQuery.Deferred();

		i9ti.loadConfiguration().then(function(result) {				
			i9ti.loadNavigation();
			deferred.resolve(result);	
		});		
		
		if(!i9ti.inDesignMode()){
			$("#s4-ribbonrow").css("display","none");						
		} else {
			$("body").removeClass("sp-normal-mode");
			$("body").addClass("sp-edit-mode");
		}
		
		jQuery(window).scroll(function () {
		    if (jQuery(this).scrollTop() > 130) {
	        	jQuery('.header_top').addClass('scrolled');
	        } else {
	        	jQuery('.header_top').removeClass('scrolled');
	        }
	        
	        if(jQuery(this).scrollTop() > 450) {
            	jQuery('#gotoTop').fadeIn();
		    } else {
		        jQuery('#gotoTop').fadeOut();
		    }
	    });
    
	    jQuery('#gotoTop').click(function() {
	      	$('body,html').animate({scrollTop:0},400);
	      	return false;
	    });
		
		jQuery(".logo-container").click(function() {
			window.location.href = _spPageContextInfo.webAbsoluteUrl;
		});
		
		/*$(".navbar-brand").attr("href", _spPageContextInfo.webServerRelativeUrl);
		$("footer .content").html("<p>Copyright © Cencosud " + date.getFullYear() + "</p>");
		
		i9ti.bindSearchButton();*/			
		return deferred.promise();
	};							
});
