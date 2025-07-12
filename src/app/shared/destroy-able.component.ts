import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export abstract class DestroyAbleComponent implements OnDestroy {
  protected dead$ = new Subject<void>();

  ngOnDestroy() {
    this.dead$.next();
    this.dead$.complete();
  }
}
