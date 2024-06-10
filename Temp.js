import os
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Updater, CommandHandler, CallbackContext
import requests
from bs4 import BeautifulSoup

# Load environment variables from .env file
load_dotenv()

# Telegram Bot Token
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')

def start(update: Update, context: CallbackContext) -> None:
    update.message.reply_text('Welcome to Temporary Email Bot! Use /generate to get a temporary email address.')

def generate_temp_email(update: Update, context: CallbackContext) -> None:
    # Scrape a temporary email website to get a temporary email address
    response = requests.get('https://temp-mail.org/en/')
    soup = BeautifulSoup(response.content, 'html.parser')
    email = soup.find('input', {'id': 'mail'}).get('value')
    update.message.reply_text(f'Your temporary email address is:\n{email}')

def main() -> None:
    updater = Updater(TELEGRAM_BOT_TOKEN)
    dispatcher = updater.dispatcher

    dispatcher.add_handler(CommandHandler("start", start))
    dispatcher.add_handler(CommandHandler("generate", generate_temp_email))

    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
