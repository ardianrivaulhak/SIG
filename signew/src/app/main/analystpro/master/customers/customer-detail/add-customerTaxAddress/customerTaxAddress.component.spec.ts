import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomerTaxAddress } from "./customerTaxAddress.component";

describe("CustomerTaxAddress", () => {
    let component: CustomerTaxAddress;
    let fixture: ComponentFixture<CustomerTaxAddress>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CustomerTaxAddress],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomerTaxAddress);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
