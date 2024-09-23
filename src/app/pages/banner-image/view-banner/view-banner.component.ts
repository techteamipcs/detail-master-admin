import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { from } from 'rxjs';
import { BannerService } from '../../../providers/banner/banner.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { MediaService } from '../../../providers/media/media.service';

@Component({
  selector: 'app-view-banner',
  templateUrl: './view-banner.component.html',
  styleUrls: ['./view-banner.component.scss']
})
export class ViewBannerComponent implements OnInit {


	msg_danger: boolean = false;
	BannerData: any;
	imagePath: any;
	token: any;
	VendorData: any;
	vendorid: any = '';
  isactive :any ;
	// pagination
	currentPage: number = 1;
	initialized: boolean = false;
	currentLimit: number = 10;
	totalRecord: number = 0;
	selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
	searchText = '';
  closeResult = '';
  modalReference = null;
  selectedBanner : any;
	config = {
    value: true,
    name: '',
    disabled: false,
    height: 25,
    width: 90,
    margin: 3,
    fontSize: 10,
    speed: 300,
    color: {
      checked: '#36aef5',
      unchecked: '#423f3f',
    },
    switchColor: {
      checked: '#3366FF',
      unchecked: 'crimson',
    },
    labels: {
      unchecked: 'Deactive',
      checked: 'Active',
    },
    checkedLabel: '',
    uncheckedLabel: '',
    fontColor: {
      checked: '#fafafa',
      unchecked: '#ffffff',
    },
  };

	constructor(
		private router: Router,
		// private loginService: LoginService,
		private toastr: ToastrManager,
    private bannerservice:BannerService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private mediaService: MediaService,
	) {
		this.imagePath = environment.baseUrl + '/public/banner/';
		this.token = localStorage.getItem('token');
	}

	ngOnInit(): void {
		this.get_BannerData();
    this.config.switchColor.checked = '#dcdcdc';
    this.config.color.checked = '#dcdcdc';
    this.config.labels.checked = 'Change';
    this.isactive = 'none';
	}

	get_BannerData() {
		const obj = {
			limit: this.currentLimit,
			page: this.currentPage,
			vendor_id: this.vendorid,
			token: this.token,
		};
		this.bannerservice.getBannerDetails(obj).subscribe(
			(response) => {
				if (response.code == 200) {
					if (response.result != null && response.result != '') {
						this.BannerData = response.result;
						this.totalRecord = response?.count;
					}
					else {
						this.msg_danger = true;
					}

				}
			},
		);
	}

	changeVendorList(event: any) {
		this.vendorid = event.currentTarget.value;
		this.get_BannerData();
	}

	onListChangePage(event: any) {
		this.currentPage = event;
		this.get_BannerData();
	}

	selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  importBanner()
  {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;
        this.bannerservice.importallBanner(this.currentFile).subscribe(
            (response)=> {
              if (response.code == 200)
              {
                console.log('file uploaded sucessfully');
                this.toastr.successToastr("banner Image Imported sucessfully");
                setTimeout(()=>{
                  window.location.reload();
                },2000);
                this.selectedFiles;

              } else {
                this.toastr.errorToastr(response.message);
              }
            },
          );
      }
    }
  }

  exportBanner()
  {
    if(confirm("Are you sure to Export this Banner"))
    {
      var obj = {};
      this.bannerservice.exportBanner(obj).subscribe(
        (response)=> {
          if (response)
          {
            if(response.filepath){
              window.location.href = response.filepath;
            }
          }
        },
      );
    }
  }

	deleteAllBanners()
  {
    if(confirm("Are you sure to delete All Banners"))
    {
      var mylist = {};
      this.bannerservice.deleteallbanners(mylist).subscribe(
        (response)=> {
          if (response.code == 200)
          {
            this.get_BannerData();
						this.toastr.successToastr(response.message);
            this.modalService.dismissAll();
          }
        },
      );
    }
  }


	searchBanner(){
    if(this.searchText){
      this.currentLimit = 1000;
      this.currentPage = 1;
    } else {
      this.currentLimit = 10;
    }
    this.get_BannerData();
  }

  open(content,data) {
    this.selectedBanner = data;
		this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

  closeModal(){
    this.activeModal.close();
  }


  deleteBanner() {
		if (this.selectedBanner) {
			var mylist = { id: this.selectedBanner._id };
			this.bannerservice.deletebanner(mylist).subscribe(
				(response) => {
					if (response.code == 200) {
						this.get_BannerData();
            this.deleteMediaData();
            this.modalService.dismissAll();
					}
				},
			);
		}
	}

	changeStatus(){
    if(this.isactive != 'none'){
      this.config.switchColor.checked = '#ffffff';
      this.config.color.checked = 'green';
      this.config.labels.checked = 'Active';
    } else {
      if(this.isactive){
        this.isactive = false;
        this.config.switchColor.unchecked = 'crimson';
        this.config.color.unchecked = '#423f3f';
        this.config.labels.unchecked = 'Deactive';
      } else {
        this.isactive = true;

      }
    }
	}

  resetFilter(){
		this.config.switchColor.checked = '#dcdcdc';
    this.config.color.checked = '#dcdcdc';
    this.config.labels.checked = 'Change';
    this.config.switchColor.unchecked = '#dcdcdc';
    this.config.color.unchecked = '#dcdcdc';
    this.config.labels.unchecked = 'Change';
    this.isactive = 'none';
	}

  deleteMediaFile(){
    let obj = {	};
    if(this.selectedBanner.media_data && this.selectedBanner.media_data.length > 0){
    obj['file'] =  this.selectedBanner.media_data[0].src;
		this.bannerservice.deletefile(obj).subscribe(
			(response) => {
				if (response.code == 200) {
				}
				else {
					// this.bannerVideo = this.bannerVideo;
				}
			},
		);
    }
	}

  deleteMediaData() {
		if (this.selectedBanner.media_data && this.selectedBanner.media_data.length > 0) {
			var mylist = { id: this.selectedBanner.media_data[0]._id, file: this.selectedBanner.media_data[0].src };
			this.bannerservice.deleteMediaData(mylist).subscribe(
				(response) => {
					if (response.code == 200) {
						this.modalService.dismissAll();
					}
				},
			);
		}
	}

}
