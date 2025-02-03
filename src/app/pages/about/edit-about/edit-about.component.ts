import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrManager } from 'ng6-toastr-notifications';
import { UploadInput, UploadOutput } from 'ngx-uploader';
import { AboutService } from 'src/app/providers/about/about.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-edit-about',
	templateUrl: './edit-about.component.html',
	styleUrls: ['./edit-about.component.scss']
})
export class EditAboutComponent implements OnInit {

	// form variables
	addForm: FormGroup;
	throw_msg: any;
	submitted: boolean = false;
	msg_success: boolean = false;
	msg_danger: boolean = false;
	token: any;

	// Image Variables
	uploadInput: EventEmitter<UploadInput>;
	selectedFile: any;
	imageDataBanner: any;
	imageDataDesc: any;
	imagePath: any;

	// Edit Action Here
	applyAction: any;
	id: any;
	AboutData: any;
	isEdit = this.route.snapshot.data.title === 'edit' ? true : false;

	// pagination
	currentPage: number = 1;
	initialized: boolean = false;
	currentLimit: number = 10;
	totalRecord: number = 0;

	//Angular Editor Config
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
		fonts: [
			{ class: 'career_box', name: 'Rajdhani sans-serif' },
		],
	}
	//
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private aboutService: AboutService,
		private formBuilder: FormBuilder,
		private toastr: ToastrManager
	) {
		this.addForm = this.formBuilder.group({
			title_sign: ['', Validators.required],
			title_name: ['', Validators.required],
			desc_short: ['', Validators.required],
			desc_long: ['', Validators.required],
			video_url: ['', Validators.required],
			page_section: ['', Validators.required],
			video_desc: [''],
			image_banner: [''],
			image_desc: [''],
			status: [true, Validators.required],
		});
		this.uploadInput = new EventEmitter<UploadInput>();
		this.token = localStorage.getItem('detailmaster-admin-token');
		this.imagePath = environment.baseUrl + '/public/';
	}

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
		this.aboutService.getAboutWithId(obj).subscribe(
			(response) => {
				if (response.code == 200) {
					let data = response?.result;
					// this.addForm = response.result;
					this.imageDataBanner = data?.image_banner;
					this.imageDataDesc = data?.image_desc;
					this.addForm.patchValue({
						title_sign: data?.title_sign,
						title_name: data?.title_name,
						desc_short: data?.desc_short,
						desc_long: data?.desc_long,
						video_url: data?.video_url,
						video_desc: data?.video_desc,
						page_section: data?.page_section,
						status: data?.status,
					});
					window.scroll(0, 0);
				} else {
					this.msg_danger = true;
				}
			},
		);
	}


	onSubmit() {
		this.submitted = true;
		let obj = this.addForm.value;
		let id = this.id;
		obj['token'] = this.token;
		if (this.addForm.invalid) {
			return;
		}
		obj['image_banner'] = this.imageDataBanner;
		obj['image_desc'] = this.imageDataDesc;

		if (!this.isEdit) {
			this.aboutService.addAboutData(obj).subscribe(
				(response) => {
					if (response.code == 200) {
						this.throw_msg = response.message
						this.msg_success = true;
						this.toastr.successToastr("Created Succuessfully")

						setTimeout(() => {
							this.router.navigate(['/about/view']);
						}, 2000);
					}
					else {
						this.throw_msg = response.message
						this.msg_danger = true;

					}
				},
			);
		}
		else {
			this.aboutService.editaboutdata(obj, id).subscribe(
				(response) => {
					if (response.code == 200) {
						// this.throw_msg = response.message
						// this.msg_success = true;
						this.toastr.successToastr("Updated Succuessfully")
						setTimeout(() => {
							this.router.navigate(['/about/view']);
						}, 2000);
					} else {
						this.toastr.errorToastr(response.message);
						// this.throw_msg = response.message
						// this.msg_danger = true;
					}
				},
			);
		}
	}

	onUploadFile(output: UploadOutput): void {
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
			this.imageDataBanner = output.file.response.result;
			this.throw_msg = output.file.response.message;
			this.msg_success = true;
		}
	}

	onUploadFile2(output: UploadOutput): void {
		this.selectedFile = output;

		// If all files are added to the queue
		if (output.type === 'allAddedToQueue') {
			const event: UploadInput = {
				type: 'uploadAll',
				url: environment.baseUrl + '/api/about/addimage',
				method: 'POST',
				data: {}, // You can pass any additional data here if needed
			};
			this.uploadInput.emit(event);
		}

		// If a file upload is done
		else if (output.type === 'done' && typeof output.file !== 'undefined') {
			if (output.file.name.includes('image_banner')) {
				// Handle banner image
				this.imageDataBanner = output.file.response.result;
			} else {
				// Handle description image
				this.imageDataDesc = output.file.response.result;
			}

			// Set messages for both image types
			this.throw_msg = output.file.response.message;
			this.msg_success = true;
		}
	}


	public hasError = (controlName: string, errorName: string) => {
		return this.addForm.controls[controlName].hasError(errorName);
	};

	onCancel() {
		this.router.navigate(['/about']);
	}
}
