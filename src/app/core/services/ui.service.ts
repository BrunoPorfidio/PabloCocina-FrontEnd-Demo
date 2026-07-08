
import { Injectable, signal } from '@angular/core';

export type AppView = 'menu' | 'profile' | 'admin';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  // --- Global View State ---
  readonly currentView = signal<AppView>('menu');
  
  // --- Modal States ---
  readonly isCartOpen = signal(false);
  readonly isAuthModalOpen = signal(false);
  readonly isProfileModalOpen = signal(false);
  readonly isGlobalLoading = signal(false);

  // --- Navigation ---
  
  setView(view: AppView) {
    this.currentView.set(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openCart() { this.isCartOpen.set(true); }
  closeCart() { this.isCartOpen.set(false); }

  openAuthModal() { this.isAuthModalOpen.set(true); }
  closeAuthModal() { this.isAuthModalOpen.set(false); }

  openProfileModal() { this.isProfileModalOpen.set(true); }
  closeProfileModal() { this.isProfileModalOpen.set(false); }
}
