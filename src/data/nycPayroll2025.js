// NYC Citywide Payroll Data — FY2025
// Source: NYC Open Data (Office of Payroll Administration)
// https://data.cityofnewyork.us/City-Government/Citywide-Payroll-Data-Fiscal-Year-/k397-673e

// ---------------------------------------------------------------------------
// Raw agency data — ALL employees
// ---------------------------------------------------------------------------
const rawAgencies = [
  { agency: 'DEPT OF ED PEDAGOGICAL', regular: 10391346320.59, overtime: 0, other: 401621807.08, employees: 107754 },
  { agency: 'POLICE DEPARTMENT', regular: 4196126374.85, overtime: 1087616024.57, other: 727539363.99, employees: 55424 },
  { agency: 'FIRE DEPARTMENT', regular: 1599596283.60, overtime: 568017988.31, other: 298842493.29, employees: 19333 },
  { agency: 'DEPT OF ED PARA PROFESSIONALS', regular: 1274131257.99, overtime: 0, other: 138635091.25, employees: 42852 },
  { agency: 'DEPARTMENT OF EDUCATION ADMIN', regular: 1090827772.72, overtime: 33088464.61, other: 70194176.84, employees: 16768 },
  { agency: 'NYC HOUSING AUTHORITY', regular: 887590573.71, overtime: 204825852.68, other: 34804330.66, employees: 14297 },
  { agency: 'DEPARTMENT OF SANITATION', regular: 849637433.49, overtime: 203761843.89, other: 162014306.69, employees: 11144 },
  { agency: 'DEPARTMENT OF CORRECTION', regular: 776834860.78, overtime: 363358738.68, other: 104838921.67, employees: 10840 },
  { agency: 'HRA/DEPT OF SOCIAL SERVICES', regular: 753696279.93, overtime: 74769534.28, other: 47178167.85, employees: 12214 },
  { agency: 'DEPT OF HEALTH/MENTAL HYGIENE', regular: 554016671.21, overtime: 18346328.82, other: 36924772.43, employees: 7556 },
  { agency: 'DEPT OF ENVIRONMENT PROTECTION', regular: 551494246.95, overtime: 61278915.69, other: 37966974.73, employees: 6552 },
  { agency: 'DEPARTMENT OF TRANSPORTATION', regular: 540402628.04, overtime: 103410314.06, other: 41854571.95, employees: 6724 },
  { agency: 'ADMIN FOR CHILDREN\'S SVCS', regular: 523979798.88, overtime: 52445049.66, other: 30572464.08, employees: 8246 },
  { agency: 'DEPT OF ED PER SESSION TEACHER', regular: 481269021.26, overtime: 0, other: 317004.93, employees: 81516 },
  { agency: 'DEPT OF PARKS & RECREATION', regular: 448461189.65, overtime: 26538232.97, other: 35498868.94, employees: 13550 },
  { agency: 'DEPT OF ED HRLY SUPPORT STAFF', regular: 365758037.45, overtime: 0, other: 116009727.94, employees: 23062 },
  { agency: 'DEPT OF ED PER DIEM TEACHERS', regular: 257362474.97, overtime: 0, other: 3913266.27, employees: 16358 },
  { agency: 'HOUSING PRESERVATION & DVLPMNT', regular: 203275413.10, overtime: 4188063.26, other: 8032966.39, employees: 2746 },
  { agency: 'DEPT OF CITYWIDE ADMIN SVCS', regular: 183445276.06, overtime: 32045032.61, other: 7382045.39, employees: 2483 },
  { agency: 'DEPT. OF HOMELESS SERVICES', regular: 131218555.33, overtime: 20560200.32, other: 8782009.07, employees: 2083 },
  { agency: 'TECHNOLOGY & INNOVATION', regular: 165189526.76, overtime: 2521470.47, other: 5170016.48, employees: 1790 },
  { agency: 'DISTRICT ATTORNEY-MANHATTAN', regular: 160775604.33, overtime: 3798407.91, other: 7394921.91, employees: 2185 },
  { agency: 'DEPARTMENT OF FINANCE', regular: 159147731.00, overtime: 8216733.06, other: 6119484.45, employees: 2064 },
  { agency: 'LAW DEPARTMENT', regular: 158659390.42, overtime: 2621456.60, other: 3228845.99, employees: 1752 },
  { agency: 'DEPARTMENT OF BUILDINGS', regular: 137552930.78, overtime: 3647462.45, other: 4302367.38, employees: 1853 },
  { agency: 'DOE CUSTODIAL PAYROL', regular: 125587754.75, overtime: 0, other: 15756.82, employees: 1268 },
  { agency: 'DISTRICT ATTORNEY KINGS COUNTY', regular: 120867466.33, overtime: 2801678.11, other: 4693527.88, employees: 1619 },
  { agency: 'DEPT. OF DESIGN & CONSTRUCTION', regular: 117105077.80, overtime: 1214977.33, other: 2930440.85, employees: 1352 },
  { agency: 'BRONX DISTRICT ATTORNEY', regular: 108316789.40, overtime: 831266.62, other: 11591990.87, employees: 1584 },
  { agency: 'DEPARTMENT OF PROBATION', regular: 74694710.15, overtime: 4946040.73, other: 5893385.86, employees: 1266 },
  { agency: 'OFFICE OF THE COMPTROLLER', regular: 72870507.81, overtime: 430253.16, other: 2307954.76, employees: 874 },
  { agency: 'DISTRICT ATTORNEY QNS COUNTY', regular: 84970983.17, overtime: 2010102.66, other: 9582990.67, employees: 1091 },
  { agency: 'CITY COUNCIL', regular: 80176826.44, overtime: 0, other: 1571559.96, employees: 1422 },
  { agency: 'BOARD OF ELECTION', regular: 53397696.86, overtime: 15091436.22, other: 1738263.96, employees: 1027 },
  { agency: 'DISTRICT ATTORNEY-SPECIAL NARC', regular: 23962727.75, overtime: 136009.62, other: 1912597.70, employees: 250 },
  { agency: 'DISTRICT ATTORNEY RICHMOND COU', regular: 23410570.99, overtime: 59688.29, other: 2319872.47, employees: 264 },
]

