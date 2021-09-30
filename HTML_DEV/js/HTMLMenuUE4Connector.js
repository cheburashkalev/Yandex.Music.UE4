/**Copyright 2018 - 2019 David Romanski (Socke). All Rights Reserved. Use only in combination with my plugin allowed.
** Version 1.7 compatible with Plugin Version 1.7 and higher
** Do not use comments with // in lines with code in Javascript!!! 
** Like this: var a = 2;//this is an a 
**Comments in a separate line are allowed. Comments with backslash star to.
**
** Close all functions and lines with ; like: function abc(){};
**/
var ue4NotFoundMessage 	= "UnrealEngine Process not found! This work only in UE4.";

var showErrorsAsAlert 		= false;/*Redirect javascript erros to an alert message.*/
var showAlertIfUE4NotFound	= false;
var keyboardControls		= false;/*Start keyboard key listener*/
var sendMousePositionToUE4	= false;

var keyUpFunctions 		= new Array();
var keyDownFunctions 	= new Array();
var keyLeftFunctions 	= new Array();
var keyRightFunctions 	= new Array();

var resolution			= "1280x720";
var windowMode			= 2; /*Integer 0=Fullscreen,1=WindowedFullscreen,2=Windowed*/
var antiAliasing		= 3; /*Integer 0,1,2,3*/
var shadows				= 3; /*Integer 0,1,2,3*/
var resolutionScale		= 10; /*Integer 1,2,3,4,5,6,7,8,9,10*/

var isMobile			= ( navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) ? true : false;
//alert("mobile:"+isMobile);

var websocket				= false;
var mobileActionsStack 		= new Array();

function registerKeyUpFunction(keyFunction){
	keyUpFunctions.push(keyFunction);
};
function registerKeyDownFunction(keyFunction){
	keyDownFunctions.push(keyFunction);
};
function registerKeyLeftFunction(keyFunction){
	keyLeftFunctions.push(keyFunction);
};
function registerKeyRightFunction(keyFunction){
	keyRightFunctions.push(keyFunction);
};


document.onkeydown = function(evt) {
	if (!keyboardControls)
		return;
	
	switch(evt.keyCode) {
		case 37:/*left*/
		case 65:/*A*/
			for (var i = 0; i < keyLeftFunctions.length; i++) {
				keyLeftFunctions[i]();
			};
			break;
		case 38:/*up*/
		case 87:/*W*/
			for (var i = 0; i < keyUpFunctions.length; i++) {
				keyUpFunctions[i]();
			};
			break;
		case 39:/*right*/
		case 68:/*D*/
			for (var i = 0; i < keyRightFunctions.length; i++) {
				keyRightFunctions[i]();
			};
			break;
		case 40:/*down*/
		case 83:/*S*/
			for (var i = 0; i < keyDownFunctions.length; i++) {
				keyDownFunctions[i]();
			};
			break;
	};
};

function keyNext(){
	if (!document.activeElement){
		return;
	}
	
	if (document.activeElement.nextElementSibling){
		document.activeElement.nextElementSibling.focus();
	}
	else{
		/*Search next selectable object*/
		var nextElement = document.activeElement.children[0];
		while (nextElement){
			nextElement.focus();
			if (document.activeElement != nextElement){
				nextElement = nextElement.children[0];
			}
			else{
				break;
			}
		}
	}
};

function keyPrev(){
	if (!document.activeElement){
		return;
	}
	if (document.activeElement.previousElementSibling){
		document.activeElement.previousElementSibling.focus();
	}
};

function keyEventChoose(){
	if (!document.activeElement){
		return;
	}
	document.activeElement.click();
};

