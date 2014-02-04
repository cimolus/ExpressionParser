var FightTraxWidget = FightTraxWidget || {};


FightTraxWidget.Config = (function() {
	
	var config = {
		server: 'http://ts.data.foxsports.com',
		ufcFsId: 'f7c6e1c8-5b82-4ba2-8066-974123000351',
		fsId: null,
		eventId: null,
		fightId: null,
		widgetSelector: null
	};
	
	
	return {
		getConfig: function() {
			return config;
		},
		
		setFsId: function( fsId ) {
			config.fsId = fsId;
		},
		
		setEventId: function( eventId ) {
			config.eventId = eventId;
		},
		
		setFightId: function( fightId ) {
			config.fightId = fightId;
		},
		
		setSelector: function( selector ) {
			config.widgetSelector = selector;
		}
		
	};
	
}());





FightTraxWidget.Queries = (function() {
	var config = FightTraxWidget.Config;
	
	return {
		getFightEvent: function(fsId) {
			return config.getConfig().server + '/livedata/wrapper.html?path=fighting/fightEvent&method=POST&body={"fsId":"' + fsId + '","branch":"UFC","itemType":"EVENT"}';
		},
		
		getInitBundle: function(eventId, fightId) {
			return config.getConfig().server + '/livedata/wrapper.html?path=livedata/bundle.html?branch=UFC&eventNativeID=' + eventId + '&eventNativeSubID=' + fightId + '&type=init';
		},
		
		getReplayBundle : function(eventId, fightId ) {
			return config.getConfig().server + '/livedata/wrapper.html?path=livedata/bundle.html?branch=UFC&eventNativeID=' + eventId + '&eventNativeSubID=' + fightId + '&type=replay';
		}
	};
	
}());



FightTraxWidget.Utils = (function() {
	
	return {
		getProperty: function (obj, propertyChain) {
			var tokens = propertyChain.split('.');
			var result = obj;
			$.each(tokens, function () {
				if (result[this] != null) {
					result = result[this];
				} else {
					result = null;
					return false;
				}
			});
			return result;
		},
		format: function (template, data) {
			var html = template;
			var reg = /\{[\w\.]*\}/g;
			var arr = html.match(reg);
			if (arr) {
				for ( var i = 0; i < arr.length; i++) {
					var tag = arr[i];
					var property = tag.substr(1, tag.length - 2);
					var value = FightTraxWidget.Utils.getProperty(data, property);
					html = html.replace(tag, (value != null) ? value : '');
				}
			}
			return html;
		}
	};
	
}());



FightTraxWidget.Template = (function() {	
	
	var widgetTemplate = 
		'<div id="fightTraxWidget">'
			+'<div id="fightTraxGameInfo">{gameInfo}</div>'
		
			+'<div id="fightTraxFightersNames">'
				+'<div id="fightTraxFighter1Name">{fighter1.firstName} "{fighter1.nickName}" {fighter1.lastName}</div>'
				+'<div id="fightTraxFighter2Name">{fighter2.firstName} "{fighter2.nickName}" {fighter2.lastName}</div>'
			+'</div>'
		
			+'<div id="fightTraxGameStats">'
				+'<div id="fightTraxGameStatsFighter1">'
					+'<div id="FightTraxTSTH1" class="fightTraxStrikesTotal" ></div>'
					+'<div id="FightTraxSSTH1" class="fightTraxStrikesSuccess" ></div>'
					+'<div id="FightTraxTSTB1" class="fightTraxStrikesTotal" ></div>'
					+'<div id="FightTraxSSTB1" class="fightTraxStrikesSuccess" >0</div>'
					+'<div id="FightTraxTSTL1" class="fightTraxStrikesTotal" ></div>'
					+'<div id="FightTraxSSTL1" class="fightTraxStrikesSuccess" >0</div>'
					+'<img id="fightTraxFighter1PhotoLeftStand" src="{fighter1.photoUrlLeft}" />'
				+'</div>'
				+'<div id="fightTraxGameStatsReplay">'
					+'<div id="fightTraxGameStatsTime">time</div>'
					+'<div id="fightTraxGameReplay">'
						+'replay<br>'
					+'	</div>'
				+'</div>'
				+'<div id="fightTraxGameStatsFighter2">'
					+'<div id="FightTraxTSTH2" class="fightTraxStrikesTotal" ></div>'
					+'<div id="FightTraxSSTH2" class="fightTraxStrikesSuccess" ></div>'
					+'<div id="FightTraxTSTB2" class="fightTraxStrikesTotal" ></div>'
					+'<div id="FightTraxSSTB2" class="fightTraxStrikesSuccess" ></div>'
					+'<div id="FightTraxTSTL2" class="fightTraxStrikesTotal" ></div>'
					+'<div id="FightTraxSSTL2" class="fightTraxStrikesSuccess" ></div>'
					+'<img id="fightTraxFighter2PhotoRightStand" src="{fighter2.photoUrlRight}" />'
				+'</div>'
			+'</div>'
		+'</div>';
	
	return {
		getWidget: function(data) {
			return FightTraxWidget.Utils.format(widgetTemplate, data);
		}
	};
	
}());





