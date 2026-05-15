export type LeasePdfData = {
  landlordName: string;
  tenantNames: string;
  propertyAddress: string;
  leaseStartDate: string;
  leaseEndDate: string;
  monthlyRent: string;
  securityDeposit: string;
};

export function sampleLeaseData(): LeasePdfData {
  return {
    landlordName: 'Landlord Name',
    tenantNames: 'Tenant Name',
    propertyAddress: '123 Example St, Orlando, FL 32801',
    leaseStartDate: '2026-01-01',
    leaseEndDate: '2026-07-31',
    monthlyRent: '2000.00',
    securityDeposit: '2000.00'
  };
}
