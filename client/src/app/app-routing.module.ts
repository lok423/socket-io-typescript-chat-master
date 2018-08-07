import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { MessagerComponent } from 'app/messager/messager.component';

const routes: Routes = [
  {
    path: '', component: ChatComponent
  },
  {
    path: 'messager', component: MessagerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