FightTraxWidget.EventManager = (function() {
	
	var addEventHandler = function(event, handler) {
        $(FightTraxWidget.EventManager).bind(event, handler);
    };
    
    var fightEventLoaded = "fightEventLoaded",
    	initBundleLoaded = "initBundleLoaded",
    	replayBundleLoaded = "replayBundleLoaded";
	
	return {
		fireEvent: function(event) {
			$(FightTraxWidget.EventManager).trigger(event);
		}, 
			
		init: function() {
			addEventHandler(fightEventLoaded , FightTraxWidget.Loader.fightEventHandler);
			addEventHandler(initBundleLoaded , FightTraxWidget.Loader.initBundleHandler);
			addEventHandler(replayBundleLoaded , FightTraxWidget.Loader.replayBundleHandler );
		},
		
		fightEventLoaded: fightEventLoaded,
		initBundleLoaded: initBundleLoaded,
		replayBundleLoaded: replayBundleLoaded
		
	};
	
}());




FightTraxWidget.Dictionary = (function() {
	
	var utils = FightTraxWidget.Utils;
	
	var position = {
		1:"distance",
		2:"neutral clinch",
		3:"neutral ground",
		4:"clinch advantage",
		5: "ground advantage",
		6: "full guard",
		7: "half guard",
		8: "side control",
		9: "mount",
		10: "back control"
	},
	strikeDictionary = {
		significant : {
			S: "Significant",
			O: "Other"
		},
		position: {
			D: "distance",
			C: "clinch",
			X: "miscGround",
			G: "guard",
			H: "half guard",
			S: "side",
			M: "mount",
			B: "back"
		}, 
		target: {
			H: "head",
			B: "body",
			L: "leg"
		},
		arm: {
			A: "Arm",
			L: "Leg"
		}
	},
	positionDictionary = {
		1: "Fighters on distance",
		2: "Fighters in clinch",
		3: "Fighters on ground",
		4: "{fighter.firstName} {fighter.lastName} has clinch Advantage",
		5: "{fighter.firstName} {fighter.lastName} has ground advantage",
		6: "{fighter.firstName} {fighter.lastName} has full guard",
		7: "{fighter.firstName} {fighter.lastName} has half guard",
		8: "{fighter.firstName} {fighter.lastName} has side control",
		9: "{fighter.firstName} {fighter.lastName} in a mount position",
		10:"{fighter.firstName} {fighter.lastName} has back control"
	},
	stndTemplate = '{fighter.firstName} {fighter.lastName} stands up from {position}',
	revTemplate = 'Reversal by {fighter.firstName} {fighter.lastName} from {position}',
	stopTemplate = 'Fight is stoped in {position}',
	kdTemplate = '{fighter.firstName} {fighter.lastName} knockdowns opponent from {position}',
	takedownHitTemplate = '{fighter.firstName} {fighter.lastName} forces takedown from {position}',
	takedownMissTemplate = '{fighter.firstName} {fighter.lastName} misses takedown from {position}',
	subHitTemplate = '{fighter.firstName} {fighter.lastName} forces opponent to submit from {position}',
	subMissTemplate = ' {fighter.firstName} {fighter.lastName} misses opponent to submit from {position}',
	strikeHitTemplate = '{significant} {arm} strike by {fighter.firstName} {fighter.lastName} to {target} from {position}',
	strikeMissTemplate = '{fighter.firstName} {fighter.lastName} misses {arm} strike to {target} from {position}';	
	
	var decryptStrike = function(code, fighter, land) {
		var strike = {
			significant: (code[0] === "S") ? strikeDictionary.significant[code[0]] : "",
			position:	strikeDictionary.position[code[1]],
			target: strikeDictionary.target[code[2]],
			arm: strikeDictionary.arm[code[3]],
			fighter: fighter
		};
		return ( land === 1 )? utils.format( strikeHitTemplate, strike ) : utils.format( strikeMissTemplate, strike );
	},
	
	decryptPosition = function(code, fighter) {
		if ( $.isNumeric( code ) )
			return utils.format(positionDictionary[code], {fighter: fighter} );
		else return utils.format(strikeDictionary.position[code], {fighter: fighter} );
	},
	
	decryptTakedown = function( code, fighter, land ) {
		var takedown = {
			fighter: fighter,
			position: position[code]
		};
		return ( land === 1 )? utils.format( takedownHitTemplate, takedown ) : utils.format( takedownMissTemplate, takedown );
	},
	
	
	decryptStnd = function( code, fighter ) {
		var stnd = {
			fighter: fighter,
			position: position[code]
		};
		return utils.format( stndTemplate, stnd );
	},
	
	decryptRev = function( code, fighter ) {
		var stnd = {
			fighter: fighter,
			position: position[code]
		};
		return utils.format( revTemplate, stnd );
	},
	
	decryptSub = function( code, fighter, land ) {
		var submission = {
			fighter: fighter,
			position: position[code]
		};
		return ( land === 1 )? utils.format( subHitTemplate, submission ) : utils.format( subMissTemplate, submission );
	},
	
	decryptKD = function( code, fighter) {
		var kd = {
			fighter: fighter,
			position: position[code]
		};
		return utils.format( kdTemplate, kd );
	},
	
	decryptStop = function( code ) {
		var stop = {
			position: strikeDictionary.position[code]
		};
		return utils.format( stopTemplate, stop );
	};
	
	return {
		decryptCode: function(code, type, fighter, land ) {
			switch(type) {
			case "STR":
				return decryptStrike(code, fighter, land);
			case "POS":
				return decryptPosition(code, fighter);
			case "TD":
				return decryptTakedown(code, fighter, land);
			case "STND":
				return decryptStnd(code, fighter);
			case "REV":
				return decryptRev(code, fighter);
			case "SUB":
				return decryptSub(code, fighter, land);
			case "KD":
				return decryptKD(code, fighter);
			case "STOP":
				return decryptStop(code);
			default: 
				return type;
			}
		}
	};
	
}());


