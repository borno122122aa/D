import subprocess

commands = [
    "sudo su",
    "apt install nodejs",
    "apt install unzip",
    "unzip DRAGON.zip",
    "cd D/DRAGON && pip install telebot",
    "cd D/DRAGON && chmod +x *",
    "cd D/DRAGON && python3 x.py"
]

def run_commands(cmd_list):
    for cmd in cmd_list:
        try:
            subprocess.run(cmd, shell=True, check=True)
            print(f"Successfully ran: {cmd}")
        except subprocess.CalledProcessError as e:
            print(f"Error running: {cmd}\n{e}")
            break

if __name__ == "__main__":
    run_commands(commands)
  
