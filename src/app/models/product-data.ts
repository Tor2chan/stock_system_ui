export interface ProductData {
    
  rowNum?: number;
  totalRow?: number;
  first?: number;
  size?: number;
  mode?: string;

  id?: number;
  name?: string;
  sku?: string;
  batchCode?: string;
  amount?: number;
  category?: string;
  price?: number;
  receivedDate?: any
  expireDate?: any;
  createDate?: Date;
  
  //name.category
  code? : string;
  categoryName?: string;
  sumAmount?: number;
}