FightTraxWidget.StrikesManager = ( function() {
	
	var TSTH1Selector = "#FightTraxTSTH1",
		SSTH1Selector = "#FightTraxSSTH1",
		TSTB1Selector = "#FightTraxTSTB1",
		SSTB1Selector = "#FightTraxSSTB1",
		TSTL1Selector = "#FightTraxTSTL1",
		SSTL1Selector = "#FightTraxSSTL1",
		TSTH2Selector = "#FightTraxTSTH2",
		SSTH2Selector = "#FightTraxSSTH2",
		TSTB2Selector = "#FightTraxTSTB2",
		SSTB2Selector = "#FightTraxSSTB2",
		TSTL2Selector = "#FightTraxTSTL2",
		SSTL2Selector = "#FightTraxSSTL2";
		
	
	
	
	return {
		renderStrikes: function(action) {
			
			console.log(action);
			
			$(TSTH1Selector).text(action.Stats.fighter1.TSTH);
			var px =  action.Stats.fighter1.TSTH / 2 + "px";
			$(TSTH1Selector).css({
				"width": px,
				"height": px,
				"border-radius": px
			});
			
			$(SSTH1Selector).text(action.Stats.fighter1.SSTH);
			
			var px =  action.Stats.fighter1.SSTH / 2 + "px";
			$(SSTH1Selector).css({
				"width": px,
				"height": px,
				"border-radius": px
			});
			
			$(TSTB1Selector).text(action.Stats.fighter1.TSTB);
			$(SSTB1Selector).text(action.Stats.fighter1.SSTB);
			$(TSTL1Selector).text(action.Stats.fighter1.TSTL);
			$(SSTL1Selector).text(action.Stats.fighter1.SSTL);
			
			$(TSTH2Selector).text(action.Stats.fighter2.TSTH);
			$(SSTH2Selector).text(action.Stats.fighter2.SSTH);
			$(TSTB2Selector).text(action.Stats.fighter2.TSTB);
			$(SSTB2Selector).text(action.Stats.fighter2.SSTB);
			$(TSTL2Selector).text(action.Stats.fighter2.TSTL);
			$(SSTL2Selector).text(action.Stats.fighter2.SSTL);
			
		}
	};
	
}());

