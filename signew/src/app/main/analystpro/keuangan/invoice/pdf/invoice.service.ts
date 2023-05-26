import { style } from '@angular/animations';
import { forEach } from 'lodash';
import { Injectable } from '@angular/core';
import * as htmlToPdfmake from "html-to-pdfmake";
import {
  headerText,
  subHeader,
  tablecolumn,
  footer,
  styles,
  din,
} from "app/main/analystpro/services/pdf/contract";
import {
    sssss
  } from "./attribut";
import {siglogo, towards, ilac, kan } from 'app/main/analystpro/services/pdf/image';
  
import * as image from './images';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})


export class InvoiceFormService {

  pdfMake: any;


  constructor() { }

  merge(a, b, i) {
    return a.slice(0, i).concat(b, a.slice(i));
  }
  

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import("pdfmake/build/pdfmake");
      const pdfFontsModule = await import("pdfmake/build/vfs_fonts");
      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    }
  }

  async generatePdf(data){

    
    moment.locale('id')
    // console.log();
    var rows = await [];
    let test = await [];

    await test.push( 
      [
        {
            border: [true,true,true,true],
            text: 'No.'
          },
          {
            border: [true,true,true,true],
            text: "Nama Sample/ Sample Name"
          },
          {
            border: [true,true,true,true],
            text: "Status Pengujian / Test Status",
            alignment: 'center',
          },            
          {
              border: [true,true,true,true],
              text: "Harga Satuan / Unit Price",
              alignment: 'center',
            },
          {
              border: [true,true,true,true],
              text: "Diskon / Discount",
              alignment: 'center',
            },
          {
            border: [true,true,true,true],
            text: "Jumlah / Amount",
            alignment: 'center',
          } 
      ],
     
      );

      await test.push( 
        [
          {
            border: [false,false,false,false],
            text: ''
          },
          {
            border: [false,false,false,false],
            text: "Jasa pengujian sampel  /Sample analysis",
            alignment: 'left',
          },
          {
            border: [false,false,false,false],
            text: ""
          },
          {
              border: [false,false,false,false],
              text: ""
            },
          {
            border: [false,false,false,false],
            text: ""
          },
          {
            border: [false,false,false,false],
            text: ""
          } 
        ]
        );

      await data.samples.forEach( (x, i) => {
         rows.push([
            {
                // border: [false,false,true,data.samples[((i*perpage)+z) + 1] !== undefined ? false : true],
                border: [false,false,false, false],
                text: `${i + 1}`
               },
               {
                border: [false,false,false, false],
                text: `${x.samplename}`,
                nowarp: true,
                alignment: 'justify',
               },
               {
                border: [false,false,false, false],
                style: ['fontsize'],
                text: `${x.statuspengujian}`,
                alignment: 'center'
               },
               {
                border: [false,false,false, false],
                alignment: 'right',
                text: `${x.price.toLocaleString()}`
               },
               {
                border: [false,false,false,false],
                alignment: 'right',
                //text: `${x.discount.toLocaleString()}` 
                text: `${parseFloat(x.discount.toFixed()).toLocaleString()}`
               },
               {
                heights: '*',
                border: [false,false,false, false],
                alignment: 'right',
                text: `${(x.price - x.discount).toLocaleString()}`
               }
        ]);

     

      });

      let tableHead = []
      tableHead = tableHead.concat(
        {
            absolutePosition: { x: 0, y: 0},
            canvas: 
            [
                {
                    type: 'line',
                    x1: 10,   y1: 490,
                    x2: 585, y2: 490,
                    lineWidth: 1
                }, {
                    type: 'line',
                    x1: 10, y1: 242,
                    x2: 10, y2: 490,
                    lineWidth: 1
                },
                {
                    type: 'line',
                    x1: 34, y1: 242,
                    x2: 34, y2: 490,
                    lineWidth: 1
                },
                {
                    type: 'line',
                    x1: 323, y1: 242,
                    x2: 323, y2: 490,
                    lineWidth: 1
                },
                {
                    type: 'line',
                    x1: 402, y1: 242,
                    x2: 402, y2: 490,
                    lineWidth: 1
                },
                {
                    type: 'line',
                    x1: 462, y1: 242,
                    x2: 462, y2: 490,
                    lineWidth: 1
                },
                {
                    type: 'line',
                    x1: 520, y1: 242,
                    x2: 520, y2: 490,
                    lineWidth: 1
                },
                {
                    type: 'line',
                    x1: 585, y1: 242,
                    x2: 585, y2: 490,
                    lineWidth: 1
                },
            ]
         },
        {
            style: ["fontsize", "marginDalam", "marginawal", "tableParameter", "marginPage"],
            margin: [10, -20, -10, 10],
            table: {
                widths: [15, 280, 70, 50, 50, 55],
                body: test,
                style: ["tableParameter"],
                dontBreakRows: true,
            },
            alignment: "center",
        }
      ) 
      
     

    let tableParameter = await {
      style: ["fontsize", "marginDalam", "marginawal", "tableParameter", "marginPage"],
      margin: [0, 0, 0, 0],
      table: {
        widths: [15, 280, 70, 50, 50, 55],
          body: rows,
          style: ["tableParameter"],
          // dontBreakRows: true,
      },
      alignment: "center",
      
    };

     
      // console.log(tableParameter);
      await this.loadPdfMaker();
      var def = {
            pageSize: "A4",
            pageMargins: [10, 300, 10, 350],
            header: function (currentPage, pageCount) {
              return [
                data.printed == 2 ? 
                {                    
                    columns: [
                        {
                            image: siglogo,
                            width: 180,
                            style: ['margin30'],
                            absolutePosition: { x: 5, y: 0},
                        },
                    ],
                } : '',

                {
                  text: "FAKTUR PENJUALAN / INVOICE",
                  style: ['bold', 'header'],
                  margin: [0, 80, 0 , 0],
                  alignment: "center",
                  // or after
                },
                { 
                  text: `${data.no_invoice}`,
                  style: ['header'],
                  margin: [0, 0, 0 , 0],
                  alignment: "center",
                },
                {
                  margin:[10, 0, 10, 10],
                  columns: [
                   {
                    style: ['fontsize'],
                    layout: 'noBorders',
                    table: {
                      widths: ['*', 1, '*'],
                      heights: 140,
                      body: [
                        [
                          {
                            style: ['fontsize'],
                            layout: {
                              hLineWidth: function(i, node) {
                                return (i === 0 || i === 1) ? 0.5: 0;
                              },
                              vLineWidth: function(i, node) {
                                return (i === 0 || i === 1) ? 0.1 : 0;
                              }
                            },
                            table: {
                              widths: ['*'],
                              heights: 125,
                              body: [
                                [
                                  {
                                    style: ['fontsize'],
                                    layout: 'noBorders',
                                    table: {
                                        widths: [150, 2, '*'],
                                        style: ['fontsize'],
                                        body: [
                                                [{ text: 'Kepada /  Bill to'}, ':', {text: ''}],
                                                [{ text: `${data.customer}`, bold: true},{text: ''}, {text: ''}],
                                                [{ text: `${data.cust_addres}`},{text: ''}, {text: ''}],
                                                [{text: ''},{text: ''},{text: ''} ], 
                                                [{text: ''},{text: ''},{text: ''} ],
                                                [{ text: 'Telepon / Phone'}, ':', `${ data.telp == null ? data.telp == '-' ? '-'  : '-': '+62 ' +data.telp  }`],
                                                [{ text: ''}, '', `${data.phone == null ? data.phone == '-' ? '-'  : '-' : '+62 ' +data.phone}`],
                                                [{ text: 'Faks /  Fax'}, ':', `${data.fax == null || data.fax == 0 ? '-' : data.fax}`],
                                                ]
                                        }
                                   },
                                ]
                              ]
                            }
                          },{
                          },
                          {
                            style: ['fontsize'],
                            layout: {
                              hLineWidth: function(i, node) {
                                return (i === 0 || i === 1) ? 0.5 : 0;
                              },
                              vLineWidth: function(i, node) {
                                return (i === 0 || i === 1) ? 0.1 : 0;
                              }
                            },
                            table: {
                              widths: ['*'],
                              
                              heights: 125,
                              body: [
                                [
                                  {
                                    style: ['fontsize'],
                                    layout: 'noBorders',
                                    table: {
                                      widths: [130, 5, '*'],
                                      body: [
                                        [{ text: 'No. PO / PO Number'}, ':',`${ data.no_po == null ? '-' : data.no_po }`],
                                        [{ text: 'No. Kontrak / Contract Number'}, ':', `${ data.kontrak }`],
                                        [{ text: 'Tgl. Faktur Penjualan / Invoice Date'}, ':', ` ${moment(new Date(data.tgl_faktur)).format("DD MMMM YYYY")}`],
                                        // [{ text: 'Termin / Terms'}, ':', '-'],
                                        [{ text: 'Termin / Terms'}, ':', `${ data.termin == null || data.termin == 0 ? 'COD' : data.termin }`],
                                        [{ text: 'Tgl. Jatuh Tempo / Due Date'}, ':', ` ${data.tgl_jatuh_tempo == null ? '-' : moment(new Date(data.tgl_jatuh_tempo)).format("DD MMMM YYYY")}`],
                                        // [{ text: 'Tgl. Jatuh Tempo / Due Date'}, ':', `-`],
                                        [{ text: 'Personil Penghubung / Contact Person'}, ':', `${ data.cust_penghubung }`],
                                        [{ text: 'Mata Uang / Currency'}, ':', 'IDR'],
                                        [{ text: 'Referensi Lain / Other Reference'}, ':', `${data.other_ref == '' ? '-' : data.other_ref}`]
                                      ]
                                    }
                                   },
                                ]
                              ]
                            }
                          }
                        ]
                      ]
                    }
                   } 
                  ]
                },
                tableHead
            ]
            },
            content: tableParameter,
            footer: function(currentPage, pageCount){
         
                    return [ 
                        {
                          margin:[10, -1, 10, 15],
                          alignment: 'justify',
                          layout: "noBorders",
                          table: {
                            widths: ['*', '*'],
                            body: [
                              [ 
                                {
                                  alignment: 'justify',            
                                  table: {
                                    widths: [270, '*', '*'],
                                    body: [
                                      [ 
                                        {
                                      
                                          alignment: "left",
                                          style: ['fontsize'],
                                          layout: "noBorders",
                                          table: {
                                            widths: ['*'],
                                    body: [
                                            [{ text: ''}],
                                            [{ text: ''}],
                                            [{ text: ''}],
                                            [{ text: ''}],
                                            [{ text: ''}],
                                            [{ text: 'Catatan / Notes: '}],
                                            [{ text: 'Pembayaran harap mencantumkan nomor invoice dan bukti pembayaran di faks ke 0251-7540927 atau email ke - paymentinfo-sig@saraswanti.com'}],
                                            [{ text: ''}],
                                            [{ text: 'Please write the invoice number on your payment and fax the payment receipt to 0251-7540927 or email to paymentinfo-sig@saraswanti.com'}],
                                            [{ text: ''}],
                                            [{ text: ''}],
                                            [{ text: ''}],
                                            [{ text: ''}],
                                            [{ text: ''}],
                                            [{ text: ''}],
                                            [{ text: ''}],
                                            
                                          
                                          ]
                                            }
                                        }, 
                                    ],
                                    ]
                                  }
                                }, 
                                {
                                  alignment: "left",
                                  style: ['fontsize'],
                                  table: {
                                    widths: ['*', '*'],
                                    alignment: "right",
                                    body: [
                                            //[{ text: 'Biaya Pengujian/ Cost Analysis :', alignment: "right"},{ text: `Rp. ${data.samples.map(z => z.price).reduce((a,b) => a + b).toLocaleString()}`, alignment: "right"}],
                                            [{ text: 'Biaya Pengujian/ Cost Analysis :', alignment: "right"},{ text: `Rp. ${(data.samples.map(z => z.price).reduce((a,b) => a + b) - data.samples.map(z => z.discount).reduce((a,b) => a + b)).toLocaleString()}`, alignment: "right"}],
                                            [{ text: 'Biaya peng. sampel / sampling cost :', alignment: "right"},{ text: `Rp. ${data.samplingfee.toLocaleString()}`, alignment: "right"}],
                                            [{ text: 'Biaya ING / ING Cost :', alignment: "right"},{ text: `Rp. ${data.ingfees.toLocaleString()}`, alignment: "right"}],
                                            [{ text: 'Sub Total / Sub Total :', alignment: "right"}, {text: `Rp. ${data.priceSubTotal.toLocaleString()}`, alignment: "right"}],
                                            // [{ text: 'Diskon / Discount :', alignment: "right"}, {text: `Rp. ${data.discount.toLocaleString()}`, alignment: "right"}],
                                            [{ text: 'PPN/ VAT :', alignment: "right"}, {text: `Rp. ${data.ppn.toLocaleString()}`, alignment: "right"}],
                                            [{ text: 'Kode Pembayaran :', alignment: "right"}, {text:`-`, alignment: "right"}],
                                            [{ text: 'TOTAL:', alignment: "right"},
                                             {text: `Rp. ${(data.priceSubTotal + data.ppn).toLocaleString()}`,
                                              alignment: "right"}],
                                            [{ text: 'Uang Muka / Down payment :', alignment: "right"}, {text: `Rp. ${data.downpayment.toLocaleString()}`, alignment: "right"}],
                                            [{ text: 'Sisa Pembayaran / Balance :', alignment: "right"}, {text: `Rp. ${data.remainingpayment.toLocaleString()}`, alignment: "right"}],
                                          ]
                                  }
                                },
                                
                            ]
                            ],
                            
                        },
                    },
                    {
                        margin:[10, -15, 10, 15],
                        alignment: 'justify',
                        style: ['fontsize7'],
                        table: {
                            widths: ['*'],
                            alignment: "right",
                            body: [
                                    [{ text: `Terbilang / Say: ${data.terbilang} rupiah` }],
                                  ]
                        }
                    },
                    {
                        margin:[10, -15, 10, 15],
                        alignment: 'justify',
                        layout: "noBorders",
                        style: ['fontsize'],
                        table: {
                            widths: ['*', '*'],
                            body: [
                                    [{ 
                                        table: {
                                            widths: [270, '*', '*'],
                                            body: [
                                              [ 
                                                {
                                              
                                                  alignment: "left",
                                                  style: ['fontsize7'],
                                                  layout: "noBorders",
                                                  table: {
                                                    widths: ['*', '*', '*'],
                                                    body: [
                                                        [{ text:'Mohon bukti potong PPh 23 mencantumkan data berikut : ', bold: true, colSpan:3}, {text:''},{text:''}],
                                                        [{ text:'Withholding tax please refer to data below :',italics: true, colSpan:3}, {text:''},{text:''}],
                                                        [{ text: 'Nama'},{text: ':', style:['marginMinLeft']}, { text: 'PT. Saraswanti Indo Genetech', style:['marginMinLefting']}],
                                                        [{ text: 'NPWP'},{text: ':', style:['marginMinLeft']}, { text: '02.059.423.0-431.000', style:['marginMinLefting']}],
                                                        [{ text: 'Alamat'},{text: ':', style:['marginMinLeft']}, { text: 'Jl. Rasamala 20 Rt. 002 Rw. 003 Curug Mekar Bogor Barat Bogor', style:['marginMinLefting']}],
                                                        [{ 
                                                            style: ['fontsize7'],
                                                            layout: "noBorders",
                                                            table: {
                                                                widths: [100, 100],
                                                                body: [
                                                                    [{ text: 'Nomor Rekening Pembayaran /'},{text: 'Bank Account Number (IDR)'}],
                                                                    [{ text: 'PT. Saraswanti Indo Genetech'}, { text: 'PT. Saraswanti Indo Genetech'}],
                                                                    [{ text: 'A/C No. 133-00-0116081-1'},{text: 'A/C No. 8-000-45938800'}],
                                                                    [{ text: 'Bank Mandiri, Bogor'},{text: 'Bank CIMB Niaga, Surabaya'}],
                                                                    [{ text: 'Swift Code : BMRIIDJA'},{text: 'Swift Code : BNIAIDJA'}],
                                                                ]
                                                            }
                                                        },{text: ''}, { text: ''}],
                                                        ]
                                                    }
                                                },  
                                            ],
                                            ]
                                          }
                                    }, 
                                    data.printed == 2 ? 
                                        { 
                                            layout: "noBorders",
                                            table: {
                                                widths: ['*'],
                                                alignment: "right",
                                                layout: "noBorders",
                                                body: [
                                                        [{ text: ''}],
                                                        [{ text: ''}],
                                                        [{ text: ''}],
                                                        [{ text: 'PT. Saraswanti indo Genetech', 
                                                            alignment: "left", 
                                                            margin: [90, -15, 0, 0]}],
                                                        [{ text: ''}],
                                                        [{ text: ''}], 
                                                        [{ text: ''}],
                                                        [{ text: ''}],
                                                        [{ text: ''}],
                                                        [{ text: ''}],
                                                        [{  image: image.ttdkeustamp,
                                                            width: 150,
                                                            margin: [80, -10, 30, 0],
                                                            aligment: "left"}],
                                                        [{ text: 'Samrin Sabarudin ', bold : true, alignment: "left", 
                                                        margin: [90, 0, 0, 0]}],
                                                        [{ text: 'Finance Manager', alignment: "left", 
                                                        margin: [90, 0, 0, 0]}],
                                                    ]
                                            }
                                        } : 
                                            data.conditionInvoice == 1 ? 
                                                { 
                                                    layout: "noBorders",
                                                    table: {
                                                        widths: ['*'],
                                                        alignment: "right",
                                                        layout: "noBorders",
                                                        body: [
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: 'PT. Saraswanti Indo Genetech', alignment: "left", margin: [90, -15, 0, 0]}],
                                                                [{ text: ''}],
                                                                [{ text: ''}], 
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{  image: image.ManagerKeuangan,
                                                                    width: 150,
                                                                    margin: [80, -10, 30, 0],
                                                                    aligment: "left"}],
                                                                [{ text: 'Samrin Sabarudin ', bold : true, alignment: "left", 
                                                                margin: [90, 0, 0, 0]}],
                                                                [{ text: 'Finance Manager', alignment: "left", 
                                                                margin: [90, 0, 0, 0]}],
                                                                [{ text: ''}],
                                                                [{ text: `Page ${ currentPage  } of ${ pageCount }` , alignment: "right" ,margin: [0, -10, 0, 0]}],
                                                            ]
                                                    }
                                                } : 
                                                {
                                                    layout: "noBorders",
                                                    table: {
                                                        widths: ['*'],
                                                        alignment: "right",
                                                        layout: "noBorders",
                                                        body: [
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: 'PT. Saraswanti Indo Genetech', alignment: "left" , margin: [90, 0, 0, 0]}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: ''}],
                                                                [{ text: 'Samrin Sabarudin ', bold : true, alignment: "left", 
                                                                margin: [90, 0, 0, 0]}],
                                                                [{ text: 'Finance Manager', alignment: "left", 
                                                                margin: [90, 0, 0, 0]}],
                                                                [{ text: ''}],
                                                                [{ text: `Page ${ currentPage  } of ${ pageCount }` , alignment: "right" ,margin: [0, -10, 0, 0]}],
                                                            ]
                                                    }
                                                },        
                                    
                                    
                                        
                                    ],
                                  ]
                        }
                    }
                    ];
              
            },
            styles: sssss,
        defaultStyle: {
        columnGap: 5,
        }
      }

      data.printed == 1 ? await this.pdfMake.createPdf(def).print() :  await this.pdfMake.createPdf(def).open()
    
  }

}