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

export class LabelMaxMediaRtuService {

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

    moment.locale('id')

    
    
    await this.loadPdfMaker();

    var def = await {
      pageSize: { width: 377.9, height: 453.5 },
      pageMargins: [40, 30, 30, 10],
      pageOrientation: "potrait",
      content: 
      [
        {
            stack : [
                {
                    text: 'ESSMP01-10P',
                    alignment: 'right'
                },
                {
                    text: [ {text : 'ALOA ' , color:'#38b6ff', bold:true }, '| Agar Listeria acc. to Ottaviani Agosti Agar'],
                    style: 'labelFontHeader'
                },
                {
                    text: 'Verified by SNI ISO 11133:2016',
                },
                {
                    text: 'FOR LABORATORY USE',
                    bold: true
                },
                {
                    text: 'Store at-28 C',
                },
                {
                    text: 'Production date:',
                },
                {
                    text: 'Expired date:',
                },
                {
                      columns: [
                        {
                          image: image.essentials,
                          width: 150,
                      },
                      ], 
                      margin: [170, 0, 0, 0],
                  },
            ] ,
        },
        {
            canvas: [
                { type: 'line', x1: -30, y1: -210, x2: 330, y2: -210, lineWidth: 1 }, //Up line
                { type: 'line', x1: -30, y1: 220, x2: 330, y2: 220, lineWidth: 1 }, //Bottom line
                { type: 'line', x1: -30, y1: -210, x2: -30, y2: 220, lineWidth: 1 }, //Left line
                { type: 'line', x1: 330, y1: -210, x2: 330, y2: 220, lineWidth: 1 }, //Rigth line
            ]
        },
      ],
      styles: styles,
      unbreakable: true,
      defaultStyle: {
          columnGap: 5,
      },
    }
    this.pdfMake.createPdf(def).open()
    
    
  }

}
