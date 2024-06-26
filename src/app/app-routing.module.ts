import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberListComponent } from './_pages/member-list/member-list.component';
import { CreateMemberComponent } from './_pages/create-member/create-member.component';

const routes: Routes = [
  {
    path: 'members',
    component: MemberListComponent,
  },
  {
    path: 'create',
    component: CreateMemberComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
