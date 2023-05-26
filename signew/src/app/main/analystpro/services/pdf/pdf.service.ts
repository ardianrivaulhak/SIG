import { Injectable } from "@angular/core";
import * as htmlToPdfmake from "html-to-pdfmake";
import { url, urlApi } from "app/main/url";
import * as _moment from "moment";
import { CustomerhandleService } from "app/main/analystpro/services/customerhandle/customerhandle.service";
import { EmployeeService } from "app/main/hris/employee/employee.service";
import { PaketPkmService } from "app/main/analystpro/master/paket-pkm/paket-pkm.service";
import {
    headerText,
    subHeader,
    tablecolumn,
    tablecolumn3,
    tablecolumn4,
    footer,
    styles,
    din,
} from "./contract";
import { siglogo, towards, ilac, kan } from "./image";
import * as global from "app/main/global";

// import html2canvas from 'html2canvas';

@Injectable({
    providedIn: "root",
})
export class PdfService {
    pdfMake: any;

    constructor(
        private _paketpkmServ: PaketPkmService,
        private _custHandleServ: CustomerhandleService,
        private _employeeServ: EmployeeService
    ) {}

    async loadPdfMaker() {
        if (!this.pdfMake) {
            const pdfMakeModule = await import("pdfmake/build/pdfmake");
            const pdfFontsModule = await import("pdfmake/build/vfs_fonts");
            // const htmlToPdfmake = await import('html-to-pdfmake');
            this.pdfMake = pdfMakeModule.default;
            this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
        }
    }

    getBase64ImageFromURL(url) {
        return new Promise((resolve, reject) => {
            var img = new Image();
            img.setAttribute("crossOrigin", "anonymous");
            img.onload = () => {
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                var dataURL = canvas.toDataURL("image/png");
                resolve(dataURL);
            };
            img.onerror = (error) => {
                reject(error);
            };
            img.src = url;
        });
    }

    addZero(i) {
        return i < 9 ? `0${i}` : i;
    }

    rubahtanggal(val) {
        let v = new Date(val);
        return `${this.addZero(v.getDate())}/${this.addZero(
            v.getMonth() + 1
        )}/${v.getFullYear()}`;
    }

    writeRotatedText = function (text) {
        var ctx,
            canvas = document.createElement("canvas");
        // I am using predefined dimensions so either make this part of the arguments or change at will
        canvas.width = 36;
        canvas.height = 270;
        ctx = canvas.getContext("2d");
        ctx.font = "36pt Arial";
        ctx.save();
        ctx.translate(36, 270);
        ctx.rotate(-0.5 * Math.PI);
        ctx.fillStyle = "#000";
        ctx.fillText(text, 0, 0);
        ctx.restore();
        return canvas.toDataURL();
    };

    async generatePdf(val, set) {
        let a = val.transactionsample;
        let akgprice = val.akg_trans.length > 0 ? val.akg_trans[0].total : 0;
        let samplingprice =
            val.sampling_trans.length > 0
                ? val.sampling_trans.map((x) => x.total).reduce((a, b) => a + b)
                : 0;
        let totalbiayapengujian =
            val.transactionsample.map((x) => x.price).reduce((a, b) => a + b) -
            val.payment_condition.discount_lepas +
            samplingprice +
            (val.akg_trans.length > 0 ? val.akg_trans[0].total : 0) +
            (val.transactionsample.map((x) => x.price).reduce((a, b) => a + b) *
                10) /
                100;
        var rows = await [];

        await rows.push([
            "No",
            "Identification No.",
            "Due Date",
            "Matriks",
            "Sample Name",
            "Packaging",
            "Batch No.",
            "Status",
        ]);

        let rowsparameter_even = await [];
        let rowsparameter_odd = await [];
        let az = val.transactionsample
            .map((x) => x.price)
            .reduce((a, b) => a + b);
        await a.forEach(async (x, i) => {
            await rows.push([
                `${i + 1}`,
                x.no_sample.indexOf("REV") > -1
                    ? `${x.no_sample.split(".")[0]}.${
                          x.no_sample.split(".")[1]
                      }.${x.no_sample.split(".")[2]}`
                    : `${x.no_sample}`,
                `${this.rubahtanggal(x.tgl_selesai)}`,
                `${x.subcatalogue ? x.subcatalogue.sub_catalogue_name : "-"}`,
                `${x.sample_name ? x.sample_name : "-"}`,
                `${x.jenis_kemasan ? x.jenis_kemasan : "-"}`,
                `${x.batch_number ? x.batch_number : "-"}`,
                `${x.statuspengujian ? x.statuspengujian.name : "-"}`,
            ]);

            if (i % 2 == 0) {
                rowsparameter_even.push([
                    {
                        style: "bold",
                        text:
                            x.no_sample.indexOf("REV") > -1
                                ? `${x.no_sample.split(".")[0]}.${
                                      x.no_sample.split(".")[1]
                                  }.${x.no_sample.split(".")[2]} - ${
                                      x.sample_name
                                  }`
                                : `${x.no_sample} - ${x.sample_name}`,
                        colSpan: 2,
                        alignment: "center",
                    },
                    {},
                ]);

                x.transactionparameter.forEach(async (f, m) => {
                    await rowsparameter_even.push([
                        {
                            text:
                                f.status !== 4
                                    ? `${f.parameteruji.name_id}`
                                    : `${f.parameteruji.name_id} - ${f.position}`,
                        },
                        {
                            text: f.info,
                            alignment: "center",
                        },
                    ]);
                });

                rowsparameter_even.push([
                    {
                        style: "bold",
                        text: `Total - Rp. ${
                            x.price ? x.price.toLocaleString() : 0
                        }`,
                        colSpan: 2,
                        alignment: "right",
                    },
                    {},
                ]);
            } else {
                rowsparameter_odd.push([
                    {
                        style: "bold",
                        text:
                            x.no_sample.indexOf("REV") > -1
                                ? `${x.no_sample.split(".")[0]}.${
                                      x.no_sample.split(".")[1]
                                  }.${x.no_sample.split(".")[2]} - ${
                                      x.sample_name
                                  }`
                                : `${x.no_sample} - ${x.sample_name}`,
                        colSpan: 2,
                        alignment: "center",
                    },
                    {},
                ]);
                x.transactionparameter.forEach(async (f, m) => {
                    await rowsparameter_odd.push([
                        f.status !== 4
                            ? `${f.parameteruji.name_id}`
                            : `${f.parameteruji.name_id} - ${f.position}`,
                        f.info,
                    ]);
                });

                rowsparameter_odd.push([
                    {
                        style: "bold",
                        text: `Total - Rp. ${x.price.toLocaleString()}`,
                        colSpan: 2,
                        alignment: "right",
                    },
                    {},
                ]);
            }
        });
        let samplingtrans = await [];
        let subtotal =
            val.transactionsample.map((x) => x.price).reduce((a, b) => a + b) -
            val.payment_condition.discount_lepas +
            akgprice +
            samplingprice;
        let taxing = parseInt(val.payment_condition.ppn.toFixed());
        if (val.sampling_trans.length > 0) {
            val.sampling_trans.forEach((o) => {
                samplingtrans.push([
                    {
                        text: "-",
                    },
                    {
                        text: o.samplingmaster.sampling_name,
                    },
                    {
                        text: o.total.toLocaleString(),
                        alignment: "right",
                    },
                ]);
            });
        }
        let tablesample = await {
            style: ["fontsize8", "marginDalam", "marginawal"],
            table: {
                widths: [25, 50, 50, 60, 100, 40, 85, 50],
                body: rows,
                // dontBreakRows: true,
            },
            alignment: "center",
        };

        let tablecuma1 = await [
            {
                table: {
                    widths: ["*", "*"],
                    body: rowsparameter_even,
                },
            },
        ];

        let tablecuma2 = await [
            {
                table: {
                    widths: ["*", "*"],
                    body: rowsparameter_even,
                },
            },
            {
                table: {
                    widths: ["*", "*"],
                    body: rowsparameter_odd,
                },
            },
        ];

        await this.loadPdfMaker();
        let phonecode = (await val.customers_handle.customers.countries)
            ? "+" + val.customers_handle.customers.countries.phone_code + " "
            : "+62 ";
        const def = await {
            pageSize: "A4",
            pageMargins: [35, 80, 35, 60],
            pageOrientation: "portrait",
            header: function (currentPage, pageCount) {
                if (currentPage == 2) {
                    return [
                        {
                            columns: [
                                {
                                    image: siglogo,
                                    width: 150,
                                    style: "margin30",
                                },
                                {
                                    style: ["testing2", "fontsize"],
                                    alignment: "right",
                                    layout: "noBorders",
                                    table: {
                                        widths: ["*"],
                                        body: [
                                            [
                                                {
                                                    text: `No 26.1/F - PP
                                                Revisi 8`,
                                                    alignment: "right",
                                                },
                                            ],
                                            [
                                                {
                                                    text: `Page ${
                                                        currentPage - 1
                                                    } of ${pageCount - 1}`,
                                                    alignment: "right",
                                                },
                                            ],
                                            [
                                                {
                                                    text: `${val.contract_no}`,
                                                    alignment: "right",
                                                },
                                            ],
                                        ],
                                    },
                                },
                            ],
                        },
                    ];
                } else if (currentPage > 2) {
                    return [
                        {
                            columns: [
                                {
                                    image: siglogo,
                                    width: 150,
                                    style: "margin30",
                                },
                                {
                                    style: ["testing2", "fontsize"],
                                    alignment: "right",
                                    layout: "noBorders",
                                    table: {
                                        widths: ["*"],
                                        body: [
                                            [
                                                {
                                                    text: `Page ${
                                                        currentPage - 1
                                                    } of ${pageCount - 1}`,
                                                    alignment: "right",
                                                },
                                            ],
                                            [
                                                {
                                                    text: `${val.contract_no}`,
                                                    alignment: "right",
                                                },
                                            ],
                                        ],
                                    },
                                },
                            ],
                        },
                    ];
                } else {
                    return [
                        {
                            image: siglogo,
                            width: 150,
                            style: "margin30",
                        },
                    ];
                }
            },
            content: [
                {
                    alignment: "justify",
                    columns: [
                        subHeader,
                        {
                            text: `${val.contract_no}`,
                            style: "subheader",
                        },
                    ],
                },
                tablecolumn,
                {
                    text: "Sample Storage Requirements",
                    style: ["bold", "fontsize", "margin10", "margintop5"],
                },
                {
                    text: "Samples kept at normal or room temperatures will be stored for 2 months and samples kept at cold or frozen temperatures are stored for 1 month under the care of SIG. Outside of this timeframe, SIG will not be responsible for the condition of the sample.",
                    alignment: "justify",
                    style: ["fontsize", "margin10"],
                },
                {
                    text: "Terms of Payment",
                    style: ["bold", "fontsize", "margin10"],
                },
                {
                    text: `All customers are required to pay the testing fees in full before the test results can be published, except for customers who have obtained a payment term facility, allowing the payment to be settled within a given date. Invoice revision requests can be made no later than 30 days after the initial invoice issuance date.`,
                    alignment: "justify",
                    style: ["fontsize", "margin10"],
                },
                {
                    text: "Terms of Complaint",
                    style: ["bold", "fontsize", "margin10"],
                },
                {
                    text: `Complaints can be addressed no later than 1 month after the date of the issuance of the certificate. SIG Laboratory provides only 1 re-test, using the samples retained within the SIG. SIG does not address complaints regarding the result of swab tests, carried out by the customers themselves. In addition, SIG will not address complaints about microbial testing, weight uniformity, and volume uniformity testing. SIG will not address complaints about samples where the condition of the packaging is abnormal or damaged when received.`,
                    alignment: "justify",
                    style: ["fontsize", "margin10"],
                },
                {
                    text: "General Requirements",
                    style: ["bold", "fontsize", "margin10"],
                },
                {
                    text: `The estimated length of testing is accounted for the next day if the sample is received at the Bogor Office as well as other branches and representatives later than 12:00. Cancellation of testing cannot be made for microbial testing, heavy metals, and testing sent as ‘urgent’ and/or ‘very urgent’.`,
                    alignment: "justify",
                    style: ["fontsize", "margin10"],
                },
                {
                    text: "",
                    pageBreak: "before",
                    style: "marginawal",
                    // or after
                },
                {
                    text: "TESTING AGREEMENT",
                    style: "bold",
                    alignment: "center",
                    // or after
                },
                {
                    text: `${val.contract_no}`,
                    style: ["bold", "fontsize", "marginBawah"],
                    alignment: "center",
                    // or after
                },
                {
                    style: ["fontsize", "margin10", "tableExample"],
                    alignment: "left",
                    layout: "noBorders",
                    table: {
                        widths: [150, 5, "*"],
                        body: [
                            ["", "", ""],
                            [
                                "Customer Name",
                                ":",
                                val.customers_handle.customers.customer_name,
                            ],
                            [
                                "Person In Charge",
                                ":",
                                val.customers_handle.contact_person.name,
                            ],
                            ["Address", ":", val.cust_address.address],
                            [
                                "Phone / Email",
                                ":",
                                `${
                                    val.customers_handle.phone
                                        ? phonecode + val.customers_handle.phone
                                        : "-"
                                } / ${
                                    val.customers_handle.telp
                                        ? phonecode + val.customers_handle.telp
                                        : "-"
                                } / ${
                                    val.customers_handle.email
                                        ? val.customers_handle.email
                                        : "-"
                                }`,
                            ],
                            ["Purchase Order No.", ":", val.no_po],
                            [
                                "Quotation No.",
                                ":",
                                val.penawaran
                                    ? val.penawaran.no_penawaran
                                    : val.no_penawaran,
                            ],
                            [
                                {
                                    text: `Information`,
                                    colSpan: 2,
                                    alignment: "justify",
                                },
                                {},
                                {},
                            ],
                        ],
                    },
                },
                tablesample,
                a.length > 6
                    ? {
                          text: "",
                          pageBreak: "before",
                          style: "marginawal",
                          // or after
                      }
                    : {},
                {
                    style: ["fontsize", "margin10", "tableExample"],
                    layout: "noBorders",
                    table: {
                        widths: [80, 5, 20, 80],
                        body: [
                            [
                                {
                                    text: "Sample Cost",
                                    alignment: "left",
                                },
                                ":",
                                "Rp.",
                                {
                                    text: `${
                                        val.transactionsample.length > 0
                                            ? az < 1
                                                ? "0"
                                                : az.toLocaleString()
                                            : 0
                                    }`,
                                    alignment: "right",
                                },
                            ],
                            // samplingtrans.length > 0 ? [
                            //     {
                            //         text: "Sampling Cost",
                            //         alignment: "left",
                            //     },
                            //     {
                            //         text: ':',
                            //         colSpan: 3
                            //     },
                            //     {},
                            //     {}
                            // ] :

                            // samplingtrans.length > 0 ? [
                            //     {
                            //         style: ["fontsize"],
                            //         layout: "noBorders",
                            //         table: {
                            //             widths: [5,100,89],
                            //             body: samplingtrans
                            //         },
                            //         colsPan: 3
                            //     },
                            //     {},{},{}
                            // ] : [],
                            [
                                {
                                    text: "Discount",
                                    alignment: "left",
                                },
                                ":",
                                "Rp.",
                                {
                                    text: `${
                                        val.payment_condition.discount_lepas
                                            ? val.payment_condition.discount_lepas.toLocaleString()
                                            : "0"
                                    }`,
                                    alignment: "right",
                                },
                            ],

                            [
                                {
                                    text: "Sampling Cost",
                                    alignment: "left",
                                },
                                ":",
                                "Rp.",
                                {
                                    text:
                                        val.sampling_trans.length > 0
                                            ? val.sampling_trans
                                                  .map((x) => x.total)
                                                  .reduce((a, b) => a + b)
                                                  .toLocaleString()
                                            : 0,
                                    alignment: "right",
                                },
                            ],

                            [
                                {
                                    text: "Nutrition Facts Cost",
                                    alignment: "left",
                                },
                                ":",
                                "Rp.",
                                {
                                    text: `${
                                        val.akg_trans.length > 0
                                            ? val.akg_trans[0].total.toLocaleString()
                                            : 0
                                    }`,
                                    alignment: "right",
                                },
                            ],

                            [
                                {
                                    text: `Subtotal`,
                                    alignment: "left",
                                },
                                ":",
                                "Rp.",
                                {
                                    text: `${subtotal.toLocaleString()}`,
                                    alignment: "right",
                                },
                            ],

                            [
                                {
                                    text:
                                        "Tax " +
                                        ((taxing / subtotal) * 100).toFixed() +
                                        " %",
                                    alignment: "left",
                                },
                                ":",
                                "Rp.",
                                {
                                    text: `${taxing.toLocaleString()}`,
                                    alignment: "right",
                                },
                            ],
                            [
                                {
                                    text: `Total Cost`,
                                    alignment: "left",
                                },
                                ":",
                                "Rp.",
                                {
                                    text: `${(
                                        subtotal + taxing
                                    ).toLocaleString()}`,
                                    alignment: "right",
                                },
                            ],
                            [
                                {
                                    text: `Downpayment`,
                                    alignment: "left",
                                },
                                ":",
                                "Rp.",
                                {
                                    text: `${val.payment_condition.downpayment.toLocaleString()}`,
                                    alignment: "right",
                                },
                            ],
                            [
                                {
                                    text: `Remaining Cost`,
                                    alignment: "left",
                                },
                                ":",
                                "Rp.",
                                {
                                    text: `${(
                                        subtotal +
                                        taxing -
                                        val.payment_condition.downpayment
                                    ).toLocaleString()}`,
                                    alignment: "right",
                                },
                            ],
                        ],
                    },
                },
                {
                    stack: [
                        {
                            columns: [
                                {
                                    width: "*",
                                    style: ["tableExample", "fontsize"],
                                    layout: "noBorders",
                                    table: {
                                        heights: 50,
                                        width: 400,
                                        body: [
                                            ["Customer,"],
                                            [
                                                val.customers_handle
                                                    .contact_person.name,
                                            ],
                                        ],
                                    },
                                },
                                {
                                    text: "",
                                    width: 250,
                                },
                                {
                                    width: "*",
                                    style: ["tableExample", "fontsize"],
                                    layout: "noBorders",
                                    table: {
                                        heights: 50,
                                        width: 650,
                                        body: [
                                            [
                                                {
                                                    text: `${this.rubahtanggal(
                                                        val.transactionsample[0]
                                                            .tgl_input
                                                    )},
                            Customer Service Officer`,
                                                    alignment: "right",
                                                },
                                            ],
                                            // [
                                            //     {
                                            //         width: "*",
                                            //         qr: `https://sigma-lab.id/assets/signature/${
                                            //             val.contract_condition[0].user.signature.signature
                                            //         }`,
                                            //         alignment: "right",
                                            //         fit: 70,
                                            //     }
                                            // ],
                                            [
                                                {
                                                    text: val
                                                        .contract_condition[0]
                                                        .user.employee_name,
                                                    alignment: "right",
                                                },
                                            ],
                                        ],
                                    },
                                },
                            ],
                            unbreakable: true,
                        },
                    ],
                },

                {
                    columns: [
                        {
                            width: 70,
                            layout: "noBorders",
                            table: {
                                style: ["fontsize6"],
                                width: "*",
                                body: [
                                    [
                                        {
                                            width: "*",
                                            qr: `https://sig-connect.com/#/contract/${btoa(
                                                val.id_kontrakuji
                                            )}`,
                                            alignment: "center",
                                            fit: 65,
                                        },
                                    ],
                                    [
                                        {
                                            text: "scan me, for softcopy \nof this file",
                                            style: "fontsize6",
                                        },
                                    ],
                                ],
                            },
                        },
                        {
                            width: 250,
                            table: {
                                dontBreakRows: true,
                                style: ["fontsize8", "marginatascuk"],
                                width: 400,
                                body: [
                                    [
                                        {
                                            text: "Bank Account Number ( IDR )",
                                            colSpan: 2,
                                            alignment: "center",
                                            style: "fontsize8",
                                        },
                                        {},
                                    ],
                                    val.contract_type !== 4
                                        ? [
                                              {
                                                  text: `PT. Saraswanti Indo Genetech
                                            A/C No. 133 00 01160811
                                            Bank Mandiri, Bogor
                                            Swift Code: BMRIIDJA`,
                                                  style: "fontsize8",
                                              },
                                              {
                                                  text: `PT. Saraswanti Indo Genetech
                                            A/C No. 8-000-45938800
                                            Bank CIMB Niaga, Surabaya
                                            Swift Code: BNIAIDJA`,
                                                  style: "fontsize8",
                                              },
                                          ]
                                        : [
                                              {
                                                  text: `PT. Saraswanti Indo Genetech Surabaya
                                            A/C No. 133-00-2392188-5
                                            Bank Mandiri, Bogor`,
                                                  style: "fontsize8",
                                                  colSpan: 2,
                                              },
                                              {},
                                          ],
                                    [
                                        {
                                            text: `Please confirm your payment to ${
                                                val.contract_type !== 4
                                                    ? "paymentinfo-sig@saraswanti.com"
                                                    : "finance@sigsurabaya.com"
                                            }`,
                                            colSpan: 2,
                                            alignment: "center",
                                            style: "fontsize8",
                                        },
                                        {},
                                    ],
                                ],
                            },
                        },
                        {
                            width: 150,
                            text: `Note :
                          ${val.desc ? val.desc : "-"}`,
                            style: "fontsize",
                        },
                    ],
                },
                {
                    text: "",
                    pageBreak: "before",
                    style: "marginawal",
                    // or after
                },
                {
                    text: "ATTACHMENT",
                    style: ["bold", "marginBawah"],
                    alignment: "center",
                    // or after
                },
                {
                    style: "fontsize6",
                    layout: "noBorders",
                    table: {
                        widths: ["*", "*"],
                        body: [
                            rowsparameter_odd.length > 0
                                ? tablecuma2
                                : tablecuma1,
                        ],
                    },
                },
                // {
                //     text: "",
                //     pageBreak: "before",
                //     style: "marginawal",
                //     // or after
                // },
                tablecolumn,
            ],
            footer: {
                columns: [
                    {
                        layout: "noBorders",
                        style: "tested",
                        table: {
                            widths: ["*", "*", 50, 120],
                            body: [
                                [
                                    {
                                        image: towards,
                                        width: 90,
                                        style: "marginminussetengah",
                                    },
                                    {
                                        text:
                                            val.contract_type !== 4
                                                ? `PT SARASWANTI INDO GENETECH
                                        Graha SIG Jl. Rasamala No. 20 Taman Yasmin
                                        Bogor 16113 INDONESIA
                                        Phone +62 251 7532 348 49 ( Hunting ), 0821 1151 6516
                                        Fax +62 251 7540 927
                                        www.siglaboratory.com`
                                                : `AMG Tower Lt.12
                                        Jl. Dukuh Menanggal No.1 A, Kec. Gayungan, 
                                        Kota SBY, Jawa Timur 60234
                                        Phone +62 31 82531288 / +62 31 82531889, +62 821 9996 8648`,
                                        alignment: "left",
                                        style: "marginminus",
                                    },
                                    {
                                        image: ilac,
                                        width: 40,
                                        style: "marginminus",
                                        alignment: "right",
                                    },
                                    {
                                        image: kan,
                                        width: 60,
                                        style: "marginminussetengahaja",
                                        alignment: "right",
                                    },
                                ],
                            ],
                        },
                    },
                ],
            },
            styles: styles,
            unbreakable: true,
            defaultStyle: {
                // alignment: 'justify'
                // font: 'din',
                columnGap: 5,
            },
        };
        (await set) === "download"
            ? this.pdfMake.createPdf(def).download(`${val.contract_no}.pdf`)
            : this.pdfMake.createPdf(def).open();
    }

