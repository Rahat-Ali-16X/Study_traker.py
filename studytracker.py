"""
╔══════════════════════════════════════════════════════════╗
║         PERSONAL STUDY TRACKER - Python Script          ║
║         For Class 10 UP Board Students                   ║
║         Topics: Python Programming & AI Basics           ║
╚══════════════════════════════════════════════════════════╝

HOW TO RUN:
    python study_tracker.py

REQUIREMENTS:
    - Python 3.7 or above
    - No extra libraries needed (only built-in modules)
"""

import time
import json
import os
import random
from datetime import datetime, date

# ─────────────────────────────────────────
#  FILE WHERE ALL DATA IS SAVED
# ─────────────────────────────────────────
DATA_FILE = "study_data.json"


# ─────────────────────────────────────────
#  MOTIVATIONAL QUOTES
# ─────────────────────────────────────────
QUOTES = [
    ("Padhai ka koi shortcut nahi hota, mehnat hi raasta hai.", "Unknown"),
    ("The expert in anything was once a beginner.", "Helen Hayes"),
    ("Code karo, galti karo, seekho — yahi hai developer ka raasta.", "Unknown"),
    ("An investment in knowledge pays the best interest.", "Benjamin Franklin"),
    ("Ek din ka padhna ek kadam aage badhna hai.", "Unknown"),
    ("First, solve the problem. Then, write the code.", "John Johnson"),
    ("Learning never exhausts the mind.", "Leonardo da Vinci"),
    ("Sapne wo nahi jo sone par aate hain, sapne wo hain jo sone nahi dete.", "APJ Abdul Kalam"),
]


# ─────────────────────────────────────────
#  8-WEEK LEARNING PLAN
# ─────────────────────────────────────────
LEARNING_PLAN = {
    "Python Track (Weeks 1-4)": {
        "Week 1 - Python Basics": [
            "Variables, Data Types (int, float, str, bool)",
            "Input / Output (input(), print())",
            "Basic Operators (+, -, *, /, %, //)",
            "Type Conversion (int(), str(), float())",
        ],
        "Week 2 - Control Flow": [
            "if / elif / else conditions",
            "for loop with range()",
            "while loop",
            "break, continue, pass",
        ],
        "Week 3 - Functions & Collections": [
            "Defining functions (def keyword)",
            "Parameters and return values",
            "Lists, Tuples, Dictionaries, Sets",
            "List slicing and methods",
        ],
        "Week 4 - Intermediate Python": [
            "File Handling (open, read, write)",
            "Exception Handling (try/except)",
            "Modules: math, random, datetime",
            "Basic OOP: Classes and Objects",
        ],
    },
    "AI Track (Weeks 5-8)": {
        "Week 5 - AI Foundations": [
            "What is Artificial Intelligence?",
            "Types: Narrow AI vs General AI",
            "Machine Learning basics",
            "Supervised vs Unsupervised Learning",
        ],
        "Week 6 - Python for Data": [
            "NumPy arrays and operations",
            "Pandas: DataFrames and CSV reading",
            "Matplotlib: basic graphs/charts",
            "Data cleaning basics",
        ],
        "Week 7 - Intro to ML": [
            "What is a model? Training vs Testing",
            "scikit-learn: fit() and predict()",
            "Linear Regression example",
            "Accuracy and evaluation",
        ],
        "Week 8 - Mini Projects": [
            "Project 1: Student Grade Calculator (Python)",
            "Project 2: Simple Chatbot using if/else",
            "Project 3: Data Visualizer with Matplotlib",
            "Project 4: Number Predictor using ML",
        ],
    },
}


# ─────────────────────────────────────────────────────
#  DATA LOADING AND SAVING (reads/writes JSON file)
# ─────────────────────────────────────────────────────
def load_data():
    """Load saved data from JSON file. If no file exists, create fresh data."""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    # Default fresh data structure
    return {
        "goals": [],
        "sessions": [],
        "streak": 0,
        "last_study_date": "",
        "total_seconds": 0,
    }


def save_data(data):
    """Save all data to JSON file so it persists between runs."""
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)


# ─────────────────────────────────────────
#  HELPER: CLEAR SCREEN
# ─────────────────────────────────────────
def clear():
    os.system("cls" if os.name == "nt" else "clear")


# ─────────────────────────────────────────
#  HELPER: FORMAT SECONDS TO HH:MM:SS
# ─────────────────────────────────────────
def format_time(seconds):
    h = seconds // 3600
    m = (seconds % 3600) // 60
    s = seconds % 60
    return f"{h:02d}:{m:02d}:{s:02d}"


# ─────────────────────────────────────────
#  HELPER: PRINT DIVIDER LINE
# ─────────────────────────────────────────
def divider(char="─", width=55):
    print(char * width)


# ─────────────────────────────────────────────────────
#  FEATURE 1 — SHOW DAILY QUOTE
# ─────────────────────────────────────────────────────
def show_quote():
    quote, author = random.choice(QUOTES)
    print()
    divider("═")
    print("  💬 TODAY'S MOTIVATION")
    divider()
    print(f'  "{quote}"')
    print(f"                          — {author}")
    divider("═")
    print()


