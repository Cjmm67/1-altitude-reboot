// Defensive JSON parsing for agent responses.
// Handles markdown fences, leading/trailing whitespace, and partial output.

export function parseAgentJSON(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty or invalid response");
  }

  // Strip markdown code fences if present
  let cleaned = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  // If the response starts with text before the JSON, try to find the first {
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON object found in response");
  }

  // Extract just the JSON portion
  cleaned = cleaned.slice(firstBrace, lastBrace + 1);

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Try a second pass — sometimes the model includes trailing commas
    const repaired = cleaned
      .replace(/,(\s*[}\]])/g, "$1") // remove trailing commas
      .replace(/[\u201C\u201D]/g, '"') // smart quotes → straight
      .replace(/[\u2018\u2019]/g, "'");
    try {
      return JSON.parse(repaired);
    } catch (err2) {
      throw new Error(`JSON parse failed: ${err.message}`);
    }
  }
}

// Extract text content from Anthropic API response, filtering by block type.
export function extractTextFromAnthropicResponse(data) {
  if (!data || !Array.isArray(data.content)) {
    throw new Error("Invalid Anthropic API response shape");
  }

  return data.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

// Extract any tool_use / tool_result blocks for transparency display
export function extractToolActivity(data) {
  if (!data || !Array.isArray(data.content)) return [];

  return data.content
    .filter((block) => block.type === "tool_use" || block.type === "server_tool_use")
    .map((block) => ({
      tool: block.name || "web_search",
      input: block.input || {},
    }));
}
