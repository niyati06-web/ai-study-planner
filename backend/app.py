from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq

app = Flask(__name__)
CORS(app)

client = Groq(api_key="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")

@app.route('/test')
def test():
    return "Backend working!"

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    topic = data.get('topic')
    days = data.get('days')
    level = data.get('level')

    prompt = f"""Create a detailed {days}-day study plan for learning {topic}.
Level: {level}

Format exactly like this:

📚 STUDY PLAN: {topic.upper()}
⏱ Duration: {days} days | Level: {level.capitalize()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━

DAY 1: [Topic Name]
- Morning: [specific task]
- Afternoon: [specific task]
- Evening: [specific task]
- Resource: [free resource]
- Goal: [what you achieve today]

Do this for all {days} days. Then end with:

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 FINAL GOAL: [outcome]
💡 PRO TIP: [best advice]
🔗 TOP RESOURCES: [3 best free links]

Be specific, practical and motivating."""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2048
        )
        return jsonify({"plan": response.choices[0].message.content})
    except Exception as e:
        return jsonify({"plan": f"Error: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=False)