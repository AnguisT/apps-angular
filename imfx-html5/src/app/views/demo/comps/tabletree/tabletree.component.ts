import {Component} from '@angular/core';
import 'style-loader!ag-grid/dist/styles/ag-grid.css'
import 'style-loader!ag-grid/dist/styles/theme-fresh.css'
import {IMFXGrid} from "../../../../modules/controls/grid/grid";

@Component({
    selector: 'demo-table-tree',
    templateUrl: './tpl/index.html',
    styleUrls: [
        './styles/styles.scss'
    ],
    entryComponents: [
      IMFXGrid
    ]
})

export class DemoTableTreeComponent {

    private groupKeys = ['Region', 'Country', 'City', 'Area'];
    private rowData = [
        {group: 'Group A',
            participants: [
                {athlete: 'Michael Phelps', year: '2008', country: 'United States'},
                {athlete: 'Michael Phelps', year: '2008', country: 'United States'},
                {athlete: 'Michael Phelps', year: '2008', country: 'United States'}
            ]},
        {group: 'Group B', athlete: 'Sausage', year: 'Spaceman', country: 'Winklepicker',
            participants: [
                {athlete: 'Natalie Coughlin', year: '2008', country: 'United States'},
                {athlete: 'Missy Franklin ', year: '2012', country: 'United States'},
                {athlete: 'Ole Einar Qjorndalen', year: '2002', country: 'Norway'},
                {athlete: 'Marit Bjorgen', year: '2010', country: 'Norway'},
                {athlete: 'Ian Thorpe', year: '2000', country: 'Australia'}
            ]},
        {group: 'Group C',
            participants: [
                {athlete: 'Janica Kostelic', year: '2002', country: 'Crotia'},
                {athlete: 'An Hyeon-Su', year: '2006', country: 'South Korea', }
            ]}
    ];

    private columnDefs = [    {headerName: "Group", cellRenderer: 'group'},
        {headerName: "Athlete", field: "athlete"},
        {headerName: "Year", field: "year"},
        {headerName: "Country", field: "country"}
    ];
    private gridOptions = {
        columnDefs: this.columnDefs,
        rowData: this.rowData,
        debug: true,
        rowHeight: "22",
        rowSelection: "multiple",
        getNodeChildDetails: this.getNodeChildDetails,
        // onGridReady: function(params) {
        //     params.api.sizeColumnsToFit();
        // }

    };

    private getChilds(row) {
        let resp = [];
        let self = this;
        if(row.participants) {
            row.participants.forEach(function (pr) {
               resp.push(self.getChilds(pr));
            })
        } else {
            resp.push(row.participants)
        }

        return resp;
    }

    private getNodeChildDetails(rowItem) {
        if (rowItem.group) {
            return {
                group: true,
                // open C be default
                expanded: rowItem.group === 'Group C',
                // provide ag-Grid with the children of this group
                // children: self.getChilds(rowItem),
                // children: [
                //     {
                //         //
                //         participants: [
                //             {athlete: 'Janica Kostelic', year: '2002', country: 'Crotia'},
                //             {athlete: 'An Hyeon-Su', year: '2006', country: 'South Korea', participants: [
                //                 {athlete: 'Janica Kostelic', year: '2002', country: 'Crotia'},
                //                 {athlete: 'An Hyeon-Su', year: '2006', country: 'South Korea',  }
                //             ] }
                //         ]
                //     }
                // ],
                children: rowItem.participants,
                // this is not used, however it is available to the cellRenderers,
                // if you provide a custom cellRenderer, you might use it. it's more
                // relavent if you are doing multi levels of groupings, not just one
                // as in this example.
                field: 'group',
                // the key is used by the default group cellRenderer
                key: rowItem.group
            };
        } else {
            return null;
        }
    }
}
