export type IgstPaymentStatus = 
  | 'NOT_APPLICABLE' 
  | 'EXPORT_UNDER_BOND' 
  | 'EXPORT_AGAINST_PAYMENT';

export type Incoterms = 'FOB' | 'C&F' | 'C&I' | 'CIF';
export type NatureOfPayment = 'DP' | 'DA' | 'AP';
export type ShipperCategory = 'Merchant' | 'Manufacturer';

export type ShippingBillType = 
  | 'NFEI' 
  | 'FREE_SHIPPING_BILL' 
  | 'EOU' 
  | 'DUTY_DRAWBACK' 
  | 'EPCG' 
  | 'ADVANCE_LICENCE' 
  | 'ROSL' 
  | 'REPAIR_AND_RETURN';

export const END_USE_CODES = [
  { code: 'DCA100', description: 'For Veterinary Medical Use as a Non-Food Product under Controlled Distribution (Trading)' },
  { code: 'DCH100', description: 'For Human Medical Use as a Non-Food Product under Controlled Distribution (Trading)' },
  { code: 'DCH300', description: 'For Human Medical Use as a Transplanted Organ, Tissue, or Fluid' },
  { code: 'DCH400', description: 'For Human Medical Use as a Non-Food Product under Controlled Distribution' },
  { code: 'DCH800', description: 'For Research use a human medicine' },
  { code: 'DCX200', description: 'For manufacture/processing as a human or veterinary medicine (Manufacture/Actual Use)' },
  { code: 'DCX900', description: 'For personal consumption' },
  { code: 'FSA100', description: 'For Animal Food or Feed (Trading/ commercial distribution)' },
  { code: 'FSA200', description: 'For manufacture/processing as a Animal Food/Feed (Manufacture/Actual Use)' },
  { code: 'FSA800', description: 'For use research use as animal Food' },
  { code: 'FSA900', description: 'For Personal use' },
  { code: 'FSH100', description: 'For Consumer use under commercial distribution (Trading)- Retail or wholsale' },
  { code: 'FSH200', description: 'For manufacture/ commercial Processing (Manufacture/Actual Use)' },
  { code: 'FSH700', description: 'For Internal use in Hotels-Restaurant' },
  { code: 'FSH700_2', description: 'For Public Display or Exhibition' }, // Handling the duplicate FSH700
  { code: 'FSH750', description: 'For use in International Sports Events' },
  { code: 'FSH800', description: 'For Research Use' },
  { code: 'FSH900', description: 'For personal consumption' },
  { code: 'FSH910', description: 'For distribution in a natural disaster (if received gratis)' },
  { code: 'FSH920', description: 'For Charitable Use' },
  { code: 'FSH930', description: 'For use in a Diplomatic Establishment' },
  { code: 'GNX100', description: 'For Consumer use under commercial distribution (for Trading - wholesale or retail)' },
  { code: 'GNX200', description: 'For Commercial Assembly or processing (For Manufacture/Actual use)' },
  { code: 'GNX300', description: 'For use as Fertilizers or soil promoters' },
  { code: 'GNX600', description: 'For Repair or Refurbishing as defective or second hand goods' },
  { code: 'GNX650', description: 'For Recycling or Recovery' },
  { code: 'GNX680', description: 'For Disposal as waste' },
  { code: 'GNX700', description: 'For Public Display or Exhibition' },
  { code: 'GNX810', description: 'For Research & Development (note: other than Biomedical Research)' },
  { code: 'GNX815', description: 'For Medical Or Biomedical Research' },
  { code: 'GNX915', description: 'For display as a Trophy (hunting or other trophy)' },
  { code: 'LVA100', description: 'For Breeding in Captivity or Artificial Propagation' },
  { code: 'LVA200', description: 'For Grow-Out or Increase' },
  { code: 'LVA300', description: 'For re-introduction into the wild' },
  { code: 'LVA400', description: 'For Immediate Slaughter' },
  { code: 'LVA500', description: 'For use as Fertilizers or soil promoters' },
  { code: 'LVA710', description: 'For display in Zoo' },
  { code: 'LVA760', description: 'For Circus or Travelling Exhibition or games or show' },
  { code: 'LVA800', description: 'For Research Purposes' },
  { code: 'LVA900', description: 'For Personal use' },
  { code: 'LVA950', description: 'For Re Export' },
  { code: 'LVP100', description: 'For Propagation' },
  { code: 'LVP400', description: 'For Germplasm' },
  { code: 'LVP500', description: 'For use as Fertilizers or soil promoters' },
  { code: 'LVP730', description: 'For a display in a Botanical Garden' }
] as const;