function keyUp(fullWidth=false,fromBottom=false){
	if (document.getElementsByClassName("hasGamepadControlActive").length === 0){
		if (document.getElementsByClassName("hasGamepadControl").length === 0)
			return;
		document.getElementsByClassName("hasGamepadControl")[0].classList.add("hasGamepadControlActive");
		return;
	}
	var activeElement = document.getElementsByClassName("hasGamepadControlActive")[0];
	var domRect = activeElement.getBoundingClientRect();
	
	var height = 10;
	
	var left 	= domRect.left;
	var right	= domRect.right;
	var top		= domRect.top - height;
	var bottom	= domRect.top;
	
	if (fromBottom){
		bottom	= window.innerHeight;
		top		= bottom - height;
	}
	
	if (fullWidth){
		left  = 0;
		right = window.innerWidth;
		bottom--;
	}
	
	while (top > 0){
		var gamepadElements = document.getElementsByClassName("hasGamepadControl");
		for (var i = 0; i < gamepadElements.length; i++) {
			if (gamepadElements[i] == activeElement)
				continue;
				
			if (isOverlapRect(left,right,top,bottom,gamepadElements[i].getBoundingClientRect())){
				if (getZIndex(activeElement) != getZIndex(gamepadElements[i])){
					continue;
				}
				setGamepadActiveElement(gamepadElements[i]);
				return;
			}
		}
		top--;
		bottom--;
	};
	
	if (!fullWidth){
		keyUp(true);
	}
	else{
		if (!fromBottom){
			keyUp(true,true);
		}
	}
};

function keyDown(fullWidth=false,fromTop=false){
	if (document.getElementsByClassName("hasGamepadControlActive").length === 0){
		if (document.getElementsByClassName("hasGamepadControl").length === 0)
			return;
		document.getElementsByClassName("hasGamepadControl")[0].classList.add("hasGamepadControlActive");
		return;
	}
	var activeElement = document.getElementsByClassName("hasGamepadControlActive")[0];
	var domRect = activeElement.getBoundingClientRect();
	
	var height = 10;
	
	var left 	= domRect.left;
	var right	= domRect.right;
	var top		= domRect.bottom;
	var bottom	= top + height;
	
	if (fromTop){
		top		= 0;
		bottom	= top + height;
	}
	
	if (fullWidth){
		left  = 0;
		right = window.innerWidth;
		top++;
	}
	while (bottom < window.innerHeight){
		var gamepadElements = document.getElementsByClassName("hasGamepadControl");
		for (var i = 0; i < gamepadElements.length; i++) {
			if (gamepadElements[i] == activeElement)
				continue;
				
			if (isOverlapRect(left,right,top,bottom,gamepadElements[i].getBoundingClientRect())){
				if (getZIndex(activeElement) != getZIndex(gamepadElements[i])){
					continue;
				}
				setGamepadActiveElement(gamepadElements[i]);
				return;
			}
		}
		top++;
		bottom++;
	};
	
	if (!fullWidth){
		keyDown(true);
	}
	else{
		if (!fromTop){
			keyDown(true,true);
		}
	}
};

function keyLeft(fullHeight=false,fromRight=false){
	if (document.getElementsByClassName("hasGamepadControlActive").length === 0){
		if (document.getElementsByClassName("hasGamepadControl").length === 0)
			return;
		document.getElementsByClassName("hasGamepadControl")[0].classList.add("hasGamepadControlActive");
		return;
	}
	var activeElement = document.getElementsByClassName("hasGamepadControlActive")[0];
	var domRect = activeElement.getBoundingClientRect();
	
	var width = 10;
	
	var right	= domRect.left;
	var left 	= right - width;
	var top		= domRect.top;
	var bottom	= domRect.bottom;
	
	if (fromRight){
		right	= window.innerWidth;
		left	= right - width;
	}
	
	if (fullHeight){
		top  = 0;
		bottom = window.innerWidth;
		right--;
	}
	
	
	while (left > 0){
		var gamepadElements = document.getElementsByClassName("hasGamepadControl");
		for (var i = 0; i < gamepadElements.length; i++) {
			if (gamepadElements[i] == activeElement)
				continue;
				
			if (isOverlapRect(left,right,top,bottom,gamepadElements[i].getBoundingClientRect())){
				if (getZIndex(activeElement) != getZIndex(gamepadElements[i])){
					continue;
				}
				setGamepadActiveElement(gamepadElements[i]);
				return;
			}
		}
		left--;
		right--;
	};
	
	if (!fullHeight){
		keyLeft(true);
	}
	else{
		if (!fromRight){
			keyLeft(true,true);
		}
	}
};