const cunyColleges = [
  { regular: 157549183.35, overtime: 3546346.36, other: 8696627.03, employees: 4897 },  // Manhattan
  { regular: 127144664.61, overtime: 692741.04, other: 5542884.59, employees: 4201 },    // LaGuardia
  { regular: 103732296.72, overtime: 1759473.65, other: 4886302.88, employees: 3232 },   // Kingsboro
  { regular: 98691706.59, overtime: 1288271.80, other: 5350854.62, employees: 2783 },    // Queensboro
  { regular: 82959721.12, overtime: 1903218.24, other: 4259658.41, employees: 2275 },    // Bronx
  { regular: 61578648.56, overtime: 1602408.33, other: 2990677.56, employees: 1907 },    // Hostos
  { regular: 19076387.92, overtime: 98022.55, other: 1122573.15, employees: 568 },       // Guttman
  { regular: 15822216.80, overtime: 45095.40, other: 1901932.57, employees: 354 },       // Hunter HS
  { regular: 9016135.02, overtime: 1424.69, other: 288663.96, employees: 217 },          // CUNY Central
]

// ---------------------------------------------------------------------------
// Raw agency data — FILTERED (> $0 total compensation, Empire Center method)
// ---------------------------------------------------------------------------
const filteredRawAgencies = [
  { agency: 'DEPT OF ED PEDAGOGICAL', regular: 10391525254.80, overtime: 0, other: 401911285.67, employees: 107693 },
  { agency: 'POLICE DEPARTMENT', regular: 4196176423.61, overtime: 1087625726.24, other: 727549575.01, employees: 55368 },
  { agency: 'FIRE DEPARTMENT', regular: 1599682401.44, overtime: 568031152.67, other: 298915502.03, employees: 19306 },
  { agency: 'DEPT OF ED PARA PROFESSIONALS', regular: 1274217777.79, overtime: 0, other: 138646892.36, employees: 42828 },
  { agency: 'DEPARTMENT OF EDUCATION ADMIN', regular: 1090874537.24, overtime: 33088464.61, other: 70229022.52, employees: 16744 },
  { agency: 'NYC HOUSING AUTHORITY', regular: 887615956.00, overtime: 204827926.48, other: 34832986.42, employees: 14279 },
  { agency: 'DEPARTMENT OF SANITATION', regular: 849683598.95, overtime: 203764832.13, other: 162064749.52, employees: 11095 },
  { agency: 'DEPARTMENT OF CORRECTION', regular: 777106921.03, overtime: 363362423.28, other: 105173083.80, employees: 10723 },
  { agency: 'HRA/DEPT OF SOCIAL SERVICES', regular: 753707337.76, overtime: 74769738.03, other: 47302410.29, employees: 12201 },
  { agency: 'DEPT OF HEALTH/MENTAL HYGIENE', regular: 554161480.99, overtime: 18350155.53, other: 36942127.94, employees: 7484 },
  { agency: 'DEPT OF ENVIRONMENT PROTECTION', regular: 551641591.03, overtime: 61285245.35, other: 38021240.71, employees: 6456 },
  { agency: 'DEPARTMENT OF TRANSPORTATION', regular: 540457901.34, overtime: 103414455.47, other: 41910342.40, employees: 6695 },
  { agency: 'ADMIN FOR CHILDREN\'S SVCS', regular: 524097100.45, overtime: 52449141.19, other: 30548498.10, employees: 8200 },
  { agency: 'DEPT OF ED PER SESSION TEACHER', regular: 481284833.82, overtime: 0, other: 317035.81, employees: 81471 },
  { agency: 'DEPT OF PARKS & RECREATION', regular: 448511336.95, overtime: 26539191.33, other: 35531679.75, employees: 13488 },
  { agency: 'DEPT OF ED HRLY SUPPORT STAFF', regular: 365770687.81, overtime: 0, other: 116011325.65, employees: 23018 },
  { agency: 'DEPT OF ED PER DIEM TEACHERS', regular: 257367317.71, overtime: 0, other: 3913278.75, employees: 16352 },
  { agency: 'HOUSING PRESERVATION & DVLPMNT', regular: 203293123.44, overtime: 4188063.26, other: 8046098.22, employees: 2735 },
  { agency: 'DEPT OF CITYWIDE ADMIN SVCS', regular: 183459034.37, overtime: 32045032.61, other: 7382118.11, employees: 2476 },
  { agency: 'DEPT. OF HOMELESS SERVICES', regular: 131233358.80, overtime: 20560500.02, other: 8780170.59, employees: 2075 },
  { agency: 'TECHNOLOGY & INNOVATION', regular: 165193765.37, overtime: 2522073.73, other: 5169968.31, employees: 1785 },
  { agency: 'DISTRICT ATTORNEY-MANHATTAN', regular: 160775604.33, overtime: 3798407.91, other: 7403607.40, employees: 2183 },
  { agency: 'DEPARTMENT OF FINANCE', regular: 159156869.18, overtime: 8216733.06, other: 6130654.26, employees: 2055 },
  { agency: 'LAW DEPARTMENT', regular: 158668003.91, overtime: 2621568.05, other: 3241716.69, employees: 1750 },
  { agency: 'DEPARTMENT OF BUILDINGS', regular: 137575779.09, overtime: 3648314.13, other: 4301711.95, employees: 1839 },
  { agency: 'DOE CUSTODIAL PAYROL', regular: 125587754.75, overtime: 0, other: 28894.05, employees: 1267 },
  { agency: 'DISTRICT ATTORNEY KINGS COUNTY', regular: 120867466.33, overtime: 2801678.11, other: 4697674.06, employees: 1618 },
  { agency: 'DEPT. OF DESIGN & CONSTRUCTION', regular: 117115117.45, overtime: 1214977.33, other: 2931068.83, employees: 1350 },
  { agency: 'BRONX DISTRICT ATTORNEY', regular: 108316197.79, overtime: 831266.62, other: 11594490.99, employees: 1580 },
  { agency: 'DEPARTMENT OF PROBATION', regular: 74698149.66, overtime: 4946040.73, other: 5893510.60, employees: 1262 },
  { agency: 'OFFICE OF THE COMPTROLLER', regular: 72873263.19, overtime: 430253.16, other: 2308378.99, employees: 868 },
  { agency: 'DISTRICT ATTORNEY QNS COUNTY', regular: 84971821.08, overtime: 2010136.93, other: 9583906.22, employees: 1087 },
  { agency: 'CITY COUNCIL', regular: 80177788.30, overtime: 0, other: 1571316.01, employees: 1421 },
  { agency: 'BOARD OF ELECTION', regular: 53405401.61, overtime: 15091901.75, other: 1738344.90, employees: 1019 },
  { agency: 'DISTRICT ATTORNEY-SPECIAL NARC', regular: 23962727.75, overtime: 136009.62, other: 1912597.70, employees: 250 },
  { agency: 'DISTRICT ATTORNEY RICHMOND COU', regular: 23410570.99, overtime: 59688.29, other: 2319872.47, employees: 264 },
]

