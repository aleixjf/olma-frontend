//Angular
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Event, NavigationEnd, Router } from '@angular/router';

@Injectable()
export class NavigationService {
  private history: string[] = [];

  public appDrawer: any;
  //public currentUrl!: BehaviorSubject<string>;

  constructor(private router: Router, private location: Location) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        //this.currentUrl.next(event.urlAfterRedirects);
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  back(): void {
    this.history.pop();
    if (this.history.length > 0) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/');
    }
  }

  public closeNav() {
    this.appDrawer.close();
  }

  public openNav() {
    this.appDrawer.open();
  }
}