function keyRight(fullHeight=false,fromLeft=false){
	if (document.getElementsByClassName("hasGamepadControlActive").length === 0){
		if (document.getElementsByClassName("hasGamepadControl").length === 0)
			return;
		document.getElementsByClassName("hasGamepadControl")[0].classList.add("hasGamepadControlActive");
		return;
	}
	var activeElement = document.getElementsByClassName("hasGamepadControlActive")[0];
	var domRect = activeElement.getBoundingClientRect();
	
	var width = 10;
	
	var right 	= domRect.right + width;
	var left	= domRect.right;
	var top		= domRect.top;
	var bottom	= domRect.bottom;
	
	if (fromLeft){
		left	= 0;
		right	= left + width;
	}
	
	if (fullHeight){
		top  = 0;
		bottom = window.innerWidth;
		left++;
	}

	while (right < window.innerWidth){
		var gamepadElements = document.getElementsByClassName("hasGamepadControl");
		for (var i = 0; i < gamepadElements.length; i++) {
			if (gamepadElements[i] == activeElement)
				continue;
				
			if (isOverlapRect(left,right,top,bottom,gamepadElements[i].getBoundingClientRect())){
				if (getZIndex(activeElement) != getZIndex(gamepadElements[i])){
					continue;
				}
				setGamepadActiveElement(gamepadElements[i]);
				return;
			}
		}
		left++;
		right++;
	};
	
	if (!fullHeight){
		keyRight(true);
	}
	else{
		if (!fromLeft){
			keyRight(true,true);
		}
	}
};


function isOverlapRect(left,right,top,bottom,rect2){

return !(right < rect2.left || 
         left > rect2.right || 
         bottom < rect2.top || 
         top > rect2.bottom)
};


document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
		if (!isMobile && window.ue && window.ue.uecom){
			document.onmousemove = function(event) {
				if (!sendMousePositionToUE4 || event.srcElement.tagName !== "HTML")
					return;
				window.ue.uecom.javascriptmouseposition(event.clientX,event.clientY);
			};
			
			document.onmousedown = function(event) {
				if (!sendMousePositionToUE4 || event.srcElement.tagName !== "HTML")
					return;
				window.ue.uecom.triggerue4eventmousedown(event.clientX,event.clientY,event.button);
			};
			
			document.onmouseup = function(event) {
				if (!sendMousePositionToUE4 || event.srcElement.tagName !== "HTML")
					return;
				window.ue.uecom.triggerue4eventmouseup(event.clientX,event.clientY,event.button);
			};
		}
		else{
			if (isMobile){						
				document.ontouchmove = function(event) {
					if (websocketConnected && sendMousePositionToUE4 && (event.srcElement.tagName == "HTML" || event.srcElement.tagName == "BODY")){
						for (var i = 0; i < event.touches.length; i++) {
							var data = "#touch'();:javascriptmouseposition'();:"+event.touches[i].pageX+"'();:"+event.touches[i].pageY;
							websocket.send(data);
						}
					}
				};			
				
				document.ontouchstart = function(event) {
					if (websocketConnected && sendMousePositionToUE4 && (event.srcElement.tagName == "HTML" || event.srcElement.tagName == "BODY")){
						for (var i = 0; i < event.touches.length; i++) {
							var data = "#touch'();:triggerue4eventmousedown'();:"+event.touches[i].pageX+"'();:"+event.touches[i].pageY+"'();:"+event.touches.length;
							websocket.send(data);
							break;
						}
					}
				};
			
				document.ontouchend = function(event) {
					if (websocketConnected && sendMousePositionToUE4 && (event.srcElement.tagName == "HTML" || event.srcElement.tagName == "BODY")){
						if (sendMousePositionToUE4 && event.srcElement.tagName == "HTML"){
							for (var i = 0; i < event.changedTouches.length; i++) {
								var data = "#touch'();:triggerue4eventmouseup'();:"+event.changedTouches[i].pageX+"'();:"+event.changedTouches[i].pageY+"'();:"+event.changedTouches.length;
								websocket.send(data);
								break;
							}
						}	
					}
				};
				
				document.ontouchcancel = function(event) {
					if (websocketConnected && sendMousePositionToUE4 && (event.srcElement.tagName == "HTML" || event.srcElement.tagName == "BODY")){
						if (sendMousePositionToUE4 && event.srcElement.tagName == "HTML"){
							for (var i = 0; i < event.changedTouches.length; i++) {
								var data = "#touch'();:triggerue4eventmouseup'();:"+event.changedTouches[i].pageX+"'();:"+event.changedTouches[i].pageY+"'();:"+event.changedTouches.length;
								websocket.send(data);
								break;
							}
						}	
					}
				};
				
			}
		}
		
		document.onclick = function(event) {
			
			if (event.srcElement && document.getElementsByClassName("hasGamepadControl").length > 0){
				var classList = event.srcElement.classList;
				for (var i = 0; i < classList.length; i++) {
					if (classList[i] == "hasGamepadControl"){
						setGamepadActiveElement(event.srcElement);
						break;
					}
				}
			}
		};
	}
};			

