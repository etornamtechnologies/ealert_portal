import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen/splash-screen.service';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilityService } from 'app/shared/services/utility.service';
import _ from 'lodash';

@Component({
  selector: 'app-broadcast-email-report',
  templateUrl: './broadcast.email.component.html',
  styleUrls: ['./broadcast.email.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class EmailBroadcastReport implements OnInit {

  customers: any[] = [];
  customerData: any;
  reportfilter: FormGroup;
  displayedColumns: string[] = ['image','subject','broadcastDate','broadcastTime','accountType','religion','gender','status'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = false;
  isResultEmpty:boolean = false;
  transactions: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;

  
  constructor(
    private utilityApi: UtilityService,
    private splashScreen: FuseSplashScreenService,
    private renderer: Renderer2,
    private _formBuilder: FormBuilder,
    private confirmationDialog: FuseConfirmationService,
    private _matDialog: MatDialog,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    
  ) {

    this.reportfilter = this._formBuilder.group({
      StartDate  : ['',Validators.required],
      EndDate    : ['',Validators.required],
      Status     : ['',Validators.required],
    });
   }

  ngOnInit(): void {
    // this.getUnauthorizedCustomers('D',this.userBranch).then(response => {
      this.utilityApi.getCustomersNonAuth('D','000')
          .subscribe((response: any) => {
      console.log(response);
      if (response.code === 200) {
        console.log('got the data'+ response.data);
        this.customers = response.data;
        this.dataSource = new MatTableDataSource(this.customers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
        this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
        if (this.customers.length === 0) {
          this.isResultEmpty = true;
        }
      }else {
        this.isLoading = false;
        this.utilityApi.displayFailed(response.errMsg);
      }  
    },()=> {
          this.isLoading = false;
          this.utilityApi.displayError('Unable to fetch unauthorized customers');
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
    });


  }

  onFileSelect(event) {
    let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      if (!_.includes(af, file.type)) {
        this.utilityApi.displayFailed('Only EXCEL Docs Allowed!','File not allowed');
      } else {
        this.customerData = file;
        //this.fileUploadForm.get('myfile').setValue(file);
        console.log(this.customerData);
      }
    }
  }

  cancelsubmit(){
    location.reload();
    return false;
  }

  viewimage(broadcastDetails: any){
    let base64image ='data:image/jpeg;base64,'+'/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxASEBUQEhAVFRUVFRYWFRYVFRUXFRUVFRYWFhYVFhUYHiggGBolGxYVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGi0lHyUtLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALgBEgMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAAAQIEBQYHAwj/xABDEAABBAAEAwQECgoCAQUAAAABAAIDEQQFEiExQVEGEyJhcYGRoQcUMkJSYpKxweEVFiMkJTNTcrPRc6LwNFSDsvH/xAAaAQACAwEBAAAAAAAAAAAAAAAAAQMEBQIG/8QAOBEAAQQBAgMGBAUDAwUAAAAAAQACAxEEEiExQVEFE2FxkbEGFTKBFCJiofAjQtEzUsEkNLLh8f/aAAwDAQACEQMRAD8AySUJE5ejXnUAIQhCEBKUgRaEJqcUUhCEIQhCEIQrDJshxWKdUEJfXE7Bo9LjskXBosroAk0FXoWtn+DjMmt1aI3fVbINX/YAe9ZfFYZ8TzHIwscOLXCiFy2Rj/pIKbo3s+oUvJKkQpFwlSISoQgoS0kQhCEIQhCEqAhCRCEISQnhyahCS9ElJAlQhNQlQQhCYhCChNCEIQhIhIUrTRtJdJSw9E0he+uxzq78yei8Xkk7oQkCROQhJKEEJEqEJEIKEIUrKMAcRiI4G7GR4bfQHifZa7uyTCYCGOL+Wzg0BrnFxHEnSDZ52uL9isU2LMMO9xoa6JPLUC2/euu9rcD3ndOJIDdXyfrVzWT2nMI6L/pAtaGGx5Y7uQC/gL2Xs7tLE43EdTR8skOaR6nAHgqb4QMnhxmCOLiovjbrY4Ci5nzmnyrffoqiLszLG4mQ1qvRRuwST4q4ctlp8xd8Vyh4loFsDmnf5zgWgD1kLPx5AJnaH2QRtVVY4ff9lYBmkjHfR6RR3vib+9UuGAoTWDZOXp1j2hK1CAhBT7TCUWlQkkUsZViNOsQS6fpd2+vbS3nwY9nInRux0rNekuETav5PynVzN7D0LX/rbh70fO1aa+b8oDd3Abb+qlQnzhG7SAtDHwHStvfhewvZcKQunfCXkEboBmETCx4rvG1WprjWpw+kPxXMVahlErdQVSWMxuopEIQpVElQhCEIQlQhCAUEISAoQltJSVScNgy4WTQ96EKKkVr8RZ1d7R/pCVopVKahCF0vUSbjoEj3XXkmoRSLQgJUUhJIUJCEqEIQhDOKEL1jh5nZdM7L/CA1sbYcXdt2EoF2Bw1gb35hc57xvUI7wdQoJomyinKeKUxmwu0YrtxlrW6jOHEbhrWlzvZXFc47Ydq5MwcGBpjgabDSfE88nP6eQWd1t6hL3jeoUUWKyM6uakkyXPFckBg6BMfCDw2Tu8HUJe8HUK0LVfZRgw9EhCliRvULznII47roFckLxSJUiaS7B8FGYMkwRw9jVG51jmWvOoH3kK7HZjCd5XcDTpPWr1WOfpXDMuzCWCQSwvLHt4EdOYI5jyWvHwoY7Rp7uEu+lTvbpull5OE5zy5vNamNn92zTZHlzWx+E7MI4cudD86Wo2N50KJPqAXGApOa5lPiZTNPIXu4DkGjo0cgoyuY0PdMo8VRyZu9fYQhCFYUKRCVIhJOtCahCE5IkSoQhTm4/atHv/JQQE+kJWpvx/6n/b8kihoSpO14JQhJSF0nphWm7Hdkpcc4uvRC0059cT9Fg5n7l1TLOxGXQtAGGa883S+Nx8/FsPUAq0uUyM1xKsQ4r5BfALgwRa77j+xuXSinYWNp+kwaHD1tr3rl/bPsTJgv2sZMkBNaj8qO+GuuXK0ostkhrgUS4r4xfELJ2vRjm8xa8ivRkhHClaVZO1M+j70klHgKR356D2JHPv8AJCaalSITSRSROtIhCRCkYHBSTSCKJhe93ANHtJ6DzW5wXwWTubcmIYx30Q0uryJUUkzI/qKkZE9/0i1z8IWm7Sdh8Vg2mQ1LGOL2A+Hzc3kPNZldse14tptcOjcw04UlSJUi6SQhCEITo2Er2EA6ohIA4hP1jqFySuqXjJEQmsYSaUnWOoRrHUe1FlKk1sQ6JXRDol1jqPal1jqPahPZRZGEFNIPRS9Y6hBc3qE7SpQ0oCUjdDtk1yl1cklpqChCd60JqEIpNT4Yi9zWDi5waPSTQ+9NUvKJQzERPPASMJ9GoLk7AqQcQvoHJMuZhsPHAwUGNA9J5k+ZNlc+zXOsS2SYiaTwvcAAaAAdXD0LpGLn0ROkG+lhcPOhayGVnB4hplmwrdbnG6Lt+BuifNYGrS0yO4f5Wjl40k4bHE6iN+fD7LNt7QYoNDjNLdngQQRfmuozxMnhLHDUyRtEdQ4LM5r2cwjmsMRbF4vFufE01e3XotVhWtDGhgpoADRVUBw2UfeanHhXJXIcVkOOyyS83qskjwq/BfOOZ4QwzywHjHI5np0mgfZS8Fa9r5w/McU5vDvnD06abfuVUvQxklgJWE8U4jxSJQktOXa44IQnBIU0gkKEJLQmV134JcpYzDOxRFvlcQD0Y00APSd1a9rcRjGPZ8XD6LTehpPiva9uirPgpzZr8I6D58TnHTzLXbggenZXuWTYmcuMsRhLb02NiDwrfiOaw8jWJHOq6K1mRtkhDA4tscR4KJ2XlxcjntxTX6SwCnsptkkEDbfZcl7W5aMNjZoG/Ja62+TXDUB6rXecNA2Jpt3mSeg+4Lg/bDMm4nHTTN+SXaWnq1gDQfcpsBzi8mq23UOVEIomt1F1E7niqlIgIWss5KpmV5VNiHFsTboWSTTR6+qdlGVS4mZsMYsnieTRzJXW8p7MugiEbGAAbkki3HmT5rOz80wDTGLd7ea0MHDEx1SGm+/kua/qbjOkf2/yR+puM6R/b/JdKngcw05pB+9eaxD21kg0QPRbI7HxiLBPquc/qbjOkf2/yR+puM6R/b/JdGQl87yeg9E/k2P4+q51+puM6R/b/JJ+puM6R/b/ACXRkI+d5PQeiPk2P4+q51+puM6R/b/JJ+puM6M+3+S6MhHzvJ8PRHybH8fVc5d2QxYBOlhoXs/f1ClQOBBIIog0QeIK7Msr2u7O94DPEPGB42j54HMfW+9XcLtkvk0TUL4Hx8VTzOyAxmuG9uIWCQhC9AsIIQhCEJEhCVKVyul2LsD2kjxmG+KzO/bNYWOBO8jKoOHnXFaXBZJh4o+6a3aybJt1n63sXzvFI5rg5ri1wNgtNEHqDyWvy34ScwiaGv7uYDm8U/1ubsfYs2fCcb0cDyWhDmAVr49V1/D5bGw3Vnqd6VH247Ux4KAgG5nio2cwfpno0f6XPsw+E7MJBpjbFFfMNLneou2HsWPxE0kjzJK9z3ni5xslcQYGk/moBdz51j8u56pgJJJJsk2T1J3JTkIWsBSy0ICKQQhCUFBSJzSmuaTEqc5NQnSlZbmEuHkE0Lyx7eBHTmCOY8lvsF8K0gbUuFDndWP0g+dEGlzgFDiopIGSfUFJHM+P6StV2m7eYrFsMQAhiOzgwkueOjndPILKhCAF0yNrBTRS5fI55txtOATSEWlXajXaPg6ytkWAZKxo7yVuqz7gT0Vxg8/hc1+t4BiNPIBq99m9eB9iqfg4zES5cxjSO8hBjI9Flh9BBC8OzmHxTZnSSQE223ghrf2hcbLLoHb3HivMTh7ZwDfE2vSwhroC4VsBX88v3WsxuHEsZbtdeE9HclgsbmD2RF9CxWx63RWzE4gjmxExEbbLzZFNaGgbnhZq/SVy7EdosLIwtdPGNRJNHqbUORgy5BBirbjZA/m6sYuVHED3nPhsrnJ83fMHFzQKrhai4jPpGzd0GtrUBe970qzAZzg4gQ3EsN8bPReUuY4J0nefGWXYNatrCrfJ839PLmFa+ZYvj6LS5rmb4magATdb2lyrM3ys1EAb1taoMdnuElbpdiIxvexS4HPcJE3S3ERne9yj5Pm1/b6hP5li+PorDD5/I6buy1taiL3va1IzjN3whtAG743yWeizHBNk7wYll2TWrayvbMM6wcoAdiGCuh6o+TZv6fUJfMsXx9Fo8DmDnxCQgWQT5bEj8FAyvPpZZA0taBRO13sm5biWGJojcHM3AcN73N++1m8TjnYbEEMAIaPncwQj5JneHqEndqYjRZv0R2zwrGTgtaBrbqcBsLsiwFQ6VPzbNHzvD3AChQrpdqv1L1mFHJHjsZKfzAbryeY+N87nR/STsnUEItCtKraa5IglNSXaEoSJyEIQU5MpCAEqEIQhCsH5RP8AFxiiz9ldarHEmuHpUvMezxiwcOM72+90+DTWnUCflXv7FeYhw/QLRz1t/wAqryTtGkg8XUpmQk6tXIWq/BZFC7LJMWdXeMcQN/Ds5o3FeakdmcvhfluMlfExz2NkLHFoLmkREgg8t1Iyp/8ABJm9XPPsc1N7LSVlmNHVsn+IqlLltDHkng8N+9jZWo4DrYK4sJ/YrFhCELWWahCCkCEIASkoJSIQlCA2zQQpWXka9+my4kdpaSpYGCSRrCatWmR4nE4SQSwPGrgWkEtePokLoOS/CAZmO14bS5po0/a/WLCxeVTRRudPKCREA4NHFztQDR7TaXs9ie8dPJVanh1Dld7KhA38Q4mQffh9lsZLGY7msjNXdjj9/VXOf9ocRPP3ZAEYgkkEbWd5bmuaA4tPyyATQ4KqfijZovA8NXldnf5W4HJMzJtzuGsM/c5vESQG+Ju5I3CrcnikiBcXQztNPuQ4gtoA1u0cN7SlYGOIbwVeyTZVm/FO2ov3O5OVfJFO3qtzqDBX1ipeElDpGAB7rliGl2Xd20sdIGut+nw0w3ahwtfo0nC4dx1mnfvd+MkhukceQHoUKDCyfpGGR80cVzxEQtMzW+FzAWtDhv1PpUSCK/hXTf0Thv6Ef2G/6R+icN/Qj+w3/SmrxxWKjiaZJHtY0cXONBSbKLdYxnajLTMY/iZ7sP7vv+5Bi1Xp4jhvstYMqw39CP7Df9LO4TP8uGGeG2YYXtYQWk3qeS1wHMEgn1LT4DHRTMEkT2vaebTfqPQ+ShikLrscCrE8Qj0lp4hYPJWgROAFASzgDpUz1m+0R/eHer7lpcn/AJbv+af/ADPWY7Qn94f6vuC2GfQPJU8j6VXoQhdKoltCahLfolSahASpLpInJoTk0IanJoRaSY2SlJSAlJTQVsc+kJynDDpor7JRiT/BR6Wf5AqPF506TDR4YsADKp1mzQrcIkztxwgwmgaRXis3s7Vw4LFbhz6GB3ESl3H+2ytR2TFrcRzjDeHOgrzLT/B5fS/72pnZo/w7F/2yf4yqXD525mFdhdAIdfis34q5epJgM6dFh5cOGAiUOBJJsam6dglLhTGORoG7pA4b8gQT7Ijyog+Mk8GFp86Kq05IEf8AnmtwrIpFjhaCrfH5dh4cOwEEYm2lwJduxzSbHKuHsVSoMebvWaqrdT5EPdP03ewKRNa4HgUpCts8yyKJkL4h8oEucNWkmmnSdXMWiWUtexoF3aIog9j3E1ppVS98JWsWaXghSuGoEKON2hwd03Wny+HWTYtpaQfMHkvTs7CGPnYOAc0D3qNkmOaGtjINk1fLfgrDKyO+noEbssHrR/8A31rNwtTZ3NPCvbmvU9od1JiRSt43v4WCaXjmpaJnF4Jb8TmsA0SNTeBINexU2VZiH/sIXYto0kafjrY219H+WArvMNfxh2hoc74nNpaWtcCdTdi1wo+teTcJBtcMm/H+G4Oh0I23HKvWu8j/AFCscL1kbjCQHOxd2AB+kYRuBYNBtcG8fNVGV5lFJjcM14xT3Nnjawy4kSNa7vByMe4voVOdg4boQP57/o3Bb7Gtq23oKRg4AMRhzFA7+dDq14HCx6QHjU4SMbY2FiuF0oAmf5utznWeQ4RgfMSA5waNIsk9a6LmnafFYnHMdjC0tw0TgyNp56jWquZ4WeXBdZxOGjkaWSMa9p4tcAQfaqjtThWDLpo2sDWtiOloFAVRFBMNIFE2m2RtggV7LjmGmIjkjB2e1pI6ljgR+K1PwW4zRjDFe0kbqHVzPEPcHLJYZtmvqu+4rT/B7k00mIZimFobDIA4EkOIc0g6aFHYpE0AVaeNTSFdZP8Ay3f80/8Amesxnw/eH+kfctPk/wDLd/zT/wCaRZvNi340/UCW6twDRO3C1rMNRjyWZMLAHiq1oFizzCvO02Ahh7vu/nAnY7EUKKzZc53gaCHcPRyCv+3krhimQsNNihaGjlxO59QCozS/12EE7Xt1UsMP9B+oDeqPT/6qnfohQvjY6JVb76Pqqv4eTovdKkXrhoHPOlos1dLpz2saXONAc1G1pcaaLK8ipOEwj5DTRsOJ5BeU8LmOLXNII4grXdi8mE5cwuIDY9VjjqJ2VHNy3RRt7qi5x/L081o9m4cc0j3T2GMFurjxoBZnGYF8fEWOo4fkoq1WbkwyOhsO0urVXH1dVl5Pln0qDsvtB+SXRyD8zeY5q32z2XFiNZNC4lj+APLa+PMUkCRCFrLCSoKVpTShBRSVACCE1ykpXvZeFrjIaGpoaW+XG69yoy5WXZ2VzZrHDSdQ8lxJ9JUuP/qC1oO0wEuEbIR44yATzrh7OPsWMW6xMTZY5GscCXtqr4GxuenP2rNRdn8UXbQOcG7mvkkDeg7mfQoIXtYwgmgreXG58gLRZIVNipC1jiOIBr01t71Y/CDmbmnD4drie6YXHzLiG0fVH71V5zjMPJH+wbI14kaHMcLbt0f/AHUKO/FVXaCeZ073zN0vNeHkKG1bpB7ZSHjgL9VbxMXR9dc9uuyvghMBvdOCuLDVhghqewXVuaL4Ab8b5LT4LERvmkMYoBoaT9ItfIA71t0rH/NVt2Ye7vSORbv6qpU42VKH+YW0ZdUfd+TlZ5qyPWXPxEcRdBJG3WSDbyCHCt62rZVuRZa5mtzMThJ2mtQkEz2jSdXEAV5qyz7Bud3czGB7onXp28TD8pvpXr2ezjDyzdwyPQ8g+FzdIscQa51fsUOY1zQ5w49PD7Jwsa5wB2HgoQzPDNsy/o6QUGtbCyXUHX8pwLt2779Aq7A4eFuLjxDswwrWtmZIWMdJpDQ8OLWgjhQ5r3eRi5e5jhEbI33K8tF20/IbXUhaH4nF/TZ9kKRmNq3afdROJqir/wDXHLv/AHkXtP8ApV+fdqMBJhZo2YuIudG4AXxNbBQficX9Nn2QlbgIzwib9gf6XT4AwW5wA8dlw1tnZczw0ug6jR2IrWzmK6+a3/YPtLgYIzE+oSKc573td3jjxrTdUFMOCi/pM+yFPwGSQvGp0ba6Bov7lTzXRYsbXyu2vYAXZr+eStxCSbUxorqqbIpA6IuabBlmII5gzPorLZ5/6iT+78Aul4jKo2MPd20N5GgN1zPOz+8Sf3fgFZwe0Ictn9O7bV2qmdjvhA1c1HwuIZHIyR96WvaXULNBwJrrwU7tJnOFxUxfGyQkxtYHHw6S0knw73YNKizE+CupAXjh2VLXQfgETR6pgelBKCTRAR1sqboHQISpVdpvRUNTupTQVMhxXxVjcY75AlaygLJ1AlxHoAK0ukdAqH4QsbGMC2GvG51tHIAEOL/w9ai7ShLYa5HY7cv/AHwUnZ0rXzWRuBY352PYb0vfO5+9xLSWaAWsoWCdJshzq5mytv2Umw8Eb3iQl9anhwDSA0E00b2PWs1gWRyt76J7HjumDZw1DQ02C3kbtes+H0MAki3O7H3vvVg9RS8plZbYm4+kiwwiuh4V50vY4WH3wyGPui8dPzCgfQFVeLnMkpeeLnEn0k2fvVPNxKsRxHpVzE0aW7D5LeX1Va+GWd5LLvyHuVz8YPEePCAP7j/4hZRFrW6B0HsCNI6Bew/DeK8D+J8FkHPAF9F6NlgLGMjDzK53i1VW+zWN6781o8ww4fE9p28J3Hlv+CxeBY4yN0bOBtv9zdx9yz8uNzHsrfp58Fp4TmyRvvbkfJaXO8hmwukyFhD+Gk78ATY8rpVBK1zZZngOnfredzwoXvpb5BGkdB7ArkOPJoHeHfyVGbIjDz3Y281kbVhkk7WOdd2RQ/FX2kdB7F5Ylo0nYJzY9MJvknj5FytFc01+LLi2OP5Ujg3fbbjseRsNVGcfiGEs76QcWka3ddxSfmDi1zS006tQPQg7FeHZvGyPmIe7VqJLrDdzpNnYeQWUyRokDHj6vdbU0TnxGRhrTfoqzNCREa42Dt6btUmNxkk79bzqe6h+AAXU3xggihuCOA6LmGWx6cTCDymYPZIGlaE0WlzfFR9lZOqN+307+f8AKV9hj4G3x0i/YF7ArW6R0HsCNI6D2KyMY9VhuybN0sxM7YK67KVrcfqj71fYbJ8OY9YlqRwshxGkG+Fcl7uhwpj0DQyQfOIHiPm4cQswPArY7GjsdvHxC29LtTnbbtBH5huenn5pbVFmEX8Rwj28XEtNeQ5+1ez2AGtj5jce1Z3PsY+LEwuiNPbuzYGnE1wKtZkQEJNqviZmuYNLa+/Ra7DQhk+I5a3tlH/ysa4/9i4epSrWOyTMJ8RLI+d4cWhrNw0EBpNCgBtxV0G+SMSL+g0uNUPZLLzQ2ctDb+/X7K6iItXkOOZpAvTVXsfWs3BlbxTzQ51zUxv/AJxXhPiTKjkyGmJ+oBteAN/8r03ZEchiPeM0m/8Ahe+aTscQWjys814QykbtdXrpK3CtlsOOwo/evT4sGtJG2naj5eaz5JhJ2fHEL1Nc4+FeCtNYWZLnH6SAPumyTudxcT5clznOD+8Sf3H8F0CV/hJ8vXfoUCfKpGM7xzAB71s/C80LNYkeGucQBfE/zhvzWX2+yVwZ3bLABJ8FzvGblg+shrf2230VqcRhHvmjdUYYwkjd2skitxVV60k2Gd8ZZK1gLdBY42AW2bBrnwXsnYxsnxHJebblN0hv6Tz/AGVDYSLW6B0+5CsfhvFVvxfgnLG9tcrxUsofHE58bWVbaJBvxWLvotmpmXMJDwBuWilF2oP+mJPIj3HtxUvZn/cgdQfYnbzqvuucdisPiYsQ4Ohe1j43aiWkAEWWnf1j1rfS4oOjOo+Kt74kjhv+Ape+ZHx10aB93+1CcwFeczOxJM7Giljd+YC6PMHfY/5XpMLtqHCypIpWnTq+ociBW46eX7qlHEelXUQ8I/tb9yZDhmt8z1K9lpdh9kyYep8h3cBsOX3VP4j7ci7R0RwtOlpJs87HIdP5SRCEL0K8uouav0wSH6jveKWRy3U2WFxFB7rHoulpO0slYZ/nQ9pULOMMIxhdvkPa0+uj+BWblt1P1f7QD6lamE/THp/3Ej0b/laJInJq0lloTJx4U9NmPhJPpUU4uNw8Cpsc1K0+IVZmsLS2PbxEht866KZh8vijOpjA09QvHFPaXQmxpu75bAKeFBDGwuLqHL2CsTzSBgbZ/uvc9SnLnONi7rEOkraLEhx9DiHj/wCp9q6Ks1mOB7zEzxf1cO1zf+RhI/D3rvIZqA81J2ZMInu1cCN/X/BK0gN7jhxHoQq/s/MX4aMuBBDdJvbdu34KwVhpsWqEjDG8sPI0lQkQmuKSrPzR68xaDwZGHfZ/MhaBU2BbeNnfts1rdiDuaNe5V8gatDf1D9t1ZxzpD3fpP70vPK2aMbiGjg4a/bufe4rVZXKxrzr4EEX0va1nAAMcTYGqDbcWSHDkrZVpcRuRjyY7iQCSLHHjamGSYZ2TtFkAcfKlfvn2rvGuHAG3B3s4FNCoV6txDxtqK8pkfB8hru5QfMV7L0EHxMwWJIz9jfurDEOIcCCQeoTTiHHiS70k17KUESm74pzp/JZ0vw1nRP0MGodQQPfcK7F27iSN1OOk9Oat8mAfK0OINAuI872UvtFig2Lur8Tj7AOqzUczmnUDR8k17yTZJJ6lbWD8LuhyGyPeC0Ua5306UCsrL7fEsLmMaQ42PCuvW6SISIXs15hKhIhCaF6wTuYbaSL2Ncx0SoXLmhwo8E2uLXAjivfHSxP8TQ8O53VH2KGkQuYomxMDG8BwXUsrpXGR3E8UqRCFIo0IQhCFDzfDOkj0tAJ1NNE1YaQSLTc2wrpYgAPEHNcBdUQd9/ahCidGHXfMKVszmgVy3UyJxIBcKPMXfvCchCkHBRnihKkQmkkYwNFAUE5IhICk7J4pV5dw29WkWRV866WhCCEWRwToomtFNAA6BOQhASu+KEIQmhCZBh2MvQ0N1GzQ4nqUISITs0klgY4guaCRwJAsL1SIQEXaEIQmkhCEIQhCEIQhCEIQhCEIQv/Z';
    var myWindow = window.open("", "Broadcast_Image_File", "width=600,height=590");
    myWindow.document.write(`<div><img classs="center"  width="580" height="550" center src="${base64image}"/></div>`);
    // this.utilityApi.displayCustomNotificate('Broaadcast Image',`<img width="500" height="600" src="${base64image}"/>`);
  }

  // SubmitExcelTemp() {
  //   let aff = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
  //   if (!this.customerData) {
  //     this.utilityApi.displayError('Please select an excel file');
  //     return false;
  //   }
  //   if (!_.includes(aff, this.customerData.type))
  //   {
      

  //     this.utilityApi.displayError(`<img/ src="${base64image}">Only EXCEL Docs Allowed!`);
  //     return false;
  //   }


  //   console.log(this.customerData);
  //   let formData = new FormData();
  //   formData.set('file', this.customerData);
  //   console.log(formData);
  //   this.splashScreen.show();
  //   this.utilityApi.submitBulkContactUpload(formData).subscribe(response =>{
  //     this.splashScreen.hide();
  //     if(response.code === 200) {
  //       console.log(response);
  //       // this is where we would populate the table
  //       if ( response.data.length < 1){
  //         this.splashScreen.hide();
  //         this.utilityApi.displayFailed(response.errMsg,'Bulk Cutomer details fetch failed');
  //         return; 
  //       }
  //       console.log(response);
  //       this.customers = response.data;
  //       this.utilityApi.displaySuccessNoReload('Bulk Cutomer details Uploaded Succesfully');
  //       // this.dataSource = new MatTableDataSource(this.customers);
  //       // this.dataSource.paginator = this.paginator;
  //       // this.dataSource.sort = this.sort;
  //       // this.isLoading = false;
  //       // this.isAccountsVerified=true;
        

  //       this.splashScreen.hide();

        
  //     }
  //     else {
  //       this.utilityApi.displayFailed(response.errMsg,'Bulk Cutomer details fetch failed');
  //     }
  //   },()=> {
  //     this.splashScreen.hide();
  //     this.utilityApi.displayFailed('Bulk Customer account details fetch failed');
  //     // return ''
  //   });
  
  // }



  SubmitCustomer()
    // this.utilityApi.createCustomerBulk(JSON.stringify(this.customers)).subscribe(response =>{
  {
        const dialogRef = this.confirmationDialog.open({
          "title": "Bulk Customer Creation",
          "message": `Kindly verify details of customer before submission Total of: </br><span class="text-lg font-semibold">${this.customers.length} ?</span>`,
          "icon": {
            "show": true,
            "name": "mat_outline:library_add_check",
            "color": "info"
          },
          "actions": {
            "confirm": {
              "show": true,
              "label": "Submit",
              "color": "accent"
            },
            "cancel": {
              "show": true,
              "label": "Cancel"
            }
          },
          "dismissible": true
        });
  
          dialogRef.afterClosed().subscribe((result) => {
              if (result === 'confirmed') {
                this.splashScreen.show();
                const custlist={
                  customers : this.customers
                };
                const admin = {
                username : ''//this.username
            };
              this.utilityApi.createCustomerBulk(JSON.stringify(custlist)).subscribe(response =>{
                this.splashScreen.hide();
                if (response.code === 200) {
                  this.utilityApi.displaySuccess('Customer successfully uploaded, awaiting authorisation');
                }else {
                  this.utilityApi.displayFailed('Customer submission process failed try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('Customer submission process failed, server error.');
              });
              }
          });
     }


}
