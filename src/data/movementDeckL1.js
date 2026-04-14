/**
 * movementDeckL1.js — Lila Movements Level 1: The Practice
 * ═════════════════════════════════════════════════════════
 *
 * 31 cards: AUM opener + 6 sections × 5 cards each.
 * Cards marked PLACEHOLDER need content written.
 */

export const MOVEMENT_DECK_L1 = [
  {
    id: 'the-practice',
    title: 'The Practice',
    subtitle: '30 poses for a complete practice',
    desc: 'A single flowing sequence — arrive, awaken, open, balance, ground, rest. Each section builds on the last. No prerequisites, no theory. Just the body and the breath.',
    accent: '#4A7A5A',
    opener:     {
      id: "aum",
      term: "AUM",
      sanskrit: "ॐ",
      image: "aum.png",
      brief: "PLACEHOLDER",
      mnemonic: "PLACEHOLDER",
      tabs: [
        {
          label: "Details",
          content: "PLACEHOLDER",
        },
        {
          label: "Sound",
          content: "PLACEHOLDER",
        },
        {
          label: "Tradition",
          content: "PLACEHOLDER",
        }
      ],
    },
    groups: [
      {
        id: "arrive",
        label: "Arrive",
        subtitle: "Coming into the body",
        desc: "PLACEHOLDER",
        cards: [
          {
            id: "diaphragmatic-breath",
            term: "Diaphragmatic Breath",
            brief: "The primary breathing muscle — a dome-shaped sheet that forms the roof of the core canister and regulates spinal stability.",
            mnemonic: "DIA = across, PHRAGM = partition. It's the partition across your trunk. When the dome drops, air rushes in — and your spine gets stiffer.",
            image: "diaphragmatic-breath.png",
            tabs: [
              {
                label: "Details",
                content: "The diaphragm is a dome-shaped muscle sitting beneath the lungs, separating the thoracic and abdominal cavities. During inhalation, it contracts and flattens downward, creating negative pressure that draws air into the lungs while simultaneously increasing intra-abdominal pressure below. During exhalation, it relaxes back into its dome shape. Beyond breathing, the diaphragm is a critical postural stabilizer — it must coordinate with the pelvic floor, TVA, and multifidus to generate the intra-abdominal pressure that stiffens the spine before movement. Research by Hodges and Gandevia confirmed that the diaphragm increases its postural activity in anticipation of limb loading, independent of its respiratory role. Chronic chest breathing — bypassing the diaphragm — impairs this pressure system and keeps the nervous system in a low-grade stress state.",
              },
              {
                label: "Activates",
                content: [
                  "Crocodile breathing",
                  "360° breathing",
                  "box breathing",
                  "dead bug (exhale phase)",
                  "diaphragmatic breathing in all positions",
                ],
              },
              {
                label: "Injury Risk",
                content: "A chronically elevated, underused diaphragm (common in anxious, stressed, or sedentary individuals) impairs core stability and increases the demand on the lumbar extensors. Studies show that patients with chronic low back pain often have measurably reduced diaphragmatic excursion compared to pain-free individuals (Kolar et al., 2012).",
              }
            ],
          },
          {
            id: "box-breathing",
            term: "Box Breathing",
            sanskrit: "Sama Vritti",
            image: "box-breathing.png",
            brief: "PLACEHOLDER",
            mnemonic: "PLACEHOLDER",
            tabs: [
              {
                label: "Details",
                content: "PLACEHOLDER",
              },
              {
                label: "Benefits",
                content: "PLACEHOLDER",
              },
              {
                label: "Common Mistakes",
                content: "PLACEHOLDER",
              }
            ],
          },
          {
            id: "ujjayi",
            term: "Ujjayi",
            sanskrit: "Ocean Breath",
            image: "ujjayi.png",
            brief: "PLACEHOLDER",
            mnemonic: "PLACEHOLDER",
            tabs: [
              {
                label: "Details",
                content: "PLACEHOLDER",
              },
              {
                label: "Benefits",
                content: "PLACEHOLDER",
              },
              {
                label: "Common Mistakes",
                content: "PLACEHOLDER",
              }
            ],
          },
          {
            id: "cat-cow",
            term: "Cat-Cow",
            sanskrit: "Marjaryasana — Bitilasana",
            brief: "The most direct practice of pelvic tilt awareness — cycling the spine between full flexion and full extension with the breath.",
            mnemonic: "MARjaryasana = MARking the cat (arching, hissing). BiTILAsana = TILT forward (like a cow's back dipping down). Cat tucks, Cow extends.",
            image: "cat-cow.png",
            tabs: [
              {
                label: "The Pose",
                content: "Cat-cow is not a warm-up — it is a diagnostic and neurological training tool. In Cow (Bitilasana), the pelvis anteriorly tilts, the lumbar spine extends, the chest opens, and the gaze lifts. In Cat (Marjaryasana), the pelvis posteriorly tilts, the lumbar spine flexes, the thoracic spine rounds, and the gaze drops. Moving between them with conscious attention reveals where the spine is stiff (segments that don't participate) and where it over-compensates (segments that move excessively). The breath drives the movement — inhale into Cow, exhale into Cat — training the diaphragm-pelvic floor coordination simultaneously.",
              },
              {
                label: "How to Enter",
                content: "Begin in tabletop (hands under shoulders, knees under hips). Spine neutral. On inhale: let the belly drop, tailbone lifts, chest opens, gaze forward — this is Cow. On exhale: press the floor away, round the spine toward the ceiling, tuck the tailbone, drop the head — this is Cat. Move slowly. Don't rush through range. Spend 3-5 breaths in each direction noticing which spinal segments move freely and which resist.",
              },
              {
                label: "Modifications",
                content: "If wrists are sensitive, come onto fists or forearms. To isolate pelvic movement, place one hand on the lower back and feel the lumbar curve increase (Cow) and decrease (Cat). Advanced: pause at each end of range for 3 breaths before moving.",
              }
            ],
          },
          {
            id: "tadasana",
            term: "Tadasana",
            sanskrit: "Mountain Pose",
            image: "tadasana.png",
            brief: "PLACEHOLDER",
            mnemonic: "PLACEHOLDER",
            tabs: [
              {
                label: "Details",
                content: "PLACEHOLDER",
              },
              {
                label: "Benefits",
                content: "PLACEHOLDER",
              },
              {
                label: "Common Mistakes",
                content: "PLACEHOLDER",
              }
            ],
          }
        ],
      },
      {
        id: "awaken",
        label: "Awaken",
        subtitle: "Building heat",
        desc: "PLACEHOLDER",
        cards: [
          {
            id: "standing-forward-bend",
            term: "Standing Forward Bend",
            sanskrit: "Uttanasana",
            brief: "The standing version of the posterior chain stretch — gravity assists the fold and the head hangs freely, releasing suboccipital tension at the top of the Superficial Back Line.",
            mnemonic: "UT-TANA = UTTerly stretched. The entire back body is under tension. When you hang forward, the weight of the head creates traction at the very top of the Superficial Back Line.",
            image: "standing-forward-bend.png",
            tabs: [
              {
                label: "The Pose",
                content: "In Uttanasana, gravity assists the stretch — unlike Paschimottanasana where the body's weight must be managed. Hanging forward with bent knees and releasing the neck creates traction through the entire posterior chain, including the suboccipital muscles and cervical spine. Many people never release tension at the top of the chain (neck and head) — Uttanasana with a completely relaxed neck is one of the most effective ways to address this. The pose also has a strong parasympathetic effect (the head-below-heart position activates the baroreceptors) — making it calming as well as stretching.",
              },
              {
                label: "How to Enter",
                content: "Stand with feet hip-width apart. Inhale to lengthen the spine. Exhale: hinge forward from the hips, allowing the spine to follow. Bend the knees generously — this takes the hamstrings out of the stretch and allows the lower back to release. Let the head hang completely — no neck tension. Grab opposite elbows and let the weight of the arms increase the release. Hold 8-10 breaths. To come up: bend the knees, place hands on thighs, and rise with a long spine.",
              },
              {
                label: "Modifications",
                content: "Bent knees are not a modification — they are the therapeutically correct form for most people. Use blocks under the hands to maintain length in the spine. For the calves: place a rolled blanket under the heels to allow deeper forward fold for those with ankle restrictions.",
              }
            ],
          },
          {
            id: "plank",
            term: "Phalakasana",
            sanskrit: "Plank",
            image: "plank.png",
            brief: "PLACEHOLDER",
            mnemonic: "PLACEHOLDER",
            tabs: [
              {
                label: "Details",
                content: "PLACEHOLDER",
              },
              {
                label: "Benefits",
                content: "PLACEHOLDER",
              },
              {
                label: "Common Mistakes",
                content: "PLACEHOLDER",
              }
            ],
          },
          {
            id: "downward-facing-dog",
            term: "Downward-Facing Dog",
            sanskrit: "Adho Mukha Svanasana",
            brief: "The foundational full-body integration pose — simultaneously lengthens the posterior chain and strengthens the anterior chain.",
            mnemonic: "ADHO MUKHA = face downward. SVANA = dog. Watch a dog stretch when it wakes up — it naturally finds this shape. The body knows this pose.",
            image: "downward-facing-dog.png",
            tabs: [
              {
                label: "The Pose",
                content: "Downward dog is an active stretch of the Superficial Back Line — calves, hamstrings, thoracolumbar fascia, and the back of the shoulders — while simultaneously engaging the anterior chain (core, serratus anterior, shoulders). The position requires active dorsiflexion of the ankles, which loads the base of the posterior chain and often reveals calf/Achilles restriction immediately. The chest moves toward the thighs as the hip flexors release, and the head hangs between the arms to release the cervical spine. It is both strengthening and lengthening — a rare combination — which is why it functions as a \"rest pose\" in vinyasa practice once the body is warm.",
              },
              {
                label: "How to Enter",
                content: "From tabletop, tuck the toes and lift the hips toward the ceiling. Press the floor away with straight arms. Pedal the feet to warm the calves. Then press both heels toward (not necessarily to) the floor. Lengthen the spine by drawing the sit bones toward the ceiling. Release the neck — head between the arms, gaze toward the navel or knees. Hold 5-10 breaths or use as a transition pose.",
              },
              {
                label: "Modifications",
                content: "Bend the knees generously if the hamstrings or calves are tight — this allows the spine to lengthen even if the legs cannot straighten. Elevate the hands on blocks if the shoulder girdle is tight. For wrist issues: use fists, forearms (dolphin pose), or reduce time in the pose.",
              }
            ],
          },
          {
            id: "upward-dog",
            term: "Urdhva Mukha Svanasana",
            sanskrit: "Upward Dog",
            image: "upward-dog.png",
            brief: "PLACEHOLDER",
            mnemonic: "PLACEHOLDER",
            tabs: [
              {
                label: "Details",
                content: "PLACEHOLDER",
              },
              {
                label: "Benefits",
                content: "PLACEHOLDER",
              },
              {
                label: "Common Mistakes",
                content: "PLACEHOLDER",
              }
            ],
          },
          {
            id: "chair",
            term: "Utkatasana",
            sanskrit: "Chair Pose",
            image: "chair-pose.png",
            brief: "PLACEHOLDER",
            mnemonic: "PLACEHOLDER",
            tabs: [
              {
                label: "Details",
                content: "PLACEHOLDER",
              },
              {
                label: "Benefits",
                content: "PLACEHOLDER",
              },
              {
                label: "Common Mistakes",
                content: "PLACEHOLDER",
              }
            ],
          }
        ],
      },
      {
        id: "open",
        label: "Open",
        subtitle: "Creating space",
        desc: "PLACEHOLDER",
        cards: [
          {
            id: "warrior-1",
            term: "Virabhadrasana I",
            sanskrit: "Warrior I",
            image: "warrior-i.png",
            brief: "PLACEHOLDER",
            mnemonic: "PLACEHOLDER",
            tabs: [
              {
                label: "Details",
                content: "PLACEHOLDER",
              },
              {
                label: "Benefits",
                content: "PLACEHOLDER",
              },
              {
                label: "Common Mistakes",
                content: "PLACEHOLDER",
              }
            ],
          },
          {
            id: "warrior-ii",
            term: "Warrior II",
            sanskrit: "Virabhadrasana II",
            brief: "The foundational standing strength pose — simultaneously demands hip abductor stability, thoracic rotation awareness, and frontal plane endurance.",
            mnemonic: "VIRA = hero/warrior. BHADRA = auspicious/good. This is the auspicious warrior — not aggressive, but strong and settled. The gaze is steady, the stance is wide, the arms are extended like horizon lines.",
            image: "warrior-ii.png",
            tabs: [
              {
                label: "The Pose",
                content: "Warrior II is a total frontal plane pose. The wide stance demands hip abductor strength to keep the front knee tracking over the front foot (not collapsing inward). The arms extended to the sides demand deltoid endurance. The torso is upright and faces the side wall — a thoracic rotation demand that most people cannot maintain without the chest rotating forward. Holding Warrior II for 5-10 breaths is both a strength challenge (glute med, quads) and a stability challenge (knee tracking, spinal neutrality). It is one of the most physically informative poses for identifying compensation patterns.",
              },
              {
                label: "How to Enter",
                content: "From standing, step the left foot back 3-4 feet. Front foot points forward, back foot turns 90 degrees. Bend the front knee to 90 degrees — knee directly over the ankle, not past the toes. Extend arms to shoulder height, parallel to the floor. Face the side wall. Gaze over the front hand. Sink the front hip toward the floor without letting the knee collapse inward. Hold 5-10 breaths. Switch sides.",
              },
              {
                label: "Modifications",
                content: "Reduce the depth of the front knee bend to reduce quad/glute load. Focus on the front knee tracking over the second toe as the primary alignment cue — if it drifts inward, glute med needs attention.",
              }
            ],
          },
          {
            id: "deep-squat",
            term: "Deep Squat",
            sanskrit: "Malasana",
            brief: "The deepest ankle dorsiflexion pose in yoga — restoring the foundational mobility at the base of the kinetic chain.",
            mnemonic: "MALA = a garland or necklace of beads strung together. In this squat, the body is strung together in a chain from ankle to hip to spine. If one bead is stuck (the ankle), the whole garland bunches.",
            image: "deep-squat.png",
            tabs: [
              {
                label: "The Pose",
                content: "Malasana is a maximum ankle dorsiflexion position — the most restricted joint in the lower body kinetic chain. Limited ankle dorsiflexion forces compensations immediately above: heel rise, knee valgus, forward trunk lean, and lumbar flexion. All of these compensations are downstream consequences of what is fundamentally an ankle restriction. Regular practice of malasana restores dorsiflexion range, which then allows the squat, the stair climb, and the landing pattern to be performed correctly — reducing load on the knee and spine.",
              },
              {
                label: "How to Enter",
                content: "Stand with feet slightly wider than hip-width, toes turned out 30-45 degrees. Lower into a deep squat, bringing the sit bones toward the floor. Press the elbows into the inner knees to open the hips. Lengthen the spine — don't round forward excessively. If the heels rise, place a folded blanket under them. Hold 5-10 breaths or practice as a mobility drill (10 repetitions of lowering and rising).",
              },
              {
                label: "Modifications",
                content: "Heels-elevated variation (blanket under heels) allows the squat to be performed with limited ankle mobility. Hold a doorframe or yoga strap attached to a wall for balance. Progress over weeks by gradually reducing heel elevation.",
              }
            ],
          },
          {
            id: "half-lord-of-the-fishes",
            term: "Half Lord of the Fishes",
            sanskrit: "Ardha Matsyendrasana",
            brief: "The foundational seated spinal twist — specifically training thoracic rotation while learning to protect the lumbar spine from twisting.",
            mnemonic: "ARDHA = half. MATSYENDRA = the lord of fish (a great yogi who, according to legend, learned yoga from Shiva while living as a fish in the ocean). Half of his full twist — but still profound.",
            image: "half-spinal-twist.png",
            tabs: [
              {
                label: "The Pose",
                content: "Ardha Matsyendrasana is the primary thoracic rotation pose in yoga. The clinical key — and what makes it therapeutic rather than harmful — is where the rotation comes from. The lumbar spine has minimal rotation capacity (approximately 1-3 degrees per level, limited by its sagittal-plane facet joint orientation). The thoracic spine has significant rotation capacity (5-7 degrees per level × 12 levels). A twist that comes from the thoracic spine is therapeutically valuable. A twist that comes from the lumbar spine (which most people default to because their thoracic spine is stiff) creates rotational shear on the lumbar discs. Cue: \"Grow tall before you twist — rotation comes after length.\"",
              },
              {
                label: "How to Enter",
                content: "Sit with both legs extended. Bend the right knee and cross the right foot over the left leg, placing it on the floor outside the left knee. Keep the left leg extended (or bend it to tuck the left foot near the right hip). Inhale: lengthen the spine upward. Exhale: rotate to the right, placing the left elbow outside the right knee. Right hand on the floor behind you. With each inhale, lengthen. With each exhale, deepen the rotation — from the thoracic spine, not the lower back. Hold 5-8 breaths. Switch sides.",
              },
              {
                label: "Modifications",
                content: "Sit on a folded blanket to tilt the pelvis forward and ease the twist. Keep both legs extended if hip tightness prevents the setup. Use the hand on the floor rather than the elbow-to-knee lever to reduce twist intensity.",
              }
            ],
          },
          {
            id: "pigeon-prep",
            term: "Pigeon Prep",
            sanskrit: "Eka Pada Rajakapotasana",
            brief: "The deepest hip external rotation stretch in yoga — directly restores the hip mobility that the kinetic chain requires to protect the knee and lower back.",
            mnemonic: "EKA PADA = ONE FOOT. RAJA KAPOTA = KING PIGEON. One leg extended like a pigeon's tail, chest open like a king. The king of hip openers — not because it's glamorous, but because it goes deepest.",
            image: "pigeon-prep.png",
            tabs: [
              {
                label: "The Pose",
                content: "Pigeon prep is a maximum hip external rotation stretch for the front leg, combined with a hip flexor stretch for the back leg — two of the most commonly restricted movements in the hip. Hip external rotation restriction is the primary driver of compensatory lumbar rotation and knee valgus during functional movements. Restoring it — as this pose does over time — reduces load on the lumbar spine and knee proportionally. The piriformis, obturators, gemelli, and posterior gluteus medius are all under tension in the front leg. The iliopsoas of the back leg is under tension posteriorly.",
              },
              {
                label: "How to Enter",
                content: "From downward dog, bring the right knee toward the right wrist. Lower the shin toward a diagonal (or parallel to the mat for more intensity). Lower the back knee to the mat, extending the back leg straight behind. Square the hips toward the mat as much as possible. Inhale to lengthen the spine. Exhale to fold forward over the front shin, forehead to the mat or block. Hold 5-10 breaths. Switch sides.",
              },
              {
                label: "Modifications",
                content: "Place a folded blanket under the front hip to support uneven hips. If the front knee is uncomfortable, try reclined pigeon (Supta Kapotasana) on the back. Elevate the torso on blocks if folding forward creates lower back pain.",
              }
            ],
          }
        ],
      },
      {
        id: "balance",
        label: "Balance",
        subtitle: "Finding center",
        desc: "PLACEHOLDER",
        cards: [
          {
            id: "tree",
            term: "Vrksasana",
            sanskrit: "Tree Pose",
            image: "tree-pose.png",
            brief: "PLACEHOLDER",
            mnemonic: "PLACEHOLDER",
            tabs: [
              {
                label: "Details",
                content: "PLACEHOLDER",
              },
              {
                label: "Benefits",
                content: "PLACEHOLDER",
              },
              {
                label: "Common Mistakes",
                content: "PLACEHOLDER",
              }
            ],
          },
          {
            id: "warrior-3",
            term: "Virabhadrasana III",
            sanskrit: "Warrior III",
            image: "warrior-iii.png",
            brief: "PLACEHOLDER",
            mnemonic: "PLACEHOLDER",
            tabs: [
              {
                label: "Details",
                content: "PLACEHOLDER",
              },
              {
                label: "Benefits",
                content: "PLACEHOLDER",
              },
              {
                label: "Common Mistakes",
                content: "PLACEHOLDER",
              }
            ],
          },
          {
            id: "half-moon",
            term: "Ardha Chandrasana",
            sanskrit: "Half Moon",
            image: "half-moon.png",
            brief: "PLACEHOLDER",
            mnemonic: "PLACEHOLDER",
            tabs: [
              {
                label: "Details",
                content: "PLACEHOLDER",
              },
              {
                label: "Benefits",
                content: "PLACEHOLDER",
              },
              {
                label: "Common Mistakes",
                content: "PLACEHOLDER",
              }
            ],
          },
          {
            id: "triangle-pose",
            term: "Triangle Pose",
            sanskrit: "Trikonasana",
            brief: "A standing lateral stretch that opens the thoracic lateral line and trains frontal plane stability — the most undertrained plane of movement.",
            mnemonic: "TRI-KONA = three angles. Your body makes three distinct angles: the angle of the legs (wide stance), the angle of the torso (lateral bend), and the angle of the arms (one up, one down). Find all three.",
            image: "triangle-pose.png",
            tabs: [
              {
                label: "The Pose",
                content: "Triangle pose works in the frontal plane — the plane most neglected in conventional fitness. It lengthens the lateral line of the body (intercostals, obliques, QL, IT band, and lateral calves — Myers' Lateral Line) while demanding frontal plane stability from the hip abductors of the standing leg. The common error is \"collapsing into the pose\" — the torso rotating toward the floor rather than opening to the side wall — which converts the frontal plane demand into a sagittal plane one and loses the therapeutic value. The hip of the back leg must remain stacked over the heel, not drifting forward.",
              },
              {
                label: "How to Enter",
                content: "Stand with feet 3-4 feet apart, right foot forward, left foot at 90 degrees. Extend arms to a T. Inhale to lengthen. Exhale: hinge sideways over the right leg, reaching the right hand toward the shin, ankle, block, or floor. Left arm reaches to the ceiling. The torso should face the side wall — resist the urge to rotate toward the floor. Keep both sides of the waist long. Hold 5-8 breaths. Switch sides.",
              },
              {
                label: "Modifications",
                content: "Use a block under the lower hand to reduce the lateral range demanded. Focus on opening the chest toward the ceiling rather than reaching the hand lower.",
              }
            ],
          },
          {
            id: "dancer",
            term: "Natarajasana",
            sanskrit: "Dancer",
            image: "dancers-pose.png",
            brief: "PLACEHOLDER",
            mnemonic: "PLACEHOLDER",
            tabs: [
              {
                label: "Details",
                content: "PLACEHOLDER",
              },
              {
                label: "Benefits",
                content: "PLACEHOLDER",
              },
              {
                label: "Common Mistakes",
                content: "PLACEHOLDER",
              }
            ],
          }
        ],
      },
      {
        id: "ground",
        label: "Ground",
        subtitle: "Strength from stillness",
        desc: "PLACEHOLDER",
        cards: [
          {
            id: "boat-pose",
            term: "Boat Pose",
            sanskrit: "Navasana",
            brief: "The seated core challenge — demands isometric TVA and hip flexor engagement while maintaining a neutral, elongated spine.",
            mnemonic: "NAVA = boat. Your body is the hull of the boat — the legs are the bow, the torso is the stern, and the core keeps it from sinking in the middle.",
            image: "boat-pose.png",
            tabs: [
              {
                label: "The Pose",
                content: "Navasana is commonly taught as a \"core strengthener\" but is more accurately a core stability and hip flexor endurance pose. The challenge is maintaining a long, neutral spine (not a rounded back) while balancing on the sit bones — this requires TVA activation to prevent spinal collapse. When the spine rounds (the common compensation), the deep core disengages and the superficial flexors take over. A shorter, flatter version with a long spine is more therapeutically valuable than a deep V-shape with a rounded back. The pose also directly loads the iliopsoas isometrically — relevant for its role as a lumbar stabilizer.",
              },
              {
                label: "How to Enter",
                content: "Sit with knees bent, feet flat. Lean back slightly and find balance on the sit bones. Lift the feet, shins parallel to the floor. Extend the arms forward. Lengthen the spine — imagine someone pulling your crown toward the ceiling. If the spine stays long, begin to straighten the legs. If it rounds, keep the knees bent. Hold 3-5 breaths. Rest and repeat.",
              },
              {
                label: "Modifications",
                content: "Keep the knees bent throughout (the therapeutic version). Hold the backs of the thighs for support while learning the balance. For advanced practitioners: lower toward the floor on an exhale (Navasana to Ardha Navasana) for eccentric loading.",
              }
            ],
          },
          {
            id: "bridge-pose",
            term: "Bridge Pose",
            sanskrit: "Setu Bandha Sarvangasana",
            brief: "A posterior chain strengthener and hip flexor opener in one — directly addresses the Lower Crossed Syndrome pattern.",
            mnemonic: "SETU = bridge. You are literally building a bridge with your body. The arch of your spine is the bridge's span, your feet and shoulders are the supports.",
            image: "bridge-pose.png",
            tabs: [
              {
                label: "The Pose",
                content: "Bridge pose simultaneously strengthens the glutes and hamstrings (the muscles that are weak in Lower Crossed Syndrome) while stretching the hip flexors and anterior spine (the muscles that are tight). When performed with attention to pelvic position — pressing the lower back toward the mat at the base, then peeling the spine up vertebra by vertebra — it teaches conscious segmental spinal control. The bridged position is a mild anterior pelvic tilt with the spine in extension, which is the exact counterposition to the posteriorly tilted, flexion-dominant sitting posture most people live in.",
              },
              {
                label: "How to Enter",
                content: "Lie on your back, knees bent, feet hip-width apart, heels close to the sit bones. Arms alongside the body, palms down. Inhale to prepare. Exhale: press through the feet, engage the glutes, and lift the hips — peeling the spine off the mat from the tailbone upward. Pause at the top: press feet and arms into the floor, lift the sternum toward the chin. Hold 5-8 breaths. Lower on an exhale, rolling down one vertebra at a time.",
              },
              {
                label: "Modifications",
                content: "Place a block under the sacrum for a supported, restorative version (great for acute lower back pain). Press a yoga block between the thighs to activate adductors and prevent knee splay. Interlace fingers beneath the back and press arms into the mat for more chest opening.",
              }
            ],
          },
          {
            id: "seated-forward-bend",
            term: "Seated Forward Bend",
            sanskrit: "Paschimottanasana",
            brief: "The full-length stretch of the Superficial Back Line — from the soles of the feet to the base of the skull in one continuous fold.",
            mnemonic: "PASCHIMA = the west — in yogic tradition, the back of the body faces west. This pose stretches the entire west side of the body: the whole posterior chain from heel to head.",
            image: "seated-forward-bend.png",
            tabs: [
              {
                label: "The Pose",
                content: "Paschimottanasana is the purest expression of the Superficial Back Line (Thomas Myers, Anatomy Trains). The fold places the entire posterior chain under simultaneous tension — plantar fascia, calves, hamstrings, sacrotuberous ligament, thoracolumbar fascia, erector spinae, and suboccipital muscles. This is why many people feel this pose \"not just in the hamstrings\" but throughout the entire back body. The pose also reveals where the line is most restricted — if the hamstrings prevent forward fold, the lower back rounds excessively (compensating). The goal is not to touch the feet but to hinge from the hip crease with a long spine, allowing the tension to be distributed along the entire line rather than concentrated in one location.",
              },
              {
                label: "How to Enter",
                content: "Sit with legs extended, sitting bones grounded. Flex the feet. Inhale: grow tall, lengthen the spine. Exhale: hinge forward from the hip creases (not the waist), reaching toward the feet. Keep the spine as long as possible — a flat back with bent knees is more therapeutic than a rounded spine with straight legs. Hold whatever you reach comfortably — shins, ankles, feet, or a strap around the feet. Hold 5-10 breaths, releasing deeper on each exhale.",
              },
              {
                label: "Modifications",
                content: "Use a yoga strap around the feet to maintain a long spine with tight hamstrings. Sit on a folded blanket to tilt the pelvis forward. For yin practice, fully relax the spine into a round and hold 3-5 minutes — this shifts the emphasis from muscular to fascial lengthening.",
              }
            ],
          },
          {
            id: "fish",
            term: "Matsyasana",
            sanskrit: "Fish Pose",
            image: "fish-pose.png",
            brief: "PLACEHOLDER",
            mnemonic: "PLACEHOLDER",
            tabs: [
              {
                label: "Details",
                content: "PLACEHOLDER",
              },
              {
                label: "Benefits",
                content: "PLACEHOLDER",
              },
              {
                label: "Common Mistakes",
                content: "PLACEHOLDER",
              }
            ],
          },
          {
            id: "reclined-bound-angle",
            term: "Supta Baddha Konasana",
            sanskrit: "Reclined Bound Angle",
            image: "reclined-bound-angle.png",
            brief: "PLACEHOLDER",
            mnemonic: "PLACEHOLDER",
            tabs: [
              {
                label: "Details",
                content: "PLACEHOLDER",
              },
              {
                label: "Benefits",
                content: "PLACEHOLDER",
              },
              {
                label: "Common Mistakes",
                content: "PLACEHOLDER",
              }
            ],
          }
        ],
      },
      {
        id: "rest",
        label: "Rest",
        subtitle: "Returning home",
        desc: "PLACEHOLDER",
        cards: [
          {
            id: "childs-pose",
            term: "Child's Pose",
            sanskrit: "Balasana",
            brief: "The foundational resting pose — simultaneously decompresses the lumbar spine, opens the thoracic back, and activates the parasympathetic nervous system.",
            mnemonic: "BALA = child. Children instinctively fold into this shape when they need rest. The body returns to a position of no threat — spine long, hips folded, forehead on the earth.",
            image: "childs-pose.png",
            tabs: [
              {
                label: "The Pose",
                content: "Balasana places the spine in a supported flexion position — decompressing the posterior lumbar elements (facet joints, ligaments) that are compressed by prolonged standing or back-loading activities. The arms extended forward create traction through the thoracic spine and lats. When practiced with knees wide (full child's pose), the inner groins and hip rotators receive a passive stretch. The forehead-on-the-floor position activates the vagus nerve through facial contact, contributing to the parasympathetic (rest-and-digest) response. This is not a passive \"do nothing\" pose — it is active spinal decompression, thoracic opening, and nervous system regulation.",
              },
              {
                label: "How to Enter",
                content: "From tabletop, bring the big toes together and widen the knees to the edges of the mat. Lower the hips toward the heels. Walk the hands forward, extending the arms fully. Rest the forehead on the mat or a block. Breathe into the back of the ribcage — feel the thoracic spine expand with each inhale. Hold 5-15 breaths, or as long as needed.",
              },
              {
                label: "Modifications",
                content: "Place a folded blanket between the thighs and calves if the hips don't reach the heels. Support the forehead on a block to reduce neck strain. Narrow the knees (touching) for a more intense lumbar stretch. Arms alongside the body (reverse child's pose) for shoulder relief.",
              }
            ],
          },
          {
            id: "supine-twist",
            term: "Supta Matsyendrasana",
            sanskrit: "Supine Twist",
            image: "supine-twist.png",
            brief: "PLACEHOLDER",
            mnemonic: "PLACEHOLDER",
            tabs: [
              {
                label: "Details",
                content: "PLACEHOLDER",
              },
              {
                label: "Benefits",
                content: "PLACEHOLDER",
              },
              {
                label: "Common Mistakes",
                content: "PLACEHOLDER",
              }
            ],
          },
          {
            id: "legs-up-the-wall",
            term: "Legs-Up-the-Wall",
            sanskrit: "Viparita Karani",
            brief: "A restorative inversion that decompresses the lumbar spine, relieves lower back pain, and resets the nervous system.",
            mnemonic: "VIPARITA = reversed/opposite. Everything is reversed: legs up, hips released, nervous system switching from stress (sympathetic) to rest (parasympathetic). The antidote to a day of sitting.",
            image: "legs-up-the-wall.png",
            tabs: [
              {
                label: "The Pose",
                content: "With the legs elevated against the wall and the pelvis on the floor (or on a bolster), the lumbar spine decompresses — gravitational compression along the spinal axis is removed. The hip flexors release passively. The venous return from the lower legs to the heart is assisted by gravity — helpful for people who stand or sit all day. The parasympathetic nervous system activation makes this one of the most effective restorative poses for stress and lower back tension. When practiced with a bolster under the sacrum (lifting the pelvis slightly), the lumbar spine moves into mild extension — directly counteracting the posterior tilt and lumbar flattening of prolonged sitting.",
              },
              {
                label: "How to Enter",
                content: "Sit sideways next to a wall. As you lie down, swing your legs up the wall. Scoot your sit bones as close to the wall as comfortable. Arms rest by the sides or on the belly. Close the eyes. Stay 5-15 minutes. To come out: bend the knees, push away from the wall, and roll to one side before rising.",
              },
              {
                label: "Modifications",
                content: "Place a folded blanket or bolster under the sacrum to elevate the hips and increase lumbar extension. If the hamstrings are tight, move further from the wall to allow a slight bend in the knees.",
              }
            ],
          },
          {
            id: "happy-baby",
            term: "Ananda Balasana",
            sanskrit: "Happy Baby",
            image: "happy-baby.png",
            brief: "PLACEHOLDER",
            mnemonic: "PLACEHOLDER",
            tabs: [
              {
                label: "Details",
                content: "PLACEHOLDER",
              },
              {
                label: "Benefits",
                content: "PLACEHOLDER",
              },
              {
                label: "Common Mistakes",
                content: "PLACEHOLDER",
              }
            ],
          },
          {
            id: "savasana",
            term: "Savasana",
            sanskrit: "Corpse Pose",
            image: "savasana.png",
            brief: "PLACEHOLDER",
            mnemonic: "PLACEHOLDER",
            tabs: [
              {
                label: "Details",
                content: "PLACEHOLDER",
              },
              {
                label: "Benefits",
                content: "PLACEHOLDER",
              },
              {
                label: "Common Mistakes",
                content: "PLACEHOLDER",
              }
            ],
          }
        ],
      }
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

  return screens;
}
