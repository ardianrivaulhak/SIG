import { Injectable } from '@angular/core';
import * as htmlToPdfmake from "html-to-pdfmake";
import {
  headerImg,
  styles,
  din,
  signatureCoverEn,  
  footer,
  footerCover
} from "../atribut/attribut";

import * as image from '../atribut/images';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import {siglogo, towards, ilac, kan, GMLab, GMSales } from '../atribut/images';

@Injectable({
  providedIn: 'root'
})

export class FormatMikroSNIEnService {
  pdfMake: any;

  constructor() { }

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import("pdfmake/build/pdfmake");
      const pdfFontsModule = await import("pdfmake/build/vfs_fonts");
      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    }
  }

  async generatePdf(sample, check){
    console.log(sample)
    var rows = await [];
    moment.locale('en')
    await rows.push([
        "No",
        "Parameter",
        "n",
        "c",
        "Result",
        "m",
        "M",
        "Unit",
        "Method",
      ]);

      await sample.parameters.forEach( (x, i) => {
         rows.push([
          `${i + 1}`,
          `${x.parameteruji_en == null ? '-' : x.parameteruji_en}`,
          `${x.n == null ? '-' : x.n}`,
          `${x.c == null ? '-' : x.c}`,
           //   `${x.hasiluji == null ? '-' : x.hasiluji}`,
           x.hasiluji == null ? '-' : x.hasiluji.includes('^') ? {
            alignment: 'center',
            margin:[ 18, 0, 0, 0],
            columns: [                    
            {text: x.hasiluji.split('^')[0],alignment: 'right'},
            {text: x.hasiluji.split('^')[1],alignment: 'left', margin:[-5, 0, 0, 0],  fontSize: 6},
                ]} : {
            text: x.hasiluji
            },
          //`${x.m == null ? '-' : x.m}`,
          x.m == null ? '-' : x.m.includes('^') ? {
            alignment: 'center',
            columns: [
            {text: x.m.split('^')[0],alignment: 'right'},
            {text: x.m.split('^')[1],alignment: 'left', margin:[-5, 0, 0, 0], fontSize: 6}
        ]} : {
        text: x.m
        },
        //   `${x.mm == null ? '-' : x.mm}`,
        x.mm == null ? '-' : x.mm.includes('^') ? {
            alignment: 'center',
            columns: [
            {text: x.mm.split('^')[0],alignment: 'right'},
            {text: x.mm.split('^')[1],alignment: 'left', margin:[-5, 0, 0, 0], fontSize: 6}
        ]} : {
        text: x.mm
        },
          `${x.unit == null ? '-' : x.unit}`,
          `${x.metode == null ? '-' : x.metode}`,
        ]);
      });

    let tableParameter = await {
      style: ["fontsize", "marginDalam", "marginawal", "tableParameter"],
      table: {
        widths: [15, 130, 15, 15, 80, 25, 25, 25, 75],
          body: rows,
          style: ["tableParameter"],
          dontBreakRows: true,
      },
      alignment: "center",
    };

    await this.loadPdfMaker();

    var def = {
      pageSize: "A4",
      pageMargins: [40, 150, 40, 80],
      pageOrientation: "potrait",
      header: function (currentPage, pageCount) {
       
        if(currentPage > 1){
            return [{
            columns: [
              {
                image: image.siglogo,
                width: 150,
                margin: [0, -20, 30, 0]
              } ,
              {
                style: ["fontsize10"],
                alignment: "right",
                layout: "noBorders",
                table: {
                    widths: ["*"],
                    body: [
                        [
                            {
                                text: "28.1/F-PP Revisi 4",
                                alignment: "right",
                                style: ["rightHeader", "fontsize8"]
                            },
                        ]
                    ],
                },
            },
            ], margin: [30, 10, 50, 20]
          },{
            canvas: [{ type: 'line', x1: 35, y1: -30, x2: 555-10, y2: -30, lineWidth: 1 }]
          },
          ]
          }else{
            return [
              {
                  columns: [
                    {
                      image: image.siglogo,
                      width: 150,
                      margin: [0, -20, 30, 0]
                  },
                  ], margin: [30, 10, 50, 20]
              },
              {
                canvas: [{ type: 'line', x1: 10, y1: -30, x2: 595-10, y2: -30, lineWidth: 1 }]
              },
            ];
          }
        },
      content: 
        [
            sample.condition_cert[sample.condition_cert.length - 1].status != 3 ?
            {
              stack: [
                  {
                      columns: [
                          {                           
                              style: ["fontSize10", "leftCover"],
                              layout: "noBorders",
                              table: {
                                  width: ["*", 5, "*"],
                                  body: [
                                      [{text: `No`}, ":", {text: sample.cl_number}],
                                      [{text: `Subject`}, ":", {text: `Result of Analysis`}],
                                  ],
                              },
                          },
                          {
                            text:
                              `Bogor, ${moment(new Date(sample.date_at)).format("MMMM DD, YYYY")}`,
                            alignment: "right",
                            style: ["fontSize10", "rightCover"],
                          },
                      ],
                      unbreakable: true,
                  },
              ],
          } : {},
          sample.condition_cert[sample.condition_cert.length - 1].status != 3 ?
          {
              text:
                  `To :
                  ${sample.customer.customer_name}
                  ${sample.address.address}`,
              alignment: "justify",
              style: ["fontSize10", "startCover"],
          } : {},
          sample.condition_cert[sample.condition_cert.length - 1].status != 3 ?
          {
            text:
                `Dear Sir/Madam,
                As your order no : ${sample.transaction_sample.kontrakuji.contract_no} , herewith we send the result of analysis.`,
            alignment: "justify",
            style: ["fontSize10", "marginCover"],
          } : {},
          sample.condition_cert[sample.condition_cert.length - 1].status != 3 ?
          {
            text:
                `Thank you for your cooperation. `,
            alignment: "justify",
            style: ["fontSize10", "marginCover"],
          }: {},    
          sample.condition_cert[sample.condition_cert.length - 1].status != 3 ? 
          {
              stack: [
                {
                  width: "*",
                  style: ["fontSize10", "marginSignature"],
                  layout: "noBorders",
                  table: {
                      heights: 10,
                      body: [
                          [{text: `Yours Faithfully,`}],
                          [{text: `PT. Saraswanti Indo Genetech`}],
                          [{
                            image: GMSales,
                            width: 150,
                            margin: [0, -20, 30, 0]
                          }],
                          [{text: `RB Ernesto Arya`, bold:true}],
                          [{text: `GM`}],
                          [{text: `Sales & Marketing`}],
                      ],
                  },
              },
              ],
          } : {},
          sample.condition_cert[sample.condition_cert.length - 1].status != 3 ?
          {
            text: "",
            pageBreak: "before",
            style: "pageBreakMargin",
          } : {},
        {
            columns: [
              {
                style: ["fontSize10"],
                layout: "noBorders",
                alignment: 'center',
                table: {
                    width: ["*", 5, "*"],
                    body: [
                        [{
                          text: 'RESULT OF ANALYSIS / LAPORAN HASIL UJI',
                          style: ['subHead'],
                          alignment: 'center'
                        }]
                    ],
                },
              }
            ]
          },
        {
          style: ["fontSize10", "margin10", "tableExample"],
          alignment: "left",
          layout: "noBorders",
          table: {
            widths: [15, 250, 5, "*"],
            body: [
                [{text: 'I.', bold: true}, {text: 'Number / Nomor',  colSpan: 3, bold: true }, {}, {}],
                [{}, {text:'1.1. Order No. / No. Order'}, ':', sample.transaction_sample.kontrakuji.contract_no],
                [{}, {text:'1.2. Certificate No. / No. sertifikat'}, ':', sample.lhu_number],
                [{text: 'II.', bold: true}, {text: 'Principal / Pelanggan',  colSpan: 3, bold: true }, {}, {}],
                [{}, {text:'2.1. Name / Nama'}, ':', sample.customer_name == null ? '-' :  sample.customer.customer_name],
                [{}, {text:'2.2. Address / Alamat'}, ':', sample.customer_address == null ? '-' :  sample.address.address],
                [{}, {text:'2.3. Phone / Telepon'}, ':', sample.customer_telp == null ? '-' :  sample.customer_telp],
                [{}, {text:'2.4. Contact Person / Personil Penghubung'}, ':', sample.contact_person == null ? '-' :  sample.contact_person.name],
                [{text: 'III.', bold: true}, {text: 'Sample / Contoh Uji',  colSpan: 3, bold: true }, {}, {}],
                [{}, {text:'3.1. Sample Code / Kode Sampel '}, ':', sample.kode_sample == null ? '-' :  sample.kode_sample],
                [{}, {text:'3.2. Batch Number / No Batch'}, ':', sample.batch_number == null ? '-' :  sample.batch_number],
                [{}, {text:'3.3. Lot Number / No Lot '}, ':', sample.lot_number == null ? '-' :  sample.lot_number],
                [{}, {text:'3.4. Packaging / Kemasan '}, ':', sample.jenis_kemasan == null ? '-' :  sample.jenis_kemasan],
                [{}, {text:'3.5. Production Date / Tanggal Produksi'}, ':', sample.tgl_produksi == null ? '-' :  sample.tgl_produksi],
                [{}, {text:'3.6. Expire Date / Tanggal Kadaluarsa '}, ':', sample.tgl_kadaluarsa == null ? '-' :  sample.tgl_kadaluarsa],
                [{}, {text:'3.7. Factory Name / Nama Pabrik '}, ':', sample.nama_pabrik == null ? '-' :  sample.nama_pabrik],
                [{}, {text:'3.8. Factory Address / Alamat Pabrik'}, ':', sample.alamat_pabrik == null ? '-' :  sample.alamat_pabrik],
                [{}, {text:'3.9. Trade Mark / Nama Dagang'}, ':', sample.nama_dagang == null ? '-' :  sample.nama_dagang],
                [{}, {text:'3.10. Sample Name / Nama Sample'}, ':', sample.sample_name == null ? '-' :  sample.sample_name],
                [{}, {text:'3.11. Other Information / Keterangan Lain'}, ':', sample.keterangan_lain == null ? '-' :  sample.keterangan_lain],
                [{}, {text:'3.12. Date of Sampling / Tanggal Sampling'}, ':', sample.tgl_sampling == null ? '-' :  moment(sample.tgl_sampling).format("MMMM DD, YYYY")],
                [{}, {text:'3.13. Sampling Location / Lokasi Sampling'}, ':', sample.location == null ? '-' :  sample.location],
                [{}, {text:'3.14. Method Sampling / Metode Sampling'}, ':', sample.metode == null ? '-' :  sample.metode],
                [{}, {text:'3.15. Personnel Sampling / Personil Sampling'}, ':', sample.pic == null ? '-' :  sample.employee_sampling.employee_name],
                [{}, {text:'3.16. Environmental Conditions / Kondisi Lingkungan'}, ':', sample.kondisi_lingkungan == null ? '-' :  sample.kondisi_lingkungan],
                [{}, {text:'3.17. Date of Acceptance / Diterima '}, ':', sample.tgl_input == null ? '-' :  moment(sample.tgl_input).format("MMMM DD, YYYY")  ],
                [{}, {text:'3.18. Date of Analysis / Tanggal Uji'}, ':', `${moment(sample.tgl_mulai).format("MMMM DD, YYYY")} - ${moment(sample.tgl_selesai).format("MMMM DD, YYYY")}`],
                [{}, {text:'3.19. Type of Analysis / Jenis Uji '}, ':', 'Enclosed'],
                [{text: 'IV.', bold: true}, {text: 'Result / Hasil Uji',  colSpan: 3, bold: true }, {}, {}],
            ]
          }
        }, 
        {
          text: "",
          pageBreak: "before",
          style: "pageBreakMargin",
        },
        tableParameter,
        {
            style: ["fontSize10"],
            width: [20, 10, "*"],
            layout: "noBorders",
            table : {
                body: [
                    [{text: `n`}, {text: `=`}, {text: `Number of samples taken and analyzed`}],                    
                    [{text: `c`}, {text: `=`}, {text: `The maximum number of samples that may exceed the microbial limit`}],
                    [{text: `m, M`}, {text: `=`}, {text: ` Microbial limit`}],
                    [{text: `NA`}, {text: `=`}, {text: `Not applicable`}],
                    [{text:''},{text:''},{text: ``}],
                    [{text:''},{text:''},{text: ``}],
                ],
            }
        },
        {
          stack: [
              {
                  columns: [
                    sample.condition_cert[sample.condition_cert.length - 1].status != 3 ? 
                    {
                      width: 200,
                      style: ["tableExample", "fontsize"],
                      layout: "noBorders",
                      table: {
                          heights: 10,
                          width: 500,
                          body: [
                              [{text:  `Bogor, ${moment(new Date(sample.date_at)).format("MMMM DD, YYYY")}`, }],
                              [{text: `PT. Saraswanti Indo Genetech`}],
                              [{
                                image: image.dwi,
                                width: 150,
                                margin: [0, -20, 30, 0]
                              }],
                              [{text: `Dwi Yulianto Laksono, S.Si`, bold:true}],
                              [{text: `General Laboratory Manager`}],
                          ],
                      }
                    } : 
                    {
                      width: 200,
                      style: ["tableExample", "fontsize"],
                      layout: "noBorders",
                      table: {
                          heights: 10,
                          width: 500,
                          body: [
                              [{text: `Bogor,${moment(new Date(sample.date_at)).format("MMMM DD, YYYY")}`}],
                              [{text: `PT. Saraswanti Indo Genetech`}],
                              [{text: ``}],
                              [{text: ``}],
                              [{text: ``}],
                              [{text: ``}],
                              [{text: ``}],
                              [{text: ``}],
                              [{text: `Dwi Yulianto Laksono, S.Si`, bold:true}],
                              [{text: `General Laboratory Manager`}],
                          ],
                      }
                    },
                    {
                        width: "*",
                        style: ["tableExample", "fontsize"],
                        layout: "noBorders",
                        table: {
                            heights: 50,
                            width: 500,
                            body: [
                                [
                                {qr: 'http://siglab.co.id/#/certificate/pdf-certificate/' + sample.id + '/en', fit:'75'}
                                ],
                            ],
                        },
                    },
                      {
                          text: "",
                          width: 250,
                      },
                  ],
                  unbreakable: true,
              },
          ],
      },
        
      ],
      watermark: 
      sample.condition_cert[sample.condition_cert.length - 1].status != 3 ? 
        {} :  { text: 'DRAFT', color: 'blue', opacity: 0.3, bold: true, italics: false },
      footer: function (currentPage, pageCount) {
        if(currentPage > 1){
          return [ {
            columns: [
                {
                    stack: [
                        {
                            text: `Result Of Analysis | Page ${ currentPage -1 } of ${ pageCount -1 }`,
                                        style: 'resultofanalysisFooter',
                                        alignment: 'right'
                        },
                        {
                            
                    layout: 'noBorders',
                    style: 'tested',
                    table: {
                        widths: ['*','*'],
                        body: [
                            [
                               
                                { 
                                    text: `PT SARASWANTI INDO GENETECH
                                    Graha SIG Jl. Rasamala No. 20 Taman Yasmin Bogor 16113
                                    Tel. +62 251 7532 348 Hotline. +62 821 11 516 516
                                    www.siglaboratory.com`, 
                                    style:'rightFooter',
                                    alignment: 'left'
                                },
                                {
                                    text: `The results of these tests relate only to the sample(s) submitted.
                                    This report shall not be reproduced except in full context,
                                    without the written approval of PT. Saraswanti Indo Genetech`,
                                    style: 'leftFooter',
                                    alignment: 'right'
                                }
                            ]
                        ]
                    }
                        }
                    ]
                }
              ]
          } ]
        }else{
          return [ {
            columns: [
              {
                  layout: 'noBorders',
                  style: 'tested',
                  table: {
                      widths: ['*', 100, 100],
                      body: [
                          [
                              
                              { 
                                  text: `PT SARASWANTI INDO GENETECH
                                  Graha SIG Jl. Rasamala No. 20 Taman Yasmin Bogor 16113
                                  Tel. +62 251 7532 348 Hotline. +62 821 11 516 516
                                  www.siglaboratory.com`, 
                                  style:'rightFooter',
                                  alignment: 'left'
                              },
                              {
                                  image: image.ilac,
                                  width: 40,
                                  style: 'marginLogoPartner',
                                  alignment: 'right'
                              },
                              {
                                  image: image.kan,
                                  width: 60,
                                  style: 'marginLogoPartner2',
                                  alignment: 'right'
                              }
                          ]
                      ]
                  }
              }
            ]
          } ]
        }
      },
      styles: styles,
      unbreakable: true,
      defaultStyle: {
          // alignment: 'justify'
          // font: 'din',
          columnGap: 5,
      },
    }
    check.length > 0 ?   this.pdfMake.createPdf(def).open({}, window) : this.pdfMake.createPdf(def).download(`${sample.lhu_number == null ? 'Certificate' : sample.lhu_number}.pdf`)
  }

}
