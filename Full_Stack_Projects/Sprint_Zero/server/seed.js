// Seeds the Lab Quest library with a curated set of kid-friendly experiments,
// a demo user, and a few rater users so averages are non-trivial.
// Idempotent: re-running resets the library and seeded ratings to a known state.
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { db, initSchema } = require('./db');

initSchema();

// Stable, UUID-shaped id derived from a seed string so re-seeding is idempotent.
function stableId(seed) {
  const h = crypto.createHash('sha256').update(seed).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

const experiments = [
  {
    title: 'Does light make bean sprouts grow faster?',
    summary: 'Grow bean seeds in light and in the dark, then see which sprouts win the race.',
    subject: 'Biology', difficulty: 'Easy', time_band: 'Multiple days', cost_band: 'Free',
    materials: ['4 dried beans', '2 clear cups', 'Paper towels', 'Water'],
    steps: [
      'Wrap two beans in a wet paper towel and place them in each cup.',
      'Put one cup on a sunny windowsill and one in a dark cupboard.',
      'Keep the paper towels damp and check both cups every day for a week.',
      'Measure the sprouts and compare which one grew taller.',
    ],
  },
  {
    title: 'Make a volcano erupt in your kitchen',
    summary: 'Mix baking soda and vinegar to create a bubbly, fizzy eruption you can watch.',
    subject: 'Chemistry', difficulty: 'Easy', time_band: 'Under an hour', cost_band: 'Low',
    materials: ['Baking soda', 'Vinegar', 'Dish soap', 'A small bottle', 'Red food coloring'],
    steps: [
      'Put two spoons of baking soda into the bottle.',
      'Add a squirt of dish soap and a few drops of food coloring.',
      'Quickly pour in half a cup of vinegar.',
      'Step back and watch the fizzy lava bubble out.',
    ],
  },
  {
    title: 'Build a balloon-powered car',
    summary: 'Turn the air from a balloon into a push that rolls a little car across the floor.',
    subject: 'Physics', difficulty: 'Intermediate', time_band: 'A few hours', cost_band: 'Low',
    materials: ['A balloon', 'A plastic bottle', '4 bottle caps', '2 straws', '2 skewers', 'Tape'],
    steps: [
      'Tape the straws under the bottle and slide a skewer through each as an axle.',
      'Push a bottle cap onto each end of the skewers to make wheels.',
      'Tape the balloon opening around a straw and tape it onto the bottle.',
      'Blow up the balloon through the straw, set the car down, and let go.',
    ],
  },
  {
    title: 'Grow your own rainbow crystals',
    summary: 'Dissolve sugar in hot water and watch sparkly crystals slowly grow on a string.',
    subject: 'Chemistry', difficulty: 'Intermediate', time_band: 'Multiple days', cost_band: 'Low',
    materials: ['Sugar', 'Water', 'A jar', 'A wooden skewer', 'A clothes pin', 'Food coloring'],
    steps: [
      'Ask an adult to help you stir lots of sugar into hot water until no more dissolves.',
      'Add a few drops of food coloring and pour the mixture into a jar.',
      'Hang a skewer from a clothes pin so it dangles in the liquid.',
      'Wait about a week and watch crystals grow on the skewer.',
    ],
  },
  {
    title: 'Which paper towel is the strongest?',
    summary: 'Test different paper towels to find out which brand holds the most weight when wet.',
    subject: 'Physics', difficulty: 'Easy', time_band: 'Under an hour', cost_band: 'Low',
    materials: ['3 brands of paper towel', 'Water', 'Coins', 'A cup', 'A rubber band'],
    steps: [
      'Stretch one wet paper towel over a cup and hold it with a rubber band.',
      'Gently add coins one at a time to the middle of the towel.',
      'Count how many coins it holds before it tears.',
      'Repeat with each brand and compare the results.',
    ],
  },
  {
    title: 'Make invisible ink with lemon juice',
    summary: 'Write a secret message that only appears when you warm the paper.',
    subject: 'Chemistry', difficulty: 'Easy', time_band: 'Under an hour', cost_band: 'Free',
    materials: ['A lemon', 'Water', 'A cotton swab', 'White paper', 'A lamp'],
    steps: [
      'Squeeze the lemon and mix the juice with a few drops of water.',
      'Dip the cotton swab in the juice and write a message on the paper.',
      'Let the paper dry completely so the writing disappears.',
      'Hold the paper near a warm lamp and watch your message appear.',
    ],
  },
  {
    title: 'Float an egg in salty water',
    summary: 'Discover how adding salt to water can make a sinking egg float to the top.',
    subject: 'Physics', difficulty: 'Easy', time_band: 'Under an hour', cost_band: 'Free',
    materials: ['An egg', 'A tall glass', 'Water', 'Salt', 'A spoon'],
    steps: [
      'Fill the glass with water and gently lower the egg in — it sinks.',
      'Take the egg out and stir in several spoons of salt.',
      'Put the egg back into the salty water.',
      'Watch the egg float and think about why salt water is denser.',
    ],
  },
  {
    title: 'Build a mini water filter',
    summary: 'Clean dirty water using sand, gravel, and cotton — just like nature does.',
    subject: 'Environmental Science', difficulty: 'Intermediate', time_band: 'A few hours', cost_band: 'Low',
    materials: ['A plastic bottle', 'Sand', 'Gravel', 'Cotton balls', 'Dirty water', 'A cup'],
    steps: [
      'Ask an adult to cut the bottom off the bottle and flip it upside down.',
      'Layer cotton, then sand, then gravel inside the bottle.',
      'Slowly pour dirty water through the top.',
      'Catch the water in a cup and see how much clearer it looks.',
    ],
  },
  {
    title: 'Watch a rainbow appear with a glass of water',
    summary: 'Use sunlight and water to split white light into all the colors of the rainbow.',
    subject: 'Physics', difficulty: 'Easy', time_band: 'Under an hour', cost_band: 'Free',
    materials: ['A glass of water', 'A sheet of white paper', 'A sunny window'],
    steps: [
      'Place the glass of water at the edge of a sunny table.',
      'Put the white paper on the floor where the sunlight lands.',
      'Move the glass until light shines through it onto the paper.',
      'Look for a rainbow of colors on the paper.',
    ],
  },
  {
    title: 'Test which fruits make the best battery',
    summary: 'Turn lemons and other fruits into a battery strong enough to power a tiny light.',
    subject: 'Physics', difficulty: 'Advanced', time_band: 'A few hours', cost_band: 'Medium',
    materials: ['Lemons', 'Copper coins', 'Zinc nails', 'Alligator wires', 'A small LED'],
    steps: [
      'Push a coin and a nail into each lemon, keeping them apart.',
      'Connect the lemons in a row using the wires (coin to nail).',
      'Attach the two free ends to the legs of the LED.',
      'See if the fruit battery makes the LED glow and try more lemons.',
    ],
  },
  {
    title: 'Grow mold on bread (on purpose!)',
    summary: 'Find out what conditions make bread go moldy the fastest.',
    subject: 'Biology', difficulty: 'Easy', time_band: 'Multiple days', cost_band: 'Free',
    materials: ['Slices of bread', 'Zip bags', 'Water', 'A marker'],
    steps: [
      'Put one dry slice and one damp slice into separate labeled bags.',
      'Place one bag in a warm spot and one in the fridge.',
      'Check the bags every day without opening them.',
      'Record which bread grows mold first and why.',
    ],
  },
  {
    title: 'Make a cloud in a jar',
    summary: 'Create a real little cloud inside a jar using warm water and ice.',
    subject: 'Earth Science', difficulty: 'Intermediate', time_band: 'Under an hour', cost_band: 'Low',
    materials: ['A glass jar', 'Warm water', 'Ice cubes', 'A metal lid or plate', 'Matches (adult only)'],
    steps: [
      'Pour a little warm water into the jar and swirl it around.',
      'Ask an adult to drop in a quick puff of smoke from a match.',
      'Put a plate of ice cubes on top of the jar.',
      'Watch a cloud form inside, then lift the plate to let it escape.',
    ],
  },
  {
    title: 'Race toy boats with soap power',
    summary: 'Use a drop of dish soap to push a paper boat across a tray of water.',
    subject: 'Physics', difficulty: 'Easy', time_band: 'Under an hour', cost_band: 'Free',
    materials: ['Paper or foam', 'Scissors', 'A tray of water', 'Dish soap'],
    steps: [
      'Cut a small boat shape with a notch at the back.',
      'Float the boat at one end of the tray of water.',
      'Put one drop of dish soap in the notch.',
      'Watch the boat zoom forward and time how far it goes.',
    ],
  },
  {
    title: 'Find out if plants drink colored water',
    summary: 'Put white flowers in colored water and watch the petals change color.',
    subject: 'Biology', difficulty: 'Easy', time_band: 'Multiple days', cost_band: 'Low',
    materials: ['White flowers (like carnations)', 'Cups', 'Water', 'Food coloring'],
    steps: [
      'Fill each cup with water and add a different food coloring.',
      'Put one white flower in each cup.',
      'Leave the flowers for one to two days.',
      'Look closely at the petals to see the colors the plant drank up.',
    ],
  },
  {
    title: 'Build the tallest spaghetti tower',
    summary: 'Engineer a tall tower using only spaghetti and marshmallows to learn about structures.',
    subject: 'Physics', difficulty: 'Intermediate', time_band: 'A few hours', cost_band: 'Low',
    materials: ['Dry spaghetti', 'Mini marshmallows', 'A ruler'],
    steps: [
      'Connect pieces of spaghetti using marshmallows as joints.',
      'Start with a strong triangle-shaped base.',
      'Keep building upward, adding supports so it does not tip.',
      'Measure your tower and try to beat your own record.',
    ],
  },
  {
    title: 'Test how clean your hands really are',
    summary: 'Use bread slices to show why washing your hands with soap matters.',
    subject: 'Biology', difficulty: 'Easy', time_band: 'Multiple days', cost_band: 'Free',
    materials: ['Slices of bread', 'Zip bags', 'Soap and water', 'A marker'],
    steps: [
      'Touch one slice with dirty hands and seal it in a labeled bag.',
      'Wash your hands with soap, then touch another slice and bag it.',
      'Keep a third untouched slice as a control.',
      'Check the bags over a week and see which grows the most mold.',
    ],
  },
  {
    title: 'Measure the temperature of different colors',
    summary: 'Find out whether dark or light colors heat up faster in the sun.',
    subject: 'Environmental Science', difficulty: 'Intermediate', time_band: 'A few hours', cost_band: 'Low',
    materials: ['Black paper', 'White paper', '2 thermometers', 'A sunny spot'],
    steps: [
      'Place a thermometer under a sheet of black paper.',
      'Place another thermometer under a sheet of white paper.',
      'Leave both in direct sunlight for 30 minutes.',
      'Compare the temperatures and decide which color got hotter.',
    ],
  },
  {
    title: 'Make a homemade lava lamp',
    summary: 'Combine oil, water, and a fizzy tablet to make colorful blobs rise and fall.',
    subject: 'Chemistry', difficulty: 'Easy', time_band: 'Under an hour', cost_band: 'Low',
    materials: ['A clear bottle', 'Vegetable oil', 'Water', 'Food coloring', 'Fizzy antacid tablets'],
    steps: [
      'Fill the bottle most of the way with oil and add water near the bottom.',
      'Drop in a few drops of food coloring and watch it sink.',
      'Break a fizzy tablet into pieces and drop one in.',
      'Watch the colorful blobs float up and down like a lava lamp.',
    ],
  },
];

// Upsert experiments by their stable id. We intentionally do NOT delete user
// data (saved_items, ratings) here — re-seeding must never wipe what real
// signups have saved or rated. Experiment ids are stable, so saves/ratings
// that reference them stay valid across re-seeds.
const insertExp = db.prepare(`INSERT INTO experiments
  (id, title, summary, subject, difficulty, time_band, cost_band, materials, steps)
  VALUES (?,?,?,?,?,?,?,?,?)
  ON CONFLICT(id) DO UPDATE SET
    title=excluded.title, summary=excluded.summary, subject=excluded.subject,
    difficulty=excluded.difficulty, time_band=excluded.time_band,
    cost_band=excluded.cost_band, materials=excluded.materials, steps=excluded.steps`);

const expIds = [];
for (const e of experiments) {
  const id = stableId('exp:' + e.title);
  expIds.push(id);
  insertExp.run(id, e.title, e.summary, e.subject, e.difficulty, e.time_band, e.cost_band,
    JSON.stringify(e.materials), JSON.stringify(e.steps));
}

// Create a user if missing; returns the user id.
function upsertUser(email, password) {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return existing.id;
  const id = crypto.randomUUID();
  db.prepare('INSERT INTO users (id, email, password_hash, created_at) VALUES (?,?,?,?)')
    .run(id, email, bcrypt.hashSync(password, 10), new Date().toISOString());
  return id;
}

const demoEmail = 'maya.patel@example.com';
const demoPassword = 'rocket123';
upsertUser(demoEmail, demoPassword);

// A simple, easy-to-type test account for trying the app.
const testEmail = 'test@labquest.app';
const testPassword = 'test1234';
upsertUser(testEmail, testPassword);

// A few extra kids so averages look real.
const raters = [
  upsertUser('liam.ng@example.com', 'science123'),
  upsertUser('ava.gomez@example.com', 'science123'),
  upsertUser('noah.kim@example.com', 'science123'),
];

const insRating = db.prepare(`INSERT INTO ratings (user_id, experiment_id, stars, created_at)
  VALUES (?,?,?,?)
  ON CONFLICT(user_id, experiment_id) DO UPDATE SET stars = excluded.stars`);

expIds.forEach((id, i) => {
  raters.forEach((rid, j) => {
    const stars = 3 + ((i + j) % 3); // spread of 3, 4, 5 stars
    insRating.run(rid, id, stars, new Date().toISOString());
  });
});

console.log('Seed complete.');
console.log('Experiments seeded:', expIds.length);
console.log('Demo login:');
console.log('  email:    ' + demoEmail);
console.log('  password: ' + demoPassword);
console.log('Test login:');
console.log('  email:    ' + testEmail);
console.log('  password: ' + testPassword);
