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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Lie on your back or sit tall. Relax the shoulders.' },
                  { text: 'Place one hand on the chest, one on the belly.' },
                  { text: 'Inhale slowly through the nose — the belly hand rises first, the chest hand barely moves.' },
                  { text: 'Exhale through the nose or mouth. Let the belly fall completely.' },
                  { text: 'Repeat for 5 breaths to start. Work up to 2–3 minutes over time.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Diaphragmatic excursion',
                    description: 'the diaphragm moves through its full range — down on the inhale, back up on the exhale — the way it\'s meant to.',
                    trains: 'primary respiratory muscle, lower rib expansion',
                  },
                  {
                    pattern: 'Intra-abdominal pressure for spinal stability',
                    description: 'a well-timed diaphragm co-contracts with transverse abdominis and pelvic floor to create the pressure that supports the lumbar spine before every movement.',
                    trains: 'the deep stabilization system (diaphragm, TrA, pelvic floor, multifidus)',
                  },
                  {
                    pattern: 'Parasympathetic down-regulation',
                    description: 'slow nasal breathing signals safety to the nervous system — heart rate slows, shoulders drop, attention settles.',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Any time the body feels tight, stressed, or scattered before practice.',
                  scenarios: [
                    'First five minutes of any session, to reset the breath',
                    'Before sleep, to shift out of the day\'s sympathetic state',
                    'Mid-meeting or mid-drive when the chest has taken over',
                    'As a warm-up before any loaded or demanding pose',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Sit upright or lie flat. Close the eyes or soften the gaze.' },
                  { text: 'Inhale through the nose for 4 counts.' },
                  { text: 'Hold the breath in for 4 counts.' },
                  { text: 'Exhale through the nose for 4 counts.' },
                  { text: 'Hold the breath out for 4 counts. That\'s one round.' },
                  { text: 'Repeat 4–6 rounds. Start at 3 counts if 4 feels forced, and lengthen over time.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Paced breath control',
                    description: 'regulating inhale, hold, and exhale length to bring the breath well below the resting rate of 12–18 per minute.',
                    trains: 'voluntary respiratory control, autonomic flexibility',
                  },
                  {
                    pattern: 'Parasympathetic activation',
                    description: 'slow paced breathing near 6 cycles per minute reliably increases vagally-mediated HRV and shifts the nervous system toward rest-and-digest.',
                    trains: 'vagal tone, baroreflex sensitivity',
                  },
                  {
                    pattern: 'Cognitive steadying under stress',
                    description: 'the fixed rhythm gives the mind something structural to hold onto — which is why it\'s used by military and emergency personnel before high-stakes situations.',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Before meditation, before a hard pose, or any time the mind won\'t settle.',
                  scenarios: [
                    'The first five minutes of practice, to arrive',
                    'Before a presentation, interview, or hard conversation',
                    'Middle of the night when the mind is racing',
                    'Any transition between high-stimulation contexts',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Breathe in through the nose, mouth closed.' },
                  { text: 'On the exhale, gently constrict the back of the throat — as if fogging a mirror with the mouth closed.' },
                  { text: 'You\'ll hear a soft, ocean-like sound. It should be audible to you, not to someone nearby.' },
                  { text: 'Apply the same gentle constriction to the inhale.' },
                  { text: 'Let the sound run beneath the whole practice. If it stops or forces, something has tensed — ease up.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Airway-resistance breathing',
                    description: 'light glottal constriction slows airflow and smooths the breath — the same mechanism as whispering, applied continuously.',
                    trains: 'breath control, expiratory pacing',
                  },
                  {
                    pattern: 'Steady pressure across the flow',
                    description: 'the glottal resistance stretches out both inhale and exhale, so trunk pressure feels more even as the body moves. Intrathoracic pressure is measurably higher with the constriction; the IAP-smoothing follow-on is practitioner-observed, not yet directly tested.',
                    trains: 'breath–core coordination during dynamic asana',
                  },
                  {
                    pattern: 'Interoceptive anchor',
                    description: 'the sound is continuous feedback — when it breaks or forces, something in the body or mind has tensed. It points attention back to the breath without requiring thought.',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Any flowing practice where breath and movement need to stay connected.',
                  scenarios: [
                    'Vinyasa or flow sequences from start to savasana',
                    'Long holds when attention tends to wander',
                    'Arriving before seated meditation',
                    'Training breath–movement timing in new or challenging shapes',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Begin on hands and knees. Wrists under shoulders, knees under hips.' },
                  { text: 'Inhale into Cow — let the belly drop, tailbone lifts, chest opens.' },
                  { text: 'Exhale into Cat — press the floor away, round the spine toward the ceiling, tuck the tailbone.' },
                  { text: 'Move slowly. Notice which segments of the spine move freely and which resist.' },
                  { text: 'Continue for 6–10 rounds, breath leading the movement.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Segmental spinal mobility',
                    description: 'the spine moves through its full range of flexion and extension, one segment at a time, rather than hinging at one habitual joint.',
                    trains: 'thoracic extension, lumbar articulation, cervical mobility',
                  },
                  {
                    pattern: 'Breath–spine coordination',
                    description: 'the breath leads the movement — inhale opens the front, exhale rounds the back. The diaphragm and pelvic floor work together through every cycle.',
                    trains: 'piston mechanics (diaphragm \u2194 pelvic floor)',
                  },
                  {
                    pattern: 'Mobility diagnosis',
                    description: 'moving slowly through the full range reveals exactly where the spine is stiff and where it overcompensates — information the rest of the practice will use.',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'First thing in the morning, or whenever the spine feels compressed and stiff.',
                  scenarios: [
                    'After long drives or sedentary hours',
                    'As a warm-up before any hinge, twist, or loaded pose',
                    'When the lower back feels locked or unreadable',
                    'Before bed, to release the day\'s compression',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Stand with feet hip-width, or together if that feels stable.' },
                  { text: 'Root through all four corners of both feet — big toe mound, little toe mound, inner heel, outer heel.' },
                  { text: 'Stack ankles over arches, knees over ankles, hips over knees, shoulders over hips.' },
                  { text: 'Let the arms hang naturally. Lengthen through the crown of the head.' },
                  { text: 'Hold for 5–10 breaths. Notice where your weight falls and where the body wants to compensate.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Neutral-spine awareness',
                    description: 'teaches the nervous system what true neutral alignment feels like — most people have never felt it, and compensate in ways they can\'t sense anymore.',
                    trains: 'postural proprioception, cervical and lumbar curve awareness',
                  },
                  {
                    pattern: 'Closed-chain foot loading',
                    description: 'rooting through four corners sharpens ground-awareness and cues the arch not to collapse. The intrinsic foot muscles aren\'t doing real work here — they ramp up on single-leg poses and dynamic movement.',
                    trains: 'proprioceptive contact, arch awareness',
                  },
                  {
                    pattern: 'Anti-gravity postural tone',
                    description: 'the antigravity muscles — soleus, spinal extensors, deep core — engage at a low level to hold the stack. The stillness is anything but passive.',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Resetting alignment before activity, or any time the body has been compressed for hours.',
                  scenarios: [
                    'After long periods of sitting or driving',
                    'Before a hike, a run, or any extended time on your feet',
                    'As the first pose of any standing sequence',
                    'While waiting in any line — a free practice anywhere',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Stand with feet hip-width. Inhale to lengthen the spine upward.' },
                  { text: 'Exhale and hinge forward from the hips, bending the knees generously.' },
                  { text: 'Let the head hang completely — no effort in the neck, no chin tuck.' },
                  { text: 'Hold opposite elbows and let the torso sway gently if it feels good.' },
                  { text: 'Stay 8–10 breaths. Bend the knees more to come up with a long spine.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Hip hinge under the hamstrings',
                    description: 'bending the knees takes slack out of the hamstrings so the pelvis keeps tipping forward at the hip. You fold from the hip crease instead of dumping the load into the lower back.',
                    trains: 'pelvic tilt control, pure hip hinge without lumbar compensation',
                  },
                  {
                    pattern: 'Cervical unloading',
                    description: 'letting the head hang lets gravity pull down on the skull instead of the neck muscles holding it up. For anyone stuck in forward head posture, it\'s one of the few moments in the day when the back of the neck isn\'t working.',
                    trains: 'cervical extensors, suboccipital release',
                  },
                  {
                    pattern: 'Parasympathetic shift through folding',
                    description: 'slow nasal breathing in a folded, head-low position is widely associated with a calming effect — less from the inversion itself than from the slowed breath, reduced visual input, and downregulated arousal.',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'After any activity that compresses the spine, or when the back of the body needs one long reset.',
                  scenarios: [
                    'After running, cycling, or backpacking',
                    'End of a long day on your feet',
                    'Mid-workday as a two-minute spine reset',
                    'Before a seated meditation, to release the back body first',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'From hands and knees, tuck the toes and lift the hips toward the ceiling.' },
                  { text: 'Press the floor away through straight arms. Spread the fingers wide.' },
                  { text: 'Pedal the feet a few times to warm the calves.' },
                  { text: 'Press both heels toward the floor — they don\'t have to touch.' },
                  { text: 'Release the neck. Head hangs between the arms. Hold 5–10 breaths.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Posterior chain lengthening',
                    description: 'a deep stretch through calves, hamstrings, and the entire back of the spine simultaneously — one of the most efficient full-chain openers available.',
                    trains: 'calves, hamstrings, spinal extensors, ankle dorsiflexion',
                  },
                  {
                    pattern: 'Scapular control under load',
                    description: 'the shoulders and arms hold body weight while the shoulder blades wrap around the ribs — building the stability overhead pressing and inversions require.',
                    trains: 'serratus anterior, lower trap, external rotators',
                  },
                  {
                    pattern: 'Light bracing through the stretch',
                    description: 'the canister holds the inverted-V shape at low activation — Down Dog\'s main job is lengthening the posterior chain. For real trunk bracing, plank does more.',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Between standing poses to reset, or as a morning wake-up when the whole body feels stiff.',
                  scenarios: [
                    'First thing in the morning to open calves and shoulders',
                    'Between standing sequences, as a neutral reset pose',
                    'Before overhead work (pressing, climbing, hanging)',
                    'After long sitting to decompress spine and reopen shoulders',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'From hands and knees, step the feet back into one straight line from head to heel.' },
                  { text: 'Hands directly under the shoulders, fingers spread wide.' },
                  { text: 'Press the floor away — don\'t let the chest sink toward it.' },
                  { text: 'Draw the lower belly gently in. Keep the head in line with the spine.' },
                  { text: 'Hold 5–10 breaths. Lower to knees and rest if the form breaks.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Anti-extension holds',
                    description: 'the body resists the pull of gravity trying to sag the lower back — trains the deep core to hold a neutral spine under load.',
                    trains: 'transverse abdominis, rectus abdominis, obliques',
                  },
                  {
                    pattern: 'Scapular control under load',
                    description: 'pressing the floor away is the "plus" of a push-up-plus and drives serratus anterior hard. Lower trap helps hold the blades down, but plank isn\'t where it peaks — that\'s Y-raises and overhead work.',
                    trains: 'serratus anterior (primary), lower trap (supporting)',
                  },
                  {
                    pattern: 'Integrated bracing',
                    description: 'the whole canister co-contracts to hold the line. Hips sagging or rising means the bracing has failed somewhere in the system.',
                    trains: '360\u00b0 pressurization under whole-body load',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Building the baseline strength that makes every other pose — and most daily loading — safer.',
                  scenarios: [
                    'Before arm balances or inversions',
                    'As a morning strength baseline',
                    'When the lower back has been complaining and needs the deep core re-engaged',
                    'As a brief full-body wake-up before a run or hike',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Lie face down. Place hands under the shoulders, tops of the feet pressing into the floor.' },
                  { text: 'Press the floor away, straightening the arms and lifting the chest.' },
                  { text: 'Lift the thighs off the floor — this is what distinguishes it from Cobra.' },
                  { text: 'Roll the shoulders back and down. Open the collarbones.' },
                  { text: 'Lift the gaze slightly. Do not crane the neck sharply back. Hold 3–5 breaths.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Spinal extension under load',
                    description: 'controlled extension through the entire spine with the arms supporting body weight — trains spinal extensors against gravity.',
                    trains: 'erector spinae, multifidus, glute co-contraction',
                  },
                  {
                    pattern: 'Anterior release',
                    description: 'opens the front line of the body — chest, hip flexors, abdomen — directly counteracting the forward-collapsed posture of desk and phone time.',
                    trains: 'hip flexor lengthening, pectoralis stretch, abdominal opening',
                  },
                  {
                    pattern: 'Scapular control under load',
                    description: 'rolling the shoulders back and down as the chest lifts recruits lower traps and rhomboids — not just hanging from the shoulders.',
                    trains: 'lower trap activation, scapular depression',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Counteracting hours of sitting, driving, or forward-leaning posture.',
                  scenarios: [
                    'After a long workday at a desk or in a car',
                    'Between forward-folding poses, to balance the sequence',
                    'Before overhead or throwing activities',
                    'When the chest feels compressed and the breath feels shallow',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Stand with feet hip-width or together.' },
                  { text: 'Inhale to lengthen. Exhale and bend the knees, sitting back as if lowering onto a chair.' },
                  { text: 'Keep the chest lifted. Resist the urge to fold forward as the legs fatigue.' },
                  { text: 'Weight stays in the heels. Arms reach overhead or forward.' },
                  { text: 'Hold 5–8 breaths. Build endurance over time.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Knee-dominant loading',
                    description: 'the quads do the primary work of holding the squatted position — builds the leg strength that protects the knees during descents.',
                    trains: 'quadriceps, gluteus maximus, adductor co-contraction',
                  },
                  {
                    pattern: 'Spinal extension under load',
                    description: 'the real challenge is keeping the torso upright as the legs fatigue — trains spinal extensors to hold a neutral position under fatigue.',
                    trains: 'erector spinae, lower trap, lumbar extensors',
                  },
                  {
                    pattern: 'Loaded dorsiflexion',
                    description: 'the ankle sits in deep dorsiflexion under body weight. The muscular work is actually in the calves (soleus controlling forward tibial translation) and quads — keep weight spread across the whole foot rather than tipping all the way back.',
                    trains: 'soleus (eccentric control), quadriceps endurance',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Building leg and lower back endurance before a day of hiking — especially if descents are planned.',
                  scenarios: [
                    'Before hikes with significant elevation loss',
                    'Building ski or snowboard conditioning',
                    'Strengthening the knees after sedentary weeks',
                    'When long standing on trails is coming up',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Step one foot back 3–4 feet. Front foot points forward, back foot turns out about 45°.' },
                  { text: 'Bend the front knee to 90° — directly over the ankle, not past it.' },
                  { text: 'Square both hips toward the front of the mat. This is where the back-leg stretch lives.' },
                  { text: 'Raise both arms overhead, palms facing each other or touching. Lift the chest.' },
                  { text: 'Hold 5–8 breaths, then switch sides.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Back-leg hip flexor stretch',
                    description: 'the iliopsoas and rectus femoris of the back leg lengthen as the hips square forward — the deep muscles that shorten most with prolonged sitting.',
                    trains: 'iliopsoas, rectus femoris',
                  },
                  {
                    pattern: 'Knee-dominant loading',
                    description: 'the front leg bears load through a deep bend, building strength in the quadriceps and gluteus maximus under real demand.',
                    trains: 'quadriceps, glute max',
                  },
                  {
                    pattern: 'Single-leg control',
                    description: 'squaring the hips while in a split stance requires pelvic control and glute medius engagement on both sides.',
                    trains: 'pelvic control, glute med',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Tight hip flexors and lower back after long days sitting, driving, or in a saddle.',
                  scenarios: [
                    'After flights or road trips, to reverse hours of hip flexion',
                    'Before hiking with significant climbing sections',
                    'Post-bike ride, when the hip flexors have been shortened for hours',
                    'Lower back tightness from long desk hours',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Feet 3–4 feet apart. Front foot points forward, back foot turns out 90°.' },
                  { text: 'Bend the front knee to 90° — directly over the ankle.' },
                  { text: 'Extend arms to a T at shoulder height, parallel to the floor.' },
                  { text: 'Gaze over the front hand. Keep the torso centered between the legs.' },
                  { text: 'Hold 5–10 breaths, then switch sides.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Mixed-plane stability',
                    description: 'the body works in the frontal plane — a direction that gets far less attention than forward and back movement in most training.',
                    trains: 'frontal-plane coordination, shoulder endurance',
                  },
                  {
                    pattern: 'Outer-hip stability under load',
                    description: 'the front leg\'s glute medius and deep rotators work to keep the knee tracking over the ankle — qualified per Lehecka 2021 for double-leg stance.',
                    trains: 'glute medius, deep external rotators',
                  },
                  {
                    pattern: 'Loaded standing work',
                    description: 'sustaining the bent-knee position builds quadriceps and glute endurance under real-world time-under-tension.',
                    trains: 'quadriceps, glute max, shoulder stabilizers',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Building the hip stability needed for uneven or sloped terrain.',
                  scenarios: [
                    'Hiking on slopes, scree, or side-hill trails',
                    'Ski and snowboard prep — lateral stability under load',
                    'Rehab after knee or ankle injury when lateral strength is weak',
                    'Any time the knees cave inward during squats or descents',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Stand with feet slightly wider than hip-width, toes turned out 30–45°.' },
                  { text: 'Lower into a deep squat, sitting as low as possible toward the floor.' },
                  { text: 'Bring elbows to the inside of the knees, palms together at the chest.' },
                  { text: 'If the heels rise, place a folded blanket or block beneath them.' },
                  { text: 'Hold 5–10 breaths. Use the elbows to gently press the knees open.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Dorsiflexion mobility',
                    description: 'the deep squat demands the full ankle bend that most modern footwear and sitting habits eliminate — the single biggest limiter of squat depth.',
                    trains: 'ankle dorsiflexors, Achilles tendon, soleus',
                  },
                  {
                    pattern: 'Deep hip flexion',
                    description: 'the hips flex to 100–120° in the deep squat, with a femoral-acetabular caveat — individual hip socket depth and angle affect available range.',
                    trains: 'hip flexors, adductors, pelvic floor',
                  },
                  {
                    pattern: 'Closed-chain loading',
                    description: 'the entire lower body loads in a closed chain — feet fixed, joints stacked — training the coordination that transfers to every squat, step, and landing.',
                    trains: 'quadriceps, glutes, spinal extensors',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Any time the ankles feel tight, or before activities with repeated step-downs or descents.',
                  scenarios: [
                    'Before steep descents where ankle mobility protects the knees',
                    'After days in dress shoes or heels that shorten the calf',
                    'When the knees feel stiff on stairs or slopes',
                    'Morning practice to restore squat range before the day stiffens it',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Sit with both legs extended. Bend the right knee and cross the right foot outside the left knee.' },
                  { text: 'Inhale and lengthen the spine upward — grow as tall as possible before twisting.' },
                  { text: 'Exhale and rotate to the right, placing the left elbow outside the right knee.' },
                  { text: 'Right hand on the floor behind you for support. Keep the chest lifted.' },
                  { text: 'Hold 5–8 breaths, then switch sides.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Thoracic rotation',
                    description: 'the mid and upper spine (T6–T11) has 25–35° of rotation available — the lumbar spine only 5–10°. This pose teaches the body to rotate from the right place.',
                    trains: 'internal and external obliques, rotatores, multifidus',
                  },
                  {
                    pattern: 'Neutral-spine awareness',
                    description: 'the inhale-to-lengthen cue creates axial elongation before rotation — protecting the discs and training the pattern of "get tall, then twist."',
                    trains: 'spinal extensors, deep stabilizers',
                  },
                  {
                    pattern: 'External rotation and adduction',
                    description: 'both legs contribute an outer hip stretch — the crossed leg through adduction, the extended leg through the rotational leverage of the elbow.',
                    trains: 'piriformis, glute medius, TFL',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Upper back tightness, or after activities with repetitive rotation in one direction.',
                  scenarios: [
                    'After golf, tennis, or paddling — any one-sided rotational sport',
                    'When the shoulder blades feel locked and immobile',
                    'Counter-rotation after long hikes with a pack pulling one way',
                    'Morning stiffness after sleeping in a twisted position',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'From downward dog, bring the right knee toward the right wrist. Lower the shin on a diagonal — less angle makes it easier.' },
                  { text: 'Lower the back knee to the mat and extend the back leg straight behind you.' },
                  { text: 'Square the hips down. Use a block under the front hip if they don\'t reach the floor evenly.' },
                  { text: 'Inhale to lengthen the spine. Exhale and fold forward over the front shin.' },
                  { text: 'Hold 5–10 breaths, then switch sides.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Hip rotation',
                    description: 'the front leg\'s deep external rotators — piriformis, glute medius, and the deep six — are stretched directly and sustainedly.',
                    trains: 'piriformis, glute medius, deep six rotators',
                  },
                  {
                    pattern: 'Hip extension stretching',
                    description: 'the back leg\'s hip flexors — iliopsoas and quadriceps — lengthen passively as the pelvis settles toward the floor.',
                    trains: 'iliopsoas, rectus femoris, quads',
                  },
                  {
                    pattern: 'Deep outer-hip release',
                    description: 'folding forward over the front shin deepens the stretch into the glutes and piriformis — the muscles that tighten most from sitting, running, and cycling.',
                    trains: 'gluteus maximus, piriformis, TFL',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Hip tightness after running, cycling, or long days in the car. One of the most effective recovery poses available.',
                  scenarios: [
                    'The day after a long run, when the hips feel locked',
                    'Recovery after cycling — the hip rotators shorten in the saddle',
                    'Mid-trip hotel room reset after days of driving',
                    'Lower back pain that originates from tight hips',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Feet 3–4 feet apart. Right foot forward, left foot turned out 90°.' },
                  { text: 'Extend arms to a T at shoulder height.' },
                  { text: 'Inhale to lengthen. Exhale and hinge sideways over the right leg.' },
                  { text: 'Right hand to shin, ankle, or block. Left arm reaches to the ceiling.' },
                  { text: 'Keep both sides of the waist long, chest open to the ceiling. Hold 5–8 breaths, then switch.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Frontal-plane stability',
                    description: 'the obliques, quadratus lumborum, and glute medius work together to hold the torso in a lateral hinge — a plane most people rarely load.',
                    trains: 'obliques, QL, glute med',
                  },
                  {
                    pattern: 'Outer-hip engagement',
                    description: 'the standing leg\'s outer hip must stabilize the pelvis — qualified for a double-leg stance, but still a meaningful demand.',
                    trains: 'glute medius, deep external rotators',
                  },
                  {
                    pattern: 'Lateral-line lengthening',
                    description: 'the entire lateral chain — from the outer foot to the fingertips — stretches as a continuous line. This is not segmental; it\'s a full-side opening.',
                    trains: 'lateral fascia, intercostals, IT band region',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Side-body tightness, or after activities that compress one side more than the other.',
                  scenarios: [
                    'After carrying a pack on one shoulder or a child on one hip',
                    'Long drives with one hand on the wheel, torso twisted',
                    'Counter-pose after one-sided sports (tennis, golf, paddling)',
                    'When the ribs feel stuck or compressed on one side',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Stand on one foot, pressing through all four corners of the standing foot.' },
                  { text: 'Place the other foot on the inner calf or inner thigh — never the knee.' },
                  { text: 'Press the foot and the standing leg into each other mutually.' },
                  { text: 'Bring hands to heart center or raise them overhead.' },
                  { text: 'Fix your gaze on a still point. Hold 5–10 breaths, then switch.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Single-leg control',
                    description: 'the full coordination chain from foot to ankle to hip to core must work together to maintain upright balance on one leg.',
                    trains: 'foot-ankle-hip-core coordination',
                  },
                  {
                    pattern: 'Ankle proprioception',
                    description: 'the ankle\'s position-sensing system gets trained under load — with a dosage caveat per Schiftan 2015 that improvements are practice-volume dependent.',
                    trains: 'ankle mechanoreceptors, peroneal reaction time',
                  },
                  {
                    pattern: 'Intrinsic foot activation',
                    description: 'the small muscles of the foot grip the ground and hold the arch — they activate meaningfully on single-leg stance in ways they don\'t on two feet.',
                    trains: 'abductor hallucis, flexor digitorum brevis, arch stabilizers',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Improving ankle stability and body awareness before technical terrain.',
                  scenarios: [
                    'Before scrambling or trail running on uneven ground',
                    'Rehab after an ankle sprain — rebuilding proprioception',
                    'Pre-ski balance work to sharpen edge awareness',
                    'Any time the feet feel disconnected from the legs',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'From standing, shift your weight onto one foot.' },
                  { text: 'Hinge forward from the hip, extending the back leg toward horizontal.' },
                  { text: 'Arms reach forward, out to the sides, or back along the body.' },
                  { text: 'Keep both hips square to the floor — the lifted-leg hip wants to rotate open.' },
                  { text: 'Hold 5–8 breaths, then switch. Use a wall or chair while building strength.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Single-leg control',
                    description: 'the standing leg\'s glute max, hamstrings, and glute med all fire to hold position — the most demanding single-leg strength pose before Half Moon.',
                    trains: 'glute max, hamstrings, glute med',
                  },
                  {
                    pattern: 'Hip hinge under load',
                    description: 'the torso and back leg counterbalance each other around the standing hip — training the same hip-hinge pattern used in deadlifts and picking things up.',
                    trains: 'posterior chain coordination, hamstring-glute timing',
                  },
                  {
                    pattern: 'Neutral-spine awareness',
                    description: 'the pelvis wants to rotate open or tilt; holding it square trains anti-rotation pelvic control under real demand.',
                    trains: 'deep core anti-rotation, pelvic stabilizers',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Building the single-leg strength and balance needed for uneven terrain.',
                  scenarios: [
                    'Pre-season prep for trail running or scrambling',
                    'After a long hike, to reveal which leg carried more of the load',
                    'Building posterior chain strength without heavy weights',
                    'When the knees cave inward on stairs or descents',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'From Triangle pose, bend the front knee and bring the front hand to the floor or a block about a foot forward.' },
                  { text: 'Shift your weight onto the front foot and lift the back leg to hip height.' },
                  { text: 'Stack the hips — top hip directly over bottom hip, opening to the ceiling.' },
                  { text: 'Open the chest. Extend the top arm straight up.' },
                  { text: 'Hold 5–8 breaths, then switch. This pose earns its depth from what came before.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Frontal-plane stability',
                    description: 'combining single-leg balance with a lateral stretch makes this one of the most demanding frontal-plane poses in the deck.',
                    trains: 'glute med, obliques, standing-leg stabilizers',
                  },
                  {
                    pattern: 'Hip abduction isolation',
                    description: 'the standing leg\'s glute medius works at roughly 40–60% MVIC in single-leg stance — meaningful loading per research on single-leg hip activation.',
                    trains: 'glute medius, deep external rotators',
                  },
                  {
                    pattern: 'Lateral-line lengthening',
                    description: 'the entire lateral chain — from the outer foot to the fingertips — stretches as a continuous line, building on Triangle\'s opening.',
                    trains: 'lateral fascia, intercostals, adductors',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'After the body is well warmed and the hips are open — this pose earns its depth from what came before.',
                  scenarios: [
                    'Mid-practice after Triangle and Warrior II have opened the hips',
                    'Pre-ski lateral balance and edge-awareness training',
                    'Building toward more demanding single-leg balances',
                    'As a lateral-plane progression from Warrior III',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Stand on one foot. Bend the other knee and reach back to hold the inner ankle.' },
                  { text: 'Press the foot into the hand — this active press is what creates the arc.' },
                  { text: 'Hinge forward slightly, extending the free arm forward for counterbalance.' },
                  { text: 'Keep the standing hip stable and the chest lifting.' },
                  { text: 'Hold 5–8 breaths, then switch. Passive holding doesn\'t open the pose.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Active hip-flexor and quad stretch',
                    description: 'the glutes fire to press the foot back, creating reciprocal relaxation in the hip flexors and quads — modestly better than passive stretching per Behm 2016.',
                    trains: 'iliopsoas, rectus femoris (stretched); glutes (contracting)',
                  },
                  {
                    pattern: 'Single-leg control',
                    description: 'the most demanding single-leg balance in the deck — the backbend arc shifts the center of mass forward and up, requiring full-chain coordination.',
                    trains: 'standing-leg glute med, ankle stabilizers, deep core',
                  },
                  {
                    pattern: 'Spinal extension under load',
                    description: 'the arc requires spinal extensors to work while simultaneously balancing — a combination that builds the back strength backbends need.',
                    trains: 'erector spinae, multifidus, thoracic extensors',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'When the hips and chest are well warmed and open — this is near the end of a sequence for good reason.',
                  scenarios: [
                    'Late in a flow after backbends and hip openers have prepared the body',
                    'Building toward deeper backbend work over time',
                    'As a counter-pose after deep forward folds',
                    'When the front body needs active opening, not passive stretch',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Sit with knees bent, feet flat on the floor.' },
                  { text: 'Lean back slightly and balance on the sit bones — not the tailbone.' },
                  { text: 'Lift the feet off the floor, shins parallel to the ground.' },
                  { text: 'Extend arms forward at shoulder height, palms facing in.' },
                  { text: 'Keep the spine long — if it rounds, keep the knees bent. Hold 3–5 breaths, rest, and repeat.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Loaded hip flexion holds',
                    description: 'iliopsoas and rectus femoris hold the legs up against gravity — this is a hip-flexor strength pose as much as an abdominal one.',
                    trains: 'iliopsoas, rectus femoris',
                  },
                  {
                    pattern: 'Anti-extension holds',
                    description: 'the deep core keeps the lumbar spine from collapsing back under the load of the lifted legs.',
                    trains: 'TrA, rectus abdominis, obliques',
                  },
                  {
                    pattern: 'Neutral-spine awareness',
                    description: 'the shorter, flatter version with a long spine trains the right pattern — pelvic tilt control under load.',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Building the core endurance that protects the lower back on long days of carrying weight.',
                  scenarios: [
                    'Before multi-day backpacking',
                    'Building baseline core for climbing or scrambling',
                    'Mid-practice transition into seated work',
                    'When lower back feels weak rather than tight',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Lie on your back, knees bent, feet hip-width, heels close to the sit bones.' },
                  { text: 'Inhale to prepare. Exhale and press through the feet to lift the hips.' },
                  { text: 'Roll up one vertebra at a time — tailbone first, then lumbar, then mid-back.' },
                  { text: 'At the top, press feet and arms into the floor and lift the sternum.' },
                  { text: 'Hold 5–8 breaths. Lower slowly, rolling down one vertebra at a time.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Posterior activation',
                    description: 'glutes and hamstrings drive the lift — the most commonly underworked muscles in sedentary lives, worked here through full range.',
                    trains: 'glutes, hamstrings',
                  },
                  {
                    pattern: 'Hip extension stretching',
                    description: 'the front of the hips opens as the hips lift — hip flexors lengthen while glutes fire, a rare coordination.',
                    trains: 'hip flexors (lengthening), glutes (contracting)',
                  },
                  {
                    pattern: 'Segmental articulation',
                    description: 'rolling up and down one vertebra at a time is direct motor-control training for the deep spinal system.',
                    trains: 'multifidus, TrA, segmental spinal control',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Lower back tightness, or after extended time in compressed, forward posture.',
                  scenarios: [
                    'After long hours at a desk or in a car',
                    'When glutes have gone quiet from sitting',
                    'Pre-hike to wake up the posterior chain',
                    'When lower back is locked and hip flexors are tight',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Sit with legs extended, feet flexed.' },
                  { text: 'Inhale and lengthen the spine, sit bones rooting down.' },
                  { text: 'Exhale and hinge forward from the hips — not the waist.' },
                  { text: 'Reach for shins, ankles, or feet — a flat back reaching forward beats a rounded back reaching for toes.' },
                  { text: 'Hold 8–10 breaths. Let the fold deepen with each exhale.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Posterior chain lengthening',
                    description: 'the whole chain — calves, hamstrings, glutes, spinal extensors — in one sustained hold. The seated position takes balance out of the equation.',
                    trains: 'calves, hamstrings, glutes, spinal extensors',
                  },
                  {
                    pattern: 'Hip-hinge first',
                    description: 'tip the pelvis over the femurs before the spine rounds — some lumbar flexion is normal at end range, but the goal is to lead with the hips, not erase every curve.',
                    trains: 'pelvic tilt control, hip hinge patterning',
                  },
                  {
                    pattern: 'Parasympathetic shift through folding',
                    description: 'a long, quiet forward fold is widely used as a transition from active to rest — slow nasal breathing and reduced visual input.',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Hamstring and lower back tightness, or as a transition between active and restorative practice.',
                  scenarios: [
                    'After runs or hikes with significant uphill',
                    'When hamstrings have been worked and need a long hold',
                    'Late in practice as a transition toward savasana',
                    'When the mind is busy and needs something to settle into',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Lie on your back, legs extended, feet active.' },
                  { text: 'Place hands palms-down under the hips.' },
                  { text: 'Press forearms and elbows into the floor, lifting the chest and arching the upper back.' },
                  { text: 'Let the crown of the head rest lightly on the floor or hover — forearms bear the weight, not the neck.' },
                  { text: 'Hold 5–8 breaths. To come out, press forearms down, lift the head, then lower the back.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Thoracic extension over support',
                    description: 'the forearms give the mid-back a fulcrum to open over — a direct counter to rounded desk posture, though reversing chronic kyphosis takes weeks of repeated work, not one hold.',
                    trains: 'thoracic extensors, erector spinae',
                  },
                  {
                    pattern: 'Anterior release',
                    description: 'the front of the chest, collarbones, and throat all open — the areas most closed off by forward head posture and rounded shoulders.',
                    trains: 'pectoralis stretch, anterior deltoid, throat opening',
                  },
                  {
                    pattern: 'Scapular control under load',
                    description: 'drawing the shoulder blades down the back and pressing the forearms recruits the lower traps — the opposite pattern of shrugged, tense shoulders.',
                    trains: 'lower traps, rhomboids',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Chest and throat tightness, or as a counter-pose after extended forward folding.',
                  scenarios: [
                    'After long hours hunched over a screen or book',
                    'Counter-pose after Seated Forward Bend',
                    'When breath feels shallow and chest compressed',
                    'Before a presentation or social setting where open posture matters',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Lie on your back. Bring the soles of the feet together and let the knees fall open.' },
                  { text: 'If the knees don\'t reach easily, place blocks or blankets under the outer thighs.' },
                  { text: 'Place hands on the belly or extend arms out to the sides, palms up.' },
                  { text: 'Close the eyes. Let the whole weight drop into the floor.' },
                  { text: 'Don\'t press the knees down — let gravity and time do the work. Hold 5–10 minutes.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Passive inner-hip release',
                    description: 'the groins and external rotators lengthen under gravity alone — no muscle engagement.',
                    trains: 'adductors, external rotators',
                  },
                  {
                    pattern: 'Long-hold nervous system release',
                    description: 'a few minutes in the open position lets muscle guard drop and stretch tolerance rise — "fascial reorganization" is oversold; dense fascia barely elongates. Durable ROM gains are neural — the brain learns the range is safe, and that\'s what sticks.',
                  },
                  {
                    pattern: 'Parasympathetic safety signaling',
                    description: 'holding an open position quietly for minutes signals the nervous system that the range is safe — over repeated practice, the body permits more.',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Hip tightness that doesn\'t respond to active stretching, or as a transition before savasana.',
                  scenarios: [
                    'End of practice as a transition toward rest',
                    'When active hip openers have hit a plateau',
                    'Before sleep to release the day from the hips',
                    'Post-travel when hips have been closed for hours',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'From hands and knees, bring big toes together and widen the knees to the edges of the mat.' },
                  { text: 'Lower the hips toward the heels. Walk the hands forward.' },
                  { text: 'Rest the forehead on the mat or a block. Arms extend forward or alongside the body.' },
                  { text: 'Breathe into the back of the ribcage — feel each inhale expand the back body.' },
                  { text: 'Hold as long as needed — no minimum or maximum.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Passive lumbar flexion under gravity',
                    description: 'hips folding to heels gently round the low back, opening the posterior spinal elements and letting the erectors switch off — feels like unloading because the back stops working.',
                    trains: 'lumbar release, posterior spinal elements',
                  },
                  {
                    pattern: 'Gravity-assisted thoracic opening',
                    description: 'extended arms lengthen the upper back and shoulders as the ribs open toward the floor.',
                    trains: 'lats, posterior shoulder capsule',
                  },
                  {
                    pattern: 'Downregulated arousal through support',
                    description: 'warm, supported, immobile shape — forehead resting, breath slowing — lowers arousal. Nothing to see, almost no postural work. Nervous system permission to settle.',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Any time during practice when the body or breath needs to settle. There is no wrong time for Child\'s Pose.',
                  scenarios: [
                    'Mid-practice when breath becomes labored',
                    'Between demanding poses as a reset',
                    'End of a hard session before savasana',
                    'Any stressful moment off the mat — the shape works anywhere',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Lie on your back. Hug the right knee to the chest.' },
                  { text: 'Guide the knee across the body to the left, letting the right hip roll.' },
                  { text: 'Extend the right arm out to the right in a T. Gaze right if comfortable.' },
                  { text: 'Let the knee drop under gravity — no pressing, no forcing.' },
                  { text: 'Hold 5–10 breaths, then switch sides.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Passive spinal rotation',
                    description: 'the floor supports the body entirely while gravity rotates the spine — unlike seated twists, nothing has to work to maintain the shape.',
                    trains: 'thoracic rotation, lumbar release, SI mobility',
                  },
                  {
                    pattern: 'Gravity-assisted outer hip release',
                    description: 'the crossed leg falls across and the outer hip — glute max, glute med, TFL, and the lateral fascial envelope — gets a long, sustained stretch. Skip "stretching the IT band" framing; the band barely elongates. You\'re lengthening the muscles that attach into it.',
                    trains: 'glute max, glute med, TFL',
                  },
                  {
                    pattern: 'Long-hold nervous system release',
                    description: 'the long hold lets muscle guard drop and stretch tolerance rise — the stretch deepens as the nervous system registers the position as safe.',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'Lower back tension after activity, or as the final active pose before savasana.',
                  scenarios: [
                    'End of practice to release what the session stirred up',
                    'Before bed to unwind the spine',
                    'After long drives or flights',
                    'Any time the lower back feels wrung up and won\'t settle',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Lie on your back. Draw both knees toward the chest, then open them wide.' },
                  { text: 'Reach for the outer edges of the feet — or the backs of the thighs if the feet are out of reach.' },
                  { text: 'Flex the feet toward the ceiling. Gently draw the knees down beside the ribs.' },
                  { text: 'Rock side to side slowly if it feels good — no way to do this wrong.' },
                  { text: 'Hold 5–10 breaths. Let everything be supported by the floor.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Passive hip opening',
                    description: 'the arms pull the feet down, putting the hips in flexion-abduction-external rotation with no muscle work — inner groins and external rotators lengthen under gentle gravity-plus-arm load.',
                    trains: 'adductors, hip rotators, hip capsule',
                  },
                  {
                    pattern: 'Gravity-assisted lumbar release',
                    description: 'drawing the knees toward the ribs gently flattens the lower back into the floor, releasing the lumbar spine under body weight.',
                    trains: 'lumbar release, posterior pelvic tilt',
                  },
                  {
                    pattern: 'Gentle spinal self-massage',
                    description: 'the side-to-side rock provides low-level massage along the spine — surprisingly effective release for tension the rest of practice didn\'t quite reach.',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'End of any practice, or when the lower back and hips need gentle release without effort.',
                  scenarios: [
                    'End of a hip-intensive practice',
                    'When the lower back is tired but won\'t unlock',
                    'Before bed to release the hips from the day',
                    'Post-travel when hips have been closed for hours',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Sit sideways next to a wall, one hip touching.' },
                  { text: 'Lie down and swing the legs up the wall, scooting the sit bones as close as comfortable.' },
                  { text: 'Arms rest by the sides or softly on the belly. Let the back, shoulders, and head melt into the floor.' },
                  { text: 'Close the eyes. Let the breath slow on its own.' },
                  { text: 'Stay 5–15 minutes. To come out, bend the knees, push away from the wall, and roll to one side.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Gravity-assisted venous return',
                    description: 'legs elevated above the heart — gravity helps move fluid from the lower legs back toward the core.',
                    trains: 'venous circulation, lymphatic drainage',
                  },
                  {
                    pattern: 'Parasympathetic activation via baroreflex',
                    description: 'elevating the legs shifts venous blood from the legs toward the chest, raising preload and stroke volume — higher pressure stretches the arterial wall at the aortic arch and carotid sinus, and the baroreflex answers with slower heart rate and a shift toward rest-and-digest.',
                    trains: 'vagal tone, cardiovascular recovery',
                  },
                  {
                    pattern: 'Passive hip and hamstring lengthening',
                    description: 'the legs hang supported against the wall for 5–15 minutes — long enough for the muscles to release without active work.',
                    trains: 'hamstrings, hip flexors, calves',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'After any long day of activity, travel, or sustained standing. Also excellent for swollen feet and ankles.',
                  scenarios: [
                    'After a long flight or long-haul drive',
                    'End of a day hiking or on your feet',
                    'Before bed on restless nights',
                    'When legs feel heavy, swollen, or fatigued',
                  ],
                },
              },
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
              {
                label: 'How to Enter',
                shape: 'steps',
                content: [
                  { text: 'Lie flat on your back. Let the feet fall open naturally, heels wider than hips.' },
                  { text: 'Arms slightly away from the body, palms facing up.' },
                  { text: 'Close the eyes. Let the weight of the body drop completely into the floor.' },
                  { text: 'Release all effort — including the effort to relax.' },
                  { text: 'Stay a minimum of 5 minutes. Longer is better. This is where the work lands.' },
                ],
              },
              {
                label: 'Activates',
                shape: 'activates',
                content: [
                  {
                    pattern: 'Parasympathetic recovery',
                    description: 'the nervous system shifts from the active, effortful state into rest-and-digest — the state in which adaptation and integration actually happen.',
                    trains: 'vagal tone, HPA axis downregulation',
                  },
                  {
                    pattern: 'Offline consolidation during rest',
                    description: 'short eyes-closed rest after learning supports memory consolidation — evidence is strongest for verbal and declarative memory, with direct support for motor skill from 15-minute post-practice rest and within-practice micro-rests. Sleep still does more for long-term motor memory, so Savasana is supplement, not substitute. Skip it and you cut practice short before the nervous system settles.',
                    trains: 'procedural memory consolidation, offline motor learning',
                  },
                  {
                    pattern: 'Attentional rest without sleep',
                    description: 'unlike sleep, the mind stays present while the body releases — a state where awareness and restoration coexist. Not unconsciousness, not a busy mind — something between.',
                  },
                ],
              },
              {
                label: 'Good For',
                shape: 'good-for',
                content: {
                  summary: 'The end of every practice, without exception.',
                  scenarios: [
                    'After every practice session — not optional',
                    'Middle of the day as a 10–20 minute reset',
                    'Post-intensive exercise to let the nervous system recover',
                    'Before sleep if the mind is wired and the body is tired',
                  ],
                },
              },
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
