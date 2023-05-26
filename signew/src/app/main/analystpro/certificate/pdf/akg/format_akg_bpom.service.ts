import { Injectable,Inject, LOCALE_ID } from '@angular/core';
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
import {siglogo, towards, ilac, kan, GMSales, dwi } from '../atribut/images';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class FormatAkgBpomService {

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

	async generatePdf(data, identity){
		var rows = await [];
		var lhu = await [];
		
		moment.locale('id');

		await data.akg_detail.forEach( x => {
			lhu.push([
				{ 
					text : x.akg_in_lhu.lhu_number, 
					style: {
						fontSize: 11
					},
					margin: [0, 0, 0, 0] 
				}
			])
		})

	
		await rows.push([
			{text: 'INFORMASI NILAI GIZI', colSpan : 4, bold : true, alignment: 'center', border: [true,true,true, false]},
			{text: '', border: [false,true,true, false]},
			{text: '', border: [false,true,true, false]},
			{text: '', border: [false,true,true, false]},
		  ],[
			{text: '', border: [true,false,false, false]},
			{text: '', border: [false,false,false, false]},
			{text: '', border: [false,false,false, false]},
			{text: '', border: [false,false,true, false]},
		  ], [
			{text: `Takaran saji ${ data.takaran_saji}  ${data.size == 1 ? `g` : `ml`}`, alignment: 'left', border: [true,false,false, false]},
			{text: '', border: [false,false,false, false]} ,
			{text: '', border: [false,false,false, false]},
			{text: '', border: [false,false,true, false]},
		  ],
		  !!data.servingperpack ? [
			{text: `${data.servingperpack } Sajian per Kemasan`, alignment: 'left', border: [true,false,false, true]},
			{text: '', border: [false,false,false, true]} ,
			{text: '', border: [false,false,false, true]},
			{text: '', border: [false,false,true, true]},
		  ] : [
			{text: ``, border: [true,false,false, true]},
			{text: '', border: [false,false,false, true]} ,
			{text: '', border: [false,false,false, true]},
			{text: '', border: [false,false,true, true]},
		  ]
		  );

		  await rows.push([
			{text: 'JUMLAH PER SAJIAN', bold: true, colSpan : 4, alignment: 'left', border: [true,false,true, false]},
			{text: '', border: [false,true,true, true]},
			{text: '', border: [false,true,true, true]},
			{text: '', border: [true,true,true, true]},
		  ],
		  [
			{text: '', border: [true,false,false, false]},
			{text: '', border: [false,false,false, false]},
			{text: '', border: [false,false,false, false]},
			{text: '', border: [false,false,true, false]},
		  ],
		  [
			{text: '', border: [true,false,false, false]},
			{text: '', border: [false,false,false, false]},
			{text: '', border: [false,false,false, false]},
			{text: '', border: [false,false,true, false]},
		  ]);


		  await data.akg_parameter.forEach( (x, i) => {
			i == 3 ? rows.push([
				{text: '', border: [true,false,false, false]},
				{text: '', border: [false,false,false, false]},
				{text: '', border: [false,false,false, false]},
				{text: '%AKG*', alignment: 'right', bold: true, border: [false,false,true, false]},
			]) : '',
			rows.push([
				  {
				   border: i == 2 ? [true,false,false, true] : [true,false,false, false],
				   text:  x.akg_master.bold == 0 ?  `\u200B\t \u200B\t${x.data_lab_parameter.name_id}` : `${x.data_lab_parameter.name_id}`,
				   nowarp: true,
				   alignment: 'left',
				   bold: x.akg_master.bold == 0 ? false : true
				  },
				  { border: i == 2 ? [false,false,false, true] : [false,false,false, false],
					text: ``,
					alignment: 'left'
				  },
				  {
				   border: i == 2 ? [false,false,false, true] : [false,false,false, false],
				   text: i < 3 ? '' : `${x.pencantuman} ${x.akg_master.akg_unit}`,
				   alignment: 'right',
				   bold: true
				  },
				  {
				   border: i == 2 ? [false,false,true, true] : [false,false,true, false],
				   alignment: 'right',
				   text:  i < 3 ? `${x.pencantuman} ${x.akg_master.akg_unit}` :  `${x.pencantuman_akg}  %`,
				   bold: true
				  },
		   ]);
		 });

		 await rows.push([
			{
				text: `* Persen AKG berdasarkan kebutuhan energi ${ data.energi }  kkal. Kebutuhan energi anda mungkin lebih tinggi atau lebih rendah.`, 
				italics: true, 
				colSpan : 4, 
				alignment: 'left', 
				border: [true,true,true, true]
			},
			{text: '', border: [false,true,true, true]},
			{text: '', border: [false,true,true, true]},
			{text: '', border: [true,true,true, true]},
		  ]);
	
		let tableParameter = await {
			style: {
				fontSize: 11
			},
			table: {
				widths: [150, 100, 70, 70],
				body: rows,
				dontBreakRows: true,
			},
			layout: {
				hLineWidth: function (i, node) {
					return 2;
				},
				vLineWidth: function (i, node) {
					return 2;
				},
				hLineColor: function (i, node) {
					return 'black';
				},
				vLineColor: function (i, node) {
					return 'black';
				},
				// paddingLeft: function(i, node) { return 4; },
				// paddingRight: function(i, node) { return 4; },
				// paddingTop: function(i, node) { return 2; },
				// paddingBottom: function(i, node) { return 2; },
			},
			margin : [50, 0 , 0 ,0]
		};
		
		await this.loadPdfMaker();
	
		var def = await {
		  pageSize: "A4",
		  pageMargins: [40, 150, 40, 80],
		  pageOrientation: "potrait",
		  header: function (currentPage, pageCount) {		   
			return [
				{
					columns: [
					  {
						image: siglogo,
						width: 150,
						margin: [0, -20, 30, 0]
					},
					], margin: [30, 10, 50, 20]
				},
				{
				  canvas: [{ type: 'line', x1: 10, y1: -30, x2: 595-10, y2: -30, lineWidth: 1 }]
				},
			  ];
		  },
		  content: 
			[
				{ text : data.akg_detail[0].akg_in_lhu.customer.customer_name,
					style: {
						fontSize: 11
					}, },
				lhu,
				{ text : '' },
				{ text : '' },
				{ text : data.akg_detail[0].akg_in_lhu.nama_dagang,
					style: {
					fontSize: 11
				}, 
				alignment : 'center' , 
				margin: [0, 0, 0, 0]},
				{ text : data.akg_detail[0].akg_in_lhu.sample_name, style: {
					fontSize: 11
				},
				alignment : 'center' , 
				margin: [0, 0, 0, 10]},
				tableParameter
		  ],
		  footer: function (currentPage, pageCount) {
			return [ {
				columns: [
					{
						stack: [
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
		  },
		  styles: styles,
		  unbreakable: true,
		  defaultStyle: {
			  // alignment: 'justify'
			  // font: 'din',
			  columnGap: 5,
		  },
		}
		this.pdfMake.createPdf(def).open({}, window)
		
		
	  }
}