function setGamepadActiveElement(element){

	if (document.getElementsByClassName("hasGamepadControlActive").length > 0)
		document.getElementsByClassName("hasGamepadControlActive")[0].classList.remove("hasGamepadControlActive");
	element.classList.add("hasGamepadControlActive");
	element.focus();

};

/**Javascript to C++ functions START *********************************************************************************/

function UE4ConsoleCommand(command){
	if (isMobile){
		if (websocketConnected){
			websocket.send("#console'();:"+command);
		}
		/*if a call is fired in document ready or onload and the websocket connection is not yet established.*/
		else{
			mobileActionsStack.push("#console'();:"+command);
		}
	}
	else{
		if (window.ue && window.ue.uecom){
			window.ue.uecom.javascriptconsolecommand(command);
		}
		else{
			alert(ue4NotFoundMessage);
		}
	}
};

function UE4QuitGame(){
	if (isMobile){
		if (websocketConnected){
			websocket.send("#ue4quit");
		}
		/*if a call is fired in document ready or onload and the websocket connection is not yet established.*/
		else{
			mobileActionsStack.push("#ue4quit");
		}
	}
	else{
		if (window.ue && window.ue.uecom){
			window.ue.uecom.javascriptquitgame();
		}
		else{
			console.log(ue4NotFoundMessage);
		}
	}
};
/**
*resolution 		String like 1280x720
*windowMode 		Integer 0=Fullscreen,1=WindowedFullscreen,2=WindowedFullscreen
*antiAliasing 		Integer 0,1,2,3
*shadows 			Integer 0,1,2,3
*resolutionScale 	Integer 1,2,3,4,5,6,7,8,9,10
*apply				bool (false is used internally. Set always true )
**/
function UE4SetGraphics(resolutionP, windowModeP, antiAliasingP, shadowsP, resolutionScaleP, apply=false){
	resolution			= resolutionP;
	windowMode 			= parseInt(windowModeP);
	antiAliasing		= parseInt(antiAliasingP);
	shadows				= parseInt(shadowsP);
	resolutionScale		= parseInt(resolutionScaleP);
	
	if (apply){
		UE4ApplyAndSaveGraphics();
	}
};

/**
*Reads UE4 Graphic Settings and call setGraphics (see above)
**/
function UE4GetGraphics(){
	if (isMobile){
		if (websocketConnected){
			websocket.send("#ue4getgraphics");
		}
		/*if a call is fired in document ready or onload and the websocket connection is not yet established.*/
		else{
			mobileActionsStack.push("#ue4getgraphics");
		}
	}else{
		if (window.ue && window.ue.uecom){
			window.ue.uecom.javascriptgetgraphics();
		}
		else{
			console.log(ue4NotFoundMessage+"UE4getGraphics");
		}
	}
};

/**
* Apply and Save Settings
**/
function UE4ApplyAndSaveGraphics(){
	windowMode 			= parseInt(windowMode);
	antiAliasing		= parseInt(antiAliasing);
	shadows				= parseInt(shadows);
	resolutionScale		= parseInt(resolutionScale);
	
	if (isMobile){
		if (websocketConnected){
			websocket.send("#ue4applyandsavegraphics'();:"+resolution+"'();:"+windowMode+"'();:"+antiAliasing+"'();:"+shadows+"'();:"+resolutionScale);
		}
		/*if a call is fired in document ready or onload and the websocket connection is not yet established.*/
		else{
			mobileActionsStack.push("#ue4applyandsavegraphics'();:"+resolution+"'();:"+windowMode+"'();:"+antiAliasing+"'();:"+shadows+"'();:"+resolutionScale);
		}
	}else{
		if (window.ue && window.ue.uecom){
			window.ue.uecom.javascriptapplyandsavegraphics(resolution,windowMode,antiAliasing,shadows,resolutionScale);
		}
		else{
			console.log(ue4NotFoundMessage);
		}
	}
};


