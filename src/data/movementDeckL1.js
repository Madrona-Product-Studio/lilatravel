/**
 * movementDeckL1.js — Lila Movements Level 1: The Practice
 * ═════════════════════════════════════════════════════════
 *
 * 31 cards: AUM opener + 6 sections × 5 cards each.
 * All content research-verified April 2026.
 */

export const MOVEMENT_DECK_L1 = [
  {
    id: 'the-practice',
    title: 'The Practice',
    subtitle: '30 poses for a complete practice',
    desc: 'A single flowing sequence — arrive, awaken, open, balance, ground, rest. Each section builds on the last. No prerequisites, no theory. Just the body and the breath.',
    accent: '#4A7A5A',
    opener: {
      id: 'aum',
      term: 'AUM',
      sanskrit: 'ॐ',
      image: 'aum.png',
      brief: 'The sound of the universe breathing. Before movement, before pose, before sequence — this.',
      mnemonic: 'A (belly) → U (chest) → M (skull) → silence (awareness). The vibration moves through the body and then stills.',
      tabs: [
        { label: 'Details', content: 'AUM (or OM) is considered the primordial sound in Hindu and yogic philosophy — the vibration from which all other sound and matter arises. Chanting it at the start of practice is an act of orientation: you are placing yourself within something larger than the session.' },
        { label: 'Sound', content: 'The three syllables — A, U, M — correspond to waking, dreaming, and deep sleep states. The silence that follows the M is the fourth state: pure awareness. When chanted, the vibration moves from the belly (A) to the chest (U) to the skull (M), then stills.' },
        { label: 'Tradition', content: 'Found across the Vedas, Upanishads, and Yoga Sūtras. Patañjali names AUM (praṇava) as the symbol of Īśvara — the principle of pure awareness — in Yoga Sūtras I.27. It is not a religious invocation but a tuning of attention.' },
      ],
    },
    groups: [
      {
        id: 'arrive',
        label: 'Arrive',
        subtitle: 'Coming into the body',
        desc: 'Coming into the body. These practices aren\'t warm-ups — they\'re the beginning of listening. Breath, movement, and gravity working together to bring you from wherever you\'ve been into where you are.',
        cards: [
          {
            id: 'diaphragmatic-breath',
            term: 'Diaphragmatic Breath',
            image: 'diaphragmatic-breath.png',
            brief: 'The breath most people have forgotten. Not chest breathing — a full breath that moves the belly, stabilizes the spine, and signals safety to the nervous system.',
            mnemonic: 'Good for any time you feel tight, stressed, or scattered before starting movement.',
            tabs: [
              { label: 'How to Enter', content: 'Lie on your back or sit tall. Place one hand on your chest, one on your belly. Breathe in through the nose — the belly hand should rise first, the chest hand barely at all. Exhale slowly through the nose or mouth. Let the belly fall. Five breaths like this to start.' },
              { label: 'What It Does', content: 'The diaphragm is the primary breathing muscle and a key spinal stabilizer. When it works properly, it creates internal pressure that supports the lower back before every movement. Chest breathing bypasses this system, keeps the body in a mild stress state, and over time contributes to back pain and tension. Relearning this breath is foundational to everything else.' },
              { label: 'Good For', content: 'Any time you feel tight, stressed, or scattered before starting movement.' },
            ],
          },
          {
            id: 'box-breathing',
            term: 'Box Breathing',
            sanskrit: 'Sama Vritti',
            image: 'box-breathing.png',
            brief: 'Four equal sides: inhale, hold, exhale, hold. A deliberate rhythm that calms the nervous system and sharpens focus.',
            mnemonic: 'Inhale 4, hold 4, exhale 4, hold 4. Used by military and emergency personnel before high-stakes situations.',
            tabs: [
              { label: 'How to Enter', content: 'Inhale for 4 counts. Hold for 4 counts. Exhale for 4 counts. Hold for 4 counts. Repeat 4–6 cycles. Start with a count that feels comfortable — 3 or 4 — and lengthen over time. Keep the breath smooth, not forced.' },
              { label: 'What It Does', content: 'Slow, structured breathing activates the parasympathetic nervous system — the rest-and-digest response. Regular practice lowers resting heart rate, reduces anxiety, and improves focus. The technique is used by military and emergency personnel before high-stakes situations precisely because it works quickly and requires nothing but breath.' },
              { label: 'Good For', content: 'Before meditation, before a challenging pose sequence, or any time the mind won\'t settle.' },
            ],
          },
          {
            id: 'ujjayi',
            term: 'Ujjayi',
            sanskrit: 'Ocean Breath',
            image: 'ujjayi.png',
            brief: 'A slight constriction at the back of the throat creates an ocean-like sound and an internal anchor for the entire practice.',
            mnemonic: 'Fog a mirror with your mouth closed. The sound is your feedback — if it stops or forces, something has tensed.',
            tabs: [
              { label: 'How to Enter', content: 'Breathe in through the nose. As you exhale, gently constrict the back of the throat — as if fogging a mirror, but with the mouth closed. You\'ll hear a soft, ocean-like sound. Apply this to both the inhale and exhale. The sound should be audible to you but not to someone nearby.' },
              { label: 'What It Does', content: 'Ujjayi links breath to movement and creates internal heat. The sound acts as a continuous feedback signal — if it stops or becomes forced, something in the body or mind has tensed up. It also slightly increases resistance in the airway, which may strengthen the breathing muscles over time, and creates a meditative focus point throughout practice.' },
              { label: 'Good For', content: 'Any flowing practice where you want breath and movement to stay connected.' },
            ],
          },
          {
            id: 'cat-cow',
            term: 'Cat-Cow',
            sanskrit: 'Marjaryasana–Bitilasana',
            image: 'cat-cow.png',
            brief: 'The spine\'s full range of motion, driven by the breath. As diagnostic as it is therapeutic.',
            mnemonic: 'Inhale = Cow (belly drops, chest opens). Exhale = Cat (spine rounds, tailbone tucks). Move slowly — notice where the spine resists.',
            tabs: [
              { label: 'How to Enter', content: 'Begin on hands and knees, wrists under shoulders, knees under hips. Inhale: let the belly drop, tailbone lifts, chest opens — this is Cow. Exhale: press the floor away, round the spine toward the ceiling, tuck the tailbone — this is Cat. Move slowly. Spend time noticing which segments of the spine move freely and which resist.' },
              { label: 'What It Does', content: 'Moving between full spinal flexion and full extension with the breath trains the coordination between the diaphragm and the pelvic floor. It reveals where the spine is stiff and where it overcompensates. Done slowly and attentively, it is one of the most effective tools for restoring spinal mobility and reducing morning stiffness.' },
              { label: 'Good For', content: 'First thing in the morning, or whenever the spine feels compressed and stiff.' },
            ],
          },
          {
            id: 'tadasana',
            term: 'Tadasana',
            sanskrit: 'Mountain Pose',
            image: 'tadasana.png',
            brief: 'The foundation of all standing poses. Every alignment principle in yoga begins here — stillness that is anything but passive.',
            mnemonic: 'Stand in true neutral. Root through four corners of each foot. Stack joints. Lengthen through the crown.',
            tabs: [
              { label: 'How to Enter', content: 'Stand with feet hip-width apart. Root through all four corners of both feet. Stack ankles, knees, hips, shoulders. Let arms hang naturally. Lengthen through the crown of the head. Hold for 5–10 breaths, noticing where your weight falls and where your body wants to compensate.' },
              { label: 'What It Does', content: 'Tadasana trains the postural muscles along the entire spine and teaches the nervous system what neutral alignment feels like. Most people have never stood in true neutral — they lean, compress, or hold in ways they can\'t feel anymore. Regular practice of this pose recalibrates how you stand, walk, and load your body in everything you do.' },
              { label: 'Good For', content: 'Resetting after long periods of sitting or driving before a hike or activity.' },
            ],
          },
        ],
      },
      {
        id: 'awaken',
        label: 'Awaken',
        subtitle: 'Building heat',
        desc: 'Waking the body up through its full range. The spine lengthens, the posterior chain opens, and the nervous system shifts from compressed to alive. Take your time here.',
        cards: [
          {
            id: 'standing-forward-bend',
            term: 'Standing Forward Bend',
            sanskrit: 'Uttanasana',
            image: 'standing-forward-bend.png',
            brief: 'Gravity does the work. The entire back of the body — from heel to skull — releases in one long, hanging fold.',
            mnemonic: 'Bend the knees generously. Let the head hang completely. The neck releases what the rest of the day compressed.',
            tabs: [
              { label: 'How to Enter', content: 'Stand feet hip-width. Inhale to lengthen. Exhale and hinge forward from the hips, bending the knees generously. Let the head hang completely — no effort in the neck. Hold opposite elbows. Stay 8–10 breaths. To come up, bend the knees, place hands on thighs, and rise slowly with a long spine.' },
              { label: 'What It Does', content: 'Bending the knees removes the hamstrings from the stretch and allows the lower back to release. The completely relaxed neck decompresses the top of the spine — a place most people carry significant tension. The head-below-heart position also activates the body\'s calming response, making this pose both a stretch and a reset.' },
              { label: 'Good For', content: 'After any activity that compresses the spine — running, cycling, backpacking, or a long day on your feet.' },
            ],
          },
          {
            id: 'downward-facing-dog',
            term: 'Downward-Facing Dog',
            sanskrit: 'Adho Mukha Svanasana',
            image: 'downward-facing-dog.png',
            brief: 'The full-body integration pose. Lengthens the back of the body while strengthening the front — rare to find both in one shape.',
            mnemonic: 'Press the floor away. Pedal the feet. Release the neck. It gets more open each time you return to it.',
            tabs: [
              { label: 'How to Enter', content: 'From hands and knees, tuck the toes and lift the hips toward the ceiling. Press the floor away with straight arms. Pedal the feet a few times to warm the calves, then press both heels toward the floor. Release the neck — head between the arms. Hold 5–10 breaths.' },
              { label: 'What It Does', content: 'Downward dog stretches the calves, hamstrings, and back while strengthening the shoulders, arms, and core simultaneously. The ankle bend required reveals calf and Achilles tightness immediately. As the body warms up, the chest moves toward the thighs and the spine lengthens — it becomes more open each time you return to it during practice.' },
              { label: 'Good For', content: 'Between standing poses to reset, or as a morning wake-up when the whole body feels stiff.' },
            ],
          },
          {
            id: 'plank',
            term: 'Plank',
            sanskrit: 'Phalakasana',
            image: 'plank.png',
            brief: 'The body as one long line. Plank builds the strength that makes every other pose safer.',
            mnemonic: 'Hands under shoulders. One line from head to heel. Press the floor away — don\'t let the chest sink.',
            tabs: [
              { label: 'How to Enter', content: 'From hands and knees, step feet back until the body forms a straight line from head to heel. Hands under shoulders, fingers spread. Press the floor away — don\'t let the chest sink toward it. Draw the lower belly gently in. Keep the head in line with the spine. Hold 5–10 breaths or build up gradually.' },
              { label: 'What It Does', content: 'Plank strengthens the entire front of the body — shoulders, chest, core, and hip flexors — in one integrated position. More importantly, it trains the body to hold its structure under load, which directly transfers to every standing and balancing pose. The most common error is letting the hips sag or rise — both indicate the core isn\'t engaging.' },
              { label: 'Good For', content: 'Building the baseline strength needed before arm balances, or any time you want a full-body wake-up.' },
            ],
          },
          {
            id: 'upward-dog',
            term: 'Upward-Facing Dog',
            sanskrit: 'Urdhva Mukha Svanasana',
            image: 'upward-dog.png',
            brief: 'A backbend that opens the front of the body — chest, hip flexors, and abdomen — in one active arc.',
            mnemonic: 'Thighs off the floor is what distinguishes this from Cobra. Roll shoulders back. Don\'t crane the neck.',
            tabs: [
              { label: 'How to Enter', content: 'From prone, place hands under shoulders. Press the floor away and lift the chest, keeping the tops of the feet pressing down. Straighten the arms fully, lifting the thighs off the floor. Roll the shoulders back and down. Lift the gaze slightly — don\'t crane the neck back sharply. Hold 3–5 breaths.' },
              { label: 'What It Does', content: 'Upward dog reverses the forward-collapsed posture most people carry through the day. It opens the chest and the front of the hips while strengthening the muscles along the spine. The key distinction from Cobra is the lifted thighs — this keeps the pose active and prevents compression in the lower back.' },
              { label: 'Good For', content: 'Counteracting hours of sitting or forward-leaning posture.' },
            ],
          },
          {
            id: 'chair',
            term: 'Chair Pose',
            sanskrit: 'Utkatasana',
            image: 'chair-pose.png',
            brief: 'Sitting in an invisible chair. The legs work hard, the spine stays long, and the whole body wakes up at once.',
            mnemonic: 'Weight in the heels. Chest lifted. The challenge is maintaining an upright torso as the legs fatigue.',
            tabs: [
              { label: 'How to Enter', content: 'Stand with feet hip-width or together. Inhale, then as you exhale bend the knees and sit back as if lowering onto a chair. Keep the chest lifted — resist the urge to fold forward. Arms reach overhead or forward. Weight stays in the heels. Hold 5–8 breaths.' },
              { label: 'What It Does', content: 'Chair pose strengthens the quads, glutes, and lower back simultaneously while demanding that the spine stay long under load. It builds the leg strength that protects the knees on descents and the lower back during lifting. The challenge is maintaining an upright torso as the legs fatigue — this is where the real work happens.' },
              { label: 'Good For', content: 'Building leg and lower back endurance before a day of hiking, especially if descents are planned.' },
            ],
          },
        ],
      },
      {
        id: 'open',
        label: 'Open',
        subtitle: 'Creating space',
        desc: 'The hips, shoulders, and thoracic spine have the most to release. These poses go into the places that tighten most under modern life — long days at a desk, long hours in a car, sustained stress.',
        cards: [
          {
            id: 'warrior-1',
            term: 'Warrior I',
            sanskrit: 'Virabhadrasana I',
            image: 'warrior-i.png',
            brief: 'Strength and openness at once. The back hip flexor stretches while the front leg builds power.',
            mnemonic: 'Front knee at 90°. Back foot at 45°. Square the hips forward — that\'s where the deepest stretch lives.',
            tabs: [
              { label: 'How to Enter', content: 'Step one foot back 3–4 feet. Front knee bends to 90° over the ankle. Back foot turns out 45°. Square the hips toward the front. Raise arms overhead. Hold 5–8 breaths, then switch sides.' },
              { label: 'What It Does', content: 'Warrior I stretches the hip flexors of the back leg — the deep muscles that shorten with prolonged sitting — while strengthening the quad and glute of the front leg. Squaring the hips requires real effort, which is where the deepest stretch lives. It also builds single-leg stability essential for uneven terrain.' },
              { label: 'Good For', content: 'Tight hips and lower back after long days sitting, driving, or in a saddle.' },
            ],
          },
          {
            id: 'warrior-ii',
            term: 'Warrior II',
            sanskrit: 'Virabhadrasana II',
            image: 'warrior-ii.png',
            brief: 'Wide and grounded. Arms extended like the horizon, gaze steady, the whole body working in the frontal plane.',
            mnemonic: 'Front knee at 90° over ankle. Arms at shoulder height. Gaze over the front hand. If the knee drifts inward, the outer hip needs work.',
            tabs: [
              { label: 'How to Enter', content: 'Step one foot back 3–4 feet. Front foot points forward, back foot turns 90°. Bend the front knee to 90° — directly over the ankle. Extend arms to shoulder height, parallel to the floor. Face the side. Gaze over the front hand. Hold 5–10 breaths, then switch.' },
              { label: 'What It Does', content: 'Warrior II strengthens the outer hip and thigh of the front leg while building endurance in the shoulders and upper back. It works in the side-to-side plane — a direction that gets far less attention than forward and back movement in most training. The common error is the front knee drifting inward, which reveals that the outer hip needs more attention.' },
              { label: 'Good For', content: 'Building the hip stability needed for traversing uneven or sloped terrain.' },
            ],
          },
          {
            id: 'deep-squat',
            term: 'Deep Squat',
            sanskrit: 'Malasana',
            image: 'deep-squat.png',
            brief: 'The deepest ankle bend in yoga — and the one that reveals most about what the whole lower body can and can\'t do.',
            mnemonic: 'If heels rise, place a blanket beneath them. Limited ankle mobility is one of the most overlooked sources of knee and back pain.',
            tabs: [
              { label: 'How to Enter', content: 'Stand feet slightly wider than hip-width, toes turned out 30–45°. Lower into a deep squat toward the floor. Press elbows into inner knees to open the hips. If the heels rise, place a folded blanket beneath them. Hold 5–10 breaths.' },
              { label: 'What It Does', content: 'Limited ankle mobility is one of the most overlooked contributors to knee pain, back pain, and poor squat mechanics. When the ankles can\'t bend fully, everything above them compensates — heels rise, knees collapse inward, lower back rounds. Regular practice of this pose gradually restores that ankle range, and when it does, every squat, step, and landing tends to improve with it.' },
              { label: 'Good For', content: 'Any time the ankles feel tight, or as preparation before activities involving repeated step-downs or descents.' },
            ],
          },
          {
            id: 'half-lord-of-the-fishes',
            term: 'Half Lord of the Fishes',
            sanskrit: 'Ardha Matsyendrasana',
            image: 'half-spinal-twist.png',
            brief: 'The seated spinal twist — specifically for the upper and mid back, which is where rotation should come from.',
            mnemonic: 'Inhale to grow taller. Exhale to deepen the twist from the mid-back. The lower back should stay relatively still.',
            tabs: [
              { label: 'How to Enter', content: 'Sit with both legs extended. Bend the right knee and cross the right foot outside the left knee. Inhale to lengthen the spine upward. Exhale and rotate to the right, placing the left elbow outside the right knee. Right hand on the floor behind you. With each inhale, grow taller. With each exhale, deepen the rotation from the mid-back. Hold 5–8 breaths, then switch.' },
              { label: 'What It Does', content: 'The mid and upper spine has the most rotation available — but most people twist from the lower back instead, because the upper spine is stiffer. This pose teaches the body to rotate from the right place. Done correctly, it relieves tension across the upper back and between the shoulder blades that nothing else quite reaches.' },
              { label: 'Good For', content: 'Upper back tightness, or after activities that involve repetitive rotation in one direction.' },
            ],
          },
          {
            id: 'pigeon-prep',
            term: 'Pigeon Prep',
            sanskrit: 'Eka Pada Rajakapotasana',
            image: 'pigeon-prep.png',
            brief: 'The deepest hip opener in yoga. Goes directly to the place that tightens most — and protects the knee and lower back when it releases.',
            mnemonic: 'From downward dog, bring the knee to the wrist, shin diagonal. Square the hips. Fold forward. Hold and breathe.',
            tabs: [
              { label: 'How to Enter', content: 'From downward dog, bring the right knee toward the right wrist. Lower the shin toward diagonal. Lower the back knee to the mat, extending the back leg straight behind. Square the hips down. Inhale to lengthen, then exhale and fold forward over the front shin. Hold 5–10 breaths, then switch sides.' },
              { label: 'What It Does', content: 'The hip rotators — deep muscles beneath the glutes — are among the most commonly tight in people who sit, run, or cycle. When they\'re restricted, the lower back and knee compensate. Pigeon prep is a long, sustained stretch directly into this group. The release, over repeated practice, reduces load on both the knee and the spine.' },
              { label: 'Good For', content: 'Hip tightness after running, cycling, or long days in the car. One of the most effective recovery poses available.' },
            ],
          },
        ],
      },
      {
        id: 'balance',
        label: 'Balance',
        subtitle: 'Finding center',
        desc: 'Single-leg and lateral demands that reveal where stability lives and where it doesn\'t. Balance poses aren\'t about perfection — they\'re about the information that wobbling provides.',
        cards: [
          {
            id: 'triangle-pose',
            term: 'Triangle Pose',
            sanskrit: 'Trikonasana',
            image: 'triangle-pose.png',
            brief: 'A full-length lateral stretch — the side of the body rarely gets this kind of attention.',
            mnemonic: 'Keep both sides of the waist long. Chest open toward the ceiling, not rotated toward the floor.',
            tabs: [
              { label: 'How to Enter', content: 'Stand with feet 3–4 feet apart. Right foot forward, left foot turned 90°. Extend arms to a T. Inhale to lengthen. Exhale and hinge sideways over the right leg, reaching the right hand toward the shin, ankle, or a block. Left arm reaches to the ceiling. Keep both sides of the waist long. Hold 5–8 breaths, then switch.' },
              { label: 'What It Does', content: 'Triangle pose lengthens the entire side of the body — from the outer ankle up through the hip, waist, and ribs — while strengthening the outer hip of the standing leg. Most movement happens forward and back; the side-to-side plane is underworked and often surprisingly tight. The key is keeping the chest open toward the ceiling rather than rotating toward the floor.' },
              { label: 'Good For', content: 'Side-body tightness, or after activities that compress one side more than the other.' },
            ],
          },
          {
            id: 'tree',
            term: 'Tree Pose',
            sanskrit: 'Vrksasana',
            image: 'tree-pose.png',
            brief: 'Balance on one leg, root through the foot, grow through the crown. Simple in concept, revealing in practice.',
            mnemonic: 'Foot on inner calf or thigh — never the knee. Press foot and leg into each other equally. The wobble is information.',
            tabs: [
              { label: 'How to Enter', content: 'Stand on one foot. Bring the other foot to the inner calf or inner thigh — not the knee. Press the foot and inner leg into each other equally. Bring hands to heart or raise them overhead. Fix your gaze on a still point. Hold 5–10 breaths, then switch.' },
              { label: 'What It Does', content: 'Single-leg balance demands full coordination between the foot, ankle, hip, and core. The wobble is information — it shows exactly where that coordination is weakest. Regular practice improves proprioception (the body\'s sense of its own position), which directly reduces ankle sprains and improves stability on uneven ground.' },
              { label: 'Good For', content: 'Improving ankle stability and body awareness before technical terrain.' },
            ],
          },
          {
            id: 'warrior-3',
            term: 'Warrior III',
            sanskrit: 'Virabhadrasana III',
            image: 'warrior-iii.png',
            brief: 'The body as a single horizontal line — demanding strength, balance, and attention all at once.',
            mnemonic: 'Keep both hips square to the floor. Use a wall or chair while building strength. The hip of the lifted leg wants to rotate open.',
            tabs: [
              { label: 'How to Enter', content: 'From standing, shift weight onto one foot. Hinge forward from the hip, extending the back leg as the torso lowers toward horizontal. Arms reach forward or rest on hips. Keep both hips square to the floor. Hold 5–8 breaths, then switch. Use a wall or chair for support while building strength.' },
              { label: 'What It Does', content: 'Warrior III strengthens the standing leg\'s glute and hamstring while demanding balance throughout the whole body. It trains the body to maintain alignment under real load — a direct transfer to walking, running, and climbing on uneven terrain. The most common collapse is in the hip of the lifted leg rotating open.' },
              { label: 'Good For', content: 'Building the single-leg strength and balance needed for trail running, scrambling, or any uneven surface.' },
            ],
          },
          {
            id: 'half-moon',
            term: 'Half Moon',
            sanskrit: 'Ardha Chandrasana',
            image: 'half-moon.png',
            brief: 'Balance, lateral strength, and openness combined. The body opens like a door — both sides visible at once.',
            mnemonic: 'From Triangle, bend the front knee, hand to floor or block, lift the back leg. Stack the hips. This pose earns its depth from what came before.',
            tabs: [
              { label: 'How to Enter', content: 'From Triangle pose, bend the front knee and bring the front hand to the floor or a block about a foot forward. Shift weight onto the front foot and lift the back leg to hip height. Stack the hips and open the chest toward the ceiling. Extend the top arm upward. Hold 5–8 breaths, then switch.' },
              { label: 'What It Does', content: 'Half Moon combines the lateral stretch of Triangle with the single-leg demand of balance poses, making it one of the more complete standing poses in the sequence. It builds outer hip strength, opens the chest and inner groins, and trains the coordination needed to feel stable in an unstable position.' },
              { label: 'Good For', content: 'After the body is well warmed up and the hips have been opened — this pose earns its depth from what came before.' },
            ],
          },
          {
            id: 'dancer',
            term: 'Dancer\'s Pose',
            sanskrit: 'Natarajasana',
            image: 'dancers-pose.png',
            brief: 'A backbend and a balance in one — strength through the back, openness through the front, steadiness throughout.',
            mnemonic: 'Press the foot into the hand — that press is what creates the arc. Passive holding doesn\'t open the pose.',
            tabs: [
              { label: 'How to Enter', content: 'Stand on one foot. Bend the other knee and reach back to hold the inner ankle or foot. Press the foot into the hand as you hinge forward slightly, lifting the back leg and extending the free arm forward. Keep the standing hip stable. Hold 5–8 breaths, then switch.' },
              { label: 'What It Does', content: 'Dancer\'s pose opens the hip flexors and chest of the lifted side while demanding full-body balance. The press of the foot into the hand is what creates the arc — passive holding doesn\'t open the pose. It builds the shoulder and hip mobility that longer, more demanding backbends eventually require.' },
              { label: 'Good For', content: 'When the hips and chest are already well warmed and open — this is near the end of a sequence for good reason.' },
            ],
          },
        ],
      },
      {
        id: 'ground',
        label: 'Ground',
        subtitle: 'Strength from stillness',
        desc: 'Seated and floor-based work that strengthens the core, opens the posterior chain, and prepares the body for stillness. The transition from active to restorative.',
        cards: [
          {
            id: 'boat-pose',
            term: 'Boat Pose',
            sanskrit: 'Navasana',
            image: 'boat-pose.png',
            brief: 'Balance on the sit bones, spine long, legs lifted. The core has to work — there is nowhere else for the effort to go.',
            mnemonic: 'If the back rounds, keep the knees bent. A shorter, flatter version with a long spine is more effective than the full shape with a rounded back.',
            tabs: [
              { label: 'How to Enter', content: 'Sit with knees bent, feet flat. Lean back slightly and balance on the sit bones. Lift the feet, shins parallel to the floor. Extend arms forward. Keep the spine long — if it rounds, keep the knees bent. Hold 3–5 breaths, rest, and repeat.' },
              { label: 'What It Does', content: 'Boat pose builds hip flexor strength and challenges core stability while the spine stays long and neutral. The hip flexors are doing the heavy lifting — the core works to keep the spine from collapsing under that load. The temptation is to round the back to reach the full pose — but a shorter, flatter version with a long spine is more effective than the full shape with a rounded back. The wobble and the effort to stay upright is exactly the point.' },
              { label: 'Good For', content: 'Building the core endurance that protects the lower back on long days of carrying weight.' },
            ],
          },
          {
            id: 'bridge-pose',
            term: 'Bridge Pose',
            sanskrit: 'Setu Bandha Sarvangasana',
            image: 'bridge-pose.png',
            brief: 'Lifts the back of the body while opening the front. The antidote to the collapsed, forward-folded posture of modern life.',
            mnemonic: 'Press through the feet and lift the hips. Roll up one vertebra at a time — this builds the spinal awareness that prevents back injuries.',
            tabs: [
              { label: 'How to Enter', content: 'Lie on your back, knees bent, feet hip-width, heels close to the sit bones. Inhale to prepare. Exhale: press through the feet and lift the hips, rolling up one vertebra at a time. At the top, press feet and arms into the floor and lift the sternum. Hold 5–8 breaths. Lower slowly, rolling down one vertebra at a time.' },
              { label: 'What It Does', content: 'Bridge strengthens the glutes and hamstrings — the muscles that weaken most from prolonged sitting — while simultaneously stretching the hip flexors and opening the chest. Rolling up and down one vertebra at a time builds the spinal awareness and control that helps prevent back injuries.' },
              { label: 'Good For', content: 'Lower back tightness, or any time the body has been in a compressed, forward posture for extended periods.' },
            ],
          },
          {
            id: 'seated-forward-bend',
            term: 'Seated Forward Bend',
            sanskrit: 'Paschimottanasana',
            image: 'seated-forward-bend.png',
            brief: 'The entire back of the body — from heel to skull — stretched in one long line while seated.',
            mnemonic: 'Hinge from the hips, not from the waist. A flat back reaching forward is more effective than a rounded back reaching for the toes.',
            tabs: [
              { label: 'How to Enter', content: 'Sit with legs extended, feet flexed. Inhale to lengthen the spine upward. Exhale and hinge forward from the hips, reaching for the shins, ankles, or feet. Keep the spine as long as possible — a flat back reaching forward is more effective than a rounded back reaching for the toes. Hold 8–10 breaths.' },
              { label: 'What It Does', content: 'Paschimottanasana stretches the entire posterior chain — calves, hamstrings, glutes, and spinal extensors — in one sustained hold. The seated position removes balance from the equation, allowing the body to focus entirely on releasing. The forward fold also calms the nervous system, making it both a stretch and a transition toward rest.' },
              { label: 'Good For', content: 'Hamstring and lower back tightness, or as a transitional pose between active and restorative sections of practice.' },
            ],
          },
          {
            id: 'fish',
            term: 'Fish Pose',
            sanskrit: 'Matsyasana',
            image: 'fish-pose.png',
            brief: 'A gentle backbend that opens the chest and throat — undoing the forward collapse that accumulates through the day.',
            mnemonic: 'Forearms bear the weight, not the neck. Often practiced as a counter-pose after forward folds.',
            tabs: [
              { label: 'How to Enter', content: 'Lie on your back, legs extended. Place hands under the hips, palms down. Press the forearms and elbows into the floor and lift the chest, arching the upper back. Allow the top of the head to gently rest on the floor or hover. Hold 5–8 breaths. To come out, press the forearms down and lift the head before lowering the back.' },
              { label: 'What It Does', content: 'Fish pose is a supported backbend that opens the chest and the front of the throat — areas that close off with forward head posture and rounded shoulders. The forearms bear the weight rather than the neck, making it accessible and safe. It is often practiced as a counter-pose after forward folds or shoulder stands.' },
              { label: 'Good For', content: 'Chest and throat tightness, or as a counter-pose after extended forward-folding sequences.' },
            ],
          },
          {
            id: 'reclined-bound-angle',
            term: 'Reclined Bound Angle',
            sanskrit: 'Supta Baddha Konasana',
            image: 'reclined-bound-angle.png',
            brief: 'Lie down, let the hips open, and breathe. A restorative hip opener that asks nothing of you except to release.',
            mnemonic: 'Soles of feet together, knees fall open. Don\'t press the knees down — let gravity and time do the work.',
            tabs: [
              { label: 'How to Enter', content: 'Lie on your back. Bring the soles of the feet together and let the knees fall open toward the floor. Place hands on the belly or extend arms to the sides. Close the eyes. Let gravity do the work — don\'t press the knees down. Hold 5–10 minutes if possible.' },
              { label: 'What It Does', content: 'The inner groins and hip rotators release passively with gravity over time in this pose. Unlike active stretching, the long hold allows the nervous system to register safety in the open position and gradually permit more range. This is one of the best poses for hip tightness because it works through time and weight rather than effort.' },
              { label: 'Good For', content: 'Hip tightness that doesn\'t respond to active stretching, or as a transitional pose before savasana.' },
            ],
          },
        ],
      },
      {
        id: 'rest',
        label: 'Rest',
        subtitle: 'Returning home',
        desc: 'Integration. The nervous system consolidates everything the practice just asked of the body. These poses aren\'t the end — they\'re where the work actually lands.',
        cards: [
          {
            id: 'childs-pose',
            term: 'Child\'s Pose',
            sanskrit: 'Balasana',
            image: 'childs-pose.png',
            brief: 'The body\'s natural resting shape. Spine long, hips folded, forehead toward the earth.',
            mnemonic: 'Big toes together, knees wide, forehead down. No minimum or maximum hold time. There is no wrong time for child\'s pose.',
            tabs: [
              { label: 'How to Enter', content: 'From hands and knees, bring big toes together and widen the knees to the edges of the mat. Lower the hips toward the heels. Walk the hands forward and rest the forehead on the mat or a block. Breathe into the back of the ribcage. Hold as long as needed — this pose has no minimum or maximum.' },
              { label: 'What It Does', content: 'Child\'s pose decompresses the posterior elements of the lumbar spine, opens the upper back through the extended arms, and supports the body\'s shift into rest through a combination of the curled posture, supported position, and gentle inward withdrawal. It is both a physical release and a neurological reset — the dual benefit that makes it the most reached-for resting pose in practice.' },
              { label: 'Good For', content: 'Any time during practice when the body or breath needs to settle. There is no wrong time for child\'s pose.' },
            ],
          },
          {
            id: 'supine-twist',
            term: 'Supine Twist',
            sanskrit: 'Supta Matsyendrasana',
            image: 'supine-twist.png',
            brief: 'The spine wrings itself out. A gentle, supported twist that releases what the rest of the practice stirred up.',
            mnemonic: 'Let the twist be passive — no forcing. The floor supports everything. A two-for-one: lumbar release and outer hip stretch.',
            tabs: [
              { label: 'How to Enter', content: 'Lie on your back. Draw the right knee to the chest, then guide it across the body to the left while extending the right arm to the right. Look right if comfortable. Let the twist be passive — no forcing. Hold 5–10 breaths, then switch sides.' },
              { label: 'What It Does', content: 'The supine twist releases tension in the muscles surrounding the lumbar spine and opens the thoracic back with full support from the floor. Unlike seated twists, nothing has to work to maintain position — the body can fully release. It also gently stretches the outer hip of the crossed leg, making it a two-for-one at the end of practice.' },
              { label: 'Good For', content: 'Lower back tension after any activity, or as the final active pose before savasana.' },
            ],
          },
          {
            id: 'happy-baby',
            term: 'Happy Baby',
            sanskrit: 'Ananda Balasana',
            image: 'happy-baby.png',
            brief: 'On your back, knees toward the chest, feet toward the sky. Gentle, grounding, and surprisingly effective.',
            mnemonic: 'Reach for outer edges of feet or backs of thighs. Rock side to side. Everything is supported by the floor.',
            tabs: [
              { label: 'How to Enter', content: 'Lie on your back. Draw both knees toward the chest, then open them wide. Reach for the outer edges of the feet or the backs of the thighs. Flex the feet toward the ceiling. Gently use the arms to draw the knees toward the floor beside the ribs. Rock side to side slowly if it feels good. Hold 5–10 breaths.' },
              { label: 'What It Does', content: 'Happy baby stretches the inner groins and hip rotators while releasing tension across the lower back. The side-to-side rock provides a mild massage along the spine. It is one of the most effective and accessible hip openers precisely because everything is supported by the floor and nothing has to be held or stabilized.' },
              { label: 'Good For', content: 'End of any practice, or when the lower back and hips need gentle release without any effort.' },
            ],
          },
          {
            id: 'legs-up-the-wall',
            term: 'Legs-Up-the-Wall',
            sanskrit: 'Viparita Karani',
            image: 'legs-up-the-wall.png',
            brief: 'Legs up, lower back released, nervous system shifting. The antidote to a day of standing or sitting.',
            mnemonic: 'Sit bones close to the wall. Arms at sides. Stay 5–15 minutes. Costs nothing, works anywhere there\'s a wall.',
            tabs: [
              { label: 'How to Enter', content: 'Sit sideways next to a wall. Lie down and swing the legs up the wall, scooting the sit bones close. Arms rest by the sides or on the belly. Close the eyes. Stay 5–15 minutes. To come out, bend the knees, push away from the wall, and roll to one side.' },
              { label: 'What It Does', content: 'With the legs elevated, the lower back releases, the hip flexors let go passively, and gravity assists venous return — the blood that pools in the lower legs flows back toward the heart more easily. The parasympathetic nervous system activation — the body shifting into rest mode — makes this one of the most effective recovery tools available. It costs nothing and can be done anywhere there\'s a wall.' },
              { label: 'Good For', content: 'After any long day of physical activity, travel, or sustained standing. Also excellent for swollen feet and ankles.' },
            ],
          },
          {
            id: 'savasana',
            term: 'Savasana',
            sanskrit: 'Corpse Pose',
            image: 'savasana.png',
            brief: 'Not rest — integration. The nervous system consolidates everything the practice just asked of the body.',
            mnemonic: 'Release all effort — including the effort to relax. Minimum 5 minutes. It is not optional. It is where the work lands.',
            tabs: [
              { label: 'How to Enter', content: 'Lie flat on your back. Let the feet fall open naturally. Arms slightly away from the body, palms up. Close the eyes. Release all effort — including the effort to relax. Stay a minimum of 5 minutes. Longer is better.' },
              { label: 'What It Does', content: 'Savasana shifts the nervous system from the active, effortful state of practice into parasympathetic recovery — the state where adaptation begins. Neuroscience research on rest and motor consolidation suggests the brain replays and consolidates movement patterns during quiet rest after practice. Skipping it cuts that process short. It is not optional. It is where the work lands.' },
              { label: 'Good For', content: 'The end of every practice, without exception.' },
            ],
          },
        ],
      },
    ],
  },
];

// ─── Derived data ────────────────────────────────────────────────────────────

export function getTotalCardsL1() {
  return MOVEMENT_DECK_L1.reduce(
    (sum, ch) => sum + (ch.opener ? 1 : 0) + ch.groups.reduce((s, g) => s + g.cards.length, 0),
    0,
  );
}

export function buildScreensL1() {
  const screens = [
    { type: 'cover' },
    { type: 'welcome' },
  ];

  MOVEMENT_DECK_L1.forEach((chapter, ci) => {
    // Opener card (AUM)
    if (chapter.opener) {
      screens.push({ type: 'card', card: chapter.opener, group: { label: chapter.title }, chapter, chapterIndex: ci, groupIndex: -1, cardIndex: -1 });
    }

    chapter.groups.forEach((group, gi) => {
      screens.push({ type: 'group-title', group, chapter, chapterIndex: ci, groupIndex: gi });

      group.cards.forEach((card, cardi) => {
        screens.push({
          type: 'card',
          card,
          group,
          chapter,
          chapterIndex: ci,
          groupIndex: gi,
          cardIndex: cardi,
        });
      });
    });
  });

  screens.push({ type: 'continue' });
  return screens;
}
