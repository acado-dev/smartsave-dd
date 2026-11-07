import { describe, test, expect } from 'bun:test';
import { addPartnerDemoData } from './partnerDemoData';
import { tenants } from './superadminData';
import { partnerReport } from '../lib/partnerReporting';

describe('sample partner attribution', () => {
  test('provides three partners and six linked tenants including chains and a single store', () => {
    const data = addPartnerDemoData(tenants, []);
    expect(data.partners.length).toBe(3);
    expect(data.tenants.filter(t => t.partnerId).length).toBe(6);
    const reports = data.partners.map(p => partnerReport(p, data.tenants, [], []));
    expect(reports.map(r => r.stores)).toEqual([38, 9998, 1]);
    expect(reports[2].singleStores).toBe(1);
  });
  test('preserves saved direct choices, partner attribution and renamed partner records', () => {
    const saved = tenants.map(t => t.id === 't-cornerstop' ? {...t, salesChannel:'direct'} : t.id === 't-zabka' ? {...t, salesChannel:'partner', partnerId:'custom', partnerName:'Existing partner'} : t);
    const partner = {id:'partner-demo-northstar', name:'Renamed sample'};
    const data = addPartnerDemoData(saved, [partner]);
    expect(data.tenants.find(t => t.id === 't-cornerstop').salesChannel).toBe('direct');
    expect(data.tenants.find(t => t.id === 't-zabka').partnerId).toBe('custom');
    expect(data.partners.find(p => p.id === partner.id).name).toBe('Renamed sample');
    expect(addPartnerDemoData(data.tenants, data.partners)).toEqual(data);
  });
});