// Generates 540 unique, realistic, richly structured product records across 18 verified categories.
import fs from 'node:fs';
import path from 'node:path';

const CATEGORIES = [
  { id: 'mobiles', name: 'Smartphones & Mobiles' },
  { id: 'computing', name: 'Laptops & Computers' },
  { id: 'electronics', name: 'Electronics & Audio' },
  { id: 'fashion-men', name: 'Luxury Menswear' },
  { id: 'fashion-women', name: 'Haute Couture (Women)' },
  { id: 'footwear', name: 'Footwear & Sneakers' },
  { id: 'watches', name: 'Watches & Timepieces' },
  { id: 'jewellery', name: 'Fine Jewellery' },
  { id: 'beauty', name: 'Beauty & Personal Care' },
  { id: 'luggage', name: 'Bags & Luggage' },
  { id: 'furniture', name: 'Furniture & Home Decor' },
  { id: 'appliances', name: 'Home Appliances' },
  { id: 'kitchen', name: 'Kitchen & Dining' },
  { id: 'sports', name: 'Sports & Fitness' },
  { id: 'grocery', name: 'Grocery & Essentials' },
  { id: 'books', name: 'Books & Stationery' },
  { id: 'toys', name: 'Toys & Gaming' },
  { id: 'automotive', name: 'Automotive Accessories' }
];

const BRANDS_BY_CAT = {
  'mobiles': ['Apple', 'Samsung Galaxy', 'Google Pixel', 'OnePlus', 'Nothing Tech', 'Sony Xperia', 'Xiaomi Ultra', 'Verve Tech'],
  'computing': ['Apple', 'Dell XPS', 'ASUS ROG', 'Lenovo ThinkPad', 'Razer', 'HP Spectre', 'Microsoft Surface', 'Corsair'],
  'electronics': ['Nova Acoustics', 'Sony', 'Bose', 'Sennheiser', 'Bang & Olufsen', 'Bowers & Wilkins', 'Devialet', 'Shure'],
  'fashion-men': ['Brunello Cucinelli', 'Zegna', 'Tom Ford', 'Loro Piana', 'Ralph Lauren Purple', 'Canali', 'Brioni', 'Sartoria Milano'],
  'fashion-women': ['Prada', 'Saint Laurent', 'Gucci', 'Chanel Haute', 'Bottega Veneta', 'Dior Couture', 'Valentino', 'Maison Margiela'],
  'footwear': ['Christian Louboutin', 'Nike Air Jordan', 'Berluti', 'Golden Goose', 'John Lobb', 'Balenciaga', 'Ferragamo', 'Adidas Originals'],
  'watches': ['Rolex', 'Omega', 'Audemars Piguet', 'Patek Philippe', 'TAG Heuer', 'IWC Schaffhausen', 'Cartier', 'Apex Horology'],
  'jewellery': ['Cartier', 'Tiffany & Co.', 'Bulgari', 'Van Cleef & Arpels', 'Harry Winston', 'Chopard', 'Boucheron', 'Graff'],
  'beauty': ['Tom Ford Beauty', 'La Mer', 'Diptyque', 'Byredo', 'Le Labo', 'SK-II', 'Aesop', 'Maison De Nuit'],
  'luggage': ['Rimowa', 'Tumi', 'Louis Vuitton', 'Montblanc', 'Goyard', 'Globe-Trotter', 'Samsonite Black', 'Bellroy'],
  'furniture': ['Herman Miller', 'Poltrona Frau', 'B&B Italia', 'Cassina', 'Roche Bobois', 'Vitra', 'Minotti', 'Atelier Casa'],
  'appliances': ['Dyson', 'Miele', 'Philips Hue', 'B&O Home', 'Smeg', 'De\'Longhi', 'LG Signature', 'Aura Living'],
  'kitchen': ['Le Creuset', 'KitchenAid Pro', 'Breville', 'Zwilling', 'Vitamix', 'Mauviel 1830', 'Staub', 'Wüsthof'],
  'sports': ['Specialized', 'Trek', 'Rapha', 'Garmin', 'Technogym', 'Nike Pro', 'Assos', 'AeroStrata'],
  'grocery': ['Fortnum & Mason', 'Harrods Reserve', 'Alba Truffles', 'TWG Tea', 'Kaviari Caviar', 'Valrhona', 'Iberico Real', 'Sanctuary Gourmet'],
  'books': ['Taschen Art', 'Assouline Luxury', 'Rizzoli International', 'Montblanc Heritage', 'Moleskine', 'Phaidon', 'Smythson', 'Faber-Castell'],
  'toys': ['Lego Collector', 'PlayStation', 'Nintendo Switch', 'Valve Index', 'Hot Wheels Elite', 'Hasbro Masterpiece', 'Steiff', 'Bandai Spirits'],
  'automotive': ['Porsche Design', 'Garmin Drive', 'Brembo', 'Michelin Pilot', 'Thule Sweden', 'Alcantara Custom', 'Anker Roav', 'Bespoke Auto']
};

