import { useState } from "react";

export function TaskImage({
  taskId,
  initialImage,
}: {
  taskId: number;
  initialImage?: string;
}) {
  const [image, setImage] = useState<string | null>(initialImage ?? null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    const res = await fetch(`/api/tasks/${taskId}/image`, { method: "POST" });
    const data = await res.json();
    setImage(data.imageUrl);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button onClick={generateImage} disabled={loading}>
        {loading ? "Generating..." : "Generate Image"}
      </button>
      {image && (
        <img
          src={image}
          alt="Task illustration"
          className="w-24 h-24 object-cover rounded"
        />
      )}
    </div>
  );
}