/**
* Change level or connect to a server
* mapOrAdress 	String myMap or 127.0.0.1:7777
**/
function UE4ClientTravel(mapOrAdress){
	if (isMobile){
		if (websocketConnected){
			websocket.send("#ue4travel'();:"+mapOrAdress);
		}
		/*if a call is fired in document ready or onload and the websocket connection is not yet established.*/
		else{
			mobileActionsStack.push("#ue4travel'();:"+mapOrAdress);
		}
	}
	else{
		if (window.ue && window.ue.uecom){
			window.ue.uecom.javascriptclienttravel(mapOrAdress);
		}
		else{
			console.log(mapOrAdress);
		}
	}
};

/**Javascript to C++ functions END *********************************************************************************/

/**
* Call this function in an HTML tag. You must pass a event name and this. ID, ClassName and Value are determined automatically.
* An infinite number of additional parameters is possible.
* Example: <div onclick="triggerUE4EventWithTag('myJavascriptFunctionsName',this,'optionalParameter 1','optionalParameter 2');"> 
*/
function triggerUE4EventWithTag(){
	var obj = getParameter((Array.prototype.slice.call(arguments, 0)));
	if (isMobile){
		var data64 = "UE4HTMLMenuUE4ConnectorOnUrlChangeue4EventName'();:triggerue4eventwithtag'();:"+obj.functionsName+"'();:"+obj.id+"'();:"+obj.className+"'();:"+obj.value+"'();:"+obj.args;
		if (websocketConnected){
			websocket.send("#js"+data64);
		}
		/*if a call is fired in document ready or onload and the websocket connection is not yet established.*/
		else{
			mobileActionsStack.push("#js"+data64);
		}
	}
	else{
		if (window.ue && window.ue.uecom){
			window.ue.uecom.triggerue4eventwithtag(obj.functionsName, obj.id, obj.className, obj.value, obj.args);
		}
		else{
			console.log(ue4NotFoundMessage);
		}
	}
};

/**
* You must pass a event name. An infinite number of additional parameters is possible.
* Example: triggerUE4EventBlank('myJavascriptFunctionsName','optionalParameter 1', 1234, 'Hallo World'); 
*/
function triggerUE4EventBlank(){
	var obj = getParameter((Array.prototype.slice.call(arguments, 0)));
	if (isMobile){
		var data64 = "UE4HTMLMenuUE4ConnectorOnUrlChangeue4EventName'();:triggerue4eventwithblank'();:"+obj.functionsName+"'();:"+obj.args;
		if (websocketConnected){
			websocket.send("#js"+data64);
		}
		/*if a call is fired in document ready or onload and the websocket connection is not yet established.*/
		else{
			mobileActionsStack.push("#js"+data64);
		}
	}
	else{
		if (window.ue && window.ue.uecom){
			window.ue.uecom.triggerue4eventwithblank(obj.functionsName, obj.args);
		}
		else{
			console.log(ue4NotFoundMessage);
		}
	}
};

/**
* You must pass a event name. Additional parameters must be transferred as strings separated by a double point. They are stored in a map.
* Example: triggerUE4EventMap('myJavascriptFunctionsName','ItemID:33', 'Hitpoints:78', 'Gold:44'); 
*/
function triggerUE4EventMap(){
	var obj = getParameter((Array.prototype.slice.call(arguments, 0)));
	
	if (isMobile){
		var data64 = "UE4HTMLMenuUE4ConnectorOnUrlChangeue4EventName'();:triggerue4eventwithmap'();:"+obj.functionsName+"'();:"+obj.args;
		if (websocketConnected){
			websocket.send("#js"+data64);
		}
		/*if a call is fired in document ready or onload and the websocket connection is not yet established.*/
		else{
			mobileActionsStack.push("#js"+data64);
		}
	}
	else{
		if (window.ue && window.ue.uecom){
			window.ue.uecom.triggerue4eventwithmap(obj.functionsName, obj.args);
		}
		else{
			console.log(ue4NotFoundMessage);
		}
	}
};

