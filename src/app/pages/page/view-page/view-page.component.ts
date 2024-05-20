import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';

// Services
import { PageService } from '../../../providers/page/page.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.css']
})
export class ViewPageComponent implements OnInit {
  
  msg_danger: boolean = false;
  pageData: any;

  // pagination
  currentPage: number  = 1;
  initialized: boolean = false;
  currentLimit: number = 10;
  totalRecord: number  = 0;
  searchText = '';

  constructor(
    private router: Router,
    private pageService:PageService
  )
  { 

  }

  ngOnInit(): void {
    this.get_pageData();
  }

  get_pageData()
  {
    const obj = {
      limit: this.currentLimit,
      page: this.currentPage,
    };
    this.pageService.getPageDetails(obj).subscribe(
        (response)=> {
          if (response.code == 200) 
          {
            if(response.result != null && response.result != '')
            {
              this.pageData    = response.result;
              this.totalRecord = response?.count;
            }
            else
            {
              this.msg_danger   = true;
            }
           
          }
        },
      );
  }

  
  onListChangePage(event:any) {
    this.currentPage = event;
    this.get_pageData();
  } 

  searchPage(){
    if(this.searchText){
      this.currentLimit = 1000;
      this.currentPage = 1; 
    } else {
      this.currentLimit = 10;
    }
    this.get_pageData();
  }

}
