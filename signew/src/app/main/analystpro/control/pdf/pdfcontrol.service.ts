import { Injectable } from '@angular/core';
import * as htmlToPdfmake from "html-to-pdfmake";
import {
  headerText,
  styles,
  din,
} from "./form-control";
import * as image from './images';

@Injectable({
  providedIn: 'root'
})

export class PdfcontrolService {

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

  async generatePdf(val){
    console.log(val)
    
    var rows = await [];

    await rows.push([
        "No",
        "Sample No.",
        "Sample Type",
        "Parameter Type",
        "Parameter",
        "Metode.",
        "Lab Estimate",
        "Result",
        "LOD",
        "Unit",
    ]);

    val.parameter.forEach((x, index) => {
        rows.push([
          index+1,
          x.no_sample,
          x.sub_catalogue_name,
          x.type_param,
          x.name_id,
          x.metode,
          x.tgl_estimasi_lab,
          x.hasiluji,
          x.nama_lod,
          x.nama_unit,
        ]);
    });

    let tablesample = {
      style: ["fontsize", "marginDalam", "marginawal"],
      table: {
          widths: ['5%', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
          body: rows,
          dontBreakRows: true,
      },
      alignment: "center",
    };

    await this.loadPdfMaker();
    
    var def = {
      pageSize: "A4",
      pageMargins: [40, 80, 40, 50],
      pageOrientation: "landscape",
        header: function (currentPage, pageCount) {
          return [
            {
                columns: [
                    {
                      image: image.logosig,
                      width: 150,
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
                                        text: `No 26.2/F-PP`,
                                        alignment: "right",
                                    },

                                ],
                                [
                                  {
                                      text: `Revisi : 4`,
                                      alignment: "right",
                                  },

                              ],
                                [
                                    {
                                        text: `Page ${ currentPage } of ${ pageCount }`,
                                        alignment: "right",
                                    },
                                ]
                            ],
                        },
                    },
                ],
            },
          ];
        },
        content: 
          [
        
          {
            text: 'FORMULIR SPESIFIKASI PENGUJIAN',
            style: ['header', 'fontsize16'],
            alignment: 'center'
          },
          {
            style: ["fontsize", "margin10", "tableExample"],
            alignment: "left",
            layout: "noBorders",
            table: {
              widths: [150, 5, "*"],
              body: [
                ['Contract Number', ':', val.contract[0].contract_no],
                ['Kendali User', ':', val.contract[0].condition_contract_control.length  < 2 ? '-' : val.contract[0].condition_contract_control[1].user.employee_name],
                ['Memo', ':', val.contract[0].description_kendali.length < 1 ? '-' : val.contract[0].description_kendali[0].desc],
              ]
            }
          }, 
            tablesample,
          
        ],
      styles: styles,
      unbreakable: true,
      defaultStyle: {
          // alignment: 'justify'
          // font: 'din',
          columnGap: 5,
      },
    }
    this.pdfMake.createPdf(def).download(`${val.contract[0].contract_no}.pdf`);
  }

  
}
