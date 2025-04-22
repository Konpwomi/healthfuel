import { Link } from "expo-router";
import { ScrollView, Text, View, TouchableOpacity, Image } from "react-native";
import { useState } from "react";

// Primary color theme
const primaryColor = "#4A80F0";
const secondaryColor = "#6F9EFF";
const accentColor = "#2E5CE6";

// Meal suggestion data
const mealSuggestions = [
  {
    id: 1,
    name: "Grilled Chicken Salad",
    calories: 350,
    protein: 32,
    carbs: 15,
    fat: 18,
    image: require("../../assets/images/food/1.png"),
    description:
      "A nutrient-packed salad featuring tender grilled chicken breast sliced over a bed of mixed greens. Enhanced with creamy avocado chunks, sweet cherry tomatoes, and crunchy cucumber. The light vinaigrette dressing adds a tangy finish without excess calories, making this a perfect protein-rich meal that keeps you satisfied for hours.",
    ingredients: [
      "Chicken breast",
      "Mixed greens",
      "Cherry tomatoes",
      "Avocado",
      "Olive oil",
      "Lemon juice",
    ],
    cookingInstructions:
      "1. Season chicken breast with salt, pepper, and herbs. 2. Grill for 6-7 minutes per side until internal temperature reaches 165°F. 3. While chicken rests, assemble fresh greens, sliced tomatoes, and avocado in a bowl. 4. Slice chicken and place on top. 5. Whisk olive oil and lemon juice with a pinch of salt for dressing. 6. Drizzle over salad and serve immediately.",
    mealType: "lunch",
  },
  {
    id: 2,
    name: "Protein Smoothie Bowl",
    calories: 420,
    protein: 25,
    carbs: 60,
    fat: 10,
    image: "https://source.unsplash.com/random/300x200/?smoothie",
    description:
      "This vibrant smoothie bowl combines the power of high-quality protein with antioxidant-rich fruits. The thick, creamy base is made with Greek yogurt and banana, providing both protein and natural sweetness. Topped with crunchy granola, fresh berries, and nutrient-dense chia seeds, this bowl offers a balanced breakfast that sustains energy levels throughout the morning.",
    ingredients: [
      "Protein powder",
      "Greek yogurt",
      "Banana",
      "Berries",
      "Granola",
      "Chia seeds",
    ],
    cookingInstructions:
      "1. Blend 1 scoop protein powder, ½ cup Greek yogurt, 1 frozen banana, and ¼ cup frozen berries until thick and smooth. 2. Add a splash of almond milk if needed to blend, but keep mixture thick enough to eat with a spoon. 3. Pour into a bowl. 4. Top with fresh berries, 2 tbsp granola, and 1 tsp chia seeds. 5. Optional: drizzle with honey for added sweetness.",
    mealType: "breakfast",
  },
  {
    id: 3,
    name: "Salmon with Roasted Vegetables",
    calories: 480,
    protein: 38,
    carbs: 22,
    fat: 25,
    image: "https://source.unsplash.com/random/300x200/?salmon",
    description:
      "This omega-3 rich meal features a perfectly baked salmon fillet with a golden crust and tender, flaky interior. The salmon is complemented by a colorful medley of seasonal vegetables like broccoli, bell peppers, and carrots, roasted until caramelized. A light seasoning of herbs enhances the natural flavors without overpowering the dish, creating a nutrient-dense dinner that supports heart and brain health.",
    ingredients: [
      "Salmon fillet",
      "Broccoli",
      "Bell peppers",
      "Carrots",
      "Olive oil",
      "Herbs",
    ],
    cookingInstructions:
      "1. Preheat oven to 400°F. 2. Chop vegetables into similar-sized pieces and toss with 1 tbsp olive oil, salt, pepper, and herbs. 3. Spread vegetables on a baking sheet and roast for 10 minutes. 4. Pat salmon dry and season with salt, pepper, and herbs. 5. Push vegetables to the sides of the pan and place salmon in the center. 6. Return to oven and bake 12-15 minutes until salmon is cooked through. 7. Serve immediately with a lemon wedge.",
    mealType: "dinner",
  },
  {
    id: 4,
    name: "Quinoa Power Bowl",
    calories: 410,
    protein: 18,
    carbs: 58,
    fat: 15,
    image: "https://source.unsplash.com/random/300x200/?quinoa",
    description:
      "This visually stunning bowl centers around protein-rich quinoa, known as a complete plant protein. Layered with roasted sweet potatoes for complex carbs, vitamin-packed kale, and fiber-rich chickpeas, it delivers a nutritional powerhouse in every bite. The tahini dressing adds a creamy texture and nutty flavor, bringing together all components into a satisfying vegetarian meal that provides sustained energy.",
    ingredients: [
      "Quinoa",
      "Chickpeas",
      "Kale",
      "Sweet potato",
      "Tahini",
      "Lemon",
    ],
    cookingInstructions:
      "1. Rinse 1 cup quinoa and cook according to package instructions. 2. Peel and cube 1 sweet potato, toss with olive oil, salt and pepper. 3. Roast sweet potato at 400°F for 25 minutes until tender. 4. Rinse and drain 1 can chickpeas, then season with cumin and paprika. 5. Massage kale with olive oil and lemon juice to soften. 6. For dressing, whisk 2 tbsp tahini with lemon juice and water until smooth. 7. Assemble bowl with quinoa as base, topped with vegetables and chickpeas, then drizzle with tahini dressing.",
    mealType: "lunch",
  },
  {
    id: 5,
    name: "Greek Yogurt Parfait",
    calories: 280,
    protein: 20,
    carbs: 35,
    fat: 8,
    image: "https://source.unsplash.com/random/300x200/?yogurt",
    description:
      "This elegantly layered parfait combines protein-rich Greek yogurt with antioxidant-packed mixed berries and crunchy granola. The creamy yogurt provides a tangy base while delivering gut-healthy probiotics. Natural honey adds just enough sweetness to balance the tartness, and almond flakes contribute heart-healthy fats and a satisfying crunch. Perfect as a quick breakfast or nutritious snack, this parfait offers balanced nutrition in a visually appealing package.",
    ingredients: [
      "Greek yogurt",
      "Honey",
      "Mixed berries",
      "Granola",
      "Almond flakes",
    ],
    cookingInstructions:
      "1. In a glass or jar, add a layer of 1/3 cup Greek yogurt. 2. Add a thin drizzle of honey (about 1 tsp). 3. Top with 2 tbsp of mixed berries. 4. Add another layer of yogurt, honey, and berries. 5. Top with 2 tbsp low-sugar granola and a sprinkle of almond flakes. 6. Refrigerate for up to 24 hours if not eating immediately (add granola just before serving to maintain crunch).",
    mealType: "breakfast",
  },
  {
    id: 6,
    name: "Turkey and Avocado Wrap",
    calories: 380,
    protein: 28,
    carbs: 38,
    fat: 14,
    image: "https://source.unsplash.com/random/300x200/?wrap",
    description:
      "This portable, nutrient-dense wrap features lean turkey breast for quality protein, creamy avocado for healthy fats, and a whole grain wrap for complex carbohydrates. Fresh vegetables add essential vitamins, minerals, and satisfying crunch, while hummus provides additional protein and fiber. The combination creates a balanced meal that's quick to prepare yet nutritionally complete, perfect for busy days when you need sustained energy.",
    ingredients: [
      "Turkey breast",
      "Whole grain wrap",
      "Avocado",
      "Lettuce",
      "Tomato",
      "Hummus",
    ],
    cookingInstructions:
      "1. Lay whole grain wrap flat on a clean surface. 2. Spread 2 tbsp hummus evenly over wrap. 3. Layer 3-4 slices of turkey breast on top. 4. Add lettuce, sliced tomato, and ¼ sliced avocado. 5. Season with salt, pepper, and optional herbs. 6. Fold in sides of wrap, then roll tightly from bottom. 7. Cut in half diagonally and serve, or wrap in foil for a meal on the go.",
    mealType: "lunch",
  },
  {
    id: 7,
    name: "Vegetarian Stir Fry",
    calories: 340,
    protein: 15,
    carbs: 45,
    fat: 12,
    image: "https://source.unsplash.com/random/300x200/?stirfry",
    description:
      "This vibrant vegetarian stir fry combines protein-rich tofu with a colorful array of fresh vegetables for maximum nutritional benefit. The tofu, marinated in low-sodium soy sauce, provides a savory flavor and satisfying texture. Fiber-rich brown rice serves as a wholesome base, while the rainbow of vegetables delivers essential vitamins, minerals, and antioxidants. Quick cooking preserves nutrients and natural flavors for a delicious plant-based meal.",
    ingredients: [
      "Tofu",
      "Brown rice",
      "Broccoli",
      "Carrots",
      "Snow peas",
      "Low-sodium soy sauce",
    ],
    cookingInstructions:
      "1. Press firm tofu between paper towels to remove excess moisture, then cube. 2. Cook brown rice according to package instructions. 3. Heat 1 tbsp oil in a wok or large pan over high heat. 4. Add tofu and cook until golden, about 3-4 minutes per side. Remove and set aside. 5. Add chopped vegetables to the pan and stir-fry for 3-4 minutes until crisp-tender. 6. Return tofu to pan, add 2 tbsp low-sodium soy sauce and 1 tsp ginger. 7. Stir to combine and heat through. 8. Serve over brown rice.",
    mealType: "dinner",
  },
  {
    id: 8,
    name: "Overnight Oats",
    calories: 320,
    protein: 15,
    carbs: 52,
    fat: 8,
    image: "https://source.unsplash.com/random/300x200/?oats",
    description:
      "This time-saving breakfast combines rolled oats with protein-rich chia seeds and creamy almond milk, allowing the ingredients to meld overnight into a pudding-like consistency. The complex carbohydrates from oats provide sustained energy release throughout the morning, while chia seeds add omega-3 fatty acids and fiber. Topped with fresh fruits and a touch of almond butter, this make-ahead meal offers balanced nutrition with minimal morning preparation.",
    ingredients: [
      "Rolled oats",
      "Almond milk",
      "Chia seeds",
      "Banana",
      "Berries",
      "Almond butter",
    ],
    cookingInstructions:
      "1. In a mason jar or container with lid, combine ½ cup rolled oats, 1 tbsp chia seeds, and ⅔ cup almond milk. 2. Add 1 tsp maple syrup or honey if desired. 3. Stir well to combine. 4. Seal and refrigerate overnight or at least 6 hours. 5. In the morning, stir oats and add more liquid if needed. 6. Top with sliced banana, fresh berries, and 1 tbsp almond butter. 7. Optional: sprinkle with cinnamon or nutmeg.",
    mealType: "breakfast",
  },
  {
    id: 9,
    name: "Mediterranean Stuffed Peppers",
    calories: 380,
    protein: 22,
    carbs: 40,
    fat: 16,
    image: "https://source.unsplash.com/random/300x200/?stuffedpeppers",
    description:
      "These colorful stuffed peppers feature Mediterranean-inspired ingredients including protein-packed quinoa, vitamin-rich vegetables, and tangy feta cheese. Bell peppers serve as edible vessels while providing vitamin C and antioxidants. The quinoa and vegetable filling offers complete protein and complex carbohydrates, while olive oil and feta add healthy fats and distinctive Mediterranean flavors. This dish combines visual appeal with nutritional excellence for a satisfying vegetarian entree.",
    ingredients: [
      "Bell peppers",
      "Quinoa",
      "Zucchini",
      "Onion",
      "Feta cheese",
      "Olive oil",
    ],
    cookingInstructions:
      "1. Preheat oven to 375°F. 2. Cook 1 cup quinoa according to package instructions. 3. Cut bell peppers in half lengthwise and remove seeds. 4. Sauté diced onion and zucchini in olive oil until soft, about 5 minutes. 5. Mix vegetables with cooked quinoa, 2 oz crumbled feta, and Mediterranean herbs. 6. Fill pepper halves with mixture and place in baking dish. 7. Cover with foil and bake 25 minutes, then uncover and bake 10 more minutes. 8. Sprinkle with additional feta before serving.",
    mealType: "dinner",
  },
  {
    id: 10,
    name: "Tuna Lettuce Wraps",
    calories: 260,
    protein: 28,
    carbs: 10,
    fat: 12,
    image: "https://source.unsplash.com/random/300x200/?tunawrap",
    description:
      "These light yet satisfying wraps use crisp lettuce leaves as a low-carb alternative to traditional wraps. The protein-rich tuna salad features Greek yogurt instead of mayonnaise, reducing fat while adding beneficial probiotics. Fresh celery adds pleasant crunch and fiber, while lemon juice and Dijon mustard provide bright, tangy flavors without excess sodium or calories. Perfect for a light lunch or appetizer, these wraps deliver lean protein and fresh ingredients in a refreshing package.",
    ingredients: [
      "Tuna",
      "Greek yogurt",
      "Celery",
      "Lettuce leaves",
      "Lemon juice",
      "Dijon mustard",
    ],
    cookingInstructions:
      "1. Drain 1 can of tuna and place in a bowl. 2. Add 2 tbsp Greek yogurt, 1 tsp Dijon mustard, 1 tsp lemon juice, and mix well. 3. Fold in finely diced celery and season with salt and pepper. 4. Carefully separate and wash large lettuce leaves (romaine or butter lettuce work well). 5. Pat lettuce leaves dry with paper towels. 6. Place a scoop of tuna mixture in each leaf. 7. Optional: add diced avocado or halved cherry tomatoes. 8. Fold or roll lettuce leaves and secure with a toothpick if needed.",
    mealType: "lunch",
  },
  {
    id: 11,
    name: "Sweet Potato and Black Bean Bowl",
    calories: 390,
    protein: 16,
    carbs: 65,
    fat: 10,
    image: "https://source.unsplash.com/random/300x200/?sweetpotato",
    description:
      "This vibrant plant-based bowl centers around vitamin-rich roasted sweet potatoes and protein-packed black beans. Together they create a complete protein while providing complex carbohydrates and fiber. The creamy avocado adds heart-healthy monounsaturated fats, while fresh cilantro and lime juice bring bright, zesty flavors. A touch of cumin adds earthy warmth and digestive benefits. This colorful, nutrient-dense meal offers sustained energy and exceptional nutritional value in a simple format.",
    ingredients: [
      "Sweet potato",
      "Black beans",
      "Avocado",
      "Cilantro",
      "Lime juice",
      "Cumin",
    ],
    cookingInstructions:
      "1. Preheat oven to 400°F. 2. Peel and cube 2 medium sweet potatoes, toss with 1 tbsp olive oil, salt, pepper, and 1 tsp cumin. 3. Spread on baking sheet and roast 25-30 minutes until tender and caramelized. 4. Rinse and drain 1 can black beans, heat in saucepan with ½ tsp cumin and ¼ tsp garlic powder. 5. Dice avocado and chop fresh cilantro. 6. Assemble bowls with roasted sweet potatoes, black beans, and avocado. 7. Squeeze fresh lime juice over top and garnish with cilantro. 8. Optional: add a dollop of Greek yogurt or a sprinkle of pepitas.",
    mealType: "dinner",
  },
  {
    id: 12,
    name: "Cottage Cheese with Fruit",
    calories: 220,
    protein: 24,
    carbs: 18,
    fat: 5,
    image: "https://source.unsplash.com/random/300x200/?cottagecheese",
    description:
      "This simple yet nutritionally complete snack pairs protein-rich cottage cheese with naturally sweet fresh fruits. The cottage cheese provides high-quality complete protein and calcium for muscle and bone health, while fresh fruits add essential vitamins, fiber, and natural sugars for quick energy. A light drizzle of honey enhances the sweetness, and a sprinkle of cinnamon adds warmth and has been shown to help regulate blood sugar levels. Perfect as a post-workout recovery snack or light breakfast.",
    ingredients: [
      "Cottage cheese",
      "Pineapple",
      "Berries",
      "Honey",
      "Cinnamon",
    ],
    cookingInstructions:
      "1. Place 1 cup low-fat cottage cheese in a bowl. 2. Add ½ cup fresh pineapple chunks and ¼ cup mixed berries. 3. Drizzle with 1 tsp honey, adjusting to taste. 4. Sprinkle with a pinch of cinnamon. 5. For best flavor, allow to sit for 5 minutes before eating to let the honey and cinnamon meld with the cottage cheese. 6. Optional variations: add chopped nuts for crunch or swap fruits based on seasonal availability.",
    mealType: "snack",
  },
  {
    id: 13,
    name: "Lentil Soup",
    calories: 310,
    protein: 18,
    carbs: 42,
    fat: 8,
    image: "https://source.unsplash.com/random/300x200/?lentilsoup",
    description:
      "This hearty, nutrient-dense soup features protein and fiber-rich lentils as its star ingredient. Lentils provide plant-based protein, complex carbohydrates, and essential minerals including iron and potassium. The mirepoix base of carrots, celery, and onion adds flavor depth and additional vitamins, while aromatic herbs enhance the taste profile without adding sodium or calories. This soup simmers to perfection, creating a comforting meal that's as nutritious as it is satisfying on cool days.",
    ingredients: [
      "Lentils",
      "Carrots",
      "Celery",
      "Onion",
      "Vegetable broth",
      "Thyme",
    ],
    cookingInstructions:
      "1. Rinse 1 cup dry lentils and check for any stones. 2. Dice 1 onion, 2 carrots, and 2 celery stalks. 3. In a large pot, heat 1 tbsp olive oil over medium heat. 4. Sauté onion, carrots, and celery until softened, about 5 minutes. 5. Add 1 minced garlic clove and cook 30 seconds until fragrant. 6. Add lentils, 6 cups vegetable broth, 1 bay leaf, and 1 tsp thyme. 7. Bring to a boil, then reduce heat and simmer covered for 25-30 minutes until lentils are tender. 8. Season with salt and pepper to taste. Optional: finish with a squeeze of lemon juice.",
    mealType: "lunch",
  },
  {
    id: 14,
    name: "Egg White Omelette",
    calories: 240,
    protein: 25,
    carbs: 8,
    fat: 12,
    image: "https://source.unsplash.com/random/300x200/?omelette",
    description:
      "This protein-packed breakfast features fluffy egg whites for lean protein without the cholesterol of whole eggs. Folded with nutrient-rich spinach for iron and vitamins, juicy tomatoes for lycopene, and a touch of tangy feta cheese for calcium and flavor. The light cooking technique maintains the delicate texture while olive oil adds heart-healthy fats. This omelette provides exceptional protein quality with minimal calories, making it ideal for those focused on lean muscle maintenance or weight management goals.",
    ingredients: [
      "Egg whites",
      "Spinach",
      "Tomatoes",
      "Feta cheese",
      "Olive oil",
    ],
    cookingInstructions:
      "1. Whisk 6 egg whites in a bowl until slightly frothy. 2. Heat 2 tsp olive oil in a non-stick pan over medium heat. 3. Add 1 cup fresh spinach and cook until just wilted, about 1 minute. 4. Add 1/4 cup diced tomatoes and cook 30 seconds more. 5. Pour egg whites over vegetables, tilting pan to spread evenly. 6. Cook until edges begin to set, then use a spatula to gently pull edges toward center, allowing uncooked egg to flow underneath. 7. When almost set, sprinkle 2 tbsp crumbled feta over half the omelette. 8. Fold omelette over and slide onto plate.",
    mealType: "breakfast",
  },
  {
    id: 15,
    name: "Seared Tuna Steak",
    calories: 410,
    protein: 40,
    carbs: 20,
    fat: 18,
    image: "https://source.unsplash.com/random/300x200/?tunasteak",
    description:
      "This restaurant-quality dish features premium tuna steak, rich in omega-3 fatty acids and high-quality lean protein. The brief searing technique creates a flavorful crust while maintaining a tender, rare center, preserving both texture and nutrients. Served with quinoa for complex carbohydrates and steamed asparagus for added vitamins and fiber. The light seasoning of sesame seeds and citrus enhances the natural flavors of the tuna while adding antioxidants and a touch of calcium from the seeds.",
    ingredients: [
      "Tuna steak",
      "Quinoa",
      "Asparagus",
      "Lemon",
      "Olive oil",
      "Sesame seeds",
    ],
    cookingInstructions:
      "1. Cook 1/2 cup quinoa according to package instructions. 2. Pat 6oz tuna steak dry and season with salt and pepper. 3. Heat 1 tbsp olive oil in a skillet over high heat until almost smoking. 4. Sprinkle tuna with sesame seeds, pressing gently to adhere. 5. Sear tuna for 1-2 minutes per side for rare, or longer if preferred. 6. Meanwhile, steam asparagus for 3-4 minutes until bright green and tender-crisp. 7. Plate quinoa, top with sliced tuna and asparagus. 8. Finish with fresh lemon juice, a drizzle of olive oil, and a sprinkle of sea salt.",
    mealType: "dinner",
  },
  {
    id: 16,
    name: "Blueberry Protein Pancakes",
    calories: 360,
    protein: 20,
    carbs: 48,
    fat: 10,
    image: "https://source.unsplash.com/random/300x200/?pancakes",
    description:
      "These fluffy yet protein-rich pancakes transform a traditionally carb-heavy breakfast into a balanced meal that supports muscle recovery and sustained energy. The batter combines protein powder with oat flour for a nutritional boost over regular flour, while egg whites create lightness without added fat. Bursting with antioxidant-rich blueberries that add natural sweetness and nutrients, these pancakes deliver a perfect balance of macronutrients with the comfort-food satisfaction of a classic breakfast favorite.",
    ingredients: [
      "Protein powder",
      "Oat flour",
      "Egg whites",
      "Blueberries",
      "Greek yogurt",
      "Maple syrup",
    ],
    cookingInstructions:
      "1. In a bowl, mix 1/2 cup oat flour, 1 scoop vanilla protein powder, 1 tsp baking powder, and a pinch of salt. 2. In another bowl, whisk 3 egg whites until frothy, then add 1/4 cup Greek yogurt and 2-3 tbsp water or milk. 3. Combine wet and dry ingredients, stirring just until mixed (batter will be thick). 4. Gently fold in 1/2 cup fresh blueberries. 5. Heat a non-stick pan over medium heat and lightly coat with cooking spray. 6. Pour 1/4 cup batter per pancake onto pan. 7. Cook until bubbles form on surface, about 2-3 minutes, then flip and cook 1-2 minutes more. 8. Serve with a dollop of Greek yogurt and a light drizzle of pure maple syrup.",
    mealType: "breakfast",
  },
  {
    id: 17,
    name: "Chicken and Vegetable Soup",
    calories: 280,
    protein: 26,
    carbs: 25,
    fat: 8,
    image: "https://source.unsplash.com/random/300x200/?chickensoup",
    description:
      "This comforting classic combines lean protein from chicken breast with a rainbow of nutrient-rich vegetables in a flavorful, clear broth. Each spoonful delivers essential vitamins, minerals, and antioxidants while the protein and fiber content create lasting satiety. The gentle simmering process allows flavors to meld while maintaining the nutritional integrity of the ingredients. Perfect for recovery when feeling under the weather or as a light yet satisfying meal that hydrates while nourishing the body.",
    ingredients: [
      "Chicken breast",
      "Carrots",
      "Celery",
      "Onion",
      "Chicken broth",
      "Garlic",
    ],
    cookingInstructions:
      "1. Heat 1 tbsp olive oil in a large pot over medium heat. 2. Add 1 diced onion, 2 sliced carrots, and 2 sliced celery stalks. Cook until softened, about 5 minutes. 3. Add 2 minced garlic cloves and cook 30 seconds until fragrant. 4. Add 1 lb diced chicken breast and cook until no longer pink, about 5 minutes. 5. Pour in 6 cups low-sodium chicken broth, 1 bay leaf, 1 tsp thyme, and a pinch of salt and pepper. 6. Bring to a boil, then reduce heat and simmer 20 minutes. 7. Optional: add 1/2 cup cooked brown rice or small pasta for a heartier meal. 8. Garnish with fresh parsley before serving.",
    mealType: "lunch",
  },
  {
    id: 18,
    name: "Chia Seed Pudding",
    calories: 230,
    protein: 10,
    carbs: 30,
    fat: 12,
    image: "https://source.unsplash.com/random/300x200/?chiapudding",
    description:
      "This no-cook overnight pudding harnesses the remarkable properties of chia seeds, which expand to create a tapioca-like texture when soaked in liquid. Packed with omega-3 fatty acids, fiber, and protein, chia seeds support heart health and digestion while providing lasting energy. The creamy coconut milk base adds healthy fats and tropical flavor, while fresh mango contributes natural sweetness, vitamins, and vibrant color. This simple yet nutritionally complex breakfast or snack requires minimal preparation for maximum health benefits.",
    ingredients: [
      "Chia seeds",
      "Coconut milk",
      "Mango",
      "Vanilla extract",
      "Honey",
    ],
    cookingInstructions:
      "1. In a bowl or jar, combine 1/4 cup chia seeds with 1 cup coconut milk and 1/2 tsp vanilla extract. 2. Add 1-2 tsp honey to taste and whisk well. 3. Let sit for 5 minutes, then whisk again to prevent clumping. 4. Cover and refrigerate overnight or at least 4 hours. 5. Dice 1/2 fresh mango. 6. When ready to serve, stir pudding and check consistency, adding a splash of milk if too thick. 7. Top with diced mango and an optional sprinkle of coconut flakes. 8. Can be stored in refrigerator for up to 3 days.",
    mealType: "breakfast",
  },
  {
    id: 19,
    name: "Baked Cod with Vegetables",
    calories: 320,
    protein: 35,
    carbs: 18,
    fat: 10,
    image: "https://source.unsplash.com/random/300x200/?bakedfish",
    description:
      "This elegant yet simple dish features delicate cod fillet, a lean source of high-quality protein rich in B vitamins and minerals. The fish is baked with bright, seasonal vegetables that provide fiber, antioxidants, and visual appeal. A touch of heart-healthy olive oil and aromatic herbs enhances flavors while keeping calories in check. The gentle baking method preserves the tender texture of the fish while allowing the natural flavors of all ingredients to shine through for a light yet satisfying dinner option.",
    ingredients: [
      "Cod fillet",
      "Zucchini",
      "Cherry tomatoes",
      "Lemon",
      "Olive oil",
      "Herbs",
    ],
    cookingInstructions:
      "1. Preheat oven to 375°F. 2. Slice 1 medium zucchini into half-moons and halve 1 cup cherry tomatoes. 3. Toss vegetables with 1 tbsp olive oil, salt, pepper, and herbs (such as thyme and oregano). 4. Spread vegetables in a baking dish. 5. Pat dry a 6oz cod fillet and place on top of vegetables. 6. Drizzle fish with 1 tsp olive oil, season with salt, pepper, and herbs. 7. Add thin lemon slices on top of fish. 8. Bake uncovered for 15-18 minutes until fish flakes easily with a fork. 9. Squeeze fresh lemon juice over everything before serving.",
    mealType: "dinner",
  },
  {
    id: 20,
    name: "Hummus Veggie Plate",
    calories: 290,
    protein: 12,
    carbs: 38,
    fat: 14,
    image: "https://source.unsplash.com/random/300x200/?hummus",
    description:
      "This vibrant plant-based snack plate centers around creamy hummus, a nutrient-dense spread made from chickpeas that provides protein, fiber, and healthy fats. Surrounded by a rainbow of fresh, crisp vegetables offering various vitamins, minerals, and antioxidants, this plate delivers satisfying crunch and flavor variety. The whole grain crackers add complex carbohydrates for sustained energy. Perfect as a shareable appetizer or light meal, this Mediterranean-inspired dish proves healthy eating can be both visually appealing and delicious.",
    ingredients: [
      "Hummus",
      "Carrots",
      "Cucumber",
      "Bell peppers",
      "Celery",
      "Whole grain crackers",
    ],
    cookingInstructions:
      "1. Prepare vegetables: slice 2 carrots into sticks, cut 1/2 cucumber into rounds, slice 1 bell pepper into strips, and cut 2 celery stalks into sticks. 2. Place 1/2 cup hummus in center of a serving plate. 3. Use the back of a spoon to create a shallow well in center of hummus, then drizzle with 1 tsp olive oil. 4. Optional: sprinkle hummus with paprika or za'atar for color and flavor. 5. Arrange vegetable sticks and whole grain crackers around the hummus in a visually appealing pattern. 6. For homemade hummus: blend 1 can drained chickpeas, 2 tbsp tahini, 1 clove garlic, 2 tbsp lemon juice, 2 tbsp olive oil, salt, and pepper until smooth.",
    mealType: "snack",
  },
];

