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
        ]
    },
    {path: '**', component: HomeComponent, pathMatch: 'full'},
];
