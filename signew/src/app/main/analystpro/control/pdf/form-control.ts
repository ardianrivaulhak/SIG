import {logosig, logotowards, logoilac, logokan } from './images';


const headerText = {
    image: logosig,
    width: 150,
    style: 'margin30'
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

    fontsize16: {
        fontSize: 16
    },

      fontsize8: {
          fontSize: 8
      },
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

export { headerText, styles, din }