const PHOTO_POOLS = {
  'mobiles': [
    'photo-1598327105666-5b89351aff97', 'photo-1511707171634-5f897ff02aa9', 'photo-1580910051074-3eb694886505',
    'photo-1565849904461-04a58ad377e0', 'photo-1592899677977-9c10ca588bbd', 'photo-1575695342320-d2d2d2f9b73f',
    'photo-1567581935884-3349723552ca', 'photo-1512499617640-c74ae3a79d37', 'photo-1585060544812-6b45742d762f',
    'photo-1591337676887-a217a6970a8a', 'photo-1510557880182-3d4d3cba35a5', 'photo-1546054454-aa26e2b734c7'
  ],
  'computing': [
    'photo-1517336714731-489689fd1ca8', 'photo-1496181133206-80ce9b88a853', 'photo-1525547719571-a2d4ac8945e2',
    'photo-1588872657578-7efd1f1555ed', 'photo-1611186871348-b1ce696e52c9', 'photo-1541807084-5c52b6b3adef',
    'photo-1587829741301-dc798b83add3', 'photo-1593642632823-8f785ba67e45', 'photo-1603302576837-37561b2e2302',
    'photo-1516321318423-f06f85e504b3', 'photo-1527443224154-c4a3942d3acf', 'photo-1550745165-9bc0b252726f'
  ],
  'electronics': [
    'photo-1505740420928-5e560c06d30e', 'photo-1546435770-a3e426bf472b', 'photo-1484704849700-f032a568e944',
    'photo-1583394838336-acd977736f90', 'photo-1590658268037-6bf12165a8df', 'photo-1572536147248-ac59a8abfa4b',
    'photo-1545127398-14699f92334b', 'photo-1524678606370-a47ad25cb82a', 'photo-1511379938547-c1f69419868d',
    'photo-1517694712202-14dd9538aa97', 'photo-1518709268805-4e9042af9f23', 'photo-1543512214-318c7553f230'
  ],
  'fashion-men': [
    'photo-1539571696357-5a69c17a67c6', 'photo-1507679799987-c73779587ccf', 'photo-1490114538077-0a7f8cb49891',
    'photo-1594938298603-c8148c4dae35', 'photo-1617137984095-74e4e5e3613f', 'photo-1617127365659-c47fa864d8bc',
    'photo-1520975954732-35dd22299614', 'photo-1504593811423-6dd665756598', 'photo-1548883354-7622d03aca27',
    'photo-1516257984-b1b4d707412e', 'photo-1544441893-675973e31985', 'photo-1521572267360-ee0c2909d518'
  ],
  'fashion-women': [
    'photo-1490481651871-ab68de25d43d', 'photo-1515886657613-9f3515b0c78f', 'photo-1539109136881-3be0616acf4b',
    'photo-1509631179647-0177331693ae', 'photo-1566174053879-31528523f8ae', 'photo-1529139574466-a303027c1d8b',
    'photo-1558769132-cb1aea458c5e', 'photo-1572804013309-59a88b7e92f1', 'photo-1496747611176-843222e1e57c',
    'photo-1502716119720-b23a93e5fe1b', 'photo-1583391733956-3750e0ff4e8b', 'photo-1534528741775-53994a69daeb'
  ],
  'footwear': [
    'photo-1549298916-b41d501d3772', 'photo-1525966222134-fcfa99b8ae77', 'photo-1560769629-975ec94e6a86',
    'photo-1595950653106-6c9ebd614d3a', 'photo-1584735935682-2f2b69dff9d2', 'photo-1512374382149-233c42b661ac',
    'photo-1543163521-1bf539c55dd2', 'photo-1515955656352-a1fa3ffcd111', 'photo-1608231387042-66d1773070a5',
    'photo-1539185441755-769473a23570', 'photo-1551107696-a4b085a6d960', 'photo-1582588678413-dbf45f4823e9'
  ],
  'watches': [
    'photo-1523275335684-37898b6baf30', 'photo-1524805444758-089113d48a6d', 'photo-1547996160-71dfabbce5fa',
    'photo-1533139502658-0198f920d8e8', 'photo-1509042239860-f550ce710b93', 'photo-1522335789203-aabd1fc54bc9',
    'photo-1508057198894-247b23fe5ade', 'photo-1542496658-e33a6d0d50f6', 'photo-1526045612212-70caf35c14df',
    'photo-1548036328-c9fa89d128fa', 'photo-1539185441755-769473a23570', 'photo-1509042239860-f550ce710b93'
  ],
  'jewellery': [
    'photo-1515562141207-7a88fb7ce338', 'photo-1599643478518-a784e5dc4c8f', 'photo-1605100804763-247f67b3557e',
    'photo-1600003014755-ba31aa59c4b6', 'photo-1535632066927-ab7c9ab60908', 'photo-1602751584552-8ba73aad10e1',
    'photo-1598560917505-59a3ad559071', 'photo-1611591475281-918bf8d67287', 'photo-1603561591411-07134e71a2a9',
    'photo-1588444837495-c6cfeb53f32d', 'photo-1617038220319-276d3cfab638', 'photo-1617038260897-41a1f14a8ca0'
  ],
  'beauty': [
    'photo-1522335789203-aabd1fc54bc9', 'photo-1592945403244-b3fbafd7f539', 'photo-1527799820374-dcf8d9d4a388',
    'photo-1571781926291-c477ebfd024b', 'photo-1535585209827-a15fcdbc4c2d', 'photo-1556228720-195a672e8a03',
    'photo-1608248597359-281b997c4146', 'photo-1584308666744-24d5c474f2ae', 'photo-1598440947619-2c35fc9aa908',
    'photo-1616683693504-3ea7e9ad6fec', 'photo-1563178406-4cdc2923acbc', 'photo-1596462502278-27bfdc403348'
  ],
  'luggage': [
    'photo-1553062407-98eeb64c6a62', 'photo-1548036328-c9fa89d128fa', 'photo-1581605405669-fcdf81165afa',
    'photo-1578632767115-351597cf2477', 'photo-1565084888279-aca607ecce0c', 'photo-1584917865442-de89df76afd3',
    'photo-1553062407-98eeb64c6a62', 'photo-1590874103328-eac38a683ce7', 'photo-1544816155-12df9643f363',
    'photo-1581605405669-fcdf81165afa', 'photo-1548036328-c9fa89d128fa', 'photo-1565084888279-aca607ecce0c'
  ],
  'furniture': [
    'photo-1555041469-a586c61ea9bc', 'photo-1586023492125-27b2c045efd7', 'photo-1567538096630-e0c55bd6374c',
    'photo-1538688525198-9b88f6f53126', 'photo-1505691938895-1758d7feb511', 'photo-1524758631624-e2822e304c36',
    'photo-1550254478-ead40cc54513', 'photo-1493663284031-b7e3aefcae8e', 'photo-1540574163026-643ea20ade25',
    'photo-1519974719765-e6559eac2575', 'photo-1507473885765-e6ed057f782c', 'photo-1486406146926-c627a92ad1ab'
  ],
  'appliances': [
    'photo-1585338107529-13afc5f02586', 'photo-1556911220-e15b29be8c8f', 'photo-1574269909862-7e1d70bb8078',
    'photo-1584269600464-37b1b58a9fe7', 'photo-1558618666-fcd25c85cd64', 'photo-1544457070-4cd773b4d71e',
    'photo-1513694203232-719a280e022f', 'photo-1585659722983-3a675dabf23d', 'photo-1584992236310-6edddc08acff',
    'photo-1507473885765-e6ed057f782c', 'photo-1517248135467-4c7edcad34c4', 'photo-1583847268964-b28dc8f51f92'
  ],
  'kitchen': [
    'photo-1556911220-e15b29be8c8f', 'photo-1588854337221-4cf9fa96059c', 'photo-1584269600464-37b1b58a9fe7',
    'photo-1590794056226-79ef3a8147e1', 'photo-1584992236310-6edddc08acff', 'photo-1578749556568-bc2c40e68b61',
    'photo-1556909212-d5b604d0c90d', 'photo-1507089947368-19c1da9775ae', 'photo-1556911073-38141963c9e0',
    'photo-1544816155-12df9643f363', 'photo-1590794056226-79ef3a8147e1', 'photo-1584269600464-37b1b58a9fe7'
  ],
  'sports': [
    'photo-1485965120184-e220f721d03e', 'photo-1517838277536-f5f99be501cd', 'photo-1584735935682-2f2b69dff9d2',
    'photo-1571019614242-c5c5dee9f50b', 'photo-1517649763962-0c623266ddc0', 'photo-1526506118085-60ce8714f8c5',
    'photo-1534438327276-14e5300c3a48', 'photo-1576678927484-cc907957088c', 'photo-1540497077202-7c8a3999166f',
    'photo-1517838277536-f5f99be501cd', 'photo-1584735935682-2f2b69dff9d2', 'photo-1485965120184-e220f721d03e'
  ],
  'grocery': [
    'photo-1542838132-92c53300491e', 'photo-1615485500704-8e990f9900f7', 'photo-1509358271058-acd22cc93898',
    'photo-1514733670139-4d87a1941d55', 'photo-1563245372-f21724e3856d', 'photo-1579722820308-d74e571900a9',
    'photo-1546548970-71785318a17b', 'photo-1589301760014-d929f3979dbc', 'photo-1596040033229-a9821ebd058d',
    'photo-1513558161293-cdaf765ed2fd', 'photo-1550583724-b2692b85b150', 'photo-1509440159596-0249088772ff'
  ],
  'books': [
    'photo-1544947950-fa07a98d237f', 'photo-1512820790803-83ca734da794', 'photo-1497633762265-9d179a990aa6',
    'photo-1495446815901-a7297e633e8d', 'photo-1524995997946-a1c2e315a42f', 'photo-1532012164546-f432f2e37262',
    'photo-1476275466078-4007374efbbe', 'photo-1516979187457-637abb4f9353', 'photo-1506880018603-83d5b814b5a6',
    'photo-1519682337058-a94d519337bc', 'photo-1491841573634-28140fc7ced7', 'photo-1457369804613-52c61a468e7d'
  ],
  'toys': [
    'photo-1612287270302-39f4f346b0d1', 'photo-1558060370-d644479cb6f7', 'photo-1566576912321-d58ddd7a6088',
    'photo-1596461404969-9ae70f2830c1', 'photo-1531346878377-a5be20888e57', 'photo-1515488042361-ee00e0ddd4e4',
    'photo-1560963805-6c646626ab91', 'photo-1587654780291-39c9404d746b', 'photo-1585366119957-e9730b6d0f60',
    'photo-1534447677768-be436bb09401', 'photo-1600080972464-8e5f35f63d08', 'photo-1550745165-9bc0b252726f'
  ],
  'automotive': [
    'photo-1503376780353-7e6692767b70', 'photo-1492144534655-ae79c964c9d7', 'photo-1552519507-da3b142c6e3d',
    'photo-1549399542-7e3f8b79c341', 'photo-1583121274602-3e2820c69888', 'photo-1511919884226-fd3cad34687c',
    'photo-1541348263662-e0c8de4259ba', 'photo-1542282088-72c9c27ed0cd', 'photo-1502877338535-766e1452684a',
    'photo-1514316454349-750a7fd3da3a', 'photo-1563720223185-11003d516935', 'photo-1533473359331-0135ef1b58bf'
  ]
};

