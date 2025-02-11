import { Component, OnInit, ViewEncapsulation, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';

// Services
import { BannerService } from '../../../providers/banner/banner.service';
import { MediaService } from '../../../providers/media/media.service';
import { ResponseService } from '../../../providers/response/response.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
	selector: 'app-add-banner',
	templateUrl: './add-banner.component.html',
	styleUrls: ['./add-banner.component.scss']
})
export class AddBannerComponent implements OnInit {
	@ViewChild('uploader', { read: ElementRef }) fileInput: ElementRef;
	// File Upload
	options: UploaderOptions;
	uploadInput: EventEmitter<UploadInput>;
	selectedFile: any;
	bannerImage: any;
	bannerImage2: any;
	bannerVideo: any;
	imagePath: any;
	imageArr: any = [];
	// Data Assign
	artData: any;
	countryData: any;
	addbannerForm: FormGroup;
	throw_msg: any;
	submitted: boolean = false;
	msg_success: boolean = false;
	msg_danger: boolean = false;
	token: any;
	// Edit Action Here
	applyAction: any;
	id: any;
	isEdit = this.route.snapshot.data.title === 'edit' ? true : false;
	mediaData: any;
	images: any = [];
	closeResult: any = '';
	addmediaForm: FormGroup;
	submittedMedia: boolean = false;
	fileFormat: any;
	temp_sequence_number = 0;
	mediaFile: any;
	isUploaded: boolean = false;
	url: any;
	isMediaDeleted = false;
	deletedMediaData: any;
	isMediaFileDeleted = false;
	deletedMediaFile: any = [];
	isMediaEdit = false;
	mediaID: any;
	bannerData: any;
	editorConfig: AngularEditorConfig = {
		editable: true,
		spellcheck: true,
		height: 'auto',
		minHeight: '200px',
		maxHeight: 'auto',
		width: 'auto',
		minWidth: '0',
		translate: 'yes',
		enableToolbar: true,
		showToolbar: true,
		placeholder: 'Enter text here...',
		defaultParagraphSeparator: '',
		defaultFontName: '',
		defaultFontSize: '',

	}
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private bannerService: BannerService,
		// private modalService: NgbModal,
		// private mediaService: MediaService,
		private toastr: ToastrManager,
		public responseService: ResponseService
	) {
		this.uploadInput = new EventEmitter<UploadInput>();
		this.options = { concurrency: 0, allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'] };
		this.addbannerForm = this.formBuilder.group({
			name: ['', Validators.required],
			name2: [''],
			name3: [''],
			pagelist: ['', Validators.required],
			status: [true, Validators.required],
			description: [''],
			short_desc: ['']
		});
		this.token = localStorage.getItem('token');
		this.imagePath = environment.baseUrl + '/public/banner/';
		// this.url = environment.Url + '/assets';
	}

	public hasError = (controlName: string, errorName: string) => {
		return this.addbannerForm.controls[controlName].hasError(errorName);
	};

	ngOnInit(): void {
		this.id = this.route.snapshot.paramMap.get('id');
		if (this.isEdit) {
			this.patchingdata(this.id);
			this.applyAction = 'Update';
		}
		else {
			this.applyAction = 'Add';
		}
	}

	patchingdata(id: any) {
		let obj = { id: id };
		this.bannerService.getBannerWithId(obj).subscribe(
			(response) => {
				if (response.code == 200) {
					let data = response?.result;
					this.bannerData = response.result;
					this.bannerImage = data?.image;
					this.bannerImage2 = data?.image_2;
					this.mediaData = data?.media_data[0];
					this.addbannerForm.patchValue({
						name: data?.name,
						name2: data?.name2,
						name3: data?.name3,
						status: data?.status,
						pagelist: data?.pagelist,
						description: data?.description,
						short_desc: data?.short_desc
					});
				} else {

				}
			},
		);
	}

	onSubmit() {
		this.submitted = true;
		let obj = this.addbannerForm.value;
		let id = this.id;
		obj['token'] = this.token;
		if (this.addbannerForm.invalid) {
			return;
		}
		obj['image'] = this.bannerImage;
		obj['image_2'] = this.bannerImage2;
		if (!this.isEdit) {
			this.bannerService.addBanner(obj).subscribe(
				(response) => {
					if (response.code == 200) {
						this.throw_msg = response.message
						this.msg_success = true;
						this.isUploaded = true;
						setTimeout(() => {
							this.router.navigate(['/banner-images/view']);
						}, 2000);
					}
					else {
						this.throw_msg = response.message
						this.msg_danger = true;
						this.CreateErrorResponse(response);
					}
				},
			);
		}
		else {
			this.bannerService.editBannerdata(obj, id).subscribe(
				(response) => {
					if (response.code == 200) {
						this.throw_msg = response.message
						this.msg_success = true;
						this.isUploaded = true;
						setTimeout(() => {
							this.router.navigate(['/banner-images/view']);
						}, 2000);
					} else {
						this.CreateErrorResponse(response);
					}
				},
			);
		}
	}

	onCancel() {
		this.router.navigate(['/banner/view']);
	}

	onUploadImage(output: UploadOutput): void {
		this.selectedFile = output;

		if (output.type === 'allAddedToQueue') {
			const event: UploadInput = {
				type: 'uploadAll',
				url: `${environment.baseUrl}/api/banner/addimage`,
				method: 'POST',
				data: {},
			};
			this.uploadInput.emit(event);
		} else if (output.type === 'done' && output.file) {
			const { response } = output.file;
			this.bannerImage = response.result;
			this.throw_msg = response.message;
			this.msg_success = true;
		}
	}

	onUploadImage2(output: UploadOutput): void {
		this.selectedFile = output;

		if (output.type === 'allAddedToQueue') {
			const event: UploadInput = {
				type: 'uploadAll',
				url: `${environment.baseUrl}/api/banner/addimage`,
				method: 'POST',
				data: {},
			};
			this.uploadInput.emit(event);
		} else if (output.type === 'done' && output.file) {
			const { response } = output.file;
			this.bannerImage2 = response.result;
			this.throw_msg = response.message;
			this.msg_success = true;
		}
	}



	CreateErrorResponse(responseData) {
		if (responseData) {
			let obj = {
				model: 'Category',
				request: responseData,
				errorCode: 400,
				error: responseData.error,
				status: responseData.status,
				massage: responseData.massage
			};
			if (this.isEdit) {
				obj['log_type'] = 'Update';
			} else {
				obj['log_type'] = 'Add';
			}
			this.responseService.addErrorResponse(obj).subscribe(
				(response) => {
					if (response.code == 200) {
						console.log('logs updated');
					}
					else {
					}
				},
			);
		}
	}
}
