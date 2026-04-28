const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const qrcode = require("qrcode-terminal");
const pino = require("pino");

const leadStates = {};

const BUSINESS_NAME = "Morris L. Dorley Jr. Digital Solutions";
const PHONE_1 = "+231770787020";
const PHONE_2 = "0888283007";

function getMainMenu() {
  return `👋 Welcome to *${BUSINESS_NAME}*

We help businesses, schools, offices, clinics, and organizations grow with smart digital solutions.

Please choose a service:

1️⃣ Website Design
2️⃣ Mobile App Development
3️⃣ WhatsApp Automation
4️⃣ Facebook Content Service
5️⃣ Graphic Design
6️⃣ School Management System
7️⃣ Networking Setup & Administration
8️⃣ IT Consulting & Support
9️⃣ Cloud Solutions & Backup
🔟 Talk to Morris

Reply with a number.`;
}

function getServiceReply(text) {
  if (text === "1" || text.includes("website")) {
    return `🌐 *Website Design Service*

We build professional websites for:
• Businesses
• Schools
• NGOs
• Churches
• Online stores
• Personal brands

Features:
• Mobile-friendly design
• Fast loading
• Contact forms
• Professional layout
• SEO-ready structure

💰 Starting from: *$150*

Please send:
Name:
Business Name:
Website Type:
Location:
Budget:
Deadline:`;
  }

  if (text === "2" || text.includes("app") || text.includes("mobile")) {
    return `📱 *Mobile App Development*

We develop mobile apps for:
• Businesses
• Schools
• Delivery services
• Booking systems
• Inventory systems

Features:
• Android app
• Clean interface
• Secure backend
• Admin dashboard
• Scalable structure

💰 Starting from: *$250*

Please send:
Name:
App Idea:
Main Features:
Budget:
Deadline:`;
  }

  if (text === "3" || text.includes("whatsapp")) {
    return `💬 *WhatsApp Automation*

We set up WhatsApp systems that help businesses reply faster and get more customers.

You get:
• Business profile setup
• Auto greeting message
• Away message
• Quick replies
• Product catalog
• Order format
• Customer labels

💰 Starting from: *$25*

Please send:
Name:
Business Name:
Business Type:
Location:
WhatsApp Number:`;
  }

  if (text === "4" || text.includes("facebook")) {
    return `📘 *Facebook Content Service*

We create content that helps your business look professional and attract customers.

You get:
• Facebook posts
• Sales captions
• Product promotions
• WhatsApp status content
• Weekly content calendar
• Engagement posts

💰 Starting from: *$30/month*

Please send:
Name:
Business Name:
Facebook Page Link:
Business Type:
Monthly Budget:`;
  }

  if (text === "5" || text.includes("graphic") || text.includes("flyer") || text.includes("logo")) {
    return `🎨 *Graphic Design Service*

We design:
• Flyers
• Logos
• Business cards
• Posters
• Social media graphics
• Banners
• Invitations

💰 Starting from: *$15*

Please send:
Name:
Design Type:
Text to Add:
Preferred Colors:
Deadline:`;
  }

  if (text === "6" || text.includes("school")) {
    return `🏫 *School Management System*

We build complete school systems using:
• MS Access
• Google App Script
• Web-based system
• Excel

Modules:
• Students
• Staff
• Attendance
• Fees
• Exams
• Reports
• Settings

💰 Starting from: *$199*

Please send:
School Name:
Location:
Number of Students:
Preferred Platform:
Budget:`;
  }

  if (text === "7" || text.includes("network")) {
    return `🖧 *Networking Setup & Administration*

We set up networks for:
• Schools
• Offices
• Clinics
• Hospitals

Services:
• WiFi setup
• Router setup
• Switch configuration
• Server setup
• Network security
• CCTV/IP camera setup
• Maintenance

Please send:
Name:
Institution/Business Name:
Location:
Type of Setup Needed:`;
  }

  if (text === "8" || text.includes("it support") || text.includes("consulting")) {
    return `🛠️ *IT Consulting & Support*

We help with:
• System setup
• Troubleshooting
• Software installation
• Maintenance
• Data backup
• Security support
• Technical guidance

Please send:
Name:
Issue/Service Needed:
Location:
Urgency Level:`;
  }

  if (text === "9" || text.includes("cloud") || text.includes("backup")) {
    return `☁️ *Cloud Solutions & Backup*

We provide:
• Cloud storage setup
• Secure file backup
• Data protection
• Business continuity support
• Google Drive/Cloud setup
• Backup management

Please send:
Name:
Business/Institution:
Data Type:
Storage Size:
Backup Need:`;
  }

  if (text === "10" || text.includes("morris") || text.includes("talk")) {
    return `✅ No problem.

Please send your message clearly.

Morris will reply shortly.

📞 Call/WhatsApp:
${PHONE_1}
${PHONE_2}`;
  }

  return null;
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session_data");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }),
    browser: ["Morris Bot", "Chrome", "1.0"]
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.clear();
      console.log("\nScan this QR code with WhatsApp Linked Devices:\n");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("✅ Morris WhatsApp Bot is online!");
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;

      if (reason !== DisconnectReason.loggedOut) {
        console.log("Reconnecting...");
        startBot();
      } else {
        console.log("Logged out. Delete session_data and scan again.");
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async (m) => {
    try {
      const msg = m.messages[0];

      if (!msg.message) return;
      if (msg.key.remoteJid === "status@broadcast") return;
      if (msg.key.fromMe) return;

      const sender = msg.key.remoteJid;
      const text = (
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        ""
      )
        .trim()
        .toLowerCase();

      console.log(`📩 Message from ${sender}: ${text}`);

      if (!text) {
        await sock.sendMessage(sender, {
          text: "Please send a text message so I can assist you."
        });
        return;
      }

      if (
        ["hi", "hello", "hey", "menu", "start", "good morning", "good afternoon", "good evening"].some(
          (word) => text.includes(word)
        )
      ) {
        await sock.sendMessage(sender, { text: getMainMenu() });
        return;
      }

      if (text.includes("price") || text.includes("cost") || text.includes("how much")) {
        await sock.sendMessage(sender, {
          text: `💰 *Starting Prices*

• WhatsApp Setup: From $25
• Facebook Content: From $30/month
• Graphic Design: From $15
• Website Design: From $150
• Mobile App: From $250
• School System: From $199
• Networking Setup: Based on inspection
• IT Support: Based on issue
• Cloud Backup: Based on storage size

Please choose a service from the menu for full details.`
        });
        return;
      }

      if (text.includes("contact") || text.includes("call") || text.includes("number")) {
        await sock.sendMessage(sender, {
          text: `📞 *Contact Information*

Morris L. Dorley Jr.

WhatsApp/Call:
${PHONE_1}
${PHONE_2}

Location:
Monrovia, Liberia`
        });
        return;
      }

      if (text.includes("location") || text.includes("where")) {
        await sock.sendMessage(sender, {
          text: `📍 We are based in Monrovia, Liberia.

We also work with clients online.`
        });
        return;
      }

      if (text.includes("order") || text.includes("start") || text.includes("project")) {
        leadStates[sender] = { step: "WAITING_FOR_DETAILS" };

        await sock.sendMessage(sender, {
          text: `Great. Let’s start your request.

Please send:

Name:
Business/School/Organization:
Service Needed:
Location:
Budget:
Deadline:`
        });
        return;
      }

      if (leadStates[sender]?.step === "WAITING_FOR_DETAILS") {
        await sock.sendMessage(sender, {
          text: `✅ Thank you. Your request has been received.

Morris will review it and reply shortly.

For urgent contact:
${PHONE_1}
${PHONE_2}`
        });

        delete leadStates[sender];
        return;
      }

      const serviceReply = getServiceReply(text);

      if (serviceReply) {
        await sock.sendMessage(sender, { text: serviceReply });
        return;
      }

      await sock.sendMessage(sender, {
        text: `Thanks for messaging *${BUSINESS_NAME}*.

Please reply with *menu* to see our services, or choose:

1. Website Design
2. Mobile App
3. WhatsApp Automation
4. Facebook Content
5. Graphic Design
6. School System
7. Networking
8. IT Support
9. Cloud Backup
10. Talk to Morris`
      });
    } catch (error) {
      console.log("Message Error:", error);
    }
  });
}

startBot().catch((err) => console.log("Bot Error:", err));