FightTraxWidget.ActionManager = (function() {
	var dictionary = FightTraxWidget.Dictionary;
	var loader = FightTraxWidget.Loader;
	var count = 0,
		actions = [],
		prevAction = null;
		fighter1Id = null,
		fighter2Id = null,
		fightersMap = null;
		
		
	var assignStats = function(action) {
		if ( prevAction ) {
			action["Stats"] = {
				fighter1: {
					TSTH: prevAction.Stats.fighter1.TSTH,
					SSTH: prevAction.Stats.fighter1.SSTH, 
					TSTB: prevAction.Stats.fighter1.TSTB,
					SSTB: prevAction.Stats.fighter1.SSTB,
					TSTL: prevAction.Stats.fighter1.TSTL,
					SSTL: prevAction.Stats.fighter1.SSTL, 
				},
				fighter2: {
					TSTH: prevAction.Stats.fighter2.TSTH,
					SSTH: prevAction.Stats.fighter2.SSTH, 
					TSTB: prevAction.Stats.fighter2.TSTB,
					SSTB: prevAction.Stats.fighter2.SSTB,
					TSTL: prevAction.Stats.fighter2.TSTL,
					SSTL: prevAction.Stats.fighter2.SSTL, 
				}
			};
		} else {
			action["Stats"] = {
				fighter1: {
					TSTH: 0, //Total strikes to head
					SSTH: 0, //Success strikes to head
					TSTB: 0, //Total strikes to body
					SSTB: 0, //Success strikes to body
					TSTL: 0, //Total strikes to leg
					SSTL: 0, //Success strikes to leg
				},
				fighter2: {
					TSTH: 0, //Total strikes to head
					SSTH: 0, //Success strikes to head
					TSTB: 0, //Total strikes to body
					SSTB: 0, //Success strikes to body
					TSTL: 0, //Total strikes to leg
					SSTL: 0, //Success strikes to leg
				}
			};
		}
	},
		
	renderStrike = function(action) {
		assignStats(action);
		var target = action.Code.charAt(2);
		
		if ( action.Ftr == fighter1Id  ) {
			switch(target) {
			case "H": 
				action.Stats.fighter1.TSTH += 1;
				if ( action.Land > 0 ) action.Stats.fighter1.SSTH += 1;
				break;
			case "B":
				action.Stats.fighter1.TSTB += 1;
				if ( action.Land > 0 ) action.Stats.fighter1.SSTB += 1;
				break;
			case "L":
				action.Stats.fighter1.TSTL += 1;
				if ( action.Land > 0 ) action.Stats.fighter1.SSTL += 1;
				break;
			default: break;
			}
		} else if ( action.Ftr == fighter2Id ) {
			switch(target) {
			case "H": 
				action.Stats.fighter2.TSTH += 1;
				if ( action.Land > 0 ) action.Stats.fighter2.SSTH += 1;
				break;
			case "B":
				action.Stats.fighter2.TSTB += 1;
				if ( action.Land > 0 ) action.Stats.fighter2.SSTB += 1;
				break;
			case "L":
				action.Stats.fighter2.TSTL += 1;
				if ( action.Land > 0 ) action.Stats.fighter2.SSTL += 1;
				break;
			default: break;
			}
		}
		
		FightTraxWidget.StrikesManager.renderStrikes(action);
		
		
	},
	
	renderTakedown = function(action) {
		assignStats(action);
	},
	
	renderPosition = function(action) {
		assignStats(action);
	},
	
	renderStnd = function(action) {
		assignStats(action);
	},
	
	renderReversal = function(action) {
		assignStats(action);
	},
	
	renderSubmission = function(action) {
		assignStats(action);
	},
	
	renderKnockdown = function(action) {
		assignStats(action);
	},
	
	renderStop = function(action) {
		assignStats(action);
	};
	
	return {
		clear: function() {
			count = 0;
			actions = [];
			fightersMap = FightTraxWidget.Loader.getFightersMap();
			fighter1Id = FightTraxWidget.Loader.getFight().fighter1.nativeId;
			fighter2Id = FightTraxWidget.Loader.getFight().fighter2.nativeId;
		},
		renderAction: function(action) {
			action["Message"] = dictionary.decryptCode(action.Code, action.Type, ( fightersMap[action.Ftr] )?fightersMap[action.Ftr]: {firstName: "",lastName:""}, action.Land);
			if ( ! actions[action.Rd] ) actions[action.Rd] = [];
			if ( ! actions[action.Rd][action.Time] ) actions[action.Rd][action.Time] = [];			
			var i = actions[action.Rd][action.Time].length;
			switch(action.Type) {
			case "STR":
				renderStrike(action);
				break;
			case "POS":
				renderPosition(action);
				break;
			case "TD":
				renderTakedown(action);
				break;
			case "STND":
				renderStnd(action);
				break;
			case "REV":
				renderReversal(action);
				break;
			case "SUB":
				renderSubmission(action);
				break;
			case "KD":
				renderKnockdown(action);
				break;
			case "STOP":
				renderStop(action);
				break;
			}
			actions[action.Rd][action.Time][i] = action;
//			console.log(prevAction, action);
			prevAction = action;
		}
		
	};
	
	
}());


