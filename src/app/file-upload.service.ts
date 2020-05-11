import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { ProtoModel } from './configurations/protomodel';

@Injectable({
  providedIn: 'root'
})

export class FileUploadService {
  serverUrl = 'http://localhost:3000';

  serviceCheck = this.socket.fromEvent<boolean>('serviceCheck');
  msgResponse = this.socket.fromEvent<any>('msgResponse');

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private socket: Socket) { }

  socketCheckService( fileName: string, packageName: string, serviceName: string ) {
    this.socket.emit('checkService', { fileName, packageName, serviceName });
  }

  socketServiceRequest(fileName: string, packageName: string, serviceName: string, methodName: string, streamType: string) {
    this.socket.emit('protoConfig', {fileName, packageName, serviceName, methodName, streamType});
  }

  socketMsgRequest(jsonMsg: any) {
    this.socket.emit('msgBody', {jsonMsg});
  }

  checkServices(protoConfig: ProtoModel ) {
    return this.http.post(this.serverUrl + '/checkService', protoConfig);
  }

  serviceRequest(protoConfig: ProtoModel) {
    return this.http.post(this.serverUrl + '/protoConfig', protoConfig)
    .subscribe(next => console.log(next));
  }

  msgRequest(jsonMsg: any): Observable<any> {
    return this.http.post<any>(this.serverUrl + '/msgBody', {jsonMsg});
  }

  /* getProtoResult (): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/protoResult');
  } */

  /* private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  } */
}
