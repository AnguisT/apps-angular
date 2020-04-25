/**
 * Created by Sergey Trizna on 08.06.2017.
 */
import * as $ from 'jquery';
import * as _ from 'lodash';
import * as Backbone from 'backbone';
import * as joint from 'jointjs/dist/joint.js';
import 'style-loader!jointjs/dist/joint.min.css';
import {shapes} from "jointjs";
import {LinkTypes} from "../types";

export class JointDeps {
    public graph: any;
    public paper: any;
    private els = [];
  public config;
    private control;

    constructor() {

    }

    private initBlock() {
        let self = this;
        joint.shapes.html = {};
        joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
            defaults: joint.util.deepSupplement({
                type: 'html.Element',
                attrs: {
                    rect: {stroke: 'none', 'fill-opacity': 0}
                }
            }, joint.shapes.basic.Rect.prototype.defaults)
        });

        joint.shapes.html.ElementView = joint.dia.ElementView.extend({
            template: [
                '<div class="html-element">',
                ' <div><label></label></div>',
                ' <div><span class="status-label"></span></div>',
                // ' <div>Progress: <span class="progress-label"></span>%</div>',
                ' <div class="progress-wrapper">',
                '   <div class="progress-bar"></div>',
                '   <div class="label"></div>',
                ' </div>',
                '</div>'
            ].join(''),

            initialize: function () {
                _.bindAll(this, 'updateBox');
                joint.dia.ElementView.prototype.initialize.apply(this, arguments);

                let elementRef = this;

                this.$box = $(_.template(this.template)());
                //
                // $("#workflow-graph")
                //     .mousemove(this.updateBox);

                // Update the box position whenever the underlying model changes.
                this.model.on('change', this.updateBox, this);
                // Remove the box when the model gets removed from the graph.
                this.model.on('remove', this.removeBox, this);

                elementRef.updateBox();


            },
            render: function () {
                joint.dia.ElementView.prototype.render.apply(this, arguments);
                this.paper.$el.prepend(this.$box);
                this.updateBox();

                return this;
            },
            updateBox: function () {
                // Set the position and dimension of the box so that it covers the JointJS element.
                let bbox = this.model.getBBox();
                // Example of updating the HTML with a data stored in the cell model.
                this.$box.find('label').text(this.model.get('label'));
                this.$box.find('.progress-label').text(this.model.get('progress'));
                let progressWrapper = this.$box.find('.progress-wrapper');
                progressWrapper.find(".progress-bar").width(this.model.get('progress')+"%");
                progressWrapper.find(".label").text(this.model.get('progress')+"%");



                this.$box.find('.status-label').text(this.model.get('status'));
                this.$box.css({
                    width: bbox.width,
                    height: bbox.height,
                    left: bbox.x + self.paper.options.origin.x,
                    top: bbox.y + self.paper.options.origin.y,
                    transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
                });
                let status = this.model.get('status');
                if (status == "Failed") {
                    this.$box.addClass("failed")
                }
                if (status == "Ready") {
                    this.$box.addClass("ready")
                }
            },
        });
    }

    public getBlock(opts) {
        let _opts = $.extend(true, {
            size: {width: 200, height: 100},
            label: 'unnamed',
            status: 'unstatused',
            progress: 'unprogress',
            task: {}
        }, opts);
        return new joint.shapes.html.Element(_opts);
    }

    public getModel(inputs, outputs, options) {
        let opts = $.extend({}, {
            size: {
                width: 75,
                height: 75
            },
            attrs: {
                text: {
                    text: ''
                }
            },
            inPorts: inputs,
            outPorts: outputs,
            ports: {
                groups: {
                    'in': {
                        position: 'left',
                        label: {
                            position: 'outside'
                        }
                    },
                    'out': {
                        position: 'right',
                        label: {
                            position: 'outside'
                        }
                    }
                }
            }
        }, options);

        return new joint.shapes.devs.Model(opts);
    }

    public getLinkPort2Port(sourceId, sourcePort, targetId, targetPort, type: LinkTypes, opts = {}) {
        return this.getLink($.extend(true, {
            source: {
                id: sourceId,
                port: sourcePort
            },
            target: {
                id: targetId,
                port: targetPort
            }
        }, opts), type);
    }

    public getLinkModel2Model(sourceId, targetId, type: LinkTypes, opts = {}) {
        return this.getLink($.extend(true, {
            source: {
                id: sourceId,
            },
            target: {
                id: targetId,
            }
        }, opts), type);
    }

    public init(data) {
        this.config = data.config;
        this.control = data.control;
        this.graph = new joint.dia.Graph();
        let s = this.getSizeForPaper();
        this.paper = new joint.dia.Paper({
            el: this.control.nativeElement,
            width: s.w,
            height: s.h,
            gridSize: 1,
            model: this.graph,
            defaultLink: this.getLink({}, 'arrow'),
            clickThreshold: 1,
            linkPinning: false,
            interactive: {
                 vertexAdd: false
            },
            validateMagnet: function (cellView, magnet) {
                return magnet.getAttribute('magnet') !== 'passive';
            },
            validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                if (!magnetT || magnetT.attributes['port-group'].value == 'out') {
                    return false;
                }
                // // Only rectangle can be the source, if it is not, we do not allow such connection:
                // if (cellViewS.model.get('type') !== 'basic.Rect') return false;
                // // Only circle can be the target, if it is not, we do not allow such a connection:
                // if (cellViewT.model.get('type') !== 'basic.Circle') return false;
                // // Connection is allowed otherwise.
                return true;
            },
            // Enable link snapping within 25px lookup radius
            snapLinks: {radius: 35}
        });
        this.initBlock();
    }

    public addCell(el) {
        this.els.push(el);
    }

    public resize() {
        let s = this.getSizeForPaper();
        this.paper.setDimensions(s.w, s.h);
    }

    public drawAll() {
      this.graph.resetCells(this.els);
      setTimeout(() => {
          let graphBBox = joint.layout.DirectedGraph.layout(this.els, {
            setLinkVertices: false,
            setPosition: this.setPostions,
            rankDir: 'TB',
            align: 'UL',
            ranker: 'network-simples'
          });
      });
    }

    public on(on: string, cb: Function) {
        this.paper.on(on, cb);
    }

    private setPostions(element, glNode) {
        if (element) {
            element.set('position', {
                x: glNode.x - glNode.width / 2,
                y: glNode.y - glNode.height / 2
            });
        }

    }

    private getSizeForPaper() {
        let w = this.config.width;
        let h = this.config.height;
        if (this.config.fullSize === true) {
            let parentEl = $(this.control.nativeElement.parentElement.parentElement);
            if (this.config.parentSelector != '') {
                parentEl = $(this.config.parentSelector);
            }
            w = parentEl.width() - 15;
            h = parentEl.height() - 15;
            console.table({w: w, h: h});
        }

        return {w: w, h: h};
    }

    private getLink(opts = {}, type: LinkTypes) {
        return  new joint.dia.Link($.extend(true, this.getDefaultLinkOptions(type), opts));
    }

    private getDefaultLinkOptions(type: LinkTypes) {
        let defOpts = {};
        if (type == 'arrow') {
            defOpts = {
                router: {name: 'orthogonal', args: {step: 20}},
                connection: {name: 'normal'},
                attrs: {
                  '.marker-target': {d: 'M 15 -2 L 0 5 L 15 12 z', color: '#34495E', fill: '#34495E', stroke: '#34495E'},
                  '.link-tools .tool-remove circle, .marker-vertex': {r: 8},
                  '.connection': {
                    'stroke-width': 5,
                    stroke: '#34495E'
                  }
                }
              };
        } else if (type == 'line') {
            defOpts = {
                attrs: {
                '.connection': {
                  'stroke-width': 5,
                  stroke: '#34495E'
                },
                smooth: true
              }
            };
        }

        return defOpts;

    }


}