# ─────────────────────────────────────────────────────
#  FEATURE 2 — STUDY TIMER
#  Counts time while you study one subject.
#  Saves the session when you stop.
# ─────────────────────────────────────────────────────
def study_timer(data):
    clear()
    print("\n  ⏱  STUDY TIMER")
    divider()
    print("  Choose your subject:")
    subjects = ["Python", "AI/ML", "Maths", "Physics", "English", "Other"]
    for i, s in enumerate(subjects, 1):
        print(f"  {i}. {s}")

    choice = input("\n  Enter number (default=1): ").strip()
    subject = subjects[int(choice) - 1] if choice.isdigit() and 1 <= int(choice) <= len(subjects) else subjects[0]

    # Ask for optional goal duration
    goal_input = input("  Set timer goal in minutes (press Enter to skip): ").strip()
    goal_seconds = int(goal_input) * 60 if goal_input.isdigit() else None

    print(f"\n  ▶  Studying: {subject}")
    if goal_seconds:
        print(f"  🎯 Goal: {goal_input} minutes")
    print("  Press ENTER to stop the timer...\n")

    start = time.time()

    # Show live countdown
    try:
        import threading

        stop_flag = [False]

        def wait_for_input():
            input()
            stop_flag[0] = True

        t = threading.Thread(target=wait_for_input, daemon=True)
        t.start()

        while not stop_flag[0]:
            elapsed = int(time.time() - start)
            line = f"\r  ⏱  {format_time(elapsed)}"
            if goal_seconds:
                remaining = max(0, goal_seconds - elapsed)
                pct = min(100, int((elapsed / goal_seconds) * 100))
                bar = "█" * (pct // 5) + "░" * (20 - pct // 5)
                line += f"  [{bar}] {pct}%  Remaining: {format_time(remaining)}"
            print(line, end="", flush=True)
            time.sleep(1)

    except Exception:
        # Fallback if threading fails (some environments)
        input()

    elapsed = int(time.time() - start)
    print(f"\n\n  ✅ Session complete! Time studied: {format_time(elapsed)}")

    # Save session
    session = {
        "subject": subject,
        "seconds": elapsed,
        "date": str(date.today()),
        "time": datetime.now().strftime("%I:%M %p"),
    }
    data["sessions"].append(session)
    data["total_seconds"] = data.get("total_seconds", 0) + elapsed

    # Update streak
    today = str(date.today())
    if data.get("last_study_date") != today:
        data["streak"] = data.get("streak", 0) + 1
        data["last_study_date"] = today
        print(f"  🔥 Streak updated: {data['streak']} days!")

    save_data(data)
    input("\n  Press Enter to go back...")


# ─────────────────────────────────────────────────────
#  FEATURE 3 — GOALS MANAGER
#  Add goals, mark complete, delete, view all.
# ─────────────────────────────────────────────────────
def manage_goals(data):
    while True:
        clear()
        goals = data.get("goals", [])
        pending = [g for g in goals if not g["done"]]
        done = [g for g in goals if g["done"]]

        print("\n  🎯 GOALS MANAGER")
        divider()
        print(f"  Pending: {len(pending)}   Completed: {len(done)}   Total: {len(goals)}")
        divider()

        if not goals:
            print("  No goals yet. Add your first goal!\n")
        else:
            if pending:
                print("  📋 PENDING:")
                for i, g in enumerate(pending, 1):
                    print(f"  {i}. [ ] {g['text']}  ({g['subject']})")
            if done:
                print("\n  ✅ COMPLETED:")
                for g in done:
                    print(f"      [✓] {g['text']}  ({g['subject']})")

        print("\n  OPTIONS:")
        print("  A - Add new goal")
        print("  C - Mark a goal complete")
        print("  D - Delete a goal")
        print("  B - Back to main menu")

        choice = input("\n  Enter choice: ").strip().upper()

        if choice == "A":
            text = input("  Goal description: ").strip()
            if not text:
                continue
            print("  Subject: 1.Python  2.AI/ML  3.Maths  4.Physics  5.English  6.Other")
            sub_choice = input("  Pick (1-6): ").strip()
            subjects = ["Python", "AI/ML", "Maths", "Physics", "English", "Other"]
            subject = subjects[int(sub_choice) - 1] if sub_choice.isdigit() and 1 <= int(sub_choice) <= 6 else "Other"
            data["goals"].append({
                "id": int(time.time()),
                "text": text,
                "subject": subject,
                "done": False,
                "created": str(date.today()),
            })
            save_data(data)
            print("  ✅ Goal added!")
            time.sleep(1)

        elif choice == "C":
            if not pending:
                print("  No pending goals.")
                time.sleep(1)
                continue
            num = input("  Enter goal number to complete: ").strip()
            if num.isdigit() and 1 <= int(num) <= len(pending):
                target_id = pending[int(num) - 1]["id"]
                for g in data["goals"]:
                    if g["id"] == target_id:
                        g["done"] = True
                        break
                save_data(data)
                print("  🎉 Goal marked complete!")
                time.sleep(1)

        elif choice == "D":
            if not goals:
                continue
            print("  All goals:")
            for i, g in enumerate(goals, 1):
                status = "✓" if g["done"] else " "
                print(f"  {i}. [{status}] {g['text']}")
            num = input("  Enter number to delete: ").strip()
            if num.isdigit() and 1 <= int(num) <= len(goals):
                removed = data["goals"].pop(int(num) - 1)
                save_data(data)
                print(f"  🗑  Deleted: {removed['text']}")
                time.sleep(1)

        elif choice == "B":
            break


# ─────────────────────────────────────────────────────
#  FEATURE 4 — VIEW LEARNING PLAN
# ─────────────────────────────────────────────────────
def view_learning_plan():
    clear()
    print("\n  📚 8-WEEK LEARNING PLAN")
    print("  Class 10 | Python + AI/ML Track")
    divider("═")

    for track, weeks in LEARNING_PLAN.items():
        print(f"\n  🔷 {track}")
        divider()
        for week, tasks in weeks.items():
            print(f"\n  📅 {week}")
            for task in tasks:
                print(f"      • {task}")

    divider("═")
    print("\n  💡 TIP: Focus on Python Track first, then AI Track.")
    print("  Practice coding DAILY — even 30 minutes is enough!\n")
    input("  Press Enter to go back...")


# ─────────────────────────────────────────────────────
#  FEATURE 5 — VIEW STATISTICS
# ─────────────────────────────────────────────────────
def view_stats(data):
    clear()
    sessions = data.get("sessions", [])
    goals = data.get("goals", [])
    total_sec = data.get("total_seconds", 0)
    streak = data.get("streak", 0)

    print("\n  📊 YOUR STUDY STATISTICS")
    divider("═")
    print(f"  ⏱  Total Study Time   : {format_time(total_sec)}")
    print(f"  🔥 Current Streak     : {streak} days")
    print(f"  ✅ Sessions Completed : {len(sessions)}")
    print(f"  🎯 Goals Done         : {len([g for g in goals if g['done']])}/{len(goals)}")

    # Subject breakdown
    subject_time = {}
    for s in sessions:
        subject_time[s["subject"]] = subject_time.get(s["subject"], 0) + s["seconds"]

    if subject_time:
        divider()
        print("  📌 TIME BY SUBJECT:")
        max_sec = max(subject_time.values())
        for subj, secs in sorted(subject_time.items(), key=lambda x: -x[1]):
            bar_len = int((secs / max_sec) * 25)
            bar = "█" * bar_len + "░" * (25 - bar_len)
            print(f"  {subj:<12} [{bar}] {format_time(secs)}")

    # Recent 5 sessions
    if sessions:
        divider()
        print("  🕐 RECENT SESSIONS (last 5):")
        for s in sessions[-5:][::-1]:
            print(f"  {s['date']} {s.get('time',''):<8} | {s['subject']:<10} | {format_time(s['seconds'])}")

    divider("═")
    input("\n  Press Enter to go back...")


# ─────────────────────────────────────────────────────
#  MAIN MENU
# ─────────────────────────────────────────────────────
def main():
    data = load_data()

    while True:
        clear()
        now = datetime.now()
        hour = now.hour
        greeting = "Good Morning 🌅" if hour < 12 else "Good Afternoon ☀️" if hour < 17 else "Good Evening 🌙"

        print()
        divider("═")
        print("       PERSONAL STUDY TRACKER")
        print("       Class 10 | Python & AI Track")
        divider("═")
        print(f"  {greeting}  |  {now.strftime('%d %b %Y, %I:%M %p')}")
        print(f"  🔥 Streak: {data.get('streak', 0)} days  |  ⏱  Total: {format_time(data.get('total_seconds', 0))}")
        divider()

        # Show quote on home screen
        q, a = random.choice(QUOTES)
        print(f'  💬 "{q[:60]}{"..." if len(q)>60 else ""}"')
        print(f"                 — {a}")

        divider()
        print("  MAIN MENU:")
        print("  1. ⏱  Start Study Timer")
        print("  2. 🎯  Manage Goals")
        print("  3. 📚  View Learning Plan")
        print("  4. 📊  View Statistics")
        print("  5. 💬  Show Motivational Quote")
        print("  6. 🚪  Exit")
        divider()

        choice = input("  Enter choice (1-6): ").strip()

        if choice == "1":
            study_timer(data)
        elif choice == "2":
            manage_goals(data)
        elif choice == "3":
            view_learning_plan()
        elif choice == "4":
            view_stats(data)
        elif choice == "5":
            clear()
            show_quote()
            input("  Press Enter to continue...")
        elif choice == "6":
            clear()
            print("\n  👋 Keep studying! Kal phir milenge.\n")
            break
        else:
            print("  ❌ Invalid choice. Try again.")
            time.sleep(1)


# ─────────────────────────────────────────
#  ENTRY POINT
# ─────────────────────────────────────────
if __name__ == "__main__":
    main()
    