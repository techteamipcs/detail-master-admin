import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'ni ni-chart-pie-35 text-primary', class: '' },
    { path: '/about', title: 'About',  icon:'ni ni-paper-diploma text-black', class: '' },
    { path: '/achievement/view', title: 'Achievement',  icon:'ni ni-paper-diploma text-black', class: '' },
    // { path: '/award/view', title: 'Award',  icon:'ni ni-archive-2 text-red', class: '' },
    { path: '/banner-images/view', title: 'Banners',  icon: 'ni ni-image text-orange', class: '' },

    // { path: '/catalog/view', title: 'Catalog',  icon:'ni-align-left-2 text-red', class: '' },
    // { path: '/client/view', title: 'Client',  icon:'ni ni-archive-2 text-gray', class: '' },
    { path: '/contact/list', title: 'Contacts',  icon:'ni ni-chat-round text-green', class: '' },
    // { path: '/course/view', title: 'Course',  icon:'ni ni-bulb-61 text-yellow', class: '' },
    // { path: '/download/view', title: 'Downloads',  icon:'ni-align-left-2 text-red', class: '' },
    { path: '/gallery/view', title: 'Gallery',  icon:'ni ni-album-2 text-pink', class: '' },
		{ path: '/socialactivity/view', title: 'Impact',  icon: 'ni ni-settings text-red', class: '' },
		{ path: '/blog/view', title: 'News',  icon:'ni ni-book-bookmark text-blue', class: '' },
    // { path: '/project/view', title: 'Projects',  icon:'ni ni-paper-diploma text-black', class: '' },
    { path: '/podcast/view', title: 'Podcast',  icon: 'ni-bullet-list-67 text-red', class: '' },
    { path: '/page/view', title: 'SEO Pages',  icon: 'ni-align-left-2 text-blue', class: '' },

    // { path: '/student/view', title: 'Students',  icon:'ni-bullet-list-67 text-red', class: '' },
    { path: '/subscriber/view', title: 'Subscribers',  icon:'ni ni-active-40 text-gray', class: '' },
    // { path: '/testimonial/view', title: 'Testimonials',  icon:'ni ni-caps-small text-green', class: '' },
    { path: '/tvshow/view', title: 'You might seen',  icon:'ni-planet text-blue', class: '' },
    // { path: '/icons', title: 'Icons',  icon:'ni-planet text-blue', class: '' },
    // { path: '/maps', title: 'Maps',  icon:'ni-pin-3 text-orange', class: '' },
    { path: '/user-profile', title: 'User profile',  icon:'ni ni-single-02 text-yellow', class: '' },
    // { path: '/tables', title: 'Tables',  icon:'ni-bullet-list-67 text-red', class: '' },
    { path: '/auth/view-user', title: 'Users',  icon:'ni-circle-08 text-pink', class: '' },
    { path: '/login', title: 'Login',  icon:'ni-key-25 text-info', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
}
