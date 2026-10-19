/*
 * POSTUREX blog articles.
 * All content is drawn from the capstone manuscript
 * ("finals2 POSTUREX CAPSTONE finals.pdf"). "period" is the project phase an
 * article covers, taken from the manuscript's lifecycle table; it is not an
 * invented publication date. Add new articles to the end of this array.
 */
window.POSTUREX_ARTICLES = [
  {
    id: 'building-posturex',
    title: 'Building POSTUREX: From Concept to Prototype',
    category: 'Project Development',
    period: 'March – September 2026',
    author: 'POSTUREX Research Team',
    image: 'assets/img/prototype-chair.webp',
    imageAlt: 'The implemented POSTUREX chair sleeve on a chair',
    excerpt: 'Why we set out to build a camera-free, non-wearable posture-awareness tool, and how six Kanban iterations turned the idea into a working prototype.',
    body: `
      <p>Prolonged sitting is part of everyday life in offices, classrooms and computer laboratories. Over a long session it is easy to drift into slouched or asymmetrical positions without noticing. POSTUREX began from observations of these sitting-posture concerns in academic and office settings, and from an initial data-gathering survey that informed our early problem definition.</p>

      <h2>The gap we wanted to address</h2>
      <p>Conventional chairs do not monitor how a person sits, and observational ergonomic assessments such as RULA, REBA and ROSA capture posture only at the moment of assessment. Technology-based alternatives each come with trade-offs:</p>
      <ul>
        <li><strong>Camera-based systems</strong> can raise privacy concerns in shared spaces.</li>
        <li><strong>Wearables</strong> rely on users attaching a device correctly every session.</li>
        <li><strong>Dense pressure mats</strong> need many sensing elements, adding cost and complexity.</li>
      </ul>
      <p>We wanted something that attaches to an existing chair, needs no camera and nothing to wear, gives real-time feedback, keeps a record of sessions and presents understandable analytics.</p>

      <h2>Our approach</h2>
      <p>The answer became a removable chair sleeve carrying four Force-Sensing Resistors and an HC-SR04 ultrasonic distance sensor, wired to an ESP32 that runs an Edge Impulse TinyML model. Posture is classified into three project-defined states — upright, slouched and leaning — and sent over Bluetooth Low Energy to the POSTUREX mobile app.</p>

      <h2>How the work was organised</h2>
      <p>We followed a Kanban-based iterative and incremental lifecycle, tracked on a Trello board:</p>
      <ul>
        <li><strong>Inception (Mar. 9–20, 2026):</strong> project definition and initial technical planning.</li>
        <li><strong>Iteration 1 (Mar. 23–Apr. 10):</strong> sensor acquisition and the mobile-application foundation.</li>
        <li><strong>Iteration 2 (Apr. 13–May 1):</strong> posture-classification development and app expansion.</li>
        <li><strong>Iteration 3 (May 4–12):</strong> integration and Outline Defense preparation; the Outline Defense was held on May 12.</li>
        <li><strong>Project pause (June–early July).</strong></li>
        <li><strong>Iteration 4 (Jul. 14–Aug. 1):</strong> panel-driven revision and technical correction.</li>
        <li><strong>Iteration 5 (Aug. 4–11):</strong> sensor calibration and hardware refinement.</li>
        <li><strong>Iteration 6 (Aug. 12–18):</strong> hardware and system integration.</li>
        <li><strong>Evaluation preparation (Aug. 19–Sep. 7):</strong> corrective stabilization before formal testing.</li>
      </ul>

      <h2>Requirements that changed along the way</h2>
      <p>Requirements were refined throughout the project rather than fixed at the start. Adviser and panel feedback led to work on authentication and email verification, shared-chair operation, idle handling, BLE behaviour, platform compatibility, testing procedures, privacy and the role of AI coaching. Technical findings also forced changes: sensor response, calibration, wiring, BLE reporting, power configuration and occupancy handling all needed adjustment.</p>
      <p>One significant change was the classifier itself. Earlier design descriptions used fixed rule-based thresholds and a chair-mounted vibration motor; the final prototype instead uses an Edge Impulse-trained model on the ESP32 and gives corrective feedback through the app, with no buzzer or vibration motor on the chair.</p>
    `
  },
  {
    id: 'iot-sensors',
    title: 'How IoT Sensors Power POSTUREX',
    category: 'Hardware and Sensors',
    period: 'Iterations 1, 5 & 6 · 2026',
    author: 'POSTUREX Research Team',
    image: 'assets/img/sensor-positions.webp',
    imageAlt: 'Labelled sensor positions on the POSTUREX chair sleeve',
    excerpt: 'Four FSRs, one ultrasonic sensor and an ESP32: where each sensor sits on the chair sleeve and what it measures.',
    body: `
      <p>The physical half of POSTUREX is a removable chair sleeve that fits over an existing chair. It turns ordinary seating into a sensing surface without permanently modifying the chair or building a dedicated smart chair.</p>

      <figure><img src="assets/img/sensor-positions.webp" alt="Sensor positioning on the removable chair sleeve" loading="lazy" /><figcaption>Sensor positioning on the removable chair sleeve (manuscript Fig. D.2).</figcaption></figure>

      <h2>Four Force-Sensing Resistors</h2>
      <p>Four FSRs sit at the <strong>left-back, right-back, seat-left and seat-right</strong> contact areas. Their pressure-related readings reflect how the user interacts with the backrest and seat. The two seat FSRs also handle <strong>occupancy</strong>: an empty chair is not treated as an upright, slouched or leaning posture.</p>

      <h2>HC-SR04 ultrasonic distance sensor</h2>
      <p>The HC-SR04 sits at the upper portion of the backrest and measures the separation between the sensor and the user's upper back. Pressure and distance give the classifier complementary information about body position.</p>

      <h2>The ESP32</h2>
      <p>The ESP32 is the central controller. It reads the four FSR channels and the ultrasonic sensor, prepares the model's input features, runs posture inference and transmits the result over its built-in BLE radio. A few implementation details from the final firmware:</p>
      <ul>
        <li>The ADC runs at 12-bit resolution and averages four samples per FSR reading.</li>
        <li>Thresholds use a 15-count hysteresis dead band.</li>
        <li>Calibration samples the unloaded sensors, adds a margin, rejects suspicious values from floating or mis-wired inputs and saves accepted thresholds to non-volatile storage.</li>
        <li>If no seat pressure is detected for two minutes, the firmware enters an idle state. BLE stays available while ultrasonic measurement pauses.</li>
      </ul>

      <figure><img src="assets/img/circuit-diagram.webp" alt="Final POSTUREX circuit diagram" loading="lazy" /><figcaption>Final circuit: ESP32, four FSRs, HC-SR04, TP4056 charging module and a rechargeable Li-ion battery (Fig. D.3).</figcaption></figure>

      <h2>Power</h2>
      <p>The prototype runs on a rechargeable power arrangement. Charging status is shown by the TP4056 module's hardware indicators; the app does not display a measured battery percentage.</p>

      <h2>What affects the readings</h2>
      <p>FSR contact can vary with body dimensions, clothing, sleeve alignment and seating habits, and ultrasonic distance varies with backrest geometry. That is why consistent sleeve positioning matters, and why our recommendations include positioning guides and a standardized calibration procedure.</p>

      <figure><img src="assets/img/fsr-internal.webp" alt="FSRs and wiring inside the chair sleeve" loading="lazy" /><figcaption>FSRs and wiring inside the sleeve (Fig. E.2).</figcaption></figure>
    `
  },
  {
    id: 'tinyml-classification',
    title: 'Understanding TinyML Posture Classification',
    category: 'Embedded AI and TinyML',
    period: 'Iteration 2 onward · 2026',
    author: 'POSTUREX Research Team',
    image: 'assets/img/edge-impulse-2.webp',
    imageAlt: 'Edge Impulse model training screen for the POSTUREX project',
    excerpt: 'How an Edge Impulse model running directly on the ESP32 tells upright, slouched and leaning apart, and why it is kept separate from AI coaching.',
    body: `
      <p>POSTUREX classifies posture <em>on the device</em>. A machine-learning model developed with Edge Impulse is deployed to the ESP32, which runs inference on live sensor-derived features and outputs one of three project-defined classes: <strong>upright</strong>, <strong>slouched</strong> or <strong>leaning</strong>.</p>

      <h2>Training versus inference</h2>
      <p>Training and deployment are distinct steps. Training happens during model development in Edge Impulse; the deployed ESP32 then executes inference on features built from the four FSR pressure states and the ultrasonic distance reading.</p>

      <figure><img src="assets/img/edge-impulse-1.webp" alt="Edge Impulse project screen" loading="lazy" /><figcaption>Edge Impulse model evidence (manuscript Fig. E.10).</figcaption></figure>
      <p>Edge Impulse reports its own training and held-out test metrics during development. Those figures are separate from the 84.44% controlled-trial accuracy in our results, which measures the deployed model against instructed postures performed by participants on the actual chair sleeve.</p>

      <h2>Why run the model on the ESP32?</h2>
      <p>Running inference locally separates time-sensitive sensing and classification from cloud-dependent features. Posture labels can still be computed when external AI services are unavailable, although the live display in the app still needs an active BLE connection.</p>

      <h2>Classification is not coaching</h2>
      <p>The embedded model is the only part of POSTUREX that classifies posture. The cloud-based AI-assisted coaching function never sees raw sensor data. It works from summarized monitoring information and gives supplementary, non-diagnostic guidance. The reported classification accuracy therefore measures the ESP32 classifier, not the coaching suggestions.</p>

      <h2>What the model does not do</h2>
      <ul>
        <li>The three classes do not cover every seated configuration. Rotation, reclining and intermediate or transitional postures are not separately classified.</li>
        <li>A predicted class is not a medical diagnosis, so the app presents results as awareness and guidance.</li>
        <li>Upright, slouched and leaning can produce overlapping sensor patterns, especially during transitions, which is one plausible source of errors.</li>
      </ul>

      <h2>Next steps</h2>
      <p>The manuscript recommends more training and testing data from people with different body dimensions and sitting habits, and reporting confusion matrices, precision and recall alongside overall accuracy to see which classes are most often confused.</p>
    `
  },
  {
    id: 'hardware-to-mobile',
    title: 'Connecting Hardware and Mobile Analytics',
    category: 'Mobile Application Development',
    period: 'Iterations 1–6 · 2026',
    author: 'POSTUREX Research Team',
    image: 'assets/img/app/analytics.webp',
    imageAlt: 'POSTUREX app analytics screen',
    excerpt: 'BLE communication, live monitoring, Supabase-backed history and analytics, and where the AI coach fits in the POSTUREX app.',
    body: `
      <p>The POSTUREX mobile app is the main way users interact with the chair sleeve. It is built with React and TypeScript and packaged for mobile with Capacitor, with Supabase providing authentication and data storage.</p>

      <h2>From chair to phone over BLE</h2>
      <p>During monitoring the sequence is: sensor acquisition → embedded inference on the ESP32 → BLE transmission → display in the app → session storage. The app also shows the device's connection state. A connected device and a correct classification are separate conditions: BLE provides the communication path, while the controlled trials measure whether the received class is right.</p>

      <h2>What the app does</h2>
      <ul>
        <li>User registration, sign-in and email verification.</li>
        <li>Connecting to the ESP32-based chair sleeve over BLE.</li>
        <li>Starting and stopping monitoring sessions.</li>
        <li>Live posture status, pressure-related information and app-based corrective feedback.</li>
        <li>Session history and daily, weekly and monthly analytics.</li>
        <li>Goals and progress.</li>
        <li>Optional, non-diagnostic AI-assisted coaching.</li>
      </ul>

      <h2>Storing history with Supabase</h2>
      <p>Supabase provides authentication, PostgreSQL storage and access control. Row-Level Security restricts account-scoped records. The embedded classifier does not depend on the backend to produce a label, but stored history and cloud features do depend on those services being available.</p>

      <h2>AI-assisted coaching</h2>
      <p>The coaching layer is a separate, Gemini-based server-side function that works on summarized session information. It is limited to posture-improvement suggestions, wellness reminders and exercise recommendations, and excludes clinical diagnosis and predictive health analytics. Sensor acquisition, classification and local alerts continue without internet; coaching resumes when the service is reachable.</p>

      <h2>A lesson from Beta testing</h2>
      <p>Our Beta tester pointed out that users needed a clearer indication of whether the chair sleeve was still connected. Without it, an interrupted data stream could be mistaken for an active session. We corrected the connection-status notification and retested it before User Acceptance Testing.</p>

      <figure><img src="assets/img/app/live-upright.webp" alt="POSTUREX live monitoring screen showing an upright posture" loading="lazy" class="phone-shot" /><figcaption>Live posture monitoring interface (Fig. E.6).</figcaption></figure>
    `
  },
  {
    id: 'testing-findings',
    title: 'Testing POSTUREX: Our Research Findings',
    category: 'Testing and Validation',
    period: 'September – October 2026',
    author: 'POSTUREX Research Team',
    image: 'assets/img/chair-sleeve.webp',
    imageAlt: 'POSTUREX chair sleeve prototype',
    excerpt: 'Functional tests, two controlled classification evaluations, Beta testing, seven-participant UAT and a physical therapist review — and what the results do and do not show.',
    body: `
      <p>We evaluated POSTUREX in several separate ways, because functionality, classification accuracy, usability and professional appropriateness are different questions.</p>

      <h2>Functional testing</h2>
      <p>Nine principal functions were reported as passing: authentication, BLE connection, start/stop monitoring, presentation of the three posture classes, app-based corrective feedback, session history, analytics, goals and progress, and AI-assisted coaching.</p>

      <h2>Controlled posture classification</h2>
      <p>In each trial a participant held an instructed posture and we recorded the ESP32's prediction. A trial counted as correct only if the two matched. The project target was at least <strong>80%</strong> overall accuracy.</p>
      <ul>
        <li><strong>Earlier evaluation:</strong> three participants (CT1–CT3), 15 trials each. 37 of 45 correct, <strong>82.22%</strong>.</li>
        <li><strong>September 18, 2026:</strong> the same participant codes, 30 mixed trials each (10 upright, 10 slouched, 10 leaning). CT1 and CT2 scored 83.33% and CT3 scored 86.67%. 76 of 90 correct, <strong>84.44%</strong>.</li>
      </ul>
      <p>Both runs exceeded the target. The later, larger run is treated as the primary result. The 2.22-point difference is descriptive only; it does not prove that a particular change caused it. The 14 incorrect predictions show the model does not classify every posture correctly.</p>

      <h2>Physical chair compatibility</h2>
      <p>The sleeve was installed on seven selected chair types — plastic monoblock, wooden with solid upper backrest, wooden office visitor, padded office task, metal-frame office visitor, mesh office and wooden straight-back — and fit was confirmed on all seven. This is a physical-fit result only. It does not show equal classification accuracy on every chair or universal compatibility.</p>

      <h2>User Acceptance Testing</h2>
      <p>Seven participants each assessed eight tasks (56 possible). 55 were answered: 49 rated Easy to Complete, 5 Completed with Difficulty and 1 Needed Help; none were marked Could Not Complete. The ten-item questionnaire totalled <strong>324/350</strong>, a mean of <strong>4.63/5.00</strong>. Five participants accepted POSTUREX for its intended purpose and two accepted it with minor revisions.</p>
      <p>Comments mentioned sleeve positioning and comfort, occasional inconsistent detection, BLE reliability, one session with a disconnected wire, and interest in more personalization. Participants also found history and analytics useful for reviewing their habits.</p>

      <h2>Expert validation</h2>
      <p>On October 9, 2026, a registered physical therapist from San Pedro Hospital, Davao City, rated six statements covering posture categories, sensor placement, alerts, guidance, analytics and overall suitability. All six received 5/5, a total of <strong>30/30</strong>, with an overall assessment of "Acceptable without revision."</p>

      <h2>What this does and does not mean</h2>
      <p>Taken together, the evidence supports POSTUREX's feasibility as an academic posture-awareness prototype under our test conditions. It is not a clinically validated diagnostic system. The controlled trials involved three people, the UAT reflects seven participants' perceptions, and one expert review does not establish clinical efficacy.</p>
    `
  }
];

window.POSTUREX_CATEGORIES = [
  'Project Development',
  'Hardware and Sensors',
  'Embedded AI and TinyML',
  'Mobile Application Development',
  'Testing and Validation',
  'Research Milestones'
];
