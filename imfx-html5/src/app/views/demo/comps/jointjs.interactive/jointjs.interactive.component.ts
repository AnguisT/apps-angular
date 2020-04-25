/**
 * Created by Pavel on 21.03.2017.
 */
import {Component, ViewChild, ChangeDetectorRef, ViewEncapsulation} from '@angular/core';

import * as $ from 'jquery';
import * as _ from 'lodash';
import * as Backbone from 'backbone';
import * as joint from 'jointjs/dist/joint.js';

import 'style-loader!jointjs/dist/joint.min.css';

@Component({
  selector: 'demo-jointjs',
  templateUrl: './tpl/index.html',
  styleUrls: [
    'styles/index.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class JointJsInteractiveComponent {
  @ViewChild('jointjs') private control;

  private graph: any;
  private paper: any;


  constructor(private cdr: ChangeDetectorRef) {

  }


  ngOnInit() {

    /*debugger*/;

    this.graph = new joint.dia.Graph();
    this.paper = new joint.dia.Paper({
      el: $('#joint-js'), width: 500, height: 500, model: this.graph
    });

    joint.shapes.html = {};
    joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
      defaults: joint.util.deepSupplement({
        type: 'html.Element',
        attrs: {
          rect: {stroke: 'none', 'fill-opacity': 0}
        }
      }, joint.shapes.basic.Rect.prototype.defaults)
    });


    let componentRef = this;

    joint.shapes.html.ElementView = joint.dia.ElementView.extend({

      template: [
        '<div class="html-element">',
        '<button class="delete">x</button>',
        '<label></label>',
        '<span></span>', '<br/>',
        '<button class="add-neightbour">Search</button>',
        '</div>'
      ].join(''),

      initialize: function () {
        _.bindAll(this, 'updateBox');
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        let elementRef = this;

        this.$box = $(_.template(this.template)());


        this.$box.find('.add-neightbour').on('click', function (evt) {
          evt.stopPropagation();
          elementRef.addNeighbour();
        });

        // Prevent paper from handling pointerdown.
        this.$box.find('input,select').on('mousedown click', function (evt) {
          evt.stopPropagation();
        });
        // This is an example of reacting on the input change and storing the input data in the cell model.
        this.$box.find('input').on('change', _.bind(function (evt) {
          this.model.set('input', $(evt.target).val());
        }, this));
        this.$box.find('select').on('change', _.bind(function (evt) {
          this.model.set('select', $(evt.target).val());
        }, this));
        this.$box.find('select').val(this.model.get('select'));
        this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
        // Update the box position whenever the underlying model changes.
        this.model.on('change', this.updateBox, this);
        // Remove the box when the model gets removed from the graph.
        this.model.on('remove', this.removeBox, this);

        this.updateBox();
      },
      render: function () {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.paper.$el.prepend(this.$box);
        this.updateBox();
        return this;
      },
      updateBox: function () {
        // Set the position and dimension of the box so that it covers the JointJS element.
        var bbox = this.model.getBBox();
        // Example of updating the HTML with a data stored in the cell model.
        this.$box.find('label').text(this.model.get('label'));
        this.$box.find('span').text(this.model.get('select'));
        this.$box.css({
          width: bbox.width,
          height: bbox.height,
          left: bbox.x,
          top: bbox.y,
          transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
        });
      },
      removeBox: function (evt) {
        this.$box.remove();
      },
      addNeighbour: function() {
        let neighbour = new joint.shapes.html.Element({
          //position: {x: 370, y: 160},
          size: {width: 170, height: 100},
          label: 'Custom component',
          select: '3'
        });

        let l = new joint.dia.Link({
          source: {id: this.model.id},
          target: {id: neighbour.id},
          attrs: {'.connection': {'stroke-width': 5, stroke: '#34495E'}}
        });

        componentRef.graph.addCells([neighbour, l]);

        joint.layout.DirectedGraph.layout(componentRef.graph, { setLinkVertices: false });
      }
    });


    var el1 = new joint.shapes.html.Element({
      //position: {x: 80, y: 80},
      size: {width: 170, height: 100},
      label: 'I am HTML',
      select: 'one'
    });
    var el2 = new joint.shapes.html.Element({
      //position: {x: 370, y: 160},
      size: {width: 170, height: 100},
      label: 'Me too',
      select: 'two'
    });
    var el3 = new joint.shapes.html.Element({
      //position: {x: 370, y: 160},
      size: {width: 170, height: 100},
      label: 'Me too',
      select: 'two'
    });
    var el4 = new joint.shapes.html.Element({
      //position: {x: 370, y: 160},
      size: {width: 170, height: 100},
      label: 'Me too',
      select: 'two'
    });
    var l1 = new joint.dia.Link({
      source: {id: el1.id},
      target: {id: el2.id},
      attrs: {'.connection': {'stroke-width': 5, stroke: '#34495E'}}
    });
    var l2 = new joint.dia.Link({
      source: {id: el1.id},
      target: {id: el3.id},
      attrs: {'.connection': {'stroke-width': 5, stroke: '#34495E'}}
    });
    var l3 = new joint.dia.Link({
      source: {id: el1.id},
      target: {id: el4.id},
      attrs: {'.connection': {'stroke-width': 5, stroke: '#34495E'}}
    });

    this.graph.addCells([el1, el2, el3, el4, l1, l2, l3]);

    joint.layout.DirectedGraph.layout(componentRef.graph, { setLinkVertices: false});


  }

}
