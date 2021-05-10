import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '@shared/shared.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MaterialModule } from '@material/material.module';

@NgModule({
  declarations: [HomeComponent, SidebarComponent],
  imports: [CommonModule, HomeRoutingModule, SharedModule, MaterialModule],
})
export class HomeModule {}
