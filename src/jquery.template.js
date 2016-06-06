/*
 * Copyright 2014 Jason Graves (GodLikeMouse/Collaboradev)
 * http://www.collaboradev.com
 *
 * This file is part of jquery.template.js.
 *
 * The jquery.template.js plugin is free software: you can redistribute it
 * and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * The jquery.template.js plugin is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with the jquery.template.js plugin. If not, see http://www.gnu.org/licenses/.
 */

$.fn.template = function(options){

	var _ref = this;
	var _element = $(this);
	var _cache = {};

	var _defaultOptions = {
		onBind: function(items){},
		onPreRender: function(element, binding){}
	};

	options = $.extend(true, _defaultOptions, options);

	//Method for parsing and evaluating
	function parse(s, binding){

		//scope level template function for chaining templates
		function template(selector, bindingData){
			if(!bindingData) bindingData = binding;
			if(!_cache[selector])
				_cache[selector] = $(selector).template();
			return _cache[selector].bind(bindingData);
		}

		if(s.indexOf("{") >= 0 && s.indexOf("}") >= 0){

			var tokens = s.match(/\{.*?\}/gm);

			for(var i in tokens){
				var token = tokens[i];

				var source = token.replace("{","").replace("}","");
				var value = eval(source);

				if(typeof value == "object"){
					s = value;
					break;
				}
				else {
					s = s.replace(token, value);
				}
			}
		}

		return s;
	}

	//Method for inspecting the node and children
	function inspect(nodes, binding){

		nodes.each(function(){
			var node = $(this);

			var attributes = node.get(0).attributes;
			$(attributes).each(function(){
				var name = this.nodeName;

				options.onPreRender(this, binding);
				var value = parse(this.value, binding);
				this.value = value;

				if(name.indexOf("data-") >= 0){
					if(typeof value == "object"){
						var dataName = name.replace("data-","");
						node.data(dataName, value);
						node.removeAttr(name);
					}
				}
			});

			node.contents().each(function(){
				options.onPreRender(this, binding);
				inspect($(this), binding);
			});

			if(node.prop("nodeType") !== 1){
				options.onPreRender(this, binding);
				var v = parse(node.text(), binding);

				if(typeof v == "object")
					node.replaceWith(v);
				else
					node.get(0).nodeValue = v;
			}
		});

		return nodes;
	}

	//Method for binding a list of objects to the template
	_ref.bind = function(items){

		try{
			options.onBind(items);

			var s = $("<p>");
			$(items).each(function(){
				//handle IE stripping invalid styles
				var html = _element.html();
				var tokens = html.match(/style\=".*\{.*?\}?"/gm);
				for(var i in tokens){
					html = html.replace(tokens[i], parse(tokens[i], this));
				}

				s.append( inspect($(html), this) );
			});

			if(items == undefined || items.length == 0)
				s.append(_element.html());
		}
		catch(ex){
			console.error("Error in jquery.template.js at bind: " + ex, _ref);
		}

		return s.children();
	}

	//To string method for returning the current raw template text
	_ref.toString = function(){
		return _element.html();
	}

	return _ref;
}
