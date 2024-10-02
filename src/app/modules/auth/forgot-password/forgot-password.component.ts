import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector     : 'auth-forgot-password',
    templateUrl  : './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthForgotPasswordComponent implements OnInit
{
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    forgotPasswordForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.forgotPasswordForm = this._formBuilder.group({
            email:    ['', [Validators.required, Validators.email]],
            username: ['', Validators.required],
            phone:    ['', Validators.required]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Send the reset link
     */
    sendResetLink(): void
    {
        // Return if the form is invalid
        if (this.forgotPasswordForm.invalid)
        {
            return;
        }

        // Disable the form
        this.forgotPasswordForm.disable();
        const userData = {
            username    : this.forgotPasswordForm.value.username,
            email       : this.forgotPasswordForm.value.email,
            phoneNumber : this.forgotPasswordForm.value.phone
        };
        console.log(userData);
        this.showAlert = true;
        this.alert = {type: 'info',message:'Loading please wait...'};
        this._authService.resetUserPassword(JSON.stringify(userData)).subscribe(response =>{
            this.forgotPasswordForm.enable();
            this.forgotPasswordForm.reset();
            if (response.errCode === 0) {
                this.alert = {type:'success',message:response.errMsg};
            }else {
                this.alert = {type:'error',message:response.errMsg};
            }
        },()=>{
            this.alert = {type:'error',message:'Network / Server error, unble to process your request now.'};
        });
        
    }
}
