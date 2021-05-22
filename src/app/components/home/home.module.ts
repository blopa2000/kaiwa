import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@material/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UserListItemComponent } from './components/user-list-item/user-list-item.component';
import { ChatComponent } from './components/chat/chat.component';
import { ContactUserViewComponent } from './components/contact-user-view/contact-user-view.component';
import { DialogContactComponent } from './components/dialog-contact/dialog-contact.component';
import { DialogSettingsComponent } from './components/sidebar/components/dialog-settings/dialog-settings.component';
import { InputSearchComponent } from './components/sidebar/components/input-search/input-search.component';

@NgModule({
  declarations: [
    HomeComponent,
    SidebarComponent,
    UserListItemComponent,
    ChatComponent,
    ContactUserViewComponent,
    DialogContactComponent,
    DialogSettingsComponent,
    InputSearchComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    MaterialModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class HomeModule {}