const filteredCunyColleges = [
  { regular: 157575640.90, overtime: 3546346.36, other: 8704119.77, employees: 4864 },  // Manhattan
  { regular: 127149085.42, overtime: 692741.04, other: 5542896.29, employees: 4194 },    // LaGuardia
  { regular: 103732543.27, overtime: 1759473.65, other: 4886302.88, employees: 3231 },   // Kingsboro
  { regular: 98697731.18, overtime: 1288271.80, other: 5350854.62, employees: 2782 },    // Queensboro
  { regular: 82960794.94, overtime: 1903218.24, other: 4259861.71, employees: 2271 },    // Bronx
  { regular: 61592280.41, overtime: 1602408.33, other: 2991029.23, employees: 1889 },    // Hostos
  { regular: 19076387.92, overtime: 98022.55, other: 1122573.15, employees: 568 },       // Guttman (same)
  { regular: 15822216.80, overtime: 45095.40, other: 1901932.57, employees: 354 },       // Hunter HS (same)
  { regular: 9016135.02, overtime: 1424.69, other: 288663.96, employees: 217 },          // CUNY Central (same)
]

// ---------------------------------------------------------------------------
// Friendly name mapping (shared)
// ---------------------------------------------------------------------------
const nameMap = {
  'POLICE DEPARTMENT': 'Police (NYPD)',
  'FIRE DEPARTMENT': 'Fire (FDNY)',
  'NYC HOUSING AUTHORITY': 'Housing Authority (NYCHA)',
  'DEPARTMENT OF SANITATION': 'Sanitation (DSNY)',
  'DEPARTMENT OF CORRECTION': 'Correction (DOC)',
  'HRA/DEPT OF SOCIAL SERVICES': 'Social Services (HRA)',
  'DEPT OF HEALTH/MENTAL HYGIENE': 'Health & Mental Hygiene',
  'DEPT OF ENVIRONMENT PROTECTION': 'Environment Protection (DEP)',
  'DEPARTMENT OF TRANSPORTATION': 'Transportation (DOT)',
  'ADMIN FOR CHILDREN\'S SVCS': 'Children\'s Services (ACS)',
  'DEPT OF PARKS & RECREATION': 'Parks & Recreation',
  'HOUSING PRESERVATION & DVLPMNT': 'Housing Preservation (HPD)',
  'DEPT OF CITYWIDE ADMIN SVCS': 'Citywide Admin (DCAS)',
  'DEPT. OF HOMELESS SERVICES': 'Homeless Services (DHS)',
  'TECHNOLOGY & INNOVATION': 'Technology & Innovation (OTI)',
  'DEPARTMENT OF FINANCE': 'Dept of Finance (DOF)',
  'LAW DEPARTMENT': 'Law Department',
  'DEPARTMENT OF BUILDINGS': 'Dept of Buildings (DOB)',
  'DEPT. OF DESIGN & CONSTRUCTION': 'Design & Construction (DDC)',
  'DEPARTMENT OF PROBATION': 'Probation',
  'OFFICE OF THE COMPTROLLER': 'Comptroller',
  'CITY COUNCIL': 'City Council',
  'BOARD OF ELECTION': 'Board of Elections',
  'DISTRICT ATTORNEY-MANHATTAN': 'DA — Manhattan',
  'DISTRICT ATTORNEY KINGS COUNTY': 'DA — Brooklyn',
  'BRONX DISTRICT ATTORNEY': 'DA — Bronx',
  'DISTRICT ATTORNEY QNS COUNTY': 'DA — Queens',
  'DISTRICT ATTORNEY-SPECIAL NARC': 'DA — Special Narcotics',
  'DISTRICT ATTORNEY RICHMOND COU': 'DA — Staten Island',
}

