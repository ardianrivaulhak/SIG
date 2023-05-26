import { Injectable } from '@angular/core';
import * as htmlToPdfmake from "html-to-pdfmake";
import {
  headerText,
  styles,
  din,
} from "./average";

@Injectable({
  providedIn: 'root'
})
export class AverageserviceService {
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

    val.data.forEach((x, index) => {
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
      pageOrientation: "portrait",
        header: function (currentPage, pageCount) {
          return [
            {
                columns: [
                    headerText,
                    {
                        style: ["testing2", "fontsize"],
                        alignment: "right",
                        layout: "noBorders",
                        table: {
                            widths: ["*"],
                            body: [
                                [
                                    {
                                        text: `No 26.2/F-PP/SMM-SIG`,
                                        alignment: "right",
                                    },

                                ],
                                [
                                  {
                                      text: `Revisi : 3`,
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
                ['Contract Number', ':', val.data[0].contract_no],
                ['Sample Recipient', ':', 'OK?'],
                ['Date Received at the Laboratory', ':', 'OK?'],
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
    this.pdfMake.createPdf(def).open();
  }
}
