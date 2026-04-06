// NYC Comptroller's Report for Fiscal 2025
// Part III — Demographic and Economic Information
// Sources: Bureau of Economic Analysis, US Census Bureau, NYS Dept. of Labor, BLS,
// NYC Human Resources Administration, US Social Security Administration.

export const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]

// Note: Some demographic data uses calendar years (2015-2024) rather than fiscal years.
// The years array above maps to those calendar years for consistency.

export const DEMOGRAPHICS = {
  'Population': {
    metrics: {
      'New York City population': {
        values: [8794592, 8815395, 8826377, 8824751, 8740292, 8462216, 8335798, 8258035, 8478072, null],
        note: 'US Census Bureau population estimates. FY2025 data not yet available.',
      },
      'United States population': {
        values: [324353340, 326608609, 328529577, 330226227, 331577720, 332099760, 334017321, 336806231, 340110988, null],
        note: 'FY2025 data not yet available.',
      },
      'NYC % change from prior year': {
        values: [0.66, 0.24, 0.12, -0.02, -0.96, -3.18, -1.49, -0.93, 2.66, null],
      },
    },
  },
  'Population by Borough': {
    metrics: {
      'Bronx (2024 est.)': {
        values: [null, null, null, null, null, null, null, null, 1384724, null],
        note: 'Borough populations available for select years only. See Census data for full detail.',
      },
      'Brooklyn (2024 est.)': {
        values: [null, null, null, null, null, null, null, null, 2617631, null],
      },
      'Manhattan (2024 est.)': {
        values: [null, null, null, null, null, null, null, null, 1660664, null],
      },
      'Queens (2024 est.)': {
        values: [null, null, null, null, null, null, null, null, 2316841, null],
      },
      'Staten Island (2024 est.)': {
        values: [null, null, null, null, null, null, null, null, 498212, null],
      },
    },
  },
  'Personal Income': {
    metrics: {
      'NYC personal income (thousands)': {
        values: [547280011, 593152562, 614288176, 627414838, 650034036, 696440050, 704094853, 744453492, null, null],
        note: 'Bureau of Economic Analysis. Calendar year data. 2024-2025 not yet available.',
      },
      'NYC per capita income': {
        values: [62226, 67289, 69600, 71095, 74375, 82302, 84464, 90149, null, null],
      },
      'US per capita income': {
        values: [48974, 51006, 53311, 55567, 59114, 64450, 66096, 69418, 72425, null],
      },
      'NYC as % of US per capita': {
        values: [127, 132, 131, 128, 126, 128, 128, 130, null, null],
      },
    },
  },
  'Employment by Sector': {
    metrics: {
      'Services (thousands)': {
        values: [2471, 2548, 2626, 2712, 2367, 2462, 2709, 2805, 2901, 2950],
        note: 'Average annual employment in thousands.',
      },
      'Wholesale trade': {
        values: [144, 143, 141, 140, 122, 123, 131, 131, 132, 131],
      },
      'Retail trade': {
        values: [351, 352, 351, 349, 287, 293, 307, 306, 299, 292],
      },
      'Manufacturing': {
        values: [77, 74, 71, 68, 53, 55, 58, 57, 55, 55],
      },
      'Financial activities': {
        values: [466, 469, 477, 485, 471, 466, 488, 502, 508, 504],
      },
      'Transport, warehousing & utilities': {
        values: [135, 139, 143, 147, 128, 135, 147, 149, 151, 155],
      },
      'Construction': {
        values: [147, 153, 159, 161, 139, 141, 143, 144, 143, 137],
      },
      'Total private employment': {
        values: [3791, 3878, 3968, 4062, 3567, 3675, 3983, 4094, 4189, 4224],
      },
      'Government employment': {
        values: [591, 593, 593, 596, 596, 583, 584, 590, 599, 600],
      },
      'Total nonfarm employment': {
        values: [4382, 4471, 4561, 4658, 4163, 4258, 4567, 4684, 4788, 4824],
      },
    },
  },
  'Unemployment': {
    metrics: {
      'NYC unemployment rate (%)': {
        values: [5.2, 4.5, 4.2, 4.0, 12.4, 10.1, 5.7, 5.0, 5.3, null],
        note: 'Calendar year data, not seasonally adjusted. FY2025 not yet available.',
      },
      'US unemployment rate (%)': {
        values: [4.9, 4.4, 3.9, 3.7, 8.1, 5.4, 3.7, 3.6, 4.0, null],
      },
      'NYC employed (thousands)': {
        values: [4022, 4101, 4094, 4108, 3581, 3685, 3890, 3998, 4064, null],
      },
      'NYC unemployed (thousands)': {
        values: [219, 194, 177, 170, 499, 414, 234, 211, 227, null],
      },
    },
  },
  'Public Assistance': {
    metrics: {
      'Public assistance recipients (thousands)': {
        values: [370, 364, 356, 332, 378, 371, 425, 481, 558, 601],
        note: 'Average annual recipients.',
      },
      'SSI recipients': {
        values: [394680, 388629, 381373, 374695, 359226, 347907, 341410, 334996, 331746, null],
        note: 'December data. FY2025 not yet available.',
      },
    },
  },
  'City Full-Time Employees': {
    metrics: {
      'Total full-time employees': {
        values: [287002, 295455, 298370, 300442, 300446, 291101, 282498, 281917, 283971, 287422],
      },
      'General Government': {
        values: [14277, 14985, 15202, 15708, 16080, 15298, 14313, 14293, 14571, 15073],
      },
      'Police (civilian + uniformed)': {
        values: [50343, 51056, 51894, 51767, 51429, 49187, 48779, 47617, 47050, 46304],
      },
      'Fire (civilian + uniformed)': {
        values: [16758, 17379, 17149, 17337, 17413, 17082, 16905, 17018, 17095, 17521],
      },
      'Correction (all)': {
        values: [17461, 18955, 19000, 18933, 17972, 15931, 15278, 14665, 14439, 14639],
      },
      'Education (pedagogical)': {
        values: [115799, 118671, 119900, 120398, 121077, 119210, 117004, 116660, 118167, 120720],
      },
      'Social Services': {
        values: [21914, 22224, 22228, 22369, 21802, 20911, 19199, 19034, 19561, 19306],
      },
      'Sanitation (all)': {
        values: [15289, 15429, 15510, 15940, 15753, 14861, 14591, 15391, 15443, 15367],
      },
      'Health': {
        values: [4508, 5176, 5432, 5509, 5530, 5292, 5032, 5216, 5372, 5440],
      },
      '% change from prior year': {
        values: [2.1, 2.0, 2.0, 0.7, 0.0, -3.1, -3.0, -0.2, 0.7, 1.2],
      },
    },
  },
}
