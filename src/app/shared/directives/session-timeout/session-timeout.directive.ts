import { Directive, ElementRef, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { AlertDialogService } from 'app/shared/services/alerts/alert-dialog.service';

@Directive({
  selector: '[appSessionTimeout]'
})
export class SessionTimeoutDirective implements OnInit, OnDestroy {

  timerIncrement: any = 0;
  countDown: any = 0;
  idleTime: number = 0;

  constructor(
    private elemRef: ElementRef,
    private authService: AuthService,
    private alertService: AlertDialogService
  ) { }

  ngOnInit(): void {
    //sessionExpire takes 2 arguments ---> 
    //Inactivity duration in Minutes And Countdown Time before session expires in Seconds
    this.sessionExpire(30, 10);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    clearInterval(this.countDown);
    clearInterval(this.timerIncrement);
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: Event): void {
    this.idleTime = 0;
    clearInterval(this.countDown);
    this.elemRef.nativeElement.textContent = '';
  }

  @HostListener('document:mousemove', ['$event'])
  MouseEvent(event: Event): void {
    this.idleTime = 0;
    clearInterval(this.countDown);
    this.elemRef.nativeElement.textContent = '';
  }

  @HostListener('document:keypress', ['$event'])
  KeyPressEvent(event: Event): void {
    this.idleTime = 0;
    clearInterval(this.countDown);
    this.elemRef.nativeElement.textContent = '';
  }

  sessionExpire(inactivitycount: number, countDownTime: number): void {
    this.elemRef.nativeElement.textContent = '';
    this.timerIncrement = setInterval(() => {
      this.idleTime++;
      if (this.idleTime >= inactivitycount) {
        this.startCountDown(countDownTime);
      }
    }, 60000);
  }

  startCountDown(countDownTime: number): void {
    this.countDown = setInterval(() => {
      if (countDownTime > 0) {
        countDownTime--;
        this.elemRef.nativeElement.textContent = `Your session will end in ${countDownTime}`;
      }
      if (countDownTime === 0) {
        countDownTime  = +-1
        this.elemRef.nativeElement.textContent = '';
        clearInterval(this.countDown);
        clearInterval(this.timerIncrement);
        this.authService.clearSession();
        this.alertService.openSessionTimeout();
      }
    }, 1200);
  }
}
