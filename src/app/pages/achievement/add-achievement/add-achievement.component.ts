import { Component, OnInit, ViewEncapsulation, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { environment } from '../../../../environments/environment';
// Services
import { AchievementService } from '../../../providers/achievement/achievement.service';

@Component({
  selector: 'app-add-achievement',
  templateUrl: './add-achievement.component.html',
  styleUrls: ['./add-achievement.component.scss']
})
export class AddAchievementComponent implements OnInit {

  @ViewChild('uploader', { read: ElementRef }) fileInput: ElementRef;

	// File Upload
	options: UploaderOptions;
	uploadInput: EventEmitter<UploadInput>;
	achievementImage: any;
	imagePath: any;
	imageArr: any = [];

	// Data Assign

	artData: any;
	countryData: any;
  addachievementForm: FormGroup;
	throw_msg: any;
	submitted: boolean = false;
	msg_success: boolean = false;
	msg_danger: boolean = false;
	token: any;

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
			{ class: 'blog-descriptiondetail', name: 'Rajdhani sans-serif' },
		],
	}
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private achievementService: AchievementService

	) {
		this.uploadInput = new EventEmitter<UploadInput>();
		this.addachievementForm = this.formBuilder.group({
			name: ['', Validators.required],
			status: [true, Validators.required],
			description: ['', Validators.required],
			short_desc: [''],
			url_key: ['', Validators.required],
		});
		this.token = localStorage.getItem('token');
		this.imagePath = environment.baseUrl + '/public/';
	}

	public hasError = (controlName: string, errorName: string) => {
		return this.addachievementForm.controls[controlName].hasError(errorName);
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
		this.achievementService.getAchievementWithId(obj).subscribe(
			(response) => {
				if (response.code == 200) {
					let data = response?.result;
					this.achievementImage = data?.image;
					this.addachievementForm.patchValue({
						name: data?.name,
						status: data?.status,
						description: data?.description,
						short_desc: data?.short_desc,
						url_key: data?.url_key
					});
				} else {

				}
			},
		);
	}

	onSubmit() {
		this.submitted = true;
		let obj = this.addachievementForm.value;
		let id = this.id;
		obj['token'] = this.token;
		obj['image'] = this.achievementImage;
		if (this.addachievementForm.invalid) {
			return;
		}
		if (!this.isEdit) {
			this.achievementService.addAchievement(obj).subscribe(
				(response) => {
					if (response.code == 200) {
						this.throw_msg = response.message
						this.msg_success = true;
						setTimeout(() => {
							this.router.navigate(['/achievement/view']);
						}, 2000);
					}
					else if (response.code == 400) {
						this.throw_msg = response.message
						this.msg_danger = true;
					}
				},
			);
		}
		else {
			this.achievementService.editAchievementdata(obj, id).subscribe(
				(response) => {
					if (response.code == 200) {
						this.throw_msg = response.message
						this.msg_success = true;
						setTimeout(() => {
							this.router.navigate(['/achievement/view']);
						}, 2000);
					}
				},
			);
		}
	}

	onUploadOutput(output: UploadOutput, typeofImage): void {
		if (output.type === 'allAddedToQueue') {
			const event: UploadInput = {
				type: 'uploadAll',
				url: environment.baseUrl + '/api/achievement/addimage',
				method: 'POST',
				data: {},
			};
			this.uploadInput.emit(event);
		}
		else if (output.type === 'done' && typeof output.file !== 'undefined') {

			if (typeofImage == 'image') {
				this.achievementImage = output.file.response.result;
			} 
		}
	}

}
