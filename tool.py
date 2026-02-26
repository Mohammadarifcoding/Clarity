from openai import OpenAI
from dotenv import load_dotenv
import subprocess
from pathlib import Path
import sys
import json
from pathlib import Path

load_dotenv()
client = OpenAI()


def check_file(file_path):
    full_path = (Path.cwd() / file_path).resolve()

    if not full_path.exists():
        raise FileNotFoundError(f"File not found: {full_path}")

    return full_path


def read_file(path):
    try:
        file = check_file(path)
        if not file.exists():
            return {
                "status": "error",
                "action": "read_file",
                "message": "File not found",
            }

        content = file.read_text(encoding="utf-8")
        return {
            "status": "success",
            "action": "read_file",
            "path": str(file),
            "content": content,
        }
    except Exception as e:
        return {"status": "error", "action": "read_file", "message": str(e)}


# print(read_file("src/app/(root)/dashboard/page.tsx"))

tools = [
    {
        "type": "function",
        "name": "read_file",
        "description": "Read the contents of a file inside the sandbox workspace.",
        "parameters": {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Relative file path inside the workspace.",
                }
            },
            "required": ["path"],
        },
    }
]

tools_registry = {
    "read_file": read_file,
}


system_message = """
You are a strict Git commit message generator and tool-aware AI.

You will receive:
- The file names
- The code changes

Your task:
Generate a professional Conventional Commit message.

Rules:
- Output only the commit message.
- Do not include quotes,extra text , explanations.
- Follow this format strictly:
- Do not give multiple commits. Just a single one.

Format:
type(scope): short summary

Where:
- type must be one of: feat, fix, refactor, chore, build, docs, style, test, perf, ci
- scope should represent the main module, feature, or file name (lowercase, no spaces)
- summary must be concise, clear, and under 72 characters
- Use present tense
- Do not end with a period

Additional instructions for tool calls:
- If generating the commit requires analyzing the code or running a helper tool, call the appropriate tool.
- After calling a tool, include only the result relevant for generating the commit message.
- Do not produce any text besides the commit message, even after using a tool.

Guidance:
- If the change is small or internal, prefer "chore" or "refactor".
- If it introduces new functionality, use "feat".
- If it fixes a bug, use "fix".

Examples:

1. feat(ai): integrate OpenAI SDK for transcript processing
2. chore(env): update pip and install required dependencies
3. chore(env): configure Python virtual environment for isolation
4. fix(env): resolve pip issue in Git Bash using python -m pip
"""


def get_response(filenames, changes):
    messages = [
        {
            "role": "system",
            "content": system_message,
        },
        {
            "role": "user",
            "content": f"The files are changed in {filenames}. The differ are {changes}",
        },
    ]
    response = client.responses.create(
        model="gpt-4o-mini",
        tool_choice="required",
        tools=tools,
        input=messages,
    )
    for item in response.output:
        if item.type == "function_call":
            result = tools_registry[item.name](**json.loads(item.arguments))
            print("calling tool", result)
            messages.append(
                {
                    "role": "system",
                    "content": f"Tool output from {item.name} : {result}",
                }
            )

    final = client.responses.create(
        model="gpt-4o-mini",
        input=messages,
    )
    return final.output_text


# print(get_response())

# print(f"The files are: " + ", ".join(["page/data.jsx", "page/data.tsx"])"))


def getFileNames():
    data = subprocess.run(
        ["git", "diff", "--name-only"],
        text=True,
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    files = data.stdout.strip().splitlines()
    existing_files = [str(check_file((f))) for f in files]
    return ", ".join(existing_files)


def getDiffer():
    data = subprocess.run(
        ["git", "diff"],
        text=True,
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    return data.stdout


# print(getDiffer())


# print(getFileNames())


def main():
    differ = getDiffer()
    files = getFileNames()
    result = get_response(filenames=files, changes=differ)
    print(result)


main()

# Correct relative path (no leading slash)
# files = ["src/app/(root)/dashboard/page.tsx"]
# print(getGit_value(files))


# # print(data.returncode)