const TITLES_BY_CAT = {
  'mobiles': [
    'Cyber-OLED Ultra Smartphone (16GB+512GB)', 'Titanium Horizon Flagship Phone (1TB)', 'MagFlux Magnetic Qi2 Wireless Station',
    'Kevlar Armor Drop-Proof Case for Flagship', 'Nova Smart Ring Health & Sleep Tracker', 'LensPro Optical 10x Periscope Mobile Lens',
    'HyperCharge 140W GaN Travel Brick', 'AeroGrip Magnetic Wallet & Kickstand', 'Pulse Smart Band Pro with AMOLED',
    'Sapphire Glass Screen Shield (Anti-Glare)', 'Verve Wireless Earbuds (Active Noise Canceling)', 'CyberCharge 25000mAh Laptop Power Bank',
    'Nova Horizon Foldable OLED Smartphone', 'AeroTag GPS Precision Tracker (4-Pack)', 'Nova Streamer Mobile Vlog Rig & Gimbal'
  ],
  'computing': [
    'Zenith 16 Pro Creator Laptop (OLED 4K)', 'Vanguard Aero 14 Carbon Ultrabook', 'Apex Titan Mechanical Gaming Keyboard',
    'Horizon 34-Inch Curved QD-OLED Monitor', 'Velocity Thunderbolt 4 Docking Station', 'Masterwork CNC Aluminum Keycap Set',
    'Phantom Wireless Ergonomic Mouse (4000DPI)', 'Orbit 4K Ultra-Low Latency Webcam', 'AeroPad Precision Glass Mousemat',
    'CyberDesk Integrated USB-C Hub Riser', 'Titan NVMe Gen5 4TB Portable SSD', 'Infinity 27-Inch 240Hz Esports Display',
    'Nova Arcane RGB Linear Switch Keyboard', 'Vertex Ultra-Slim Magnesium Laptop', 'Spectrum Dual-Arm Monitor Gas Mount'
  ],
  'electronics': [
    'Horizon Pro ANC Spatial Wireless Headphones', 'Acoustic Signature Studio Monitor', 'Vortex Lossless Earbuds with Hi-Res LDAC',
    'SubZero Audiophile DAC & Headphone Amp', 'Nova Soundbar 7.1.4 Dolby Atmos', 'Eclipse Beryllium Wireless Earphones',
    'Quantum 4K Laser Ultra Projector', 'Symphony Solid Walnut Bookshelf Speakers', 'Omni Magnetic Planar Headphones',
    'Pulse 360 Waterproof Spatial Speaker', 'Titanium Micro DAC USB-C Interface', 'Master Soundstage Closed-Back Monitors',
    'Zenith Noise Isolating Carbon Earphones', 'Nova Streamer Pro Hi-Res Network Player', 'Aero ANC Foldable Travel Headset'
  ],
  'fashion-men': [
    'Sartorial Cashmere Overcoat with Silk Lining', 'Artisanal Double-Breasted Wool Blazer', 'Hand-Stitched Italian Calfskin Oxford Shoes',
    'Pure Mulberry Silk Jacquard Evening Tie', 'Supima Cotton Tailored Formal Shirt', 'Pleated Virgin Wool Flannel Trousers',
    'Handmade Full-Grain Leather Briefcase', 'Merino Wool Ribbed Turtleneck Sweater', 'Chelsea Boots in Hand-Burnished Suede',
    'Reversible Leather Belt with Brushed Brass', 'Bespoke Half-Canvas Navy Blazer', 'Hand-Rolled Linen & Silk Pocket Square',
    'Fine Gauge Sea Island Cotton Polo', 'Weatherproof Italian Trench Coat', 'Unlined Suede Driving Loafers with Gommino'
  ],
  'fashion-women': [
    'Atelier Silk Chiffon Evening Gown', 'Quilted Lambskin Chain Shoulder Bag', 'Handcrafted Pointed-Toe Suede Stilettos',
    'Double-Faced Cashmere Wrap Trench Coat', 'Pleated Georgette Floral Midi Dress', 'Artisanal Structured Leather Top-Handle Bag',
    'Silk Twill Hand-Rolled Heritage Scarf', 'Tailored Virgin Wool Hourglass Blazer', 'Italian Leather Slingback Kitten Heels',
    'Bespoke Velvet Cocktail Dress with Crystals', 'Monogram Jacquard Canvas Tote Bag', 'Fine Knit Cashmere Cardigan with Pearl Buttons',
    'Wide-Leg High-Waist Wool Trousers', 'Hand-Embroidered Evening Clutch Purse', 'Leather Ankle Boots with Sculpted Heel'
  ],
  'footwear': [
    'Italian Calfskin Hand-Painted Oxford Brogues', 'Minimalist Low-Top Sneaker in Nappa Leather', 'Chelsea Boots with Goodyear Welted Sole',
    'Sculpted Runway Platform Stiletto Pumps', 'Waterproof Trail Running Carbon Footwear', 'Handcrafted Suede Penny Loafers with Rubber Studs',
    'Retro Court Leather Heritage Trainers', 'Bespoke Double Monk Strap Italian Shoes', 'Chunky Leather Combat Boots with Lugged Sole',
    'Lightweight Carbon-Plated Marathon Runners', 'Equestrian Tall Riding Boots in Full Grain', 'Hand-Woven Raffia Summer Espadrilles'
  ],
  'watches': [
    'Apex Celestial Titanium Chronograph', 'Nautilus Deep Dive Automatic 300m', 'Heritage Perpetual Calendar Watch',
    'Tourbillon Skeleton Masterpiece 42mm', 'Rose Gold Dress Watch with Alligator Strap', 'Monaco Racing Automatic Chrono',
    'Pilot World-Timer UTC Titanium Chronometer', 'Ceramic Bezel GMT Dual Timezone Watch', 'Vintage Fluted Bezel Champagne Dial Watch',
    'Chronometer Grade 5 Open-Heart Automatic', 'Milano Minimalist Ultra-Thin Steel Watch', 'Grand Diver Bronze Case Patina Watch',
    'Lunar Phase Automatic Sapphire Watch', 'Sport Chrono with Integrated Rubber Strap', 'Art Deco Tonneau Case Hand-Wound Watch'
  ],
  'jewellery': [
    '18K Solid Gold Solitaire Diamond Ring', 'Handcrafted Tennis Bracelet in White Gold', 'Akoya Cultured Pearl Strand Necklace',
    'Emerald Cut Colombian Emerald Pendant', 'Pavé Diamond Huggie Earrings in Platinum', 'Twisted Cable Bangle in 18K Yellow Gold',
    'Sapphire & Diamond Halo Engagement Ring', 'Vintage Filigree Diamond Drop Earrings', 'Artisanal Rose Gold Stacking Bands (Set of 3)',
    'South Sea Golden Pearl Solitaire Ring', 'Baguette Diamond Choker in 18K Gold', 'Handmade Florentine Finish Gold Cuff',
    'Tanzanite Royal Cushion Cut Pendant', 'Diamond Eternity Band with Scalloped Edge', 'Bespoke Monogram Signet Ring (18K Gold)'
  ],
  'beauty': [
    '24K Gold Botanical Elixir & Fragrance', 'Bio-Active Ceramide Night Repair Cream', 'Artisanal Eau De Parfum: Oud & Bergamot',
    'Pure Damask Rose Hydrating Face Mist', 'Triple Peptide Firming Eye Serum', 'Cold-Pressed Marula Nutrient Facial Oil',
    'Velvet Matte Luxury Lipstick (Bespoke Red)', 'Enzyme Exfoliating Cellular Mask', 'Botanical Scented Soy Candle in Marble Vessel',
    'Ultrasonic Microcurrent Facial Sculptor', 'Niacinamide & Zinc Clarifying Essence', 'Baobab Restorative Hair Treatment Oil',
    'Silk Infused Hydrating Cushion Foundation', 'Pure Amber & Santal Extrait De Parfum', 'Illuminating Liquid Mineral Highlighter'
  ],
  'luggage': [
    'Original Aluminum Cabin Carry-On Spinner', 'Full-Grain Leather Weekender Duffle Bag', 'Waterproof Commuter Backpack (Ballistic Nylon)',
    'Check-In Large Polycarbonate Hard-Shell Luggage', 'Slim Leather Tech Folio & Document Case', 'Garment Suiter Bag with Leather Trims',
    'Modular Expandable Travel Backpack (35L)', 'Vintage Steamer Trunk with Brass Latches', 'Ultralight Foldable Ripstop Gym Duffle',
    'Passport & Travel Document Wallet in Calfskin', 'Rolling Business Briefcase with Laptop Sleeve', 'Heavy-Duty Water-Repellent Duffel (70L)'
  ],
  'furniture': [
    'Italian Velvet Ergonomic Lounge Chair', 'Solid American Walnut Round Dining Table', 'Nordic Minimalist Bouclé 3-Seater Sofa',
    'Sculptural Travertine Marble Coffee Table', 'Ergonomic Task Chair with Lumbar Support', 'Floating Solid Teak Bedside Table',
    'Brushed Brass & Smoked Glass Bookshelf', 'Hand-Knotted Organic Wool Area Rug (8x10)', 'Solid Ash Wood Dining Chairs (Set of 2)',
    'Mid-Century Modern Credenza Sideboard', 'Curved Velvet Chaise Lounge with Brass Base', 'Minimalist Black Oak Extendable Dining Table',
    'Artisanal Rattan & Walnut Accent Armchair', 'Marble Top Bistro Bar Table with Cast Base', 'Upholstered Platform Bed in Natural Linen'
  ],
  'appliances': [
    'Smart Supersonic Hair Dryer with Ionizer', 'Multi-Stage HEPA Air Purifier with Carbon Filter', 'Smart Cordless Stick Vacuum with Laser Sensor',
    'Robotic LiDAR Floor Cleaner with Auto Empty', 'Ceramic Oscillating Tower Heater & Cooler', 'Ultrasonic Smart Cool Mist Humidifier',
    'Compact Countertop Dishwasher with UV Sterilize', 'Smart Garment Steamer with Ceramic Soleplate', 'Dehumidifier with Smart Humidity Sensor (20L)',
    'Smart Wi-Fi Air Quality Monitor & Alarm', 'Countertop Ice Maker with Self-Cleaning Function', 'Smart Touchless Kitchen Faucet with Filter'
  ],
  'kitchen': [
    'Enameled Cast Iron Dutch Oven (6.7L)', 'Espresso Machine with Dual Thermo-Coil', 'Artisan 12-Piece German Steel Knife Block',
    'Multi-Ply 5-Layer Stainless Steel Skillet', 'Pro-Series High-Velocity Thermal Blender', 'Cold-Press Slow Masticating Juicer',
    'Handcrafted Japanese Damascus Santoku Knife', 'Cast Iron Reversible Stovetop Grill Pan', 'Electric Gooseneck Pour-Over Smart Kettle',
    'Non-Stick Ceramic Cookware Set (10-Piece)', 'Convection Countertop Smart Toaster Oven', 'Sous Vide Precision Immersion Cooker',
    'Handmade Marble Pestle & Mortar Set', 'Double-Walled French Press Coffee Maker', 'Heavy-Duty Planetary Stand Mixer (5.5L)'
  ],
  'sports': [
    'Carbon Fiber Ultralight Road Bike (6.8kg)', 'Magnetic Resistance Foldable Smart Treadmill', 'GPS Multisport Solar Titanium Watch',
    'Hydro-Formed Aluminum Gravel Bike', 'Adjustable Quick-Select Dumbbell Pair (32kg)', 'High-Density Non-Slip Natural Rubber Yoga Mat',
    'Pro Carbon Fiber Padel / Tennis Racket', 'Deep Tissue Percussion Muscle Massage Gun', 'Aero Helmet with Magnetic Eye Shield',
    'Polarized Cycling Performance Sunglasses', 'Waterproof Smart Hydration Backpack (12L)', 'Wireless Heart Rate Chest Strap Monitor',
    'Seamless Compression Running Leggings', 'Heavy-Duty Wall-Mounted Pull-Up Station', 'Ergonomic Rowing Machine with Water Resistance'
  ],
  'grocery': [
    'Reserve White Truffle Gourmet Oil & Salt', 'Single-Origin Ceremonial Grade Uji Matcha', 'Acorn-Fed 100% Ibérico Bellota Ham (100g)',
    'Aged 25-Year Traditional Balsamic of Modena', 'Wild Iranian Beluga Imperial Caviar (50g)', 'Artisan Single-Estate Extra Virgin Olive Oil',
    'Rare Manuka Honey MGO 850+ Raw Reserve', 'Handcrafted Belgian Grand Cru Pralines Box', 'Organic Himalayan Saffron Threads (5g)',
    'Artisanal French Fleur De Sel Sea Salt', 'Cold-Brew Reserve Arabica Coffee Beans (1kg)', 'Aged Parmigiano Reggiano DOP 36 Months',
    'Single-Origin Madagascar Bourbon Vanilla Pods', 'Raw Truffle Honey with Black Summer Truffles', 'Hand-Picked White Peony Imperial Tea (100g)'
  ],
  'books': [
    'The Complete Masterpieces of Architecture (Hardcover)', 'Bespoke Refillable Leather Journal with Handmade Paper', 'Collector Edition Illustrated Atlas of the World',
    'Artisanal Fountain Pen with 18K Gold Nib', 'Culinary Heritage of the Mediterranean (Slipcase)', 'Modern Art & Design Retrospective Monograph',
    'Solid Brass Mechanical Drafting Pencil (0.5mm)', 'Hand-Bound Botanical Watercolor Paper Sketchbook', 'Vintage Inkpot Set with Calligraphy Nibs',
    'The Fine Watchmaking Compendium (Limited Edition)', 'Japanese Washi Tape & Foil Stationery Luxury Gift Box', 'Italian Leather Executive Desk Pad & Blotter',
    'Chronicles of Haute Couture: 100 Years of Style', 'The Coffee Atlas & Roaster’s Handbook (Hardback)', 'Sculptural Solid Marble Bookends (Pair)'
  ],
  'toys': [
    'Collector Edition Architectural Landmark Building Set', 'Next-Gen VR Micro-OLED Gaming Headset', 'Handcrafted Solid Wood Heirloom Chess Set',
    'Die-Cast 1:18 Precision Hypercar Model', 'Mechanical Skeleton Clock Assembly Kit', 'Smart Interactive Robotic Companion',
    'Handmade Porcelain Collectible Doll in Silk Dress', 'Wireless Retro Arcade Console with Sanwa Controls', 'Astronomy 100mm Refractor Telescope with Tripod',
    'Wooden Balance Board for Toddlers & Kids', 'Remote-Controlled Carbon Fiber Racing Drone', 'Artisan Magnetic Wooden Block Construction Set',
    'Collector Vinyl Art Toy Figure (Limited Run)', 'Electronic Chessboard with Automated Opponent AI', 'Solar-Powered Mechanical Robot Engineering Lab'
  ],
  'automotive': [
    'Smart 4K Dual-Lens Dash Camera with Night Vision', 'Portable Tire Inflator & Battery Jump Starter', 'Custom Laser-Fit All-Weather Floor Mats (Full Set)',
    'MagSafe Wireless Charging Car Vent Mount (15W)', 'Ceramic Shield Nano Paint Coating Kit (50ml)', 'Ultrasonic Car Aromatherapy Diffuser in Matte Black',
    'Ergonomic Memory Foam Driver Lumbar Cushion', 'Heavy-Duty Waterproof Car Trunk Organizer & Cooler', 'Microfiber Luxury Detailing Towel Pack (12-Piece)',
    'OBD2 Bluetooth Vehicle Diagnostics Engine Scanner', 'Foldable Windshield Sunshade with UV Reflective Film', 'Car Seat Gap Storage Caddy in Full-Grain Leather',
    'Smart GPS Vehicle Anti-Theft Tracker (Real-Time)', 'Cordless High-Power Handheld Car Vacuum (9000Pa)', 'Premium Tire Pressure Monitoring System (TPMS Wireless)'
  ]
};

