// NYC Comptroller's Report for Fiscal 2025
// Part III — Revenue Capacity & Debt Capacity Information
// Source: Annual Comprehensive Financial Reports of the Comptroller.

export const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]

export const REVENUE_CAPACITY = {
  'Property Tax Rates': {
    unit: 'rate (per $100 assessed)',
    metrics: {
      'Basic rate (per $100 assessed)': {
        values: [11.59, 11.69, 11.80, 12.15, 12.11, 11.79, 12.46, 12.50, 12.46, 11.98],
        note: 'Property tax rate based on every $100 of assessed valuation.',
      },
      'GO Debt Service rate': {
        values: [1.23, 1.17, 1.22, 0.93, 1.02, 1.11, 0.34, 0.34, 0.58, 0.92],
      },
      'Total direct tax rate': {
        values: [12.82, 12.86, 13.02, 13.08, 13.12, 12.90, 12.80, 12.84, 13.04, 12.91],
      },
    },
  },
  'Assessed Valuation': {
    unit: 'millions ($)',
    metrics: {
      'Class One (residential, in millions)': {
        values: [17727.5, 18394.0, 19442.8, 20146.8, 21042.9, 22018.2, 22801.5, 23699.0, 24894.7, 25834.4],
      },
      'Class Two (rentals/co-ops, in millions)': {
        values: [77316.8, 85118.2, 92585.8, 100491.1, 107146.0, 112123.5, 102628.9, 113024.4, 116137.1, 120909.7],
      },
      'Class Three (utility, in millions)': {
        values: [13476.5, 14203.2, 14683.9, 15225.6, 16649.3, 17064.6, 18484.9, 19508.5, 21978.0, 26402.1],
      },
      'Class Four (commercial, in millions)': {
        values: [109121.5, 116826.0, 124770.4, 131841.2, 136210.2, 140146.9, 116072.9, 127763.8, 136796.4, 141835.8],
      },
      'Total taxable assessed value (millions)': {
        values: [217642.3, 234541.4, 251482.9, 267704.7, 281048.4, 291353.2, 259988.2, 283995.7, 299806.2, 314982.0],
      },
      'Tax exempt property (millions)': {
        values: [16137.6, 16892.4, 17456.8, 18262.0, 17906.1, 18686.3, 19117.5, 18944.0, 19167.9, 19743.7],
      },
      'Est. actual taxable value (millions)': {
        values: [969430.4, 1064244.5, 1149208.8, 1250706.9, 1315907.5, 1369384.2, 1292293.8, 1393644.1, 1480981.4, 1493902.8],
      },
      'Assessed as % of actual value': {
        values: [22.45, 22.04, 21.88, 21.40, 21.36, 21.28, 20.12, 20.38, 20.24, 21.08],
      },
    },
  },
  'Property Tax Collections': {
    unit: 'millions ($) / percent',
    metrics: {
      'Tax levy (millions)': {
        values: [24145.0, 25794.0, 27726.0, 29575.0, 31630.0, 33371.0, 31636.0, 33853.0, 35340.0, 36862.0],
      },
      'Collection rate (%)': {
        values: [94.8, 94.2, 93.1, 89.3, 93.7, 98.1, 98.4, 96.7, 98.2, 94.2],
      },
      'Cancellations (%)': {
        values: [2.3, 1.5, 2.7, 1.9, 2.3, 2.4, 2.8, 2.0, 2.5, 2.1],
      },
      'Abatements & discounts (%)': {
        values: [3.2, 2.8, 3.7, 4.1, 4.1, 4.2, 4.4, 4.3, 4.4, 4.6],
      },
      'Uncollected balance (%)': {
        values: [1.4, 1.2, 1.2, 1.2, 1.8, 2.0, 1.7, 1.9, 2.1, 1.8],
      },
    },
  },
  'General Fund Expenditures': {
    unit: 'thousands ($)',
    metrics: {
      'Total General Government': {
        values: [2985013, 3246561, 3494774, 3436484, 4541574, 4429366, 4225605, 4388563, 4793947, 5111504],
        note: 'In thousands. Includes all general government agencies.',
      },
      'Total Public Safety & Judicial': {
        values: [9325708, 9694083, 10023512, 10358049, 10790905, 10548189, 11936786, 12069764, 12355921, 12838701],
        note: 'In thousands.',
      },
      'Dept. of Education': {
        values: [21973688, 23317602, 25026392, 26905467, 27903295, 28288081, 31305761, 30975740, 32865967, 34051680],
        note: 'In thousands.',
      },
      'Total Social Services': {
        values: [13800868, 14485139, 15207720, 15832746, 15631055, 15474532, 16573806, 18105165, 19822219, 20642060],
        note: 'In thousands.',
      },
      'Total Environmental Protection': {
        values: [2569229, 2923418, 3015468, 3087739, 3379569, 3696519, 3372612, 3369891, 3468515, 3632911],
        note: 'In thousands.',
      },
      'Total Transportation Services': {
        values: [1707930, 1753637, 1757171, 2067874, 1931869, 1971496, 2059277, 2153586, 2590771, 2754999],
        note: 'In thousands.',
      },
      'Total Parks, Rec & Cultural': {
        values: [533855, 598776, 621978, 646480, 657748, 618506, 719905, 744230, 772622, 848435],
        note: 'In thousands.',
      },
      'Total Housing': {
        values: [1023213, 1220133, 1217385, 1230321, 1291275, 1297974, 1361882, 1491109, 2026135, 2092768],
        note: 'In thousands.',
      },
      'Total Health': {
        values: [2666511, 2233288, 2401172, 2656358, 2519934, 4553923, 4698680, 4083742, 5167845, 5476794],
        note: 'In thousands.',
      },
      'Total Libraries': {
        values: [359548, 369871, 377876, 397996, 427184, 423470, 424442, 466191, 458236, 500156],
        note: 'In thousands.',
      },
      'Pensions': {
        values: [9170963, 9280651, 9513308, 9828626, 9671638, 9333663, 9599122, 8988063, 9215445, 9915575],
        note: 'In thousands.',
      },
      'Total Expenditures': {
        values: [73700743, 77027929, 80700975, 84758165, 87849440, 91103926, 98933172, 100171173, 105270980, 109610157],
        note: 'In thousands. Total General Fund expenditures before transfers.',
      },
      'Total Expenditures & Other Financing Uses': {
        values: [79981286, 83463146, 87931291, 91779219, 95098951, 100000809, 105924836, 108177068, 112972983, 117690172],
        note: 'In thousands. Including debt service transfers.',
      },
    },
  },
  'Capital Projects Fund': {
    unit: 'thousands ($)',
    metrics: {
      'Total Capital Expenditures': {
        values: [8079916, 8825550, 9639737, 10848283, 9773792, 9431236, 10529999, 12149728, 14524464, 15578006],
        note: 'In thousands.',
      },
      'Capital: General Government': {
        values: [664819, 740177, 822837, 904761, 801072, 929742, 1062946, 1354322, 1471157, 1446293],
        note: 'In thousands.',
      },
      'Capital: Public Safety & Judicial': {
        values: [327079, 364833, 395292, 298179, 367475, 317189, 591556, 589925, 635460, 1281529],
        note: 'In thousands.',
      },
      'Capital: Education': {
        values: [2532116, 2769304, 2419914, 2891378, 2905421, 2400568, 3113584, 3723540, 4236705, 3858377],
        note: 'In thousands.',
      },
      'Capital: Environmental Protection': {
        values: [1701883, 1777683, 1977403, 2234602, 2048321, 2067857, 1960447, 1848066, 2141351, 2382483],
        note: 'In thousands.',
      },
      'Capital: Transportation': {
        values: [1262685, 1230435, 1516057, 1612366, 1435964, 1266014, 1504288, 1421897, 1802731, 2044516],
        note: 'In thousands.',
      },
      'Capital: Housing': {
        values: [752753, 950461, 1411642, 1680761, 904215, 1142519, 1017632, 1734810, 2700659, 2875769],
        note: 'In thousands.',
      },
    },
  },
}

