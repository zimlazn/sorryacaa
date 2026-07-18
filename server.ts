/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper: Send email notification to Arham
async function sendEmailNotification(message: string, mood: string, replyText: string) {
  const recipient = "arhamalmizan@gmail.com";
  
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  let transporter;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  } else {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    } catch (e) {
      console.error("Gagal membuat test account nodemailer:", e);
      return null;
    }
  }

  const mailOptions = {
    from: '"Aplikasi Surat Maaf Acaa" <noreply@suratmaafacaa.com>',
    to: recipient,
    subject: `🚨 [Suara Hati Acaa] Mood: ${mood}`,
    text: `Halo Arham,\n\nAcaa baru saja meluapkan perasaannya di website permohonan maafmu!\n\n📋 STATUS PERASAAN:\n${mood}\n\n💬 PESAN DARI ACA:\n"${message}"\n\n📝 JAWABAN PUITIS AAM:\n${replyText}\n\nSegera berikan perhatian ekstra dan bujuk dia agar lekas luluh!\n\n---\nDikirim secara otomatis oleh Website Surat Maaf untuk Acaa.`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #fdfaf4; color: #2d2620;">
        <h2 style="color: #b93c31; font-family: Georgia, serif; border-bottom: 2px solid #b93c31; padding-bottom: 10px; margin-top: 0;">🚨 Notifikasi Suara Hati Acaa</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #555;">Hai Arham, Acaa baru saja mencurahkan isi hatinya yang sedang terluka di website yang kamu buat.</p>
        
        <div style="background-color: #fcf9f2; border-left: 4px solid #b93c31; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; font-family: monospace; color: #888; font-weight: bold;">Mood Acaa saat ini:</p>
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #2d2620;">${mood}</p>
        </div>
 
        <div style="background-color: #ffffff; border: 1px solid #e0d9cf; padding: 18px; margin: 20px 0; border-radius: 8px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.02);">
          <p style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; font-family: monospace; color: #b93c31; font-weight: bold;">💬 Pesan Kemarahan / Kekecewaan Acaa:</p>
          <p style="margin: 0; font-size: 15px; font-style: italic; line-height: 1.6; color: #2d2620;">"${message}"</p>
        </div>
 
        <div style="background-color: #fcf9f2; border: 1px dashed #e0d9cf; padding: 18px; margin: 20px 0; border-radius: 8px;">
          <p style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; font-family: monospace; color: #888; font-weight: bold;">📝 Surat Balasan Puitis Aam yang Terkirim:</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6b5c4f; white-space: pre-line;">${replyText}</p>
        </div>
 
        <p style="font-size: 14px; color: #b93c31; font-weight: bold; margin-top: 25px; text-align: center;">🎯 Segera bujuk Acaa dan tebus kesalahanmu!</p>
        
        <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="font-size: 11px; text-align: center; color: #999; font-family: monospace;">
          Website Surat Maaf Acaa • Malam Sabtu, 17 Juli 2026
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Notifikasi Email berhasil diproses. Message ID:", info.messageId);
    
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("Pratinjau Email Ethereal tersedia di:", previewUrl);
      return previewUrl;
    }
  } catch (err) {
    console.error("Gagal mengirim email notifikasi:", err);
  }
  return null;
}

// Local data storage setup
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "apology_responses.json");

// Ensure data folder and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify({
      selectedTebusan: null,
      customNote: "",
      logs: [],
    }, null, 2)
  );
}

// API: Get current state
app.get("/api/apology/responses", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to read data" });
  }
});

// API: Submit Acaa's choice of compensation (Tebusan)
app.post("/api/apology/submit-tebusan", (req, res) => {
  try {
    const { option, customNote } = req.body;
    
    if (!option) {
      res.status(400).json({ error: "Opsi tebusan wajib dipilih" });
      return;
    }

    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    data.selectedTebusan = option;
    data.customNote = customNote || "";
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: "Failed to save tebusan choice" });
  }
});