// ---------------------------------------------------------------------------
// Build agency datasets from raw data (reusable for filtered/unfiltered)
// ---------------------------------------------------------------------------
function buildAgencyDatasets(agencies, cuny) {
  const doeAgencies = agencies.filter(a =>
    a.agency.startsWith('DEPT OF ED') ||
    a.agency.startsWith('DEPARTMENT OF EDUCATION') ||
    a.agency === 'DOE CUSTODIAL PAYROL'
  )
  const doeOther = agencies.filter(a =>
    !a.agency.startsWith('DEPT OF ED') &&
    !a.agency.startsWith('DEPARTMENT OF EDUCATION') &&
    a.agency !== 'DOE CUSTODIAL PAYROL'
  )

  const doeCombined = {
    agency: 'Dept of Education',
    short: 'Dept of Education',
    regular: doeAgencies.reduce((s, a) => s + a.regular, 0),
    overtime: doeAgencies.reduce((s, a) => s + a.overtime, 0),
    other: doeAgencies.reduce((s, a) => s + a.other, 0),
    employees: doeAgencies.reduce((s, a) => s + a.employees, 0),
  }

  const cunyCombined = {
    agency: 'CUNY Colleges',
    short: 'CUNY Colleges',
    regular: cuny.reduce((s, a) => s + a.regular, 0),
    overtime: cuny.reduce((s, a) => s + a.overtime, 0),
    other: cuny.reduce((s, a) => s + a.other, 0),
    employees: cuny.reduce((s, a) => s + a.employees, 0),
  }

  const allAgencies = [
    doeCombined,
    cunyCombined,
    ...doeOther.map(a => ({ ...a, short: nameMap[a.agency] || a.agency })),
  ]

  const withTotal = allAgencies.map(a => ({
    ...a,
    total: a.regular + a.overtime + a.other,
    otPct: a.regular > 0 ? (a.overtime / a.regular) * 100 : 0,
  }))

  withTotal.sort((a, b) => b.total - a.total)

  const topAgencies = withTotal.slice(0, 20).map(a => ({
    name: a.short || a.agency,
    regular: Math.round(a.regular),
    overtime: Math.round(a.overtime),
    other: Math.round(a.other),
    total: Math.round(a.total),
    employees: a.employees,
  }))

  const overtimeLeaders = withTotal
    .filter(a => a.overtime > 5_000_000)
    .sort((a, b) => b.otPct - a.otPct)
    .map(a => ({
      name: a.short || a.agency,
      overtime: Math.round(a.overtime),
      regular: Math.round(a.regular),
      otPct: Math.round(a.otPct * 10) / 10,
      employees: a.employees,
    }))

  return { topAgencies, overtimeLeaders }
}

// Build both unfiltered and filtered agency datasets
const unfilteredAgency = buildAgencyDatasets(rawAgencies, cunyColleges)
const filteredAgency = buildAgencyDatasets(filteredRawAgencies, filteredCunyColleges)

export const topAgencies = unfilteredAgency.topAgencies
export const overtimeLeaders = unfilteredAgency.overtimeLeaders
export const filteredTopAgencies = filteredAgency.topAgencies
export const filteredOvertimeLeaders = filteredAgency.overtimeLeaders

