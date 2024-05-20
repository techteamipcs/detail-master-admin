import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { AuthGuard } from 'src/app/guard/auth.guard';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent,canActivate: [AuthGuard]},
    { path: 'user-profile',   component: UserProfileComponent,canActivate: [AuthGuard] },
    { path: 'tables',         component: TablesComponent,canActivate: [AuthGuard] },
    { path: 'icons',          component: IconsComponent,canActivate: [AuthGuard] },
    { path: 'maps',           component: MapsComponent,canActivate: [AuthGuard] },
	{
		path: 'page',
		loadChildren: () => import("./../../pages/page/page.module").then((m) => m.PageModule),
		data: { title: 'Page Module' },
	},
	{
		path: 'service',
		loadChildren: () => import("./../../pages/service/service.module").then((m) => m.ServiceModule),
		data: { title: 'Service Module' },
	},
	{
		path: 'banner-images',
		loadChildren: () => import("./../../pages/banner-image/banner-image.module").then((m) => m.BannerImageModule),
		data: { title: 'Banner Image Module' },
	},
	{
		path: 'blog',
		loadChildren: () => import("./../../pages/blog/blog.module").then((m) => m.BlogModule),
		data: { title: 'Blog Module' },
	},
	{
		path: 'career',
		loadChildren: () => import("./../../pages/career/career.module").then((m) => m.CareerModule),
		data: { title: 'Career Module' },
	},
	{
		path: 'config',
		loadChildren: () => import("./../../pages/config/config.module").then((m) => m.ConfigModule),
		data: { title: 'Config Module' },
	},
	{
		path: 'contact',
		loadChildren: () => import("./../../pages/contact/contact.module").then((m) => m.ContactModule),
		data: { title: 'Contact Module' },
	},
	{
		path: 'gallery',
		loadChildren: () => import("./../../pages/gallery/gallery.module").then((m) => m.GalleryModule),
		data: { title: 'Gallery Module' },
	},
	{
		path: 'subscriber',
		loadChildren: () => import("./../../pages/subscriber/subscriber.module").then((m) => m.SubscriberModule),
		data: { title: 'Subscriber Module' },
	},
	{
		path: 'testimonial',
		loadChildren: () => import("./../../pages/testimonial/testimonial.module").then((m) => m.TestimonialModule),
		data: { title: 'Testimonial Module' },
	},
	{
		path: 'author',
		loadChildren: () => import("./../../pages/author/author.module").then((m) => m.AuthorModule),
		data: { title: 'Author Module' },
	},
	{
		path: 'tag',
		loadChildren: () => import("./../../pages/tag/tag.module").then((m) => m.TagModule),
		data: { title: 'Tag Module' },
	},
	{
		path: 'auth',
		loadChildren: () => import("./../../pages/auth/auth.module").then((m) => m.AuthModule),
		data: { title: 'Users Module' },
	},
	{
		path: 'project',
		loadChildren: () => import("./../../pages/project/project.module").then((m) => m.ProjectModule),
		data: { title: 'Project Module' },
	},
	{
		path: 'catalog',
		loadChildren: () => import("./../../pages/catalog/catalog.module").then((m) => m.CatalogModule),
		data: { title: 'Catalog Module' },
	},
	{
		path: 'client',
		loadChildren: () => import("./../../pages/client/client.module").then((m) => m.ClientModule),
		data: { title: 'Client Module' },
	},
	{
		path: 'position',
		loadChildren: () => import("./../../pages/position/position.module").then((m) => m.PositionModule),
		data: { title: 'Position Module' },
	},
	{
		path: 'download',
		loadChildren: () => import("./../../pages/download/download.module").then((m) => m.DownloadModule),
		data: { title: 'Download Module' },
	}
];
