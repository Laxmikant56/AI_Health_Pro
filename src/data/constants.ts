
export const MEAL_DATA = {
  diabetic: {
    prediabetic: {
      meals: [
        { time: '6:00-6:30 AM', name: 'Early Morning Drink', options: ['Warm water with lemon juice + 1 tsp honey (optional)'], portion: '1 glass (250ml)' },
        { time: '8:00-8:30 AM', name: 'Breakfast', options: ['Vegetable oats upma (1 bowl) + unsweetened tea', '2 besan chilla + mint chutney', '2 boiled eggs + 1 slice whole wheat toast'], portion: '200-250 calories' },
        { time: '11:00 AM', name: 'Mid-Morning Snack', options: ['1 guava or 1 small apple'], portion: '1 medium fruit' },
        { time: '1:00-1:30 PM', name: 'Lunch', options: ['1-2 multigrain roti + 1 bowl moong dal + 1 bowl sautéed spinach + small side salad'], portion: '2-3 fist-sized servings total' },
        { time: '4:00 PM', name: 'Evening Snack', options: ['1 small handful roasted chana + 1 cup buttermilk'], portion: '30g roasted chana + 200ml buttermilk' },
        { time: '7:00-7:30 PM', name: 'Dinner', options: ['2 whole wheat roti + 1 bowl bottle gourd curry + ½ cup curd'], portion: '2-3 fist-sized servings total' },
        { time: '9:30 PM', name: 'Bedtime Snack (optional)', options: ['½ glass turmeric milk OR handful of almonds (8-10)'], portion: '150ml milk or 30g nuts' }
      ],
      exercise: { activity: 'Post-meal walks', duration: '10-15 minutes', frequency: 'After every meal, especially lunch and dinner', intensity: 'Light to moderate' },
      foods_include: ['Whole grains: Brown rice, millets, oats', 'Proteins: Moong dal, paneer, tofu, eggs', 'Vegetables: Spinach, bottle gourd, okra', 'Fruits: Guava, apple, pear', 'Nuts: Almonds, walnuts'],
      foods_avoid: ['White rice, white bread, refined flour', 'Sugary drinks and juices', 'Fried snacks', 'Processed foods', 'High sugar fruits']
    },
    mild: {
      meals: [
        { time: '6:00-6:30 AM', name: 'Early Morning Drink', options: ['Warm water with fenugreek seeds (soaked overnight)'], portion: '1 glass (250ml)' },
        { time: '8:00-8:30 AM', name: 'Breakfast', options: ['Ragi dosa (2 pieces) + coconut chutney', 'Moong dal chilla (1-2) + tomato chutney', 'Scrambled eggs (2) + 1 slice multigrain toast'], portion: '200-250 calories' },
        { time: '11:00 AM', name: 'Mid-Morning Snack', options: ['1 small bowl papaya cubes or cucumber slices with black salt'], portion: '1 cup raw vegetable' },
        { time: '1:00-1:30 PM', name: 'Lunch', options: ['1 bajra/jowar roti + 1 small bowl masoor dal + 1 cup bhindi sabzi + small salad'], portion: '2-3 fist-sized servings total' },
        { time: '4:00 PM', name: 'Evening Snack', options: ['1 cup roasted makhana OR handful of almonds + 1 small green apple'], portion: '30g nuts or 50g makhana' },
        { time: '7:00-7:30 PM', name: 'Dinner', options: ['2 roti (multigrain) + 1 small bowl bitter gourd curry + ½ cup paneer bhurji'], portion: '2 rotis + 1.5 cups sabzi + 50g paneer' },
        { time: '9:30 PM', name: 'Bedtime', options: ['1 boiled egg OR ½ glass warm milk with cinnamon (no sugar)'], portion: '1 egg or 150ml milk' }
      ],
      exercise: { activity: 'Brisk walking + light strength', duration: '30-45 minutes walking, 2x/week strength', frequency: 'Daily walking, 2x/week strength training', intensity: 'Moderate' },
      foods_include: ['Whole grains: Bajra, jowar, ragi', 'Proteins: Masoor dal, paneer, eggs, fish', 'Vegetables: Bitter gourd, okra, spinach', 'Fruits: Guava, papaya (small portions)', 'Herbs: Turmeric, cinnamon, fenugreek'],
      foods_avoid: ['All refined carbs', 'High sugar fruits', 'Sugary snacks', 'Fried foods', 'Full-fat dairy', 'Alcohol']
    },
    moderate: {
      meals: [
        { time: '6:00-6:30 AM', name: 'Early Morning Drink', options: ['Warm water + ½ tsp turmeric + 1 tsp apple cider vinegar'], portion: '1 glass (250ml)' },
        { time: '8:00-8:30 AM', name: 'Breakfast', options: ['Moong dal chilla (2 pieces) + mint chutney', 'Vegetable soup (1 bowl) + 2 boiled eggs', 'Ragi porridge (low-fat milk, no sugar) + 5-6 almonds'], portion: '150-200 calories' },
        { time: '11:00 AM', name: 'Mid-Morning Snack', options: ['1 small bowl vegetable salad OR 5-6 almonds'], portion: '1 cup raw vegetables or 20g nuts' },
        { time: '1:00-1:30 PM', name: 'Lunch', options: ['1 small multigrain roti + 1 bowl masoor dal + 1.5 cups lauki sabzi + ¼ cup curd'], portion: '1 roti + 2 cups total vegetables and dal' },
        { time: '4:00 PM', name: 'Evening Snack', options: ['1 cup clear vegetable soup OR roasted chana (small handful)'], portion: '1 cup soup or 20g roasted chana' },
        { time: '7:00-7:30 PM', name: 'Dinner', options: ['1 small roti + 1 small bowl bitter gourd curry + 2-3 oz grilled paneer or boiled chicken'], portion: '1 roti + 1.5 cups vegetables + 60-80g protein' },
        { time: '9:30 PM', name: 'Bedtime', options: ['½ glass warm turmeric milk OR 1 boiled egg'], portion: '150ml milk or 1 egg' }
      ],
      exercise: { activity: 'Structured exercise program', duration: '30 min post-lunch walk + general exercise', frequency: 'Daily 30min walk 2 hours after lunch + 3x/week strength', intensity: 'Moderate' },
      foods_include: ['Proteins (emphasis): Eggs, paneer, tofu, fish', 'Vegetables (emphasis): Bitter gourd, bottle gourd, okra, spinach', 'Limited grains: Small portions of bajra/jowar', 'Healthy fats: Almonds, walnuts', 'Herbs: Turmeric, cinnamon, fenugreek'],
      foods_avoid: ['All rice, wheat bread', 'ALL high sugar fruits', 'All sugary foods', 'Fried foods', 'Full-fat dairy', 'Honey, jaggery, sugar', 'Alcohol']
    }
  },
  gym: {
    fat_loss: {
      vegetarian: [
        { time: '60-90 min before gym', name: 'Pre-Workout', options: ['Banana + 1 tbsp peanut butter', '1 bowl oats + ½ banana', '1 apple + 5-6 almonds'], portion: '150-200 calories' },
        { time: 'Within 30-45 min after gym', name: 'Post-Workout', options: ['Moong dal chilla (2) + mint chutney', 'Paneer bhurji (1 bowl) + 1 multigrain roti', 'Greek yogurt (1 cup) + berries + flaxseeds', 'Sprouts salad'], portion: '250-300 calories, 30-35g protein' },
        { time: '7:00-7:30 AM', name: 'Breakfast', options: ['Oats + milk + chia seeds', 'Besan chilla (2) + whole wheat toast', '2 egg whites + 1 whole egg + toast', 'Idli (3-4) + sambar'], portion: '300-350 calories' },
        { time: '1:00-1:30 PM', name: 'Lunch', options: ['Brown rice (¾ cup) + rajma + salad', '2 multigrain roti + paneer tikka + mixed veg', 'Quinoa salad with chickpeas', 'Dal khichdi + salad + curd'], portion: '450-500 calories' },
        { time: '4:00 PM', name: 'Evening Snack', options: ['Greek yogurt (¾ cup) + honey', 'Roasted chana (1 cup)', 'Mixed nuts (30g) + apple', 'Protein smoothie'], portion: '150-200 calories' },
        { time: '7:00-7:30 PM', name: 'Dinner', options: ['Paneer tikka (100g) + 1 roti + spinach', 'Tofu bhurji + roti + salad', 'Moong dal soup + 2 roti', 'Chickpea curry + brown rice'], portion: '350-400 calories' }
      ],
      non_vegetarian: [
        { time: '60-90 min before gym', name: 'Pre-Workout', options: ['1 boiled egg white + banana', '100g grilled chicken + sweet potato', 'Tuna sandwich'], portion: '150-200 calories' },
        { time: 'Within 30-45 min after gym', name: 'Post-Workout', options: ['Grilled chicken breast (100-120g) + steamed veg', 'Boiled eggs (2 whites + 1 whole) + sweet potato', 'Grilled fish (100g) + brown rice (½ cup)', 'Turkey breast + roti'], portion: '250-300 calories' },
        { time: '7:00-7:30 AM', name: 'Breakfast', options: ['Vegetable omelet (2 eggs) + toast + salad', 'Boiled eggs (2) + brown rice + veg', 'Grilled chicken (50g) + roti + spinach', 'Fish (80g) + brown bread'], portion: '300-350 calories' },
        { time: '1:00-1:30 PM', name: 'Lunch', options: ['Brown rice (¾ cup) + grilled chicken curry (150g) + salad', '2 roti + fish curry (150g) + veg', 'Chole + brown rice + veg', 'Lean meat curry + roti'], portion: '450-500 calories' },
        { time: '4:00 PM', name: 'Evening Snack', options: ['Boiled chicken breast (80g) + veg sticks', 'Hard-boiled eggs (2) + cucumber', 'Turkey breast (80g) + biscuit', 'Tuna salad'], portion: '150-200 calories' },
        { time: '7:00-7:30 PM', name: 'Dinner', options: ['Grilled chicken (150g) + roti + broccoli', 'Fish curry (150g) + brown rice + salad', 'Lean mutton (120g) + roti + veg', 'Shrimp (150g) + roti + sabzi'], portion: '350-400 calories' }
      ]
    },
    muscle_gain: {
      vegetarian: [
        { time: '60-90 min before gym', name: 'Pre-Workout', options: ['Oats with banana + milk', '2 slices brown bread + peanut butter + banana', 'Roti + banana + nuts'], portion: '300-400 calories' },
        { time: 'Within 30-45 min after gym', name: 'Post-Workout', options: ['Paneer bhurji (1.5 bowls) + 2 roti', 'Moong dal chilla (3-4) + roti + curd', 'Greek yogurt (1.5 cups) + granola + banana', 'Cottage cheese + brown rice + veg'], portion: '400-500 calories, 40-50g protein' },
        { time: '7:00-7:30 AM', name: 'Breakfast', options: ['Oats + milk + banana + almonds', 'Besan chilla (3-4) + milk + banana', 'Vegetable upma (1.5 bowls) + milk', 'Idli (5-6) + sambar + banana'], portion: '500-600 calories' },
        { time: '1:00-1:30 PM', name: 'Lunch', options: ['Brown rice (1.5 cups) + rajma (1.5 cups) + paneer curry + salad', '2-3 roti + chickpea curry + curd', 'Khichdi + dal + sabzi + paneer', 'Quinoa + lentil curry + paneer tikka'], portion: '700-800 calories' },
        { time: '4:00 PM', name: 'Evening Snack', options: ['Greek yogurt (1.5 cups) + granola + banana', 'Milk + banana + peanut butter shake', 'Cottage cheese + dry fruits', 'Protein smoothie with whey'], portion: '300-400 calories' },
        { time: '7:00-7:30 PM', name: 'Dinner', options: ['Paneer tikka masala (150g) + 2 roti + rice + salad', 'Dal makhani + 2 roti + paneer', 'Chickpea curry (2 cups) + 2 roti + curd', 'Tofu stir-fry + 2 roti + rice'], portion: '600-700 calories' }
      ],
      non_vegetarian: [
        { time: '60-90 min before gym', name: 'Pre-Workout', options: ['Chicken and rice (80g + 1 cup)', 'Egg sandwich (2 eggs + 2 slices bread)', 'Fish + sweet potato'], portion: '300-400 calories' },
        { time: 'Within 30-45 min after gym', name: 'Post-Workout', options: ['Chicken breast (150g) + white rice (1.5 cups) + veg', 'Boiled eggs (4 whites + 2 whole) + rice + salad', 'Fish fillet (150g) + sweet potato + broccoli', 'Turkey breast (150g) + brown rice'], portion: '400-500 calories' },
        { time: '7:00-7:30 AM', name: 'Breakfast', options: ['Vegetable omelet (3 eggs) + 2 brown bread + banana + milk', 'Boiled eggs (3) + brown rice + veg + milk', 'Grilled chicken (80g) + 2 roti + veg + milk', 'Fish (80g) + 2 bread + veg + milk'], portion: '500-600 calories' },
        { time: '1:00-1:30 PM', name: 'Lunch', options: ['White rice (2 cups) + chicken curry (200g) + dal + salad', '2-3 roti + fish curry (200g) + dal + veg + curd', 'Basmati rice (1.5 cups) + lean meat (180g) + dal', 'Brown rice + grilled chicken (200g) + veg'], portion: '700-800 calories' },
        { time: '4:00 PM', name: 'Evening Snack', options: ['Boiled eggs (2-3) + banana + milk', 'Chicken sandwich (100g + 2 bread + cheese)', 'Tuna + rice cakes', 'Paneer + banana + milk shake'], portion: '300-400 calories' },
        { time: '7:00-7:30 PM', name: 'Dinner', options: ['Chicken tikka masala (180g) + 2 roti + rice', 'Grilled fish (180g) + 2 roti + brown rice + salad', 'Lean mutton (150g) + 2 roti + dal + veg', 'Shrimp curry (180g) + 2 roti + rice'], portion: '600-700 calories' }
      ]
    }
  }
};