// ---------------------------------------------------------------------------
// Summary stats
// ---------------------------------------------------------------------------
export const payrollSummary = {
  totalEmployees: 550219,
  totalRegular: 29_236_361_674,
  totalOvertime: 2_922_389_823,
  totalOther: 2_437_182_945,
  totalPayroll: 29_236_361_674 + 2_922_389_823 + 2_437_182_945,
  fiscalYear: 2025,
}

export const filteredPayrollSummary = {
  totalEmployees: 549246,
  totalRegular: 29_237_960_975,
  totalOvertime: 2_922_443_353,
  totalOther: 2_438_357_126,
  totalPayroll: 29_237_960_975 + 2_922_443_353 + 2_438_357_126,
  fiscalYear: 2025,
}

// ---------------------------------------------------------------------------
// Total overtime dollars by agency (top 20, with friendly names)
// ---------------------------------------------------------------------------
const otDollarsNameMap = {
  'POLICE DEPARTMENT': 'Police (NYPD)',
  'FIRE DEPARTMENT': 'Fire (FDNY)',
  'DEPARTMENT OF CORRECTION': 'Correction (DOC)',
  'NYC HOUSING AUTHORITY': 'Housing Authority (NYCHA)',
  'DEPARTMENT OF SANITATION': 'Sanitation (DSNY)',
  'DEPARTMENT OF TRANSPORTATION': 'Transportation (DOT)',
  'HRA/DEPT OF SOCIAL SERVICES': 'Social Services (HRA)',
  'DEPT OF ENVIRONMENT PROTECTION': 'Environment Protection (DEP)',
  "ADMIN FOR CHILDREN'S SVCS": "Children's Services (ACS)",
  'DEPARTMENT OF EDUCATION ADMIN': 'Dept of Education Admin',
  'DEPT OF CITYWIDE ADMIN SVCS': 'Citywide Admin (DCAS)',
  'DEPT OF PARKS & RECREATION': 'Parks & Recreation',
  'DEPT. OF HOMELESS SERVICES': 'Homeless Services (DHS)',
  'DEPT OF HEALTH/MENTAL HYGIENE': 'Health & Mental Hygiene',
  'BOARD OF ELECTION': 'Board of Elections',
  'DEPARTMENT OF FINANCE': 'Dept of Finance (DOF)',
  'DEPARTMENT OF PROBATION': 'Probation',
  'HOUSING PRESERVATION & DVLPMNT': 'Housing Preservation (HPD)',
  'DISTRICT ATTORNEY-MANHATTAN': 'DA — Manhattan',
  'DEPARTMENT OF BUILDINGS': 'Dept of Buildings (DOB)',
}

function buildOtDollars(raw) {
  return raw.map(a => ({
    name: otDollarsNameMap[a.agency] || a.agency,
    overtime: a.overtime,
    otEmployees: a.otEmployees,
    avgOtPerEmployee: Math.round(a.overtime / a.otEmployees),
  }))
}

export const agencyOvertimeDollars = buildOtDollars([
  { agency: 'POLICE DEPARTMENT', overtime: 1087816709, otEmployees: 44620 },
  { agency: 'FIRE DEPARTMENT', overtime: 568055594, otEmployees: 16877 },
  { agency: 'DEPARTMENT OF CORRECTION', overtime: 363377393, otEmployees: 7964 },
  { agency: 'NYC HOUSING AUTHORITY', overtime: 204828979, otEmployees: 10087 },
  { agency: 'DEPARTMENT OF SANITATION', overtime: 203765133, otEmployees: 9840 },
  { agency: 'DEPARTMENT OF TRANSPORTATION', overtime: 103415205, otEmployees: 5049 },
  { agency: 'HRA/DEPT OF SOCIAL SERVICES', overtime: 74771550, otEmployees: 6409 },
  { agency: 'DEPT OF ENVIRONMENT PROTECTION', overtime: 61286446, otEmployees: 4055 },
  { agency: "ADMIN FOR CHILDREN'S SVCS", overtime: 52451005, otEmployees: 4677 },
  { agency: 'DEPARTMENT OF EDUCATION ADMIN', overtime: 33090889, otEmployees: 7172 },
  { agency: 'DEPT OF CITYWIDE ADMIN SVCS', overtime: 32045033, otEmployees: 1275 },
  { agency: 'DEPT OF PARKS & RECREATION', overtime: 26539191, otEmployees: 7991 },
  { agency: 'DEPT. OF HOMELESS SERVICES', overtime: 20561700, otEmployees: 1508 },
  { agency: 'DEPT OF HEALTH/MENTAL HYGIENE', overtime: 18353369, otEmployees: 2334 },
  { agency: 'BOARD OF ELECTION', overtime: 15091902, otEmployees: 960 },
  { agency: 'DEPARTMENT OF FINANCE', overtime: 8216733, otEmployees: 541 },
  { agency: 'DEPARTMENT OF PROBATION', overtime: 4946041, otEmployees: 752 },
  { agency: 'HOUSING PRESERVATION & DVLPMNT', overtime: 4188063, otEmployees: 821 },
  { agency: 'DISTRICT ATTORNEY-MANHATTAN', overtime: 3798448, otEmployees: 585 },
  { agency: 'DEPARTMENT OF BUILDINGS', overtime: 3648325, otEmployees: 640 },
])

