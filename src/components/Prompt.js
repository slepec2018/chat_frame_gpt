import { useState } from "react";

export default function Prompt({onSubmit}) {
  const [promptInput, setPromptInput] = useState("");

  return (
    <textarea
      value={promptInput}
      rows="4"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onSubmit(promptInput);
          setPromptInput("");
        }
      }}
      className="w-full p-2.5 text-sm text-gray-900 bg-slate-200 rounded-lg border-gray-300"
      placeholder="Write your promt there..."
      onChange={(e) => setPromptInput(e.target.value)}
    />
  );
}