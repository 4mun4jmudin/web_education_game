// File: js/data.js

const GAME_DATA = {
  // Kategori ini bisa Anda tambah terus menerus
  categories: {
    animals: {
      displayName: "Animals",
      words: [
        { en: "Cat", id: "kucing" },
        { en: "Dog", id: "anjing" },
        { en: "Bird", id: "burung" },
        { en: "Fish", id: "ikan" },
        { en: "Duck", id: "bebek" },
        { en: "Horse", id: "kuda" },
        { en: "Cow", id: "sapi" },
        { en: "Sheep", id: "domba" },
        { en: "Elephant", id: "gajah" },
        { en: "Lion", id: "singa" },
        { en: "Tiger", id: "harimau" },
        { en: "Monkey", id: "monyet" },
      ],
    },
    fruits: {
      displayName: "Fruits",
      words: [
        { en: "Apple", id: "apel" },
        { en: "Banana", id: "pisang" },
        { en: "Orange", id: "jeruk" },
        { en: "Grape", id: "anggur" },
        { en: "Strawberry", id: "stroberi" },
        { en: "Watermelon", id: "semangka" },
        { en: "Pineapple", id: "nanas" },
        { en: "Mango", id: "mangga" },
      ],
    },
    objects: {
      displayName: "Objects in the house",
      words: [
        { en: "Table", id: "meja" },
        { en: "Chair", id: "kursi" },
        { en: "Book", id: "buku" },
        { en: "Door", id: "pintu" },
        { en: "Window", id: "jendela" },
        { en: "Bed", id: "kasur" },
        { en: "Lamp", id: "lampu" },
        { en: "Clock", id: "jam" },
      ],
    },
    transportation: {
      displayName: "Transportasi",
      words: [
        { en: "Car", id: "mobil" },
        { en: "Bus", id: "bis" },
        { en: "Train", id: "kereta" },
        { en: "Bicycle", id: "sepeda" },
        { en: "Motorcycle", id: "motor" },
        { en: "Airplane", id: "pesawat" },
        { en: "Ship", id: "kapal" },
        { en: "Boat", id: "perahu" },
      ],
    },
    verbs: {
      displayName: "Verbs",
      words: [
        { en: "Eat", id: "makan" },
        { en: "Drink", id: "minum" },
        { en: "Run", id: "lari" },
        { en: "Walk", id: "jalan" },
        { en: "Read", id: "membaca" },
        { en: "Write", id: "menulis" },
        { en: "Sleep", id: "tidur" },
        { en: "Play", id: "bermain" },
      ],
    },
    numbers: {
      displayName: "Numbers",
      words: [
        { en: "One", id: "1" },
        { en: "Two", id: "2" },
        { en: "Three", id: "3" },
        { en: "Four", id: "4" },
        { en: "Five", id: "5" },
        { en: "Six", id: "6" },
        { en: "Seven", id: "7" },
        { en: "Eight", id: "8" },
        { en: "Nine", id: "9" },
        { en: "Ten", id: "10" },
      ],
    },
    simpleSentences: {
      displayName: "Simple Sentences",
      words: [
        { en: "I see a red car" },
        { en: "She is reading a book" },
        { en: "He eats a yellow banana" },
        { en: "They walk to school" },
        { en: "The cat sleeps on the chair" },
        { en: "We play with a ball" },
      ],
    },
    colors: {
      displayName: "Colors",
      words: [
        // Basic Colors
        { en: "Red", id: "Merah" },
        { en: "Blue", id: "Biru" },
        { en: "Green", id: "Hijau" },
        { en: "Yellow", id: "Kuning" },
        { en: "Orange", id: "Jingga" },
        { en: "Purple", id: "Ungu" },
        { en: "Black", id: "Hitam" },
        { en: "White", id: "Putih" },
        { en: "Pink", id: "Merah Muda" },
        { en: "Brown", id: "Cokelat" },
        { en: "Gray", id: "Abu-abu" },
        { en: "Gold", id: "Emas" },
        { en: "Silver", id: "Perak" },
        { en: "Turquoise", id: "Pirus" },

        // Shades & Variants (English-Indonesian)
        { en: "Dark Red", id: "Merah Tua" },
        { en: "Light Blue", id: "Biru Muda" },
        { en: "Lime Green", id: "Hijau Limau" },
        { en: "Dark Green", id: "Hijau Gelap" },
        { en: "Sky Blue", id: "Biru Langit" },
        { en: "Navy Blue", id: "Biru Dongker" },
        { en: "Beige", id: "Krem" },
        { en: "Maroon", id: "Merah Marun" },
        { en: "Violet", id: "Violet" },
        { en: "Magenta", id: "Magenta" },
        { en: "Cyan", id: "Sian" },
        { en: "Indigo", id: "Nila" },
        { en: "Olive", id: "Zaitun" },
        { en: "Teal", id: "Teal" },
        { en: "Lavender", id: "Lavender" },
        { en: "Salmon", id: "Salmon" },
        { en: "Crimson", id: "Merah Crimson" },
        { en: "Ivory", id: "Gading" },
        { en: "Charcoal", id: "Arang" },
        { en: "Ruby", id: "Ruby" },
        { en: "Amber", id: "Amber" },
        { en: "Mint Green", id: "Hijau Mint" },
        { en: "Peach", id: "Persik" },
        { en: "Rose", id: "Merah Muda (Rose)" },
        { en: "Mustard", id: "Kuning Mustar" },
        { en: "Burgundy", id: "Burgundi" },
        { en: "Coral", id: "Koral" },
        { en: "Slate Gray", id: "Abu-abu Slate" },
      ],
    },
    shapes2D: {
      displayName: "2D Shapes",
      words: [
        // Basic Shapes
        { en: "Circle", id: "Lingkaran" },
        { en: "Square", id: "Persegi" },
        { en: "Triangle", id: "Segitiga" },
        { en: "Rectangle", id: "Persegi Panjang" },
        { en: "Oval", id: "Oval" },
        { en: "Diamond", id: "Belah Ketupat" },
        { en: "Star", id: "Bintang" },
        { en: "Heart", id: "Hati" },

        // Polygons (Segi Banyak)
        { en: "Pentagon", id: "Segilima" },
        { en: "Hexagon", id: "Segienam" },
        { en: "Heptagon", id: "Segitujuh" },
        { en: "Octagon", id: "Segidelapan" },
        { en: "Nonagon", id: "Segisembilan" },
        { en: "Decagon", id: "Segi sepuluh" },

        // Quadrilaterals (Segi Empat)
        { en: "Parallelogram", id: "Jajar Genjang" },
        { en: "Trapezoid", id: "Trapesium" },
        { en: "Kite", id: "Layang-layang" },
        { en: "Rhombus", id: "Belah Ketupat" }, // Synonym for Diamond

        // Curved & Irregular Shapes
        { en: "Semicircle", id: "Setengah Lingkaran" },
        { en: "Crescent", id: "Bulan Sabit" },
        { en: "Ellipse", id: "Elips" },
        { en: "Annulus", id: "Cincin Lingkaran" },
        { en: "Sector", id: "Juring Lingkaran" },
        { en: "Segment", id: "Tembereng Lingkaran" },

        // Abstract/Symbolic Shapes
        { en: "Cross", id: "Salib" },
        { en: "Arrow", id: "Panah" },
        { en: "Cloud", id: "Awan" },
        { en: "Lightning Bolt", id: "Petir" },
      ],
    },
    shapes3D: {
      displayName: "3D Shapes",
      words: [
        // Basic 3D Shapes
        { en: "Cube", id: "Kubus" },
        { en: "Sphere", id: "Bola" },
        { en: "Cone", id: "Kerucut" },
        { en: "Cylinder", id: "Tabung" },
        { en: "Pyramid", id: "Limas" },
        { en: "Cuboid", id: "Balok" },

        // Prisms & Platonic Solids
        { en: "Triangular Prism", id: "Prisma Segitiga" },
        { en: "Pentagonal Prism", id: "Prisma Segilima" },
        { en: "Hexagonal Prism", id: "Prisma Segienam" },
        { en: "Tetrahedron", id: "Tetrahedron" },
        { en: "Octahedron", id: "Oktahedron" },
        { en: "Dodecahedron", id: "Dodekahedron" },
        { en: "Icosahedron", id: "Ikosahedron" },

        // Curved 3D Shapes
        { en: "Torus", id: "Torus (Donat)" },
        { en: "Hemisphere", id: "Setengah Bola" },
        { en: "Ellipsoid", id: "Elipsoid" },
        { en: "Paraboloid", id: "Paraboloid" },

        // Real-World 3D Forms
        { en: "Capsule", id: "Kapsul" },
        { en: "Pipe", id: "Pipa" },
        { en: "Frustum", id: "Frustum (Kerucut Terpancung)" },
      ],
    },
  },
};
