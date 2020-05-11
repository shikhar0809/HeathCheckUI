import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FileUploadService } from "../file-upload.service";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { Subscription } from "rxjs";

export interface GridDialog {
  request: any;
  response: any;
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  @ViewChild(SidebarComponent) sidebarChild;
  str: string;
  result: any[];
  servicesRequested: Map<any, any>;
  rowData: GridDialog[] = [];
  _servicesSub: Subscription;
  constructor(
    private fileUploadService: FileUploadService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // this.services = this.fileUploadService.serviceCheck;
    this._servicesSub = this.fileUploadService.msgResponse.subscribe((data) => {
      this.result.push(data.body);
      this.rowData.push({
        request: JSON.parse(JSON.stringify(data.request)),
        response: this.result,
      });
    });
    console.log(this.result);
  }

  ngOnDestroy() {
    this._servicesSub.unsubscribe();
  }

  onJsonRequest(params) {
    this.result = [];
    let streamType: string = this.sidebarChild.protoConfig.streamType;
    const msgObj = params;
    const msgObjStr = JSON.stringify(msgObj);

    if (streamType === "Unary Streaming") {
      this.fileUploadService.socketMsgRequest(JSON.parse(msgObj));
      console.log(streamType);
      /* this.fileUploadService
        .msgRequest(JSON.parse(msgObj))
        .subscribe((data) => {
          this.result = JSON.stringify(data['body']);
          console.log(streamType);
          console.log(this.result);
          // this.servicesRequested.set(params, this.result);
          this.rowData = { request: params, response: this.result };
        }); */
    } else if (streamType === "Serverside streaming") {
      this.fileUploadService.socketMsgRequest(JSON.parse(msgObj));
    } else {
      this.fileUploadService.socketMsgRequest(JSON.parse(msgObj));
    }
    console.log(this.result);
  }

  /* getProtoResponse() {
    this.fileUploadService.msgRequest( ).subscribe(data => {
      this.result = {...data};
    });
  } */
  openDialog(): void {
    this.dialog.open(HomeComponentDialog, {
      width: "auto",
      data: { rowData: this.rowData },
    });
  }
}

@Component({
  selector: "app-home-component-dialog",
  template: `<table
    mat-table
    [dataSource]="dataSource"
    class="mat-elevation-z8"
  >
    <ng-container matColumnDef="request">
      <th mat-header-cell *matHeaderCellDef>Request</th>
      <td mat-cell *matCellDef="let element">{{ element.request }}</td>
    </ng-container>

    <ng-container matColumnDef="response">
      <th mat-header-cell *matHeaderCellDef>Response</th>
      <td mat-cell *matCellDef="let element">{{ element.response }}</td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
  </table>`,
})
export class HomeComponentDialog {
  /* columnDefs = [
    { headerName: 'Requests', field: 'request' },
    { headerName: 'Response', field: 'response' },
  ]; */
  displayedColumns: string[] = ["request", "response"];
  dataSource = this.data.rowData;

  /* columnDefs = [
    {field: 'make' },
    {field: 'model' },
    {field: 'price'}
];

rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 }
]; */

  constructor(
    public dialogRef: MatDialogRef<HomeComponentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
