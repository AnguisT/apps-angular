/**
 * Created by Sergey Trizna on 23.05.2017.
 */
import {Component, ViewChild, ViewEncapsulation} from '@angular/core';


@Component({
    selector: 'demo-joint',
    templateUrl: './tpl/joint.html',
    styleUrls: [
        'styles/joint.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class DemoJointComponent {
    @ViewChild('demoJoint') joint;

    ngAfterViewInit() {
        let m1 = this.joint.addModel(['inPort11'], ['outPort11', 'outPort12', 'outPort13', 'outPort14', 'outPort15', 'outPort1N']);
        let m2 = this.joint.addModel(['inPort21'], ['outPort21', 'outPort22', 'outPort23', 'outPort24', 'outPort25', 'outPort2N']);
        let m3 = this.joint.addModel(['inPort31'], ['outPort1', 'outPort2', 'outPort3', 'outPort5', 'outPort5', 'outPortN']);
        let m4 = this.joint.addModel(['inPort41'], ['outPort1', 'outPort2', 'outPort3', 'outPort5', 'outPort5', 'outPortN']);
        let d = this.joint.addDecision();
        this.joint.connect(m1, 'outPort12', d, 'in');
        // this.joint.connect(m1, 'outPort11', m4, 'outPortN');

        this.joint.drawAll();
        //
    }
}
