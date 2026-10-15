var stores = [
  { id: 'victoria', name: "Victoria's Secret", logo: 'images/stores/victoria.jpg', logoBg: '#F9C9CB', color: '#D45060', cats: 'Beauty & care', desc: 'Fragrance, body care and gift sets.' },
  { id: 'smartbuy', name: 'Smart Buy', logo: 'images/stores/smartbuy.png', logoBg: '#FFFFFF', color: '#F2C230', cats: 'Electronics & home appliances', desc: 'Phones, gadgets and home appliances.' },
  { id: 'onlybrands', name: 'Only Brands', logo: 'images/stores/onlybrands.png', logoBg: '#FFFFFF', color: '#800020', cats: 'Fashion', desc: 'Brand name bags, shoes and clothing.' },
  { id: 'leaders', name: 'Leaders Center', logo: 'images/stores/leaders.png', logoBg: '#A92B7C', color: '#C9973F', cats: 'Electronics & home appliances', desc: 'TVs, laptops and kitchen appliances.' }
];

var categories = [
  { name: 'Electronics & home appliances', icon: 'devices' },
  { name: 'Beauty & care', icon: 'spa' },
  { name: 'Fashion', icon: 'checkroom' }
];

var occasionsList = [
  { name: 'Birthday', icon: 'cake' },
  { name: 'Wedding', icon: 'favorite' },
  { name: 'Graduation', icon: 'school' },
  { name: 'Get well soon', icon: 'local_florist' },
  { name: 'Thank you', icon: 'volunteer_activism' },
  { name: 'Just because', icon: 'redeem' }
];

var wrappingOptions = [
  { id: 0, name: 'Classic kraft paper', price: 0 },
  { id: 1, name: 'Burgundy ribbon box', price: 3 },
  { id: 2, name: 'Luxury gift box', price: 5 }
];

var products = [
  { id: 'tease-sugar', name: 'Tease Sugar Fleur Eau de Parfum - 3.4 oz', sid: 'victoria', cat: 'Beauty & care', price: 85, delivery: 3, img: 'images/products/tease-sugar.jpg', specs: ['100 ml (3.4 oz)', 'Eau de parfum', 'Sweet floral scent'], occ: ['birthday', 'thank you', 'just because'], pop: 10, newest: 5 },
  { id: 'vanilla-lotion', name: 'Bare Sueded Vanilla Fine Fragrance Lotion', sid: 'victoria', cat: 'Beauty & care', price: 15, delivery: 3, img: 'images/products/vanilla-lotion.jpg', specs: ['Fine fragrance lotion', 'Sueded vanilla scent', 'For daily use'], occ: ['thank you', 'just because', 'get well soon'], pop: 5, newest: 9 },
  { id: 'mini-mist', name: '4-Piece Hair & Body Mini Mist Gift Set', sid: 'victoria', cat: 'Beauty & care', price: 45, delivery: 3, img: 'images/products/mini-mist.jpg', specs: ['4 mini mists', 'For hair and body', 'Comes as a gift set'], occ: ['birthday', 'thank you', 'just because'], pop: 6, newest: 10 },
  { id: 'airfryer', name: 'Black & Decker Air Fryer, 7.2Lit, 1800Watts, Black with Window', sid: 'smartbuy', cat: 'Electronics & home appliances', price: 120, delivery: 3, img: 'images/products/airfryer.png', specs: ['7.2 L capacity', '1800 W', 'Viewing window'], occ: ['wedding', 'birthday', 'thank you'], pop: 9, newest: 3 },
  { id: 'jbl', name: 'JBL Quantum 100 M2 Wired Gaming Headset — Blue', sid: 'smartbuy', cat: 'Electronics & home appliances', price: 45, delivery: 3, img: 'images/products/jbl.jpg', specs: ['Wired headset', 'Blue', 'Built-in microphone'], occ: ['birthday', 'graduation'], pop: 8, newest: 8 },
  { id: 'iphone', name: 'Apple iPhone 17 Pro, 256GB, Cosmic Orange', sid: 'smartbuy', cat: 'Electronics & home appliances', price: 1019, delivery: 0, img: 'images/products/iphone.jpg', specs: ['256 GB storage', 'Cosmic Orange', 'Pro camera system'], occ: ['graduation', 'birthday'], pop: 9, newest: 12 },
  { id: 'northface', name: 'The North Face 1996 Retro Down Puffer Jacket in Black', sid: 'onlybrands', cat: 'Fashion', price: 85, delivery: 3, img: 'images/products/northface.jpg', specs: ['Retro 1996 style', 'Down puffer jacket', 'Black'], occ: ['birthday', 'graduation'], pop: 6, newest: 7 },
  { id: 'dior', name: 'Dior Mini Lady D-Joy Bag in Olive Green', sid: 'onlybrands', cat: 'Fashion', price: 85, delivery: 3, img: 'images/products/dior.png', specs: ['Mini bag', 'Olive green', 'Shoulder strap'], occ: ['birthday', 'wedding'], pop: 8, newest: 6 },
  { id: 'adidas-bag', name: 'Adidas Casual Pink Bagpack Lelaki Wanita', sid: 'onlybrands', cat: 'Fashion', price: 25, delivery: 3, img: 'images/products/adidas-bag.webp', specs: ['Casual backpack', 'Pink', 'Unisex'], occ: ['graduation', 'just because'], pop: 4, newest: 11 },
  { id: 'nike', name: 'Nike Mind 002 Sneaker in Creamy', sid: 'onlybrands', cat: 'Fashion', price: 65, delivery: 3, img: 'images/products/nike.png', specs: ['Sneaker', 'Creamy', 'Everyday wear'], occ: ['birthday', 'graduation'], pop: 7, newest: 4 },
  { id: 'tcl', name: 'TCL TV screen 55″ QLED Smart', sid: 'leaders', cat: 'Electronics & home appliances', price: 349, delivery: 3, img: 'images/products/tcl.png', specs: ['55 inch screen', 'QLED', 'Smart TV'], occ: ['wedding', 'thank you'], pop: 6, newest: 2 },
  { id: 'hp', name: 'HP ProBook 4 Laptop, 16GB RAM, 512GB', sid: 'leaders', cat: 'Electronics & home appliances', price: 749, delivery: 0, img: 'images/products/hp.webp', specs: ['16 GB RAM', '512 GB storage', 'Business laptop'], occ: ['graduation'], pop: 5, newest: 1 },
  { id: 'krups', name: 'Krups Automatic Coffee Machine 1450W', sid: 'leaders', cat: 'Electronics & home appliances', price: 1199, delivery: 0, img: 'images/products/krups.webp', specs: ['Automatic', '1450 W', 'Coffee machine'], occ: ['wedding', 'birthday'], pop: 7, newest: 13 }
];

