export const vehicleAnalyticsMockData = {
    ytd: {
        total: '57.6K',
        growth: '+2%',
        target: '4.0M',
        current: 57600,
        targetAchieved: '2%'
    },
    currentMonth: {
        total: '57.6K',
        growth: '0%',
        target: '400K',
        current: 57600,
        targetAchieved: '0%'
    },
    locationDistribution: [
        { name: 'Location A', value: 46, color: '#004EA8' },
        { name: 'Location B', value: 54, color: '#EC1B22' }
    ],

    // Period-based metrics
    periodMetrics: {
        Monthly: {
            vehicleEntry: { value: '57.6K', trend: '+2%', trendUp: true },
            vehicleCurrentMonth: { value: '57.6K', trend: '0%', trendUp: false },
            avgEntry: { value: '859', label: 'vehicles/day' },
            avgDwellTime: { value: '2h 15m', label: 'per vehicle' },
            entryTarget: '2%',
            monthTarget: '0%',
        },
        Weekly: {
            vehicleEntry: { value: '14.2K', trend: '+5%', trendUp: true },
            vehicleCurrentMonth: { value: '12.8K', trend: '-3%', trendUp: false },
            avgEntry: { value: '203', label: 'vehicles/day' },
            avgDwellTime: { value: '1h 58m', label: 'per vehicle' },
            entryTarget: '18%',
            monthTarget: '16%',
        },
        Yearly: {
            vehicleEntry: { value: '689K', trend: '+12%', trendUp: true },
            vehicleCurrentMonth: { value: '689K', trend: '+12%', trendUp: true },
            avgEntry: { value: '1,887', label: 'vehicles/day' },
            avgDwellTime: { value: '2h 32m', label: 'per vehicle' },
            entryTarget: '76%',
            monthTarget: '72%',
        },
    },

    averageDaily: 859,
    averageDwellTime: '2h 15m',
    workingTime: '07:00 to 23:00',
    monthlyOverview: [
        { month: 'January', actual: 280, target: 300, achieved: 93 },
        { month: 'February', actual: 260, target: 280, achieved: 92 },
        { month: 'March', actual: 80, target: 300, achieved: 15 },
        { month: 'April', actual: 240, target: 280, achieved: 85 },
        { month: 'May', actual: 230, target: 260, achieved: 88 },
        { month: 'June', actual: 220, target: 250, achieved: 88 },
        { month: 'July', actual: 210, target: 240, achieved: 87 },
        { month: 'August', actual: 220, target: 250, achieved: 88 },
        { month: 'September', actual: 240, target: 270, achieved: 89 },
        { month: 'October', actual: 280, target: 310, achieved: 90 },
        { month: 'November', actual: 300, target: 320, achieved: 93 },
        { month: 'December', actual: 310, target: 330, achieved: 94 }
    ],
    weeklyOverview: [
        { week: 'W1', actual: 65, target: 75 },
        { week: 'W2', actual: 72, target: 75 },
        { week: 'W3', actual: 58, target: 75 },
        { week: 'W4', actual: 80, target: 75 },
        { week: 'W5', actual: 71, target: 75 },
        { week: 'W6', actual: 88, target: 75 },
        { week: 'W7', actual: 66, target: 75 },
        { week: 'W8', actual: 79, target: 75 },
    ],
    yearlyOverview: [
        { year: '2020', actual: 450, target: 500 },
        { year: '2021', actual: 510, target: 520 },
        { year: '2022', actual: 580, target: 580 },
        { year: '2023', actual: 620, target: 620 },
        { year: '2024', actual: 689, target: 700 },
        { year: '2025 (proj)', actual: 730, target: 750 },
    ],
    monthlySplit: { locationA: 26525, locationB: 21047 },
    weeklySplit: { locationA: 6631, locationB: 5262 },
    yearlySplit: { locationA: 317540, locationB: 252560 },
    weekdayTrend: [
        { day: 'Th', value: 850 },
        { day: 'Fr', value: 720 },
        { day: 'Sa', value: 580 },
        { day: 'Su', value: 540 },
        { day: 'Mo', value: 520 },
        { day: 'We', value: 510 },
        { day: 'Tu', value: 500 }
    ],
    yoyComparison: {
        totalPrevious: '240.9K',
        change: '-76%',
        years: {
            2024: [12, 11, 13, 12, 11, 12, 11, 10, 9, 10, 11, 10, 9, 10, 11, 12, 11, 12, 10, 11, 12, 11, 10, 9, 8, 9, 10, 11, 10, 9, 10],
            2025: [8, 9, 10, 11, 10, 9, 10, 11, 12, 11, 10, 9, 10, 11, 12, 11, 10, 11, 12, 11, 10, 11, 10, 9, 10, 11, 12, 11, 10, 11, 12],
            2026: [5, 4, 6, 7, 6, 5, 8, 4, 2, 3, 4, 5, 4, 3, 4, 5, 4, 3, 5]
        }
    }
};