const makeCatalog = () => {
  const products = [];
  let idCounter = 1001;

  for (const cat of CATEGORIES) {
    const brands = BRANDS_BY_CAT[cat.id] || ['Nova Collection'];
    const photos = PHOTO_POOLS[cat.id] || ['photo-1505740420928-5e560c06d30e'];
    const titles = TITLES_BY_CAT[cat.id] || ['Luxury Product'];

    // Generate 30 unique items per category = 540 total items
    for (let i = 0; i < 30; i++) {
      const brand = brands[i % brands.length];
      const baseTitle = titles[i % titles.length];
      const edition = i >= 15 ? ` (Edition ${Math.floor(i / 5) + 1})` : '';
      const fullTitle = `${brand} ${baseTitle}${edition}`;

      const photoId = photos[i % photos.length];
      const photoId2 = photos[(i + 1) % photos.length];
      const photoId3 = photos[(i + 2) % photos.length];

      const thumbUrl = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=600&q=80`;
      const img2Url = `https://images.unsplash.com/${photoId2}?auto=format&fit=crop&w=600&q=80`;
      const img3Url = `https://images.unsplash.com/${photoId3}?auto=format&fit=crop&w=600&q=80`;

      // Deterministic prices
      const seed = (idCounter * 9301 + 49297) % 233280;
      const priceFactor = seed / 233280;

      let basePrice = 2499;
      if (['electronics', 'computing', 'mobiles', 'watches'].includes(cat.id)) {
        basePrice = 19999 + Math.floor(priceFactor * 140000);
      } else if (['jewellery', 'furniture', 'sports', 'luggage'].includes(cat.id)) {
        basePrice = 11999 + Math.floor(priceFactor * 110000);
      } else if (['fashion-men', 'fashion-women', 'footwear', 'kitchen', 'appliances', 'automotive'].includes(cat.id)) {
        basePrice = 3999 + Math.floor(priceFactor * 55000);
      } else {
        basePrice = 999 + Math.floor(priceFactor * 14000);
      }

      // Round price to 99 ending
      const price = Math.round(basePrice / 100) * 100 - 1;
      const discountPercent = 10 + Math.floor(priceFactor * 35);
      const originalPrice = Math.round((price / (1 - discountPercent / 100)) / 100) * 100 - 1;

      const rating = Number((4.2 + (priceFactor * 0.8)).toFixed(1));
      const reviewsCount = 20 + Math.floor(priceFactor * 2600);
      const stock = 4 + Math.floor(priceFactor * 45);

      const isFlashSale = i % 7 === 0;
      const isTrending = i % 5 === 0;
      const isBestSeller = i % 8 === 0;
      const isNew = i % 6 === 0;
      const isPrime = i % 2 === 0 || price > 4000;
      const deliveryTime = i % 4 === 0 ? 'Today by 9:00 PM' : i % 2 === 0 ? 'Tomorrow by 2:00 PM' : '2 Business Days';

      products.push({
        id: idCounter,
        title: fullTitle,
        brand,
        category: cat.id,
        price,
        originalPrice,
        discountPercentage: discountPercent,
        rating,
        reviewsCount,
        stock,
        isFlashSale,
        isTrending,
        isBestSeller,
        isNew,
        isPrimeDelivery: isPrime,
        deliveryTime,
        deliveryDays: (i % 3) + 1,
        description: `Experience exceptional artisanal precision and world-class performance with the ${fullTitle}. Designed to redefine benchmark standards with bespoke craftsmanship and genuine Nova Mall warranty.`,
        thumbnail: thumbUrl,
        images: [thumbUrl, img2Url, img3Url],
        specs: {
          "Brand": brand,
          "Department": cat.name,
          "Warranty": "2 Years Official Manufacturer Coverage",
          "Authenticity": "100% Genuine Certified Product",
          "Shipping": isPrime ? "Free Next-Day Delivery with Nova+ Prime" : "Standard Insured Shipping",
          "Returns": "7-Day Hassle-Free Doorstep Replacement"
        }
      });

      idCounter++;
    }
  }

  return products;
};

