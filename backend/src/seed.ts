import prisma from './config/prisma.js';

async function seed() {
  console.log('Starting seed process with Prisma...');

  // 1. Define additional products (PRD-011 to PRD-050)
  const products = [
    // Beverages
    { code: 'PRD-011', name: 'Coca Cola 320ml', description: 'Nuoc ngọt Coca Cola lon', category: 'Beverages', unit: 'Lon' },
    { code: 'PRD-012', name: 'Pepsi 320ml', description: 'Nuoc ngọt Pepsi lon', category: 'Beverages', unit: 'Lon' },
    { code: 'PRD-013', name: 'Tra xanh khong do 450ml', description: 'Tra xanh thanh nhiet', category: 'Beverages', unit: 'Chai' },
    { code: 'PRD-014', name: 'Sua dau nanh Fami 200ml', description: 'Sua dau nanh nguyen chat', category: 'Dairy', unit: 'Hop' },
    { code: 'PRD-015', name: 'Nuoc tang luc Redbull 250ml', description: 'Bo huc nhap khau Thai Lan', category: 'Beverages', unit: 'Lon' },
    { code: 'PRD-016', name: 'Bia Heineken 330ml', description: 'Bia Heineken lon bac', category: 'Beverages', unit: 'Lon' },
    { code: 'PRD-017', name: 'Tra sua Kirin Latte 345ml', description: 'Tra sua Kirin Latte Nhat Ban', category: 'Beverages', unit: 'Chai' },

    // Snacks & Confectionery
    { code: 'PRD-018', name: 'Banh ChocoPie 396g', description: 'Banh ChocoPie Orion hop 12 cai', category: 'Snacks', unit: 'Hop' },
    { code: 'PRD-019', name: 'Khoai tay chien Lay\'s 150g', description: 'Khoai tay chien vi tu nhien', category: 'Snacks', unit: 'Goi' },
    { code: 'PRD-020', name: 'Keo gum Doublemint', description: 'Keo cao su huong bac ha', category: 'Snacks', unit: 'Hu' },
    { code: 'PRD-021', name: 'Banh quy Cosy Cosy 336g', description: 'Banh quy bo thom ngon', category: 'Snacks', unit: 'Hop' },
    { code: 'PRD-022', name: 'Banh que Astor 150g', description: 'Banh que vi socola', category: 'Snacks', unit: 'Hop' },
    { code: 'PRD-023', name: 'Hat dieu rang muoi Omai 200g', description: 'Hat dieu rang muoi loai 1', category: 'Snacks', unit: 'Hu' },

    // Canned & Instant Food
    { code: 'PRD-024', name: 'Ca hop Ba Co Gai 155g', description: 'Ca nuc sot ca chua', category: 'Canned Food', unit: 'Lon' },
    { code: 'PRD-025', name: 'Thit heo hop Vissan 150g', description: 'Thit heo xay dong hop', category: 'Canned Food', unit: 'Lon' },
    { code: 'PRD-026', name: 'Mi Kokomi dai ngon 75g', description: 'Mi tom chua cay Kokomi', category: 'Noodles', unit: 'Goi' },
    { code: 'PRD-027', name: 'Pho bo an lien Cung Dinh', description: 'Pho bo Cung Dinh huong vi Ha Noi', category: 'Noodles', unit: 'Bat' },
    { code: 'PRD-028', name: 'Chao thit bam Gấu Đỏ 50g', description: 'Chao thit bam an lien', category: 'Noodles', unit: 'Goi' },

    // Grains & Dry Goods
    { code: 'PRD-029', name: 'Gao Thom Neptune 5kg', description: 'Gao thom thuong hang nha Neptune', category: 'Grains', unit: 'Bich' },
    { code: 'PRD-030', name: 'Bot mi da dung Meizan 1kg', description: 'Bot mi da dung cao cap', category: 'Grains', unit: 'Goi' },
    { code: 'PRD-031', name: 'Duong cat trang Bien Hoa 1kg', description: 'Duong tinh luyen tu nhien', category: 'Condiments', unit: 'Goi' },
    { code: 'PRD-032', name: 'Muoi iot Hải Tĩnh 500g', description: 'Muoi iot tinh say', category: 'Condiments', unit: 'Goi' },
    { code: 'PRD-033', name: 'Hat nem Knorr thit tham 900g', description: 'Hat nem tu thit va xuong ong', category: 'Condiments', unit: 'Goi' },
    { code: 'PRD-034', name: 'Tuong ot Chinsu 250g', description: 'Tuong ot cay nhe dam da', category: 'Condiments', unit: 'Chai' },

    // Dairy & Breakfast
    { code: 'PRD-035', name: 'Sua chua Vinamilk co duong', description: 'Loc 4 hop sua chua Vinamilk', category: 'Dairy', unit: 'Loc' },
    { code: 'PRD-036', name: 'Bo thuc vat Meizan 200g', description: 'Bo thuc vat thom ngon be ngo', category: 'Dairy', unit: 'Hop' },
    { code: 'PRD-037', name: 'Phomai Con Bo Cuoi 8 mieng', description: 'Phomai hop giay 8 mieng', category: 'Dairy', unit: 'Hop' },
    { code: 'PRD-038', name: 'Sua dac Ong Tho do 380g', description: 'Sua dac co duong Ong Tho', category: 'Dairy', unit: 'Lon' },

    // Household & Cleaning
    { code: 'PRD-039', name: 'Nuoc lau san Sunlight 1kg', description: 'Nuoc lau san huong hoa ha', category: 'Household', unit: 'Chai' },
    { code: 'PRD-040', name: 'Nuoc rua chen Sunlight Chanh 750ml', description: 'Nuoc rua chen tay sach dau mo', category: 'Household', unit: 'Chai' },
    { code: 'PRD-041', name: 'Bot giat OMO do 3kg', description: 'Bot giat OMO xoay bay vet ban', category: 'Household', unit: 'Bich' },
    { code: 'PRD-042', name: 'Nuoc xa vai Comfort 1.8L', description: 'Nuoc xa vai ban mai diu dang', category: 'Household', unit: 'Bich' },
    { code: 'PRD-043', name: 'Giay ve sinh Pulppy 10 cuon', description: 'Giay ve sinh Pulppy 2 lop', category: 'Household', unit: 'Bich' },

    // Personal Care
    { code: 'PRD-044', name: 'Dau goi Clear bac ha 650g', description: 'Dau goi sach gau mat lanh', category: 'Personal Care', unit: 'Chai' },
    { code: 'PRD-045', name: 'Sua tam Lifebuoy bao ve 850g', description: 'Sua tam diet khuan Lifebuoy', category: 'Personal Care', unit: 'Chai' },
    { code: 'PRD-046', name: 'Kem danh rang P/S 240g', description: 'Kem danh rang P/S ngua sau rang', category: 'Personal Care', unit: 'Hop' },
    { code: 'PRD-047', name: 'Ban chai danh rang Colgate', description: 'Ban chai danh rang long to mem mai', category: 'Personal Care', unit: 'Cay' },
    { code: 'PRD-048', name: 'Nuoc suc mieng Listerine 500ml', description: 'Nuoc suc mieng huong bac ha', category: 'Personal Care', unit: 'Chai' },
    { code: 'PRD-049', name: 'Xa bong tam Safeguard trang 130g', description: 'Xa phong tam diet khuan', category: 'Personal Care', unit: 'Cuc' },
    { code: 'PRD-050', name: 'Bong tay trang Ipek 80 mieng', description: 'Bong tay trang cotton tu nhien', category: 'Personal Care', unit: 'Bich' },
  ];

  console.log(`Inserting ${products.length} products...`);
  const createdProducts = [];
  for (const prod of products) {
    const created = await prisma.product.upsert({
      where: { code: prod.code },
      update: {},
      create: prod,
    });
    createdProducts.push(created);
  }

  // 2. Associate with suppliers
  console.log('Associating products with suppliers...');
  
  // Supplier IDs from database: Vinamilk (1), Nestle (2), TH True (3), Masan (4)
  const supplierAssociations = [
    // Vinamilk (1)
    { supplierId: 1, codes: ['PRD-014', 'PRD-035', 'PRD-038'], price: 22000 },
    // TH True Milk (3)
    { supplierId: 3, codes: ['PRD-014', 'PRD-035'], price: 24000 },
    // Masan Consumer (4)
    { supplierId: 4, codes: ['PRD-026', 'PRD-034'], price: 2800 },
    // Nestle Vietnam (2)
    { supplierId: 2, codes: ['PRD-011', 'PRD-012', 'PRD-013', 'PRD-015', 'PRD-019'], price: 8000 },
  ];

  for (const assoc of supplierAssociations) {
    for (const code of assoc.codes) {
      const p = createdProducts.find(x => x.code === code);
      if (p) {
        await prisma.supplierProduct.upsert({
          where: {
            supplierId_productId: {
              supplierId: assoc.supplierId,
              productId: p.id
            }
          },
          update: { price: assoc.price, isAvailable: true },
          create: { supplierId: assoc.supplierId, productId: p.id, price: assoc.price }
        });
      }
    }
  }

  // 3. Seed Inventory for Main Warehouse (locationId = 1)
  console.log('Seeding warehouse and store inventories...');
  const mainWarehouseInv = [
    { code: 'PRD-011', quantity: 1200, costPrice: 7200, sellingPrice: 10000, expirationDate: new Date('2026-06-30'), dynamicThreshold: 100 },
    { code: 'PRD-012', quantity: 1000, costPrice: 7200, sellingPrice: 10000, expirationDate: new Date('2026-06-30'), dynamicThreshold: 100 },
    { code: 'PRD-013', quantity: 800,  costPrice: 6000, sellingPrice: 9000,  expirationDate: new Date('2026-02-28'), dynamicThreshold: 50 },
    { code: 'PRD-014', quantity: 2500, costPrice: 5200, sellingPrice: 8000,  expirationDate: new Date('2025-05-15'), dynamicThreshold: 200 },
    { code: 'PRD-015', quantity: 1500, costPrice: 9500, sellingPrice: 14000, expirationDate: new Date('2027-01-01'), dynamicThreshold: 100 },
    { code: 'PRD-016', quantity: 3000, costPrice: 16000, sellingPrice: 22000, expirationDate: new Date('2026-09-30'), dynamicThreshold: 300 },
    { code: 'PRD-017', quantity: 400,  costPrice: 14000, sellingPrice: 20000, expirationDate: new Date('2025-10-31'), dynamicThreshold: 40 },

    { code: 'PRD-018', quantity: 500,  costPrice: 45000, sellingPrice: 60000, expirationDate: new Date('2026-03-20'), dynamicThreshold: 50 },
    { code: 'PRD-019', quantity: 1500, costPrice: 11000, sellingPrice: 16000, expirationDate: new Date('2025-12-15'), dynamicThreshold: 100 },
    { code: 'PRD-020', quantity: 300,  costPrice: 18000, sellingPrice: 25000, expirationDate: new Date('2026-08-30'), dynamicThreshold: 30 },
    { code: 'PRD-021', quantity: 600,  costPrice: 32000, sellingPrice: 45000, expirationDate: new Date('2026-07-25'), dynamicThreshold: 50 },
    { code: 'PRD-022', quantity: 400,  costPrice: 24000, sellingPrice: 35000, expirationDate: new Date('2026-01-10'), dynamicThreshold: 40 },
    { code: 'PRD-023', quantity: 200,  costPrice: 62000, sellingPrice: 85000, expirationDate: new Date('2026-04-15'), dynamicThreshold: 20 },

    { code: 'PRD-024', quantity: 1000, costPrice: 13000, sellingPrice: 18000, expirationDate: new Date('2027-12-31'), dynamicThreshold: 100 },
    { code: 'PRD-025', quantity: 800,  costPrice: 22000, sellingPrice: 30000, expirationDate: new Date('2027-10-30'), dynamicThreshold: 80 },
    { code: 'PRD-026', quantity: 5000, costPrice: 2800,  sellingPrice: 4000,  expirationDate: new Date('2026-11-30'), dynamicThreshold: 500 },
    { code: 'PRD-027', quantity: 1200, costPrice: 8500,  sellingPrice: 12000, expirationDate: new Date('2026-05-20'), dynamicThreshold: 100 },
    { code: 'PRD-028', quantity: 2000, costPrice: 2300,  sellingPrice: 3500,  expirationDate: new Date('2026-02-15'), dynamicThreshold: 150 },

    { code: 'PRD-029', quantity: 600,  costPrice: 92000, sellingPrice: 125000, expirationDate: null,                 dynamicThreshold: 80 },
    { code: 'PRD-030', quantity: 700,  costPrice: 16000, sellingPrice: 23000,  expirationDate: new Date('2026-10-30'), dynamicThreshold: 50 },
    { code: 'PRD-031', quantity: 1500, costPrice: 17500, sellingPrice: 24000,  expirationDate: null,                 dynamicThreshold: 100 },
    { code: 'PRD-032', quantity: 1000, costPrice: 4200,  sellingPrice: 7000,   expirationDate: null,                 dynamicThreshold: 50 },
    { code: 'PRD-033', quantity: 800,  costPrice: 55000, sellingPrice: 75000,  expirationDate: new Date('2026-08-30'), dynamicThreshold: 80 },
    { code: 'PRD-034', quantity: 1800, costPrice: 11000, sellingPrice: 16000,  expirationDate: new Date('2027-02-28'), dynamicThreshold: 120 },

    { code: 'PRD-035', quantity: 900,  costPrice: 18000, sellingPrice: 26000,  expirationDate: new Date('2025-02-15'), dynamicThreshold: 80 },
    { code: 'PRD-036', quantity: 300,  costPrice: 14000, sellingPrice: 20000,  expirationDate: new Date('2025-11-20'), dynamicThreshold: 30 },
    { code: 'PRD-037', quantity: 450,  costPrice: 28000, sellingPrice: 38000,  expirationDate: new Date('2025-08-15'), dynamicThreshold: 40 },
    { code: 'PRD-038', quantity: 1200, costPrice: 19000, sellingPrice: 27000,  expirationDate: new Date('2026-09-30'), dynamicThreshold: 100 },

    { code: 'PRD-039', quantity: 700,  costPrice: 22000, sellingPrice: 31000,  expirationDate: null,                 dynamicThreshold: 50 },
    { code: 'PRD-040', quantity: 1500, costPrice: 17000, sellingPrice: 24000,  expirationDate: null,                 dynamicThreshold: 100 },
    { code: 'PRD-041', quantity: 600,  costPrice: 88000, sellingPrice: 115000, expirationDate: null,                 dynamicThreshold: 50 },
    { code: 'PRD-042', quantity: 500,  costPrice: 72000, sellingPrice: 96000,  expirationDate: null,                 dynamicThreshold: 40 },
    { code: 'PRD-043', quantity: 1200, costPrice: 55000, sellingPrice: 72000,  expirationDate: null,                 dynamicThreshold: 80 },

    { code: 'PRD-044', quantity: 600,  costPrice: 95000, sellingPrice: 130000, expirationDate: new Date('2027-05-15'), dynamicThreshold: 50 },
    { code: 'PRD-045', quantity: 800,  costPrice: 84000, sellingPrice: 112000, expirationDate: new Date('2027-04-30'), dynamicThreshold: 60 },
    { code: 'PRD-046', quantity: 1500, costPrice: 23000, sellingPrice: 32000,  expirationDate: new Date('2026-12-15'), dynamicThreshold: 100 },
    { code: 'PRD-047', quantity: 1000, costPrice: 11000, sellingPrice: 17000,  expirationDate: null,                 dynamicThreshold: 100 },
    { code: 'PRD-048', quantity: 400,  costPrice: 68000, sellingPrice: 92000,  expirationDate: new Date('2027-03-31'), dynamicThreshold: 30 },
    { code: 'PRD-049', quantity: 1200, costPrice: 9000,  sellingPrice: 14000,  expirationDate: new Date('2026-10-31'), dynamicThreshold: 80 },
    { code: 'PRD-050', quantity: 500,  costPrice: 19000, sellingPrice: 28000,  expirationDate: null,                 dynamicThreshold: 45 },
  ];

  // Insert to Main Warehouse (locationId = 1)
  for (const inv of mainWarehouseInv) {
    const p = createdProducts.find(x => x.code === inv.code);
    if (p) {
      await prisma.inventory.upsert({
        where: {
          locationId_productId_expirationDate: {
            locationId: 1,
            productId: p.id,
            expirationDate: inv.expirationDate || new Date('1970-01-01') // Prisma exactOptionalPropertyTypes fallback for compound unique index
          }
        },
        update: {
          quantity: inv.quantity,
          costPrice: inv.costPrice,
          sellingPrice: inv.sellingPrice,
          dynamicThreshold: inv.dynamicThreshold
        },
        create: {
          locationId: 1,
          productId: p.id,
          quantity: inv.quantity,
          costPrice: inv.costPrice,
          sellingPrice: inv.sellingPrice,
          expirationDate: inv.expirationDate,
          dynamicThreshold: inv.dynamicThreshold
        }
      });
    }
  }

  // 4. Seed Inventory for Branch Store A (locationId = 2)
  const storeAInv = [
    { code: 'PRD-011', quantity: 150, costPrice: 7200, sellingPrice: 10000, expirationDate: new Date('2026-06-30'), dynamicThreshold: 20 },
    { code: 'PRD-013', quantity: 80,  costPrice: 6000, sellingPrice: 9000,  expirationDate: new Date('2026-02-28'), dynamicThreshold: 10 },
    { code: 'PRD-019', quantity: 120, costPrice: 11000, sellingPrice: 16000, expirationDate: new Date('2025-12-15'), dynamicThreshold: 20 },
    { code: 'PRD-026', quantity: 400, costPrice: 2800,  sellingPrice: 4000,  expirationDate: new Date('2026-11-30'), dynamicThreshold: 50 },
    { code: 'PRD-034', quantity: 90,  costPrice: 11000, sellingPrice: 16000, expirationDate: new Date('2027-02-28'), dynamicThreshold: 15 },
    { code: 'PRD-040', quantity: 60,  costPrice: 17000, sellingPrice: 24000, expirationDate: null,                 dynamicThreshold: 10 },
  ];

  for (const inv of storeAInv) {
    const p = createdProducts.find(x => x.code === inv.code);
    if (p) {
      await prisma.inventory.upsert({
        where: {
          locationId_productId_expirationDate: {
            locationId: 2,
            productId: p.id,
            expirationDate: inv.expirationDate || new Date('1970-01-01')
          }
        },
        update: {
          quantity: inv.quantity,
          costPrice: inv.costPrice,
          sellingPrice: inv.sellingPrice,
          dynamicThreshold: inv.dynamicThreshold
        },
        create: {
          locationId: 2,
          productId: p.id,
          quantity: inv.quantity,
          costPrice: inv.costPrice,
          sellingPrice: inv.sellingPrice,
          expirationDate: inv.expirationDate,
          dynamicThreshold: inv.dynamicThreshold
        }
      });
    }
  }

  // 5. Seed Inventory for Branch Store B (locationId = 3)
  const storeBInv = [
    { code: 'PRD-012', quantity: 120, costPrice: 7200, sellingPrice: 10000, expirationDate: new Date('2026-06-30'), dynamicThreshold: 20 },
    { code: 'PRD-015', quantity: 70,  costPrice: 9500, sellingPrice: 14000, expirationDate: new Date('2027-01-01'), dynamicThreshold: 10 },
    { code: 'PRD-026', quantity: 300, costPrice: 2800,  sellingPrice: 4000,  expirationDate: new Date('2026-11-30'), dynamicThreshold: 50 },
    { code: 'PRD-035', quantity: 50,  costPrice: 18000, sellingPrice: 26000, expirationDate: new Date('2025-02-15'), dynamicThreshold: 10 },
    { code: 'PRD-043', quantity: 40,  costPrice: 55000, sellingPrice: 72000, expirationDate: null,                 dynamicThreshold: 8 },
  ];

  for (const inv of storeBInv) {
    const p = createdProducts.find(x => x.code === inv.code);
    if (p) {
      await prisma.inventory.upsert({
        where: {
          locationId_productId_expirationDate: {
            locationId: 3,
            productId: p.id,
            expirationDate: inv.expirationDate || new Date('1970-01-01')
          }
        },
        update: {
          quantity: inv.quantity,
          costPrice: inv.costPrice,
          sellingPrice: inv.sellingPrice,
          dynamicThreshold: inv.dynamicThreshold
        },
        create: {
          locationId: 3,
          productId: p.id,
          quantity: inv.quantity,
          costPrice: inv.costPrice,
          sellingPrice: inv.sellingPrice,
          expirationDate: inv.expirationDate,
          dynamicThreshold: inv.dynamicThreshold
        }
      });
    }
  }

  console.log('Prisma seeding completed successfully!');
}

seed()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
