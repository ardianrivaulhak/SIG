import { Injectable } from '@angular/core';
import {siglogo, towards, ilac, kan, essentials } from './images';
import {
  headerText,
  subHeader,
  tablecolumn,
  footer,
  styles,
  din,
} from "./mediartu";
import * as htmlToPdfmake from "html-to-pdfmake";
import {url, urlApi} from 'app/main/url';


@Injectable({
  providedIn: 'root'
})
export class MediartuPartialService {

  pdfMake: any;

  constructor() { }

  async loadPdfMaker() {
    if (!this.pdfMake) {
        const pdfMakeModule = await import("pdfmake/build/pdfmake");
        const pdfFontsModule = await import("pdfmake/build/vfs_fonts");
        // const htmlToPdfmake = await import('html-to-pdfmake');
        this.pdfMake = pdfMakeModule.default;
        this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    }
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


    async generatePdf(val) {

        console.log(val)
        let sam = val.selectProduct;
        console.log(sam)

        var rows = await [];

        await rows.push([
            "No",
            "Produk",
            "No. Katalog",
            "Qty",
            "Kemasan",
        ]);
      
    await val.selectProduct.forEach(async (x, i) => {
            await rows.push([
                `${ i + 1 }`,
                `${ x.id.transaction_media_rtu.master_media_rtu.product_name }`,
                `${ x.id.transaction_media_rtu.master_media_rtu.no_katalog  }`,
                `${x.id.unit  }`,
                `${ x.id.transaction_media_rtu.master_media_rtu.kemasan  }`,
            ]);
        });

      let tablesample = await {
          style: ["fontsize8", "marginDalam", "marginawal"],
          table: {
              widths: [25, 230, 70, 50, 75],
              body: rows,
              // dontBreakRows: true,
          },
          alignment: "center",
      };

      await this.loadPdfMaker();
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
                                image: essentials,
                                width: 200,
                                style: 'marginlogo'
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
                                                  text: `${val.data.contract_number}`,
                                                  alignment: "right",
                                              },
                                          ]
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
  
                                image: essentials,
                                width: 200,
                                style: 'margin30'
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
                                                  text: `${val.data.contract_number}`,
                                                  alignment: "right",
                                              },
                                          ]
                                      ],
                                  },
                              },
                          ],
                      },
                  ];
              } else {
                  return [{
  
                      image: essentials,
                      width: 200,
                      style: 'marginlogo'
                    }];
              }
          },
               content: [
                {
                    text: "ACCEPTENCE OF ORDER",
                    style: "bold",
                    alignment: "center",
                    // or after
                },
                {
                    text: val.data.contract_number,
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
                            [ "Nama Pelanggan",":",val.data.customers.customer_name ],
                            [
                                "Person In Charge",
                                ":",
                                val.data.contactpersons.name,
                            ],
                            ["Address", ":", `${val.data.address.address}`],
                            [
                                "Phone / Email",
                                ":",
                                `${val.data.mobile_number != "" ? val.data.mobile_number: "-"} / ${val.data.telp_number != "" ? val.data.telp_number : "-"} / ${val.data.contactpersons.email != "" ? val.data.contactpersons.email : "-" }`,
                            ],
                            ["Purchase Order No", ":", val.data.po_number],
                            
                        ],
                    },
                    
                },
                {
                    style: ["fontsize","margin10"],
                    margin: [10,20,0,10],
                    text: `Menjawab permintaan Bapak/Ibu mengenai permintaan pembelian media kepada kami, dengan ini kami menyerahkan barang dalam keadaan baik * ke pelanggan dengan detail sebagai berikut :  `,
                    colSpan: 2,
                    alignment: "justify",
                },
                
                tablesample,
                sam.length > 4 ? {
                    text: "",
                    pageBreak: "before",
                    style: "marginawal",
                    // or after
                } : {},
                              
              {
                  stack: [
                      {
                          columns: [
                              {
                                  width: "*",
                                  style: ["tableExample", "fontsize"],
                                  layout: "noBorders",
                                  table: {
                                      heights: 100,
                                      width: 400,
                                      body: [
                                          ["Customer,"],
                                          [
                                              val.data.contactpersons.name,
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
                                      heights: 100,
                                      width: 650,
                                      body: [
                                          [
                                              {
                                                  text: `Hormat Kami,
                                                  PT. Saraswanti Indo Genetech`,
                                                  alignment: "right",
                                              },
                                          ],
                                          [
                                              {
                                                  text:`${val.data.employee.employee_name}`,
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
                stack: [
                    {
                        style: ["fontsizeSmall","margintext"],
                        bold: true,
                        text: `* Keadaan tidak baik / keluhan produk dapat disampaikan tidak lebih dari 1 minggu setelah produk diterima
                        Mohon tanda terima ini di tandatangani dan di Fax kembali ke 0251-7540927 atau email ke accounting@saraswanti.com
                        Atas perhatian dan kerjasamanya kamu ucapkan terima kasih.`,
                        colSpan: 2,
                        alignment: "justify",
                    },
                    { 
                        table: {
                            widths: [270, '*', '*'],  
                            margin:[100, 0, 0, 0],
                            body: [
                              [ 
                                {
                              
                                  alignment: "left",
                                  style: ['fontsizeSmall'],
                                  layout: "noBorders",
                                  table: {
                                    style: ["marginrek"],
                                    widths: ['*', '*', '*'],
                                    body: [
                                        [{ 
                                            style: ['fontsizeSmall'],
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
                                        },{text: ''}, { text: ''}                                            
                                        ],
                                        [{text: '' },{text: ''}, { text: ''}],
                                        [{text: 'Mohon infokan bukti pembayaran ke paymentinfo-sig@saraswanti.com' },{text: ''}, { text: ''}],
                                        [{text: 'Please confirm your payment to paymentinfo-sig@saraswanti.com',italics: true },{text: ''}, { text: ''}]
                                        ]
                                    }
                                },  
                            ],
                            ]
                          }
                    }
                ]
              }
              
          ],
          footer: {
            
              columns: [
                  {
                      layout: 'noBorders',
                      table: {
                          widths: [500,'*'],
                          body: [
                              [
                                { 
                                    text: `PT SARASWANTI INDO GENETECH
                                    Graha SIG Jl. Rasamala No. 20 Taman Yasmin Bogor 16113 Indonesia
                                    Phone +62 251 753 2348
                                    www.siglaboratory.com`, 
                                    alignment: 'left', 
                                    style:'marginminus',
                                },
                                {
                                    text: ''
                                }
                                  
                              ],
                          ]
                      }
                  }
                ]
            },
          styles: styles,
          unbreakable: true,
          defaultStyle: {
              // alignment: 'justify'
              // font: 'din',
              columnGap: 5,
          },
      };
        await this.pdfMake.createPdf(def).open();
        }  
}
