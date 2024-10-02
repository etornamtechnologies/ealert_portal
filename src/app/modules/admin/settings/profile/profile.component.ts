import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ProfileComponent implements OnInit {

  loggedInUser:any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void 
  {
    this.loggedInUser = this.authService.getLoggedInUserDetails();
  }

}
