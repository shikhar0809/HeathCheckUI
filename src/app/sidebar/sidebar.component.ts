import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProtoModel } from '../configurations/protomodel';
import { FileUploadService } from '../file-upload.service';
import { Observable, Subscription } from 'rxjs';

export interface DialogData {
  file: any;
  name: any;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  file: any;
  protoFile: String;
  //serviceTypeNames: String[] = [];
  servicePresent: any;
  fileUploaded = false;
  name: string;
  protoConfig: ProtoModel;
  packageName: string;
  serviceName: string;
  servicesRequested: Map<string, string>;
  serviceTypeNames: Map<string, string>;

  //services: Observable<boolean>;
  //currentDoc: string;
  private _servicesSub: Subscription;

  constructor(
    private fileUploadService: FileUploadService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // this.services = this.fileUploadService.serviceCheck;
    this._servicesSub = this.fileUploadService.serviceCheck.subscribe(data => this.servicePresent = data);
   }

  ngOnDestroy() {
    this._servicesSub.unsubscribe();
  }

  fileChanged(e) {
    this.file = e.target.files[0];
  }

  validateFile() {
    if (this.file.name.split('.').pop() === 'proto') {
      return true;
    } else {
      return false;
    }
  }

  uploadDocument(file) {
    const fileReader = new FileReader();
    if (this.validateFile()) {
      this.fileUploaded = true;
    }
    fileReader.onload = (e) => {
      this.servicePresent = null;
      this.serviceTypeNames = new Map();
      this.protoFile = fileReader.result.toString();
      this.protoParser();

      this.protoConfig = {
        fileName: this.file.name,
        serviceName: this.serviceName,
        packageName: this.packageName
      };

      this.fileUploadService.socketCheckService(
        this.file.name,
        this.packageName,
        this.serviceName,
      );
      /* .subscribe(data => {
        this.servicePresent = data;
      }) */

      /*  this.fileUploadService.checkServices(
      this.protoConfig
      ).subscribe(data => {
        this.servicePresent = data;
      }); */
    };

    fileReader.readAsText(this.file);
  }

  protoParser() {
    const line = this.protoFile.split('package ');
    const packagename = line[1].split(';');
    const service = this.protoFile.split('service ');
    const serviceName = service[1].split(' ');
    const serviceType = service[1].split('rpc ');
    for (let i = 1; i < serviceType.length; i++) {
      const n = serviceType[i].split('(')[0];
      if(serviceType[i].split('returns')[1].includes('stream') && serviceType[i].split('returns')[0].includes('stream')) {
        this.serviceTypeNames.set(n, 'Bi Directional Streaming');
      } else if (serviceType[i].split('returns')[1].includes('stream')) {
        this.serviceTypeNames.set(n, 'Serverside Streaming');
      } else if (serviceType[i].split('returns')[0].includes('stream')) {
        this.serviceTypeNames.set(n, 'Clientside Streaming');
      } else {
      this.serviceTypeNames.set(n, 'Unary Streaming');
      }
    }

    // this.serviceTypeNames.forEach((l) => this.servicePresent.push(`${l}`));

    this.packageName = packagename[0];
    this.serviceName = serviceName[0];
  }

  onSelectService(methodName, streamType) {
    this.protoConfig = {...this.protoConfig, methodName: methodName, streamType: streamType};
    this.fileUploadService.socketServiceRequest(
      this.file.name,
        this.packageName,
        this.serviceName,
        methodName,
        streamType
    );
    //this.servicesRequested.set(methodName, 'Service Not Present');
    console.log(this.protoConfig.methodName);
  }

  openDialog(): void {
    this.dialog.open(SidebarComponentDialog, {
      width: '800px',
      data: {
        file: this.protoFile,
        name: this.file.name
      },
    });
  }
}

@Component({
  selector: "dialog-overview-example-dialog",
  template: `<h1 mat-dialog-title>{{ data.name }}</h1>
    <div mat-dialog-content>{{ data.file }}</div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Close</button>
    </div>`,
})
export class SidebarComponentDialog {
  constructor(
    public dialogRef: MatDialogRef<SidebarComponentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
