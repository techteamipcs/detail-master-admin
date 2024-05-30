import { Component, OnInit, ViewEncapsulation, EventEmitter , ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl,AbstractControl} from '@angular/forms';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../../environments/environment';
// Services
import { PodcastcategoryService } from '../../../providers/podcastcategory/podcastcategory.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  @ViewChild('uploader', { read: ElementRef }) fileInput: ElementRef;
  // File Upload
  options: UploaderOptions;
  uploadInput: EventEmitter<UploadInput>;
  categoryImage:any;
  imagePath : any;
  
  // Data Assign

  addCategoryForm:FormGroup;
  throw_msg:any; 
  submitted: boolean = false;
  msg_success: boolean = false;
  msg_danger: boolean = false;
  categorytexist:any;

  // Edit Action Here
  applyAction: any;
  id:any;
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
      {class: 'career_box', name: 'Rajdhani sans-serif'},
    ],
  } 
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService:PodcastcategoryService,
    private toastr: ToastrManager
  )
  { 
    this.uploadInput = new EventEmitter<UploadInput>();
    this.addCategoryForm = this.formBuilder.group({
      name: ['',Validators.required],
      status: ['false',Validators.required],
      description: ['',Validators.required],
      url_key: ['',Validators.required]
     });
     this.imagePath = environment.baseUrl+'/public/';   
  }

  public hasError = (controlName: string, errorName: string) => { 
    return this.addCategoryForm.controls[controlName].hasError(errorName);
  };

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.isEdit) 
    {
      this.patchingdata(this.id);
      this.applyAction = 'Update';
    }
    else
    {
      this.applyAction = 'Add';
    }
  }

  patchingdata(id:any) { 
    let obj = {id:id};
    this.categoryService.getCategoryWithId(obj).subscribe(
      (response) => {
        if (response.code == 200) {
          let data = response?.result;
          this.categoryImage = data?.image;
          this.addCategoryForm.patchValue({
            name: data?.name,
            description: data?.description,
            status:data?.isDeleted, 
            url_key: data?.url_key
          });
       }else{
          
        }
      },
    );
  }

  onSubmit(){
    this.submitted = true;
    let obj = this.addCategoryForm.value;
    let id  = this.id;
    
    obj['image'] = this.categoryImage; 
    if (this.addCategoryForm.invalid){
      return;
    }
    
    if (!this.isEdit)
    {
      this.categoryService.addCategory(obj).subscribe(
        (response) => {
          if(response.code == 200) 
          { 
            // this.throw_msg   = response.message 
            // this.msg_success = true;
            this.toastr.successToastr(response.message);
            setTimeout(()=>{                           
              this.router.navigate(['/podcast-category/view']);
            },2000);
          } 
          else if(response.code == 400) 
          {    
              this.categorytexist  = response.message;
              // this.throw_msg  = response.message
              // this.msg_danger = true;
              this.toastr.errorToastr(response.message);
          } 
        },
      );

    }
    else
    {
      this.categoryService.editCategorydata(obj,id).subscribe(
        (response) => {
          if(response.code == 200) 
          {
            // this.throw_msg = response.message 
            // this.msg_success = true;
            this.toastr.successToastr(response.message);
            setTimeout(()=>{                           
                this.router.navigate(['/podcast-category/view']);
            },2000);  
          } else {
            this.toastr.errorToastr(response.message);
          } 
        },
      );
    }
  
  }


  onUploadOutput(output: UploadOutput): void { 
    if (output.type === 'allAddedToQueue')
    {
      const event: UploadInput = { 
        type: 'uploadAll', 
        url: environment.baseUrl+'/api/home/addimage',
        method: 'POST',
        data: {}, 
      };
      this.uploadInput.emit(event);
    } 
    else if(output.type === 'done' && typeof output.file !== 'undefined')
    {  
      this.categoryImage = output.file.response.result;
    }
  }

  onCancel(){
    this.router.navigate(['/author/view']);
  }

}
