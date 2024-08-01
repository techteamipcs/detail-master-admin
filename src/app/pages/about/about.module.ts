import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule,HttpResponse } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUploaderModule } from 'ngx-uploader';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PageModule } from '../page/page.module';
import { BlogModule } from '../blog/blog.module';// search module
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';



@NgModule({
  declarations: [
    AboutComponent
  ],
  imports: [
    AboutRoutingModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUploaderModule,
    AngularEditorModule,
    PageModule,
    BlogModule,
    NgxQrcodeStylingModule
  ],
  
})
export class AboutModule { }
