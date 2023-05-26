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


export class PorformaInvoiceService {

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


      await data.sample.forEach( (x, i) => {
         rows.push([
            {
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
      style: ["fontsize"],
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
                {
                    
                  columns: [
                    {
                        image: siglogo,
                        width: 180,
                        style: ['margin30'],
                        absolutePosition: { x: 5, y: 0},
                    },
                ],
              } ,

                {
                  text: "Proforma Invoice",
                  style: ['bold', 'header'],
                  fontSize: 21,
                  margin: [0, 80, 0 , 0],
                  alignment: "center",
                  // or after
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
                              heights: 75,
                              body: [
                                [
                                  {
                                    style: ['fontsize'],
                                    layout: 'noBorders',
                                    table: {
                                        widths: [150, 5, '*'],
                                        style: ['fontsize'],
                                        body: [
                                                [{ text: 'Kepada'}, ':', {text: ''}],
                                                [{ text: `${data.customer}`, bold: true},{text: ''}, {text: ''}],
                                                [{ text: `${data.address}`},{text: ''}, {text: ''}],
                                                [{text: ' '},{text: ''},{text: ''} ], 
                                                [{text: ' '},{text: ''},{text: ''} ],
                                                [{ text: 'Telepon / Phone'}, ':', `${data.phone == null ? '-' : data.phone}`],
                                                [{ text: 'Faks /  Fax'}, ':', '-'],
                                                [{text: ' '},{text: ''},{text: ''} ],
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
                                        [{ text: 'No. Proforma Invoice'}, ':',`${data.inv}`],
                                        [{ text: 'Tanggal'}, ':', `${data.date}`],
                                        [{ text: 'Keterangan'}, ':', `${data.cp}`],
                                        [{text: ' '},{text: ''},{text: ''} ],
                                        [{text: ' '},{text: ''},{text: ''} ],
                                        [{text: ' '},{text: ''},{text: ''} ],
                                        [{text: ' '},{text: ''},{text: ''} ],
                                        [{text: ' '},{text: ''},{text: ''} ],
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
                                            [{ text: '*Dokumen ini bukan bukti pembayaran', fontSize: 12, alignment: 'center',bold: true}],
                                            [{ text: '*Pembayaran Harap Mencantumkan No. Invoice', fontSize: 12, alignment: 'center',bold: true}],
                                            [{ text: ''}],
                                            [{ text: '*Bukti transfer mohon difax ke 0251-7540927', fontSize: 12, alignment: 'center',bold: true}],
                                            [{ text: 'atau email ke : paymentinfo-sig@saraswanti.com', fontSize: 12, alignment: 'center',bold: true}],
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
                                            [{ text: 'Sub Total :', alignment: "right"},{ text: `Rp. ${ data.sub.toLocaleString() }`, alignment: "right"}],
                                            [{ text: 'Diskon :', alignment: "right"},{ text: `Rp. ${data.dis.toLocaleString()}`, alignment: "right"}],
                                            [{ text: 'Total :', alignment: "right"},{ text: `Rp. ${(data.sub - data.dis).toLocaleString()}`, alignment: "right"}],
                                            [{ text: 'Biaya Sampling:', alignment: "right"},{ text: `Rp. ${data.sampling.toLocaleString()}`, alignment: "right"}],
                                            [{ text: 'PPN 11% :', alignment: "right"},{ text: `Rp. ${data.ppn.toLocaleString()}`, alignment: "right"}],
                                            [{ text: 'GRANT TOTAL:', alignment: "right"},{ text: `Rp. ${data.tot.toLocaleString()}`, alignment: "right"}]
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
                                                  style: ['fontSize11'],
                                                  layout: "noBorders",
                                                  table: {
                                                    widths: ['*'],
                                                    body: [
                                                        [{ text:'Nomor Rekening Pembayaran : ', alignment: 'center',bold: true},],
                                                        [{ text:'A.n : PT. Saraswanti Indo Genetech', alignment: 'center',bold: true}],
                                                        [{ text:'Mandiri Cab. Bogor Juanda : ', alignment: 'center',bold: true}],
                                                        [{ text:'No. Rek : 133.00.0116081.1', alignment: 'center',bold: true}],
                                                        [{ text:'CIMB Niaga Cab. Surabaya Panglima Sudirman : ', alignment: 'center',bold: true}],
                                                        [{ text:'No. Rek : 8000.4593.8800', alignment: 'center',bold: true}],
                                                        ]
                                                    }
                                                },  
                                            ],
                                            ]
                                          }
                                    }, 
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
                                        }        
                                    
                                    
                                        
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