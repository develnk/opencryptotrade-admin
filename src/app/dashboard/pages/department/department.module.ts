import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NbWindowModule } from '../../../@core/nebular-theme/components/window/window.module';
import { NbCardModule } from '../../../@core/nebular-theme/components/card/card.module';
import { NbButtonModule } from '../../../@core/nebular-theme/components/button/button.module';
import { DepartmentComponent } from './department.component';
import { UserFormComponent } from './user-form/user-form.component';
import { Ng2SmartTableModule } from '../../../@core/ng2-smart-table';
import { DepartmentRoutingModule } from './department-routing.module';
import { NbInputModule } from '../../../@core/nebular-theme/components/input/input.module';
import { NbThemeModule } from '../../../@core/nebular-theme/theme.module';
import { DepartmentService } from './department.service';

const COMPONENTS = [
  DepartmentComponent,
  UserFormComponent,
];

const MODULES = [
  FormsModule,
  RouterModule,
  DepartmentRoutingModule,
  NbWindowModule.forChild(),
  NbCardModule,
  NbInputModule,
  NbButtonModule,
  NbThemeModule.forRoot(),
  Ng2SmartTableModule,
];

const ENTRY_COMPONENTS = [
  UserFormComponent
];

const SERVICES = [
  DepartmentService
];

@NgModule({
  imports: [
    ...MODULES,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  providers: [
    ...SERVICES,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class DepartmentModule {
}