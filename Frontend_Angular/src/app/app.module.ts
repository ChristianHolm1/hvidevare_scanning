import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './search/search.component';
import { ProductContainerComponent } from './product-container/product-container.component';
import { ProductComponent } from './product/product.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { WrapperComponent } from './wrapper/wrapper.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ProductContainerComponent,
    ProductComponent,
    DashboardComponent,
    FrontpageComponent,
    WrapperComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
