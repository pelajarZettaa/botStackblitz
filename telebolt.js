const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

// Token bot Telegram Anda
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not defined in .env file");

const bot = new TelegramBot(token, { polling: true });

const apiUrl = "https://restiapimail.onrender.com/api"; // API Mail.tm
const fakerApiUrl =
  "https://fakerapi.it/api/v1/custom?_quantity=1&_locale=en_US&first=firstName&last=lastName";
const stackBlitzRegisterUrl = "https://stackblitz.com/api/users/registrations";

// **Data Konstanta yang Tidak Berubah**
const userDataTemplate = {
  password: "Rafif123",
  password_confirmation: "Rafif123",
  csrfToken:
    "K3Q62OuvJLScFoaYdxaiaqHihWQdAAs7evbDVXGVH479Osk7NIx9uokSGUNUd9E4k6dn4a1Dt8b0AU3iYgoamA", // CSRF Token
  cookies:
    "_gcl_au=1.1.544169746.1739132531; ahoy_visitor=04839831-d496-4a98-84b6-b632ac0a3150; ahoy_visit=b64bc0aa-7497-4294-8751-bcc3398eb895; guest_id=5hlGwPcbTRo%2B8FhABx5dJogxj8eILTvRUD8x66oQVWxYk8dAgGz8piClOMnTk5ShUO2NEx5xov93UiTImC3s16DvmUuFbCAvPmF6rPTIG2SDhrEQpGzorj3oyMGKSU4ZQnx2PdYe2sb8xdW8oLlwfA%3D%3D--mF1hfiNeXET7DQ18--TZG8p9F954FZzINUTrIyPA%3D%3D; _gid=GA1.2.1292291730.1739132533; ajs_anonymous_id=fddf349b-1a6f-4927-8c64-b16ad3f56eab; chatlio_uuid--4a1fa067-d628-4bd7-6378-ca95c8c51d22=24d018eb-a873-4f03-a0ca-7bebcd9868dd; chatlio_rt--4a1fa067-d628-4bd7-6378-ca95c8c51d22=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjZVVVSUQiOiI0YTFmYTA2Ny1kNjI4LTRiZDctNjM3OC1jYTk1YzhjNTFkMjIiLCJleHAiOjE4MDIyMDQ1MzcsImlhdCI6MTczOTEzMjUzNywidnNVVUlEIjoiMjRkMDE4ZWItYTg3My00ZjAzLWEwY2EtN2JlYmNkOTg2OGRkIn0.on5E6Njt_v1J3BeGceTsjnUjMrK3hgT8pdCDihFIYrE; chatlio_at--4a1fa067-d628-4bd7-6378-ca95c8c51d22=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjZVVVSUQiOiI0YTFmYTA2Ny1kNjI4LTRiZDctNjM3OC1jYTk1YzhjNTFkMjIiLCJleHAiOjE3MzkxMzk3MzcsImlhdCI6MTczOTEzMjUzNywidnNVVUlEIjoiMjRkMDE4ZWItYTg3My00ZjAzLWEwY2EtN2JlYmNkOTg2OGRkIn0.FuKdVzeOgVqbofdsKv-TIpvTtFVvb0gd3tKpvV1uuus; CSRF-TOKEN=K3Q62OuvJLScFoaYdxaiaqHihWQdAAs7evbDVXGVH479Osk7NIx9uokSGUNUd9E4k6dn4a1Dt8b0AU3iYgoamA; _session_id=xVxOg6BaCyHidgZGFKr%2FWCVWCZJb1%2FvWpqzWzArLqPnkAp5kNWATD1owehPw%2Flt9VwLY%2FgzPp%2Bvt2SOvE%2BKV18xCOBVuIKfZ2x0BwVZMcZMRU2P70d2bWwSDq%2FoNydamJgB4KZ1LV82OAN0mzfiHA%2FzrPAUjxoNCzg2kKw6ZWsrVBAcSfL8NlVRpFU1M7SsIuOPf29Eu3OcuSWXfUqUPsg3sVjNMFK%2BeOsqDAiPFDTLOuSWrovYeBY6%2FCggdLpIBNbBZgjGASe1NxlsQHv%2FTVwRiGw%3D%3D--nAitlHo5CDk3YYGc--U7yzfaSF1eeE6ppToHpb0Q%3D%3D; _ga=GA1.2.916925012.1739132532; _gat=1; mp_6a7f2ae4a8f5ca0202a8ae580f8af152_mixpanel=%7B%22distinct_id%22%3A%20%22fddf349b-1a6f-4927-8c64-b16ad3f56eab%22%2C%22%24device_id%22%3A%20%22194ec60799be72-0c53241ddd2198-26011b51-144000-194ec60799be73%22%2C%22mp_lib%22%3A%20%22Segment%3A%20web%22%2C%22%24search_engine%22%3A%20%22google%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.google.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.google.com%22%2C%22__mps%22%3A%20%7B%7D%2C%22__mpso%22%3A%20%7B%7D%2C%22__mpus%22%3A%20%7B%7D%2C%22__mpa%22%3A%20%7B%7D%2C%22__mpu%22%3A%20%7B%7D%2C%22__mpr%22%3A%20%5B%5D%2C%22__mpap%22%3A%20%5B%5D%2C%22%24user_id%22%3A%20%22fddf349b-1a6f-4927-8c64-b16ad3f56eab%22%7D; _ga_2BD72Z74YY=GS1.1.1739136668.2.0.1739136706.0.0.0",
};