// Meal suggestion data is retained as is

export default function Index() {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Filter meals by type
  const filteredMeals =
    selectedFilter === "all"
      ? mealSuggestions
      : mealSuggestions.filter((meal) => meal.mealType === selectedFilter);

  // Modal to show meal details
  const MealDetailModal = ({ meal, onClose }) => {
    if (!meal) return null;

    return (
      <View className="absolute inset-0 bg-black/70 flex justify-center items-center p-5">
        <View className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-xl">
          <Image
            source={
              typeof meal.image === "string" ? { uri: meal.image } : meal.image
            }
            className="w-full h-36"
            resizeMode="cover"
          />

          <ScrollView className="p-5" style={{ maxHeight: "70%" }}>
            <Text className="text-2xl font-bold mb-2 text-primary">
              {meal.name}
            </Text>
            <Text className="text-xs text-primary font-medium uppercase mb-3">
              {meal.mealType}
            </Text>

            <Text className="mb-4 text-gray-700 leading-relaxed">
              {meal.description}
            </Text>

            <View className="flex-row justify-between mb-4 bg-primary/10 p-3 rounded-xl">
              <View className="items-center">
                <Text className="text-xs text-gray-500">Calories</Text>
                <Text className="font-bold text-primary">{meal.calories}</Text>
              </View>
              <View className="items-center">
                <Text className="text-xs text-gray-500">Protein</Text>
                <Text className="font-bold text-primary">{meal.protein}g</Text>
              </View>
              <View className="items-center">
                <Text className="text-xs text-gray-500">Carbs</Text>
                <Text className="font-bold text-primary">{meal.carbs}g</Text>
              </View>
              <View className="items-center">
                <Text className="text-xs text-gray-500">Fat</Text>
                <Text className="font-bold text-primary">{meal.fat}g</Text>
              </View>
            </View>

            <Text className="font-bold mb-2 text-primary">Ingredients:</Text>
            <View className="bg-gray-50 p-3 rounded-xl mb-4">
              {meal.ingredients.map((ingredient, index) => (
                <View key={index} className="flex-row items-center mb-1">
                  <View className="h-2 w-2 rounded-full bg-primary mr-2" />
                  <Text className="text-gray-700">{ingredient}</Text>
                </View>
              ))}
            </View>

            <Text className="font-bold mb-2 text-primary">How to Cook:</Text>
            <Text className="mb-6 text-gray-700 leading-relaxed">
              {meal.cookingInstructions}
            </Text>
          </ScrollView>

          <View className="p-4 border-t border-gray-200">
            <TouchableOpacity
              className="bg-primary py-3 rounded-xl items-center"
              onPress={onClose}
            >
              <Text className="text-white font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="bg-white flex-1">
      <View className="mt-10 mb-5 ml-5">
        <Text className="text-primary text-3xl font-bold">
          Meal Suggestions
        </Text>
        <View className="h-1.5 w-20 bg-primary rounded-full mt-2" />
      </View>

      {/* Meal type filter */}
      <View className="px-4 mb-4 pt-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mb-4"
        >
          <TouchableOpacity
            className={`mr-2 px-4 py-2 rounded-full ${
              selectedFilter === "all" ? "bg-primary" : "bg-gray-100"
            }`}
            onPress={() => setSelectedFilter("all")}
          >
            <Text
              className={
                selectedFilter === "all"
                  ? "text-white font-medium"
                  : "text-gray-600"
              }
            >
              All Meals
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`mr-2 px-4 py-2 rounded-full ${
              selectedFilter === "breakfast" ? "bg-primary" : "bg-gray-100"
            }`}
            onPress={() => setSelectedFilter("breakfast")}
          >
            <Text
              className={
                selectedFilter === "breakfast"
                  ? "text-white font-medium"
                  : "text-gray-600"
              }
            >
              Breakfast
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`mr-2 px-4 py-2 rounded-full ${
              selectedFilter === "lunch" ? "bg-primary" : "bg-gray-100"
            }`}
            onPress={() => setSelectedFilter("lunch")}
          >
            <Text
              className={
                selectedFilter === "lunch"
                  ? "text-white font-medium"
                  : "text-gray-600"
              }
            >
              Lunch
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`mr-2 px-4 py-2 rounded-full ${
              selectedFilter === "dinner" ? "bg-primary" : "bg-gray-100"
            }`}
            onPress={() => setSelectedFilter("dinner")}
          >
            <Text
              className={
                selectedFilter === "dinner"
                  ? "text-white font-medium"
                  : "text-gray-600"
              }
            >
              Dinner
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`mr-2 px-4 py-2 rounded-full ${
              selectedFilter === "snack" ? "bg-primary" : "bg-gray-100"
            }`}
            onPress={() => setSelectedFilter("snack")}
          >
            <Text
              className={
                selectedFilter === "snack"
                  ? "text-white font-medium"
                  : "text-gray-600"
              }
            >
              Snacks
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView className="px-4">
        <Text className="text-lg font-semibold mb-4">
          Recommended meals for your health goals
        </Text>

        <View className="flex-row flex-wrap justify-between">
          {filteredMeals.map((meal) => (
            <TouchableOpacity
              key={meal.id}
              className="w-[48%] mb-4 rounded-xl overflow-hidden shadow-md bg-white"
              onPress={() => setSelectedMeal(meal)}
            >
              <Image
                source={
                  typeof meal.image === "string"
                    ? { uri: meal.image }
                    : meal.image
                }
                className="w-full h-32"
                resizeMode="cover"
              />
              <View className="p-3">
                <Text className="font-bold text-sm" numberOfLines={1}>
                  {meal.name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <View className="h-2 w-2 rounded-full bg-primary mr-1" />
                  <Text className="text-xs text-gray-500 capitalize">
                    {meal.mealType}
                  </Text>
                </View>
                <View className="flex-row mt-2 justify-between items-center">
                  <View className="flex-row items-center">
                    <Text className="text-xs font-medium">
                      {meal.calories} cal
                    </Text>
                    <Text className="text-xs text-gray-500 mx-1">•</Text>
                    <Text className="text-xs text-gray-500">
                      {meal.protein}g protein
                    </Text>
                  </View>
                  <View className="h-5 w-5 rounded-full bg-primary/10 items-center justify-center">
                    <Text className="text-xs text-primary font-bold">+</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View className="h-20" />
      </ScrollView>

      {selectedMeal && (
        <MealDetailModal
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
        />
      )}
    </View>
  );
}