export const filteredAgencyOvertimeDollars = buildOtDollars([
  { agency: 'POLICE DEPARTMENT', overtime: 1087816435, otEmployees: 44619 },
  { agency: 'FIRE DEPARTMENT', overtime: 568055594, otEmployees: 16877 },
  { agency: 'DEPARTMENT OF CORRECTION', overtime: 363364752, otEmployees: 7956 },
  { agency: 'NYC HOUSING AUTHORITY', overtime: 204828841, otEmployees: 10086 },
  { agency: 'DEPARTMENT OF SANITATION', overtime: 203764932, otEmployees: 9839 },
  { agency: 'DEPARTMENT OF TRANSPORTATION', overtime: 103415205, otEmployees: 5049 },
  { agency: 'HRA/DEPT OF SOCIAL SERVICES', overtime: 74771550, otEmployees: 6409 },
  { agency: 'DEPT OF ENVIRONMENT PROTECTION', overtime: 61286446, otEmployees: 4055 },
  { agency: "ADMIN FOR CHILDREN'S SVCS", overtime: 52450498, otEmployees: 4674 },
  { agency: 'DEPARTMENT OF EDUCATION ADMIN', overtime: 33090889, otEmployees: 7172 },
  { agency: 'DEPT OF CITYWIDE ADMIN SVCS', overtime: 32045033, otEmployees: 1275 },
  { agency: 'DEPT OF PARKS & RECREATION', overtime: 26539191, otEmployees: 7991 },
  { agency: 'DEPT. OF HOMELESS SERVICES', overtime: 20561700, otEmployees: 1508 },
  { agency: 'DEPT OF HEALTH/MENTAL HYGIENE', overtime: 18353368, otEmployees: 2333 },
  { agency: 'BOARD OF ELECTION', overtime: 15091902, otEmployees: 960 },
  { agency: 'DEPARTMENT OF FINANCE', overtime: 8216733, otEmployees: 541 },
  { agency: 'DEPARTMENT OF PROBATION', overtime: 4946041, otEmployees: 752 },
  { agency: 'HOUSING PRESERVATION & DVLPMNT', overtime: 4188063, otEmployees: 821 },
  { agency: 'DISTRICT ATTORNEY-MANHATTAN', overtime: 3798448, otEmployees: 585 },
  { agency: 'DEPARTMENT OF BUILDINGS', overtime: 3648325, otEmployees: 640 },
])

// ---------------------------------------------------------------------------
// Top 25 overtime earners (individual employees) — same filtered/unfiltered
// ---------------------------------------------------------------------------
export const topOvertimeEarners = [
  { name: 'Jakub Markowski', agency: 'NYCHA', title: 'Supervisor Plumber', regular: 118055, overtime: 331814, other: 15165 },
  { name: 'Alfonso Tarantino', agency: 'DOC', title: 'Supervisor Steamfitter', regular: 135839, overtime: 302091, other: 15625 },
  { name: 'Rod Marcel', agency: 'DOC', title: 'Captain', regular: 127874, overtime: 288441, other: 19937 },
  { name: 'Luis Gomez III', agency: 'NYCHA', title: 'Supervisor Plumber', regular: 118055, overtime: 264498, other: 9630 },
  { name: 'Robert Ventura', agency: 'DOC', title: 'Supervisor of Mechanics', regular: 156437, overtime: 261776, other: -2142 },
  { name: 'Dhimiter Nushi', agency: 'NYCHA', title: 'Plumber', regular: 112740, overtime: 250442, other: 12689 },
  { name: 'Michael Hamilton', agency: 'DOC', title: 'Asst Deputy Warden', regular: 147074, overtime: 248957, other: 22033 },
  { name: 'Olawamiri Otukoya', agency: 'DOC', title: 'Asst Deputy Warden', regular: 147677, overtime: 246532, other: 15503 },
  { name: 'Adrian Ageda', agency: 'ACS', title: 'Stationary Engineer', regular: 149478, overtime: 239067, other: 48770 },
  { name: 'Robert Secondino', agency: 'DOC', title: 'Oiler', regular: 146598, overtime: 238325, other: 11428 },
  { name: 'Kevin Davies Jr', agency: 'DOC', title: 'Sr Stationary Engineer', regular: 177405, overtime: 237862, other: 3920 },
  { name: 'John Dorn', agency: 'FDNY', title: 'Marine Engineer', regular: 125276, overtime: 236309, other: 24606 },
  { name: 'Lenny Lugo', agency: 'NYCHA', title: 'Plumber', regular: 112740, overtime: 235981, other: 8932 },
  { name: 'Robert Prezioso', agency: 'DOC', title: 'Sr Stationary Engineer', regular: 177405, overtime: 235648, other: 4029 },
  { name: 'Dion Parris', agency: 'NYCHA', title: 'Plumber', regular: 112740, overtime: 233532, other: 10937 },
  { name: 'Latanya Brown', agency: 'DOC', title: 'Captain', regular: 127874, overtime: 232421, other: 25767 },
  { name: 'Anthony Belisario', agency: 'FDNY', title: 'Marine Engineer', regular: 125276, overtime: 231772, other: 24606 },
  { name: 'Vincent Berna', agency: 'FDNY', title: 'Marine Engineer', regular: 114191, overtime: 230902, other: 23334 },
  { name: 'Bob Villette', agency: 'DOC', title: 'Captain', regular: 127874, overtime: 228447, other: 18422 },
  { name: 'Gregg Behrens', agency: 'DOHMH', title: 'Stationary Engineer', regular: 149478, overtime: 228372, other: 43437 },
  { name: 'Vlajemy Francois', agency: 'DOC', title: 'Asst Deputy Warden', regular: 139873, overtime: 225009, other: 30436 },
  { name: 'Ryan Jackman', agency: 'DOC', title: 'Steam Fitter', regular: 131261, overtime: 220951, other: 12547 },
  { name: 'Anthony Torcivia III', agency: 'DOC', title: 'Tractor Operator', regular: 145686, overtime: 220875, other: 7249 },
  { name: 'Harrynarine Maharaj', agency: 'NYCHA', title: 'Supervisor Electrician', regular: 131868, overtime: 220374, other: 11996 },
  { name: 'Raymond Takacs', agency: 'DOHMH', title: 'Stationary Engineer', regular: 149478, overtime: 217518, other: 39685 },
].map(e => ({
  ...e,
  total: e.regular + e.overtime + e.other,
  otRatio: Math.round((e.overtime / e.regular) * 100),
}))