    async generatePdfPenawaranID(data, string) {
        await this.loadPdfMaker();

        var rowhead = await [];
        var subtotal = [];
        var moudetstatuspengujian =
            data.customers_handle.customers.customer_mou?.detail.filter(
                (r) => r.condition == 1
            ).length > 0
                ? data.customers_handle.customers.customer_mou.detail.map(
                      (ap) => {
                          return {
                              id: ap.id_status_pengujian,
                              value: ap.values,
                          };
                      }
                  )
                : [];
        var formatphonecode = data.customers_handle.customers.countries
            ? "+" + data.customers_handle.customers.countries.phone_code + " "
            : "+62 ";
        var formattelp =
            data.customers_handle.telp.substr(0, 1) == "0"
                ? data.customers_handle.telp.substr(1)
                : data.customers_handle.telp;
        var formatphone =
            data.customers_handle.phone.substr(0, 1) == "0"
                ? data.customers_handle.phone.substr(1)
                : data.customers_handle.phone;

        let z = await Object.entries(data.format);
        let j = await z
            .filter(
                ([key, value]) =>
                    value === 1 &&
                    !["ppn", "pph", "dp", "id_tp", "id"].includes(key)
            )
            .map((m) => {
                return m[0].toUpperCase();
            });
        for (let m = 0; m < data.transaction_penawaran_sample.length; m++) {
            let statuskali = [
                {
                    id: 2,
                    value: 1.5,
                },
                {
                    id: 3,
                    value: 2,
                },
                {
                    id: 1,
                    value: 1,
                },
            ];

            let e = data.transaction_penawaran_sample;
            var rows = await [];
            var widths = await [];

            let a = await {
                text: "",
            };

            let textsub =
                (await e[m].batch_number) || e[m].kode_sample
                    ? `\n${
                          e[m].batch_number
                              ? "batch : " + e[m].batch_number
                              : ""
                      } ${
                          e[m].kode_sample
                              ? "sample code :" + e[m].kode_sample
                              : ""
                      }`
                    : "";
            await rows.push([
                {
                    text: `${m + 1}. ${e[m].sample_name} ${textsub}\n\n`,
                    colSpan: j.length + 5,
                    alignment: "left",
                    border: [false, false, false, true],
                    style: [m < 1 ? "marginatas0" : "marginatas20"],
                },
            ]);

            for (let l = 1; l < j.length + 5; l++) {
                rows[0] = await rows[0].concat(a);
            }

            await rows.push([
                {
                    text: "NO",
                },
                {
                    text: "JENIS",
                },
                {
                    text: "PARAMETER",
                },
            ]);

            rows[1] = await rows[1].concat(j);

            rows[1] = await rows[1].concat(
                { text: "PENGUJIAN" },
                { text: "HARGA (IDR)" }
            );

            await rows[1].forEach((c, mc) => {
                if (mc == 0) {
                    widths.push(13);
                } else if (mc == 1) {
                    widths.push(80);
                } else if (mc == 2) {
                    widths.push(150);
                } else if (mc == rows[1].length - 1) {
                    widths.push("*");
                } else if (mc == rows[1].length - 2) {
                    widths.push("*");
                } else if (mc == rows[1].length - 3) {
                    widths.push("*");
                } else {
                    widths.push("*");
                }
            });

            let nonpaket = await e[m].transaction_penawaran_parameter.filter(
                (e) => e.status == 2
            );
            let paketparameter = global.uniq(
                e[m].transaction_penawaran_parameter.filter(
                    (e) => e.status == 1
                ),
                (it) => it.info_id
            );
            let paketpkm = global.uniq(
                e[m].transaction_penawaran_parameter.filter(
                    (e) => e.status == 3
                ),
                (it) => it.info
            );

            let paketpkmdet = global.uniq(
                e[m].transaction_penawaran_parameter.filter(
                    (e) => e.status == 3
                ),
                (it) => it.info_id
            );

            if (nonpaket.length > 0) {
                await nonpaket.forEach((a, c) => {
                    rows.push([
                        `${c + 1}`,
                        {
                            text: "Non Paket",
                            alignment: "left",
                        },
                        {
                            text: `${a.parameteruji.name_id}`,
                            alignment: "left",
                        },

                        j.filter((e) => e === "METODE").length > 0
                            ? `${a.metode ? a.metode.metode : "-"}`
                            : undefined,
                        j.filter((e) => e === "LOD").length > 0
                            ? `${a.lod ? a.lod.nama_lod : "-"}`
                            : undefined,
                        j.filter((e) => e === "SATUAN").length > 0
                            ? `${a.unit ? a.unit.nama_unit : "-"}`
                            : undefined,

                        `${e[m].status_pengujian.name}`,
                        {
                            text: `${(
                                a.price *
                                (moudetstatuspengujian.length > 0
                                    ? moudetstatuspengujian.filter(
                                          (ze) =>
                                              ze.id == e[m].id_statuspengujian
                                      )[0].value
                                    : e[m].id_statuspengujian)
                            ).toLocaleString()}`,
                            alignment: "right",
                        },
                    ]);
                });
            }

            if (paketparameter.length > 0) {
                var paketaneh = [4691, 4697];
                paketparameter.forEach((r: any, ix) => {
                    let h = [];

                    let az = [];
                    let ba = e[m].transaction_penawaran_parameter.filter(
                        (fz) => fz.status == 1 && fz.info_id == r.info_id
                    ).length;

                    let za = parseInt(ba);

                    // if (za > 1) {
                    //     for (let xa = 1; xa < za; xa++) {
                    //         az = az.concat("\n");
                    //     }
                    // }

                    for (
                        let k = 1;
                        k <
                        e[m].transaction_penawaran_parameter.filter(
                            (fz) => fz.status == 1 && fz.info_id == r.info_id
                        ).length;
                        k++
                    ) {
                        h.push([
                            "",
                            "",
                            {
                                text: `${
                                    e[m].transaction_penawaran_parameter.filter(
                                        (fz) =>
                                            fz.status == 1 &&
                                            fz.info_id == r.info_id
                                    )[k].parameteruji.name_id
                                }`,
                                alignment: "left",
                            },

                            j.filter((abc) => abc == "METODE").length > 0
                                ? `${
                                      e[
                                          m
                                      ].transaction_penawaran_parameter.filter(
                                          (fz) =>
                                              fz.status == 1 &&
                                              fz.info_id == r.info_id
                                      )[k].metode
                                          ? e[
                                                m
                                            ].transaction_penawaran_parameter.filter(
                                                (fz) =>
                                                    fz.status == 1 &&
                                                    fz.info_id == r.info_id
                                            )[k].metode.metode
                                          : "-"
                                  }`
                                : undefined,
                            j.filter((abc) => abc == "LOD").length > 0
                                ? `${
                                      e[
                                          m
                                      ].transaction_penawaran_parameter.filter(
                                          (fz) =>
                                              fz.status == 1 &&
                                              fz.info_id == r.info_id
                                      )[k].lod
                                          ? e[
                                                m
                                            ].transaction_penawaran_parameter.filter(
                                                (fz) =>
                                                    fz.status == 1 &&
                                                    fz.info_id == r.info_id
                                            )[k].lod.nama_lod
                                          : "-"
                                  }`
                                : undefined,
                            j.filter((ab) => ab == "SATUAN").length > 0
                                ? `${
                                      e[
                                          m
                                      ].transaction_penawaran_parameter.filter(
                                          (fz) =>
                                              fz.status == 1 &&
                                              fz.info_id == r.info_id
                                      )[k].lod
                                          ? e[
                                                m
                                            ].transaction_penawaran_parameter.filter(
                                                (fz) =>
                                                    fz.status == 1 &&
                                                    fz.info_id == r.info_id
                                            )[k].unit.nama_unit
                                          : "-"
                                  }`
                                : undefined,
                            ``,
                            "",
                        ]);
                    }
                    rows.push([
                        {
                            text: `${az.toString().replace(/,/g, "")}${
                                nonpaket.length > 0
                                    ? nonpaket.length + (ix + 1)
                                    : ix + 1
                            }`,
                            rowSpan: e[
                                m
                            ].transaction_penawaran_parameter.filter(
                                (fz) =>
                                    fz.status == 1 && fz.info_id == r.info_id
                            ).length,
                        },
                        {
                            text: `${az.toString().replace(/,/g, "")} ${
                                r.info.split(" - ")[1]
                            }`,
                            rowSpan: e[
                                m
                            ].transaction_penawaran_parameter.filter(
                                (fz) =>
                                    fz.status == 1 && fz.info_id == r.info_id
                            ).length,
                            alignment: "left",
                        },
                        {
                            text: e[m].transaction_penawaran_parameter.filter(
                                (fz) =>
                                    fz.status == 1 && fz.info_id == r.info_id
                            )[0].parameteruji.name_id,
                            alignment: "left",
                        },
                        j.filter((abc) => abc == "METODE").length > 0
                            ? `${
                                  e[m].transaction_penawaran_parameter.filter(
                                      (fz) =>
                                          fz.status == 1 &&
                                          fz.info_id == r.info_id
                                  )[0].metode
                                      ? e[
                                            m
                                        ].transaction_penawaran_parameter.filter(
                                            (fz) =>
                                                fz.status == 1 &&
                                                fz.info_id == r.info_id
                                        )[0].metode.metode
                                      : "-"
                              }`
                            : undefined,
                        j.filter((ab) => ab == "LOD").length > 0
                            ? e[m].transaction_penawaran_parameter.filter(
                                  (fz) =>
                                      fz.status == 1 && fz.info_id == r.info_id
                              )[0].lod
                                ? e[m].transaction_penawaran_parameter.filter(
                                      (fz) =>
                                          fz.status == 1 &&
                                          fz.info_id == r.info_id
                                  )[0].lod.nama_lod
                                : "-"
                            : undefined,
                        j.filter((ab) => ab == "SATUAN").length > 0
                            ? e[m].transaction_penawaran_parameter.filter(
                                  (fz) =>
                                      fz.status == 1 && fz.info_id == r.info_id
                              )[0].unit
                                ? e[m].transaction_penawaran_parameter.filter(
                                      (fz) =>
                                          fz.status == 1 &&
                                          fz.info_id == r.info_id
                                  )[0].unit.nama_unit
                                : "-"
                            : undefined,
                        {
                            text: `${az.toString().replace(/,/g, "")}${
                                e[m].status_pengujian.name
                            }`,
                            rowSpan: e[
                                m
                            ].transaction_penawaran_parameter.filter(
                                (fz) =>
                                    fz.status == 1 && fz.info_id == r.info_id
                            ).length,
                        },
                        {
                            text: `${az.toString().replace(/,/g, "")}${(
                                r.price *
                                (paketaneh.includes(r.info_id)
                                    ? statuskali.filter(
                                          (re) =>
                                              re.id == e[m].id_statuspengujian
                                      )[0].value
                                    : moudetstatuspengujian.length > 0
                                    ? moudetstatuspengujian.filter(
                                          (ze) =>
                                              ze.id == e[m].id_statuspengujian
                                      )[0].value
                                    : e[m].id_statuspengujian)
                            ).toLocaleString()}`,
                            alignment: "right",
                            rowSpan: e[
                                m
                            ].transaction_penawaran_parameter.filter(
                                (fz) =>
                                    fz.status == 1 && fz.info_id == r.info_id
                            ).length,
                        },
                    ]);
                    rows = rows.concat(h);
                });
            }

            if (paketpkm.length > 0) {
                let subpackage = await [];

                await this._paketpkmServ
                    .getDataDetailpaketpkmBySub({
                        data: paketpkm.map((ap: any) => ap.info_id),
                    })
                    .then((x: any) => {
                        x.forEach((c) => {
                            subpackage = subpackage.concat({
                                idpackagepkm: c.pkmpackage.id,
                                packagename: c.pkmpackage.package_name,
                                detail: global
                                    .uniq(
                                        e[
                                            m
                                        ].transaction_penawaran_parameter.filter(
                                            (g) => g.status === 3
                                        ),
                                        (m) => m.info_id
                                    )
                                    .filter(
                                        (rz) =>
                                            rz["info"].split(" - ")[1] ===
                                            c.pkmpackage.package_name
                                    )
                                    .map((pz: any) => ({
                                        ...pz,
                                        jumlah: e[
                                            m
                                        ].transaction_penawaran_parameter
                                            .filter((l) => l.status == 3)
                                            .filter(
                                                (rz) =>
                                                    rz["info"].split(
                                                        " - "
                                                    )[1] ===
                                                    c.pkmpackage.package_name
                                            )
                                            .filter(
                                                (z) =>
                                                    z[
                                                        "parameteruji"
                                                    ].name_id.toLowerCase() ==
                                                    pz[
                                                        "parameteruji"
                                                    ].name_id.toLowerCase()
                                            ).length,
                                    })),
                            });
                        });
                    });

                await subpackage.forEach((cz: any, ix) => {
                    let haz = [];
                    if (cz.detail.length > 1) {
                        for (let ka = 1; ka < cz.detail.length; ka++) {
                            haz.push([
                                "",
                                "",
                                {
                                    text: `${cz.detail[ka].parameteruji.name_id} (${cz.detail[ka].jumlah})`,
                                    alignment: "left",
                                },
                                j.filter((abc) => abc == "METODE").length > 0
                                    ? `${
                                          cz.detail[ka].metode
                                              ? cz.detail[ka].metode.metode
                                              : "-"
                                      }`
                                    : undefined,
                                j.filter((abc) => abc == "LOD").length > 0
                                    ? `${
                                          cz.detail[ka].lod
                                              ? cz.detail[ka].lod.nama_lod
                                              : "-"
                                      }`
                                    : undefined,
                                j.filter((abc) => abc == "SATUAN").length > 0
                                    ? `${
                                          cz.detail[ka].unit
                                              ? cz.detail[ka].unit.nama_unit
                                              : "-"
                                      }`
                                    : undefined,
                                {
                                    text: `${e[m].status_pengujian.name}`,
                                },
                                {
                                    text: `${(
                                        cz.detail[ka].price *
                                        (moudetstatuspengujian.length > 0
                                            ? moudetstatuspengujian.filter(
                                                  (ze) =>
                                                      ze.id ==
                                                      e[m].id_statuspengujian
                                              )[0].value
                                            : e[m].id_statuspengujian)
                                    ).toLocaleString()}`,
                                    alignment: "right",
                                },
                            ]);
                        }
                        rows.push([
                            {
                                text: `${
                                    nonpaket.length > 0 ||
                                    paketparameter.length > 0
                                        ? nonpaket.length +
                                          paketparameter.length +
                                          (ix + 1)
                                        : ix + 1
                                }`,
                                rowSpan: cz.detail.length,
                            },
                            {
                                text: `${cz.packagename}`,
                                rowSpan: cz.detail.length,
                                alignment: "left",
                            },
                            {
                                text: `${cz.detail[0].parameteruji.name_id} (${cz.detail[0].jumlah})`,
                                alignment: "left",
                            },
                            j.filter((abc) => abc == "METODE").length > 0
                                ? `${
                                      cz.detail[0].metode
                                          ? cz.detail[0].metode.metode
                                          : "-"
                                  }`
                                : undefined,
                            j.filter((abc) => abc == "LOD").length > 0
                                ? `${
                                      cz.detail[0].lod
                                          ? cz.detail[0].lod.nama_lod
                                          : "-"
                                  }`
                                : undefined,
                            j.filter((abc) => abc == "SATUAN").length > 0
                                ? `${
                                      cz.detail[0].unit
                                          ? cz.detail[0].unit.nama_unit
                                          : "-"
                                  }`
                                : undefined,
                            {
                                text: `${e[m].status_pengujian.name}`,
                                rowSpan: cz.detail.length,
                            },
                            {
                                text: `${(
                                    cz.detail[0].price *
                                    (moudetstatuspengujian.length > 0
                                        ? moudetstatuspengujian.filter(
                                              (ze) =>
                                                  ze.id ==
                                                  e[m].id_statuspengujian
                                          )[0].value
                                        : e[m].id_statuspengujian)
                                ).toLocaleString()}`,
                                alignment: "right",
                            },
                        ]);

                        rows = rows.concat(haz);
                    } else {
                        rows.push([
                            {
                                text: `${
                                    nonpaket.length > 0 ||
                                    paketparameter.length > 0
                                        ? nonpaket.length +
                                          paketparameter.length +
                                          (ix + 1)
                                        : ix + 1
                                }`,
                                rowSpan: cz.detail.length,
                            },
                            {
                                text: `${cz.packagename}`,
                                rowSpan: cz.detail.length,
                                alignment: "left",
                            },
                            {
                                text: `${cz.detail[0].parameteruji.name_id} (${cz.detail[0].jumlah})`,
                                alignment: "left",
                            },
                            j.filter((abc) => abc == "METODE").length > 0
                                ? `${
                                      cz.detail[0].metode
                                          ? cz.detail[0].metode.metode
                                          : "-"
                                  }`
                                : undefined,
                            j.filter((abc) => abc == "LOD").length > 0
                                ? `${
                                      cz.detail[0].lod
                                          ? cz.detail[0].lod.nama_lod
                                          : "-"
                                  }`
                                : undefined,
                            j.filter((abc) => abc == "SATUAN").length > 0
                                ? `${
                                      cz.detail[0].unit
                                          ? cz.detail[0].unit.nama_unit
                                          : "-"
                                  }`
                                : undefined,
                            {
                                text: `${e[m].status_pengujian.name}`,
                                rowSpan: cz.detail.length,
                            },
                            {
                                text: `${(
                                    cz.detail[0].price *
                                    (moudetstatuspengujian.length > 0
                                        ? moudetstatuspengujian.filter(
                                              (ze) =>
                                                  ze.id ==
                                                  e[m].id_statuspengujian
                                          )[0].value
                                        : e[m].id_statuspengujian)
                                ).toLocaleString()}`,
                                alignment: "right",
                            },
                        ]);

                        rows = rows.concat(haz);
                    }
                });
            }

            for (let fg = 1; fg < rows.length; fg++) {
                rows[fg] = await rows[fg].filter((e) => e !== undefined);
            }

            await rows.push([
                {
                    text: "Subtotal",
                    colSpan:
                        4 +
                        (j.filter((e) => e == "METODE").length > 0 ? 1 : 0) +
                        (j.filter((e) => e == "LOD").length > 0 ? 1 : 0) +
                        (j.filter((e) => e == "SATUAN").length > 0 ? 1 : 0),
                    bold: true,
                },

                j.filter((e) => e == "METODE").length > 0 ? [""] : undefined,
                j.filter((e) => e == "LOD").length > 0 ? [""] : undefined,
                j.filter((e) => e == "SATUAN").length > 0 ? [""] : undefined,

                [""],
                [""],
                [""],
                {
                    text: `${e[m].price > 0 ? e[m].price.toLocaleString() : 0}`,
                    alignment: "right",
                    bold: true,
                },
            ]);

            rows[rows.length - 1] = await rows[rows.length - 1].filter(
                (e) => e
            );

            await rowhead.push([
                {
                    style: ["fontsize8", "margin10", "verticalmiddle"],
                    table: {
                        widths: widths,
                        body: rows,
                        dontBreakRows: true,
                    },
                },
            ]);
        }

        await subtotal.push(
            [
                {
                    text: "BIAYA PENGUJIAN (IDR)",
                    colSpan: 3,
                    style: ["bold", "fontsize8"],
                    alignment: "center",
                },
                "",
                "",
            ],
            [
                {
                    text: "Subtotal",
                    style: "fontsize8",
                    colSpan: 2,
                    alignment: "left",
                },
                "",
                {
                    text:
                        data.payment.totalpembayaran > 0
                            ? data.payment.totalpembayaran.toLocaleString()
                            : data.payment.totalpembayaran,
                    alignment: "right",
                    style: "fontsize8",
                },
            ]
        );

        subtotal = await subtotal.filter((e) => e);
        if (data.payment.hargadiscount > 0) {
            await subtotal.push(
                [
                    {
                        text: "Discount",
                        alignment: "left",
                        style: "fontsize8",
                    },
                    {
                        text:
                            data.payment.discountconv > 0
                                ? `${data.payment.discountconv} %`
                                : "",
                        style: "fontsize8",
                    },
                    {
                        text:
                            data.payment.hargadiscount > 0
                                ? data.payment.hargadiscount.toLocaleString()
                                : data.payment.hargadiscount,
                        alignment: "right",
                        style: "fontsize8",
                    },
                ],
                [
                    {
                        text: "Subtotal Setelah Discount",
                        alignment: "left",
                        colSpan: 2,
                        style: "fontsize8",
                    },
                    "",
                    {
                        text: (
                            data.payment.totalpembayaran -
                            data.payment.hargadiscount
                        ).toLocaleString(),
                        alignment: "right",
                        style: "fontsize8",
                    },
                ],
                data.sampling_trans.length > 0
                    ? [
                          {
                              text: "Biaya Sampling",
                              alignment: "left",
                              colSpan: 2,
                              style: "fontsize8",
                          },
                          "",
                          {
                              text:
                                  data.sampling_trans.length > 0
                                      ? data.sampling_trans
                                            .map((t) => t.total)
                                            .reduce((a, b) => a + b)
                                            .toLocaleString()
                                      : 0,
                              alignment: "right",
                              style: "fontsize8",
                          },
                      ]
                    : undefined
            );
            subtotal = await subtotal.filter((e) => e);
            if (data.format.ppn == 1) {
                await subtotal.push(
                    [
                        {
                            text: "PPN (11%)",
                            alignment: "left",
                            style: "fontsize8",
                            colSpan: 2,
                        },
                        "",
                        {
                            text: data.payment.ppn.toLocaleString(),
                            alignment: "right",
                            style: "fontsize8",
                        },
                    ],
                    data.format.pph == 1
                        ? [
                              {
                                  text: "PPH",
                                  alignment: "left",
                                  style: "fontsize8",
                                  colSpan: 2,
                              },
                              "",
                              {
                                  text: (
                                      (data.payment.totalpembayaran -
                                          data.payment.hargadiscount) *
                                      (2 / 100)
                                  ).toLocaleString(),
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    [
                        {
                            text: "Total",
                            alignment: "left",
                            style: "fontsize8",
                            colSpan: 2,
                        },
                        "",
                        {
                            text: (
                                data.payment.totalpembayaran -
                                data.payment.hargadiscount +
                                (data.sampling_trans.length > 0
                                    ? data.sampling_trans
                                          .map((t) => t.total)
                                          .reduce((a, b) => a + b)
                                    : 0) +
                                data.payment.ppn -
                                (data.format.pph == 1
                                    ? (data.payment.totalpembayaran -
                                          data.payment.hargadiscount) *
                                      (2 / 100)
                                    : 0)
                            ).toLocaleString(),
                            alignment: "right",
                            style: "fontsize8",
                        },
                    ]
                );
                subtotal = await subtotal.filter((e) => e);
            } else {
                await subtotal.push(
                    data.sampling_trans.length > 0
                        ? [
                              {
                                  text: "Biaya Sampling",
                                  alignment: "left",
                                  colSpan: 2,
                                  style: "fontsize8",
                              },
                              "",
                              {
                                  text:
                                      data.sampling_trans.length > 0
                                          ? data.sampling_trans
                                                .map((t) => t.total)
                                                .reduce((a, b) => a + b)
                                                .toLocaleString()
                                          : 0,
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    data.format.pph == 1
                        ? [
                              {
                                  text: "PPH",
                                  alignment: "left",
                                  style: "fontsize8",
                                  colSpan: 2,
                              },
                              "",
                              {
                                  text: (
                                      (data.payment.totalpembayaran -
                                          data.payment.hargadiscount) *
                                      (2 / 100)
                                  ).toLocaleString(),
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    [
                        {
                            text: "Total",
                            alignment: "left",
                            style: "fontsize8",
                            colSpan: 2,
                        },
                        "",
                        {
                            text: (
                                data.payment.totalpembayaran -
                                data.payment.hargadiscount +
                                (data.sampling_trans.length > 0
                                    ? data.sampling_trans
                                          .map((t) => t.total)
                                          .reduce((a, b) => a + b)
                                    : 0) -
                                (data.format.pph == 1
                                    ? (data.payment.totalpembayaran -
                                          data.payment.hargadiscount) *
                                      (2 / 100)
                                    : 0)
                            ).toLocaleString(),
                            alignment: "right",
                            style: "fontsize8",
                        },
                    ]
                );
                subtotal = await subtotal.filter((e) => e);
            }
        } else {
            if (data.format.ppn == 1) {
                await subtotal.push(
                    data.sampling_trans.length > 0
                        ? [
                              {
                                  text: "Biaya Sampling",
                                  alignment: "left",
                                  colSpan: 2,
                                  style: "fontsize8",
                              },
                              "",
                              {
                                  text:
                                      data.sampling_trans.length > 0
                                          ? data.sampling_trans
                                                .map((t) => t.total)
                                                .reduce((a, b) => a + b)
                                                .toLocaleString()
                                          : 0,
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    [
                        {
                            text: "PPN (11%)",
                            alignment: "left",
                            style: "fontsize8",
                            colSpan: 2,
                        },
                        "",
                        {
                            text: data.payment.ppn.toLocaleString(),
                            alignment: "right",
                            style: "fontsize8",
                        },
                    ],
                    data.format.pph == 1
                        ? [
                              {
                                  text: "PPH",
                                  alignment: "left",
                                  style: "fontsize8",
                                  colSpan: 2,
                              },
                              "",
                              {
                                  text: (
                                      (data.payment.totalpembayaran -
                                          data.payment.hargadiscount) *
                                      (2 / 100)
                                  ).toLocaleString(),
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    [
                        {
                            text: "Total",
                            alignment: "left",
                            style: "fontsize8",
                            colSpan: 2,
                        },
                        "",
                        {
                            text: (
                                data.payment.totalpembayaran -
                                data.payment.hargadiscount +
                                data.payment.ppn +
                                (data.sampling_trans.length > 0
                                    ? data.sampling_trans
                                          .map((t) => t.total)
                                          .reduce((a, b) => a + b)
                                    : 0) -
                                (data.format.pph == 1
                                    ? (data.payment.totalpembayaran -
                                          data.payment.hargadiscount) *
                                      (2 / 100)
                                    : 0)
                            ).toLocaleString(),
                            alignment: "right",
                            style: "fontsize8",
                        },
                    ]
                );
                subtotal = await subtotal.filter((e) => e);
            } else {
                await subtotal.push(
                    data.sampling_trans.length > 0
                        ? [
                              {
                                  text: "Biaya Sampling",
                                  alignment: "left",
                                  colSpan: 2,
                                  style: "fontsize8",
                              },
                              "",
                              {
                                  text:
                                      data.sampling_trans.length > 0
                                          ? data.sampling_trans
                                                .map((t) => t.total)
                                                .reduce((a, b) => a + b)
                                                .toLocaleString()
                                          : 0,
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    data.format.pph == 1
                        ? [
                              {
                                  text: "PPH",
                                  alignment: "left",
                                  style: "fontsize8",
                                  colSpan: 2,
                              },
                              "",
                              {
                                  text: (
                                      (data.payment.totalpembayaran -
                                          data.payment.hargadiscount) *
                                      (2 / 100)
                                  ).toLocaleString(),
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    [
                        {
                            text: "Total",
                            alignment: "left",
                            colSpan: 2,
                            style: "fontsize8",
                        },
                        "",
                        {
                            text: (
                                data.payment.totalpembayaran -
                                data.payment.hargadiscount +
                                (data.sampling_trans.length > 0
                                    ? data.sampling_trans
                                          .map((t) => t.total)
                                          .reduce((a, b) => a + b)
                                    : 0) -
                                (data.format.pph == 1
                                    ? (data.payment.totalpembayaran -
                                          data.payment.hargadiscount) *
                                      (2 / 100)
                                    : 0)
                            ).toLocaleString(),
                            alignment: "right",
                            style: "fontsize8",
                        },
                    ]
                );
                subtotal = await subtotal.filter((e) => e);
            }
        }

        const def = await {
            pageSize: "A4",
            pageMargins: [35, 80, 35, 60],
            pageOrientation: "portrait",
            header: function (currentPage, pageCount) {
                if (currentPage == 2) {
                    return [
                        {
                            columns: [
                                // {
                                //     image: siglogo,
                                //     width: 150,
                                //     style: "margin30",
                                // },
                                {
                                    style: ["testing2", "fontsize"],
                                    alignment: "right",
                                    layout: "noBorders",
                                    table: {
                                        widths: ["*"],
                                        body: [
                                            [""],
                                            [
                                                {
                                                    text: `Page ${currentPage} of ${pageCount}`,
                                                    alignment: "right",
                                                },
                                            ],
                                            [
                                                {
                                                    text: data.no_penawaran,
                                                    alignment: "right",
                                                },
                                            ],
                                        ],
                                    },
                                },
                            ],
                        },
                    ];
                } else if (currentPage > 2) {
                    return [
                        {
                            columns: [
                                // {
                                //     image: siglogo,
                                //     width: 150,
                                //     style: "margin30",
                                // },
                                {
                                    style: ["testing2", "fontsize"],
                                    alignment: "right",
                                    layout: "noBorders",
                                    table: {
                                        widths: ["*"],
                                        body: [
                                            [
                                                {
                                                    text: `Page ${currentPage} of ${pageCount}`,
                                                    alignment: "right",
                                                },
                                            ],
                                            [
                                                {
                                                    text: data.no_penawaran,
                                                    alignment: "right",
                                                },
                                            ],
                                        ],
                                    },
                                },
                            ],
                        },
                    ];
                } else {
                    return [
                        {
                            image: siglogo,
                            width: 150,
                            style: "margin30",
                        },
                    ];
                }
            },
            content: [
                {
                    style: "marginbawah30",
                    widths: ["*", "*"],
                    aligment: "justify",
                    columns: [
                        {
                            margin: [10, 0],
                            style: "fontsize8",
                            layout: "noBorders",
                            table: {
                                widths: [150],
                                body: [
                                    [{ text: `Kepada Yth` }],
                                    [
                                        {
                                            text: data.customers_handle
                                                .contact_person.name,
                                        },
                                    ],
                                    [
                                        {
                                            text: data.customers_handle
                                                .customers.customer_name,
                                        },
                                    ],
                                    [
                                        {
                                            text:
                                                data.customers_handle.email ==
                                                "NOT SET"
                                                    ? "-"
                                                    : data.customers_handle
                                                          .email,
                                        },
                                    ],
                                    [
                                        {
                                            text: `${
                                                data.customers_handle.phone &&
                                                data.customers_handle.phone !==
                                                    "-"
                                                    ? formatphonecode +
                                                      formatphone
                                                    : "-"
                                            } / ${
                                                data.customers_handle.telp &&
                                                data.customers_handle.telp !==
                                                    "-"
                                                    ? formatphonecode +
                                                      formattelp
                                                    : "-"
                                            }`,
                                        },
                                    ],
                                ],
                            },
                        },
                        {
                            style: ["termpenawaran", "fontsize8"],
                            layout: "noBorders",
                            table: {
                                widths: [130, 10, 150],
                                margin: [10, 0],
                                body: [
                                    [`Nomor Penawaran`, ":", data.no_penawaran],
                                    [
                                        `Tanggal`,
                                        ":",
                                        _moment(data.created_at).format(
                                            "DD MMMM YYYY"
                                        ),
                                    ],
                                ],
                            },
                        },
                    ],
                },
                {
                    widths: ["*"],
                    aligment: "justify",
                    style: ["margin10", "fontsize8"],
                    columns: [
                        {
                            text: `Dengan Hormat.
                            Menjawab permintaan ${
                                data.customers_handle.contact_person.gender ==
                                "L"
                                    ? "Bapak"
                                    : "Ibu"
                            } terkait pengujian laboratorium dengan ini kami sampaikan penawaran harga uji sebagai berikut:`,
                        },
                    ],
                },
                {
                    style: ["marginatas10", "fontsize8"],
                    layout: "noBorders",
                    table: {
                        widths: ["*"],
                        body: rowhead,
                        // dontBreakRows: true,
                    },
                    alignment: "center",
                },
                {
                    style: ["marginatas40", "marginDalam", "marginawal"],
                    margin: [10, 20],
                    table: {
                        widths: ["*", 20, "*"],
                        style: "fontsize8",
                        body: subtotal,
                        dontBreakRows: true,
                    },
                },

                {
                    style: [
                        "marginatas20",
                        "marginDalam",
                        "marginawal",
                        "fontsize8",
                    ],
                    layout: "noBorders",
                    margin: [10, 5],
                    table: {
                        widths: ["*"],
                        body: [
                            [
                                {
                                    text: "Catatan",
                                    style: "bold",
                                },
                            ],
                            [data.internal_notes],
                        ],
                    },
                },
                {
                    style: [
                        "marginatas10",
                        "marginDalam",
                        "marginawal",
                        "fontsize8",
                    ],
                    layout: "noBorders",
                    margin: [10, 5],
                    table: {
                        widths: [80, 5, "*"],
                        body: [
                            [
                                {
                                    text: `${
                                        data.format.dp == 1
                                            ? "Pelanggan diharap melakukan pembayaran uang muka sebesar 50% dari total biaya pengujian dan p"
                                            : "P"
                                    }elunasan sebelum tanggal estimasi uji selesai melalui transfer ke rekening :`,
                                    colSpan: 3,
                                },
                                "",
                                "",
                            ],
                            ["Nama Bank", ":", `Bank Mandiri, Cabang Juanda`],
                            ["Atas Nama", ":", `PT. Saraswanti Indo Genetech`],
                            ["No. Rekening", ":", `133.000.1160.811`],
                            ["", "", ""],
                            ["", "", ""],
                            [
                                {
                                    text: `Kirimkan bukti pembayaran ke email sales terkait dan atau paymentinfo-sig@saraswanti.com dan harap lampirkan surat penawaran saat proses memasukan sampel`,
                                    colSpan: 3,
                                },
                                "",
                                "",
                            ],
                            ["", "", ""],
                            [
                                {
                                    text: `Harga yang tercantum pada surat penawaran berikut dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu dan hanya berlaku untuk sampel sesuai pada surat penawaran.`,
                                    colSpan: 3,
                                },
                                "",
                                "",
                            ],
                            ["", "", ""],
                            [
                                {
                                    text: `Demikian penawaran ini kami sampaikan, atas perhatian serta kerjasama yang baik kami mengucapkan terima kasih.`,
                                    colSpan: 3,
                                },
                                "",
                                "",
                            ],
                            ["", "", ""],
                            ["", "", ""],
                        ],
                        dontBreakRows: true,
                    },
                },
                {
                    style: ["marginDalam", "fontsize8"],
                    layout: "noBorders",
                    margin: [10, 0],
                    table: {
                        widths: ["*"],
                        body: [
                            [
                                {
                                    layout: "noBorders",
                                    table: {
                                        widths: ["*"],
                                        body: [
                                            [
                                                {
                                                    text: `Hormat Kami,
                                                    PT. Saraswanti Indo Genetech`,
                                                },
                                            ],
                                            [""],
                                            [""],
                                            [""],
                                            [""],
                                            [
                                                {
                                                    text: `${
                                                        data.sales_name
                                                            .employee_name
                                                    }
                                                ${
                                                    data.sales_name.position
                                                        ? data.sales_name
                                                              .position
                                                              .position_name
                                                        : "-"
                                                }
                                                ${
                                                    data.sales_name.phone
                                                        ? `+62 ${data.sales_name.phone}`
                                                        : "-"
                                                }`,
                                                },
                                            ],
                                        ],
                                        dontBreakRows: true,
                                    },
                                },
                            ],
                            [
                                {
                                    table: {
                                        widths: ["*"],
                                        heights: [80],
                                        body: [
                                            [
                                                {
                                                    text: "Catatan Tambahan",
                                                    style: "bold",
                                                },
                                            ],
                                        ],
                                        dontBreakRows: true,
                                    },
                                },
                            ],
                            [
                                {
                                    table: {
                                        widths: ["*"],
                                        heights: [80, "auto", "auto"],
                                        body: [
                                            [
                                                {
                                                    border: [
                                                        true,
                                                        true,
                                                        true,
                                                        false,
                                                    ],
                                                    text: "Dengan ini Saya setuju atas penawaran yang diberikan",
                                                    style: "bold",
                                                },
                                            ],
                                            [
                                                {
                                                    border: [
                                                        true,
                                                        false,
                                                        true,
                                                        false,
                                                    ],
                                                    text: "___________________________________________________",
                                                },
                                            ],
                                            [
                                                {
                                                    border: [
                                                        true,
                                                        false,
                                                        true,
                                                        true,
                                                    ],
                                                    text: "Nama Pelanggan/Tanda Tangan/Tanggal/Cap Basah",
                                                },
                                            ],
                                        ],
                                        dontBreakRows: true,
                                    },
                                },
                            ],
                        ],
                        dontBreakRows: true,
                    },
                },
                {
                    text: "",
                    pageBreak: "after",
                    style: "marginawal",
                    // or after
                },
                tablecolumn3,
            ],
            footer: {
                columns: [
                    {
                        layout: "noBorders",
                        style: "tested",
                        table: {
                            widths: ["*", "*", 50, 120],
                            body: [
                                [
                                    {
                                        image: towards,
                                        width: 90,
                                        style: "marginminussetengah",
                                    },
                                    {
                                        text:
                                            data.contract_type !== 4
                                                ? `PT SARASWANTI INDO GENETECH
                                        Graha SIG Jl. Rasamala No. 20 Taman Yasmin
                                        Bogor 16113 INDONESIA
                                        Phone +62 251 7532 348 49 ( Hunting ), 0821 1151 6516
                                        Fax +62 251 7540 927
                                        www.siglaboratory.com`
                                                : `AMG Tower Lt.12
                                        Jl. Dukuh Menanggal No.1 A, Kec. Gayungan, 
                                        Kota SBY, Jawa Timur 60234
                                        Phone +62 31 82531288 / +62 31 82531889, +62 81 888 5165`,
                                        alignment: "left",
                                        style: "marginminus",
                                    },
                                    {
                                        image: ilac,
                                        width: 40,
                                        style: "marginminus",
                                        alignment: "right",
                                    },
                                    {
                                        image: kan,
                                        width: 60,
                                        style: "marginminussetengahaja",
                                        alignment: "right",
                                    },
                                ],
                            ],
                        },
                    },
                ],
            },
            styles: styles,
            unbreakable: true,
            defaultStyle: {
                // alignment: 'justify'
                // font: 'din',
                columnGap: 5,
            },
        };
        (await string) == "download"
            ? this.pdfMake.createPdf(def).download(`${data.no_penawaran}.pdf`)
            : this.pdfMake.createPdf(def).open();
    }

    async generatePdfPenawaranPreview(data) {
        let picsales = await [];
        await this._employeeServ
            .getDataDetail(data.clienthandling)
            .then((x) => (picsales = picsales.concat(x)));
        await this.loadPdfMaker();

        var dataP = data;
        var format = data.format;
        var rowhead = await [];
        var subtotal = [];
        var moudetstatuspengujian =
            data.custhandle.mou?.detail.filter((r) => r.condition == 1).length >
            0
                ? data.custhandle.mou.detail.map((ap) => {
                      return {
                          id: ap.id_status_pengujian,
                          value: ap.values,
                      };
                  })
                : [];

        var formatphonecode = data.custhandle.phone_code;
        var formattelp =
            data.custhandle.telpnumber.substr(0, 1) == "0"
                ? data.custhandle.telpnumber.substr(1)
                : data.custhandle.telpnumber;
        var formatphone =
            data.custhandle.phonenumber.substr(0, 1) == "0"
                ? data.custhandle.phonenumber.substr(1)
                : data.custhandle.phonenumber;

        for (let m = 0; m < data.sample.length; m++) {
            let statuskali = [
                {
                    id: 2,
                    value: 1.5,
                },
                {
                    id: 3,
                    value: 2,
                },
                {
                    id: 1,
                    value: 1,
                },
            ];

            let e = data.sample;
            var rows = await [];
            var widths = await [];

            let a = await {
                text: "",
            };

            let z = await Object.entries(format);
            let j = await z
                .filter(
                    ([key, value]) =>
                        value &&
                        !["ppn", "pph", "dp", "id_tp", "id"].includes(key)
                )
                .map((m) => {
                    return m[0].toUpperCase();
                });
            let textsub =
                (await e[m].batch_number) || e[m].kode_sample
                    ? `\n${
                          e[m].batch_number
                              ? "batch : " + e[m].batch_number
                              : ""
                      } ${
                          e[m].kode_sample
                              ? "sample code :" + e[m].kode_sample
                              : ""
                      }`
                    : "";
            await rows.push([
                {
                    text: `${m + 1}. ${e[m].samplename} ${textsub}\n\n`,
                    colSpan: j.length + 5,
                    alignment: "left",
                    border: [false, false, false, true],
                    style: [m < 1 ? "marginatas0" : "marginatas20"],
                },
            ]);

            for (let l = 1; l < j.length + 5; l++) {
                rows[0] = await rows[0].concat(a);
            }

            await rows.push([
                {
                    text: "NO",
                },
                {
                    text: "JENIS",
                },
                {
                    text: "PARAMETER",
                },
            ]);

            rows[1] = await rows[1].concat(j);

            rows[1] = await rows[1].concat(
                { text: "PENGUJIAN" },
                { text: "HARGA (IDR)" }
            );

            await rows[1].forEach((c, mc) => {
                if (mc == 0) {
                    widths.push(13);
                } else if (mc == 1) {
                    widths.push(80);
                } else if (mc == 2) {
                    widths.push(150);
                } else if (mc == rows[1].length - 1) {
                    widths.push("*");
                } else if (mc == rows[1].length - 2) {
                    widths.push("*");
                } else if (mc == rows[1].length - 3) {
                    widths.push("*");
                } else {
                    widths.push("*");
                }
            });

            let nonpaket = await e[m].parameter.nonpaketparameter;
            let paketparameter = await e[m].parameter.paketparameter;
            let paketpkm = await e[m].parameter.paketPKM;

            if (nonpaket.length > 0) {
                await nonpaket.forEach((a, c) => {
                    rows.push([
                        `${c + 1}`,
                        {
                            text: "Non Paket",
                            alignment: "left",
                        },
                        {
                            text: `${a.parameteruji_name}`,
                            alignment: "left",
                        },

                        j.filter((e) => e === "METODE").length > 0
                            ? `${a.metode ? a.metode.metode : "-"}`
                            : undefined,
                        j.filter((e) => e === "LOD").length > 0
                            ? `${a.lod ? a.lod.nama_lod : "-"}`
                            : undefined,
                        j.filter((e) => e === "SATUAN").length > 0
                            ? `${a.unit ? a.unit.nama_unit : "-"}`
                            : undefined,

                        `${
                            e[m].parameter.statuspengujian == 1
                                ? "Normal"
                                : e[m].parameter.statuspengujian == 2
                                ? "Urgent"
                                : e[m].parameter.statuspengujian == 3
                                ? "Very Urgent"
                                : e[m].parameter.statuspengujian == 4
                                ? "Custom 2 Hari"
                                : "Custom 1 Hari"
                        }`,
                        {
                            text: `${(
                                a.price *
                                (moudetstatuspengujian.length > 0
                                    ? moudetstatuspengujian.filter(
                                          (ze) => ze.id == e[m].parameter.statuspengujian
                                      )[0].value
                                    : e[m].parameter.statuspengujian)
                            ).toLocaleString()}`,
                            alignment: "right",
                        },
                    ]);
                });
            }

            if (paketparameter.length > 0) {
                var paketaneh = [4691, 4697];
                paketparameter.forEach((r: any, ix) => {
                    let h = [];


                    for (let k = 1; k < r.paketparameter.length; k++) {
                        h.push([
                            "",
                            "",
                            {
                                text: `${r.paketparameter[k].parameteruji.length > 0 ? r.paketparameter[k].parameteruji[0].name_id : r.paketparameter[k].parameteruji.name_id}`,
                                alignment: "left",
                            },

                            j.filter((abc) => abc == "METODE").length > 0
                                ? `${
                                      r.paketparameter[k].metode
                                          ? r.paketparameter[k].metode.metode
                                          : "-"
                                  }`
                                : undefined,
                            j.filter((abc) => abc == "LOD").length > 0
                                ? `${
                                      r.paketparameter[k].lod
                                          ? r.paketparameter[k].lod.nama_lod
                                          : "-"
                                  }`
                                : undefined,
                            j.filter((ab) => ab == "SATUAN").length > 0
                                ? `${
                                      r.paketparameter[k].unit
                                          ? r.paketparameter[k].unit.nama_unit
                                          : "-"
                                  }`
                                : undefined,
                            ``,
                            "",
                        ]);
                    }
                    rows.push([
                        {
                            text: `${
                                nonpaket.length > 0
                                    ? nonpaket.length + (ix + 1)
                                    : ix + 1
                            }`,
                            rowSpan: r.paketparameter.length,
                        },
                        {
                            text: `${
                                r.nama_paketuji
                            }`,
                            rowSpan: r.paketparameter.length,
                            alignment: "left",
                        },
                        {
                            text: r.paketparameter[0].parameteruji.length > 0 ? r.paketparameter[0].parameteruji[0].name_id : r.paketparameter[0].parameteruji.name_id,
                            alignment: "left",
                        },
                        j.filter((abc) => abc == "METODE").length > 0
                            ? `${
                                  r.paketparameter[0].metode
                                      ? r.paketparameter[0].metode.metode
                                      : "-"
                              }`
                            : undefined,
                        j.filter((ab) => ab == "LOD").length > 0
                            ? r.paketparameter[0].lod
                                ? r.paketparameter[0].lod.nama_lod
                                : "-"
                            : undefined,
                        j.filter((ab) => ab == "SATUAN").length > 0
                            ? r.paketparameter[0].unit
                                ? r.paketparameter[0].unit.nama_unit
                                : "-"
                            : undefined,
                        {
                            text: `${
                                e[m].parameter.statuspengujian == 1
                                    ? "Normal"
                                    : e[m].parameter.statuspengujian == 2
                                    ? "Urgent"
                                    : e[m].parameter.statuspengujian == 3
                                    ? "Very Urgent"
                                    : e[m].parameter.statuspengujian == 4
                                    ? "Custom 2 Hari"
                                    : "Custom 1 Hari"
                            }`,
                            rowSpan: r.paketparameter.length,
                        },
                        {
                            text: `${(
                                r.price *
                                (paketaneh.includes(r.info_id)
                                    ? statuskali.filter(
                                          (re) => re.id == e[m].parameter.statuspengujian
                                      )[0].value
                                    : moudetstatuspengujian.length > 0
                                    ? moudetstatuspengujian.filter(
                                          (ze) => ze.id == e[m].parameter.statuspengujian
                                      )[0].value
                                    : e[m].parameter.statuspengujian)
                            ).toLocaleString()}`,
                            alignment: "right",
                            rowSpan: r.paketparameter.length,
                        },
                    ]);
                    rows = rows.concat(h);
                });
            }

            if (paketpkm.length > 0) {
                let subpackage = await paketpkm;
                
                // await this._paketpkmServ
                //     .getDataDetailpaketpkmBySub({
                //         data: paketpkm.map((ap: any) => ap.info_id),
                //     })
                //     .then((x: any) => {
                //         x.forEach((c) => {
                //             subpackage = subpackage.concat({
                //                 idpackagepkm: c.pkmpackage.id,
                //                 packagename: c.pkmpackage.package_name,
                //                 detail: global
                //                     .uniq(
                //                         e[
                //                             m
                //                         ].transaction_penawaran_parameter.filter(
                //                             (g) => g.status === 3
                //                         ),
                //                         (m) => m.info_id
                //                     )
                //                     .filter(
                //                         (rz) =>
                //                             rz["info"].split(" - ")[1] ===
                //                             c.pkmpackage.package_name
                //                     )
                //                     .map((pz: any) => ({
                //                         ...pz,
                //                         jumlah: e[
                //                             m
                //                         ].transaction_penawaran_parameter
                //                             .filter((l) => l.status == 3)
                //                             .filter(
                //                                 (rz) =>
                //                                     rz["info"].split(
                //                                         " - "
                //                                     )[1] ===
                //                                     c.pkmpackage.package_name
                //                             )
                //                             .filter(
                //                                 (z) =>
                //                                     z[
                //                                         "parameteruji"
                //                                     ].name_id.toLowerCase() ==
                //                                     pz[
                //                                         "parameteruji"
                //                                     ].name_id.toLowerCase()
                //                             ).length,
                //                     })),
                //             });
                //         });
                //     });

                await subpackage.forEach((cz: any, ix) => {
                    let haz = [];
                    if (cz.subpackage.length > 1) {
                        for (let ka = 1; ka < cz.subpackage.length; ka++) {
                            haz.push([
                                "",
                                "",
                                {
                                    text: `${cz.subpackage[ka].subpackage_name} (${cz.subpackage[ka].jumlah})`,
                                    alignment: "left",
                                },
                                j.filter((abc) => abc == "METODE").length > 0
                                    ? `${
                                          cz.subpackage[ka].detail_specific[0].metode
                                              ? cz.subpackage[ka].detail_specific[0].metode.metode
                                              : "-"
                                      }`
                                    : undefined,
                                j.filter((abc) => abc == "LOD").length > 0
                                    ? `${
                                        cz.subpackage[ka].detail_specific[0].lod
                                              ? cz.subpackage[ka].detail_specific[0].lod.nama_lod
                                              : "-"
                                      }`
                                    : undefined,
                                j.filter((abc) => abc == "SATUAN").length > 0
                                    ? `${
                                          cz.subpackage[ka].detail_specific[0].unit
                                              ? cz.subpackage[ka].detail_specific[0].unit.nama_unit
                                              : "-"
                                      }`
                                    : undefined,
                                {
                                    text: `${
                                        e[m].parameter.statuspengujian == 1
                                            ? "Normal"
                                            : e[m].parameter.statuspengujian == 2
                                            ? "Urgent"
                                            : e[m].parameter.statuspengujian == 3
                                            ? "Very Urgent"
                                            : e[m].parameter.statuspengujian == 4
                                            ? "Custom 2 Hari"
                                            : "Custom 1 Hari"
                                    }`,
                                },
                                {
                                    text: `${(
                                        cz.subpackage[ka].price *
                                        (moudetstatuspengujian.length > 0
                                            ? moudetstatuspengujian.filter(
                                                  (ze) =>
                                                      ze.id ==
                                                      e[m].parameter.statuspengujian
                                              )[0].value
                                            : e[m].parameter.statuspengujian)
                                    ).toLocaleString()}`,
                                    alignment: "right",
                                },
                            ]);
                        }
                        rows.push([
                            {
                                text: `${
                                    nonpaket.length > 0 ||
                                    paketparameter.length > 0
                                        ? nonpaket.length +
                                          paketparameter.length +
                                          (ix + 1)
                                        : ix + 1
                                }`,
                                rowSpan: cz.subpackage.length,
                            },
                            {
                                text: `${cz.nama_paketpkm}`,
                                rowSpan: cz.subpackage.length,
                                alignment: "left",
                            },
                            {
                                text: `${cz.subpackage[0].subpackage_name} (${cz.subpackage[0].jumlah})`,
                                alignment: "left",
                            },
                            j.filter((abc) => abc == "METODE").length > 0
                                ? `${
                                      cz.subpackage[0].detail_specific[0].metode
                                          ? cz.subpackage[0].detail_specific[0].metode.metode
                                          : "-"
                                  }`
                                : undefined,
                            j.filter((abc) => abc == "LOD").length > 0
                                ? `${
                                      cz.subpackage[0].detail_specific[0].lod
                                          ? cz.subpackage[0].detail_specific[0].lod.nama_lod
                                          : "-"
                                  }`
                                : undefined,
                            j.filter((abc) => abc == "SATUAN").length > 0
                                ? `${
                                      cz.subpackage[0].detail_specific[0].unit
                                          ? cz.subpackage[0].detail_specific[0].unit.nama_unit
                                          : "-"
                                  }`
                                : undefined,
                            {
                                text: `${e[m].parameter.statuspengujian == 1
                                    ? "Normal"
                                    : e[m].parameter.statuspengujian == 2
                                    ? "Urgent"
                                    : e[m].parameter.statuspengujian == 3
                                    ? "Very Urgent"
                                    : e[m].parameter.statuspengujian == 4
                                    ? "Custom 2 Hari"
                                    : "Custom 1 Hari"}`,
                                rowSpan: cz.subpackage.length,
                            },
                            {
                                text: `${(
                                    cz.subpackage[0].price *
                                    (moudetstatuspengujian.length > 0
                                        ? moudetstatuspengujian.filter(
                                              (ze) =>
                                                  ze.id ==
                                                  e[m].parameter.statuspengujian
                                          )[0].value
                                        : e[m].parameter.statuspengujian)
                                ).toLocaleString()}`,
                                alignment: "right",
                            },
                        ]);

                        rows = rows.concat(haz);
                    } else {
                        rows.push([
                            {
                                text: `${
                                    nonpaket.length > 0 ||
                                    paketparameter.length > 0
                                        ? nonpaket.length +
                                          paketparameter.length +
                                          (ix + 1)
                                        : ix + 1
                                }`,
                                rowSpan: cz.subpackage.length,
                            },
                            {
                                text: `${cz.nama_paketpkm}`,
                                rowSpan: cz.subpackage.length,
                                alignment: "left",
                            },
                            {
                                text: `${cz.subpackage[0].subpackage_name} (${cz.subpackage[0].jumlah})`,
                                alignment: "left",
                            },
                            j.filter((abc) => abc == "METODE").length > 0
                                ? `${
                                      cz.subpackage[0].detail_specific[0].metode
                                          ? cz.subpackage[0].detail_specific[0].metode.metode
                                          : "-"
                                  }`
                                : undefined,
                            j.filter((abc) => abc == "LOD").length > 0
                                ? `${
                                      cz.subpackage[0].detail_specific[0].lod
                                          ? cz.subpackage[0].detail_specific[0].lod.nama_lod
                                          : "-"
                                  }`
                                : undefined,
                            j.filter((abc) => abc == "SATUAN").length > 0
                                ? `${
                                      cz.subpackage[0].detail_specific[0].unit
                                          ? cz.subpackage[0].detail_specific[0].unit.nama_unit
                                          : "-"
                                  }`
                                : undefined,
                            {
                                text: `${e[m].parameter.statuspengujian == 1
                                    ? "Normal"
                                    : e[m].parameter.statuspengujian == 2
                                    ? "Urgent"
                                    : e[m].parameter.statuspengujian == 3
                                    ? "Very Urgent"
                                    : e[m].parameter.statuspengujian == 4
                                    ? "Custom 2 Hari"
                                    : "Custom 1 Hari"}`,
                                rowSpan: cz.subpackage.length,
                            },
                            {
                                text: `${(
                                    cz.subpackage[0].price *
                                    (moudetstatuspengujian.length > 0
                                        ? moudetstatuspengujian.filter(
                                              (ze) =>
                                                  ze.id ==
                                                  e[m].parameter.statuspengujian
                                          )[0].value
                                        : e[m].parameter.statuspengujian)
                                ).toLocaleString()}`,
                                alignment: "right",
                            },
                        ]);

                        rows = rows.concat(haz);
                    }
                });
            }

            for (let fg = 1; fg < rows.length; fg++) {
                rows[fg] = await rows[fg].filter((e) => e !== undefined);
            }

            await rows.push([
                {
                    text: "Subtotal",
                    colSpan:
                        4 +
                        (j.filter((e) => e == "METODE").length > 0 ? 1 : 0) +
                        (j.filter((e) => e == "LOD").length > 0 ? 1 : 0) +
                        (j.filter((e) => e == "SATUAN").length > 0 ? 1 : 0),
                    bold: true,
                },

                j.filter((e) => e == "METODE").length > 0 ? [""] : undefined,
                j.filter((e) => e == "LOD").length > 0 ? [""] : undefined,
                j.filter((e) => e == "SATUAN").length > 0 ? [""] : undefined,

                [""],
                [""],
                [""],
                {
                    text: `${e[m].parameter.price > 0 ? e[m].parameter.price.toLocaleString() : 0}`,
                    alignment: "right",
                    bold: true,
                },
            ]);

            rows[rows.length - 1] = await rows[rows.length - 1].filter(
                (e) => e
            );

            await rowhead.push([
                {
                    style: ["fontsize8", "margin10", "verticalmiddle"],
                    table: {
                        widths: widths,
                        body: rows,
                        dontBreakRows: true,
                    },
                },
            ]);
        }

        await subtotal.push(
            [
                {
                    text: "BIAYA PENGUJIAN (IDR)",
                    colSpan: 3,
                    style: ["bold", "fontsize8"],
                    alignment: "center",
                },
                "",
                "",
            ],
            [
                {
                    text: "Subtotal",
                    style: "fontsize8",
                    colSpan: 2,
                    alignment: "left",
                },
                "",
                {
                    text:
                        data.totalpembayaran > 0
                            ? data.totalpembayaran.toLocaleString()
                            : data.totalpembayaran,
                    alignment: "right",
                    style: "fontsize8",
                },
            ]
        );

        subtotal = await subtotal.filter((e) => e);
        if (data.hasilDiscount > 0) {
            await subtotal.push(
                [
                    {
                        text: "Discount",
                        alignment: "left",
                        style: "fontsize8",
                    },
                    {
                        text: data.discount > 0 ? `${data.discount} %` : "",
                        style: "fontsize8",
                    },
                    {
                        text:
                            data.hasilDiscount > 0
                                ? data.hasilDiscount.toLocaleString()
                                : data.hasilDiscount,
                        alignment: "right",
                        style: "fontsize8",
                    },
                ],
                [
                    {
                        text: "Subtotal Setelah Discount",
                        alignment: "left",
                        colSpan: 2,
                        style: "fontsize8",
                    },
                    "",
                    {
                        text: (
                            data.totalpembayaran - data.hasilDiscount
                        ).toLocaleString(),
                        alignment: "right",
                        style: "fontsize8",
                    },
                ],
                data.datasampling.length > 0
                    ? [
                          {
                              text: "Biaya Sampling",
                              alignment: "left",
                              colSpan: 2,
                              style: "fontsize8",
                          },
                          "",
                          {
                              text:
                                  data.datasampling.length > 0
                                      ? data.datasampling
                                            .map((t) => t.total)
                                            .reduce((a, b) => a + b)
                                            .toLocaleString()
                                      : 0,
                              alignment: "right",
                              style: "fontsize8",
                          },
                      ]
                    : undefined
            );
            subtotal = await subtotal.filter((e) => e);
            if (data.format.ppn == 1) {
                await subtotal.push(
                    [
                        {
                            text: "PPN (11%)",
                            alignment: "left",
                            style: "fontsize8",
                            colSpan: 2,
                        },
                        "",
                        {
                            text: parseInt(data.ppn.toFixed()).toLocaleString(),
                            alignment: "right",
                            style: "fontsize8",
                        },
                    ],
                    data.format.pph == 1
                        ? [
                              {
                                  text: "PPH",
                                  alignment: "left",
                                  style: "fontsize8",
                                  colSpan: 2,
                              },
                              "",
                              {
                                  text: ((
                                      (data.totalpembayaran -
                                          data.hasilDiscount) *
                                      (2 / 100)
                                  ).toFixed()).toLocaleString(),
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    [
                        {
                            text: "Total",
                            alignment: "left",
                            style: "fontsize8",
                            colSpan: 2,
                        },
                        "",
                        {
                            text: parseInt((
                                data.totalpembayaran -
                                data.hasilDiscount +
                                (data.datasampling.length > 0
                                    ? data.datasampling
                                          .map((t) => t.total)
                                          .reduce((a, b) => a + b)
                                    : 0) +
                                data.ppn -
                                (data.format.pph == 1
                                    ? (data.totalpembayaran -
                                          data.hasilDiscount) *
                                      (2 / 100)
                                    : 0)
                            ).toFixed()).toLocaleString(),
                            alignment: "right",
                            style: "fontsize8",
                        },
                    ]
                );
                subtotal = await subtotal.filter((e) => e);
            } else {
                await subtotal.push(
                    data.datasampling.length > 0
                        ? [
                              {
                                  text: "Biaya Sampling",
                                  alignment: "left",
                                  colSpan: 2,
                                  style: "fontsize8",
                              },
                              "",
                              {
                                  text:
                                      data.datasampling.length > 0
                                          ? data.datasampling
                                                .map((t) => t.total)
                                                .reduce((a, b) => a + b)
                                                .toLocaleString()
                                          : 0,
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    data.format.pph == 1
                        ? [
                              {
                                  text: "PPH",
                                  alignment: "left",
                                  style: "fontsize8",
                                  colSpan: 2,
                              },
                              "",
                              {
                                  text: parseInt((
                                      (data.totalpembayaran -
                                          data.hasilDiscount) *
                                      (2 / 100)
                                  ).toFixed()).toLocaleString(),
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    [
                        {
                            text: "Total",
                            alignment: "left",
                            style: "fontsize8",
                            colSpan: 2,
                        },
                        "",
                        {
                            text: (
                                data.totalpembayaran -
                                data.hasilDiscount +
                                (data.datasampling.length > 0
                                    ? data.datasampling
                                          .map((t) => t.total)
                                          .reduce((a, b) => a + b)
                                    : 0) -
                                (data.format.pph == 1
                                    ? parseInt(((data.totalpembayaran -
                                          data.hasilDiscount) *
                                      (2 / 100)).toFixed())
                                    : 0)
                            ).toLocaleString(),
                            alignment: "right",
                            style: "fontsize8",
                        },
                    ]
                );
                subtotal = await subtotal.filter((e) => e);
            }
        } else {
            if (data.format.ppn == 1) {
                await subtotal.push(
                    data.datasampling.length > 0
                        ? [
                              {
                                  text: "Biaya Sampling",
                                  alignment: "left",
                                  colSpan: 2,
                                  style: "fontsize8",
                              },
                              "",
                              {
                                  text:
                                      data.datasampling.length > 0
                                          ? data.datasampling
                                                .map((t) => t.total)
                                                .reduce((a, b) => a + b)
                                                .toLocaleString()
                                          : 0,
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    [
                        {
                            text: "PPN (11%)",
                            alignment: "left",
                            style: "fontsize8",
                            colSpan: 2,
                        },
                        "",
                        {
                            text: parseInt(data.ppn.toFixed()).toLocaleString(),
                            alignment: "right",
                            style: "fontsize8",
                        },
                    ],
                    data.format.pph == 1
                        ? [
                              {
                                  text: "PPH",
                                  alignment: "left",
                                  style: "fontsize8",
                                  colSpan: 2,
                              },
                              "",
                              {
                                  text: parseInt((
                                      (data.totalpembayaran -
                                          data.hasilDiscount) *
                                      (2 / 100)
                                  ).toFixed()).toLocaleString(),
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    [
                        {
                            text: "Total",
                            alignment: "left",
                            style: "fontsize8",
                            colSpan: 2,
                        },
                        "",
                        {
                            text: (
                                data.totalpembayaran -
                                data.hasilDiscount +
                                data.ppn +
                                (data.datasampling.length > 0
                                    ? data.datasampling
                                          .map((t) => t.total)
                                          .reduce((a, b) => a + b)
                                    : 0) -
                                (data.format.pph == 1
                                    ? parseInt(((data.totalpembayaran -
                                          data.hasilDiscount) *
                                      (2 / 100)).toFixed())
                                    : 0)
                            ).toLocaleString(),
                            alignment: "right",
                            style: "fontsize8",
                        },
                    ]
                );
                subtotal = await subtotal.filter((e) => e);
            } else {
                await subtotal.push(
                    data.datasampling.length > 0
                        ? [
                              {
                                  text: "Biaya Sampling",
                                  alignment: "left",
                                  colSpan: 2,
                                  style: "fontsize8",
                              },
                              "",
                              {
                                  text:
                                      data.datasampling.length > 0
                                          ? data.datasampling
                                                .map((t) => t.total)
                                                .reduce((a, b) => a + b)
                                                .toLocaleString()
                                          : 0,
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    data.format.pph == 1
                        ? [
                              {
                                  text: "PPH",
                                  alignment: "left",
                                  style: "fontsize8",
                                  colSpan: 2,
                              },
                              "",
                              {
                                  text: parseInt((
                                      (data.totalpembayaran -
                                          data.hasilDiscount) *
                                      (2 / 100)
                                  ).toFixed()).toLocaleString(),
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    [
                        {
                            text: "Total",
                            alignment: "left",
                            colSpan: 2,
                            style: "fontsize8",
                        },
                        "",
                        {
                            text: (
                                data.totalpembayaran -
                                data.hasilDiscount +
                                (data.datasampling.length > 0
                                    ? data.datasampling
                                          .map((t) => t.total)
                                          .reduce((a, b) => a + b)
                                    : 0) -
                                (data.format.pph == 1
                                    ? parseInt(((data.totalpembayaran -
                                        data.hasilDiscount) *
                                    (2 / 100)).toFixed())
                                    : 0)
                            ).toLocaleString(),
                            alignment: "right",
                            style: "fontsize8",
                        },
                    ]
                );
                subtotal = await subtotal.filter((e) => e);
            }
        }

        const def = await {
            pageSize: "A4",
            pageMargins: [35, 80, 35, 60],
            pageOrientation: "portrait",
            header: function (currentPage, pageCount) {
                if (currentPage == 2) {
                    return [
                        {
                            columns: [
                                // {
                                //     image: siglogo,
                                //     width: 150,
                                //     style: "margin30",
                                // },
                                {
                                    style: ["testing2", "fontsize"],
                                    alignment: "right",
                                    layout: "noBorders",
                                    table: {
                                        widths: ["*"],
                                        body: [
                                            [""],
                                            [
                                                {
                                                    text: `Page ${currentPage} of ${pageCount}`,
                                                    alignment: "right",
                                                },
                                            ],
                                            [
                                                {
                                                    text: "preview",
                                                    alignment: "right",
                                                },
                                            ],
                                        ],
                                    },
                                },
                            ],
                        },
                    ];
                } else if (currentPage > 2) {
                    return [
                        {
                            columns: [
                                // {
                                //     image: siglogo,
                                //     width: 150,
                                //     style: "margin30",
                                // },
                                {
                                    style: ["testing2", "fontsize"],
                                    alignment: "right",
                                    layout: "noBorders",
                                    table: {
                                        widths: ["*"],
                                        body: [
                                            [
                                                {
                                                    text: `Page ${currentPage} of ${pageCount}`,
                                                    alignment: "right",
                                                },
                                            ],
                                            [
                                                {
                                                    text: "preview",
                                                    alignment: "right",
                                                },
                                            ],
                                        ],
                                    },
                                },
                            ],
                        },
                    ];
                } else {
                    return [
                        {
                            image: siglogo,
                            width: 150,
                            style: "margin30",
                        },
                    ];
                }
            },
            content: [
                {
                    style: "marginbawah30",
                    widths: ["*", "*"],
                    aligment: "justify",
                    columns: [
                        {
                            margin: [10, 0],
                            style: "fontsize8",
                            layout: "noBorders",
                            table: {
                                widths: [150],
                                body: [
                                    [{ text: `Kepada Yth` }],
                                    [
                                        {
                                            text: data.custhandle.name,
                                        },
                                    ],
                                    [
                                        {
                                            text: data.custhandle.customer_name,
                                        },
                                    ],
                                    [
                                        {
                                            text:
                                                data.custhandle.email ==
                                                "NOT SET"
                                                    ? "-"
                                                    : data.custhandle.email,
                                        },
                                    ],
                                    [
                                        {
                                            text: `${
                                                data.custhandle.phone &&
                                                data.custhandle.phone !== "-"
                                                    ? formatphonecode +
                                                      formatphone
                                                    : "-"
                                            } / ${
                                                data.custhandle.telp &&
                                                data.custhandle.telp !== "-"
                                                    ? formatphonecode +
                                                      formattelp
                                                    : "-"
                                            }`,
                                        },
                                    ],
                                ],
                            },
                        },
                        {
                            style: ["termpenawaran", "fontsize8"],
                            layout: "noBorders",
                            table: {
                                widths: [130, 10, 150],
                                margin: [10, 0],
                                body: [
                                    [`Nomor Penawaran`, ":", "preview"],
                                    [
                                        `Tanggal`,
                                        ":",
                                        _moment(new Date()).format(
                                            "DD MMMM YYYY"
                                        ),
                                    ],
                                ],
                            },
                        },
                    ],
                },
                {
                    widths: ["*"],
                    aligment: "justify",
                    style: ["margin10", "fontsize8"],
                    columns: [
                        {
                            text: `Dengan Hormat.
                            Menjawab permintaan ${
                                data.custhandle.gender == "L" ? "Bapak" : "Ibu"
                            } terkait pengujian laboratorium dengan ini kami sampaikan penawaran harga uji sebagai berikut:`,
                        },
                    ],
                },
                {
                    style: ["marginatas10", "fontsize8"],
                    layout: "noBorders",
                    table: {
                        widths: ["*"],
                        body: rowhead,
                        // dontBreakRows: true,
                    },
                    alignment: "center",
                },
                {
                    style: ["marginatas40", "marginDalam", "marginawal"],
                    margin: [10, 20],
                    table: {
                        widths: ["*", 20, "*"],
                        style: "fontsize8",
                        body: subtotal,
                        dontBreakRows: true,
                    },
                },

                {
                    style: [
                        "marginatas20",
                        "marginDalam",
                        "marginawal",
                        "fontsize8",
                    ],
                    layout: "noBorders",
                    margin: [10, 5],
                    table: {
                        widths: ["*"],
                        body: [
                            [
                                {
                                    text: "Catatan",
                                    style: "bold",
                                },
                            ],
                            [data.desc_internal],
                        ],
                    },
                },
                {
                    style: [
                        "marginatas10",
                        "marginDalam",
                        "marginawal",
                        "fontsize8",
                    ],
                    layout: "noBorders",
                    margin: [10, 5],
                    table: {
                        widths: [80, 5, "*"],
                        body: [
                            [
                                {
                                    text: `${
                                        data.format.dp == 1
                                            ? "Pelanggan diharap melakukan pembayaran uang muka sebesar 50% dari total biaya pengujian dan p"
                                            : "P"
                                    }elunasan sebelum tanggal estimasi uji selesai melalui transfer ke rekening :`,
                                    colSpan: 3,
                                },
                                "",
                                "",
                            ],
                            ["Nama Bank", ":", `Bank Mandiri, Cabang Juanda`],
                            ["Atas Nama", ":", `PT. Saraswanti Indo Genetech`],
                            ["No. Rekening", ":", `133.000.1160.811`],
                            ["", "", ""],
                            ["", "", ""],
                            [
                                {
                                    text: `Kirimkan bukti pembayaran ke email sales terkait dan atau paymentinfo-sig@saraswanti.com dan harap lampirkan surat penawaran saat proses memasukan sampel`,
                                    colSpan: 3,
                                },
                                "",
                                "",
                            ],
                            ["", "", ""],
                            [
                                {
                                    text: `Harga yang tercantum pada surat penawaran berikut dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu dan hanya berlaku untuk sampel sesuai pada surat penawaran.`,
                                    colSpan: 3,
                                },
                                "",
                                "",
                            ],
                            ["", "", ""],
                            [
                                {
                                    text: `Demikian penawaran ini kami sampaikan, atas perhatian serta kerjasama yang baik kami mengucapkan terima kasih.`,
                                    colSpan: 3,
                                },
                                "",
                                "",
                            ],
                            ["", "", ""],
                            ["", "", ""],
                        ],
                        dontBreakRows: true,
                    },
                },
                {
                    style: ["marginDalam", "fontsize8"],
                    layout: "noBorders",
                    margin: [10, 0],
                    table: {
                        widths: ["*"],
                        body: [
                            [
                                {
                                    layout: "noBorders",
                                    table: {
                                        widths: ["*"],
                                        body: [
                                            [
                                                {
                                                    text: `Hormat Kami,
                                                    PT. Saraswanti Indo Genetech`,
                                                },
                                            ],
                                            [""],
                                            [""],
                                            [""],
                                            [""],
                                            [
                                                {
                                                    text: `${
                                                        picsales[0]
                                                            .employee_name
                                                    }
                                                ${
                                                   picsales[0].position
                                                        ? picsales[0]
                                                              .position
                                                              .position_name
                                                        : "-"
                                                }
                                                ${
                                                    picsales[0].phone
                                                        ? `+62 ${picsales[0].phone}`
                                                        : "-"
                                                }`,
                                                },
                                            ],
                                        ],
                                        dontBreakRows: true,
                                    },
                                },
                            ],
                            [
                                {
                                    table: {
                                        widths: ["*"],
                                        heights: [80],
                                        body: [
                                            [
                                                {
                                                    text: "Catatan Tambahan",
                                                    style: "bold",
                                                },
                                            ],
                                        ],
                                        dontBreakRows: true,
                                    },
                                },
                            ],
                            [
                                {
                                    table: {
                                        widths: ["*"],
                                        heights: [80, "auto", "auto"],
                                        body: [
                                            [
                                                {
                                                    border: [
                                                        true,
                                                        true,
                                                        true,
                                                        false,
                                                    ],
                                                    text: "Dengan ini Saya setuju atas penawaran yang diberikan",
                                                    style: "bold",
                                                },
                                            ],
                                            [
                                                {
                                                    border: [
                                                        true,
                                                        false,
                                                        true,
                                                        false,
                                                    ],
                                                    text: "___________________________________________________",
                                                },
                                            ],
                                            [
                                                {
                                                    border: [
                                                        true,
                                                        false,
                                                        true,
                                                        true,
                                                    ],
                                                    text: "Nama Pelanggan/Tanda Tangan/Tanggal/Cap Basah",
                                                },
                                            ],
                                        ],
                                        dontBreakRows: true,
                                    },
                                },
                            ],
                        ],
                        dontBreakRows: true,
                    },
                },
                {
                    text: "",
                    pageBreak: "after",
                    style: "marginawal",
                    // or after
                },
                tablecolumn3,
            ],
            footer: {
                columns: [
                    {
                        layout: "noBorders",
                        style: "tested",
                        table: {
                            widths: ["*", "*", 50, 120],
                            body: [
                                [
                                    {
                                        image: towards,
                                        width: 90,
                                        style: "marginminussetengah",
                                    },
                                    {
                                        text:
                                            data.contract_type !== 4
                                                ? `PT SARASWANTI INDO GENETECH
                                        Graha SIG Jl. Rasamala No. 20 Taman Yasmin
                                        Bogor 16113 INDONESIA
                                        Phone +62 251 7532 348 49 ( Hunting ), 0821 1151 6516
                                        Fax +62 251 7540 927
                                        www.siglaboratory.com`
                                                : `AMG Tower Lt.12
                                        Jl. Dukuh Menanggal No.1 A, Kec. Gayungan, 
                                        Kota SBY, Jawa Timur 60234
                                        Phone +62 31 82531288 / +62 31 82531889, +62 81 888 5165`,
                                        alignment: "left",
                                        style: "marginminus",
                                    },
                                    {
                                        image: ilac,
                                        width: 40,
                                        style: "marginminus",
                                        alignment: "right",
                                    },
                                    {
                                        image: kan,
                                        width: 60,
                                        style: "marginminussetengahaja",
                                        alignment: "right",
                                    },
                                ],
                            ],
                        },
                    },
                ],
            },
            styles: styles,
            unbreakable: true,
            defaultStyle: {
                // alignment: 'justify'
                // font: 'din',
                columnGap: 5,
            },
        };
        this.pdfMake.createPdf(def).open();
    }

    async generatePdfPenawaranEN(data, string) {
        await this.loadPdfMaker();

        var rowhead = await [];
        var subtotal = [];

        var formatphonecode = data.customers_handle.customers.countries
            ? "+" + data.customers_handle.customers.countries.phone_code + " "
            : "+62 ";
        var formattelp =
            data.customers_handle.telp.substr(0, 1) == "0"
                ? data.customers_handle.telp.substr(1)
                : data.customers_handle.telp;
        var formatphone =
            data.customers_handle.phone.substr(0, 1) == "0"
                ? data.customers_handle.phone.substr(1)
                : data.customers_handle.phone;

        let z = await Object.entries(data.format);
        let j = await z
            .filter(
                ([key, value]) =>
                    value === 1 &&
                    !["ppn", "pph", "dp", "id_tp", "id"].includes(key)
            )
            .map((m) => {
                return m[0].toUpperCase();
            });

        for (let m = 0; m < data.transaction_penawaran_sample.length; m++) {
            let statuskali = [
                {
                    id: 2,
                    value: 1.5,
                },
                {
                    id: 3,
                    value: 2,
                },
                {
                    id: 1,
                    value: 1,
                },
            ];

            let e = data.transaction_penawaran_sample;
            var rows = await [];
            var widths = await [];

            let a = await {
                text: "",
            };

            let textsub =
                (await e[m].batch_number) || e[m].kode_sample
                    ? `\n${
                          e[m].batch_number
                              ? "batch : " + e[m].batch_number
                              : ""
                      } ${
                          e[m].kode_sample
                              ? "sample code :" + e[m].kode_sample
                              : ""
                      }`
                    : "";
            await rows.push([
                {
                    text: `${m + 1}. ${e[m].sample_name} ${textsub}\n\n`,
                    colSpan: j.length + 5,
                    alignment: "left",
                    border: [false, false, false, true],
                    style: [m < 1 ? "marginatas0" : "marginatas20"],
                },
            ]);

            for (let l = 1; l < j.length + 5; l++) {
                rows[0] = await rows[0].concat(a);
            }

            await rows.push([
                {
                    text: "NO",
                },
                {
                    text: "Type",
                },
                {
                    text: "Test",
                },
            ]);

            rows[1] = await rows[1].concat(j);

            rows[1] = await rows[1].concat(
                { text: "Status" },
                { text: "Price (IDR)" }
            );

            await rows[1].forEach((c, mc) => {
                if (mc == 0) {
                    widths.push(13);
                } else if (mc == 1) {
                    widths.push(80);
                } else if (mc == 2) {
                    widths.push(150);
                } else if (mc == rows[1].length - 1) {
                    widths.push("*");
                } else if (mc == rows[1].length - 2) {
                    widths.push("*");
                } else if (mc == rows[1].length - 3) {
                    widths.push("*");
                } else {
                    widths.push("*");
                }
            });

            let nonpaket = await e[m].transaction_penawaran_parameter.filter(
                (e) => e.status == 2
            );
            let paketparameter = global.uniq(
                e[m].transaction_penawaran_parameter.filter(
                    (e) => e.status == 1
                ),
                (it) => it.info_id
            );
            let paketpkm = global.uniq(
                e[m].transaction_penawaran_parameter.filter(
                    (e) => e.status == 3
                ),
                (it) => it.info
            );

            if (nonpaket.length > 0) {
                await nonpaket.forEach((a, c) => {
                    rows.push([
                        `${c + 1}`,
                        {
                            text: "Non Package",
                            alignment: "left",
                        },
                        {
                            text: `${a.parameteruji.name_en}`,
                            alignment: "left",
                        },

                        j.filter((e) => e === "METODE").length > 0
                            ? `${a.metode ? a.metode.metode : "-"}`
                            : undefined,
                        j.filter((e) => e === "LOD").length > 0
                            ? `${a.lod ? a.lod.nama_lod : "-"}`
                            : undefined,
                        j.filter((e) => e === "SATUAN").length > 0
                            ? `${a.unit ? a.unit.nama_unit : "-"}`
                            : undefined,

                        `${e[m].status_pengujian.name}`,
                        {
                            text: `${(
                                a.price * e[m].id_statuspengujian
                            ).toLocaleString()}`,
                            alignment: "right",
                        },
                    ]);
                });
            }

            if (paketparameter.length > 0) {
                var paketaneh = [4691, 4697];
                paketparameter.forEach((r: any, ix) => {
                    let h = [];

                    let az = [];
                    let ba = e[m].transaction_penawaran_parameter.filter(
                        (fz) => fz.status == 1 && fz.info_id == r.info_id
                    ).length;

                    let za = parseInt(ba);

                    // if (za > 1) {
                    //     for (let xa = 1; xa < za; xa++) {
                    //         az = az.concat("\n");
                    //     }
                    // }

                    for (
                        let k = 1;
                        k <
                        e[m].transaction_penawaran_parameter.filter(
                            (fz) => fz.status == 1 && fz.info_id == r.info_id
                        ).length;
                        k++
                    ) {
                        h.push([
                            "",
                            "",
                            {
                                text: `${
                                    e[m].transaction_penawaran_parameter.filter(
                                        (fz) =>
                                            fz.status == 1 &&
                                            fz.info_id == r.info_id
                                    )[k].parameteruji.name_en
                                }`,
                                alignment: "left",
                            },

                            j.filter((abc) => abc == "METODE").length > 0
                                ? `${
                                      e[
                                          m
                                      ].transaction_penawaran_parameter.filter(
                                          (fz) =>
                                              fz.status == 1 &&
                                              fz.info_id == r.info_id
                                      )[k].metode
                                          ? e[
                                                m
                                            ].transaction_penawaran_parameter.filter(
                                                (fz) =>
                                                    fz.status == 1 &&
                                                    fz.info_id == r.info_id
                                            )[k].metode.metode
                                          : "-"
                                  }`
                                : undefined,
                            j.filter((abc) => abc == "LOD").length > 0
                                ? `${
                                      e[
                                          m
                                      ].transaction_penawaran_parameter.filter(
                                          (fz) =>
                                              fz.status == 1 &&
                                              fz.info_id == r.info_id
                                      )[k].lod
                                          ? e[
                                                m
                                            ].transaction_penawaran_parameter.filter(
                                                (fz) =>
                                                    fz.status == 1 &&
                                                    fz.info_id == r.info_id
                                            )[k].lod.nama_lod
                                          : "-"
                                  }`
                                : undefined,
                            j.filter((ab) => ab == "SATUAN").length > 0
                                ? `${
                                      e[
                                          m
                                      ].transaction_penawaran_parameter.filter(
                                          (fz) =>
                                              fz.status == 1 &&
                                              fz.info_id == r.info_id
                                      )[k].lod
                                          ? e[
                                                m
                                            ].transaction_penawaran_parameter.filter(
                                                (fz) =>
                                                    fz.status == 1 &&
                                                    fz.info_id == r.info_id
                                            )[k].unit.nama_unit
                                          : "-"
                                  }`
                                : undefined,
                            ``,
                            "",
                        ]);
                    }
                    rows.push([
                        {
                            text: `${az.toString().replace(/,/g, "")}${
                                nonpaket.length > 0
                                    ? nonpaket.length + (ix + 1)
                                    : ix + 1
                            }`,
                            rowSpan: e[
                                m
                            ].transaction_penawaran_parameter.filter(
                                (fz) =>
                                    fz.status == 1 && fz.info_id == r.info_id
                            ).length,
                        },
                        {
                            text: `${az.toString().replace(/,/g, "")} ${
                                r.info_en.split(" - ")[1]
                            }`,
                            rowSpan: e[
                                m
                            ].transaction_penawaran_parameter.filter(
                                (fz) =>
                                    fz.status == 1 && fz.info_id == r.info_id
                            ).length,
                            alignment: "left",
                        },
                        {
                            text: e[m].transaction_penawaran_parameter.filter(
                                (fz) =>
                                    fz.status == 1 && fz.info_id == r.info_id
                            )[0].parameteruji.name_en,
                            alignment: "left",
                        },
                        j.filter((abc) => abc == "METODE").length > 0
                            ? `${
                                  e[m].transaction_penawaran_parameter.filter(
                                      (fz) =>
                                          fz.status == 1 &&
                                          fz.info_id == r.info_id
                                  )[0].metode
                                      ? e[
                                            m
                                        ].transaction_penawaran_parameter.filter(
                                            (fz) =>
                                                fz.status == 1 &&
                                                fz.info_id == r.info_id
                                        )[0].metode.metode
                                      : "-"
                              }`
                            : undefined,
                        j.filter((ab) => ab == "LOD").length > 0
                            ? e[m].transaction_penawaran_parameter.filter(
                                  (fz) =>
                                      fz.status == 1 && fz.info_id == r.info_id
                              )[0].lod
                                ? e[m].transaction_penawaran_parameter.filter(
                                      (fz) =>
                                          fz.status == 1 &&
                                          fz.info_id == r.info_id
                                  )[0].lod.nama_lod
                                : "-"
                            : undefined,
                        j.filter((ab) => ab == "SATUAN").length > 0
                            ? e[m].transaction_penawaran_parameter.filter(
                                  (fz) =>
                                      fz.status == 1 && fz.info_id == r.info_id
                              )[0].unit
                                ? e[m].transaction_penawaran_parameter.filter(
                                      (fz) =>
                                          fz.status == 1 &&
                                          fz.info_id == r.info_id
                                  )[0].unit.nama_unit
                                : "-"
                            : undefined,
                        {
                            text: `${az.toString().replace(/,/g, "")}${
                                e[m].status_pengujian.name
                            }`,
                            rowSpan: e[
                                m
                            ].transaction_penawaran_parameter.filter(
                                (fz) =>
                                    fz.status == 1 && fz.info_id == r.info_id
                            ).length,
                        },
                        {
                            text: `${az.toString().replace(/,/g, "")}${(
                                r.price *
                                (paketaneh.includes(r.info_id)
                                    ? statuskali.filter(
                                          (re) =>
                                              re.id == e[m].id_statuspengujian
                                      )[0].value
                                    : e[m].id_statuspengujian)
                            ).toLocaleString()}`,
                            alignment: "right",
                            rowSpan: e[
                                m
                            ].transaction_penawaran_parameter.filter(
                                (fz) =>
                                    fz.status == 1 && fz.info_id == r.info_id
                            ).length,
                        },
                    ]);
                    rows = rows.concat(h);
                });
            }

            if (paketpkm.length > 0) {
                let subpackage = await [];

                await this._paketpkmServ
                    .getDataDetailpaketpkmBySub({
                        data: paketpkm.map((ap: any) => ap.info_id),
                    })
                    .then((x: any) => {
                        x.forEach((c) => {
                            subpackage = subpackage.concat({
                                idpackagepkm: c.pkmpackage.id,
                                packagename: c.pkmpackage.package_name_en
                                    ? c.pkmpackage.package_name_en
                                    : c.pkmpackage.package_name,
                                detail: global
                                    .uniq(
                                        e[
                                            m
                                        ].transaction_penawaran_parameter.filter(
                                            (g) => g.status === 3
                                        ),
                                        (m) => m.info_id
                                    )
                                    .filter(
                                        (rz) =>
                                            rz["info"].split(" - ")[1] ===
                                            c.pkmpackage.package_name
                                    )
                                    .map((pz: any) => ({
                                        ...pz,
                                        jumlah: c.jumlah,
                                    })),
                            });
                        });
                    });

                await subpackage.forEach((cz: any, ix) => {
                    let haz = [];
                    if (cz.detail.length > 1) {
                        for (let ka = 1; ka < cz.detail.length; ka++) {
                            haz.push([
                                "",
                                "",
                                {
                                    text: `${cz.detail[ka].parameteruji.name_en} (${cz.detail[ka].jumlah})`,
                                    alignment: "left",
                                },
                                j.filter((abc) => abc == "METODE").length > 0
                                    ? `${
                                          cz.detail[ka].metode
                                              ? cz.detail[ka].metode.metode
                                              : "-"
                                      }`
                                    : undefined,
                                j.filter((abc) => abc == "LOD").length > 0
                                    ? `${
                                          cz.detail[ka].lod
                                              ? cz.detail[ka].lod.nama_lod
                                              : "-"
                                      }`
                                    : undefined,
                                j.filter((abc) => abc == "SATUAN").length > 0
                                    ? `${
                                          cz.detail[ka].unit
                                              ? cz.detail[ka].unit.nama_unit
                                              : "-"
                                      }`
                                    : undefined,
                                {
                                    text: `${e[m].status_pengujian.name}`,
                                },
                                {
                                    text: `${(
                                        cz.detail[ka].price *
                                        e[m].id_statuspengujian
                                    ).toLocaleString()}`,
                                    alignment: "right",
                                },
                            ]);
                        }
                        rows.push([
                            {
                                text: `${
                                    nonpaket.length > 0 ||
                                    paketparameter.length > 0
                                        ? nonpaket.length +
                                          paketparameter.length +
                                          (ix + 1)
                                        : ix + 1
                                }`,
                                rowSpan: cz.detail.length,
                            },
                            {
                                text: `${cz.packagename}`,
                                rowSpan: cz.detail.length,
                                alignment: "left",
                            },
                            {
                                text: `${cz.detail[0].parameteruji.name_en} (${cz.detail[0].jumlah})`,
                                alignment: "left",
                            },
                            j.filter((abc) => abc == "METODE").length > 0
                                ? `${
                                      cz.detail[0].metode
                                          ? cz.detail[0].metode.metode
                                          : "-"
                                  }`
                                : undefined,
                            j.filter((abc) => abc == "LOD").length > 0
                                ? `${
                                      cz.detail[0].lod
                                          ? cz.detail[0].lod.nama_lod
                                          : "-"
                                  }`
                                : undefined,
                            j.filter((abc) => abc == "SATUAN").length > 0
                                ? `${
                                      cz.detail[0].unit
                                          ? cz.detail[0].unit.nama_unit
                                          : "-"
                                  }`
                                : undefined,
                            {
                                text: `${e[m].status_pengujian.name}`,
                                rowSpan: cz.detail.length,
                            },
                            {
                                text: `${(
                                    cz.detail[0].price * e[m].id_statuspengujian
                                ).toLocaleString()}`,
                                alignment: "right",
                            },
                        ]);

                        rows = rows.concat(haz);
                    } else {
                        rows.push([
                            {
                                text: `${
                                    nonpaket.length > 0 ||
                                    paketparameter.length > 0
                                        ? nonpaket.length +
                                          paketparameter.length +
                                          (ix + 1)
                                        : ix + 1
                                }`,
                                rowSpan: cz.detail.length,
                            },
                            {
                                text: `${cz.packagename}`,
                                rowSpan: cz.detail.length,
                                alignment: "left",
                            },
                            {
                                text: `${cz.detail[0].parameteruji.name_en} (${cz.detail[0].jumlah})`,
                                alignment: "left",
                            },
                            j.filter((abc) => abc == "METODE").length > 0
                                ? `${
                                      cz.detail[0].metode
                                          ? cz.detail[0].metode.metode
                                          : "-"
                                  }`
                                : undefined,
                            j.filter((abc) => abc == "LOD").length > 0
                                ? `${
                                      cz.detail[0].lod
                                          ? cz.detail[0].lod.nama_lod
                                          : "-"
                                  }`
                                : undefined,
                            j.filter((abc) => abc == "SATUAN").length > 0
                                ? `${
                                      cz.detail[0].unit
                                          ? cz.detail[0].unit.nama_unit
                                          : "-"
                                  }`
                                : undefined,
                            {
                                text: `${e[m].status_pengujian.name}`,
                                rowSpan: cz.detail.length,
                            },
                            {
                                text: `${(
                                    cz.detail[0].price * e[m].id_statuspengujian
                                ).toLocaleString()}`,
                                alignment: "right",
                            },
                        ]);

                        rows = rows.concat(haz);
                    }
                });
            }

            for (let fg = 1; fg < rows.length; fg++) {
                rows[fg] = await rows[fg].filter((e) => e !== undefined);
            }

            await rows.push([
                {
                    text: "Subtotal",
                    colSpan:
                        4 +
                        (j.filter((e) => e == "METODE").length > 0 ? 1 : 0) +
                        (j.filter((e) => e == "LOD").length > 0 ? 1 : 0) +
                        (j.filter((e) => e == "SATUAN").length > 0 ? 1 : 0),
                    bold: true,
                },

                j.filter((e) => e == "METODE").length > 0 ? [""] : undefined,
                j.filter((e) => e == "LOD").length > 0 ? [""] : undefined,
                j.filter((e) => e == "SATUAN").length > 0 ? [""] : undefined,

                [""],
                [""],
                [""],
                {
                    text: `${e[m].price > 0 ? e[m].price.toLocaleString() : 0}`,
                    alignment: "right",
                    bold: true,
                },
            ]);

            rows[rows.length - 1] = await rows[rows.length - 1].filter(
                (e) => e
            );

            await rowhead.push([
                {
                    style: ["fontsize8", "margin10", "verticalmiddle"],
                    table: {
                        widths: widths,
                        body: rows,
                        dontBreakRows: true,
                    },
                },
            ]);
        }

        await subtotal.push(
            [
                {
                    text: "Total (IDR)",
                    colSpan: 3,
                    style: ["bold", "fontsize8"],
                    alignment: "center",
                },
                "",
                "",
            ],
            [
                {
                    text: "Subtotal",
                    style: "fontsize8",
                    colSpan: 2,
                    alignment: "left",
                },
                "",
                {
                    text:
                        data.payment.totalpembayaran > 0
                            ? data.payment.totalpembayaran.toLocaleString()
                            : data.payment.totalpembayaran,
                    alignment: "right",
                    style: "fontsize8",
                },
            ]
        );

        subtotal = await subtotal.filter((e) => e);
        if (data.payment.hargadiscount > 0) {
            await subtotal.push(
                [
                    {
                        text: "Discount",
                        alignment: "left",
                        style: "fontsize8",
                    },
                    {
                        text:
                            data.payment.discountconv > 0
                                ? `${data.payment.discountconv} %`
                                : "",
                        style: "fontsize8",
                    },
                    {
                        text:
                            data.payment.hargadiscount > 0
                                ? data.payment.hargadiscount.toLocaleString()
                                : data.payment.hargadiscount,
                        alignment: "right",
                        style: "fontsize8",
                    },
                ],
                [
                    {
                        text: "Subtotal After Discount",
                        alignment: "left",
                        colSpan: 2,
                        style: "fontsize8",
                    },
                    "",
                    {
                        text: (
                            data.payment.totalpembayaran -
                            data.payment.hargadiscount
                        ).toLocaleString(),
                        alignment: "right",
                        style: "fontsize8",
                    },
                ],
                data.sampling_trans.length > 0
                    ? [
                          {
                              text: "Sampling Fee",
                              alignment: "left",
                              colSpan: 2,
                              style: "fontsize8",
                          },
                          "",
                          {
                              text:
                                  data.sampling_trans.length > 0
                                      ? data.sampling_trans
                                            .map((t) => t.total)
                                            .reduce((a, b) => a + b)
                                            .toLocaleString()
                                      : 0,
                              alignment: "right",
                              style: "fontsize8",
                          },
                      ]
                    : undefined
            );
            subtotal = await subtotal.filter((e) => e);
            if (data.format.ppn == 1) {
                await subtotal.push(
                    [
                        {
                            text: "VAT (11%)",
                            alignment: "left",
                            style: "fontsize8",
                            colSpan: 2,
                        },
                        "",
                        {
                            text: data.payment.ppn.toLocaleString(),
                            alignment: "right",
                            style: "fontsize8",
                        },
                    ],
                    data.format.pph == 1
                        ? [
                              {
                                  text: "Income Tax",
                                  alignment: "left",
                                  style: "fontsize8",
                                  colSpan: 2,
                              },
                              "",
                              {
                                  text: (
                                      (data.payment.totalpembayaran -
                                          data.payment.hargadiscount) *
                                      (2 / 100)
                                  ).toLocaleString(),
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    [
                        {
                            text: "Total",
                            alignment: "left",
                            style: "fontsize8",
                            colSpan: 2,
                        },
                        "",
                        {
                            text: (
                                data.payment.totalpembayaran -
                                data.payment.hargadiscount +
                                (data.sampling_trans.length > 0
                                    ? data.sampling_trans
                                          .map((t) => t.total)
                                          .reduce((a, b) => a + b)
                                    : 0) +
                                data.payment.ppn -
                                (data.format.pph == 1
                                    ? (data.payment.totalpembayaran -
                                          data.payment.hargadiscount) *
                                      (2 / 100)
                                    : 0)
                            ).toLocaleString(),
                            alignment: "right",
                            style: "fontsize8",
                        },
                    ]
                );
                subtotal = await subtotal.filter((e) => e);
            } else {
                await subtotal.push(
                    data.sampling_trans.length > 0
                        ? [
                              {
                                  text: "Sampling Fee",
                                  alignment: "left",
                                  colSpan: 2,
                                  style: "fontsize8",
                              },
                              "",
                              {
                                  text:
                                      data.sampling_trans.length > 0
                                          ? data.sampling_trans
                                                .map((t) => t.total)
                                                .reduce((a, b) => a + b)
                                                .toLocaleString()
                                          : 0,
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    data.format.pph == 1
                        ? [
                              {
                                  text: "Income Tax",
                                  alignment: "left",
                                  style: "fontsize8",
                                  colSpan: 2,
                              },
                              "",
                              {
                                  text: (
                                      (data.payment.totalpembayaran -
                                          data.payment.hargadiscount) *
                                      (2 / 100)
                                  ).toLocaleString(),
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    [
                        {
                            text: "Total",
                            alignment: "left",
                            style: "fontsize8",
                            colSpan: 2,
                        },
                        "",
                        {
                            text: (
                                data.payment.totalpembayaran -
                                data.payment.hargadiscount +
                                (data.sampling_trans.length > 0
                                    ? data.sampling_trans
                                          .map((t) => t.total)
                                          .reduce((a, b) => a + b)
                                    : 0) -
                                (data.format.pph == 1
                                    ? (data.payment.totalpembayaran -
                                          data.payment.hargadiscount) *
                                      (2 / 100)
                                    : 0)
                            ).toLocaleString(),
                            alignment: "right",
                            style: "fontsize8",
                        },
                    ]
                );
                subtotal = await subtotal.filter((e) => e);
            }
        } else {
            if (data.format.ppn == 1) {
                await subtotal.push(
                    data.sampling_trans.length > 0
                        ? [
                              {
                                  text: "Sampling Fee",
                                  alignment: "left",
                                  colSpan: 2,
                                  style: "fontsize8",
                              },
                              "",
                              {
                                  text:
                                      data.sampling_trans.length > 0
                                          ? data.sampling_trans
                                                .map((t) => t.total)
                                                .reduce((a, b) => a + b)
                                                .toLocaleString()
                                          : 0,
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    [
                        {
                            text: "VAT (11%)",
                            alignment: "left",
                            style: "fontsize8",
                            colSpan: 2,
                        },
                        "",
                        {
                            text: data.payment.ppn.toLocaleString(),
                            alignment: "right",
                            style: "fontsize8",
                        },
                    ],
                    data.format.pph == 1
                        ? [
                              {
                                  text: "Income Tax",
                                  alignment: "left",
                                  style: "fontsize8",
                                  colSpan: 2,
                              },
                              "",
                              {
                                  text: (
                                      (data.payment.totalpembayaran -
                                          data.payment.hargadiscount) *
                                      (2 / 100)
                                  ).toLocaleString(),
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    [
                        {
                            text: "Total",
                            alignment: "left",
                            style: "fontsize8",
                            colSpan: 2,
                        },
                        "",
                        {
                            text: (
                                data.payment.totalpembayaran -
                                data.payment.hargadiscount +
                                data.payment.ppn +
                                (data.sampling_trans.length > 0
                                    ? data.sampling_trans
                                          .map((t) => t.total)
                                          .reduce((a, b) => a + b)
                                    : 0) -
                                (data.format.pph == 1
                                    ? (data.payment.totalpembayaran -
                                          data.payment.hargadiscount) *
                                      (2 / 100)
                                    : 0)
                            ).toLocaleString(),
                            alignment: "right",
                            style: "fontsize8",
                        },
                    ]
                );
                subtotal = await subtotal.filter((e) => e);
            } else {
                await subtotal.push(
                    data.sampling_trans.length > 0
                        ? [
                              {
                                  text: "Sampling Fee",
                                  alignment: "left",
                                  colSpan: 2,
                                  style: "fontsize8",
                              },
                              "",
                              {
                                  text:
                                      data.sampling_trans.length > 0
                                          ? data.sampling_trans
                                                .map((t) => t.total)
                                                .reduce((a, b) => a + b)
                                                .toLocaleString()
                                          : 0,
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    data.format.pph == 1
                        ? [
                              {
                                  text: "Income Tax",
                                  alignment: "left",
                                  style: "fontsize8",
                                  colSpan: 2,
                              },
                              "",
                              {
                                  text: (
                                      (data.payment.totalpembayaran -
                                          data.payment.hargadiscount) *
                                      (2 / 100)
                                  ).toLocaleString(),
                                  alignment: "right",
                                  style: "fontsize8",
                              },
                          ]
                        : undefined,
                    [
                        {
                            text: "Total",
                            alignment: "left",
                            colSpan: 2,
                            style: "fontsize8",
                        },
                        "",
                        {
                            text: (
                                data.payment.totalpembayaran -
                                data.payment.hargadiscount +
                                (data.sampling_trans.length > 0
                                    ? data.sampling_trans
                                          .map((t) => t.total)
                                          .reduce((a, b) => a + b)
                                    : 0) -
                                (data.format.pph == 1
                                    ? (data.payment.totalpembayaran -
                                          data.payment.hargadiscount) *
                                      (2 / 100)
                                    : 0)
                            ).toLocaleString(),
                            alignment: "right",
                            style: "fontsize8",
                        },
                    ]
                );
                subtotal = await subtotal.filter((e) => e);
            }
        }

        const def = await {
            pageSize: "A4",
            pageMargins: [35, 80, 35, 60],
            pageOrientation: "portrait",
            header: function (currentPage, pageCount) {
                if (currentPage == 2) {
                    return [
                        {
                            columns: [
                                // {
                                //     image: siglogo,
                                //     width: 150,
                                //     style: "margin30",
                                // },
                                {
                                    style: ["testing2", "fontsize"],
                                    alignment: "right",
                                    layout: "noBorders",
                                    table: {
                                        widths: ["*"],
                                        body: [
                                            [""],
                                            [
                                                {
                                                    text: `Page ${currentPage} of ${pageCount}`,
                                                    alignment: "right",
                                                },
                                            ],
                                            [
                                                {
                                                    text: data.no_penawaran,
                                                    alignment: "right",
                                                },
                                            ],
                                        ],
                                    },
                                },
                            ],
                        },
                    ];
                } else if (currentPage > 2) {
                    return [
                        {
                            columns: [
                                // {
                                //     image: siglogo,
                                //     width: 150,
                                //     style: "margin30",
                                // },
                                {
                                    style: ["testing2", "fontsize"],
                                    alignment: "right",
                                    layout: "noBorders",
                                    table: {
                                        widths: ["*"],
                                        body: [
                                            [
                                                {
                                                    text: `Page ${currentPage} of ${pageCount}`,
                                                    alignment: "right",
                                                },
                                            ],
                                            [
                                                {
                                                    text: data.no_penawaran,
                                                    alignment: "right",
                                                },
                                            ],
                                        ],
                                    },
                                },
                            ],
                        },
                    ];
                } else {
                    return [
                        {
                            image: siglogo,
                            width: 150,
                            style: "margin30",
                        },
                    ];
                }
            },
            content: [
                {
                    style: "marginbawah30",
                    widths: ["*", "*"],
                    aligment: "justify",
                    columns: [
                        {
                            margin: [10, 0],
                            style: "fontsize8",
                            layout: "noBorders",
                            table: {
                                widths: [150],
                                body: [
                                    [{ text: `Dear` }],
                                    [
                                        {
                                            text: data.customers_handle
                                                .contact_person.name,
                                        },
                                    ],
                                    [
                                        {
                                            text: data.customers_handle
                                                .customers.customer_name,
                                        },
                                    ],
                                    [
                                        {
                                            text:
                                                data.customers_handle.email ==
                                                "NOT SET"
                                                    ? "-"
                                                    : data.customers_handle
                                                          .email,
                                        },
                                    ],
                                    [
                                        {
                                            text: `${
                                                data.customers_handle.phone &&
                                                data.customers_handle.phone !==
                                                    "-"
                                                    ? formatphonecode +
                                                      formatphone
                                                    : "-"
                                            } / ${
                                                data.customers_handle.telp &&
                                                data.customers_handle.telp !==
                                                    "-"
                                                    ? formatphonecode +
                                                      formattelp
                                                    : "-"
                                            }`,
                                        },
                                    ],
                                ],
                            },
                        },
                        {
                            style: ["termpenawaran", "fontsize8"],
                            layout: "noBorders",
                            table: {
                                widths: [130, 10, 150],
                                margin: [10, 0],
                                body: [
                                    [
                                        `Quotation Number`,
                                        ":",
                                        data.no_penawaran,
                                    ],
                                    [
                                        `Date`,
                                        ":",
                                        _moment(data.created_at).format(
                                            "DD MMMM YYYY"
                                        ),
                                    ],
                                ],
                            },
                        },
                    ],
                },
                {
                    widths: ["*"],
                    aligment: "justify",
                    style: ["margin10", "fontsize8"],
                    columns: [
                        {
                            text: `Sincerely,
                            Responding to your request on our analysis service price, we hereby submit the our offer as follows: `,
                        },
                    ],
                },
                {
                    style: ["marginatas10", "fontsize8"],
                    layout: "noBorders",
                    table: {
                        widths: ["*"],
                        body: rowhead,
                        // dontBreakRows: true,
                    },
                    alignment: "center",
                },
                {
                    style: ["marginatas40", "marginDalam", "marginawal"],
                    margin: [10, 20],
                    table: {
                        widths: ["*", 20, "*"],
                        style: "fontsize8",
                        body: subtotal,
                        dontBreakRows: true,
                    },
                },

                {
                    style: [
                        "marginatas20",
                        "marginDalam",
                        "marginawal",
                        "fontsize8",
                    ],
                    layout: "noBorders",
                    margin: [10, 5],
                    table: {
                        widths: ["*"],
                        body: [
                            [
                                {
                                    text: "Notes",
                                    style: "bold",
                                },
                            ],
                            [data.internal_notes],
                        ],
                    },
                },
                {
                    style: [
                        "marginatas10",
                        "marginDalam",
                        "marginawal",
                        "fontsize8",
                    ],
                    layout: "noBorders",
                    margin: [10, 5],
                    table: {
                        widths: [80, 5, "*"],
                        body: [
                            [
                                {
                                    text: `Full payment should be accepted by SIG prior to result delivery, to the following account:`,
                                    colSpan: 3,
                                },
                                "",
                                "",
                            ],
                            [
                                "Bank Account",
                                ":",
                                `Bank Mandiri, Cabang Juanda`,
                            ],
                            ["Account", ":", `PT. Saraswanti Indo Genetech`],
                            ["Account Number", ":", `133.000.1160.811`],
                            ["", "", ""],
                            ["", "", ""],
                            [
                                {
                                    text: `Provide proof of payment to our sales executive or email us at paymentinfo-sig@saraswanti.com`,
                                    colSpan: 3,
                                },
                                "",
                                "",
                            ],
                            ["", "", ""],
                            [
                                {
                                    text: `Prices stated in this document only applies to the submitted samples.`,
                                    colSpan: 3,
                                },
                                "",
                                "",
                            ],
                            ["", "", ""],
                            [
                                {
                                    text: `Thank you for your kind attention.`,
                                    colSpan: 3,
                                },
                                "",
                                "",
                            ],
                            ["", "", ""],
                            ["", "", ""],
                        ],
                        dontBreakRows: true,
                    },
                },
                {
                    style: ["marginDalam", "fontsize8"],
                    layout: "noBorders",
                    margin: [10, 0],
                    table: {
                        widths: ["*"],
                        body: [
                            [
                                {
                                    layout: "noBorders",
                                    table: {
                                        widths: ["*"],
                                        body: [
                                            [
                                                {
                                                    text: `Best Regards,
                                                    PT. Saraswanti Indo Genetech`,
                                                },
                                            ],
                                            [""],
                                            [""],
                                            [""],
                                            [""],
                                            [
                                                {
                                                    text: `${
                                                        data.sales_name
                                                            .employee_name
                                                    }
                                                ${
                                                    data.sales_name.position
                                                        ? data.sales_name
                                                              .position
                                                              .position_name
                                                        : "-"
                                                }
                                                ${
                                                    data.sales_name.phone
                                                        ? `+62 ${
                                                              data.sales_name.phone.substr(
                                                                  0,
                                                                  1
                                                              ) === "0"
                                                                  ? data.sales_name.phone.substr(
                                                                        1
                                                                    )
                                                                  : data
                                                                        .sales_name
                                                                        .phone
                                                          }`
                                                        : "-"
                                                }`,
                                                },
                                            ],
                                        ],
                                        dontBreakRows: true,
                                    },
                                },
                            ],
                            [
                                {
                                    table: {
                                        widths: ["*"],
                                        heights: [80],
                                        body: [
                                            [
                                                {
                                                    text: "Additional Notes:",
                                                    style: "bold",
                                                },
                                            ],
                                        ],
                                        dontBreakRows: true,
                                    },
                                },
                            ],
                            [
                                {
                                    table: {
                                        widths: ["*"],
                                        heights: [80, "auto", "auto"],
                                        body: [
                                            [
                                                {
                                                    border: [
                                                        true,
                                                        true,
                                                        true,
                                                        false,
                                                    ],
                                                    text: "I hereby agree to the quotation stated",
                                                    style: "bold",
                                                },
                                            ],
                                            [
                                                {
                                                    border: [
                                                        true,
                                                        false,
                                                        true,
                                                        false,
                                                    ],
                                                    text: "___________________________________________________",
                                                },
                                            ],
                                            [
                                                {
                                                    border: [
                                                        true,
                                                        false,
                                                        true,
                                                        true,
                                                    ],
                                                    text: "Name of Customers/Signature/Date/Stamp",
                                                },
                                            ],
                                        ],
                                        dontBreakRows: true,
                                    },
                                },
                            ],
                        ],
                        dontBreakRows: true,
                    },
                },
                {
                    text: "",
                    pageBreak: "after",
                    style: "marginawal",
                    // or after
                },
                tablecolumn4,
            ],
            footer: {
                columns: [
                    {
                        layout: "noBorders",
                        style: "tested",
                        table: {
                            widths: ["*", "*", 50, 120],
                            body: [
                                [
                                    {
                                        image: towards,
                                        width: 90,
                                        style: "marginminussetengah",
                                    },
                                    {
                                        text:
                                            data.contract_type !== 4
                                                ? `PT SARASWANTI INDO GENETECH
                                        Graha SIG Jl. Rasamala No. 20 Taman Yasmin
                                        Bogor 16113 INDONESIA
                                        Phone +62 251 7532 348 49 ( Hunting ), 0821 1151 6516
                                        Fax +62 251 7540 927
                                        www.siglaboratory.com`
                                                : `AMG Tower Lt.12
                                        Jl. Dukuh Menanggal No.1 A, Kec. Gayungan, 
                                        Kota SBY, Jawa Timur 60234
                                        Phone +62 31 82531288 / +62 31 82531889, +62 81 888 5165`,
                                        alignment: "left",
                                        style: "marginminus",
                                    },
                                    {
                                        image: ilac,
                                        width: 40,
                                        style: "marginminus",
                                        alignment: "right",
                                    },
                                    {
                                        image: kan,
                                        width: 60,
                                        style: "marginminussetengahaja",
                                        alignment: "right",
                                    },
                                ],
                            ],
                        },
                    },
                ],
            },
            styles: styles,
            unbreakable: true,
            defaultStyle: {
                // alignment: 'justify'
                // font: 'din',
                columnGap: 5,
            },
        };
        (await string) == "download"
            ? this.pdfMake.createPdf(def).download(`${data.no_penawaran}.pdf`)
            : this.pdfMake.createPdf(def).open();
    }
}