// **Fungsi Pembuatan Email**
async function createTemporaryEmail() {
  try {
    const response = await axios.post(`${apiUrl}/accounts`);
    return { email: response.data.address, token: response.data.token };
  } catch (error) {
    throw new Error("Gagal membuat email sementara");
  }
}

// **Fungsi Generate Username**
async function generateUsername() {
  try {
    const response = await axios.get(fakerApiUrl);
    const firstName = response.data.data[0].first.toLowerCase();
    const lastName = response.data.data[0].last.toLowerCase();
    return `${firstName}${lastName}${Math.floor(Math.random() * 1000)}`;
  } catch (error) {
    throw new Error("Gagal mendapatkan username");
  }
}

// **Fungsi Registrasi Akun StackBlitz**
async function registerUser(email, username) {
  try {
    const response = await axios.post(
      stackBlitzRegisterUrl,
      {
        user: {
          email,
          username,
          password: userDataTemplate.password,
          password_confirmation: userDataTemplate.password_confirmation,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Csrf-Token": userDataTemplate.csrfToken,
          Cookie: userDataTemplate.cookies,
        },
      }
    );
    return response.data.message;
  } catch (error) {
    throw new Error("Gagal registrasi di StackBlitz");
  }
}

// **Fungsi Mengambil Email Verifikasi**
async function fetchVerificationEmail(token) {
  let attempts = 10;
  while (attempts--) {
    try {
      const response = await axios.get(`${apiUrl}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const messages = response.data["hydra:member"];
      if (messages.length > 0) {
        const verificationEmail = messages.find(
          (msg) => msg.from.address === "hello@stackblitz.com"
        );
        if (verificationEmail) {
          return verificationEmail.id;
        }
      }
    } catch (error) {
      console.error("Gagal mengambil email:", error.message);
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  throw new Error("Gagal menemukan email verifikasi");
}

// **Fungsi Mengambil Link Verifikasi dari Email**
async function extractVerificationLink(token, messageId) {
  try {
    const response = await axios.get(`${apiUrl}/messages/${messageId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const htmlContent = response.data.html[0];
    const $ = cheerio.load(htmlContent);
    const verificationLink = $("a[href*='token']").attr("href");

    if (!verificationLink) throw new Error("Link verifikasi tidak ditemukan");

    return verificationLink;
  } catch (error) {
    throw new Error("Gagal mengambil link verifikasi");
  }
}

// **Fungsi Verifikasi Akun StackBlitz**
// **Fungsi Verifikasi Akun StackBlitz**
async function verifyAccount(verificationLink, chatId) {
  try {
    await axios.get(verificationLink);
    console.log("✅ Akun berhasil diverifikasi!");

    // Mengirimkan pesan ke pengguna bahwa akun telah diverifikasi
    // bot.sendMessage(chatId, "✅ Akun berhasil diverifikasi!");
  } catch (error) {
    throw new Error("Gagal verifikasi akun");
  }
}

// **Fungsi Simpan Data Akun ke File TXT**
function saveAccountToFile(email, username, password) {
  const accountData = `Email: ${email}\nUsername: ${username}\nPassword: ${password}\n\n`;
  fs.appendFileSync("akun.txt", accountData, "utf8");
}

// Modify the createAccountAndSendToTelegram function to include detailed logging
async function createAccountAndSendToTelegram(chatId) {
  try {
    let statusMessage = await bot.sendMessage(
      chatId,
      "🚀 Memulai proses pembuatan akun..."
    );
    console.log("Started account creation process");

    await bot.editMessageText("📨 Membuat email temporary...", {
      chat_id: chatId,
      message_id: statusMessage.message_id,
    });
    const { email, token } = await createTemporaryEmail();
    console.log(`✓ Temporary email created: ${email}`);

    await bot.editMessageText("👤 Generating username...", {
      chat_id: chatId,
      message_id: statusMessage.message_id,
    });
    const username = await generateUsername();
    console.log(`✓ Username generated: ${username}`);

    await bot.editMessageText("🔄 Mendaftarkan akun ke StackBlitz...", {
      chat_id: chatId,
      message_id: statusMessage.message_id,
    });
    const registrationMessage = await registerUser(email, username);
    console.log(`✓ Account registered on StackBlitz`);

    await bot.editMessageText("🔍 Menunggu email verifikasi...", {
      chat_id: chatId,
      message_id: statusMessage.message_id,
    });
    const messageId = await fetchVerificationEmail(token);
    console.log(`✓ Verification email received, ID: ${messageId}`);

    await bot.editMessageText("🔗 Mengekstrak link verifikasi...", {
      chat_id: chatId,
      message_id: statusMessage.message_id,
    });
    const verificationLink = await extractVerificationLink(token, messageId);
    console.log(`✓ Verification link extracted`);

    await bot.editMessageText("🔄 Memverifikasi akun...", {
      chat_id: chatId,
      message_id: statusMessage.message_id,
    });
    await verifyAccount(verificationLink, chatId);
    console.log(`✓ Account verified successfully`);

    saveAccountToFile(email, username, userDataTemplate.password);
    console.log(`✓ Account details saved to file`);

    const finalMessage = `🎉 Akun berhasil dibuat!🎉\n
📋 Detail Akun:
📧 Email: ${email}
👤 Username: ${username}
🔑 Password: ${userDataTemplate.password}

✨ Status: Terverifikasi
🤖 BY: @TerminateX`;

    await bot.editMessageText(finalMessage, {
      chat_id: chatId,
      message_id: statusMessage.message_id,
    });
    console.log("Account creation process completed successfully");
  } catch (error) {
    console.error(`❌ Error in account creation: ${error.message}`);
    bot.sendMessage(chatId, `❌ Gagal membuat akun:\n${error.message}`);
  }
}
// **Bot Commands**
bot.onText(/\/create/, (msg) => {
  const chatId = msg.chat.id;
  // bot.sendMessage(chatId, "Memulai proses pembuatan akun...");
  createAccountAndSendToTelegram(chatId);
});
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Selamat datang di bot pembuat akun StackBlitz!\nKetik /create untuk membuat akun baru."
  );
});
bot.on("polling_error", (error) => {
  console.error(error);
});
bot.on("webhook_error", (error) => {
  console.error(error);
});
// bot.on("message", (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, "Maaf, perintah tidak dikenali.");
// });