const catalog = makeCatalog();
console.log(`Generated ${catalog.length} unique products across ${CATEGORIES.length} verified categories.`);

// 1. Write data/products.json
const root = process.cwd();
const dataJsonPath = path.resolve(root, 'data', 'products.json');
fs.writeFileSync(dataJsonPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log(`Wrote data/products.json (${(fs.statSync(dataJsonPath).size / 1024).toFixed(1)} KB)`);

// 2. Write api/_lib/products.js
const apiProductsJs = `// Complete ${catalog.length} products catalog for Nova Mall Vercel API
import fs from 'node:fs';
import path from 'node:path';

let cachedCatalog = null;

export const getCatalog = () => {
  if (cachedCatalog) return cachedCatalog;
  try {
    const p = path.resolve(process.cwd(), 'data', 'products.json');
    if (fs.existsSync(p)) {
      cachedCatalog = JSON.parse(fs.readFileSync(p, 'utf8'));
      return cachedCatalog;
    }
  } catch (err) {
    console.error('Error reading catalog:', err);
  }
  return FALLBACK_SEED;
};

export const CATALOG_PRODUCTS = getCatalog();
`;
fs.writeFileSync(path.resolve(root, 'api', '_lib', 'products.js'), apiProductsJs, 'utf8');
console.log('Wrote api/_lib/products.js');

// 3. Write src/data/productsFallback.js
const fallbackJs = `// ${catalog.length} Products Fallback Catalog for Offline & Resilient Client Rendering
import rawCatalog from '../../data/products.json';

export const fallbackProducts = rawCatalog;
`;
fs.writeFileSync(path.resolve(root, 'src', 'data', 'productsFallback.js'), fallbackJs, 'utf8');
console.log('Wrote src/data/productsFallback.js');