// Top 25 highest base salaries — same filtered/unfiltered
export const topSalaries = [
  { name: 'Melissa Ramos', agency: 'DOE', title: 'Chancellor', salary: 428280, grossPaid: 357339 },
  { name: 'David Banks', agency: 'DOE', title: 'Asst Superintendent', salary: 414799, grossPaid: 224683 },
  { name: 'Lisa Bova-Hiatt', agency: 'NYCHA', title: 'Exec Agency Counsel', salary: 399999, grossPaid: 392430 },
  { name: 'Steven Meier', agency: 'Comptroller', title: 'Pension Investment Advisor', salary: 385453, grossPaid: 372255 },
  { name: 'Marek Tyszkiewicz', agency: 'Actuary', title: 'Chief Actuary', salary: 361089, grossPaid: 348976 },
  { name: 'Petya Nikolova', agency: 'Comptroller', title: 'Director of Investments', salary: 347501, grossPaid: 335603 },
  { name: 'Eneasz Kadziela', agency: 'Comptroller', title: 'Director of Investments', salary: 345205, grossPaid: 333385 },
  { name: 'Valerie Red-Horse Mohl', agency: 'Comptroller', title: 'Director of Investments', salary: 344855, grossPaid: 115299 },
  { name: 'Randy Mastro', agency: 'Mayor', title: 'First Deputy Mayor', salary: 324144, grossPaid: 65024 },
  { name: 'Maria Torres-Springer', agency: 'Mayor', title: 'First Deputy Mayor', salary: 313941, grossPaid: 242983 },
  { name: 'Sheena Wright', agency: 'Mayor', title: 'Special Assistant', salary: 313941, grossPaid: 137799 },
  { name: 'Danika Rux', agency: 'DOE', title: 'Asst Superintendent', salary: 312357, grossPaid: 302935 },
  { name: 'Daniel Weisberg', agency: 'DOE Admin', title: 'Exec Program Specialist', salary: 312357, grossPaid: 300695 },
  { name: 'Michael Garland', agency: 'Comptroller', title: 'Director of Investments', salary: 310171, grossPaid: 299551 },
  { name: 'Suri Duitch', agency: 'CUNY', title: 'College President', salary: 303000, grossPaid: 271143 },
  { name: 'David Rohde', agency: 'NYCHA', title: 'Exec Agency Counsel', salary: 301198, grossPaid: 290900 },
  { name: 'Muriel Goode-Trufant', agency: 'Law Dept', title: 'Corporation Counsel', salary: 298212, grossPaid: 284706 },
  { name: 'Jacques Jiha', agency: 'OMB', title: 'Director of Mgmt & Budget', salary: 297012, grossPaid: 286843 },
  { name: 'Camille Joseph-Varlack', agency: 'Mayor', title: 'Chief of Staff', salary: 297012, grossPaid: 296535 },
  { name: 'Fabien Levy', agency: 'Mayor', title: 'Deputy Mayor', salary: 297012, grossPaid: 293649 },
  { name: 'Jessica Tisch', agency: 'NYPD', title: 'Commissioner', salary: 286627, grossPaid: 154394 },
  { name: 'Matthew Fraser', agency: 'OTI', title: 'Commissioner', salary: 291821, grossPaid: 282317 },
  { name: 'Rohit Aggarwala', agency: 'DEP', title: 'Commissioner', salary: 291821, grossPaid: 281829 },
  { name: 'Jeremy John', agency: 'City Council', title: 'Chief of Staff', salary: 294009, grossPaid: 284418 },
  { name: 'Eva Trimble', agency: 'NYCHA', title: 'Admin Staff Analyst', salary: 293094, grossPaid: 283073 },
]

