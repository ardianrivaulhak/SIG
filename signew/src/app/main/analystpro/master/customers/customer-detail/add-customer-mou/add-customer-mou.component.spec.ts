import { AddCustomerMou } from "./add-customer-mou.component";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

describe("CustomerMou", () => {
    let component: AddCustomerMou;
    let fixture: ComponentFixture<AddCustomerMou>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddCustomerMou],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddCustomerMou);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
