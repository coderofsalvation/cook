"use strict"

/*
//Config Variables

var popID = ?;
var backID = ?;

//Optional (for animations (on popup cancel) 
var animation_out_length = ?; //duration in milliseconds;
var back_animation_out_class_name = ?;
var popup_animation_out_class_name = ?;

//for ajax
var $SCRIPT_ROOT = ?;
*/


function get(to_get){
	if (!to_get){ return false;}
	//Check if its an ID
	if (to_get.slice(0,1) == "#") {
		return document.getElementById(to_get.slice(1));
	}
}


function create_element(tag, element_build_dict){
	var created_node = document.createElement(tag);
	
    if (element_build_dict != undefined){
	$.each( element_build_dict, function( key, value ) {
		if (key === "Structure") { created_node.appendChild(value);}
		else if (key === "ID") { created_node.id = value;}
		else if (key === "Classes") {
			for(var i=0; i < value.length; i++){
			$(created_node).addClass(value[i]);
			}	
		}
    });
    }
	return created_node;
}


function add_text(node, text){
	node.appendChild(document.createTextNode(text));
}


function get_doc_height() {
    return Math.max(
        Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
        Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
        Math.max(document.body.clientHeight, document.documentElement.clientHeight)
    );
}

function get_inner_height(){
    return window.innerHeight;
}

function get_scrolled(){
    return Math.max(window.scrollY, document.body.scrollTop);
}

function get_key_code(e){
	return e.keyCode;
}

function is_there(val){
	return !(val === "" || val === undefined || val === null);
}

function remove_element(list, item){
	var pos = list.indexOf(item);
	if (pos != -1){
		list.splice(pos,1)
	} return list;
}

function toggle_display(node, display_type){
	if (!is_there(display_type)) display_type = 'block';
	if (is_there(node)){
		if (node.style.display==display_type) node.style.display = 'none';
		else  node.style.display = display_type;
	}
}

function toggle_focus(node){
	if (is_there(node)){
		if (document.activeElement == node) $(node).focus();
		else  $(node).blur();
	}
}

//Source: Mozilla Development Network
function animationPossible(){

	var animation = false;
    var animationstring = 'animation';
    var keyframeprefix = '';
    var domPrefixes = 'Webkit O MS MOZ'.split(' ');
    pfx  = '';
 
	if( elm.style.animationName ) { animation = true; }    
 
	if( animation === false ) {
	  for( var i = 0; i < domPrefixes.length; i++ ) {
	    if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
	      var pfx = domPrefixes[ i ];
	      animationstring = pfx + 'Animation';
	      keyframeprefix = '-' + pfx.toLowerCase() + '-';
	      animation = true;
	      break;
	    }
	  }
	}
	
	return animation;
}

function pop_up(content, extra_class ){
    if (get("#" + backID)) {return 0;}
      
    var backy = create_element('div');
    backy.id = backID;
    backy.style.height = get_doc_height() + "px";

 
    var popy = create_element('div');
    popy.id = popID;
    if (is_there(extra_class)){
    	popy.className = extra_class;
    }
    popy.style.marginTop = ((get_inner_height()/3.45 + get_scrolled()) + "px");
	

    var cancel = create_element('span');
    cancel.id = 'cancel';
    cancel.innerHTML = 'x';

    cancel.onclick = function(){
		
    	pop_out();
    };
	
	if (is_there(content.substring)){
    	var content_area = create_element('p', content);
    }else{
    	var content_area = content;
    }

    popy.appendChild(cancel);
    popy.appendChild(content_area);
    
    
    backy.appendChild(popy);
   
	
	
    document.body.appendChild(backy);
    
	document.onkeydown = function(){
		if (get_key_code(window.event) == 27){
			pop_out();
		}
	}
	
}

function pop_out(){
	document.onkeydown = function(){}
	animate_out(animation_out_length, backID,{backID: back_animation_out_class_name, popID: popup_animation_out_class_name });
}


function animate_out(delay_length, main, todo){
	var delay = 0;
	
	if (animationPossible){
		delay = delay_length - 30;
	}
	setTimeout(function(){$('#' + main).remove(); }, delay);
	$.each(todo, function(key, value) { 
  		$(key).addClass(value);
	});
}


function go_ajax(url, method, data, success_func){
    if (!is_there(success_func)){
        success_func = function(){location.reload();}
    }

    $.ajax({
        url:$SCRIPT_ROOT + url,
        type:method,
        data:  JSON.stringify(data),
        contentType:"application/json;charset=UTF-8",
        success: success_func,
        error: function(){alert('something went wrong');}
    });
}

function bring_json(url, data, func){
    $.getJSON($SCRIPT_ROOT + url, data, func);
}