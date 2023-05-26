import { AfterViewInit, Component, ElementRef, ViewChild, Inject , OnDestroy} from "@angular/core";
import * as myurl from 'app/main/url';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {Observable, Subject} from 'rxjs';
import {WebcamImage} from 'ngx-webcam';
import {WebcamUtil} from 'ngx-webcam';
import {WebcamInitError} from 'ngx-webcam';

@Component({
  selector: 'app-cameraphoto',
  templateUrl: './cameraphoto.component.html',
  styleUrls: ['./cameraphoto.component.scss']
})
export class CameraphotoComponent implements OnDestroy {

  urlnow = myurl.url;
  WIDTH = 640;
  HEIGHT = 480;
  trigger: Subject<void> = new Subject<void>();
  nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  allowCameraSwitch = true;
  @ViewChild("video")
  public video: ElementRef;
  webcamImage: WebcamImage = null;
  @ViewChild("canvas")
  public canvas: ElementRef;
  showWebcam = true;
  deviceId: string;
  captures: string[] = [];
  facingMode: string = 'environment';
  multipleWebcamsAvailable = false;
  error: any;
  isCaptured: boolean;
  messages: any[] = [];
  idphoto;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<CameraphotoComponent>,
    private dialog: MatDialog,
  ) { 
    if(data){
      this.idphoto = data.idphoto;
    }
  }

  async ngAfterViewInit() {
    this.readAvailableVideoInputs();
  }

  test(v){
    console.log(navigator.mediaDevices.getSupportedConstraints());
  }

  triggerSnapshot(): void {
    this.isCaptured = true;
    this.trigger.next();
    this.captures.push(this.webcamImage['_imageAsDataUrl']);

  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  ngOnDestroy(): void {
    this.trigger.complete();
    console.log("ngOnDestroy completed");
  }

  ngOnInit(): void {
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  public get videoOptions(): MediaTrackConstraints {
    const result: MediaTrackConstraints = {};
    if (this.facingMode && this.facingMode !== '') {
      result.facingMode = { ideal: this.facingMode };
    }

    return result;
  }

  handleImage(webcamImage: WebcamImage): void {
    // this.addMessage('Received webcam image');
    console.log(webcamImage);
    this.webcamImage = webcamImage;
  }

  toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  cameraWasSwitched(deviceId: string): void {
    this.addMessage('Active device: ' + deviceId);
    this.deviceId = deviceId;
    this.readAvailableVideoInputs();
  }

  addMessage(message: any): void {
    console.log(message);
    this.messages.unshift(message);
  }

  showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        if (stream) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.error = null;
        } else {
          this.error = "You have no output video device";
        }
      } catch (e) {
        this.error = e;
      }
    }
  }

  readAvailableVideoInputs() {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  stopVideoOnly(stream) {
    stream.getTracks().forEach(function(track) {
        if (track.readyState == 'live' && track.kind === 'video') {
            track.stop();
        }
    });
}

  capture() {
    this.drawImageToCanvas(this.video.nativeElement);
    this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
    this.isCaptured = true;
  }

  removeCurrent() {
    this.isCaptured = false;
  }

  setPhoto(idx: number) {
    this.isCaptured = true;
    var image = new Image();
    image.src = this.captures[idx];
    this.drawImageToCanvas(image);
  }

  closeData(){ 
    return this.dialogRef.close({
      b: "close",
      c: this.captures,
      d: this.idphoto
     
  });
  }

  drawImageToCanvas(image: any) {
    this.canvas.nativeElement
      .getContext("2d")
      .drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }

  handleInitError(error: WebcamInitError): void {
    this.messages.push(error);
    if (error.mediaStreamError && error.mediaStreamError.name === 'NotAllowedError') {
      this.addMessage('User denied camera access');
    }
  }

}
