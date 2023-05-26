import { AddCustomerNpwp } from "./add-customer-npwp.component";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

describe("CustomerMou", () => {
    let component: AddCustomerNpwp;
    let fixture: ComponentFixture<AddCustomerNpwp>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddCustomerNpwp],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddCustomerNpwp);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
