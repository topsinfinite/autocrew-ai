/**
 * Pure ROI calculation for the public /roi-calculator page.
 *
 * Conservative defaults — these are the only assumptions baked into the
 * model. The on-page "How we got the number" section reads from these
 * constants so the methodology stays in lockstep with the math.
 */

export const AUTOCREW_DEFLECTION_RATE = 0.7;
export const LEAD_CONVERSION_RATE = 0.25;
export const MONTHS_PER_YEAR = 12;

export type RoiInputs = {
  monthlyVolume: number;
  handleTimeMin: number;
  hourlyCost: number;
  afterHoursPct: number;
  avgLeadValue: number;
};

export type RoiOutputs = {
  hoursSavedPerMonth: number;
  laborCostSavedPerYear: number;
  afterHoursLeadsCapturedPerMonth: number;
  revenueUpliftPerYear: number;
};

const clampNonNegative = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function calculateRoi(inputs: RoiInputs): RoiOutputs {
  const volume = clampNonNegative(inputs.monthlyVolume);
  const handleTimeMin = clampNonNegative(inputs.handleTimeMin);
  const hourlyCost = clampNonNegative(inputs.hourlyCost);
  const afterHoursPct = Math.min(clampNonNegative(inputs.afterHoursPct), 100);
  const avgLeadValue = clampNonNegative(inputs.avgLeadValue);

  const handledByAutocrew = volume * AUTOCREW_DEFLECTION_RATE;
  const hoursSavedPerMonth = (handledByAutocrew * handleTimeMin) / 60;
  const laborCostSavedPerYear =
    hoursSavedPerMonth * hourlyCost * MONTHS_PER_YEAR;

  const afterHoursLeadsCapturedPerMonth =
    volume * (afterHoursPct / 100) * AUTOCREW_DEFLECTION_RATE;
  const revenueUpliftPerYear =
    afterHoursLeadsCapturedPerMonth *
    LEAD_CONVERSION_RATE *
    avgLeadValue *
    MONTHS_PER_YEAR;

  return {
    hoursSavedPerMonth,
    laborCostSavedPerYear,
    afterHoursLeadsCapturedPerMonth,
    revenueUpliftPerYear,
  };
}
