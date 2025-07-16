import discord
import os
import json
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv('TOKEN')
WEBHOOK_CHANNEL_ID = int(os.getenv('WEBHOOK_CHANNEL_ID'))
NOTIFICATION_CHANNEL_ID = int(os.getenv('NOTIFICATION_CHANNEL_ID'))
JSON_FOLDER = os.getenv('JSON_FOLDER')
ASSETS_FOLDER = os.getenv('ASSETS_FOLDER')

os.makedirs(JSON_FOLDER, exist_ok=True)
os.makedirs(ASSETS_FOLDER, exist_ok=True)

class TurboClient(discord.Client):
    async def on_ready(self):
        print(f'Logged in as {self.user}')

    async def on_message(self, message):
        if message.channel.id == WEBHOOK_CHANNEL_ID and message.webhook_id:
            for attachment in message.attachments:
                file_path = ''
                if attachment.filename.endswith('.json'):
                    file_path = os.path.join(JSON_FOLDER, attachment.filename)
                else:
                    file_path = os.path.join(ASSETS_FOLDER, attachment.filename)

                await attachment.save(file_path)
                print(f'Saved {attachment.filename} to {file_path}')

            notification_channel = self.get_channel(NOTIFICATION_CHANNEL_ID)
            if notification_channel:
                await notification_channel.send("Data received!")

intents = discord.Intents.default()
intents.messages = True
client = TurboClient(intents=intents)
client.run(TOKEN)

