import os
import random
import discord
from discord.ext import commands

intents = discord.Intents.all()
TOKEN=os.getenv("DISCORD_TOKEN")
bot=commands.Bot(command_prefix="!", intents=intents)
invites=dict()

@bot.event
async def on_ready():
    print(f"Connected!\nCurrently active in {len(bot.guilds)} guilds")
    for guild in bot.guilds:
        invites[guild.id] = await guild.invites()

@bot.event
async def on_guild_join(guild):
    categ = await guild.create_category("Bots")
    try:
        if "PIL_Bot" not in [channel.name for channel in guild.channels]:
            await guild.create_text_channel("PIL Bot", slowmode_delay = 30, category = categ)
    except Exception as e:
        print(f"Bot error: {e}")

@bot.event
async def on_member_join(member):
    after = await member.guild.invites()
    before = invites[member.guild]
    invitation = [inv for inv in before if inv not in after]
    log = discord.utils.get(member.guild.channels, name="PIL Bot")
    await log.send(f"{member.name} joined the server using invite code {invitation.code}")
