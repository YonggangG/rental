export type Locale = 'en' | 'zh';

const messages = {
  en: {
    appName: 'Rental Manager',
    tagline: 'Florida rental operations for 20–50 homes.',
    landlordPortal: 'Landlord Portal',
    tenantPortal: 'Tenant Portal',
    dashboard: 'Dashboard',
    properties: 'Properties',
    tenants: 'Tenants',
    leases: 'Leases',
    rentLedger: 'Rent Ledger',
    maintenance: 'Maintenance',
    documents: 'Documents',
    tenantWelcome: 'View your lease, rent balance, maintenance requests, notices, and insurance documents.',
    landlordWelcome: 'Manage properties, tenants, leases, rent tracking, notices, maintenance, and documents.'
  },
  zh: {
    appName: 'MCO 出租屋管理系统',
    tagline: '面向 Florida 20–50 套出租屋的运营管理。',
    landlordPortal: '房东后台',
    tenantPortal: '租客门户',
    dashboard: '仪表盘',
    properties: '房屋',
    tenants: '租客',
    leases: '租约',
    rentLedger: '租金账本',
    maintenance: '维修',
    documents: '文件',
    tenantWelcome: '查看租约、租金余额、维修请求、通知和保险文件。',
    landlordWelcome: '管理房屋、租客、租约、租金、通知、维修和文件。'
  }
} as const;

export function getLocale(searchParams?: Record<string, string | string[] | undefined>): Locale {
  const raw = searchParams?.lang;
  return raw === 'zh' ? 'zh' : 'en';
}

export function t(locale: Locale) {
  return messages[locale];
}
