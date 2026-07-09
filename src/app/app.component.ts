
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiService } from './core/services/ui.service';
import { AuthService } from './core/auth/auth.service';
import { ScheduleService } from './core/services/schedule.service';

// Components
import { HeaderComponent } from './shared/components/header/header.component';
import { MenuListComponent } from './features/menu/menu-list.component';
import { AdminPanelComponent } from './features/admin/admin-panel.component';
import { UserProfileComponent } from './features/profile/user-profile.component';
import { GlobalLoadingComponent } from './shared/components/global-loading/global-loading.component';
import { CartDrawerComponent } from './features/cart/cart-drawer.component';
import { UserAuthModalComponent } from './features/auth/user-auth-modal.component';
import { ProfileModalComponent } from './features/profile/profile-modal.component';
import { TicketTemplateComponent } from './shared/components/ticket-template/ticket-template.component';
import { OrderService } from './core/services/orders.service';
import { ToastComponent } from './shared/components/toast/toast.component';

// Demo
import { DemoService } from './core/demo/demo.service';
import { API_CONFIG } from './core/config/api.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MenuListComponent,
    AdminPanelComponent,
    UserProfileComponent,
    GlobalLoadingComponent,
    CartDrawerComponent,
    UserAuthModalComponent,
    ProfileModalComponent,
    TicketTemplateComponent,
    ToastComponent
  ],
  template: `
    <app-global-loading></app-global-loading>
    <app-toast></app-toast>

    <div class="min-h-screen flex flex-col print:hidden bg-gray-50 dark:bg-gray-950">
      
      @if (!auth.isAdmin() && ui.currentView() !== 'profile' && schedule.isTodayHoliday()) {
        <div class="bg-gray-900 text-white text-center py-2 text-xs font-bold uppercase tracking-wider">
           🎉 Hoy estamos cerrados por feriado
        </div>
      }

      @if (ui.currentView() !== 'profile') {
          <app-header></app-header>
      }

      <main id="main-content" class="flex-grow focus:outline-none" tabindex="-1">
          <div class="view-transition" [class]="'view-' + ui.currentView()">
          @switch (ui.currentView()) {
              @case ('menu') {
                  @if (auth.isAdmin()) {
                      @defer (on viewport) {
                        <app-admin-panel></app-admin-panel>
                      } @placeholder {
                        <div class="flex justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div></div>
                      }
                  } @else {
                      <app-menu-list></app-menu-list>
                  }
              }
              @case ('profile') {
                  @defer (on immediate) {
                    <app-user-profile (back)="ui.setView('menu')"></app-user-profile>
                  } @placeholder {
                    <div class="flex justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div></div>
                  }
              }
              @case ('admin') {
                  @defer (on immediate) {
                    <app-admin-panel></app-admin-panel>
                  } @placeholder {
                    <div class="flex justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div></div>
                  }
              }
          }
          </div>
      </main>

      @if (ui.currentView() !== 'profile') {
        <footer class="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-auto text-center text-sm text-gray-500">
          &copy; {{ currentYear }} PabloCocina.
        </footer>
      }

      @if (ui.isCartOpen()) {
        @defer (on idle) {
          <app-cart-drawer 
              (close)="ui.closeCart()" 
              (requireAuth)="ui.openAuthModal()">
          </app-cart-drawer>
        }
      }

      @if (ui.isAuthModalOpen()) {
        @defer (on idle) {
          <app-user-auth-modal (close)="ui.closeAuthModal()"></app-user-auth-modal>
        }
      }

      @if (ui.isProfileModalOpen()) {
        @defer (on idle) {
          <app-profile-modal (close)="ui.closeProfileModal()"></app-profile-modal>
        }
      }
    </div>

    <app-ticket-template 
      [order]="orderService.printingOrder()" 
      [logoUrl]="'/src/assets/logo.png'">
    </app-ticket-template>
  `
})
export class AppComponent {
  ui = inject(UiService);
  auth = inject(AuthService);
  schedule = inject(ScheduleService);
  orderService = inject(OrderService);
  readonly currentYear = new Date().getFullYear();

  // Demo: kick off seed + periodic order generation
  private demoService = inject(DemoService);

  constructor() {
    if (API_CONFIG.isDemoMode) {
      this.demoService.start();
    }
  }
}
