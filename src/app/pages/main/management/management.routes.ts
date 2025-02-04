import { Routes } from '@angular/router';
import { CrewComponent } from './crew/crew.component';
import { ParentComponent } from './parent/parent.component';
import { RouteComponent } from './route/route.component';
import { StudentComponent } from './student/student.component';
import { PlansComponent } from './plans/plans.component';


export const managementRoutes: Routes = [
    {
        path: 'crew',
        component: CrewComponent
    },
    {
        path: 'parent',
        component: ParentComponent
    },
    {
        path: 'route',
        component: RouteComponent
    },
    {
        path: 'plans',
        component: PlansComponent
    },
];