FightTraxWidget.Loader = ( function() {
	
	var config = FightTraxWidget.Config,
		queries = FightTraxWidget.Queries,
		eventManager = FightTraxWidget.EventManager,
		templates = FightTraxWidget.Template,
		actionsManager = FightTraxWidget.ActionManager;
	
	var fightEvent = null,
		initBundle = null,
		replayBundle = null,
		fight = null,
		fightersMap = [];
		
	var loadFightEvent = function() {
		$.ajax({
			url : queries.getFightEvent( config.getConfig().fsId ) ,
			jsonpCallback : "fightEventCallback",
			timeout : 10000,
			contentType : "application/json",
			dataType : 'jsonp',
			success : function(data) {
				fightEvent = data;
				eventManager.fireEvent(eventManager.fightEventLoaded);
			},
			error : function(xhr, ajaxOptions, thrownError) {
				console.log(xhr);
				console.log(ajaxOptions);
				console.log(thrownError);
			}
		});
	},
	
	getFight = function(fightId) {
		return $.grep(fightEvent, function(fight) {
			return fight.fightId == fightId;
		})[0];
	},
	
	loadInitBundle = function() {
		$.ajax({
			url : queries.getInitBundle(config.getConfig().eventId, config.getConfig().fightId),
			jsonpCallback : "initCallback",
			timeout : 10000,
			crossDomain: true,
			contentType : "application/json",
			dataType : 'jsonp',
			success : function(bundle) {
				initBundle = bundle;
				eventManager.fireEvent( eventManager.initBundleLoaded );
			},
			error : function(xhr, ajaxOptions, thrownError) {
				console.log(xhr);
				console.log(ajaxOptions);
				console.log(thrownError);
			}
		});
	},
	
	loadReplayBundle = function() {
		$.ajax({
			url : queries.getReplayBundle(config.getConfig().eventId, config.getConfig().fightId),
			jsonpCallback : "replayCallback",
			timeout : 10000,
			crossDomain: true,
			contentType : "application/json",
			dataType : 'jsonp',
			success : function(bundle) {
				replayBundle = bundle;
				eventManager.fireEvent( eventManager.replayBundleLoaded );
			},
			error : function(xhr, ajaxOptions, thrownError) {
				console.log(xhr);
				console.log(ajaxOptions);
				console.log(thrownError);
			}
		});
	},
	
	fightEventHandler = function() {
		config.setEventId(fightEvent[0].eventId);
		fight = getFight(config.getConfig().fightId);
		loadInitBundle();
		initFightersMap();
	},
	
	initBundleHandler = function() {
		
		if ( initBundle.f_type === "FINAL" ) {
			loadReplayBundle();
		}
	},
	
	replayBundleHandler = function() {
		console.log(replayBundle);
		renderWidget();
	},
	
	renderWidget = function() {
		
		var data = {
			gameInfo: "Initialization FightTrax",
			fighter1: fight.fighter1,
			fighter2: fight.fighter2
		};
		
		$(config.getConfig().widgetSelector).html(templates.getWidget(data));
		
		setTimeout(initActions, 1000 );
		
	},
	
	initActions = function() {
		FightTraxWidget.ActionManager.clear();
		if ( replayBundle && replayBundle.data.PP ) {
			for( var i = 0; i < replayBundle.data.PP.length; i++ ) {
				for( var j = 0; j < replayBundle.data.PP[i].GE.length; j++ ) {
					for ( var k = 0; k < replayBundle.data.PP[i].GE[j].Action.length; k++ ) {
						actionsManager.renderAction(replayBundle.data.PP[i].GE[j].Action[k]);
					}
				}
			}
		}
		
		//$("#fightTraxGameReplay")
	},
	
	initFightersMap = function() {
		for ( var i = 1; i < fightEvent.length; i++ ) {
			fightersMap[fightEvent[i].fighter1.nativeId] = fightEvent[i].fighter1;
			fightersMap[fightEvent[i].fighter2.nativeId] = fightEvent[i].fighter2;
		}
		console.log(fightersMap);
	};
	
	return {
		
		getFightEvent: function() {
			return fightEvent;
		},
			
		getInitBundle: function() {
			return initBundle;
		},
		
		load: function() {
			loadFightEvent();
		},
		
		fightEventHandler: fightEventHandler,
		initBundleHandler: initBundleHandler,
		replayBundleHandler: replayBundleHandler,
		
		getFightersMap: function() {
			return fightersMap;
		},
		
		getFight: function() {
			return fight;
		}
	};
	
}());

FightTraxWidget.Initializator = (function() {
	
	var eventManager = FightTraxWidget.EventManager,
		config = FightTraxWidget.Config,
		loader = FightTraxWidget.Loader;
	
	return {
		init: function(widgetSelector, fsId, fightId) {
			eventManager.init();
			config.setSelector(widgetSelector);
			config.setFsId(fsId);
			config.setFightId(fightId);
			loader.load();
		}
	};
	
}());