export const EXERCISE_DATA = {
  beginner_fat_loss: ['3-4 days/week gym', 'Cardio: 20-30 min moderate intensity (walking, cycling, swimming)', 'Strength: 2-3 days/week, 3 sets x 8-12 reps, compound movements', 'Flexibility: Yoga or stretching 2 days/week', 'Rest: 3-4 days minimum per week'],
  beginner_muscle_gain: ['3-4 days/week gym', 'Strength: Full-body workouts, 3-4 sets x 6-10 reps', 'Focus: Compound movements (squats, bench press, deadlifts, rows)', 'Cardio: Light, 15-20 min post-workout', 'Rest: 3-4 days minimum per week'],
  intermediate_fat_loss: ['4-5 days/week gym', 'Cardio: 30-40 min mixed intensity (HIIT + steady state)', 'Strength: 3-4 days/week, split routine, 3 sets x 10-15 reps', 'Flexibility: 2-3 days/week yoga or stretching', 'Active recovery: Light walking or yoga on rest days'],
  intermediate_muscle_gain: ['4-5 days/week gym', 'Strength: Upper/Lower split, 4 sets x 6-10 reps', 'Volume: Progressive overload each week', 'Cardio: 10-15 min post-workout, low intensity', 'Rest: Complete 2-3 days minimum per week'],
  advanced_fat_loss: ['5-6 days/week gym', 'Cardio: 40-50 min varied intensity', 'Strength: 4-5 days/week, advanced split', 'HIIT: 2-3 sessions per week', 'Active recovery daily'],
  advanced_muscle_gain: ['5-6 days/week gym', 'Strength: Advanced split routines, 4-5 sets x 6-12 reps', 'Volume: High volume training', 'Cardio: Minimal, 10 min post-workout', 'Deload week every 4-6 weeks']
};

export const IR_COEFFICIENTS = {
  intercept: 172.4,
  age: 0.085,
  gender: 1.25, // 1 for Male, 0 for Female
  thumb: -0.21,
  index: -0.18,
  meal: 12.5 // 1 for post-meal, 0 for fasting
};