// ---------------------------------------------------------------------------
// Compensation distribution — total comp in $10K bands
// ---------------------------------------------------------------------------
export const compensationDistribution = [
  { band: 'Under $10K', min: -Infinity, max: 10000, count: 159113, totalComp: 445455179, note: 'Includes part-time, seasonal & per-session' },
  { band: '$10K–20K', min: 10000, max: 20000, count: 40233, totalComp: 583589044 },
  { band: '$20K–30K', min: 20000, max: 30000, count: 26656, totalComp: 662417039 },
  { band: '$30K–40K', min: 30000, max: 40000, count: 25819, totalComp: 903058553 },
  { band: '$40K–50K', min: 40000, max: 50000, count: 22117, totalComp: 1000120887 },
  { band: '$50K–60K', min: 50000, max: 60000, count: 25713, totalComp: 1405543490 },
  { band: '$60K–70K', min: 60000, max: 70000, count: 24486, totalComp: 1594176089 },
  { band: '$70K–80K', min: 70000, max: 80000, count: 29001, totalComp: 2178691978 },
  { band: '$80K–90K', min: 80000, max: 90000, count: 25660, totalComp: 2176730493 },
  { band: '$90K–100K', min: 90000, max: 100000, count: 22359, totalComp: 2125996999 },
  { band: '$100K–110K', min: 100000, max: 110000, count: 23022, totalComp: 2417848135 },
  { band: '$110K–120K', min: 110000, max: 120000, count: 23236, totalComp: 2664254496 },
  { band: '$120K–130K', min: 120000, max: 130000, count: 16603, totalComp: 2064666539 },
  { band: '$130K–140K', min: 130000, max: 140000, count: 23035, totalComp: 3125641898 },
  { band: '$140K–150K', min: 140000, max: 150000, count: 12728, totalComp: 1839204555 },
  { band: '$150K–160K', min: 150000, max: 160000, count: 10329, totalComp: 1599817749 },
  { band: '$160K–170K', min: 160000, max: 170000, count: 9463, totalComp: 1559005902 },
  { band: '$170K–180K', min: 170000, max: 180000, count: 7083, totalComp: 1238015412 },
  { band: '$180K–190K', min: 180000, max: 190000, count: 6041, totalComp: 1115774319 },
  { band: '$190K–200K', min: 190000, max: 200000, count: 4436, totalComp: 863979502 },
  { band: '$200K–210K', min: 200000, max: 210000, count: 3445, totalComp: 705298770 },
  { band: '$210K–220K', min: 210000, max: 220000, count: 2552, totalComp: 547781491 },
  { band: '$220K–230K', min: 220000, max: 230000, count: 1802, totalComp: 404837578 },
  { band: '$230K–240K', min: 230000, max: 240000, count: 1512, totalComp: 354680936 },
  { band: '$240K–250K', min: 240000, max: 250000, count: 1011, totalComp: 247347277 },
  { band: '$250K–260K', min: 250000, max: 260000, count: 822, totalComp: 209454338 },
  { band: '$260K–270K', min: 260000, max: 270000, count: 582, totalComp: 154188685 },
  { band: '$270K–280K', min: 270000, max: 280000, count: 432, totalComp: 118716096 },
  { band: '$280K–290K', min: 280000, max: 290000, count: 257, totalComp: 73111849 },
  { band: '$290K–300K', min: 290000, max: 300000, count: 189, totalComp: 55722583 },
  { band: '$300K+', min: 300000, max: Infinity, count: 381, totalComp: 160806582 },
]

export const filteredCompensationDistribution = compensationDistribution.map(d => {
  if (d.band === 'Under $10K') return { ...d, min: 0, count: 158140, totalComp: 448282190, note: 'Part-time, seasonal & per-session (> $0 only)' }
  return d
})

// Borough data
export const boroughData = [
  { name: 'Manhattan', employees: 402750, regular: 19491197111, overtime: 908956192, other: 1281285085 },
  { name: 'Queens', employees: 62262, regular: 4033869424, overtime: 850498467, other: 427456912 },
  { name: 'Brooklyn', employees: 46848, regular: 3129075396, overtime: 660105863, other: 396412288 },
  { name: 'Bronx', employees: 26248, regular: 1651367631, overtime: 360381432, other: 218203675 },
  { name: 'Staten Island', employees: 7639, regular: 557298640, overtime: 135771545, other: 84558187 },
].map(b => ({
  ...b,
  total: b.regular + b.overtime + b.other,
}))