// API: Save custom log/message from Acaa and generate Sincere Poetic Apology Reply (Human-Written, AI Removed)
app.post("/api/apology/gemini-voice", async (req, res) => {
  try {
    const { message, mood } = req.body;

    if (!message) {
      res.status(400).json({ error: "Pesan wajib diisi" });
      return;
    }

    const currentMood = mood || "Unspecified";
    let replyText = "";

    if (currentMood.includes("Marah")) {
      replyText = `Ketika marahmu bergemuruh, hatiku tenggelam dalam penyesalan yang sunyi.
---
Acaa sayang, aku tahu kata maaf saja tidak akan cukup untuk mengobati amarahmu yang memuncak saat ini. Kemarahanmu sangat bisa dimengerti. Kamu sudah meluangkan waktu berhargamu semalam, menungguku dengan penuh harap, tapi aku justru ketiduran begitu saja dan mengabaikan panggilanmu. Aku benar-benar merasa bersalah dan bodoh.

Aku tidak akan membela diri atau mencari alasan apapun. Aku sepenuhnya menyadari kesalahan ini. Tolong tumpahkan saja semua amarahmu di sini, aku akan mendengarkan dan menerima semuanya demi membuat hatimu merasa lebih baik.
---
Aku sayang banget sama kamu, Aca. Aku akan tunggu sampai amarahmu reda dan kamu merasa nyaman kembali.`;
    } else if (currentMood.includes("Kecewa") || currentMood.includes("Sedih")) {
      replyText = `Kesedihanmu adalah duri tertajam yang menusuk tepat di ulu hatiku.
---
Acaa sayang, melihatmu kecewa dan sedih adalah hal terakhir yang ingin kulakukan. Maafkan aku yang sudah membuat air matamu jatuh atau membuat hatimu terasa sesak karena menungguku semalam. Rasanya sakit sekali tahu bahwa orang yang paling aku sayangi harus sedih karena kelalaianku.

Aku sangat menyesal sudah mengecewakanmu. Aku berjanji akan lebih disiplin menjaga kabar dan waktu kita bersama, agar senyum manis yang sangat aku sukai itu bisa kembali menghiasi hari-harimu.
---
Jangan sedih lagi ya sayang, aku di sini memelukmu dengan seluruh rasa bersalahku.`;
    } else if (currentMood.includes("Bujuk")) {
      replyText = `Bagai bunga yang merindukan embun, aku merindukan senyum manismu kembali.
---
Acaa sayang, terima kasih masih memberikan ruang untukku membujukmu. Aku tahu aku sangat bersalah semalam karena ketiduran tanpa kabar. Aku di sini siap melakukan apa saja untuk mengembalikan mood baikmu.

Apakah kamu mau kupon belanja online, martabak hangat, atau pelukan erat? Apapun yang kamu inginkan, katakan saja ya sayang. Aku ingin menghapus seluruh rasa kesalmu dan menggantinya dengan kehangatan kembali.
---
Sini sayang, aku bujuk dengan segenap rasa sayangku yang tak terhingga.`;
    } else {
      replyText = `Gemasmu adalah candu, pertanda badai di hatimu mulai berlalu.
---
Acaa manis, melihatmu mulai gemas membuat hatiku terasa sedikit lebih tenang, meskipun rasa bersalahku belum sepenuhnya hilang. Terima kasih banyak sudah berlapang dada menerima usaha permohonan maafku ini.

Aku berjanji tidak akan mengulangi kesalahan konyol ketiduran tanpa kabar lagi. Aku ingin selalu ada di setiap malammu untuk menemani obrolan hangat kita.
---
Gemes banget sih pacarku ini, bolehkah aku mendapatkan senyum termanismu sekarang?`;
    }

    // Send email notification to arhamalmizan@gmail.com
    const emailPreviewUrl = await sendEmailNotification(message, currentMood, replyText);

    // Save this interaction to the local log for his reference
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    const newLog = {
      id: "log_" + Date.now(),
      message,
      mood: currentMood,
      reply: replyText,
      emailSentTo: "arhamalmizan@gmail.com",
      emailPreviewUrl: emailPreviewUrl || null,
      createdAt: new Date().toISOString(),
    };
    
    data.logs.push(newLog);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    // Parse the 3 parts
    const parts = replyText.split("---").map((p) => p.trim());
    res.json({
      success: true,
      poem: parts[0] || "Hening malam menceritakan sesal yang tak bertepi.",
      letter: parts[1] || replyText,
      sweetMessage: parts[2] || "Aku di sini, menunggumu reda, Acaa sayang.",
    });
  } catch (error: any) {
    console.error("Apology voice route error:", error);
    res.status(500).json({ error: "Gagal memproses suara hati Acaa. " + error.message });
  }
});

// Serve static build or set up Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
