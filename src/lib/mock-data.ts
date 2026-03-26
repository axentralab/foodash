import { Category, MenuItem, Order } from "@/types";

export const CATEGORIES: Category[] = [
  { id: "1", name: "Burgers", slug: "burgers", icon: "🍔", color: "#FF6B35" },
  { id: "2", name: "Pizza", slug: "pizza", icon: "🍕", color: "#E55520" },
  { id: "3", name: "Sushi", slug: "sushi", icon: "🍱", color: "#06D6A0" },
  { id: "4", name: "Pasta", slug: "pasta", icon: "🍝", color: "#FFD166" },
  { id: "5", name: "Salads", slug: "salads", icon: "🥗", color: "#4CAF50" },
  { id: "6", name: "Desserts", slug: "desserts", icon: "🍰", color: "#FF69B4" },
  { id: "7", name: "Drinks", slug: "drinks", icon: "🥤", color: "#2196F3" },
  { id: "8", name: "Chicken", slug: "chicken", icon: "🍗", color: "#FF9800" },
  { id: "9", name: "Seafood", slug: "seafood", icon: "🦞", color: "#00BCD4" },
  { id: "10", name: "Tacos", slug: "tacos", icon: "🌮", color: "#9C27B0" },
  { id: "11", name: "Sandwiches", slug: "sandwiches", icon: "🥪", color: "#795548" },
  { id: "12", name: "Breakfast", slug: "breakfast", icon: "🍳", color: "#FFC107" },
];

