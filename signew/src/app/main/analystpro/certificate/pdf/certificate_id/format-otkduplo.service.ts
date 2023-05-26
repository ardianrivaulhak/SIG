import { Injectable } from '@angular/core';
import * as htmlToPdfmake from "html-to-pdfmake";
import {
  headerImg,
  styles,
  din,
  signatureCover,
  footer,
  footerCover
} from "../atribut/attribut";
// import {siglogo, towards, ilac, kan, GMSales, GMLab } from '../atribut/images';
import * as image from '../atribut/images';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class FormatOtkDuploService {

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
    moment.locale('id')
    await rows.push([
        "No",
        "Parameter",
        "Unit",
        "Simplo",
        "Duplo",
        "Limit Of Detection",
        "Method",
    ]);

    await sample.parameters.forEach( (x, i) => {
        rows.push([
        `${i + 1}`,
        `${x.parameteruji_id == null ? '-' : x.parameteruji_id}`,
        `${x.unit == null ? '-' : x.unit}`,
        `${x.simplo == null ? '-' : x.simplo}`,
        `${x.duplo == null ? '-' : x.duplo}`,
        `${x.lod == null ? '-' : x.lod}`,
        `${x.metode == null ? '-' : x.metode}`,
        ]);
    });

    let tableParameter = await {
      style: ["fontsize", "marginDalam", "marginawal"],
      table: {
          widths: [15, "*", "*", "*", "*", "*", "*"],
          body: rows,
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
                                        [{text: `Lamp`}, ":", {text: ` 1 Halaman`}],
                                        [{text: `Perihal`}, ":", {text: `Laporan Hasil Uji Laboratorium`}],
                                    ],
                                },
                            },
                            {
                              text:
                                  `Bogor, ${moment(new Date(sample.date_at)).format("DD MMMM YYYY")}`,
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
                    `Kepada Yth.
                    ${sample.customer.customer_name}
                    ${sample.address.address}`,
                alignment: "justify",
                style: ["fontSize10", "startCover"],
            } : {},
            sample.condition_cert[sample.condition_cert.length - 1].status != 3 ?
            {
              text:
                  `Dengan hormat,
                  Berdasarkan surat order marketing nomor : ${sample.transaction_sample.kontrakuji.contract_no}, maka bersama ini kami sampaikan hasil uji analisis laboratorium`,
              alignment: "justify",
              style: ["fontSize10", "marginCover"],
            } : {},
            sample.condition_cert[sample.condition_cert.length - 1].status != 3 ?
            {
              text:
                  `Demikian surat ini kami sampaikan semoga dapat dipergunakan sebagaimana mestinya.
                  Atas kerjasamanya yang baik kami mengucapkan terima kasih.`,
              alignment: "justify",
              style: ["fontSize10", "marginCover"],
            } : {},      
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
                          [{text: `Hormat Kami,`}],
                          [{text: `PT. Saraswanti Indo Genetech`}],
                          [{
                            image: image.GMSales,
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
                [{}, {text:'3.10. Sample Name / Nama Sample'}, ':', sample.sample_name == null ? '-' :  sample.sample_name]
            ]
          }
        }, 
        {
          text: "",
          pageBreak: "before",
          style: "pageBreakMargin",
        },
        {
            style: ["fontSize10", "margin10", "tableExample"],
            alignment: "left",
            layout: "noBorders",
            table: {
              widths: [15, 250, 5, "*"],
              body: [
                  [{}, {text:'3.11. Other Information / Keterangan lain'}, ':', sample.keterangan_lain == null ? '-' :  sample.keterangan_lain ],
                  [{}, {text:'\u200B\t \u200B\t 3.11.1. No Notifikasi'}, ':', sample.no_notifikasi == null ? '-' :  sample.no_notifikasi ],
                  [{}, {text:'\u200B\t \u200B\t 3.11.2. No Pengajuan'}, ':', sample.no_pengajuan == null ? '-' :  sample.no_pengajuan ],
                  [{}, {text:'\u200B\t \u200B\t 3.11.3. No Registrasi'}, ':', sample.no_registrasi == null ? '-' :  sample.no_registrasi],
                  [{}, {text:'\u200B\t \u200B\t 3.11.4. No Principal Code'}, ':', sample.no_principalcode == null ? '-' :  sample.no_principalcode],
                  [{}, {text:'3.12. Date of Received / Diterima'}, ':',sample.tgl_input == null ? '-' :  moment(sample.tgl_input).format("DD MMMM YYYY")  ],
                  [{}, {text:'3.13. Date of Analysis/ Tanggal Uji'}, ':', `${moment(sample.tgl_mulai).format("DD MMMM YYYY")} - ${moment(sample.tgl_selesai).format("DD MMMM YYYY")}`],
                  [{}, {text:'3.14. Type of Analysis / Jenis Uji '}, ':', 'Terlampir']
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
                                [{text: `Bogor, ${moment(sample.condition_cert[0].date_at ).format("DD MMMM YYYY")}`}],
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
                                [{text: `Bogor, ${moment(new Date(sample.date_at)).format("DD MMMM YYYY")}`}],
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
                                    {qr: 'http://siglab.co.id/#/certificate/pdf-certificate/' + sample.id + '/id', fit:'75'}
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
