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
      let page = await Math.ceil(data.samples.length / 10);
      let perpage = await 10;
      let tableParameter = await [];
      
      for(let i = 0; i < page; i++){
        let j = [];
        j.push(
          [
            {
              border: [false,false,false,false],
              text: 'No.'
            },
            {
              border: [false,false,false,false],
              text: "Nama Sample/ Sample Name"
            },
            {
              border: [false,false,false,false],
              text: "Status Pengujian / Test Status",
              alignment: 'center',
            },            
            {
                border: [false,false,false,false],
                text: "Harga Satuan / Unit Price",
                alignment: 'center',
              },
            {
                border: [false,false,false,false],
                text: "Diskon / Discount",
                alignment: 'center',
              },
            {
              border: [false,false,false,false],
              text: "Jumlah / Amount",
              alignment: 'center',
            } 
          ]
        );
        j.push(
            [
              {
                border: [false,false,false,false],
                text: ''
              },
              {
                border: [false,false,false,false],
                text: "Jasa pengujian sampel  /Sample analysis"
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
        for(let z = 0; z < perpage; z++){
          // console.log(data.samples[((i*perpage)+z) + 1]);
          if(data.samples[(i*perpage)+z]){
            j.push([
              {
                // border: [false,false,true,data.samples[((i*perpage)+z) + 1] !== undefined ? false : true],
                border: [false,false,false, false],
                text: `${((i*perpage)+z) + 1}`
               },
               {
                border: [false,false,false, false],
                text: `${data.samples[(i*perpage)+z].samplename}`,
                nowarp: true,
                alignment: 'left',
               },
               {
                border: [false,false,false, false],
                style: ['fontsize'],
                text: `${data.samples[(i*perpage)+z].statuspengujian}`,
                alignment: 'center'
               },
               {
                border: [false,false,false, false],
                alignment: 'right',
                text: `${data.samples[(i*perpage)+z].price.toLocaleString()}`
               },
               {
                border: [false,false,false,false],
                alignment: 'right',
                text: `${data.samples[(i*perpage)+z].discount.toLocaleString()}`
               },
               {
                heights: '*',
                border: [false,false,false, false],
                alignment: 'right',
                text: `${(data.samples[(i*perpage)+z].price - data.samples[(i*perpage)+z].discount).toLocaleString()}`
               }
            ])
          }
        }
        tableParameter = tableParameter.concat(
            {
                absolutePosition: { x: 5, y: 200},
                canvas: 
                [
                    {
                        type: 'line',
                        x1: 5,   y1: 80,
                        x2: 580, y2: 80,
                        lineWidth: 1
                    },
                    {
                        type: 'line',
                        x1: 35, y1: 45,
                        x2: 35, y2: 250,
                        lineWidth: 1
                    },
                    {
                        type: 'line',
                        x1: 325, y1: 45,
                        x2: 325, y2: 250,
                        lineWidth: 1
                    },
                    {
                        type: 'line',
                        x1: 402, y1: 45,
                        x2: 402, y2: 250,
                        lineWidth: 1
                    },
                    {
                        type: 'line',
                        x1: 462, y1: 45,
                        x2: 462, y2: 250,
                        lineWidth: 1
                    },
                    {
                        type: 'line',
                        x1: 520, y1: 45,
                        x2: 520, y2: 250,
                        lineWidth: 1
                    },
                ]
             },
            {
            style: ['fontsize', 'marginMinTop'],
            table: {
              style: ['tableNoMargin', 'fontsize'],
              widths: ['*'],
              heights: 200,
              body: [
                [
                  {
                    table: {
                      style: ['fontsize'],
                      widths: [15, 280, 70, 50, 50, 45],
                      body: j
                    }
                  }
                ]
              ]
            }
          },
          i == (page - 1) ? {} : { text:'', fontSize: 14, bold: true, pageBreak: 'before', margin: [0, 0, 0, 0] }
        )
      }
      // console.log(tableParameter);
      await this.loadPdfMaker();
      var def = {
            pageSize: "A4",
            pageMargins: [10, 300, 10, 300],
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
                                        widths: [150, 5, '*'],
                                        style: ['fontsize'],
                                        body: [
                                                [{ text: 'Kepada /  Bill to'}, ':', {text: ''}],
                                                [{ text: `${data.customer}`, bold: true},{text: ''}, {text: ''}],
                                                [{ text: `${data.cust_addres}`},{text: ''}, {text: ''}],
                                                [{text: ''},{text: ''},{text: ''} ], 
                                                [{text: ''},{text: ''},{text: ''} ],
                                                [{ text: 'Telepon / Phone'}, ':', `${data.telp == null ? '-' : data.telp}`],
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
                                return (i === 0 || i === 1) ? 0.1 : 0;
                              },
                              vLineWidth: function(i, node) {
                                return (i === 0 || i === 1) ? 0.1 : 0;
                              }
                            },
                            table: {
                              widths: ['*'],
                              body: [
                                [
                                  {
                                    style: ['fontsize'],
                                    layout: 'noBorders',
                                    table: {
                                      widths: ['*', 5, '*'],
                                      body: [
                                        [{ text: 'No. PO / PO Number'}, ':',`${ data.no_po == null ? '-' : data.no_po }`],
                                        [{ text: 'No. Kontrak / Contract Number'}, ':', `${ data.kontrak }`],
                                        [{ text: 'Tgl. Faktur Penjualan / Invoice Date'}, ':', ` ${moment(new Date(data.tgl_faktur)).format("DD MMMM YYYY")}`],
                                        // [{ text: 'Termin / Terms'}, ':', `${ data.termin == 0 ? 'Cash' : data.termin }`],
                                        [{ text: 'Termin / Terms'}, ':', `-`],
                                        // [{ text: 'Tgl. Jatuh Tempo / Due Date'}, ':', ` ${data.tgl_jatuh_tempo == null ? '-' : moment(new Date(data.tgl_jatuh_tempo)).format("DD MMMM YYYY")}`],
                                        [{ text: 'Tgl. Jatuh Tempo / Due Date'}, ':', `-`],
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
                }
            ]
            },
            content: tableParameter,
            footer: function(currentPage, pageCount){
                if(currentPage == pageCount){
                    return [ 
                        {
                          margin:[10, -85, 10, 15],
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
                        margin:[10, -10, 10, 15],
                        alignment: 'justify',
                        style: ['fontsize'],
                        table: {
                            widths: ['*'],
                            alignment: "right",
                            body: [
                                    [{ text: `Terbilang / Say: ${data.terbilang} rupiah` }],
                                  ]
                        }
                    },
                    {
                        margin:[10, -10, 10, 15],
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
                                                  style: ['fontsize'],
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
                                                            margin: [90, 0, 0, 0]}],
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
                                                                [{ text: 'PT. Saraswanti indo Genetech', 
                                                                    alignment: "left", 
                                                                    margin: [90, 0, 0, 0]}],
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
                                                                [{ text: 'PT. Saraswanti indo Genetech', alignment: "left" , 
                                                                margin: [90, 0, 0, 0]}],
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
                                                            ]
                                                    }
                                                },        
                                    
                                    
                                        
                                    ],
                                  ]
                        }
                    }
                    ];
                }
              
            },
            styles: sssss,
        defaultStyle: {
        columnGap: 5,
        }
      }

      data.printed == 1 ? await this.pdfMake.createPdf(def).print() :  await this.pdfMake.createPdf(def).open()
    
  }

}