export const MENU_ITEMS: MenuItem[] = [
  // ── Burgers ──────────────────────────────────────────
  {
    id: "1", name: "Double Smash Burger", category_id: "1",
    description: "Two juicy smash patties with cheddar, caramelized onions, pickles & special sauce on a brioche bun.",
    price: 14.99, image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    rating: 4.8, review_count: 342, prep_time: 15, is_available: true, is_featured: true, tags: ["bestseller","spicy"],
  },
  {
    id: "2", name: "Wagyu Beef Burger", category_id: "1",
    description: "A5 Wagyu patty, aged cheddar, truffle aioli, arugula & heirloom tomato on a potato bun.",
    price: 34.99, image_url: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&q=80",
    rating: 4.9, review_count: 97, prep_time: 20, is_available: true, is_featured: true, tags: ["premium","wagyu"],
  },
  {
    id: "3", name: "Mushroom Swiss Burger", category_id: "1",
    description: "Angus beef, sautéed wild mushrooms, Swiss cheese, garlic aioli & fresh lettuce.",
    price: 16.49, image_url: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=500&q=80",
    rating: 4.6, review_count: 218, prep_time: 15, is_available: true, is_featured: false, tags: ["classic"],
  },
  {
    id: "4", name: "BBQ Bacon Burger", category_id: "1",
    description: "Beef patty, crispy bacon, smoked BBQ sauce, cheddar, onion rings & pickled jalapeños.",
    price: 17.99, image_url: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&q=80",
    rating: 4.7, review_count: 305, prep_time: 18, is_available: true, is_featured: false, tags: ["bestseller","bbq"],
  },
  {
    id: "5", name: "Veggie Black Bean Burger", category_id: "1",
    description: "Spiced black bean patty, avocado, pico de gallo, chipotle mayo & fresh greens.",
    price: 13.49, image_url: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&q=80",
    rating: 4.4, review_count: 132, prep_time: 12, is_available: true, is_featured: false, tags: ["vegetarian","healthy"],
  },

  // ── Pizza ─────────────────────────────────────────────
  {
    id: "6", name: "Margherita Suprema", category_id: "2",
    description: "San Marzano tomatoes, fresh mozzarella di bufala, basil leaves, extra virgin olive oil.",
    price: 18.50, image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
    rating: 4.9, review_count: 521, prep_time: 20, is_available: true, is_featured: true, tags: ["vegetarian","classic"],
  },
  {
    id: "7", name: "Spicy BBQ Chicken Pizza", category_id: "2",
    description: "Smoky BBQ sauce, grilled chicken, red onions, jalapeños, mozzarella & cilantro.",
    price: 20.00, image_url: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80",
    rating: 4.5, review_count: 334, prep_time: 22, is_available: true, is_featured: false, tags: ["spicy","bbq"],
  },
  {
    id: "8", name: "Quattro Formaggi", category_id: "2",
    description: "Four cheese blend: mozzarella, gorgonzola, parmesan & goat cheese with honey drizzle.",
    price: 22.00, image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
    rating: 4.7, review_count: 267, prep_time: 20, is_available: true, is_featured: false, tags: ["premium","vegetarian"],
  },
  {
    id: "9", name: "Pepperoni Supreme", category_id: "2",
    description: "Double pepperoni, mozzarella, san marzano sauce & fresh basil on a crispy thin crust.",
    price: 19.50, image_url: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&q=80",
    rating: 4.8, review_count: 489, prep_time: 22, is_available: true, is_featured: true, tags: ["bestseller","classic"],
  },

  // ── Sushi ─────────────────────────────────────────────
  {
    id: "10", name: "Dragon Roll", category_id: "3",
    description: "Shrimp tempura inside, avocado on top, eel sauce & sesame seeds.",
    price: 22.00, image_url: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&q=80",
    rating: 4.7, review_count: 189, prep_time: 25, is_available: true, is_featured: true, tags: ["seafood","premium"],
  },
  {
    id: "11", name: "Salmon Sashimi Set (9pc)", category_id: "3",
    description: "9 pieces of premium Atlantic salmon sashimi with pickled ginger & wasabi.",
    price: 28.00, image_url: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=500&q=80",
    rating: 4.8, review_count: 143, prep_time: 15, is_available: true, is_featured: false, tags: ["seafood","premium","raw"],
  },
  {
    id: "12", name: "Rainbow Roll", category_id: "3",
    description: "California roll topped with assorted sashimi — tuna, salmon, yellowtail & avocado.",
    price: 24.50, image_url: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&q=80",
    rating: 4.6, review_count: 211, prep_time: 20, is_available: true, is_featured: false, tags: ["seafood","colorful"],
  },

  // ── Pasta ─────────────────────────────────────────────
  {
    id: "13", name: "Truffle Carbonara", category_id: "4",
    description: "Al dente spaghetti with guanciale, pecorino romano, eggs, black pepper & shaved truffle.",
    price: 21.00, image_url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80",
    rating: 4.6, review_count: 267, prep_time: 18, is_available: true, is_featured: false, tags: ["premium","italian"],
  },
  {
    id: "14", name: "Lobster Linguine", category_id: "4",
    description: "Fresh linguine tossed with butter-poached lobster, cherry tomatoes, white wine & herbs.",
    price: 32.00, image_url: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&q=80",
    rating: 4.8, review_count: 156, prep_time: 25, is_available: true, is_featured: true, tags: ["premium","seafood"],
  },
  {
    id: "15", name: "Pesto Penne Arrabbiata", category_id: "4",
    description: "Penne pasta in spicy tomato arrabbiata sauce with basil pesto swirl & parmigiano.",
    price: 16.50, image_url: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&q=80",
    rating: 4.5, review_count: 198, prep_time: 15, is_available: true, is_featured: false, tags: ["vegetarian","spicy"],
  },

  // ── Chicken ───────────────────────────────────────────
  {
    id: "16", name: "Crispy Chicken Sandwich", category_id: "8",
    description: "Buttermilk-fried chicken breast, spicy mayo, coleslaw & pickles on a toasted potato bun.",
    price: 13.50, image_url: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&q=80",
    rating: 4.7, review_count: 412, prep_time: 15, is_available: true, is_featured: true, tags: ["bestseller","crispy"],
  },
  {
    id: "17", name: "Buffalo Wings (12pc)", category_id: "8",
    description: "Crispy chicken wings tossed in fiery buffalo sauce, served with blue cheese dip & celery.",
    price: 16.99, image_url: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&q=80",
    rating: 4.7, review_count: 389, prep_time: 20, is_available: true, is_featured: true, tags: ["spicy","sharing","bestseller"],
  },
  {
    id: "18", name: "Grilled Chicken Platter", category_id: "8",
    description: "Herb-marinated grilled chicken with roasted veggies, tzatziki & warm pita.",
    price: 18.99, image_url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=500&q=80",
    rating: 4.5, review_count: 231, prep_time: 20, is_available: true, is_featured: false, tags: ["healthy","grilled"],
  },
  {
    id: "19", name: "Nashville Hot Chicken", category_id: "8",
    description: "Cayenne-coated fried chicken, pickles, white bread & cooling ranch dipping sauce.",
    price: 15.99, image_url: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=80",
    rating: 4.8, review_count: 318, prep_time: 18, is_available: true, is_featured: false, tags: ["spicy","bestseller"],
  },

  // ── Seafood ───────────────────────────────────────────
  {
    id: "20", name: "Grilled King Prawns", category_id: "9",
    description: "Jumbo king prawns grilled in garlic butter, lemon & fresh herbs, served with crusty bread.",
    price: 29.99, image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80",
    rating: 4.8, review_count: 174, prep_time: 20, is_available: true, is_featured: true, tags: ["premium","seafood"],
  },
  {
    id: "21", name: "Fish & Chips", category_id: "9",
    description: "Beer-battered cod fillet, golden fries, mushy peas & tartare sauce.",
    price: 17.50, image_url: "https://images.unsplash.com/photo-1579208030886-b937da0925dc?w=500&q=80",
    rating: 4.5, review_count: 287, prep_time: 18, is_available: true, is_featured: false, tags: ["classic","british"],
  },
  {
    id: "22", name: "Seafood Paella", category_id: "9",
    description: "Saffron rice loaded with prawns, mussels, clams & squid — serves 2.",
    price: 38.00, image_url: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=500&q=80",
    rating: 4.7, review_count: 112, prep_time: 35, is_available: true, is_featured: true, tags: ["premium","sharing","spanish"],
  },

  // ── Tacos ─────────────────────────────────────────────
  {
    id: "23", name: "Street Tacos (3pc)", category_id: "10",
    description: "Corn tortillas, carne asada, white onion, cilantro, salsa verde & lime.",
    price: 12.99, image_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80",
    rating: 4.7, review_count: 356, prep_time: 12, is_available: true, is_featured: true, tags: ["bestseller","mexican"],
  },
  {
    id: "24", name: "Shrimp Tacos (3pc)", category_id: "10",
    description: "Grilled shrimp, mango slaw, chipotle crema & avocado on flour tortillas.",
    price: 14.99, image_url: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=500&q=80",
    rating: 4.6, review_count: 203, prep_time: 15, is_available: true, is_featured: false, tags: ["seafood","fresh"],
  },

  // ── Sandwiches ────────────────────────────────────────
  {
    id: "25", name: "Club Sandwich", category_id: "11",
    description: "Triple-decker with turkey, bacon, egg, lettuce, tomato & mayo on toasted sourdough.",
    price: 14.50, image_url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&q=80",
    rating: 4.5, review_count: 267, prep_time: 12, is_available: true, is_featured: false, tags: ["classic","filling"],
  },
  {
    id: "26", name: "Philly Cheesesteak", category_id: "11",
    description: "Thinly sliced ribeye, provolone, caramelized onions & green peppers in a hoagie roll.",
    price: 16.99, image_url: "https://images.unsplash.com/photo-1619546952812-520e98064a52?w=500&q=80",
    rating: 4.7, review_count: 198, prep_time: 15, is_available: true, is_featured: false, tags: ["classic","american"],
  },

  // ── Salads ────────────────────────────────────────────
  {
    id: "27", name: "Greek Goddess Salad", category_id: "5",
    description: "Romaine, kalamata olives, cherry tomatoes, cucumber, feta & lemon herb dressing.",
    price: 12.00, image_url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80",
    rating: 4.4, review_count: 156, prep_time: 10, is_available: true, is_featured: false, tags: ["healthy","vegetarian"],
  },
  {
    id: "28", name: "Caesar Salad", category_id: "5",
    description: "Romaine hearts, house Caesar dressing, parmesan crisp, croutons & anchovies.",
    price: 13.50, image_url: "https://images.unsplash.com/photo-1580013759032-c96505e24c1f?w=500&q=80",
    rating: 4.5, review_count: 287, prep_time: 10, is_available: true, is_featured: false, tags: ["classic","fresh"],
  },

  // ── Breakfast ─────────────────────────────────────────
  {
    id: "29", name: "Full English Breakfast", category_id: "12",
    description: "Eggs, bacon, sausages, grilled tomato, mushrooms, baked beans & toast.",
    price: 15.99, image_url: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&q=80",
    rating: 4.6, review_count: 178, prep_time: 20, is_available: true, is_featured: false, tags: ["hearty","british"],
  },
  {
    id: "30", name: "Avocado Toast & Eggs", category_id: "12",
    description: "Smashed avocado on sourdough, poached eggs, chili flakes & microgreens.",
    price: 13.99, image_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&q=80",
    rating: 4.7, review_count: 312, prep_time: 12, is_available: true, is_featured: true, tags: ["healthy","trending"],
  },
  {
    id: "31", name: "Pancake Stack", category_id: "12",
    description: "Fluffy buttermilk pancakes with maple syrup, fresh berries & whipped cream.",
    price: 12.99, image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80",
    rating: 4.8, review_count: 267, prep_time: 15, is_available: true, is_featured: false, tags: ["sweet","kids"],
  },

  // ── Desserts ──────────────────────────────────────────
  {
    id: "32", name: "Chocolate Lava Cake", category_id: "6",
    description: "Warm dark chocolate fondant with vanilla bean ice cream & raspberry coulis.",
    price: 9.50, image_url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80",
    rating: 4.9, review_count: 298, prep_time: 12, is_available: true, is_featured: true, tags: ["dessert","indulgent"],
  },
  {
    id: "33", name: "New York Cheesecake", category_id: "6",
    description: "Classic NY-style baked cheesecake with graham cracker crust & berry compote.",
    price: 8.99, image_url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80",
    rating: 4.7, review_count: 223, prep_time: 5, is_available: true, is_featured: false, tags: ["classic","sweet"],
  },
  {
    id: "34", name: "Tiramisu", category_id: "6",
    description: "Layers of espresso-soaked ladyfingers, mascarpone cream & dusted cocoa.",
    price: 8.50, image_url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80",
    rating: 4.8, review_count: 186, prep_time: 5, is_available: true, is_featured: false, tags: ["italian","coffee"],
  },
  {
    id: "35", name: "Mango Panna Cotta", category_id: "6",
    description: "Silky vanilla panna cotta with fresh mango coulis & toasted coconut flakes.",
    price: 7.99, image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80",
    rating: 4.6, review_count: 143, prep_time: 5, is_available: true, is_featured: false, tags: ["light","tropical"],
  },

  // ── Drinks ────────────────────────────────────────────
  {
    id: "36", name: "Mango Lassi", category_id: "7",
    description: "Chilled blend of Alphonso mango, yogurt, cardamom & a hint of rose water.",
    price: 6.50, image_url: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500&q=80",
    rating: 4.6, review_count: 201, prep_time: 5, is_available: true, is_featured: false, tags: ["drink","refreshing"],
  },
  {
    id: "37", name: "Fresh Lemonade", category_id: "7",
    description: "Hand-squeezed lemons, mint, honey & sparkling water — sweet, tart & refreshing.",
    price: 5.50, image_url: "https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=500&q=80",
    rating: 4.5, review_count: 156, prep_time: 3, is_available: true, is_featured: false, tags: ["drink","refreshing","popular"],
  },
  {
    id: "38", name: "Matcha Iced Latte", category_id: "7",
    description: "Premium ceremonial matcha, oat milk, vanilla syrup over ice.",
    price: 7.00, image_url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&q=80",
    rating: 4.7, review_count: 234, prep_time: 5, is_available: true, is_featured: true, tags: ["drink","trending","healthy"],
  },
  {
    id: "39", name: "Watermelon Juice", category_id: "7",
    description: "100% fresh-pressed watermelon with a hint of lime and pink salt.",
    price: 5.99, image_url: "https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?w=500&q=80",
    rating: 4.6, review_count: 178, prep_time: 3, is_available: true, is_featured: false, tags: ["drink","refreshing","natural"],
  },
  {
    id: "40", name: "Oreo Milkshake", category_id: "7",
    description: "Thick blend of vanilla ice cream, crushed Oreos & whole milk, topped with whipped cream.",
    price: 8.50, image_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80",
    rating: 4.8, review_count: 312, prep_time: 5, is_available: true, is_featured: true, tags: ["drink","indulgent","kids"],
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "ord_abc123001", user_id: "user_1", status: "preparing",
    total_price: 52.48, delivery_fee: 5.00, discount: 0.50,
    delivery_address: "123 Main St, Narayanganj 1400",
    payment_method: "card", created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    estimated_delivery: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    items: [
      { id:"oi_001", menu_item_id:"1", menu_item_name:"Double Smash Burger", menu_item_image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80", quantity:2, price:14.99 },
      { id:"oi_002", menu_item_id:"36", menu_item_name:"Mango Lassi", menu_item_image:"https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500&q=80", quantity:2, price:6.50 },
    ],
    rider: { name:"Rahim Uddin", phone:"+880 1700 000123", rating:4.9 },
  },
  {
    id: "ord_abc123002", user_id: "user_1", status: "delivered",
    total_price: 44.49, delivery_fee: 5.00, discount: 0.50,
    delivery_address: "123 Main St, Narayanganj 1400",
    payment_method: "card", created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000).toISOString(),
    items: [
      { id:"oi_003", menu_item_id:"6", menu_item_name:"Margherita Suprema", menu_item_image:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80", quantity:2, price:18.50 },
    ],
    rider: { name:"Karim Hossain", phone:"+880 1800 000456", rating:4.8 },
  },
];

export const OFFERS = [
  { id:"1", title:"Free Delivery on First Order", subtitle:"Use code WELCOME", emoji:"🚀", bg:"from-orange-500 to-orange-400" },
  { id:"2", title:"20% Off Weekends", subtitle:"Sat & Sun only", emoji:"🎉", bg:"from-purple-600 to-purple-500" },
  { id:"3", title:"Buy 2 Get 1 Free", subtitle:"On selected pizzas", emoji:"🍕", bg:"from-emerald-600 to-emerald-500" },
  { id:"4", title:"Free Drink with Combo", subtitle:"Order any platter", emoji:"🥤", bg:"from-blue-600 to-blue-500" },
];
