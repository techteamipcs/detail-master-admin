import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment'

// Services
import { from } from 'rxjs';
import { ProjectService } from '../../../providers/project/project.service';

@Component({
	selector: 'app-view-project',
	templateUrl: './view-project.component.html',
	styleUrls: ['./view-project.component.scss']
})
export class ViewProjectComponent implements OnInit {

	msg_danger: boolean = false;
	authorData: any;
	imagePath: any;
	projectData: any;

	// pagination
	currentPage: number = 1;
	initialized: boolean = false;
	currentLimit: number = 10;
	totalRecord: number = 0;
	searchText = '';
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
  isactive :any ;
	constructor(
		private router: Router,
		private projectservice: ProjectService
	) {
		this.imagePath = environment.baseUrl + '/public/';
		this.config.switchColor.checked = '#dcdcdc';
    this.config.color.checked = '#dcdcdc';
    this.config.labels.checked = 'Change';
    this.isactive = 'none';
	}

	ngOnInit(): void {
		// this.get_authorData();
		this.get_projectData();
	}

	get_projectData() {
		const obj = {
			limit: this.currentLimit,
			page: this.currentPage,
		};
		this.projectservice.getAllProjects(obj).subscribe(
			(response) => {
				if (response.code == 200) {
					if (response.result != null && response.result != '') {
						this.projectData = response.result;
						this.totalRecord = response?.count;
					} else {
						this.msg_danger = true;
					}
				}
			}
		)
	}

	onListChangePage(event: any) {
		this.currentPage = event;
		this.get_projectData();
	}

	deleteProject(listid: any) {
		if (confirm("Are you sure to delete this project")) {
			var mylist = { _id: listid };
			this.projectservice.deleteProject(mylist).subscribe(
				(response) => {
					if (response.code == 200) {
						this.get_projectData();
						this.router.navigate(['/project/view'])
					}
				}
			)

		}
	}

	searchProject(){
    if(this.searchText){
      this.currentLimit = 1000;
      this.currentPage = 1; 
    } else {
      this.currentLimit = 10;
    }
    this.get_projectData();
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
        this.isactive = true
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

}
