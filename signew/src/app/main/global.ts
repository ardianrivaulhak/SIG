import Swal from "sweetalert2";
import { MenuService } from "./analystpro/services/menu/menu.service";
import { MatDialog } from "@angular/material/dialog";

export const swalyousure = (text, set?) => {
    return Swal.fire({
        title: "Are you sure?",
        text: text,
        icon: set ? "error" : "warning",
        showCancelButton: set ? false : true,
        confirmButtonText: set ? "Okay" : "Yes",
        cancelButtonText: "No, cancel it",
    });
};

export const checknullImportant = (form, forminportant) => {
    let output = [];

    for (let i in form) {
        if (forminportant.map((v) => v.values).includes(i)) {
            forminportant
                .map((v) => v.values)
                .forEach((ea) => {
                    if (form[ea] == form[i]) {
                        if (form[i] == null) {
                            output.push(
                                forminportant.filter((r) => r.values == i)[0]
                                    .title
                            );
                        }
                    }
                });
        }
    }
    let uniq = [...new Set(output)];
    return uniq;
};

export const swalmou = (data) => {
    return Swal.fire({
        title: "<strong>Data MOU Found</strong>",
        icon: "info",
        html: data,
    });
};

export const swalwarning = (title, text) => {
    return Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        confirmButtonText: "Ok",
    });
};

export const swalerror = (text) => {
    return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: text,
    });
};

export const swalerrorinnerHtml = (text) => {
    return Swal.fire({
        icon: "error",
        title: "Oops...",
        html: text,
    });
};

export const addzero = (u) => {
    return u > 9 ? u : `0${u}`;
};

export const swalsuccess = (title, text) => {
    return Swal.fire(title, text, "success");
};

export const uniq = (data, key) => {
    return [...new Map(data.map((x) => [key(x), x])).values()];
};

export const choosing = () => {
    return Swal.fire({
        title: "What Do you want to do after uploading?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: `Auto Approve`,
        denyButtonText: `Dont Auto Approve`,
    });
};

export const three_option = () => {
    return Swal.fire({
        title: "Please Choose Status First",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Verified",
        denyButtonText: `Not Verified`,
        cancelButtonText: "Penyesuaian",
    });
};
//
export const data_seehasiluji = [10, 12, 1, 5, 16, 13];

export const compare = (
    a: number | string,
    b: number | string,
    isAsc: boolean
) => {
    return ((a != null ? a : Infinity) < (b != null ? b : Infinity) ? -1 : 1) * (isAsc ? 1 : -1);
};
//
