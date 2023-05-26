import {siglogo, towards, ilac, kan, GMSales, GMLab } from './images';


const headerImg = {
    image: siglogo,
    width: 150,
    margin: [0, -20, 30, 0]
};

const din = {
    normal: '/assets/fonts/DIN-Light.otf',
    bold: '/assets/fonts/DIN-Bold.otf',
}

const styles = {

    header: {
        bold: true,
        width: 150,
    },

    margin30: {
        margin: [30,0,30,0]
    },

    rightCover: {
      fontSize: 10,
      margin: [0, 20, 0, 0]
    },

    leftCover: {
      fontSize: 10,
      margin: [0, 20, 0, 0]
    },

    rightHeader: {
        fontSize: 11,
        margin: [0, 30, 0 ,0]
    },

    rightHeaderTest: {
      fontSize: 11,
      margin: [0, 50, 30, 0]
  },

    rightStyleHeader: {
        margin: [90,30,25,0]
    },

    subHead: {
        bold: true,
        fontSize: 12,
        width: 100,
        margin: [130 , 0, 0, 0]
    },

    slogSubHead: {
      bold: true,
      fontSize: 12,
      width: 100,
      //margin: [40 , -20, 0, 0]
    },

    marginSubHead: {
        margin: [0, 30, 0, 10]
    },

    marginBottom20: {
        margin: [0, 0, 0, 20]
    },

    rightFooter: {
       margin: [40, 0, 0, 50],
       fontSize: 8
    },

    leftFooter: {
      margin: [0, 0, 35, 40],
      fontSize: 8
   },

    resultofanalysisFooter: {
        margin: [0, 0, 35, 0],
        fontSize: 11
    },

   fontsize8: {
    fontSize: 8
  }, 

    fontSize10: {
      fontSize: 10
  },

    fontSize11: {
        fontSize: 11
    },

    fontSize12: {
        fontSize: 12
    },

    tableExample: {
      margin: [10, 25, 0, 0]
    },

    startCover: {
      margin: [0, 30, 0, 20]
    },

    marginCover: {
      margin: [0, 10, 0, 0]
    },

    marginSignature: {
      margin: [0, 20, 0, 0]
    },

    marginLogoPartner: {
      margin: [0, 0, 10, 0]
    },

    marginLogoPartner2: {
      margin: [0,0,30,0]
    },

    resultofanalysis: {
      margin: [0,20,0,0]
    },
    
    roaHeader: {
      fontSize: 11,
      margin: [0, 20, 30, 0]
    },

    

     



    // end
      marginBawah: {
        margin: [0,0,0,20]
      },
      marginDalam: {
        margin: [0,10,0,10]
      },
      bold: {
        bold: true
      },
      fontsize: {
        fontSize: 9
      },
      marginawal: {
        margin: [0,10,0,0]
      },
      subheader: {
        fontSize: 12,
        bold: true,
        margin: [0,50,0,0]
      },
      
      tableParameter : {
        margin: [0,200,0,0]
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
      pageBreakMargin: {
        margin: [0,30,0,0]
      },

      marginPage: {
        margin: [0,-300,0,0]
      },

      term : {
        fontSize: 9,
        margin: 0
      },
      margin10: {
        margin: [10,0,10,0]
      },
      margin20: {
        margin: [20,0,20,0]
      },
      marginatas30: {
          margin: [0,30,0,0]
      },
     

      marginminus: {
        margin: [0,0,0,0],
        fontSize: 6
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

const signatureCover =  {
  columns: [
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
                  image: GMSales,
                  width: 150,
                  margin: [0, -20, 30, 0]
                }],
                [{text: `RB Ernesto Arya`, bold:true}],
                [{text: `GM Sales & Marketing`}],
            ],
        },
    },
],
unbreakable: true,
}

const signatureCoverEn =  {
  columns: [
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
                [{text: `Sales & Marketing GM`}],
            ],
        },
    },
],
unbreakable: true,
}


const footerCover = {
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
                        image: ilac,
                        width: 40,
                        style: 'marginLogoPartner',
                        alignment: 'right'
                    },
                    {
                        image: kan,
                        width: 60,
                        style: 'marginLogoPartner2',
                        alignment: 'right'
                    }
                ]
            ]
        }
    }
  ]
}

const footer = {
  columns: [
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
                    },
                ]
            ]
        }
    }
  ]
}

export { headerImg, styles, signatureCover,signatureCoverEn, din, footer, footerCover }