export const DEBT_CAPACITY = {
  'Outstanding Debt': {
    unit: 'millions ($)',
    metrics: {
      'General Obligation Bonds (millions)': {
        values: [38073, 37891, 38628, 37519, 38784, 38574, 38845, 40093, 41701, 46721],
      },
      'TFA Debt (millions)': {
        values: [37358, 40696, 43355, 46624, 48978, 49957, 51820, 53506, 57618, 63013],
      },
      'Gross Debt (millions)': {
        values: [82068, 84796, 88009, 89989, 93478, 92585, 94620, 97419, 103113, 113434],
      },
      'Net Debt (millions)': {
        values: [86241, 89623, 93387, 95530, 99454, 99441, 101886, 104551, 110330, 121031],
        note: 'Includes premiums/discounts.',
      },
      'Lease Obligations (millions)': {
        values: [514, 552, 725, 746, 789, 892, 13958, 12963, 12734, 12134],
        note: 'Lease obligations increased significantly in FY2022 due to GASB 87 implementation.',
      },
    },
  },
  'Bonded Debt Ratios': {
    unit: 'millions ($) / percent / per capita',
    metrics: {
      'Total Primary Government debt (millions)': {
        values: [87812, 91172, 95046, 97083, 101001, 101040, 116497, 118090, 123588, 133639],
      },
      'Debt as % of personal income': {
        values: [16.05, 15.37, 15.47, 15.47, 15.54, 14.51, 17.19, 17.43, 18.60, 17.95],
      },
      'Total debt per capita': {
        values: [9985, 10342, 10768, 11001, 11556, 11940, 13758, 14166, 14966, 15763],
      },
      'City Net GO Bonded Debt (millions)': {
        values: [38504, 39618, 40551, 39366, 40941, 41012, 41235, 42481, 44045, 49085],
      },
      'Net GO Debt as % of taxable property': {
        values: [17.69, 16.89, 16.12, 14.71, 14.57, 14.08, 15.86, 14.96, 14.69, 15.58],
      },
      'Net GO Debt per capita': {
        values: [4378, 4494, 4594, 4462, 4667, 4843, 4870, 5096, 5334, 5790],
      },
    },
  },
  'Legal Debt Margin': {
    unit: 'thousands ($) / percent',
    metrics: {
      'Assessed value (thousands)': {
        values: [851841382, 902361491, 982414504, 1062428933, 1162656654, 1230177675, 1273521200, 1274475176, 1316433048, 1367549131],
      },
      'Debt limit (10% of assessed, thousands)': {
        values: [85184138, 90236149, 98241450, 106242893, 116265665, 123017768, 127352120, 127447518, 131643305, 136754913],
      },
      'Legal debt margin (thousands)': {
        values: [22977513, 24024933, 27166333, 29317412, 37061062, 41197026, 38960525, 30538208, 25396644, 29095409],
      },
      'Debt as % of debt limit': {
        values: [73.03, 73.38, 72.35, 72.41, 68.12, 66.51, 69.41, 76.04, 80.71, 78.72],
      },
    },
  },
  'Parking & ECB Fines': {
    unit: 'thousands ($) / millions ($)',
    metrics: {
      'Parking fines: Summonses issued (thousands)': {
        values: [966, 901, 994, 984, 753, 764, 880, 1159, 1028, 1088],
        note: 'Parking Violations Bureau summonses, in thousands of dollars.',
      },
      'Parking fines: Uncollected (millions)': {
        values: [288, 563, 565, 562, 288, 407, 540, 563, 565, 562],
      },
      'ECB fines: Summonses docketed (millions)': {
        values: [194, 191, 213, 255, 269, 256, 310, 213, 182, 213],
      },
      'ECB fines: Uncollected (millions)': {
        values: [968, 797, 628, 747, 1016, 1073, 688, 617, 600, 435],
        note: 'Net of allowance for uncollectible amounts.',
      },
    },
  },
}
