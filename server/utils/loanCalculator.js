/**
 * Calculate Amortization Schedule
 * @param {number} principal - Loan amount
 * @param {number} annualRatePct - Annual interest rate in % (e.g., 12 for 12%/year or monthly 1%)
 * @param {number} termMonths - Term in months
 * @param {Date|string} startDate - Start / disbursement date
 * @param {string} calculationType - 'flat' or 'declining' (standard equal installments)
 */
export function calculateSchedule(principal, annualRatePct, termMonths, startDate = new Date(), calculationType = 'declining') {
  const p = Number(principal);
  const rAnnual = Number(annualRatePct) / 100;
  const rMonthly = rAnnual / 12;
  const n = parseInt(termMonths, 10);
  const start = new Date(startDate);

  const schedule = [];
  let remainingPrincipal = p;

  if (calculationType === 'flat') {
    // Flat rate: Total Interest = Principal * (annualRate/12) * termMonths
    const monthlyInterest = (p * rAnnual) / 12;
    const monthlyPrincipal = p / n;
    const monthlyPayment = monthlyPrincipal + monthlyInterest;

    for (let i = 1; i <= n; i++) {
      const dueDate = new Date(start);
      dueDate.setMonth(start.getMonth() + i);

      const principalDue = i === n ? remainingPrincipal : Math.round(monthlyPrincipal * 100) / 100;
      const interestDue = Math.round(monthlyInterest * 100) / 100;
      const totalDue = Math.round((principalDue + interestDue) * 100) / 100;
      remainingPrincipal = Math.max(0, Math.round((remainingPrincipal - principalDue) * 100) / 100);

      schedule.push({
        installmentNumber: i,
        dueDate: dueDate.toISOString(),
        principalDue,
        interestDue,
        totalDue,
        remainingPrincipal,
        paidAmount: 0,
        status: 'PENDING'
      });
    }
  } else {
    // Declining balance (Equal Monthly Installment - EMI / Annuity)
    // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
    let emi;
    if (rMonthly === 0) {
      emi = p / n;
    } else {
      emi = (p * rMonthly * Math.pow(1 + rMonthly, n)) / (Math.pow(1 + rMonthly, n) - 1);
    }
    const monthlyPayment = Math.round(emi * 100) / 100;

    for (let i = 1; i <= n; i++) {
      const dueDate = new Date(start);
      dueDate.setMonth(start.getMonth() + i);

      const interestDue = Math.round((remainingPrincipal * rMonthly) * 100) / 100;
      let principalDue = Math.round((monthlyPayment - interestDue) * 100) / 100;

      if (i === n || principalDue > remainingPrincipal) {
        principalDue = remainingPrincipal;
      }

      const totalDue = Math.round((principalDue + interestDue) * 100) / 100;
      remainingPrincipal = Math.max(0, Math.round((remainingPrincipal - principalDue) * 100) / 100);

      schedule.push({
        installmentNumber: i,
        dueDate: dueDate.toISOString(),
        principalDue,
        interestDue,
        totalDue,
        remainingPrincipal,
        paidAmount: 0,
        status: 'PENDING'
      });
    }
  }

  const totalInterest = schedule.reduce((sum, item) => sum + item.interestDue, 0);
  const totalPayable = schedule.reduce((sum, item) => sum + item.totalDue, 0);
  const monthlyPayment = schedule.length > 0 ? schedule[0].totalDue : 0;

  return {
    schedule,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayable: Math.round(totalPayable * 100) / 100,
    monthlyPayment
  };
}
