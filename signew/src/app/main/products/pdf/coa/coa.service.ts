import { Injectable,Inject, LOCALE_ID } from '@angular/core';
import * as htmlToPdfmake from "html-to-pdfmake";
import { styles } from "../attribute/attribut";
import * as image from '../attribute/images';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class CoaMediaRtuService {

  pdfMake: any;
  datePipeString : string;

  constructor(@Inject(LOCALE_ID) private locale: string) { }

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import("pdfmake/build/pdfmake");
      const pdfFontsModule = await import("pdfmake/build/vfs_fonts");
      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    }
  }

  async generatePdf(sample){
    const htmlToPdfmake = require("html-to-pdfmake");
    let html = htmlToPdfmake(`
    <!DOCTYPE html>
      <html>
      <head>
      <title>Page Title</title>
      </head>
      <body>
      ${sample.coa_mediartu.data}
      </body>
      </html>`);

    moment.locale('id')

    
    
    await this.loadPdfMaker();

    var def = await {
      pageSize: "A4",
      pageMargins: [40, 70, 40, 80],
      pageOrientation: "potrait",
      header: function (currentPage, pageCount) {       
        return [
          {
              columns: [
                {
                  image: image.essentials,
                  width: 150,
                  margin: [0, -20, 30, 0]
              },
              ], margin: [30, 30, 50, 20]
          },
          {
            canvas: [{ type: 'line', 
            x1: 300, y1: -80, x2: 595-0, y2: -80, 
            lineWidth: 20,
            lineColor: '#38b6ff',}]
          },
        ];
      },
      content: 
      [
        html    
      ],
      footer: function (currentPage, pageCount) {
        return [ {
          columns: [
            {
                layout: 'noBorders',
                style: 'marginfoo',
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
                               
                            },
                            {
                                
                            }
                        ],
                        [
                            
                          {
                            canvas: [{ type: 'line', 
                            x1: 0, y1: 0, x2: 300-0, y2: 0, 
                            lineWidth: 20,
                            lineColor: '#38b6ff',}]
                          },
                          {
                             
                          },
                          {
                              
                          }
                      ],
                    ]
                },
                
            },
            
          ]
        } ]
      },
      styles: styles,
      unbreakable: true,
      defaultStyle: {
          // alignment: 'justify'
          // font: 'din',
          columnGap: 5,
      },
    }
    this.pdfMake.createPdf(def).open()
    
    
  }

}