/**
* You must pass a event name. Additional parameter must be transferred as JSON string. 
* Example: triggerUE4EventJSON('myJavascriptFunctionsName',JSON.stringify({'ItemID':33,'Hitpoints':33})); 
*/
function triggerUE4EventJSON(functionsName,json){
	if (isMobile){
		var data64 = "UE4HTMLMenuUE4ConnectorOnUrlChangeue4EventName'();:triggerue4eventwithjson'();:"+functionsName+"'();:"+json;
		if (websocketConnected){
			websocket.send("#js"+data64);
		}
		/*if a call is fired in document ready or onload and the websocket connection is not yet established.*/
		else{
			mobileActionsStack.push("#js"+data64);
		}
	}
	else{
		if (window.ue && window.ue.uecom){
			window.ue.uecom.triggerue4eventwithjson(functionsName, json);
		}
		else{
			console.log(ue4NotFoundMessage);
		}
	}
};

function getParameter(parameterArray){
	var obj = {
		functionsName:'',
		id:'',
		className:'',
		value:'',
		args:''
	};
	var tempArray = new Array();
	if (parameterArray.length > 0){
		for (var i = 1; i <= parameterArray.length; i++){
			if (typeof parameterArray[i] == 'object'){
				obj.id 			= parameterArray[i].id;
				obj.className 	= parameterArray[i].className;
				obj.value 		= parameterArray[i].value;
			}
			else{
				tempArray.push(parameterArray[i]);
			}
		}
	}
	obj.functionsName 	= parameterArray[0];
	obj.args 			= tempArray.join('.;_|');
	return obj;
};


function save(id,value){
	localStorage.setItem(id, value);
};

function load(id){
	return localStorage.getItem(id);
};


function getZIndex(e) {  
  var z = -99999;
  try {
    z = window.document.defaultView.getComputedStyle(e).getPropertyValue('z-index');
	}
	catch(err) {
		return z;
	}
  if (isNaN(z))
		z = window.getZIndex(e.parentNode);
	if (!z)
		z = 0;
  return z; 
};


var websocketConnected = false;
function openWebsocket(websocketPort){
	
	/*is connected*/
	if (websocket && websocketConnected && websocket.readyState == websocket.OPEN /*&& websocketPortGlobal == websocketPort*/){
		return;
	}
	
	var ws = 'ws://127.0.0.1:'+websocketPort+'/ue4?';
	/*console.log("openWebsocket:"+ws);*/
	websocketConnected = false;
	websocket = new WebSocket(ws);
	
	websocket.onopen = function () {
		/*console.log("onopen:"+ws);*/
		websocketConnected = true;
		setTimeout(function () { 
			sendAndClearStack();	
		}, 1000);
		
	};

	websocket.onerror = function (errorEvent) {
		/*console.log("onerror:"+ws);*/
		websocketConnected = false;
	};

	websocket.onclose = function (closeEvent) {
		/*console.log("onclose:"+ws);*/
		websocketConnected = false;
	};
};

function closeWebsocket(){
	if (websocket){
		websocket.close();
	}
};

function loadPDF(pdfData){
	if (!pdfData || !PDFViewerApplication)
		return;
	var blobData = atob(pdfData);
	if (isMobile){
		PDFViewerApplicationMobile.open({data:blobData,ue4:true});
	}
	else{
		PDFViewerApplication.open({data:blobData,ue4:true});
	}
	
};

function sendAndClearStack(message){
	if (!message){
		if (mobileActionsStack.length > 0){
			sendAndClearStack(mobileActionsStack.shift());
		}
		return;
	}
	setTimeout(function () { 
		websocket.send(message);	
		if (mobileActionsStack.length > 0){
			sendAndClearStack(mobileActionsStack.shift());
			/*console.log("send stack");*/
		}
	}, 200);
	
};


/*Disable right click*/
document.addEventListener('contextmenu', function(e) {
	e.preventDefault();
}, false);

/*redirct errors*/
window.onerror = function(message, source, lineno, colno, error){
	if (showErrorsAsAlert && message && error){
		alert(message+" | "+source+" | "+lineno+" | "+colno+" | "+error);
	}
};