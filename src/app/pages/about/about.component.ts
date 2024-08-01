import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment } from '../../../environments/environment';

// Services
import { from } from 'rxjs';
import { AboutService } from '../../providers/about/about.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxQrcodeStylingComponent, NgxQrcodeStylingService } from 'ngx-qrcode-styling';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  @ViewChild('uploader', { read: ElementRef }) fileInput: ElementRef;

  // File Upload
  options: UploaderOptions;
  uploadInput: EventEmitter<UploadInput>;
  image_banner: any = [];
  image_desc: any = [];
  imagePath: any;
  imageArr: any = [];

  // Data Assign
  addaboutForm: FormGroup;
  throw_msg: any;
  submitted: boolean = false;
  msg_success: boolean = false;
  msg_danger: boolean = false;
  token: any;

  // Edit Action Here
  id: any;
  AboutData: any;

  // pagination
  currentPage: number = 1;
  initialized: boolean = false;
  currentLimit: number = 10;
  totalRecord: number = 0;
  extension = 'svg';
  qrCode = null;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  QRcodeImage: any = '';
  qrcodeurl: any = 'http://makemycard.online/';
  @ViewChild('qrcode', { static: true }) qrcode: ElementRef;
  isUpdate: any = false;
  user: any;
  document: any;
  selectedFile: any;
  constructor(
    private router: Router,
    private aboutService: AboutService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrManager,
    private testDI: NgxQrcodeStylingService
  ) {
    this.uploadInput = new EventEmitter<UploadInput>();
    this.addaboutForm = this.formBuilder.group({
      title_sign: ['', Validators.required],
      title_name: ['', Validators.required],
      desc_short: ['', Validators.required],
      desc_long: ['', Validators.required],
      video_url: ['', Validators.required],
      video_desc: ['', Validators.required],
      image_banner: [''],
      image_desc: [''],
      status: ['false', Validators.required],
    });

    this.token = localStorage.getItem('drminnie-admin-token');
    this.imagePath = environment.baseUrl + '/public/';
    let tempuser = localStorage.getItem('user');
    this.user = JSON.parse(tempuser);
  }

  ngOnInit(): void {
    this.get_AboutData();
  }

  get_AboutData() {
    const obj = {
      limit: this.currentLimit,
      page: this.currentPage,
      token: this.token,
    };
    this.aboutService.getaboutDetails(obj).subscribe(
      (response) => {
        if (response.code == 200) {
          if (response.result != null && response.result != '') {
            this.AboutData = response.result;
            this.totalRecord = response?.count;
            let data = this.AboutData[0];

            this.image_banner = data?.image_banner;
            this.image_desc = data?.image_desc;

            this.addaboutForm.patchValue({
              title_sign: data?.title_sign,
              title_name: data?.title_name,
              desc_short: data?.desc_short,
              desc_long: data?.desc_long,
              video_url: data?.video_url,
              video_desc: data?.video_desc,
              status: data?.status,
            });
            window.scroll(0, 0);
          }
          else {
            this.msg_danger = true;
          }

        }
      },
    );
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.addaboutForm.controls[controlName].hasError(errorName);
  };

  onSubmit() {
    this.submitted = true;
    let obj = this.addaboutForm.value;
    let id = this.AboutData[0]._id;
    obj['drminnie-admin-token'] = this.token;
    obj['image_banner'] = this.image_banner;
    obj['image_desc'] = this.image_desc;

    if (this.addaboutForm.invalid) {
      return;
    }
    this.aboutService.editaboutdata(obj, id).subscribe(
      (response) => {
        if (response.code == 200) {
          this.throw_msg = response.message
          this.msg_success = true;
          setTimeout(() => {
            this.router.navigate(['/about']);
            this.toastr.successToastr(response.message);
          }, 2000);
        } else {
          this.toastr.errorToastr(response.message);
        }
      },
    );
  }



  onUploadFileBanner(output: UploadOutput): void {
    this.selectedFile = output;
    if (output.type === 'allAddedToQueue') {
      const event: UploadInput = {
        type: 'uploadAll',
        url: environment.baseUrl + '/api/about/addimage',
        method: 'POST',
        data: {},
      };
      this.uploadInput.emit(event);
    }
    else if (output.type === 'done' && typeof output.file !== 'undefined') {
      this.image_banner = output.file.response.result;
      this.throw_msg = output.file.response.message;
      this.msg_success = true;
    }
  }

  onUploadFileDesc(output: UploadOutput): void {
    this.selectedFile = output;
    if (output.type === 'allAddedToQueue') {
      const event: UploadInput = {
        type: 'uploadAll',
        url: environment.baseUrl + '/api/about/addimage',
        method: 'POST',
        data: {},
      };
      this.uploadInput.emit(event);
    }
    else if (output.type === 'done' && typeof output.file !== 'undefined') {
      this.image_desc = output.file.response.result;
      this.throw_msg = output.file.response.message;
      this.msg_success = true;
    }
  }



}