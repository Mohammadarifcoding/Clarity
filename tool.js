import OpenAI from "openai";
import * as dotenv from "dotenv";
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { resolve } from "path";
import { existsSync } from "fs";

dotenv.config();
const client = new OpenAI();

function checkFile(filePath) {
  const fullPath = resolve(filePath);

  if (!existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }

  return fullPath;
}

function readFile(path) {
  try {
    const file = checkFile(path);

    if (!existsSync(file)) {
      return {
        status: "error",
        action: "read_file",
        message: "File not found",
      };
    }

    const content = readFileSync(file, "utf-8");
    return {
      status: "success",
      action: "read_file",
      path: file,
      content: content,
    };
  } catch (error) {
    return { status: "error", action: "read_file", message: error.message };
  }
}

const tools = [
  {
    type: "function",
    name: "read_file",
    description: "Read the contents of a file inside the sandbox workspace.",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Relative file path inside the workspace.",
        },
      },
      required: ["path"],
    },
  },
];

const toolsRegistry = {
  read_file: readFile,
};

const systemMessage = `
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
`;

async function getResponse(filenames, changes) {
  let messages = [
    {
      role: "system",
      content: systemMessage,
    },
    {
      role: "user",
      content: `The files are changed in ${filenames}. The differ are ${changes}`,
    },
  ];

  let response = await client.responses.create({
    model: "gpt-4o-mini",
    tools: tools,
    input: messages,
    max_output_tokens: 1024,
  });

  // Process tool calls if present
  for (const block of response.output) {
    if (block.type === "function_call") {
      const toolName = block.name;
      const toolInput = block.arguments;

      if (toolsRegistry[toolName]) {
        const result = toolsRegistry[toolName](toolInput.path);
        console.log("calling tool", result);
        messages.push({
          role: "system",
          content: `"Tool output from ${item.name} : ${result}"`,
        });
      }
    }
  }

  // Get final response
  const finalResponse = await client.responses.create({
    model: "gpt-4o-mini",
    max_output_tokens: 1024,
    input: messages,
  });

  return finalResponse.output_text;
}

function getFileNames() {
  try {
    const output = execSync("git diff --name-only", {
      encoding: "utf-8",
    });

    const files = output
      .trim()
      .split("\n")
      .filter((f) => f.length > 0);
    const existingFiles = files.map((f) => checkFile(f));
    return existingFiles.join(", ");
  } catch (error) {
    console.error("Error getting file names:", error.message);
    process.exit(1);
  }
}

function getDiffer() {
  try {
    const output = execSync("git diff", {
      encoding: "utf-8",
    });

    return output;
  } catch (error) {
    console.error("Error getting diff:", error.message);
    process.exit(1);
  }
}

async function main() {
  try {
    const differ = getDiffer();
    const files = getFileNames();
    const result = await getResponse(files, differ);
    console.log(result);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
