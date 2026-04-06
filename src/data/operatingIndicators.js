// NYC Comptroller's Report for Fiscal 2025
// Operating Indicators by Function/Program — Ten Year Trend
// Source: Mayor's Management Report (MMR) and various City agencies

export const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]

export const AGENCIES = {
  'Law Department': {
    category: 'General Government',
    metrics: {
      'Cases commenced citywide': {
        values: [9695, 8141, 8219, 8598, 7468, 9103, 8284, 8812, 10359, 10647],
      },
    },
  },
  'Police Department (PD)': {
    category: 'Public Safety & Judicial',
    metrics: {
      'Felony crime': {
        values: [105614, 98991, 95868, 93631, 94790, 95369, 119742, 126929, 128728, 121723],
      },
      'Felony crime per 100,000 population': {
        values: [1235, 1159, 1111, 1114, 1137, 1144, 1414, 1523, 1559, 1436],
      },
      'Traffic fatalities': {
        values: [236, 211, 209, 218, 211, 275, 280, 271, 309, 230],
      },
      'Total moving violation summonses': {
        values: [1032000, 1062000, 1075000, 1027000, 749000, 461167, 501056, 580878, 545569, 528866],
        note: 'Prior to FY2021, figures were reported in rounded thousands and have been converted for comparability.',
      },
    },
  },
  'Fire Department (FD)': {
    category: 'Public Safety & Judicial',
    metrics: {
      'Fire unit responses (thousands)': {
        values: [580, 585, 603, 619, 541, 589, 627, 654, 693, 682],
      },
      'Medical incidents (thousands)': {
        values: [276, 281, 287, 316, 281, 315, 337, 363, 388, 372],
      },
      'Life-threatening medical emergencies': {
        values: [570594, 563594, 568737, 567757, 564827, 515598, 564412, 605140, 633361, 620467],
      },
      'Ambulance responses (thousands)': {
        values: [1442, 1448, 1499, 1524, 1522, 1388, 1531, 1622, 1644, 1616],
      },
      'Avg ambulance in-service hours/day': {
        values: [8611, 8688, 8673, 8427, 9069, 9442, 8891, 8686, 8653, 8399],
      },
    },
  },
  'Dept. of Correction (DOC)': {
    category: 'Public Safety & Judicial',
    metrics: {
      'Average daily jail population': {
        values: [9790, 9500, 8896, 7938, 5841, 4961, 5559, 5873, 6206, 6823],
      },
      'Inmates to uniformed staff ratio': {
        values: [1.0, 0.87, 0.84, 0.78, 0.63, 0.59, 0.79, 0.93, 1.04, 1.18],
      },
    },
  },
  'Dept. of Education (DOE)': {
    category: 'Education',
    metrics: {
      'Pre-K enrollment (Half Day & Full Day)': {
        values: [71847, 72035, 70995, 73380, 86908, 75345, 91192, 97859, 97077, 94537],
      },
      'Elementary & intermediate enrollment': {
        values: [654698, 650725, 641645, 628771, 613924, 581694, 540190, 525365, 528309, 522582],
      },
      'High school enrollment': {
        values: [312756, 313407, 309166, 304799, 301368, 298451, 287754, 283753, 286678, 289129],
      },
      'Special education enrollment': {
        values: [283017, 292065, 297314, 301860, 305429, 295623, 288818, 290427, 266805, 273472],
      },
    },
  },
  'City University of New York (CUNY)': {
    category: 'Education',
    metrics: {
      'Full-time enrollment': {
        values: [59651, 58705, 59027, 57804, 54687, 48836, 39553, 35687, 37785, 36337],
      },
      'Part-time enrollment': {
        values: [39394, 38160, 36924, 37269, 37028, 33679, 33478, 31897, 36851, 40095],
      },
      'Degrees granted': {
        values: [14334, 14280, 15250, 15790, 15924, 14970, 12495, 10184, 10342, 9384],
      },
    },
  },
  'Human Resources Admin (HRA)': {
    category: 'Social Services',
    metrics: {
      'Food stamp recipients (thousands)': {
        values: [1693.2, 1676.3, 1607.5, 1523.5, 1642.3, 1734.2, 1713.4, 1739.2, 1790.0, 1796.0],
      },
      'Cash assistance recipients (thousands)': {
        values: [409.3, 401.2, 383.1, 364.4, 405.1, 406.1, 446.1, 483.2, 562.0, 601.0],
      },
      'Non-CA recipients (thousands)': {
        values: [1020.7, 1012.3, 964.8, 908.2, 987.2, 1084.7, 1038.6, 1026.0, 999.0, 974.0],
      },
      'SSI recipients (thousands)': {
        values: [263.1, 262.8, 259.6, 250.9, 250.0, 243.4, 228.8, 230.0, 228.0, 222.0],
      },
    },
  },
  'Child Support Enforcement': {
    category: 'Social Services',
    metrics: {
      'New support orders obtained': {
        values: [19579, 18645, 14832, 12758, 8948, 3610, 3742, 4502, 4737, 6798],
      },
      'Total cases with active orders': {
        values: [282451, 282013, 269761, 261073, 248488, 225512, 209544, 200554, 191190, 181488],
      },
    },
  },
  "Children's Services (ACS)": {
    category: 'Social Services',
    metrics: {
      'Abuse/neglect reports': {
        values: [62743, 67719, 68498, 66222, 56034, 53304, 58464, 60873, 60547, 57923],
      },
      'Children in abuse/neglect reports': {
        values: [92020, 99325, 100645, 96990, 72687, 68278, 69664, 77367, 78531, 66113],
      },
      'Children in foster care (avg)': {
        values: [9926, 8960, 8732, 8322, 7827, 7639, 7140, 6728, 6441, 6414],
      },
      'Children adopted': {
        values: [1052, 899, 899, 740, 404, 343, 459, 556, 529, 509],
      },
      'Infant/Toddler enrollment': {
        values: [30671, 30117, 29656, 27781, 23841, 18199, 15213, 15046, 10441, 6378],
      },
    },
  },
  'Homeless Services (DHS)': {
    category: 'Social Services',
    metrics: {
      'Homeless population': {
        values: [57798, 58283, 58767, 58044, 55913, 47669, 46675, 80724, 86741, 86056],
        note: 'Based on the average daily census for June taken by DHS.',
      },
      'Families entering shelter (first time)': {
        values: [7266, 6947, 6555, 6952, 5817, 4050, 5167, 13131, 15445, 15254],
      },
      'Avg families in shelters per day': {
        values: [14301, 15279, 15094, 14925, 14174, 11806, 9998, 15165, 20876, 20723],
      },
      'Avg single adults in shelters per day': {
        values: [12727, 13626, 14847, 16094, 16934, 18012, 16465, 20162, 20468, 21411],
      },
    },
  },
  'Environmental Protection (DEP)': {
    category: 'Environmental Protection',
    metrics: {
      'Water main breaks': {
        values: [395, 424, 520, 460, 371, 445, 459, 403, 360, 552],
      },
      'Water supply complaints': {
        values: [45476, 45150, 50690, 45444, 35283, 35650, 37709, 38350, 36303, 44955],
      },
      'Environmental complaints (incl. noise)': {
        values: [73497, 69124, 70956, 72163, 55766, 54035, 61289, 63719, 67585, 68270],
      },
    },
  },
  'Dept. of Sanitation (DOS)': {
    category: 'Environmental Protection',
    metrics: {
      'Complaints received': {
        values: [31976, 35530, 41500, 48844, 39330, 62197, 78443, 67185, 54066, 51342],
      },
      'Refuse collected (thousands of tons)': {
        values: [3013, 2974, 2953, 2998, 2945, 3186, 3063, 2890, 2927, 2869],
      },
      'ECB violation notices issued': {
        values: [458050, 456373, 390611, 372818, 315477, 263039, 240143, 390522, 470775, 663651],
      },
    },
  },
  'Dept. of Transportation (DOT)': {
    category: 'Transportation',
    metrics: {
      'Red light cameras': {
        values: [211, 211, 211, 211, 211, 211, 211, 211, 211, 211],
      },
      'Potholes repaired': {
        values: [303218, 260082, 279241, 228339, 173328, 176939, 184832, 176853, 154898, 180570],
      },
      'Pothole work orders': {
        values: [50085, 49687, 51833, 42960, 38151, 32857, 36121, 34563, 31947, 34440],
        note: 'Pothole work orders may include multiple potholes.',
      },
    },
  },
  'Parks & Recreation (DPR)': {
    category: 'Parks, Recreation & Culture',
    metrics: {
      'Comfort stations': {
        values: [679, 678, 677, 683, 684, 691, 695, 698, 712, 723],
      },
      'Tennis courts': {
        values: [692, 692, 674, 676, 663, 655, 648, 658, 658, 658],
      },
      'Permits sold': {
        values: [14921, 15012, 21311, 20340, 21556, null, 25585, 25241, 25531, 26449],
        note: 'FY2021 data unavailable — COVID closures caused automatic re-issuance as FY2021 permits.',
      },
      'Ice skating rink attendance': {
        values: [564696, 581842, 562976, 582978, 481433, 308044, 500675, 481345, 537341, 537895],
      },
      'Ball fields': {
        values: [777, 781, 767, 762, 762, 750, 753, 750, 750, 754],
      },
      'Swimming pools': {
        values: [67, 67, 67, 65, 65, 65, 65, 65, 65, 65],
      },
      'Pool attendance (calendar year)': {
        values: [1759235, 1492451, 1601869, 1621048, 204899, 892306, 986448, 864390, 974931, 1008021],
      },
      'Recreation center attendance': {
        values: [4277349, 3402621, 3202200, 3003599, 1947377, 4227, 776001, 1647046, 1871379, 2057794],
      },
    },
  },
  'Housing Preservation & Dev (HPD)': {
    category: 'Housing',
    metrics: {
      'Housing starts (units)': {
        values: [23287, 24293, 32116, 25299, 30023, 28310, 16042, 24090, 25266, 28281],
      },
      'Housing completions (units)': {
        values: [18442, 17736, 25093, 18200, 15391, 10523, 13779, 21185, 21428, 20975],
      },
      'Buildings sold': {
        values: [4, 12, 17, 18, 14, 34, 7, 6, 10, 2],
      },
      'Occupied buildings': {
        values: [66, 209, 199, 200, 180, 115, 111, 135, 126, 128],
      },
      'Buildings under management': {
        values: [127, 265, 248, 253, 226, 199, 154, 146, 135, 119],
      },
      'Violations issued': {
        values: [440849, 481085, 522199, 604068, 474619, 620108, 731684, 722852, 895457, 878481],
      },
    },
  },
  'Health & Mental Hygiene (DOH)': {
    category: 'Health',
    metrics: {
      'New HIV diagnoses (preliminary)': {
        values: [2449, 2076, 1953, 1742, 1533, 812, 821, 745, 873, 941],
      },
      'Tuberculosis new cases': {
        values: [575, 565, 613, 559, 566, 445, 530, 536, 684, 839],
      },
      'Tuberculosis clinic visits': {
        values: [31216, 34140, 34665, 35946, 37477, 24452, 17805, 25994, 28925, 27807],
      },
      'STD reportable cases citywide': {
        values: [88955, 98912, 102693, 109106, 97189, 98191, 102995, 94682, 106490, 103114],
      },
      'Immunizations at walk-in clinics': {
        values: [67230, 65374, 63565, 69797, 57091, 9169, 32726, 30095, 35337, 34924],
      },
    },
  },
  'Public Libraries': {
    category: 'Libraries',
    metrics: {
      'Attendance (thousands)': {
        values: [33800, 36908, 36236, 35142, 23885, 3898, 14066, 20537, 24220, 26054],
      },
      'Circulation (thousands)': {
        values: [50747, 51009, 50130, 45786, 32429, 18645, 30366, 34116, 35296, 37667],
      },
      'Computers for public use (thousands)': {
        values: [8247, 15926, 15218, 14817, 14229, 11138, 12429, 12183, 11892, 11488],
      },
    },
  },
}
