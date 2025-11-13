import { useMemo } from "react";

export function DescriptionTask({ description }: { description?: string }) {
  const parsed = useMemo(() => {
    if (!description) return null;
    try {
      const cleaned = description
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }, [description]);

  if (!description) return null;

  if (!parsed)
    return (
      <pre className="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded break-words whitespace-pre-wrap">
        {description}
      </pre>
    );

  return (
    <div className="p-2 mt-2 bg-gray-50 rounded text-sm space-y-2">
      <p>
        <strong>Summary:</strong> {parsed.summary}
      </p>
      {parsed.steps?.length > 0 && (
        <>
          <strong>Steps:</strong>
          <ol className="list-decimal ml-5">
            {parsed.steps.map((s: string, i: number) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </>
      )}
      {parsed.risks?.length > 0 && (
        <>
          <strong>Risks:</strong>
          <ul className="list-disc ml-5">
            {parsed.risks.map((r: string, i: number) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </>
      )}
      <p>
        <strong>Estimate Hours:</strong> {parsed.estimateHours}
      </p>
      {parsed.tags?.length > 0 && (
        <p>
          <strong>Tags:</strong> {parsed.tags.join(", ")}
        </p>
      )}
    </div>
  );
}
