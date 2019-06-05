export default {
  startPeriod: '2019-02-26',
  credit: 10000,
  debit: -950,
  accounts: [{
    id: '22222222222222',
    type: 'current_account',
    label: '01 COMPTE COURANT M SEBASTIEN RENAULT',
    displayName: 'Compte courant - Sébastien',
    balance: 1067.6,
    statements: [{
      date: '2019-02-14', amount: -200, label: 'VIR VRT', balance: 1664.8,
    }, {
      date: '2019-02-18', amount: -150, label: 'VIR VRT', balance: 1514.8,
    }, {
      date: '2019-02-20', amount: -200, label: 'VIR APPORT', balance: 1314.8,
    }, {
      date: '2019-02-25', amount: -1304, label: 'PRLV SEPA DIRECTION GENERALE DES IMPOTS', balance: 10.8,
    }, {
      date: '2019-02-26', amount: 700, label: 'VRT', balance: 710.8,
    }],
  }, {
    id: '1111111111111111',
    type: 'joint_account',
    label: 'xxxxx xxxxxxxxx EUROCOMPTE CONFORT M S RENAULT OU MME P RENAULT',
    displayName: 'Compte commun',
    balance: 475.34,
    statements: [{
      date: '2019-02-07', amount: -13.47, label: 'F COTIS EUC CONFORT', balance: 189.97,
    }, {
      date: '2019-02-12', amount: -14.01, label: 'PAIEMENT PSC LECLERC', balance: 175.96,
    }, {
      date: '2019-02-12', amount: -38.92, label: 'PAIEMENT CB INTERMARCHE', balance: 137.04,
    }, {
      date: '2019-02-12', amount: -50, label: 'PAIEMENT CB DOCTEUR', balance: 87.04,
    }, {
      date: '2019-02-13', amount: -7.77, label: 'PAIEMENT CB ACTION', balance: 79.27,
    }, {
      date: '2019-02-13', amount: -89.42, label: 'PAIEMENT CB LEROY MERLIN CARTE', balance: -10.15,
    }, {
      date: '2019-02-15', amount: 30.4, label: 'VIR ASSURANCE VIE FRAIS DE SOINS', balance: 420.25,
    }, {
      date: '2019-02-15', amount: -56.07, label: 'PAIEMENT CB TEXTO 02083', balance: 364.18,
    }, {
      date: '2019-02-15', amount: -3.55, label: 'PAIEMENT PSC NOCLOMA', balance: 360.63,
    }, {
      date: '2019-02-15', amount: -14.19, label: 'PAIEMENT CB 1402 LECLERC WEB', balance: 346.44,
    }],
  }],
};
