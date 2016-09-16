# handlebars-template-inheritance
Add support to Handlebars for template inheritance with the `block` and `extends` helpers.

Directly inspired by [Template Inheritance in Pug][1] and this works exactly the same way but in [Handlebars][2].

## Install

	npm install handlebars-template-inheritance --save

## Usage

	// app.js
	
	import Handlebars from 'handlebars';
	import helpers from 'handlebars-template-inheritance';
	
	Handlebars.registerHelper(helpers);

### Extends

The `extends` helper allows a template to extend a layout or parent template. It can then override certain pre-defined blocks of content.

Note: You can have multiple levels of inheritance, allowing you to create powerful hierarchies of templates.

### Block

Handlebars blocks can provide default content if desired, however optional as shown below by `block scripts`, `block content`, and `block foot`.

	{{! layout.hbs }}
	
	<!DOCTYPE html>
	<html lang="en">
	<head>
	
		<meta charset="utf-8">
		<title>
			My Site — {{title}}
		</title>
		{{#block "scripts"}}
			<script src="/jquery.js"></script>
		{{/block}}
	
	</head>
	<body>
	
		{{#block "content"}}{{/block}}
	
		{{#block "foot"}}
			<div id="footer">
				<p>
					some footer content
				</p>
			</div>
		{{/block}}
	
	</body>
	</html>

Now to extend the layout, simply create a new file and use the `extends` helper as shown below, giving the path ([server only][4]). You may now define one or more blocks that will override the parent block content, note that here the `foot` block is _not_ redefined and will output “some footer content”.

	{{! page-a.hbs }}
	
	{{#extends "layout"}}
	
		{{#block "scripts"}}
			<script src="/jquery.js"></script>
			<script src="/pets.js"></script>
		{{/block}}
	
		{{#block "content"}}
			<h1>
				{{title}}
			</h1>
			{{#each pets as |petName|}}
				<p>{{petName}}</p>
			{{/each}}
		{{/block}}
	
	{{/extends}}

It’s also possible to override a block to provide additional blocks, as shown in the following example where the `content` block now exposes a `sidebar` and `primary` block for overriding, or the child template could override the `content` block all together.

	{{! sub-layout.hbs }}
	
	{{#extends "layout"}}
	
		{{#block "content"}}
			<div class="sidebar">
				{{#block "sidebar"}}
					<p>nothing</p>
				{{/block}}
			</div>
			<div class="primary">
				{{#block "primary"}}
					<p>nothing</p>
				{{/block}}
			</div>
		{{/block}}
	
	{{/extends}}

	{{! page-b.hbs }}
	
	{{#extends "sub-layout"}}
	
		{{#block "content"}}
			<div class="sidebar">
				{{#block "sidebar"}}
					<p>nothing</p>
				{{/block}}
			</div>
			<div class="primary">
				{{#block "primary"}}
					<p>nothing</p>
				{{/block}}
			</div>
		{{/block}}
	
	{{/extends}}

### Block Append / Prepend

The `block` helper also allows you to prepend or append blocks in addition to the default behavior of replacing blocks. Suppose for example you have default scripts in a `head` block that you wish to utilize on every page, you might do this:

	{{! layout.hbs }}
	
	<!DOCTYPE html>
	<html lang="en">
	<head>
	
		{{#block "head"}}
			<script src="/vendor/jquery.js"></script>
			<script src="/vendor/caustic.js"></script>
		{{/block}}
		
	</head>
	<body>
	
		{{#block "content"}}{{/block}}
		
	</body>
	</html>

	{{! page.hbs }}
	
	{{#extends "layout"}}
	
		{{#block "head" mode="append"}}
			<script src="/vendor/three.js"></script>
			<script src="/game.js"></script>
		{{/block}}
	
	{{/extends}}

The `append` and `prepend` helpers make this common use case even easier.

	{{! page.hbs }}
	
	{{#extends "layout"}}
	
		{{#append "head"}}
			<script src="/vendor/three.js"></script>
			<script src="/game.js"></script>
		{{/append}}
	
	{{/extends}}

## Todo

In chronological order (oldest first); not in order of priority.

* remove server-only restriction and add support for running in the browser (client-side)
* investigate possibility of using partial blocks in addition to the extends helper
* please create an issue if you'd like any of these changes or to recommend other changes

## Changelog

_1.0.0 — September 16, 2016_

* initial version
* requires node.js fs and path modules to load layouts from file system

## License

handlebars-template-inheritance is available under the [MIT License][3].

[1]: https://pugjs.org/language/inheritance.html
[2]: http://handlebarsjs.com
[3]: https://github.com/keithws/handlebars-template-inheritance/blob/master/LICENSE
[4]: https://github.com/keithws/handlebars-template-inheritance#Todo