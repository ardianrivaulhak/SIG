import { TestBed } from '@angular/core/testing';

import { MetodeService } from './metode.service';

describe('MetodeService', () => {
  let service: MetodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
@import "src/@fuse/scss/fuse";

app-unit {

    width: 100%;
    height: 100%;
    overflow: auto;
    margin: 10px;

    mat-form-field {
        width: 100%;
    }

    .mat-form-field-wrapper {
         padding-bottom: 0px !important;
    }

    #unit {

        .box-yes {
            width: 50px; 
            height: 20px; 
            border-radius: 15px; 
            background-color: #2db300; 
            display: flex; 
            justify-content: center; 
            align-items: center;
        }

        .box-no {
            width: 50px; 
            height: 20px; 
            border-radius: 15px; 
            background-color: #ff3333; 
            display: flex; 
            justify-content: center; 
            align-items: center;
        }


        .top-bg {

            @include media-breakpoint('lt-md') {
                height: 256px;
            }
        }

        > .center {
            
            .spinner-container {
                display: flex; 
                justify-content: center; 
                align-items: center; 
                background-color: #f2f2f2; 
                box-shadow:0 5px 5px -3px rgba(22, 18, 18, 0.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)
              }

            > .header {

                .search-wrapper {
                    width: 100%;
                    max-width: 480px;
                    border-radius: 28px;
                    overflow: hidden;
                    @include mat-elevation(1);

                    @include media-breakpoint('xs') {
                        width: 100%;
                    }

                    .search {
                        width: 100%;
                        height: 48px;
                        line-height: 48px;
                        padding: 0 18px;

                        input {
                            width: 100%;
                            height: 48px;
                            min-height: 48px;
                            max-height: 48px;
                            padding: 0 16px;
                            border: none;
                            outline: none;
                        }
                    }
                }

                @include media-breakpoint('lt-md') {
                    padding: 8px 0;
                    height: 192px !important;
                    min-height: 192px !important;
                    max-height: 192px !important;
                }
            }

            .logo {

                .logo-text{

                    font-weight: 600;
                    
                }

            }

        }
    }

    .mat-tab-group,
    .mat-tab-body-wrapper,
    .tab-content {
        flex: 1 1 auto;
        max-width: 100%;
    }

    .lab-table {
        flex: 1 1 auto;
        border-bottom: 1px solid rgba(0, 0, 0, .12);
        overflow: auto;
        -webkit-overflow-scrolling: touch;

        .mat-header-row {
            min-height: 64px;
        }

        .standart {
            position: relative;
            cursor: pointer;
            height: 84px;
        }

        .mat-cell {
            min-width: 0;
            display: flex;
            align-items: center;
        }

        .mat-column-id {
            flex: 0 1 84px;
        }

        .mat-column-image {
            flex: 0 1 84px;

            .customers-image {
                width: 52px;
                height: 52px;
                border: 1px solid rgba(0, 0, 0, .12);
            }
        }

        .mat-column-buttons {
            flex: 0 1 80px;
        }

        .quantity-indicator {
            display: inline-block;
            vertical-align: middle;
            width: 8px;
            height: 8px;
            border-radius: 4px;
            margin-right: 8px;

            & + span {
                display: inline-block;
                vertical-align: middle;
            }
        }

        .active-icon {
            border-radius: 50%;
        }

        
    }
}