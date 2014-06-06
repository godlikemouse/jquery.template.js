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

$.fn.template = function(){

	var _ref = this;
	var _element = $(this);

	//Method for parsing and evaluating
	function parse(s, binding){

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

				var value = parse(this.nodeValue, binding);
				this.nodeValue = value;

				if(name.indexOf("data-") >= 0){
					if(typeof value == "object"){
						var dataName = name.replace("data-","");
						node.data(dataName, value);
						node.removeAttr(name);
					}
				}
			});

			node.contents().each(function(){
				inspect($(this), binding);
			});

			if(node.prop("nodeType") !== 1){
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
		var s = $("<p>");
		$(items).each(function(){
			s.append( inspect($(_element.html()), this) );
		});

		if(items == undefined || items.length == 0)
			s.append(_element.html());

		return s.children();
	}

	//To string method for returning the current raw template text
	_ref.toString = function(){
		return _element.html();
	}

	return _ref;
}
