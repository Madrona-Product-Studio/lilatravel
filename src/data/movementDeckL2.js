/**
 * movementDeckL2.js — Lila Movements Level 2: How It Works
 * ═════════════════════════════════════════════════════════
 *
 * 47 cards across 3 chapters. All data pulled directly from
 * the original movementDeck.js — no edits to card content.
 *
 * Chapter 1: How Your Body Works (33 cards, 6 groups)
 * Chapter 2: What Modern Life Does To It (10 cards, 5 groups)
 * Chapter 3: How To Think About It (4 cards, 2 groups)
 */

export const MOVEMENT_DECK_L2 = [
{
    id: "how-your-body-works",
    title: "How Your Body Works",
    subtitle: "Anatomy & Movement Science",
    desc: "The vocabulary of your body — muscles, joints, and the systems that connect them. Not memorization, but recognition. Learn the pieces so you can feel them move.",
    accent: "#2D6B6B",
    groups: [
      {
        id: "breath-core",
        label: "Breath & Deep Core",
        subtitle: "The invisible architecture",
        desc: "Your deepest layer of stability isn't muscle you can see or flex. It's a pressurized chamber — diaphragm on top, pelvic floor below, deep muscles wrapping the sides. When it works, your spine is protected before you even think about moving. When it doesn't, everything else compensates.",
        icon: "◎",
        cards: [
          {
            id: "core-canister",
            term: "The Core Canister",
            brief: "The body's true core — a pressurized chamber with the diaphragm as the lid, pelvic floor as the base, and transverse abdominis as the walls.",
            mnemonic: "Think of a sealed soda can. The pressure inside is what keeps it rigid. Your core works the same way — internal pressure, not surface muscles, creates spinal stability.",
            image: "core-canister.png",
            tabs: [
              {
                label: "Details",
                content: "The core canister is the clinical term for the deep stabilization system of the trunk. It comprises four structures working as a coordinated unit: the diaphragm (top), pelvic floor (base), transverse abdominis (anterior and lateral walls), and multifidus (posterior wall). When these four co-contract, they increase intra-abdominal pressure — a hydraulic mechanism that stiffens the spine and protects it under load. This system activates automatically before any limb movement in a healthy body. After injury or chronic pain, this automatic activation is often disrupted and requires specific retraining. The core canister is not about strength — it is about timing and coordination.",
              },
              {
                label: "Activates",
                content: [
                  "Dead bug",
                  "bird dog",
                  "diaphragmatic breathing",
                  "hollow body hold",
                  "90/90 breathing",
                ],
              },
              {
                label: "Injury Risk",
                content: "When the canister fails to pressurize correctly — often due to chronic shallow breathing, injury, or postpartum changes — the body defaults to bracing with the larger, more superficial muscles (rectus abdominis, erector spinae). This surface bracing is less efficient and eventually leads to fatigue, compression, and pain.",
              },
            ],
          },
          {
            id: "diaphragm",
            term: "Diaphragm",
            brief: "The primary breathing muscle — a dome-shaped sheet that forms the roof of the core canister and regulates spinal stability.",
            mnemonic: "DIA = across, PHRAGM = partition. It's the partition across your trunk. When the dome drops, air rushes in — and your spine gets stiffer.",
            image: "diaphragm.png",
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
              },
            ],
          },
          {
            id: "transverse-abdominis",
            term: "Transverse Abdominis (TVA)",
            brief: "The deepest abdominal muscle — a horizontal corset that wraps around the trunk and is the body's first line of spinal defense.",
            mnemonic: "TRANSverse = it runs TRANSversely (horizontally). Think of it as your internal weight belt — not the one you wear, the one you were born with.",
            image: "transverse-abdominis.png",
            tabs: [
              {
                label: "Details",
                content: "The TVA runs horizontally from the thoracolumbar fascia at the back, around the sides, to the linea alba at the front — like a corset encircling the trunk. Unlike the rectus abdominis (which flexes the spine), the TVA's primary role is stabilization: it increases intra-abdominal pressure and stiffens the thoracolumbar fascia to protect the lumbar spine from shear forces. Research by Hodges and Richardson (1996) demonstrated that in healthy individuals, the TVA activates 30–110ms before limb movement — a pre-emptive stabilizing response. In people with chronic low back pain, this timing is consistently delayed. The TVA cannot function in isolation: it requires co-activation of the pelvic floor (below) and diaphragm (above) to effectively increase intra-abdominal pressure.",
              },
              {
                label: "Activates",
                content: [
                  "Dead bug",
                  "bird dog",
                  "Pallof press",
                  "hollow body hold",
                  "drawing-in maneuver",
                ],
              },
              {
                label: "Injury Risk",
                content: "A non-activating or poorly coordinated TVA is one of the strongest predictors of low back pain recurrence. Unlike other muscles, the TVA often does not regain automatic function after injury without specific retraining — general exercise alone is insufficient.",
              },
            ],
          },
          {
            id: "pelvic-floor",
            term: "Pelvic Floor",
            brief: "A hammock of muscles at the base of the pelvis — the floor of the core canister and an often-ignored foundation of whole-body stability.",
            mnemonic: "The pelvic floor is the base of the can. Without a solid base, the can collapses — no matter how strong the sides are.",
            image: "pelvic-floor.png",
            tabs: [
              {
                label: "Details",
                content: "The pelvic floor is a group of muscles and connective tissues forming a hammock-like structure spanning the base of the pelvis, from the pubic bone at the front to the coccyx at the back. It supports the bladder, bowel, and reproductive organs, controls continence, and — critically — forms the base of the core pressure system. The pelvic floor and TVA are synergistic: they co-contract simultaneously. During inhalation, the diaphragm descends and the pelvic floor gently lengthens; during exhalation, the diaphragm rises and the pelvic floor lifts. This piston-like relationship is the foundation of efficient intra-abdominal pressure management. When this coordination is disrupted, the pelvic floor bears excessive load — contributing to incontinence, prolapse, and pelvic pain.",
              },
              {
                label: "Activates",
                content: [
                  "Diaphragmatic breathing",
                  "Kegel exercises (coordinated with breath)",
                  "dead bug",
                  "yoga boat pose",
                  "functional movements like squatting and lifting with breath coordination",
                ],
              },
              {
                label: "Injury Risk",
                content: "Pelvic floor dysfunction is far more common than recognized, affecting men and women. It presents as excessive tension (hypertonicity), weakness, or poor coordination. Treating the pelvic floor in isolation from the diaphragm and TVA — as many conventional pelvic floor programs do — misses the systemic nature of the problem.",
              },
            ],
          },
          {
            id: "multifidus",
            term: "Multifidus",
            brief: "The deepest back muscle — running along the spine's posterior wall and providing segment-by-segment stabilization of each vertebra.",
            mnemonic: "MULTI = many, FIDUS = faithful (Latin). Many faithful supporters of the spine — one for each vertebra, holding each level steady.",
            image: "multifidus.png",
            tabs: [
              {
                label: "Details",
                content: "The multifidus is a series of short, deep muscles running from the sacrum to the cervical spine, bridging adjacent vertebrae with overlapping fibers. Unlike the erector spinae (which acts over many spinal levels), the multifidus provides intersegmental stabilization — controlling the position of individual vertebrae in relation to each other. The lumbar multifidus is particularly important: it co-activates with the TVA as part of the intrinsic stabilization subsystem. Research by Hides et al. showed that the multifidus rapidly and specifically atrophies following a first episode of low back pain — and does not spontaneously recover even when pain resolves, making it a primary target in back pain rehabilitation.",
              },
              {
                label: "Activates",
                content: [
                  "Bird dog",
                  "quadruped holds",
                  "McGill's Big Three (curl-up, side plank, bird dog)",
                  "deadlift (isometric hold)",
                  "yoga locust pose",
                ],
              },
              {
                label: "Injury Risk",
                content: "Multifidus atrophy — measurable via ultrasound — is consistently found in patients with chronic low back pain, disc herniation, and spondylolisthesis. Its failure shifts load to the passive structures (discs, ligaments) that are not designed for continuous stabilization.",
              },
            ],
          },
          {
            id: "rectus-abdominis",
            term: "Rectus Abdominis",
            brief: "The paired vertical muscle running down the front of the abdomen — the visible \"six-pack\" and the most superficial of the abdominal muscles.",
            mnemonic: "RECTUS = straight (Latin) — it runs straight down the front, like a ruler. It's the most visible ab muscle, but not the most important one for stability.",
            image: "rectus-abdominis.png",
            tabs: [
              {
                label: "Details",
                content: "The rectus abdominis runs from the pubic crest to the sternum and ribs, divided into segments by tendinous intersections that create the visible \"six-pack\" appearance. Its primary action is spinal flexion (curling the trunk forward) and compression of the abdominal cavity. Despite its cultural status as the symbol of core fitness, the rectus abdominis plays a minor role in spinal stability compared to the deep core canister. It is a global mover, not a local stabilizer. A large, strong rectus combined with a dysfunctional deep core is a common and problematic pattern — appearing fit on the surface while being unstable underneath.",
              },
              {
                label: "Activates",
                content: [
                  "Crunch",
                  "hanging leg raise",
                  "ab wheel rollout",
                  "boat pose",
                  "dragon flag",
                ],
              },
              {
                label: "Injury Risk",
                content: "Diastasis recti — a separation of the rectus abdominis along the midline linea alba — can occur from excessive loading, rapid increase in intra-abdominal pressure, or pregnancy. A focus on traditional crunches at the expense of deep core training is a common contributor.",
              },
            ],
          },
        ],
      },
      {
        id: "pelvic-engine",
        label: "The Pelvic Engine",
        subtitle: "The keystone of the body",
        desc: "The pelvis is the crossroads — spine above, legs below, core wrapping around it. Every force you generate passes through here. The muscles that control it determine how you walk, how you stand, and whether your back hurts. This is where power originates.",
        icon: "◇",
        cards: [
          {
            id: "the-pelvis",
            term: "The Pelvis",
            brief: "The basin-shaped ring of bones at the center of the body — the structural keystone connecting the spine to the legs.",
            mnemonic: "The pelvis is the keystone of an arch. Remove or misalign the keystone and the whole structure shifts. Everything above and below depends on where it sits.",
            image: "pelvis.png",
            tabs: [
              {
                label: "Details",
                content: "The pelvis is formed by three bones — the ilium, ischium, and pubis — fused together on each side, joined at the front by the pubic symphysis and at the back by the sacrum. Its orientation in space (pelvic tilt) directly determines the lumbar curve above and the angle of the hip joints below. Key landmarks: the ASIS (anterior superior iliac spine) at the front, the PSIS (posterior superior iliac spine) at the back, and the ischial tuberosities (the sit bones) at the base. Neutral pelvis — the position in which the lumbar spine maintains its natural lordosis without compression or flattening — is the foundational reference point for all movement assessment. Every major lower body and spinal muscle attaches to the pelvis, making it the literal center of the musculoskeletal system.",
              },
              {
                label: "Activates",
                content: [
                  "Pelvic tilts (cat-cow)",
                  "hip hinge",
                  "all standing lower body movements",
                ],
              },
              {
                label: "Injury Risk",
                content: "There is no such thing as a \"perfect\" pelvic position — individual anatomy varies. However, fixed deviations from neutral (anterior or posterior tilt) create predictable patterns of muscle overload and underuse that accumulate into chronic pain over time.",
              },
            ],
          },
          {
            id: "iliopsoas",
            term: "Iliopsoas (Hip Flexors)",
            brief: "The most powerful hip flexor — a composite of two muscles (iliacus and psoas major) that connects the lumbar spine directly to the femur.",
            mnemonic: "ILIOpsoas = ILIO (ilium/pelvis) + PSOAS (Greek for \"loin\"). It literally bridges your spine to your leg — the only muscle that does this. Pull it short and your lumbar spine comes with it.",
            image: "iliopsoas.png",
            tabs: [
              {
                label: "Details",
                content: "The iliopsoas is formed by the union of the iliacus (originating from the inner surface of the ilium) and the psoas major (originating from the bodies and transverse processes of T12-L5 vertebrae). They merge into a single tendon attaching to the lesser trochanter of the femur. Because the psoas attaches directly to the lumbar vertebrae, a tight or overactive psoas creates an anterior pull on the lumbar spine — increasing lordosis and contributing to anterior pelvic tilt. The iliopsoas is also a critical stabilizer of the lumbar spine in upright posture, functioning differently in standing than in sitting. Chronic shortening from prolonged sitting is one of the most prevalent movement dysfunctions in modern humans.",
              },
              {
                label: "Activates",
                content: [
                  "Lunge hip flexor stretch",
                  "couch stretch",
                  "warrior I",
                  "psoas march",
                  "hanging knee raise",
                ],
              },
              {
                label: "Injury Risk",
                content: "Chronic shortening of the iliopsoas is a primary driver of anterior pelvic tilt and lumbar compression. Hip flexor tightness has also been linked to hamstring strain injuries in athletes (Mendiguchia et al., 2021), as the pelvis tilts forward and places the hamstrings in a lengthened, vulnerable position.",
              },
            ],
          },
          {
            id: "gluteus-maximus",
            term: "Gluteus Maximus",
            brief: "The largest muscle in the body — the primary driver of hip extension and a critical counterbalance to the hip flexors.",
            mnemonic: "MAX = the maximum, the biggest. The glute MAX is the main event of the posterior chain. If it goes quiet, something else has to do its job — and that something else eventually gets hurt.",
            image: "gluteus-maximus.png",
            tabs: [
              {
                label: "Details",
                content: "The gluteus maximus originates from the ilium, sacrum, and coccyx and inserts into the femur and iliotibial band. Its primary function is hip extension — driving the thigh backward — which is fundamental to walking, running, jumping, and rising from a seated position. It also externally rotates the hip and contributes to pelvic stability. Despite being the body's largest muscle, the glute max is frequently inhibited in people who sit for long periods — a phenomenon Janda called \"gluteal amnesia.\" When the glute max underperforms, the hamstrings and lower back compensate, taking on loads they are not designed to sustain.",
              },
              {
                label: "Activates",
                content: [
                  "Hip thrust",
                  "glute bridge",
                  "deadlift",
                  "step-up",
                  "single-leg hip thrust",
                  "Bulgarian split squat",
                ],
              },
              {
                label: "Injury Risk",
                content: "Glute max inhibition shifts load to the hamstrings and lumbar extensors. The result is a predictable pattern of hamstring strains, sacroiliac joint pain, and chronic lower back pain. Research by Brookbush Institute confirms the central role of glute max strengthening in lumbo-pelvic hip complex rehabilitation.",
              },
            ],
          },
          {
            id: "gluteus-medius",
            term: "Gluteus Medius",
            brief: "The hip stabilizer — a fan-shaped muscle on the outer hip that controls pelvic level with every step you take.",
            mnemonic: "MEDius = the middle glute. Think of it as the HIP STABILIZER. Weak glute med = the hip sinks when you walk. Strong glute med = the pelvis stays level.",
            image: "gluteus-medius.png",
            tabs: [
              {
                label: "Details",
                content: "The gluteus medius fans out on the outer surface of the ilium, attaching to the greater trochanter of the femur. Its most critical function is preventing the pelvis from dropping on the opposite side during single-leg stance — the action that occurs with every single step during walking and running. This frontal-plane pelvic control is tested by the Trendelenburg sign: if the hip drops during single-leg stance, glute med is insufficient. The glute med also abducts the hip and contributes to internal and external rotation depending on which fiber group is engaged.",
              },
              {
                label: "Activates",
                content: [
                  "Clamshell",
                  "side-lying leg raise",
                  "lateral band walk",
                  "single-leg deadlift",
                  "single-leg squat",
                ],
              },
              {
                label: "Injury Risk",
                content: "Weak glute med is linked to a cascade of downstream problems: IT band syndrome (lateral knee pain), patellofemoral pain (anterior knee pain), hip bursitis, and low back pain. It is one of the most clinically significant muscles in lower body rehabilitation and is consistently undertrained in conventional fitness programs.",
              },
            ],
          },
          {
            id: "adductors",
            term: "Adductors (Inner Thigh)",
            brief: "Five muscles of the inner thigh that bring the legs together and play a critical role in pelvic stability during movement.",
            mnemonic: "ADDuctor = ADD legs together. The inner thighs are the peacemakers — they bring everything back to center. Think of a horse rider squeezing the saddle.",
            image: "adductors.png",
            tabs: [
              {
                label: "Details",
                content: "The adductor group — adductor longus, adductor brevis, adductor magnus, gracilis, and pectineus — runs from the pubic bone and ischium to the femur and tibia. Collectively they adduct the hip (draw the thigh toward the midline), but their role is more complex: the adductor magnus also assists in hip extension, making it functionally a posterior chain muscle as well as an inner thigh muscle. The adductors are important for pelvic stability in the frontal plane — they work in balance with the glute med to prevent lateral pelvic shift during gait. They are frequently undertrained in conventional fitness programs.",
              },
              {
                label: "Activates",
                content: [
                  "Sumo squat",
                  "Copenhagen plank (highest adductor load)",
                  "lateral lunge",
                  "adductor squeeze with ball",
                  "yoga goddess pose",
                ],
              },
              {
                label: "Injury Risk",
                content: "Adductor (groin) strains are among the most common sports injuries in activities involving rapid direction change — soccer, hockey, basketball. The adductor longus is most frequently torn. The Copenhagen plank is the highest-evidence exercise for adductor injury prevention.",
              },
            ],
          },
        ],
      },
      {
        id: "spine",
        label: "The Spine",
        subtitle: "The central column",
        desc: "Not a rigid pole — a spring-loaded stack of 24 movable vertebrae, each with its own role. The curves absorb shock. The discs allow motion. The ligaments set limits. Understanding how it's built is the first step to understanding why it breaks down.",
        icon: "☰",
        cards: [
          {
            id: "spinal-curves",
            term: "The Spinal Curves",
            brief: "Four natural curves of the spine — cervical lordosis, thoracic kyphosis, lumbar lordosis, and sacral kyphosis — that function as a shock-absorbing spring system.",
            mnemonic: "The spine is shaped like a spring-loaded S. The curves don't exist despite each other — they depend on each other. Change one and they all adjust.",
            image: "spinal-curves.png",
            tabs: [
              {
                label: "Details",
                content: "The spine's four curves are not structural accidents — they are load-distribution strategies. The cervical and lumbar lordoses (inward curves) place those regions under compressive load, which bones and discs handle well. The thoracic kyphosis (outward curve) creates the protective cage for the heart and lungs. Together, the S-curve multiplies the spine's shock-absorbing capacity tenfold compared to a straight column. The sacral kyphosis is fixed (the sacrum is fused bone). The cervical, thoracic, and lumbar curves are dynamic — they influence each other moment to moment. Research from sagittal balance literature confirms that these four curves must maintain a harmonious relationship for minimum energy expenditure during upright posture (Vialle et al., 2005).",
              },
              {
                label: "Activates",
                content: [
                  "Cat-cow (explores the full range of all curves)",
                  "spinal extension work",
                  "pelvic tilts",
                ],
              },
              {
                label: "Injury Risk",
                content: "Loss of the lumbar lordosis (flat back) increases anterior disc pressure. Exaggeration of lumbar lordosis (excessive arch) increases posterior facet joint compression. Either extreme, when fixed, produces predictable patterns of pain — the curve itself is not the problem, its rigidity is.",
              },
            ],
          },
          {
            id: "intervertebral-discs",
            term: "Intervertebral Discs",
            brief: "The fibrocartilaginous shock absorbers between each vertebra — the spine's cushioning system and one of its most commonly injured structures.",
            mnemonic: "Think of the disc as a jelly doughnut: tough outer ring (annulus fibrosus), soft inner core (nucleus pulposus). Repetitive bending under load squeezes the jelly toward the back of the doughnut — where the nerves are.",
            image: "intervertebral-discs.png",
            tabs: [
              {
                label: "Details",
                content: "Between each pair of vertebrae sits an intervertebral disc — a structure consisting of a tough outer fibrous ring (annulus fibrosus) and a gel-like inner core (nucleus pulposus). The disc functions as a shock absorber, load distributor, and spacer that allows spinal movement. It receives nutrition through diffusion, not direct blood supply — which is why disc injuries heal slowly. Under compressive load, the nucleus distributes force radially to the annulus. Under repeated flexion (like rounding the back to lift), the nucleus migrates posteriorly toward the thinnest and most vulnerable part of the annulus — where the spinal nerves exit. This is the mechanism of disc herniation. McGill's research shows that the spine tolerates high compressive forces well when neutral, but fails quickly under repeated flexion-compression cycles.",
              },
              {
                label: "Activates",
                content: [
                  "McKenzie extension exercises",
                  "lumbar extension (carefully)",
                  "core stabilization to reduce disc load",
                  "swimming",
                  "walking",
                ],
              },
              {
                label: "Injury Risk",
                content: "Disc herniation is the protrusion of nucleus material through the annulus — most commonly posterolateral, compressing adjacent nerve roots. The L4-L5 and L5-S1 discs are by far the most commonly herniated, accounting for the majority of cases of sciatica.",
              },
            ],
          },
          {
            id: "thoracic-spine",
            term: "The Thoracic Spine",
            brief: "The mid-back (T1-T12) — the body's primary rotational region and the most chronically stiff segment in modern humans.",
            mnemonic: "The thoracic spine is the trunk of the body's rotational tree. When the trunk is stiff, the branches (neck, lower back) bend more than they should — and eventually break.",
            image: "thoracic-spine.png",
            tabs: [
              {
                label: "Details",
                content: "The thoracic spine consists of 12 vertebrae attached to the rib cage. Its facet joints are oriented at approximately 60 degrees to the transverse plane — an orientation that makes the thoracic spine the body's primary rotational region (Panjabi et al., 1993). By contrast, lumbar facet joints are oriented almost vertically in the sagittal plane, which severely restricts rotation. This anatomical difference is clinically significant: the thoracic spine is designed to twist; the lumbar spine is not. When thoracic rotation is lost — as happens chronically in desk workers and screen users — the lumbar spine is forced to compensate with rotational movement it was not built for, compressing lumbar discs asymmetrically. Research published in the Journal of Orthopaedic & Sports Physical Therapy found that thoracic extension range in young, asymptomatic adults from a standing position averages only 8.7 degrees — dramatically lower than in unloaded positions like prone lying — confirming that gravity and habitual posture actively limit thoracic extension capacity (Edmondston et al., 2011).",
              },
              {
                label: "Activates",
                content: [
                  "Thoracic rotation stretch",
                  "thoracic extension over foam roller",
                  "cat-cow with focus on thoracic segments",
                  "thread-the-needle stretch",
                  "spinal twists in yoga",
                ],
              },
              {
                label: "Injury Risk",
                content: "Thoracic stiffness is one of the most undertreated contributors to both lower back pain and shoulder impingement. When the thoracic spine does not rotate adequately for overhead movements, the shoulder compensates with excessive glenohumeral movement — compressing the rotator cuff against the acromion. When it does not extend adequately for backbends, the lumbar spine hyperextends to compensate.",
              },
            ],
          },
          {
            id: "lumbar-spine",
            term: "The Lumbar Spine",
            brief: "The lower back (L1-L5) — the spine's load-bearing workhorse, designed for flexion and extension but highly vulnerable to rotation and shear.",
            mnemonic: "The lumbar spine is the base of a skyscraper — it carries the most weight and must be the most stable. Give it rotational movement it wasn't built for and it fails — predictably, painfully, and over time.",
            image: "lumbar-spine.png",
            tabs: [
              {
                label: "Details",
                content: "The five lumbar vertebrae are the largest in the spine and bear the cumulative load of everything above them. Lumbar facet joints are oriented in the sagittal plane — designed for flexion and extension, but structurally resistant to rotation (approximately 1-3 degrees per level). This makes the lumbar spine a stability region, not a mobility region. Normal lumbar lordosis — the gentle inward curve of the lower back — distributes compressive load evenly across the disc. When lordosis is lost (posterior pelvic tilt, flat back posture) or exaggerated (anterior pelvic tilt), load concentrates on the anterior or posterior disc respectively. The lumbar discs — particularly L4/L5 and L5/S1 — are the most commonly herniated discs in the human body, largely because of chronic inappropriate loading patterns.",
              },
              {
                label: "Activates",
                content: [
                  "Hip hinge (deadlift, good morning)",
                  "lumbar extension work (cobra, locust)",
                  "cat-cow",
                  "McGill's Big Three",
                ],
              },
              {
                label: "Injury Risk",
                content: "Lumbar disc herniation occurs when the annular fibers of the disc are repeatedly loaded in flexion (especially combined with rotation) — the exact movement pattern of bending forward and twisting. Most lumbar injuries are not traumatic events but the cumulative result of poor loading patterns over months and years.",
              },
            ],
          },
          {
            id: "sacrum-si-joint",
            term: "Sacrum & SI Joint",
            brief: "The triangular base of the spine — where the spine meets the pelvis, and where force transfers between the upper and lower body.",
            mnemonic: "SACRUM = Latin for \"sacred bone\" — ancient cultures knew it was the structural center of the body. The SI joint is the hinge where the spine and pelvis meet. Jam that hinge and pain radiates everywhere.",
            image: "sacrum-si-joint.png",
            tabs: [
              {
                label: "Details",
                content: "The sacrum is a triangular fusion of five vertebrae at the base of the spine, wedged between the two iliac bones of the pelvis. The sacroiliac (SI) joint is the articulation between the sacrum and the ilium — one of the most force-loaded joints in the body, transferring load from the spine to the legs via the pelvis. Unlike most joints, the SI joint moves very little — only 2-4 degrees of rotation and 1-2mm of translation — but that small movement is essential for efficient gait. SI joint dysfunction (commonly felt as pain in the lower back, buttock, and sometimes into the hip or leg) is often caused by asymmetrical loading through the pelvis — one leg habitually bearing more load, or the pelvis chronically tilted. It is clinically often misdiagnosed as lumbar disc pathology.",
              },
              {
                label: "Activates",
                content: [
                  "Single-leg exercises (revealing asymmetry)",
                  "glute strengthening",
                  "pelvic floor coordination work",
                  "walking gait correction",
                ],
              },
              {
                label: "Injury Risk",
                content: "SI joint dysfunction affects approximately 15-30% of chronic lower back pain patients (Schwarzer et al., 1995). It is more common in women (due to wider pelvic anatomy and hormonal ligament laxity) and during or after pregnancy.",
              },
            ],
          },
        ],
      },
      {
        id: "shoulder-upper-body",
        label: "The Shoulder & Upper Body",
        subtitle: "Mobility at a cost",
        desc: "The shoulder trades stability for range of motion — more freedom than any other joint, but less structural protection. That tradeoff makes it powerful and fragile. The muscles that hold it in place are small, precise, and easily overwhelmed by the larger muscles around them.",
        icon: "◉",
        cards: [
          {
            id: "shoulder-girdle",
            term: "The Shoulder Girdle",
            brief: "The most mobile joint complex in the body — five articulations working together to give the arm its extraordinary range of movement.",
            mnemonic: "The shoulder is not one joint — it's five. Think of it like a multi-link crane: each link adds range, but every link must work for the crane to be both mobile and stable. Remove any link and the crane becomes a liability.",
            image: "shoulder-girdle.png",
            tabs: [
              {
                label: "Details",
                content: "The shoulder girdle consists of five articulations: the glenohumeral joint (ball-and-socket, the primary joint), the acromioclavicular joint (AC), the sternoclavicular joint (SC), the scapulothoracic \"joint\" (the scapula gliding on the ribcage), and the subacromial space (the functional articulation between the rotator cuff and the acromion). Unlike the hip's deep acetabulum, the glenohumeral socket is shallow — sacrificing stability for mobility. This makes the rotator cuff's role as a dynamic stabilizer absolutely critical: without adequate rotator cuff function, the humeral head migrates superiorly and anteriorly, compressing the subacromial structures.",
              },
              {
                label: "Activates",
                content: [
                  "Rotator cuff exercises (external rotation, internal rotation)",
                  "scapular retraction and depression (prone Y-raise, face pull)",
                  "overhead pressing with proper mechanics",
                ],
              },
              {
                label: "Injury Risk",
                content: "Shoulder impingement syndrome — the most common cause of shoulder pain — occurs when the rotator cuff or subacromial bursa is compressed between the humeral head and the acromion. The primary driver is not structural but postural: thoracic kyphosis and scapular dyskinesis (poor scapular positioning) reduce subacromial space and alter rotator cuff mechanics.",
              },
            ],
          },
          {
            id: "rotator-cuff",
            term: "Rotator Cuff (SITS)",
            brief: "Four deep muscles wrapping the shoulder joint — the dynamic stabilizers that hold the ball in the socket while the arm moves.",
            mnemonic: "SITS — Supraspinatus, Infraspinatus, Teres minor, Subscapularis. Four muscles, one job: keep the ball centered in the socket while the arm goes everywhere. They don't move the arm — they stabilize it while other muscles do the moving.",
            image: "rotator-cuff.png",
            tabs: [
              {
                label: "Details",
                content: "The rotator cuff muscles (supraspinatus, infraspinatus, teres minor, subscapularis) originate from the scapula and insert into the humeral head, forming a cuff of tendon around the joint. Their primary function is to depress and compress the humeral head into the glenoid during arm movement — preventing the superior migration that occurs when the larger prime movers (deltoid, pectoralis) act unopposed. The supraspinatus initiates shoulder abduction. The infraspinatus and teres minor externally rotate and decelerate internal rotation. The subscapularis internally rotates and anteriorly stabilizes. Weakness in any of the four — particularly the external rotators — disrupts the force couple and leads to impingement and labral stress.",
              },
              {
                label: "Activates",
                content: [
                  "Side-lying external rotation",
                  "cable external rotation",
                  "face pull",
                  "prone Y and T raises",
                  "band pull-apart",
                ],
              },
              {
                label: "Injury Risk",
                content: "Rotator cuff tears are the most common cause of shoulder surgery. Partial tears typically begin in the supraspinatus, where the tendon is most vulnerable to impingement. Full tears are common in people over 60 years old — in fact, the prevalence of asymptomatic full-thickness tears increases with every decade of life, which is why rotator cuff health maintenance is a critical aging priority (Yamamoto et al., 2010).",
              },
            ],
          },
          {
            id: "trapezius",
            term: "Trapezius",
            brief: "The large diamond-shaped muscle of the upper back — its three parts must work in balance, but modern life overloads the upper fibers and underworks the lower ones.",
            mnemonic: "The trap is three muscles in one: upper, middle, and lower. Think of them as three siblings — in most people, the upper sibling is doing all the work while the lower siblings sit on the couch. The result is the signature \"neck-shoulders-up-to-the-ears\" tension of modern life.",
            image: "trapezius.png",
            tabs: [
              {
                label: "Details",
                content: "The trapezius originates from the base of the skull and all thoracic spinous processes, inserting into the clavicle and scapular spine. Its upper fibers elevate and upwardly rotate the scapula. Its middle fibers retract the scapula. Its lower fibers depress the scapula and contribute to upward rotation. In Upper Crossed Syndrome — the epidemic postural pattern of desk workers — the upper trapezius is chronically overactive and tight, while the lower trapezius is chronically inhibited. This imbalance elevates the scapula and reduces subacromial space, directly contributing to shoulder impingement and neck pain.",
              },
              {
                label: "Activates",
                content: [
                  "Lower trap: prone Y-raise, wall slide, face pull (lower cable)",
                  "Middle trap: prone T-raise, seated row, band pull-apart",
                  "Upper trap: shrug (use sparingly — already overactive in most people)",
                ],
              },
              {
                label: "Injury Risk",
                content: "Chronic upper trap overactivation creates a predictable pattern: elevated shoulders, forward head posture, cervical compression, and tension headaches. The therapeutic target is not to stretch the upper trap in isolation, but to reactivate the lower and middle fibers — restoring the force balance that the upper trap overactivation disrupted.",
              },
            ],
          },
          {
            id: "thoracic-outlet",
            term: "Thoracic Outlet",
            brief: "The narrow passage between the collarbone, first rib, and neck muscles — where nerves and blood vessels exit the neck and enter the arm, and where compression creates the pain pattern often mistaken for \"just a pinched nerve.\"",
            mnemonic: "Think of the thoracic outlet as a tunnel. When the tunnel narrows — from tight scalenes, a drooping shoulder, or a forward head — the cables running through it (nerves, arteries, veins) get compressed. The symptoms appear in the hand and arm, but the problem is in the neck and shoulder.",
            image: "thoracic-outlet.png",
            tabs: [
              {
                label: "Details",
                content: "The thoracic outlet is the space between the anterior and middle scalene muscles, the first rib, and the clavicle. Through it pass the brachial plexus (the nerve network supplying the entire arm), the subclavian artery, and the subclavian vein. Thoracic outlet syndrome (TOS) occurs when these structures are compressed — producing symptoms ranging from arm tingling and weakness to coldness in the hand. TOS is most commonly caused by poor posture (forward head posture, elevated first rib, drooping shoulders) rather than structural abnormality. Upper Crossed Syndrome is a primary predisposing pattern.",
              },
              {
                label: "Activates",
                content: [
                  "Scalene stretching",
                  "first rib mobilization",
                  "pec minor stretching",
                  "thoracic extension",
                  "lower trapezius activation",
                ],
              },
              {
                label: "Injury Risk",
                content: "TOS is frequently misdiagnosed as carpal tunnel syndrome or cervical disc disease because the symptoms (hand numbness, arm weakness) appear distant from the actual compression site. The key diagnostic clue: symptoms change with head and shoulder position — ruling in a postural rather than a structural cause.",
              },
            ],
          },
        ],
      },
      {
        id: "hip-knee",
        label: "The Lower Body Joints",
        subtitle: "Ground up",
        desc: "Force enters your body through the ground and travels upward — foot to ankle to knee to hip. Each joint has a job. When one fails to do it, the next one in line absorbs the load. Most lower body injuries are compensation injuries — the joint that hurts is covering for the joint that won't move.",
        icon: "△",
        cards: [
          {
            id: "hip-joint",
            term: "The Hip Joint",
            brief: "A deep ball-and-socket joint — the most mobile and inherently stable joint in the lower body, capable of movement in all three planes.",
            mnemonic: "ACET-abulum = little cup (Latin: acetum = vinegar cup). The femoral ball sits in the hip's \"cup.\" The deeper the cup, the more stable the joint. The hip's cup is deep — unlike the shoulder, the hip doesn't rely on muscles alone for stability.",
            image: "hip-joint.png",
            tabs: [
              {
                label: "Details",
                content: "The hip is a ball-and-socket joint where the femoral head sits within the deep acetabulum, reinforced by a fibrocartilaginous rim called the labrum. The depth of the acetabulum provides inherent bony stability — far greater than the shoulder. The hip is capable of flexion, extension, abduction, adduction, internal rotation, and external rotation, making it the most functionally versatile joint in the lower body. More than 20 muscles act on the hip. Maintaining full hip mobility — particularly in extension and rotation — is one of the most impactful things a person can do for long-term lower body and back health. When hip mobility is lost, the lumbar spine and knee are forced to compensate.",
              },
              {
                label: "Activates",
                content: [
                  "90/90 hip stretch",
                  "hip CARs (controlled articular rotations)",
                  "pigeon pose",
                  "hip flexor stretch",
                  "single-leg hip hinge",
                ],
              },
              {
                label: "Injury Risk",
                content: "Femoroacetabular impingement (FAI) — where the ball and socket pinch, often in deep hip flexion — is increasingly common in athletes, yoga practitioners, and desk workers with limited hip extension. Hip labrum tears frequently accompany impingement. Both can be prevented with attention to hip mobility and movement quality.",
              },
            ],
          },
          {
            id: "quadriceps",
            term: "Quadriceps",
            brief: "Four muscles on the front of the thigh that extend the knee and absorb the impact of landing — the primary decelerators of the lower body.",
            mnemonic: "QUAD = four. Four muscles, all pulling on one tendon, driving one motion: knee extension. The VMO (the teardrop-shaped inner quad) is the key to proper knee tracking.",
            image: "quadriceps.png",
            tabs: [
              {
                label: "Details",
                content: "The quadriceps — rectus femoris, vastus lateralis, vastus medialis oblique (VMO), and vastus intermedius — converge on the patellar tendon, which attaches below the kneecap at the tibial tuberosity. The rectus femoris is unique in that it also crosses the hip, making it a hip flexor as well as a knee extensor. The VMO (the lowest, most medial portion) is critical for pulling the patella into proper tracking alignment — when weak, the patella tracks laterally, creating friction and pain. Quad weakness leads to the knee collapsing inward (valgus) during landing and squatting — a primary risk factor for ACL tears.",
              },
              {
                label: "Activates",
                content: [
                  "Squat",
                  "leg press",
                  "lunge",
                  "step-down (eccentric)",
                  "terminal knee extension (VMO focus)",
                  "leg extension",
                ],
              },
              {
                label: "Injury Risk",
                content: "Patellar tendinopathy (\"jumper's knee\") is pain at the tendon below the kneecap from repetitive explosive loading. Patellofemoral pain syndrome (pain behind the kneecap) is the most common overuse knee injury overall, linked to VMO weakness and poor hip control allowing lateral patellar tracking.",
              },
            ],
          },
          {
            id: "knee-joint",
            term: "The Knee Joint",
            brief: "The body's largest joint — a modified hinge between the femur and tibia that is stabilized by four ligaments, two menisci, and the muscular control of the hip and ankle above and below.",
            mnemonic: "Think of the knee as a door hinge that can also slightly rotate. The four ligaments are its hinges — remove one and the door wobbles. The menisci are its shock-absorbing door stop. The hip controls the door.",
            image: "knee-joint.png",
            tabs: [
              {
                label: "Details",
                content: "The knee primarily flexes and extends but permits slight internal and external rotation in flexed positions. It is stabilized by the ACL (anterior cruciate ligament, prevents forward tibial translation), PCL (posterior, prevents backward tibial translation), MCL (medial, resists valgus), and LCL (lateral, resists varus). The medial and lateral menisci are crescent-shaped fibrocartilaginous structures that deepen the tibial plateau, distribute load, and absorb shock. The patella increases the mechanical advantage of the quadriceps by acting as a pulley. Because the knee sits between two long levers (femur and tibia), its health depends heavily on the control provided by the hip above and the ankle and foot below — it is primarily a victim of problems elsewhere.",
              },
              {
                label: "Activates",
                content: [
                  "Terminal knee extension",
                  "step-down",
                  "single-leg squat",
                  "wall sit",
                  "Bulgarian split squat",
                ],
              },
              {
                label: "Injury Risk",
                content: "The \"unhappy triad\" — simultaneous ACL, MCL, and medial meniscus tears — is the classic contact knee injury. Patellofemoral pain is the most common overuse injury. Both are often driven by hip weakness (glute med, glute max) and poor neuromuscular control rather than local knee weakness.",
              },
            ],
          },
          {
            id: "it-band-tfl",
            term: "IT Band & TFL",
            brief: "The iliotibial band is a thick strip of fascia running from the hip to the shin — the lateral stabilizer of the knee, and one of the most commonly irritated structures in runners.",
            mnemonic: "IT band = the body's lateral guy-wire. Like the cable on a sailboat mast, it keeps the knee from collapsing inward. But unlike a cable, it can't be stretched — it can only be loaded and unloaded differently.",
            image: "it-band-tfl.png",
            tabs: [
              {
                label: "Details",
                content: "The iliotibial band (IT band) is a thick strip of connective tissue (fascia, not muscle) running from the iliac crest down the lateral thigh to the tibia. It is tensioned by two muscles: the tensor fasciae latae (TFL) at the top and the gluteus maximus (which inserts into the IT band posteriorly). The IT band's primary function is lateral knee stabilization and shock absorption during running. Because it is fascia, not muscle, it cannot be \"stretched\" in the conventional sense — foam rolling and stretching targets the TFL and hip muscles that tension it, not the band itself. IT band friction syndrome occurs when the band repeatedly slides over the lateral femoral condyle — the result is lateral knee pain that typically worsens during running.",
              },
              {
                label: "Activates",
                content: [
                  "Hip abduction exercises (to address TFL tightness)",
                  "single-leg squat (neuromuscular control)",
                  "foam rolling TFL",
                  "glute strengthening",
                ],
              },
              {
                label: "Injury Risk",
                content: "IT band syndrome is the most common running injury. Its root cause is almost always hip weakness (glute med, glute max) rather than a \"tight IT band.\" Foam rolling the IT band directly may provide temporary pain relief but does not address the underlying cause.",
              },
            ],
          },
          {
            id: "ankle-foot",
            term: "Ankle & Foot",
            brief: "The body's foundation — and a joint where limited mobility silently drives compensations all the way up to the knee, hip, and spine.",
            mnemonic: "The ankle is the foundation of the lower body's tower. A compromised foundation forces every floor above it to compensate. Limited ankle range of motion is one of the most underappreciated drivers of knee and back pain.",
            image: "ankle-foot.png",
            tabs: [
              {
                label: "Details",
                content: "The ankle (talocrural joint) primarily plantarflexes and dorsiflexes (points and flexes). Dorsiflexion — the ability to bring the shin toward the foot — is critical for squatting, walking upstairs, and decelerating. Normal dorsiflexion range is approximately 20 degrees. When this is restricted (by tight calves, Achilles tightness, or ankle joint stiffness), the body compensates: the heel rises during squatting, the knee caves inward, the hip internally rotates, and the lumbar spine flexes. All of these compensations originate from the ankle. The foot — with its 26 bones, 33 joints, and over 100 muscles, tendons, and ligaments — is the primary sensory interface between the body and the ground. Foot arch mechanics directly influence knee alignment and hip rotation patterns.",
              },
              {
                label: "Activates",
                content: [
                  "Calf stretching",
                  "ankle dorsiflexion mobility drills",
                  "single-leg balance",
                  "barefoot walking",
                  "toe spreading exercises",
                ],
              },
              {
                label: "Injury Risk",
                content: "Limited ankle dorsiflexion is consistently linked to increased ACL injury risk, patellofemoral pain, and Achilles tendinopathy. Plantar fasciitis — inflammation of the plantar fascia at the base of the foot — is one of the most common musculoskeletal complaints and is often the downstream result of limited ankle mobility and calf tightness.",
              },
            ],
          },
        ],
      },
      {
        id: "movement-vocab",
        label: "Movement Vocabulary",
        subtitle: "The language of motion",
        desc: "Before you can fix how you move, you need words for what movement is. Flexion, extension, rotation, abduction — these aren't clinical abstractions. They're the alphabet your body uses every time you reach, twist, step, or bend. Learn the vocabulary and the body starts making sense.",
        icon: "⇄",
        cards: [
          {
            id: "flexion-extension",
            term: "Flexion & Extension",
            brief: "The most fundamental pair of movements — bending to close a joint (flexion) and straightening to open it (extension).",
            mnemonic: "Flex = fold (you're folding the joint closed). Extend = expand (you're opening and lengthening). Every joint in the body does these two things — just in different directions.",
            image: "flexion-extension.png",
            tabs: [
              {
                label: "Details",
                content: "Flexion decreases the angle between two body segments — elbow curl, knee bend, spinal rounding. Extension increases that angle — straightening the elbow, extending the knee, arching the back. In the hip, flexion brings the thigh toward the chest; extension drives the thigh backward. In the spine, flexion rounds forward; extension arches back. Most human daily activities (sitting, typing, driving) are dominated by flexion patterns — which is why intentional extension work is essential for musculoskeletal health. The body needs balance between these opposing movements to maintain joint health and posture.",
              },
              {
                label: "Activates",
                content: [
                  "Flexion: bicep curl, leg curl, forward fold",
                  "Extension: deadlift, back extension, cobra pose, hip thrust",
                ],
              },
              {
                label: "Injury Risk",
                content: "Sustained spinal flexion without counterbalancing extension compresses the anterior vertebral structures and stretches the posterior ligaments — the foundation of most disc pathology in desk workers.",
              },
            ],
          },
          {
            id: "adduction-abduction",
            term: "Adduction & Abduction",
            brief: "Moving a limb toward the body's midline (adduction) or away from it (abduction) — the side-to-side language of the frontal plane.",
            mnemonic: "ADDuction = ADD the limb back to your body (toward center). ABduction = ABsent from the body (moving away). Think of opening and closing a door — abduction opens, adduction closes.",
            image: "adduction-abduction.png",
            tabs: [
              {
                label: "Details",
                content: "Adduction moves a limb toward the midline — arms lowering to the sides, thighs squeezing together. The primary hip adductors are the inner thigh muscles; shoulder adduction is primarily driven by the lats and pec major. Abduction moves a limb away from the midline — raising the arm to the side, stepping the leg laterally. Hip abduction is driven primarily by the glute med; shoulder abduction by the deltoid and supraspinatus. Both movements occur in the frontal plane. They are the most undertrained movement pattern in conventional fitness — most programs are dominated by sagittal plane (flexion/extension) movements, leaving the frontal plane underloaded and vulnerable.",
              },
              {
                label: "Activates",
                content: [
                  "Adduction: cable fly, Copenhagen plank, inner thigh squeeze",
                  "Abduction: lateral raise, clamshell, lateral band walk, side-lying leg raise",
                ],
              },
              {
                label: "Injury Risk",
                content: "Frontal plane weakness — specifically insufficient hip abduction strength — is the primary driver of Trendelenburg gait, IT band syndrome, patellofemoral pain, and hip impingement.",
              },
            ],
          },
          {
            id: "internal-external-rotation",
            term: "Internal & External Rotation",
            brief: "Turning a limb inward toward the body's midline (internal rotation) or outward away from it (external rotation) — the rotational language of movement.",
            mnemonic: "Think of a door hinge. The joint is the hinge; the limb is the door. Internal rotation turns the front of the limb toward the body; external rotation turns it away. Most people are stuck in internal rotation from how they live.",
            image: "rotation.png",
            tabs: [
              {
                label: "Details",
                content: "Internal rotation turns a limb inward — the front of the thigh rotating toward the midline, or the palm facing the body. External rotation turns outward — the front of the thigh rotating away, or the palm facing forward. The hip and shoulder are the primary rotational joints. Rotation is the most undertrained and most commonly lost movement pattern — particularly hip external rotation, which is restricted in most desk workers and is a primary driver of hip impingement, IT band syndrome, and lumbar pain. Hip external rotation is produced by the deep external rotators (piriformis, obturators, gemelli), the gluteus maximus, and the posterior gluteus medius.",
              },
              {
                label: "Activates",
                content: [
                  "Hip: 90/90 stretch, pigeon pose, clamshell (external rotation), hip internal rotation stretch",
                  "Shoulder: cable ER, side-lying ER (external rotation)",
                ],
              },
              {
                label: "Injury Risk",
                content: "Limited hip external rotation forces the femur into internal rotation during walking, squatting, and running — driving the knee inward (valgus) and stressing the medial knee and lower back. At the shoulder, poor rotator cuff control during internal rotation is a primary driver of impingement and labral tears.",
              },
            ],
          },
          {
            id: "planes-of-motion",
            term: "Planes of Motion",
            brief: "Three imaginary planes that describe the direction of every movement — sagittal (forward/back), frontal (side/side), and transverse (rotational).",
            mnemonic: "SAGittal = SAGging forward and back. FRONTal = side to side (the FRONT of your body faces you). TRANSverse = TRANSlation, twisting across. Most gym exercises live in the sagittal plane — real life happens in all three.",
            image: "planes-of-motion.png",
            tabs: [
              {
                label: "Details",
                content: "Every movement occurs within or across these three planes. The sagittal plane divides the body into left and right halves — squats, lunges, bicep curls, and running all primarily occur here. The frontal plane divides front from back — lateral raises, side lunges, and clamshells live here. The transverse plane divides upper from lower body — rotational movements like throwing, twisting, and chopping occur here. Most traditional gym machines operate in a single plane (usually sagittal), leaving the frontal and transverse planes undertrained. Real-world activities — sports, manual labor, daily life — combine all three planes simultaneously. This mismatch between training and life is a primary reason injuries occur during \"ordinary\" activities.",
              },
              {
                label: "Activates",
                content: [
                  "Sagittal: squat, deadlift",
                  "Frontal: lateral lunge, side raise",
                  "Transverse: wood chop, rotational throw",
                  "Multi-planar: Turkish get-up, agility drills",
                ],
              },
              {
                label: "Injury Risk",
                content: "Training only in the sagittal plane leaves the body unprepared for frontal and transverse loading — a primary reason people injure themselves during seemingly simple rotational or lateral movements. This is particularly common in weekend warriors who do sagittal-plane gym work all week and then play sport on weekends.",
              },
            ],
          },
          {
            id: "eccentric-concentric",
            term: "Eccentric vs. Concentric Contraction",
            brief: "The difference between a muscle shortening under load (concentric) and lengthening under load (eccentric) — the eccentric phase is where most injuries occur and most strength gains are made.",
            mnemonic: "CONcentric = CONtracting and shortening (the curl up). ECcentric = ECiting the lengthened position (the curl down, under control). The eccentric is the harder, more important phase — and the one most people skip.",
            image: "eccentric-concentric.png",
            tabs: [
              {
                label: "Details",
                content: "Concentric contraction occurs when a muscle generates force while shortening — the bicep during the lifting phase of a curl. Eccentric contraction occurs when a muscle generates force while lengthening — the bicep during the lowering phase of a curl, or the quadriceps during a step-down. Eccentric loading is the primary mechanism of both muscle damage (which drives hypertrophy and strengthening) and injury (when the load exceeds the tissue's capacity). Research consistently shows that eccentric exercise produces greater strength gains, greater tendon stiffness improvements, and better injury prevention outcomes than concentric-only training. The Nordic hamstring curl, which emphasizes eccentric hamstring loading, reduces hamstring strain incidence by approximately 51% in athletes.",
              },
              {
                label: "Activates",
                content: [
                  "Slow lowering in any exercise",
                  "Nordic curl",
                  "Spanish squat",
                  "step-down",
                  "eccentric heel drop (for Achilles)",
                ],
              },
              {
                label: "Injury Risk",
                content: "Most acute muscle injuries (hamstring tears, calf strains, quadriceps tears) occur during the eccentric phase — when the muscle is actively lengthening under sudden load. Neglecting eccentric training leaves muscles unprepared for the high forces of sprinting, jumping, and rapid deceleration.",
              },
            ],
          },
          {
            id: "proprioception",
            term: "Proprioception",
            brief: "The body's hidden sixth sense — the ability to know where your joints are in space, crucial for injury prevention and efficient movement.",
            mnemonic: "PROPRIO = one's own (Latin). Proprioception = perceiving your own body position. Close your eyes and touch your nose — that's proprioception at work. Athletes who train it are injured less.",
            image: "proprioception.png",
            tabs: [
              {
                label: "Details",
                content: "Proprioception is the sensory system that informs the brain of joint position, movement, and load without the need for visual feedback. Mechanoreceptors in muscles (muscle spindles), tendons (Golgi tendon organs), joint capsules, and ligaments continuously send positional information to the central nervous system. This allows for anticipatory muscle activation (feedforward control) and real-time adjustments to maintain balance and joint stability. After ligament injuries (particularly ankle sprains and ACL tears), proprioceptive function is significantly impaired — because the ligament sensors are damaged. This impairment, if not specifically retrained, is the primary reason for re-injury. Yoga, balance training, and reactive exercise all train proprioceptive function.",
              },
              {
                label: "Activates",
                content: [
                  "Single-leg balance",
                  "wobble board",
                  "reactive stepping drills",
                  "yoga balance poses",
                  "barefoot training",
                ],
              },
              {
                label: "Injury Risk",
                content: "Impaired proprioception after ankle sprains is the primary reason for recurrent ankle sprains — the joint doesn't \"know\" it's in a vulnerable position until it's already sprained. Similarly, ACL reconstruction without proprioceptive retraining carries a high re-injury risk, particularly in the early return-to-sport phase.",
              },
            ],
          },
          {
            id: "anterior-pelvic-tilt",
            term: "Anterior Pelvic Tilt",
            brief: "A forward rotation of the pelvis that increases the lumbar curve — associated with tight hip flexors, weak glutes, and lower back pain.",
            mnemonic: "ANTErior = front. The front of the pelvis tips DOWN (like pouring water from the front of a bowl). The lower back arches up as a result.",
            image: "anterior-pelvic-tilt.png",
            tabs: [
              {
                label: "Details",
                content: "Anterior pelvic tilt (APT) occurs when the front of the pelvis (ASIS) drops lower than the back (PSIS), increasing lumbar lordosis. Clinically, it is associated with a pattern described by Vladimir Janda as \"Lower Crossed Syndrome\": tight hip flexors (iliopsoas) and lumbar extensors pull the pelvis forward, while weak glutes and abdominals fail to resist. The result is a constantly arched lower back, compressed posterior lumbar discs and facet joints, and chronically shortened hip flexors. Importantly, mild APT is normal — the clinical significance is not the position itself but whether the surrounding muscles can control movement through that position.",
              },
              {
                label: "Activates",
                content: [
                  "Hip flexor stretching",
                  "glute bridges",
                  "hip thrusts",
                  "dead bugs",
                  "posterior pelvic tilt exercises",
                ],
              },
              {
                label: "Injury Risk",
                content: "Sustained APT compresses the posterior elements of the lumbar spine (facet joints, posterior disc). Over time this contributes to facet joint irritation, disc herniation, and sacroiliac joint dysfunction. It also puts the glutes in a shortened, mechanically disadvantaged position — contributing to \"gluteal amnesia.\"",
              },
            ],
          },
          {
            id: "posterior-pelvic-tilt",
            term: "Posterior Pelvic Tilt",
            brief: "A backward rotation of the pelvis that flattens the lumbar curve — often driven by tight hamstrings and associated with disc pressure and chronic sitting.",
            mnemonic: "POSTerior = back. The back of the pelvis tips DOWN. The lumbar curve flattens or even reverses — the \"tucked under\" posture.",
            image: "posterior-pelvic-tilt.png",
            tabs: [
              {
                label: "Details",
                content: "Posterior pelvic tilt (PPT) occurs when the PSIS drops lower than the ASIS, reducing or reversing the normal lumbar lordosis. It is the characteristic posture of prolonged sitting and is strongly associated with tight hamstrings (which pull the ischial tuberosities backward) and weak hip flexors. The flattened lumbar spine increases anterior disc pressure and places the posterior ligaments under sustained tension.",
              },
              {
                label: "Activates",
                content: [
                  "Hip flexor strengthening",
                  "lumbar extension work",
                  "cat-cow (focusing on the anterior tilt direction)",
                  "standing hip flexor stretches",
                ],
              },
              {
                label: "Injury Risk",
                content: "The \"flat back\" posture of sustained PPT increases anterior disc pressure — a primary mechanism in intervertebral disc degeneration. It is particularly common in cyclists, rowers, and desk workers who spend extended periods in hip flexion.",
              },
            ],
          },
        ],
      },
    ],
  },
{
    id: "what-modern-life-does",
    title: "What Modern Life Does To It",
    subtitle: "How the pieces work together",
    desc: "The patterns that emerge when bodies designed for movement spend their days in chairs. Not blame — understanding. See the pattern, and you can change it.",
    accent: "#A85C4A",
    groups: [
      {
        id: "pelvic-tilt",
        label: "The Pelvic Tilt Problem",
        subtitle: "Where posture begins and breaks down",
        desc: "Your pelvis is a bowl that can tip forward or backward — and whichever way it tips, your spine follows. Sitting all day locks it in one position. The muscles that should hold it steady forget how. What shows up as back pain, tight hips, or a gut that won't flatten is often this one thing: a pelvis that has lost the ability to choose.",
        icon: "↗",
        cards: [
          {
            id: "pelvis-spine-connection",
            term: "The Pelvis-Spine Connection",
            brief: "The position of the pelvis directly determines the shape of the lumbar spine — they are not independent structures but two parts of the same system.",
            mnemonic: "The pelvis and lumbar spine are like two gears in a clock. Turn one and the other turns with it — automatically and immediately. You cannot change your lumbar position without changing your pelvic position.",
            image: "pelvis-spine-connection.png",
            tabs: [
              {
                label: "The Concept",
                content: "The lumbar spine sits directly on top of the sacrum, which is the posterior anchor of the pelvis. Their relationship is immediate and reciprocal: anterior pelvic tilt (the front of the pelvis dropping forward) increases lumbar lordosis. Posterior pelvic tilt (the front rising, the back dropping) reduces or reverses the lumbar curve. This is why the simple act of tucking the pelvis (posterior tilt) in cat-cow instantly changes the shape of the lower back — and why someone's pelvic position while sitting is inseparable from their lumbar pain pattern. Research from PMC's spine sagittal balance literature confirms that cervical lordosis, thoracic kyphosis, lumbar lordosis, and pelvic anatomy must all maintain a harmonious relationship for minimum energy expenditure and spinal health.",
              },
              {
                label: "Why It Matters",
                content: "When the pelvis is chronically tilted forward (anterior tilt), the posterior lumbar disc and facet joints are chronically compressed. When chronically tilted backward (posterior tilt), the anterior disc is chronically loaded. Neither is inherently pathological — the problem arises when a fixed position removes adaptability and loads the same structures repeatedly without variation.",
              },
              {
                label: "What To Do",
                content: [
                  "Cat-cow (conscious exploration of the full range)",
                  "pelvic tilts supine",
                  "standing pelvic awareness exercises",
                  "posterior pelvic tilt exercises for back pain",
                ],
              },
            ],
          },
          {
            id: "lower-crossed-syndrome",
            term: "Lower Crossed Syndrome",
            brief: "The most common postural dysfunction in the modern world — a predictable pattern of tight hip flexors and weak glutes creating anterior pelvic tilt and low back pain.",
            mnemonic: "Draw an X across the front of the pelvis. Tight hip flexors (front) cross with weak glutes (back). Weak abdominals (front) cross with tight erector spinae (back). The X tells you who to stretch and who to strengthen.",
            image: "lower-crossed-syndrome.png",
            tabs: [
              {
                label: "The Concept",
                content: "Vladimir Janda identified Lower Crossed Syndrome (LCS) as a characteristic pattern of alternating muscle tightness and weakness centered on the pelvis. The tight muscles: hip flexors (iliopsoas, rectus femoris) and lumbar extensors (erector spinae). The weak muscles: deep abdominals (TVA, obliques) and gluteals (maximus and medius). This imbalance creates anterior pelvic tilt, increased lumbar lordosis, and compensatory thoracolumbar junction stiffness. Physiopedia's clinical review notes that LCS is associated with anterior pelvic tilt, increased lumbar lordosis, and compensatory adjustments throughout the kinetic chain. LCS is not a disease — it is the predictable result of how most modern humans live: sitting for prolonged periods, which shortens hip flexors, while the glutes are unloaded and inhibited.",
              },
              {
                label: "Why It Matters",
                content: "LCS is implicated in anterior pelvic tilt-driven lower back pain, hip flexor strains, hamstring tightness (compensating for weak glutes), sacroiliac joint dysfunction, and patellofemoral knee pain. Hamstring tightness in LCS is often not a flexibility problem — it's a compensation pattern. Stretching only the hamstrings without addressing the root cause (weak glutes, tight hip flexors) provides temporary relief at best.",
              },
              {
                label: "What To Do",
                content: [
                  "Hip flexor stretching (couch stretch, warrior I)",
                  "glute activation (bridges, clamshells, hip thrusts)",
                  "core stability work (dead bug, bird dog)",
                  "cat-cow for pelvic mobility",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "screens-upper-body",
        label: "What Screens Do to Your Upper Body",
        subtitle: "The posture of modern life",
        desc: "Hours of looking down at a phone or forward at a screen create a predictable pattern: the chest tightens, the upper back rounds, the head drifts forward, and the shoulders creep toward the ears. It's not damage — it's adaptation. Your body shaped itself around the position you gave it most.",
        icon: "✕",
        cards: [
          {
            id: "upper-crossed-syndrome",
            term: "Upper Crossed Syndrome",
            brief: "The posture of modern life — tight chest and upper traps cross with weak deep neck flexors and lower traps, creating forward head posture and shoulder impingement.",
            mnemonic: "Draw an X across the upper body. Tight pecs (front, below) cross with tight upper traps (back, above). Weak deep neck flexors (front, above) cross with weak lower traps and rhomboids (back, below). This X creates the hunched, forward-head posture visible in almost every person using a screen.",
            image: "upper-crossed-syndrome.png",
            tabs: [
              {
                label: "The Concept",
                content: "Upper Crossed Syndrome (UCS), described by Vladimir Janda, involves a characteristic pattern of overactivity in the pectoralis major/minor and upper trapezius, paired with underactivity in the deep cervical flexors and lower/middle trapezius and serratus anterior. The result is a predictable postural change: forward head posture, increased cervical lordosis, thoracic kyphosis, elevated and protracted (forward) shoulders, and reduced glenohumeral joint space. UCS is nearly universal in people who spend significant time at screens and is the primary driver of neck pain, tension headaches, and shoulder impingement in the general population. Physiopedia's clinical review notes that this pattern creates observable postural changes that are now endemic in modern populations.",
              },
              {
                label: "Why It Matters",
                content: "The forward head position of UCS increases the effective weight of the head on the cervical spine — for every inch of forward head posture, the perceived load on the neck increases by approximately 10 pounds. This chronic loading contributes to cervical disc compression, tension headaches, and shoulder impingement through reduced subacromial space. Research has confirmed that changes in sitting posture directly affect shoulder range of motion in all directions tested — meaning the way you sit at a screen measurably changes what your shoulder can do (Quek et al., 2013).",
              },
              {
                label: "What To Do",
                content: [
                  "Pec stretching",
                  "chin tucks (deep cervical flexor activation)",
                  "lower trap exercises (prone Y-raise, face pull)",
                  "thoracic extension over foam roller",
                  "shoulder external rotation work",
                ],
              },
            ],
          },
          {
            id: "compensation-pattern",
            term: "The Compensation Pattern",
            brief: "When one part of the kinetic chain fails, an adjacent joint takes over its role — doing a job it was not designed for, eventually breaking down itself.",
            mnemonic: "When the weakest link in a chain breaks, the load doesn't disappear — it transfers to the next link. The body does the same thing. The site of pain is often not the site of the problem.",
            image: "compensation-pattern.png",
            tabs: [
              {
                label: "The Concept",
                content: "Compensation patterns are the body's adaptive response to movement dysfunction. When a joint or muscle fails to perform its designed role, the kinetic chain reorganizes to maintain function — but at the cost of loading adjacent structures inappropriately. Classic examples: limited ankle dorsiflexion → excessive knee valgus during squatting; glute max weakness → lumbar hyperextension during hip extension; upper trap dominance → shoulder impingement during overhead movement. In each case, the site of eventual pain is not where the dysfunction originated. This is why treating only the symptomatic site — without identifying and addressing the root cause — typically leads to temporary relief followed by recurrence. The most important clinical skill in movement assessment is tracing the chain from symptom back to source.",
              },
              {
                label: "Why It Matters",
                content: "Compensation patterns, if allowed to persist, eventually load passive structures (ligaments, joint capsules, discs) beyond their design tolerances. Unlike muscles, these structures have limited healing capacity — making early identification and correction of compensation patterns essential for long-term joint health.",
              },
              {
                label: "What To Do",
                content: [
                  "Movement screening to identify compensation (overhead squat, single-leg squat, hip extension pattern)",
                  "addressing root cause before treating symptoms",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "fascial-body",
        label: "The Fascial Body",
        subtitle: "The web beneath the muscles",
        desc: "Under your skin, wrapping every muscle and organ, is a continuous sheet of connective tissue called fascia. It doesn't show up on most anatomy charts, but it transmits force across your entire body. When one part gets stiff or stuck, the tension travels — which is why stretching a tight hamstring sometimes does nothing, but releasing the fascia in your foot fixes it.",
        icon: "∥",
        cards: [
          {
            id: "superficial-back-line",
            term: "The Superficial Back Line",
            brief: "A continuous myofascial line running from the sole of the foot to the top of the skull — the body's longest and most clinically significant fascial chain.",
            mnemonic: "Think of the Superficial Back Line as a single long guitar string running up the back of your body. Tighten one end (the plantar fascia) and the whole string vibrates — including the far end (the suboccipital muscles at the base of your skull).",
            image: "superficial-back-line.png",
            tabs: [
              {
                label: "The Concept",
                content: "Mapped by Thomas Myers in Anatomy Trains (4th ed., Elsevier, 2020) and supported by dissection research (Wilke et al., 2016), the Superficial Back Line (SBL) runs: plantar fascia → Achilles tendon → gastrocnemius/soleus → hamstrings → sacrotuberous ligament → thoracolumbar fascia → erector spinae → nuchal ligament → scalp fascia. This is not a metaphor — each transition point has been verified anatomically as a continuous fascial connection. The practical implication is profound: \"hamstring tightness\" is often a manifestation of tension anywhere along this line — tight calves, a stiff thoracolumbar fascia, or even a restricted suboccipital region. Treatment that addresses only the hamstrings while ignoring the rest of the line will provide only temporary relief.",
              },
              {
                label: "Why It Matters",
                content: "Plantar fasciitis — inflammation at the very base of the SBL — is often accompanied by calf tightness, hamstring restriction, and lower back pain. These are not separate problems — they are one problem expressed at multiple locations along the same line.",
              },
              {
                label: "What To Do",
                content: [
                  "Forward fold with progression from ankle to neck",
                  "full-body foam rolling along the posterior chain",
                  "yoga sequences emphasizing the posterior body",
                ],
              },
            ],
          },
          {
            id: "why-stretching-doesnt-work",
            term: "Why Stretching Doesn't Always Work",
            brief: "Stretching a single muscle provides only temporary relief when the restriction is part of a continuous fascial chain — you have to address the whole line.",
            mnemonic: "Imagine a sweater that's been snagged. Pulling on the snagged area makes it worse. You have to find where it caught and release it there — not just at the point of tightness.",
            image: "why-stretching-doesnt-work.png",
            tabs: [
              {
                label: "The Concept",
                content: "When the body experiences tension in a myofascial line, it distributes that tension across the entire chain. Stretching an isolated muscle (like the hamstring) temporarily increases its length locally, but if the restriction originates elsewhere in the chain (calves, thoracolumbar fascia), the tension returns quickly as the chain re-establishes its global tension. This is why many people stretch their hamstrings for years with minimal lasting change. Effective treatment addresses the full line — mobilizing the plantar fascia, releasing the calves, working the thoracolumbar region, and then reassessing hamstring length. This principle applies to all myofascial lines, not just the SBL.",
              },
              {
                label: "Why It Matters",
                content: "Aggressive, repeated isolated stretching of a symptomatic site can actually increase irritation. If a muscle is \"tight\" because it's bearing load from a restricted chain, repeatedly stretching it while the chain remains restricted creates persistent microtrauma at the symptomatic site.",
              },
              {
                label: "What To Do",
                content: [
                  "Sequential chain mobilization: plantar fascia rolling → calf stretching → hamstring lengthening → lumbar mobility → neck mobility",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "core-stability",
        label: "Core Stability vs. Strength",
        subtitle: "They are not the same thing",
        desc: "A strong core can do a hundred crunches. A stable core can protect your spine before you even know you need it. Most core training builds the wrong one. Stability is about timing and coordination — the deep muscles firing milliseconds before you move. Strength without stability is a sports car with no steering.",
        icon: "▣",
        cards: [
          {
            id: "stability-vs-strength",
            term: "Stability vs. Strength",
            brief: "Core strength measures how much force the trunk muscles can produce. Core stability measures how well they coordinate to protect the spine — and it's stability, not strength, that prevents injury.",
            mnemonic: "A skyscraper doesn't stand because its steel is the strongest available — it stands because the forces within it are coordinated and distributed efficiently. A strong core without stability is a skyscraper with misaligned beams.",
            image: "stability-vs-strength.png",
            tabs: [
              {
                label: "The Concept",
                content: "Core strength refers to the maximal force production capacity of the trunk muscles — how much a person can curl, flex, and resist. Core stability refers to the ability of the deep stabilization system (TVA, multifidus, diaphragm, pelvic floor) to co-activate with precise timing and appropriate magnitude to maintain spinal stiffness under varying loads. Stuart McGill's research established that most spinal injuries are not caused by muscle weakness but by poor motor control — the wrong muscles activating at the wrong time, or the right muscles failing to activate at all. A person with a strong rectus abdominis but poor deep core coordination is at greater injury risk than someone with modest strength and excellent coordination. This explains why conventional \"core work\" (crunches, sit-ups) fails to prevent back pain — it trains the wrong qualities.",
              },
              {
                label: "Why It Matters",
                content: "Spinal loading studies (McGill, University of Waterloo) show that sit-ups and crunches impose compressive loads on the lumbar spine exceeding safe tolerances for people with disc pathology. The repeated flexion under load — exactly the movement pattern associated with disc herniation — makes these exercises contraindicated for individuals with back pain or disc dysfunction.",
              },
              {
                label: "What To Do",
                content: [
                  "McGill's Big Three (bird dog, curl-up, side plank) — designed to build endurance in stabilizers without spinal flexion",
                  "Dead bug",
                  "Pallof press",
                  "plank variations",
                ],
              },
            ],
          },
          {
            id: "anticipatory-core-activation",
            term: "Anticipatory Core Activation",
            brief: "A healthy deep core fires before the limbs move — a pre-emptive stability response that is disrupted by pain, injury, and inactivity.",
            mnemonic: "A healthy core is like a seatbelt that tightens before a crash — not after. Pain, injury, and sedentary habits turn it into a seatbelt that only responds after impact.",
            image: "anticipatory-core-activation.png",
            tabs: [
              {
                label: "The Concept",
                content: "Research by Paul Hodges and Carolyn Richardson (1996, 1998) used electromyography to demonstrate that in healthy individuals, the transverse abdominis activates 30–110 milliseconds before any limb movement — whether lifting an arm, stepping, or throwing. This feedforward activation is automatic and unconscious: the brain anticipates the destabilizing effect of limb movement and pre-stiffens the spine before the movement occurs. In individuals with chronic low back pain, this timing is consistently delayed or absent — the core responds to movement rather than anticipating it. Importantly, this timing impairment persists even after pain resolves, which is why back pain tends to recur without specific rehabilitation. Retraining anticipatory activation — not just strengthening the muscles — is the clinical target.",
              },
              {
                label: "Why It Matters",
                content: "The absence of anticipatory core activation means that each movement begins with an unprotected spine. For low-load activities this is manageable; under high loads or unexpected perturbations (tripping, catching a falling object), the unprotected spine is vulnerable to acute injury.",
              },
              {
                label: "What To Do",
                content: [
                  "Dead bug (emphasizing TVA pre-activation before limb movement)",
                  "bird dog",
                  "diaphragmatic breathing to restore coordination",
                  "slow deliberate loaded movements with attention to bracing",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "kinetic-chain",
        label: "The Kinetic Chain & Injury",
        subtitle: "The site of pain is rarely the source",
        desc: "Your body is a chain of linked joints. When one link can't do its job, the next link picks up the slack — until it breaks. The knee that hurts isn't weak. The hip above it is stiff. The shoulder that aches isn't damaged. The thoracic spine behind it stopped rotating. Fix the source, not the symptom.",
        icon: "⟶",
        cards: [
          {
            id: "the-kinetic-chain",
            term: "The Kinetic Chain",
            image: "kinetic-chain.png",
            brief: "A framework for understanding the body as a linked system — where movement (and dysfunction) at one joint affects every joint connected to it.",
            mnemonic: "A bicycle chain. If one link is bent or broken, the whole chain runs poorly. Fix only the bent link without fixing why it bent — and it bends again.",
            tabs: [
              {
                label: "The Concept",
                content: "The kinetic chain concept, adapted from engineering by Dr. Arthur Steindler (1955) and widely applied in sports medicine and rehabilitation, describes the body as a series of interconnected segments — joints and muscles — where movement in one segment inevitably influences adjacent segments. A peer-reviewed PMC study (2023) defines the kinetic chain as \"the body's intricate coordination of various segments to perform a specific activity involving precise positioning, timing, and speed.\" The body core (lumbopelvic-hip complex) is the central hub through which forces are transferred between the upper and lower extremities. Disruption at any link — limited ankle mobility, weak hip abductors, restricted thoracic rotation — creates compensatory loading elsewhere. Over time, compensated joints develop pathology from loads they were not designed to sustain.",
              },
              {
                label: "Why It Matters",
                content: "Any blockage or defect in the kinetic chain creates compensatory patterns and overuse injuries in adjacent structures (PMC, 2023). The clinical implication: treatment of the symptomatic site without assessment of the chain above and below it will reliably fail.",
              },
              {
                label: "What To Do",
                content: [
                  "Kinetic chain assessment (overhead squat, single-leg deadlift, walking gait)",
                  "movement pattern correction starting from the base of the chain",
                ],
              },
            ],
          },
          {
            id: "proximal-distal-force",
            term: "Proximal-to-Distal Force Transfer",
            image: "proximal-to-distal.png",
            brief: "Power and stability generated at the center of the body (pelvis, core) are transmitted outward to the extremities — the source of most athletic power and most athletic injury.",
            mnemonic: "A bullwhip generates force at the handle (proximal) and delivers it at the tip (distal). A weak handle creates a limp whip. A strong, stable core creates powerful extremities — and a weak core forces the extremities to generate their own stability.",
            tabs: [
              {
                label: "The Concept",
                content: "Proximal-to-distal sequencing describes the biomechanical principle that efficient movement begins with stabilization and force generation at the proximal segments (core, hip, shoulder girdle) before the force is transferred to the distal segments (forearm, hand, foot). This principle applies to throwing, kicking, punching, and all explosive sports movements. PMC research confirms that \"the contribution of more body segments in the total force output leads to higher potential velocity at the distal part.\" When the proximal segments (core and hip) are insufficient, the distal segments (elbow, knee, ankle) are forced to compensate — generating forces they cannot safely sustain, leading to overuse injury.",
              },
              {
                label: "Why It Matters",
                content: "\"Tennis elbow\" in recreational players is often a wrist and forearm problem driven by insufficient core and shoulder rotation. Pitcher's elbow is driven by inadequate hip rotation and core stability forcing the elbow to compensate. In both cases, treating only the elbow while ignoring the chain is why these injuries recur.",
              },
              {
                label: "What To Do",
                content: [
                  "Rotational medicine ball throws",
                  "cable chops",
                  "hip-to-shoulder integrated movements",
                  "any exercise that loads the core before the extremities",
                ],
              },
            ],
          },
        ],
      },
    ],
  },
{
    id: "what-your-body-needs",
    title: "How to Think About It",
    subtitle: "The frameworks that change how you see your body",
    desc: "Mental models that make everything else click. These aren't exercises — they're lenses. Once you see through them, you can't unsee.",
    accent: "#4A7A8A",
    groups: [
      {
        id: "mobility-stability",
        label: "Mobility vs. Stability",
        subtitle: "Two different jobs, often confused",
        desc: "Your body alternates between joints that need to move and joints that need to hold. Ankle: mobile. Knee: stable. Hip: mobile. Lumbar spine: stable. When a mobile joint stiffens up, the stable joint next to it is forced to move instead — doing a job it was never built for. That compensation is where most chronic pain begins.",
        icon: "⇌",
        cards: [
          {
            id: "joint-by-joint",
            term: "The Joint-by-Joint Approach",
            brief: "Joints alternate between needing mobility (freedom to move) and needing stability (resistance to unwanted movement) — and when a mobility joint loses range, the stability joint above or below it is forced to compensate.",
            mnemonic: "Mobility-Stability-Mobility-Stability up the chain, from ankle to skull. When mobility is lost at one joint, the stability joint takes up the slack — doing a job it wasn't designed for, and eventually breaking down.",
            tabs: [
              {
                label: "The Concept",
                content: "Developed by physical therapist Gray Cook and strength coach Mike Boyle, the Joint-by-Joint approach maps the mobility and stability demands of each joint in the kinetic chain: ankle (mobility), knee (stability), hip (mobility), lumbar spine (stability), thoracic spine (mobility), scapula (stability), glenohumeral joint (mobility), elbow (stability), wrist (mobility). When a mobility joint loses range — tight hips, stiff thoracic spine, limited ankles — the adjacent stability joint compensates by moving into ranges it was not designed for. This is the fundamental mechanism behind most chronic musculoskeletal pain patterns: the lumbar spine moving when it should be stable (because the hip or thoracic spine won't), or the knee rotating when it should be stable (because the hip won't externally rotate adequately).",
              },
              {
                label: "Why It Matters",
                content: "The most common manifestation: the hip loses mobility → the lumbar spine compensates by rotating and extending → lumbar disc and facet joint pathology follows. Or: the ankle loses dorsiflexion → the knee compensates by collapsing inward → patellofemoral pain and ACL stress follow. Restoring mobility at the correct joint is the intervention — not treating the pain at the stability joint.",
              },
              {
                label: "What To Do",
                content: [
                  "Hip mobility: 90/90, pigeon, hip CARs",
                  "Thoracic mobility: thoracic extension over foam roller, rotation drills",
                  "Ankle mobility: dorsiflexion drills, calf stretching",
                  "Knee stability: terminal knee extension, single-leg squat",
                ],
              },
            ],
          },
          {
            id: "thoracic-mobility",
            term: "Thoracic Mobility",
            brief: "The mid-back should be the body's primary rotational region — but it is chronically stiff in most people, forcing the lumbar spine and neck to compensate for every twist and reach.",
            mnemonic: "The thoracic spine is the trunk of the body's rotational tree. When the trunk is stiff, the branches (neck, lower back) bend more than they should — and eventually break.",
            tabs: [
              {
                label: "The Concept",
                content: "The thoracic spine consists of 12 vertebrae and is the primary region for spinal rotation — each level contributes a few degrees of rotation, totaling approximately 35-50 degrees of rotation for the full thoracic spine. Its facet joints are oriented to permit rotation (unlike lumbar facets, which are vertically oriented and restrict it). Chronic thoracic kyphosis — accelerated by sitting, screens, and stress — removes the thoracic spine's rotational capacity. Research confirms that thoracic kyphosis increases at approximately 2.28 degrees per decade of life and is strongly associated with decreased muscle mass (UK Biobank, 2024). When thoracic rotation is lost, the lumbar spine (which should be stable) is forced to rotate compensatorily — compressing lumbar discs asymmetrically. Simultaneously, the shoulder complex loses its base of support, increasing impingement risk. Physical therapist research confirms that thoracic mobilization — adding rotation and extension work to a stiff thoracic spine — produces measurable improvements in lumbar pain, cervical pain, and shoulder function.",
              },
              {
                label: "Why It Matters",
                content: "Thoracic stiffness is one of the most undertreated contributors to both lower back pain and shoulder impingement. When the thoracic spine does not rotate adequately for overhead movements, the shoulder compensates with excessive glenohumeral movement — compressing the rotator cuff against the acromion. This is also why spinal twists are among the most important practices in this curriculum.",
              },
              {
                label: "What To Do",
                content: [
                  "Thoracic rotation stretch",
                  "thoracic extension over foam roller",
                  "cat-cow with focus on thoracic segments",
                  "thread-the-needle stretch",
                  "spinal twists",
                  "yoga poses that demand thoracic rotation (revolved triangle, half lord of the fishes)",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "reading-the-chain",
        label: "How to Read Your Body",
        subtitle: "Symptoms lie. Systems don't.",
        desc: "The place that hurts is almost never the place that's broken. Your body is a network — tension in one area creates compensation somewhere else, and pain at the end of the chain. Learning to read your body means learning to look upstream, not at the symptom.",
        icon: "⇌",
        cards: [
          {
            id: "pain-not-source",
            term: "The Site of Pain Is Not the Source",
            brief: "The body compensates silently. By the time something hurts, the problem has usually been somewhere else for months.",
            mnemonic: "The check engine light is not the engine problem. Treating only where it hurts — without asking why it hurts there — is changing the light bulb.",
            tabs: [
              {
                label: "The Idea",
                content: "When one part of the body can't do its job — a stiff joint, a weak muscle, a restricted fascia — the body doesn't stop moving. It reroutes. An adjacent joint picks up the slack, doing work it wasn't designed for. This compensation is silent at first. You don't feel anything wrong because the body is solving the problem for you. But the compensating structure is now under chronic, inappropriate load. Over weeks and months, that load accumulates — until the compensating structure reaches its tolerance limit. That's when you feel pain. The pain is real, but it's the last domino, not the first. The actual problem — the joint or muscle that stopped doing its job — is often painless, quiet, and somewhere else entirely.",
              },
              {
                label: "Why It Changes Everything",
                content: "This reframe changes how you approach every ache and restriction. Instead of asking only \"what hurts?\" you start asking \"what stopped working that made this hurt?\" It explains why foam rolling and stretching the painful area often provides only temporary relief — because the load returns as soon as you stop, since the source hasn't changed. It explains why the same injury keeps coming back after treatment. And it's why the most effective movement practitioners spend more time assessing above and below the pain than at the pain itself.",
              },
              {
                label: "What to Ask",
                content: [
                  "Where does it hurt? (the symptom — acknowledge it, but don't stop here)",
                  "What moves above it? (is the joint above restricted, forcing this area to compensate?)",
                  "What moves below it? (is the joint below stiff or weak, sending excess load upward?)",
                ],
              },
            ],
          },
          {
            id: "body-as-system",
            term: "The Body Is a System, Not a Collection of Parts",
            brief: "Every isolated fix that fails is evidence of a system that wasn't addressed.",
            mnemonic: "You don't fix a traffic jam by widening one intersection. You model the whole network. The body is the same — one restriction changes flow everywhere downstream.",
            tabs: [
              {
                label: "The Idea",
                content: "The body is not a machine made of independent components. It is a continuous, interconnected system — muscles linked by fascia, joints linked by kinetic chains, movement patterns linked by the nervous system. When you treat one part in isolation — stretching only the tight muscle, strengthening only the weak one, releasing only the painful spot — you are intervening in a network without considering the network. This is why so many common approaches fail: the hamstring that keeps getting tight despite years of stretching (because the restriction is in the calf or thoracolumbar fascia), the shoulder that keeps getting impinged despite rotator cuff exercises (because the thoracic spine won't rotate), the knee that keeps hurting despite quad strengthening (because the hip can't stabilize in the frontal plane). Each of these is a systems problem treated as a parts problem.",
              },
              {
                label: "Why It Changes Everything",
                content: "Once you see the body as a system, you stop chasing symptoms. You start asking what pattern produced this symptom. You stop treating muscles and start treating movement. You stop isolating and start integrating. This is the shift from reactive treatment to proactive understanding — and it's what separates the person who keeps getting injured from the person who finally stops.",
              },
              {
                label: "An Example",
                content: "A person has chronic lower back pain. The isolated approach: stretch the lower back, strengthen the core, take anti-inflammatories. The systems approach: check ankle dorsiflexion (restricted — heels rise in a squat), check hip mobility (limited external rotation — femur internally rotates during movement), observe the knee (collapses inward under load — valgus), observe the hip (drops on one side — Trendelenburg sign), observe the lumbar spine (compensating with rotation and extension it wasn't designed for). One restriction at the ankle created a chain of compensations through the knee, hip, and into the lower back. Five symptoms. One source. The fix isn't a back exercise — it's restoring ankle mobility and hip control. The back pain resolves because the system no longer needs the back to compensate.",
              },
            ],
          },
        ],
      },
    ],
  }
];

// ─── Derived data ────────────────────────────────────────────────────────────

export function getAllGroupsL2() {
  return MOVEMENT_DECK_L2.flatMap(ch => ch.groups);
}

export function getTotalCardsL2() {
  return MOVEMENT_DECK_L2.reduce(
    (sum, ch) => sum + ch.groups.reduce((s, g) => s + g.cards.length, 0),
    0,
  );
}

export function buildScreensL2() {
  const screens = [
    { type: 'cover' },
    { type: 'chapters' },
  ];

  MOVEMENT_DECK_L2.forEach((chapter, ci) => {
    const totalChapterCards = chapter.groups.reduce((s, g) => s + g.cards.length, 0);
    const isSmallChapter = totalChapterCards <= 4;

    screens.push({ type: 'chapter-title', chapter, chapterIndex: ci });
    screens.push({ type: 'chapter-toc', chapter, chapterIndex: ci });

    chapter.groups.forEach((group, gi) => {
      if (!isSmallChapter) {
        screens.push({ type: 'group-title', group, chapter, chapterIndex: ci, groupIndex: gi });
      }

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
