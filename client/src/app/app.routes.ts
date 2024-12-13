import { Routes } from '@angular/router';
import { authGuard } from './_guards/auth.guard';
import { DepartmentListComponent } from './department/department-list/department-list.component';
import { DepartmentDetailComponent } from './department/department-detail/department-detail.component';
import { HomeComponent } from './home/home.component';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { EmployeeDetailComponent } from './employee/employee-detail/employee-detail.component';
import { WorkShiftListComponent } from './work-shift/work-shift-list/work-shift-list.component';
import { WorkShiftDetailComponent } from './work-shift/work-shift-detail/work-shift-detail.component';
import { WorkRecordListComponent } from './work-record/work-record-list/work-record-list.component';
import { WorkRecordDetailComponent } from './work-record/work-record-detail/work-record-detail.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { NotificationListComponent } from './notification/notification-list/notification-list.component';
import { NotificationDetailComponent } from './notification/notification-detail/notification-detail.component';
import { MemberListComponent } from './member/member-list/member-list.component';
import { MemberDetailComponent } from './member/member-detail/member-detail.component';
import { SimulationComponent } from './simulation/simulation.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            {path: 'departments', component: DepartmentListComponent},
            {path: 'departments/:id', component: DepartmentDetailComponent},
            {path: 'employees', component: EmployeeListComponent},
            {path: 'employees/:id', component: EmployeeDetailComponent},
            {path: 'workshifts', component: WorkShiftListComponent},
            {path: 'workshifts/:id', component: WorkShiftDetailComponent},
            {path: 'workrecords', component: WorkRecordListComponent},
            {path: 'workrecords/:id', component: WorkRecordDetailComponent},
            {path: 'notifications', component: NotificationListComponent},
            {path: 'notifications/:id', component: NotificationDetailComponent},
            {path: 'members', component: MemberListComponent},
            {path: 'members/:id', component: MemberDetailComponent},
        ]
    },
    {path: 'not-found', component: NotFoundComponent},
    {path: 'server-error', component: ServerErrorComponent},
    {path: 'simulation', component: SimulationComponent},
    {path: '**', component: HomeComponent, pathMatch: 'full'},
];
