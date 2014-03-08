Backbone.Dg
===========

Datagrid plugin for Backbone.Marionette. Check out the [demo](http://prevole.github.com/backbone.dg/demo/)!


**v0.0.1: Test suite is begining. Consider this very alpha.**

## About

Backbone.Dg aims to bring an out of the box way to build data grids based on [Backbone](http://backbonejs.org) and [Backbone.Marionette](https://github.com/marionettejs/backbone.marionette).

### Features

* Fetches table data from a `Backbone.Collection`
* Event-based management with a Marionette `EventAggregator`
* Provides view implementations using Marionette components (`Layout`, `CompositeView` and `ItemView`)
* Provides view markup with [Twitter Bootstrap](http://twitter.github.com/bootstrap/) classes that can be replaced
* Modular structure allowing you to redefine each component separately:
  * Records per page
  * Quick search
  * Records Info
  * Pagination
  * Markup (table vs. div)

## Requirements

Backbone.Dg currently works with the following libraries:

* [jQuery](http://jquery.com) v2.1.0
* [Underscore](http://underscorejs.org) v1.6.4
* [Backbone](http://backbonejs.org) v1.1.2
* [Backbone.Marionette](http://marionettejs.com) v1.6.4

You can try to run with different versions at your own risks.

## Installation

You can find the raw (`coffee`) source code in `src`. Development and production builds are in `dist`.

### Standard Build

* Development: [backbone.dg.js](https://raw.github.com/Prevole/backbone.dg/master/dist/backgone.dg.js)
* Production: [backbone.dg.min.js](https://raw.github.com/Prevole/backbone.dg/master/dist/backbone.dg.min.js)

## Documentation

You can read the [annotated source code](http://prevole.github.com/backbone.dg/doc/src/dg/backbone.dg.coffee.html).

## Meta

* **Author:** Laurent Prévost (Prevole)
* **License:** MIT (see [LICENSE.txt](https://raw.github.com/Prevole/backbone.dg/master/LICENSE.txt))
