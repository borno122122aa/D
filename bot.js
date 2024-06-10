const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace with your Telegram bot token
const token = '7298097512:AAEjkHECDbIVP8ZS1t5GP3-vNoY9aN8Z0Fs';

// Replace with your group or supergroup IDs
const CHANNEL1_ID = '@THE_ANON_69';
const CHANNEL2_ID = '@Method_hunter';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Dummy function to extract camera IPs from HTML content
const extractCameraIps = (htmlContent) => {
  // This is a simplified example. You need proper HTML parsing.
  return ["192.168.1.1:8080", "192.168.1.2:8080"];
};

// Function to get a random camera from a country
const getRandomCamera = async (countryCode) => {
  const url = `https://www.insecam.org/en/bycountry/${countryCode}/`;
  try {
    const response = await axios.get(url);
    const cameras = extractCameraIps(response.data);
    if (cameras.length > 0) {
      return cameras[Math.floor(Math.random() * cameras.length)];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  return null;
};

// Check if user is a member of required channels
const checkMembership = async (userId) => {
  try {
    const member1 = await bot.getChatMember(CHANNEL1_ID, userId);
    const member2 = await bot.getChatMember(CHANNEL2_ID, userId);
    return ['member', 'administrator', 'creator'].includes(member1.status) &&
           ['member', 'administrator', 'creator'].includes(member2.status);
  } catch (error) {
    console.error('Error checking membership:', error);
    return false;
  }
};

// Start command handler
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const isMember = await checkMembership(userId);
  if (isMember) {
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'ATTACK', callback_data: 'attack' }],
        ],
      },
    };
    bot.sendMessage(chatId, 'Welcome! Click ATTACK to choose a country.', opts);
  } else {
    bot.sendMessage(chatId, 'You must join @THE_ANON_69 and @Method_hunter to use this bot.');
  }
});

// Callback query handler
bot.on('callback_query', async (callbackQuery) => {
  const message = callbackQuery.message;
  const chatId = message.chat.id;
  const userId = callbackQuery.from.id;
  const data = callbackQuery.data;

  const isMember = await checkMembership(userId);
  if (!isMember) {
    bot.sendMessage(chatId, 'You must join @THE_ANON_69 and @Method_hunter to use this bot.');
    return;
  }

  if (data === 'attack') {
    const countryButtons = [
      [{ text: 'USA', callback_data: 'US' }],
      [{ text: 'Canada', callback_data: 'CA' }],
      [{ text: 'United Kingdom', callback_data: 'GB' }],
      [{ text: 'Bangladesh', callback_data: 'BD' }],
      // Add more countries as needed
    ];
    const opts = {
      reply_markup: {
        inline_keyboard: countryButtons,
      },
    };
    bot.sendMessage(chatId, 'Select a country:', opts);
  } else {
    if (data === 'BD') {
      bot.sendMessage(chatId, 'Access to Bangladesh CCTV cameras is blocked.');
    } else {
      const cameraIp = await getRandomCamera(data);
      if (cameraIp) {
        bot.sendMessage(chatId, `Random CCTV Camera from ${data}: ${cameraIp}`);
      } else {
        bot.sendMessage(chatId, 'No cameras found for this country.');
      }
    }
  }
});
