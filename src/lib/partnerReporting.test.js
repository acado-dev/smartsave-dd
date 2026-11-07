import { describe, test, expect } from 'bun:test';
import { reconcilePartners, partnerReport } from './partnerReporting';

const partner = { id: 'p1', name: 'Partner One' };
const tenants = [{ id: 't1', name: 'Chain', salesChannel: 'partner', partnerId: 'p1', storesCount: 8, storeFormat: 'chain' }, { id: 't2', name: 'Single', salesChannel: 'partner', partnerId: 'p1', storesCount: 1, storeFormat: 'single' }, { id: 't3', name: 'Other', salesChannel: 'direct', storesCount: 50 }];
const skus = [{ id: 's1', nodeId: 'core', billing: 'subscription' }, { id: 's2', nodeId: 'hardware', billing: 'one-time' }];
const products = [{ id:'c1', tenantId:'t1', skuId:'s1', quantity:8, used:6, status:'active', endDate:'2026-11-25' }, { id:'c2', tenantId:'t2', skuId:'s1', quantity:1, status:'active', endDate:'2026-10-31' }, { id:'c3', tenantId:'t1', skuId:'s2', quantity:100, status:'active', endDate:'' }, { id:'c4', tenantId:'t3', skuId:'s1', quantity:50, status:'active', endDate:'2026-12-31' }];
describe('partner reporting', () => {
 test('counts only linked chain and single-store business without counting licence units as stores', () => {
  const r=partnerReport(partner,tenants,products,skus,'2026-11-07');
  expect([r.customers.length,r.stores,r.chains,r.singleStores]).toEqual([2,9,1,1]);
  expect(r.rows.map((r)=>r.c.id)).toEqual(['c1','c2','c3']);
 });
 test('reports active subscriptions, expiry, renewal and usage', () => {
  const r=partnerReport(partner,tenants,products,skus,'2026-11-07');
  expect(r.subscriptions).toBe(1); expect(r.expired).toBe(1); expect(r.renewals.map((r)=>r.c.id)).toEqual(['c1']); expect(r.renewals[0].days).toBe(18); expect(r.renewals[0].c.used).toBe(6);
 });
 test('preserves legacy attribution and consolidates name variations', () => {
  const r=reconcilePartners([{...tenants[0],partnerId:undefined,partnerName:'Retail Partner',createdAt:'2026-01-01'}, {...tenants[1],partnerId:undefined,partnerName:' retail partner ',createdAt:'2026-02-01'}]);
  expect(r.partners.length).toBe(1); expect(r.tenants[0].partnerId).toBe(r.tenants[1].partnerId); expect(r.tenants[0].storesCount).toBe(8);
 });
 test('stable partner IDs retain attribution after a rename', () => {
  const r=reconcilePartners(tenants,[{...partner,name:'Renamed Partner'}]); expect(r.tenants[0].partnerName).toBe('Renamed Partner'); expect(r.tenants[0].partnerId).toBe('p1');
 });
});