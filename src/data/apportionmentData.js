// 2020 Census populations for all 50 states
export const populations = [
  ["California","CA",39538223],["Texas","TX",29145505],["Florida","FL",21538187],
  ["New York","NY",20201249],["Pennsylvania","PA",13002700],["Illinois","IL",12812508],
  ["Ohio","OH",11799448],["Georgia","GA",10711908],["North Carolina","NC",10439388],
  ["Michigan","MI",10077331],["New Jersey","NJ",9288994],["Virginia","VA",8631393],
  ["Washington","WA",7705281],["Arizona","AZ",7151502],["Massachusetts","MA",7029917],
  ["Tennessee","TN",6910840],["Indiana","IN",6785528],["Maryland","MD",6177224],
  ["Missouri","MO",6154913],["Wisconsin","WI",5893718],["Colorado","CO",5773714],
  ["Minnesota","MN",5706494],["South Carolina","SC",5118425],["Alabama","AL",5024279],
  ["Louisiana","LA",4657757],["Kentucky","KY",4505836],["Oregon","OR",4237256],
  ["Oklahoma","OK",3959353],["Connecticut","CT",3605944],["Utah","UT",3271616],
  ["Iowa","IA",3190369],["Nevada","NV",3104614],["Arkansas","AR",3011524],
  ["Mississippi","MS",2961279],["Kansas","KS",2937880],["New Mexico","NM",2117522],
  ["Nebraska","NE",1961504],["Idaho","ID",1839106],["West Virginia","WV",1793716],
  ["Hawaii","HI",1455271],["New Hampshire","NH",1377529],["Maine","ME",1362359],
  ["Rhode Island","RI",1097379],["Montana","MT",1084225],["Delaware","DE",989948],
  ["South Dakota","SD",886667],["North Dakota","ND",779094],["Alaska","AK",733391],
  ["Vermont","VT",643077],["Wyoming","WY",576851]
]

function priority(pop, n) {
  return pop / Math.sqrt(n * (n - 1))
}

function buildFormula(pop, n) {
  const inner = n * (n - 1)
  const sqrtVal = Math.sqrt(inner).toFixed(2)
  const popFmt = pop.toLocaleString()
  return `${popFmt} ÷ √(${n} × ${n - 1}) = ${popFmt} ÷ √${inner.toLocaleString()} = ${popFmt} ÷ ${sqrtVal}`
}

export function runApportionment() {
  const seats = {}
  const steps = []
  populations.forEach(([, abbr]) => { seats[abbr] = 1 })

  for (let step = 51; step <= 435; step++) {
    let best = null
    let bestVal = -1
    populations.forEach(([name, abbr, pop]) => {
      const n = seats[abbr] + 1
      const val = priority(pop, n)
      if (val > bestVal) {
        bestVal = val
        best = [name, abbr, pop, n]
      }
    })
    const [name, abbr, pop, n] = best
    seats[abbr]++
    steps.push({
      step,
      name,
      abbr,
      pop,
      seatNum: n,
      priority: bestVal,
      total: seats[abbr],
      formula: buildFormula(pop, n),
    })
  }
  return { steps, finalSeats: { ...seats } }
}

// Pre-compute
const { steps, finalSeats } = runApportionment()

// Build full row list: 50 guaranteed first seats + 385 apportioned seats
export const allRows = []
populations.forEach(([name, abbr, pop]) => {
  allRows.push({ step: null, name, abbr, pop, seatNum: 1, priority: null, total: 1, isFirst: true, formula: null })
})
steps.forEach(s => allRows.push({ ...s, isFirst: false }))

export { finalSeats }
