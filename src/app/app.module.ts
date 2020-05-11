import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent, SidebarComponentDialog } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { MatToolbarModule, MatSidenavModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatButtonModule, MatTableModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent, HomeComponentDialog } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { RequestResponseGridComponent } from './request-response-grid/request-response-grid.component';
import { AgGridModule } from 'ag-grid-angular';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:4444', options: {}};

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    HomeComponent,
    SidebarComponentDialog,
    RequestResponseGridComponent,
    HomeComponentDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    FlexLayoutModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    AgGridModule.withComponents([]),
    MatTableModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  entryComponents: [
    SidebarComponentDialog,
    HomeComponentDialog
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
