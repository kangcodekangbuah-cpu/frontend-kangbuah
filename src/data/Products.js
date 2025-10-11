// Lokasi: src/data/products.js

// Gunakan data yang paling lengkap (dengan harga dan unit)
export const products = {
    vegetables: [
        { id: 1, name: "Wortel 1kg", image: "src\assets\kiwi.jpg", price: 15000, unit: "1kg" },
        { id: 2, name: "Kentang 5kg", image: "src\assets\kiwi.jpg", price: 45000, unit: "5kg" },
        { id: 3, name: "Tomat 1kg", image: "src\assets\kiwi.jpg", price: 12000, unit: "1kg" },
        { id: 4, name: "Brokoli 1kg", image: "/src\assets\kiwi.jpg", price: 25000, unit: "1kg" },
        { id: 5, name: "Cabe Merah Keriting", image: "src\assets\kiwi.jpg", price: 35000, unit: "1kg" },
        { id: 6, name: "Cabe Merah Besar", image: "/large-red-chili-peppers.jpg", price: 40000, unit: "1kg" },
        { id: 7, name: "Paprika Merah/Kuning", image: "/red-and-yellow-bell-peppers.jpg", price: 28000, unit: "1kg" },
        { id: 8, name: "Kol Putih", image: "/white-cabbage.jpg", price: 8000, unit: "1kg" },
        { id: 9, name: "Kembang Kol Impor", image: "/fresh-cauliflower.jpg", price: 22000, unit: "1kg" },
        { id: 10, name: "Jamur Champignon", image: "/white-button-mushrooms.png", price: 35000, unit: "500g" },
        { id: 11, name: "Wortel Baby", image: "/fresh-carrots.png", price: 18000, unit: "500g" },
        { id: 12, name: "Kentang Merah", image: "/fresh-potatoes.png", price: 20000, unit: "1kg" },
        { id: 13, name: "Brokoli Organik", image: "/fresh-broccoli.png", price: 35000, unit: "1kg" },
        { id: 14, name: "Cabe Rawit Hijau", image: "/small-red-chili-peppers.jpg", price: 45000, unit: "1kg" },
        { id: 15, name: "Paprika Hijau", image: "/red-and-yellow-bell-peppers.jpg", price: 25000, unit: "1kg" },
    ],
    fruits: [
        { id: 16, name: "Semangka Non Biji", image: "/seedless-watermelon.jpg", price: 25000, unit: "1 buah" },
        { id: 17, name: "Melon Sky Rocket", image: "/cantaloupe-melon.png", price: 35000, unit: "1 buah" },
        { id: 18, name: "Pepaya Kalifornia", image: "/california-papaya-fruit.jpg", price: 15000, unit: "1 buah" },
        { id: 19, name: "Nanas Sunpride", image: "/fresh-pineapple.jpg", price: 20000, unit: "1 buah" },
        { id: 20, name: "Pisang Sunpride", image: "/fresh-bananas.jpg", price: 18000, unit: "1 sisir" },
    ],
    special: [
        { id: 21, name: "Beras Premium", image: "/white-rice-grains.jpg", price: 85000, unit: "5kg" },
        { id: 22, name: "Minyak Goreng", image: "/cooking-oil-bottle.png", price: 45000, unit: "2L" },
        { id: 23, name: "Ayam Boiler", image: "/fresh-chicken.png", price: 35000, unit: "1kg" },
        { id: 24, name: "Telur Ayam Negeri", image: "/fresh-chicken-eggs.jpg", price: 28000, unit: "1kg" },
    ],
};

// Buat satu array kategori yang bisa dipakai di mana saja
export const categories = [
    { id: "fruits", name: "Buah-buahan", count: products.fruits.length },
    { id: "vegetables", name: "Sayuran", count: products.vegetables.length },
    { id: "special", name: "Permintaan Khusus", count: products.special.length },
];