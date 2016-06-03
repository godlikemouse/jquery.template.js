jquery.template.js
==================

jQuery Template plugin allowing for HTML/Script based templates to be used.  Template blocks can consist of values to be replaced, embedded JavaScript logic and make calls to external functions or API sets.

## Usage

(Requires jQuery) Include the jquery.template.js or jquery.template.min.js file.
Create a script/template block, initialize the template/plugin block, bind data and render the result.

## Quick Start

Create a simple script block in HTML and give it an id.  Create binding placeholders to be replaced with actual bound data.

	<script language="text/template" id="my-template">
		<p>{binding.first_name}</p>
		<p>{binding.last_name}</p>
	</script>

Next in JavaScript initialize the template, then bind data to the template and render.

	var myTemplate = $("#my-template").template();
	var data = [{first_name: "Jason", last_name: "Graves"}];
	var renderedTemplate = myTemplate.bind(data);
	$("body").append(renderedTemplate);

### A Bit More Complicated

Create a definition list and an associated template with some embedded rules.

	<dl class="dl-horizontal" id="employee-list"></dl>

	<script language="text/template" id="list-template">
		<dt class="{binding.item.type == 'programmer' ? 'gray' : 'black'}">
			{$.trim(binding.item.first_name)} {$.trim(binding.item.last_name)}
		</dt>
		<dd>
			{binding.item.description}
		</dd>
	</script>

Next in JavaScript initialize the template, then bind the data list to the template and render.

	var employeeListTemplate = $("#list-template").template();
	var data = [
		{
			item: {
				first_name: "Jason",
				last_name: "Graves",
				type: "programmer",
				description: "Musician, coder, nerd extrodinaire."
			}
		},
		{
			item: {
				first_name: "Bob",
				last_name: "Dobalina",
				type: "drone",
				description: "Food for a song, gets paged a lot."
			}
		},
		{
			item: {
				first_name: "Nikola",
				last_name: "Tesla",
				type: "genius",
				description: "Inventor, electrical engineer, mechanical engineer and futurist"
			}
		}
	];
	var renderedTemplate = employeeListTemplate.bind(data);
	$("#employee-list").append(renderedTemplate);

In this example the dt/dd list is created with an if check on the class of the dt element.  When the item.type is "programmer", the class attribute is set to gray, otherwise it is set to black.  The list of 3 items is iterated over replacing all appropriate values before being inserted into the dl element.

### Storing data

In this example data will be stored as attributes and as jQuery attribute objects.

	<script language="text/template" id="my-template">
	<div data-id="{binding.item.id}" data-item="{binding.item}">{binding.item.title}</div>
	</script>

Next in JavaScript initialize the template, then bind the data to the template and render.

	var myTemplate = $("#my-template").template();
	var data = [
		{
			item: {
				id: "data-example-1",
				title: "Data Example",
				key: "1234567890"
			}
		}
	];
	var renderedTemplate = myTemplate.bind(data);
	$("body").append(renderedTemplate);

In this example, the data-id attribute receives the actual value of the item.id ("data-example-1"), the inner text of the div element receives the actual value of the item.title ("Data Example") and the data-item attribute actually gets set the to item object itself by use of the jQuery $.data("item", binding.item) call.

### Template chaining

In this example a parent template will make use of a child template while iterating data.

	<script language="text/template" id="parent-template">
	<div class="parent-container">{ template("child-template", binding.item) }</div>
	</script>

	<script language="text/template" id="child-template">
	<div class="first-name">{ binding.first_name }</div>
	<div class="last-name">{ binding.last_name }</div>
	<div class="type">{ binding.type }</div>
	<div class="description">{ binding.description }</div>
	</script>

Next in JavaScript initialize the parent template, pass the data and let'er rip.

	var parentTemplate = $("#parent-template").template();
	var data = [
		{
			item: {
				first_name: "Jason",
				last_name: "Graves",
				type: "programmer",
				description: "Musician, coder, nerd extrodinaire."
			}
		},
		{
			item: {
				first_name: "Bob",
				last_name: "Dobalina",
				type: "drone",
				description: "Food for a song, gets paged a lot."
			}
		},
		{
			item: {
				first_name: "Nikola",
				last_name: "Tesla",
				type: "genius",
				description: "Inventor, electrical engineer, mechanical engineer and futurist"
			}
		}
	];
	var renderedTemplate = parentTemplate.bind(data);
	$("body").append(renderedTemplate);

In this example, the parent template gets called directly in code, which in turn binds to child template.  The second parameter to the template function is optional, by default the current binding object will be passed unless otherwise specified.

## Community

Keep track of development and community news.

* Follow [@Collaboradev on Twitter](https://twitter.com/collaboradev).
* Follow the [Collaboradev Blog](http://www.collaboradev.com).

## License

jquery.template.js is released under [GPL, version 2.0](http://www.gnu.org/licenses/gpl-2.0.html)

