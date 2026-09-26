import { GoogleGenAI } from "@google/genai";

// Initialize the SDK with API key from environment variable
const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn("[Gemini] GEMINI_API_KEY is not defined in environment variables");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export interface AIComplaintAnalysis {
    title: string;
    category: "plumbing" | "electrical" | "cleaning" | "security" | "parking" | "lift" | "water" | "noise" | "maintenance" | "other";
    priority: "low" | "medium" | "high" | "urgent";
    requiredSkill: "plumber" | "electrician" | "cleaner" | "security" | "gardener" | "receptionist" | "maintenance" | "other";
    department: string;
    reasoning: string;
    estimatedDurationHours: number;
    urgencyKeywords: string[];
}

export const analyzeComplaintWithGemini = async (
    description: string,
    existingTitle?: string
): Promise<AIComplaintAnalysis> => {
    const defaultFallback: AIComplaintAnalysis = fallbackAnalyzeComplaint(description, existingTitle);

    try {
        const ai = getGeminiClient();
        if (!ai) {
            return defaultFallback;
        }

        const prompt = `You are an AI Facility & Property Operations Specialist for SmartResidence apartment management system.
Analyze the following resident complaint description and return a strictly valid JSON object.

Resident Complaint:
"${description}"

${existingTitle ? `Original Title Provided: "${existingTitle}"` : ""}

Classify and extract all details according to these strict requirements:
1. "title": A clear, concise, professional summary title (max 8-10 words).
2. "category": Must be strictly ONE of: ["plumbing", "electrical", "cleaning", "security", "parking", "lift", "water", "noise", "maintenance", "other"].
3. "priority": Must be strictly ONE of: ["low", "medium", "high", "urgent"].
   - "urgent": Immediate hazard, gas leak, active major flood, fire risk, lift stuck with people, total power outage.
   - "high": Water leakage impacting daily life, AC breakdown in extreme heat, security lock broken, lift failure.
   - "medium": Standard maintenance, minor leak, noisy fan, slow drain, flickering light.
   - "low": Aesthetic defect, minor paint scratch, general inquiry, non-urgent cleaning.
4. "requiredSkill": Must be strictly ONE of: ["plumber", "electrician", "cleaner", "security", "gardener", "receptionist", "maintenance", "other"].
5. "department": Matching department name (e.g., "Plumbing Department", "Electrical Maintenance", "Sanitation & Housekeeping", "Security Operations", "General Facility").
6. "reasoning": 1-2 sentence concise explanation of why this category, priority, and skill were chosen.
7. "estimatedDurationHours": Realistic number of hours to fix (e.g. 0.5, 1, 1.5, 2, 3, 4).
8. "urgencyKeywords": Array of critical keywords detected in the complaint description.

Return ONLY raw JSON with NO markdown formatting, NO backticks, NO extra commentary.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const text = response.text || "";
        // Clean out possible markdown code blocks ```json ... ```
        const cleanedText = text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleanedText);

        const validCategories = ["plumbing", "electrical", "cleaning", "security", "parking", "lift", "water", "noise", "maintenance", "other"];
        const validPriorities = ["low", "medium", "high", "urgent"];
        const validSkills = ["plumber", "electrician", "cleaner", "security", "gardener", "receptionist", "maintenance", "other"];

        return {
            title: parsed.title || defaultFallback.title,
            category: validCategories.includes(parsed.category?.toLowerCase()) ? parsed.category.toLowerCase() : defaultFallback.category,
            priority: validPriorities.includes(parsed.priority?.toLowerCase()) ? parsed.priority.toLowerCase() : defaultFallback.priority,
            requiredSkill: validSkills.includes(parsed.requiredSkill?.toLowerCase()) ? parsed.requiredSkill.toLowerCase() : defaultFallback.requiredSkill,
            department: parsed.department || defaultFallback.department,
            reasoning: parsed.reasoning || defaultFallback.reasoning,
            estimatedDurationHours: Number(parsed.estimatedDurationHours) || 1,
            urgencyKeywords: Array.isArray(parsed.urgencyKeywords) ? parsed.urgencyKeywords : [],
        };
    } catch (error) {
        console.error("[Gemini AI Error]", error);
        return defaultFallback;
    }
};

// Heuristic fallback in case of offline/network/key issues
function fallbackAnalyzeComplaint(description: string, existingTitle?: string): AIComplaintAnalysis {
    const text = description.toLowerCase();

    let category: AIComplaintAnalysis["category"] = "maintenance";
    let requiredSkill: AIComplaintAnalysis["requiredSkill"] = "maintenance";
    let department = "General Facility Maintenance";
    let priority: AIComplaintAnalysis["priority"] = "medium";
    let reasoning = "Determined based on description keyword patterns.";
    const urgencyKeywords: string[] = [];

    if (text.includes("water") || text.includes("leak") || text.includes("pipe") || text.includes("tap") || text.includes("flush") || text.includes("sink") || text.includes("drain") || text.includes("faucet") || text.includes("toilet") || text.includes("geyser")) {
        category = "plumbing";
        requiredSkill = "plumber";
        department = "Plumbing Department";
        if (text.includes("burst") || text.includes("flood") || text.includes("overflow") || text.includes("heavy leak")) {
            priority = "urgent";
            reasoning = "Severe water leakage or flooding risk detected.";
            urgencyKeywords.push("flood", "burst", "overflow");
        } else {
            priority = "medium";
        }
    } else if (text.includes("electric") || text.includes("power") || text.includes("spark") || text.includes("wire") || text.includes("switch") || text.includes("short circuit") || text.includes("light") || text.includes("socket") || text.includes("fan") || text.includes("mcb")) {
        category = "electrical";
        requiredSkill = "electrician";
        department = "Electrical Department";
        if (text.includes("spark") || text.includes("fire") || text.includes("shock") || text.includes("short circuit") || text.includes("smoke")) {
            priority = "urgent";
            reasoning = "High risk electrical hazard / sparking detected.";
            urgencyKeywords.push("spark", "shock", "fire", "smoke");
        } else {
            priority = "high";
        }
    } else if (text.includes("clean") || text.includes("garbage") || text.includes("trash") || text.includes("dust") || text.includes("smell") || text.includes("dirty") || text.includes("pest") || text.includes("cockroach")) {
        category = "cleaning";
        requiredSkill = "cleaner";
        department = "Housekeeping & Sanitation";
        priority = "low";
        reasoning = "Sanitation and housekeeping request.";
    } else if (text.includes("guard") || text.includes("theft") || text.includes("gate") || text.includes("trespass") || text.includes("cctv") || text.includes("lock") || text.includes("security")) {
        category = "security";
        requiredSkill = "security";
        department = "Security Operations";
        priority = text.includes("theft") || text.includes("break") ? "urgent" : "high";
        reasoning = "Security or access control issue.";
    } else if (text.includes("lift") || text.includes("elevator")) {
        category = "lift";
        requiredSkill = "maintenance";
        department = "Elevator & Lift Maintenance";
        priority = text.includes("stuck") || text.includes("trapped") ? "urgent" : "high";
        reasoning = "Elevator operational defect.";
    }

    const title = existingTitle && existingTitle.trim().length > 0 
        ? existingTitle 
        : description.slice(0, 60).replace(/\n/g, " ") + (description.length > 60 ? "..." : "");

    return {
        title,
        category,
        priority,
        requiredSkill,
        department,
        reasoning,
        estimatedDurationHours: priority === "urgent" ? 0.5 : 1.5,
        urgencyKeywords,
    };
}