var people = [
  {
    username: 'zain.b', name: 'Zain Bondouq', followers: 128,
    occasions: [{ title: 'Birthday', days: 20 }, { title: 'Graduation', days: 45 }],
    items: [
      { pid: 'tease-sugar', occ: 'Birthday', mostWanted: true, status: 'open', funded: 30, people: 3, note: 'I love sweet floral scents.' },
      { pid: 'jbl', occ: 'Birthday', mostWanted: false, status: 'open', funded: 0, people: 0, note: '' },
      { pid: 'iphone', occ: 'Graduation', mostWanted: true, status: 'open', funded: 400, people: 5, note: 'My phone is falling apart.' },
      { pid: 'vanilla-lotion', occ: 'Birthday', mostWanted: false, status: 'funded', funded: 18, people: 2, note: '' },
      { pid: 'nike', occ: 'Graduation', mostWanted: false, status: 'bought', funded: 68, people: 1, note: '' }
    ]
  },
  {
    username: 'ahmad.n', name: 'Ahmad Nairat', followers: 64,
    occasions: [{ title: 'Wedding', days: 60 }],
    items: [
      { pid: 'krups', occ: 'Wedding', mostWanted: true, status: 'open', funded: 500, people: 4, note: 'We want a proper coffee corner at home.' },
      { pid: 'airfryer', occ: 'Wedding', mostWanted: false, status: 'open', funded: 0, people: 0, note: '' },
      { pid: 'tcl', occ: 'Wedding', mostWanted: false, status: 'open', funded: 120, people: 1, note: '' }
    ]
  },
  {
    username: 'saba.i', name: 'Saba Izraqi', followers: 41,
    occasions: [{ title: 'Birthday', days: 2 }],
    items: [
      { pid: 'dior', occ: 'Birthday', mostWanted: true, status: 'open', funded: 30, people: 2, note: 'Olive green is my favourite color.' },
      { pid: 'mini-mist', occ: 'Birthday', mostWanted: false, status: 'open', funded: 0, people: 0, note: '' },
      { pid: 'northface', occ: 'Birthday', mostWanted: false, status: 'open', funded: 15, people: 1, note: '' },
      { pid: 'adidas-bag', occ: 'Birthday', mostWanted: false, status: 'bought', funded: 28, people: 1, note: '' }
    ]
  }
];

var helpAnswers = [
  { q: 'How does group gifting work?', a: 'Pick "Gift part of it" and choose any amount. When the total reaches the goal, we wrap the item and deliver it. If it is not fully funded by the date, every gift becomes ToGift credit for the person.' },
  { q: 'Can I send a gift anonymously?', a: 'Yes. Turn on "Send anonymously" at checkout. The person will see "Someone special" instead of your name. You can choose to reveal your name after delivery.' },
  { q: 'How do I earn points?', a: 'You earn 1 point for every JOD you pay when you are logged in. 100 points are worth 1 JOD off at checkout.' },
  { q: 'Where is my order?', a: 'Open My orders from your profile menu and press "Track order". Guests can use the link in the receipt.' },
  { q: 'Do you deliver outside Amman?', a: 'Yes, our delivery partner delivers inside and outside Amman. Delivery fees are shown on every product.' }
];

