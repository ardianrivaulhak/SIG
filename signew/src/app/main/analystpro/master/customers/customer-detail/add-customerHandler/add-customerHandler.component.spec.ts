import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddCustomerHandler } from "./add-customerHandler.component";

describe("CustomerHandler", () => {
    let component: AddCustomerHandler;
    let fixture: ComponentFixture<AddCustomerHandler>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddCustomerHandler],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddCustomerHandler);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
