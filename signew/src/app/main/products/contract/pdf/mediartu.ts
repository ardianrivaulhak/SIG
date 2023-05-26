
import {siglogo, towards, ilac, kan } from './images';

const headerText = {
        image: siglogo,
        width: 150,
        style: 'margin30'
      };

      const subHeader = {
          text: 'TESTING POLICY AT SIG LABORATORY',
          style: 'subheader'
      }

      const tablecolumn = {
          widths: ['*','*'],
          aligment: 'justify',
          columns: [
              {
                style: 'term',
                layout: 'noBorders',
                table: {
                    widths: [15, 200],
                    headerRows: 2,
                    // keepWithHeaderRows: 1,
                    body: [
                        [{text: `Sample Preparation Terms`,style:'bold', colSpan: 2, alignment: 'justify'}, {}],
                        [{text: `To ensure sample safety and the accuracy of test results, ensure that the test samples sent or submitted are in good standing and representative of your work, the recommendations from SIG are as follows:`, colSpan: 2, alignment: 'justify'}, {}],
                        [
                            {
                                text: '1.',
                                alignment: 'right'
                            },
                            {
                                text: 'Store the test samples in an appropriate container, avoiding leaking to prevent environmental contamination',
                                alignment: 'justify'
                            },
                        ],
                        [
                            {
                                text: '2.',
                                alignment: 'right'
                            },
                            {
                                text: 'Prefer stronger materials for containers to prevent any damage or leakage during delivery',
                                alignment: 'justify'
                            },
                        ],
                        [
                            {
                                text: '3.',
                                alignment: 'right'
                            },
                            {
                                text: 'Clarify the handling specifications, such as storage temperature, outside of the package',
                                alignment: 'justify'
                            },
                        ],
                        [
                            {
                                text: '4.',
                                alignment: 'right'
                            },
                            {
                                text: 'Ensure the sample identity label is correct. This greatly influences the test results',
                                alignment: 'justify'
                            },
                        ],
                        [
                            {
                                text: '5.',
                                alignment: 'right'
                            },
                            {
                                text: 'SIG does not take responsibility for any damages incurred during the shipment process',
                                alignment: 'justify'
                            },
                        ],
                        [{text: `Sample Condition Terms`,style:'bold', colSpan: 2, alignment: 'justify'}, {}],
                        [
                            {
                                text: '1.',
                                alignment: 'right'
                            },
                            {
                                text: 'SIG will not accept samples that may have abnormal conditions except with the approval of the customer',
                                alignment: 'justify'
                            },
                        ],
                        [
                            {
                                text: '2.',
                                alignment: 'right'
                            },
                            {
                                text: 'Samples for chemical and microbiological testing are required to be packaged separately',
                                alignment: 'justify'
                            },
                        ],
                        [
                            {
                                text: '3.',
                                alignment: 'right'
                            },
                            {
                                text: 'Samples with the need for microbiological tests, carbon dioxide, organic compounds / permangant index value, moisture content, integrity, alcohol, peroxide number, iodine number, initial / final oxygen solubility, vitamins, initial / final total bacteria, free chlorine, complete weight and empty cavities are to be kept in separate packaging',
                                alignment: 'justify'
                            },
                        ],
                        [
                            {
                                text: '4.',
                                alignment: 'right'
                            },
                            {
                                text: 'Samples with the need for testing vitamins, curcumin, red already, total carotene, and antioxidants should be maintained at a temperature and protected from direct sunlight',
                                alignment: 'justify'
                            },
                        ],
                    ]
                }
              },
              {
                style: 'term',
                layout: 'noBorders',
                table: {
                    widths: [15, 200],
                    headerRows: 2,
                    body: [
                        [
                            {
                                text: '5.',
                                alignment: 'right'
                            },
                            {
                                text: 'Samples of raw materials should be attached with COA / MSDS of the product.',
                                alignment: 'justify'
                            },
                        ],
                        [
                            {
                                text: '6.',
                                alignment: 'right'
                            },
                            {
                                text: 'Testing of weight uniformity and volume uniformity requires a minimum 25 packages to be tested.',
                                alignment: 'justify'
                            },
                        ],
                        [
                            {
                                text: '7.',
                                alignment: 'right'
                            },
                            {
                                text: 'Testing of deliverable volume requires a minimum 10 packages to be tested and equipped with product volume claim information',
                                alignment: 'justify'
                            },
                        ],
                        [
                            {
                                text: '8.',
                                alignment: 'right'
                            },
                            {
                                text: 'Antimicrobial testing requires a minimum of 120 ml or in mg per one test microbe',
                                alignment: 'justify'
                            },
                        ],
                        [
                            {
                                text: '9.',
                                alignment: 'right'
                            },
                            {
                                text: 'Testing the effectiveness of preservatives requires a minimum of 120 ml or in mg per one test microbe',
                                alignment: 'justify'
                            },
                        ],
                        [
                            {
                                text: '10.',
                                alignment: 'right'
                            },
                            {
                                text: 'Legionella testing requires a minimum of 1000 ml',
                                alignment: 'justify'
                            },
                        ],
                        [
                            {
                                text: '11.',
                                alignment: 'right'
                            },
                            {
                                text: 'If the amount of sample does not meet the conditions mentioned, SIG will not accept any complaints or requests for re-testing',
                                alignment: 'justify'
                            },
                        ],
                        [{text: `Sample Delivery Terms`,style:['bold','margintop5'], colSpan: 2, alignment: 'justify'}, {}],
                        [{text: `Please send the test sample accompanied by an offer letter, as well as the completed customer data form to either of the following locations:`, colSpan: 2, alignment: 'justify'}, {}],
                        [{text: `SIG Head Office & Laboratory`,style:'bold', colSpan: 2, alignment: 'justify'}, {}],
                        [{text: `Graha SIG Jl. Rasamala No. 20 Taman Yasmin Kota Bogor, Jawa Barat 16113, +62 (251) 7532348`, colSpan: 2, alignment: 'justify'}, {}],
                        [{text: `SIG Jakarta`,style:'bold', colSpan: 2, alignment: 'justify'}, {}],
                        [{text: `Jl. Percetakan Negara No. 52 B RT 06/RW 01 Rawasari, Cempaka Putih, Jakarta, +62 (21) 21479292`, colSpan: 2, alignment: 'justify'}, {}],
                        [{text: `SIG Surabaya Laboratory`,style:'bold', colSpan: 2, alignment: 'justify'}, {}],
                        [{text: `AMG Tower Lt. 12 Jl. Dukuh Menanggal Gayungan, Kota Surabaya, Jawa Timur 60234, +62 (31) 82531288`, colSpan: 2, alignment: 'justify'}, {}],
                        [{text: `SIG Semarang`,style:'bold', colSpan: 2, alignment: 'justify'}, {}],
                        [{text: `Jl. Bina Remaja No. 1A (Ruko A) Banyumanik, Kota Semarang, Jawa Tengah 50264, +62 (24) 76403685`, colSpan: 2, alignment: 'justify'}, {}],
                        [{text: `Yogyakarta Representative`,style:'bold', colSpan: 2, alignment: 'justify'}, {}],
                        [{text: `0896 4856 9422 (Arifin)`, colSpan: 2, alignment: 'justify'}, {}],
                    ]
              }
            }
          ]
      }

      const din = {
              normal: '/assets/fonts/DIN-Light.otf',
              bold: '/assets/fonts/DIN-Bold.otf',
      }

      const footer = (contractype) => {
        return {
            columns: [
            {
                layout: 'noBorders',
                style: 'tested',
                table: {
                    widths: ['*','*',50,120],
                    body: [
                        [
                            {
                                image: towards,
                                width: 90,
                                style: 'marginminussetengah'
                            },
                            { 
                                text: `PT SARASWANTI INDO GENETECH
                                Graha SIG Jl. Rasamala No. 20 Taman Yasmin
                                Bogor 16113 INDONESIA
                                Phone +62 251 7532 348 49 ( Hunting ), 0821 1151 6516
                                Fax +62 251 7540 927
                                www.siglaboratory.com`, 
                                alignment: 'left', 
                                style:'marginminus' 
                            },
                            {
                                image: ilac,
                                width: 40,
                                style: 'marginminus',
                                alignment: 'right'
                            },
                            {
                                image: kan,
                                width: 60,
                                style: 'marginminussetengahaja',
                                alignment: 'right'
                            }
                        ]
                    ]
                }
            }
          ]
      }
    }

      const styles = {
        tableNoMargin: {
            margin: [0,0,0,0],
            padding: [0,0,0,0]
        },
        margintop5: {
            margin: [0,5,0,0]
        },
        header: {
          bold: true,
          width: 150,
        },
        borderOut: {
            border: `1px solid #000`
        },
        fontsize8: {
            fontSize: 8
        },
        marginBawah: {
          margin: [0,0,0,20]
        },
        marginDalam: {
          margin: [10,10,0,10]
        },
        bold: {
          bold: true
        },
        fontsize: {
          fontSize: 9
        },
        fontsizeSmall: {
            fontSize: 6
        },
        marginawal: {
          margin: [0,30,0,0]
        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0,20,0,0]
        },
        tableExample: {
          margin: [10, 15, 0, 0]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        marginatascuk: {
            margin: [0,0,0,150]
        },
        testing: {
            margin: [100,30,25,0]
        },
        testing2: {
            margin: [90,30,25,0]
        },
        term : {
          fontSize: 9,
          margin: 0
        },
        margin10: {
          margin: [10,0,10,0]
        },
        marginTop:{
            margin: [0,100,0,50]
        },
        margintext: {
            margin: [10,0,10,10]
          },
          marginrek: {
            margin: [100,0,0,0]
          },
        margin20: {
          margin: [20,0,20,0]
        },
        marginatas30: {
            margin: [0,30,0,0]
        },
        margin30: {
          margin: [30,0,30,0]
        },
        marginlogo : {
            margin: [30,20,30,0]
        },

        marginminus: {
          margin: [50,0,0,80],
          fontSize: 8
        },
        marginminussetengah: {
          margin: [40,0,0,0]
        },
        marginminussetengahaja: {
          margin: [0,0,23,0]
        },
        marginBawahinDong: {
            margin: [0,0,0,60]
        },
        fontsize6: {
            fontSize: 6
        }
      };


    

export { headerText, subHeader, tablecolumn, footer, styles, din }
