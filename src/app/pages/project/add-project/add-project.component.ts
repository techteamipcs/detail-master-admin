import { Component, OnInit, ViewEncapsulation, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../../environments/environment';

// Services
import { AuthorService } from '../../../providers/author/author.service';
import { ProjectService } from '../../../providers/project/project.service';

@Component({
	selector: 'app-add-project',
	templateUrl: './add-project.component.html',
	styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {

	@ViewChild('uploader', { read: ElementRef }) fileInput: ElementRef;

	// File Upload
	options: UploaderOptions;
	uploadInput: EventEmitter<UploadInput>;
	authorImage: any;
	projectImage: any;
	designImage1: any;
	designImage2: any;
	designImage3: any;
	imagePath: any;

	// Data Assign

	addAuthorForm: FormGroup;
	addProjectForm: FormGroup;
	throw_msg: any;
	submitted: boolean = false;
	msg_success: boolean = false;
	msg_danger: boolean = false;

	// Edit Action Here
	applyAction: any;
	id: any;
	isEdit = this.route.snapshot.data.title === 'edit' ? true : false;
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

	categories = [
		{ id: 1, name: "Retail" },
		{ id: 2, name: "Commercial" },
		{ id: 3, name: "Residential" },
		{ id: 4, name: "Commercials" },
		{ id: 5, name: "Hospitality" },
		// { id: 6, name: "Hospital" },
		// { id: 7, name: "Industrial" },
		// { id: 8, name: "Miscellaneous & Architectural Metals"},
		// { id: 9, name: "Residential"},
		// { id: 10, name: "School Building" },
		// { id: 11, name: "Warehouse"}
	];

	selected = [{ id: 1, name: "Commercials" }];
	projectMultiImages: any = [];
	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private authorservice: AuthorService,
		private projectservice: ProjectService,
		private toastr: ToastrManager
	) {
		this.uploadInput = new EventEmitter<UploadInput>();
		this.addProjectForm = this.formBuilder.group({
			name: ['', [Validators.required, Validators.maxLength(255)]],
			desc: ['', Validators.required],
			category: ['', Validators.required],
			link: ['', Validators.required],
			scope: ['', Validators.required],
			location: ['', Validators.required],
			owner: ['', Validators.required],
			status: ['true', Validators.required],
			sequence_number:[''],
			url_key: ['', Validators.required],
		})
		this.imagePath = environment.baseUrl + '/public/';

	}

	public hasError = (controlName: string, errorName: string) => {
		return this.addProjectForm.controls[controlName].hasError(errorName);
	}

	ngOnInit(): void {
		this.id = this.route.snapshot.paramMap.get('id');
		if (this.isEdit) {
			// this.patchingdata(this.id);
			this.addData(this.id);
			this.applyAction = 'Update';
		}
		else {
			this.applyAction = 'Add';
		}
	}

	addData(id: any) {
		let obj = { _id: id };
		this.projectservice.getProjectById(obj).subscribe(
			(response) => {
				if (response.code == 200) {
					let data = response?.result;
					this.projectImage = data?.image;
					this.projectMultiImages = data?.project_images;
					this.designImage1 = data?.design_image_1;
					this.designImage2 = data?.design_image_2;
					this.designImage3 = data?.design_image_3;
					this.addProjectForm.patchValue({
						name: data?.name,
						desc: data?.desc,
						category: data?.category,
						link: data?.link,
						status: data?.status,
						sequence_number:data?.sequence_number,
						scope: data?.scope,
						owner: data?.owner,
						location: data?.location,
						url_key: data?.url_key
					})
				} else {

				}
			}
		)
	}


	onSubmit() {
		this.submitted = true;
		let obj = this.addProjectForm.value;
		let id = this.id;

		obj['design_image_1'] = this.designImage1;
		obj['design_image_2'] = this.designImage2;
		obj['design_image_3'] = this.designImage3;
		obj['image'] = this.projectImage;
		obj['project_images'] = this.projectMultiImages;
		if (this.addProjectForm.invalid) {
			return;
		}

		if (!this.isEdit) {
			this.projectservice.addProject(obj).subscribe(
				(response) => {
					if (response.code == 200) {
						this.throw_msg   = response.message
						this.msg_success = true;
						this.toastr.successToastr(response.message);
						setTimeout(() => {
							this.router.navigate(['/project/view']);
						}, 2000);
					}
					else if (response.code == 400) {
						this.throw_msg    = response.message;
						this.msg_danger = true;
						this.toastr.errorToastr(response.message);
					}
				},
			);

		}
		else {
			this.projectservice.editProjectdata(obj, id).subscribe(
				(response) => {
					if (response.code == 200) {
						this.throw_msg = response.message
						this.msg_success = true;
						this.toastr.successToastr(response.message);
						setTimeout(() => {
							this.router.navigate(['/project/view']);
						}, 2000);
					} else {
						this.throw_msg    = response.message;
						this.msg_danger = true;
						this.toastr.errorToastr(response.message);
					}
				},
			);
		}

	}


	onUploadOutput(output: UploadOutput): void {
		if (output.type === 'allAddedToQueue') {
			const event: UploadInput = {
				type: 'uploadAll',
				url: environment.baseUrl + '/api/project/addimage',
				method: 'POST',
				data: {},
			};
			this.uploadInput.emit(event);
		}
		else if (output.type === 'done' && typeof output.file !== 'undefined') {
			this.projectImage = output.file.response.result;

		}
	}

	onUploadOutputProjectImage(output: UploadOutput): void {
		if (output.type === 'allAddedToQueue') {
			const event: UploadInput = {
				type: 'uploadAll',
				url: environment.baseUrl + '/api/project/addimage',
				method: 'POST',
				data: {},
			};
			this.uploadInput.emit(event);
		}
		else if (output.type === 'done' && typeof output.file !== 'undefined') {
			this.projectMultiImages.push(output.file.response.result);
		}
	}

	onUploadOutputD1(output: UploadOutput): void {
		if (output.type === 'allAddedToQueue') {
			const event: UploadInput = {
				type: 'uploadAll',
				url: environment.baseUrl + '/api/project/addimage',
				method: 'POST',
				data: {},
			};
			this.uploadInput.emit(event);
		}
		else if (output.type === 'done' && typeof output.file !== 'undefined') {
			this.designImage1 = output.file.response.result;

		}
	}

	onUploadOutputD2(output: UploadOutput): void {
		if (output.type === 'allAddedToQueue') {
			const event: UploadInput = {
				type: 'uploadAll',
				url: environment.baseUrl + '/api/project/addimage',
				method: 'POST',
				data: {},
			};
			this.uploadInput.emit(event);
		}
		else if (output.type === 'done' && typeof output.file !== 'undefined') {
			this.designImage2 = output.file.response.result;

		}
	}

	onUploadOutputD3(output: UploadOutput): void {
		if (output.type === 'allAddedToQueue') {
			const event: UploadInput = {
				type: 'uploadAll',
				url: environment.baseUrl + '/api/project/addimage',
				method: 'POST',
				data: {},
			};
			this.uploadInput.emit(event);
		}
		else if (output.type === 'done' && typeof output.file !== 'undefined') {
			this.designImage3 = output.file.response.result;

		}
	}
	onCancel() {
		this.router.navigate(['/project/view']);
	}

	removeD1Image(index) {
		if (confirm("Are you sure to delete this image")) {
			this.designImage1 = "";
		}
	}
	removeD2Image(index) {
		if (confirm("Are you sure to delete this image")) {
			this.designImage2 = "";
		}
	}
	removeD3Image(index) {
		if (confirm("Are you sure to delete this image")) {
			this.designImage3 = "";
		}
	}
	removeImage(index) {
		if (confirm("Are you sure to delete this image")) {
			this.projectImage = "";
		}
	}

	removeImageHover(index) {
		if (confirm("Are you sure to delete this image")) {
			this.projectMultiImages.splice(index,1)
		}
	}

}