export type EndUseCode = typeof END_USE_CODES[number]['code'];

export interface DhlSli {
  shipperName: string;
  consigneeName: string;
  invoiceNo: string;
  invoiceDate: string; // ISO date string
  
  dhlAirWaybillNumber: string;
  ieCodeNo: string;
  iecBranchCode?: string;
  panNumber: string;
  gstinNumber: string;
  
  igstPaymentStatus: IgstPaymentStatus;
  taxableAmount?: number;
  igstRate?: number;
  igstAmount?: number;
  gstCompensationCess?: number;
  
  endUseCode: EndUseCode;
  
  rodtepBenefitClaimed: boolean;
  totalLineItemsInInvoice?: number;
  rodtepClaimedLineItems?: string;
  
  bankAdCode: string;
  incoterms: Incoterms;
  natureOfPayment: NatureOfPayment;
  fobValue: number;
  freight?: number;
  insurance?: number;
  commission?: number;
  discount?: number;
  packingCharges?: number;
  
  numberOfPackages: number;
  netWeight: number; // in kg
  grossWeight: number; // in kg
  
  stateOfOrigin: string;
  districtOfOrigin: string;
  exportUnderPtaFta?: string;
  
  categoryOfShipper: ShipperCategory;
  updateManufacturerDetailsInSb?: boolean;
  manufacturerName?: string;
  
  specialInstructions?: string;
  
  typeOfShippingBill: ShippingBillType;
  
  documentsProvided: {
    invoice: boolean;
    packingList: boolean;
    nonDgDeclaration: boolean;
    labAnalysisReport: boolean;
    msds: boolean;
    phytosanitaryCert: boolean;
    visaAepcEndorsement: boolean;
    letterToDc: boolean;
    scometDeclaration: boolean;
    rodtepDeclaration: boolean;
  };
  
  apiDetails?: string;
}

export interface GstLut {
  gstin: string;
  legalName: string;
  tradeName?: string;
  address: string;
  financialYear: string;
  dateOfFiling: string; // ISO date or DD/MM/YYYY
  placeOfFiling: string;
  authorizedSignatory: {
    name: string;
    designation: string;
    place: string;
    date: string;
  };
  witnesses: Array<{
    name: string;
    occupation: string;
    address: string;
  }>;
}

export interface IecCertificate {
  iecCode: string;
  pan: string;
  firmName: string;
  natureOfConcern: string;
  dateOfIssue: string;
  registeredAddress: string;
  signatoryName: string;
  lastModified: string;
  fileNumber: string;
}

export interface BankAdCodeCertificate {
  bankName: string;
  date: string;
  addressedTo: string;
  accountHolderName: string;
  accountNumber: string;
  branchName: string;
  iecCode: string;
  adCode: string;
}

export interface ShippingBillInvoiceItem {
  itemSno: number;
  hsCode: string;
  description: string;
  quantity: number;
  uqc: string;
  rate: number;
  value: number;
}

export interface ShippingBill {
  portCode: string;
  sbNo: string;
  sbDate: string;
  iec: string;
  gstin: string;
  portOfLoading: string;
  stateOfOrigin: string;
  portOfDischarge: string;
  countryOfDestination: string;
  
  exporterNameAndAddress: string;
  consigneeNameAndAddress: string;
  
  adCode: string;
  forexBankAcNo: string;
  
  fobValue: number;
  freight: number;
  insurance: number;
  discount: number;
  commission: number;
  
  invoiceNo: string;
  invoiceDate: string; // ISO date
  invoiceAmount: number;
  currency: string;
  
  items: ShippingBillInvoiceItem[];
}
