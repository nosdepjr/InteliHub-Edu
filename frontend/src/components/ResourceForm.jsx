import { useState, useEffect } from "react";
import { createResource, updateResource, smartAssist } from "../services/api";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

/**
 * Normaliza tags vindas da API
 * Aceita:
 *  - array
 *  - string JSON
 *  - string simples
 */
function normalizeTags(tags) {
  if (!tags) return "";

  // já é array
  if (Array.isArray(tags)) {
    return tags.join(", ");
  }

  // string (pode ser JSON)
  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) {
        return parsed.join(", ");
      }
    } catch {
      // string comum
      return tags;
    }
  }

  return "";
}

export default function ResourceForm({ initialData = null, isEdit = false }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    type: initialData?.type ?? "Video",
    url: initialData?.url ?? "",
    tags: normalizeTags(initialData?.tags),
  });

  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState("");

  // Atualiza form quando initialData muda (edição)
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title ?? "",
        description: initialData.description ?? "",
        type: initialData.type ?? "Video",
        url: initialData.url ?? "",
        tags: normalizeTags(initialData.tags),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSmartAssist = async () => {
    if (!form.title || !form.type) {
      setError("Preencha título e tipo antes de usar IA.");
      return;
    }

    try {
      setLoadingAI(true);
      setError("");

      const response = await smartAssist({
        title: form.title,
        type: form.type,
      });

      setForm((prev) => ({
        ...prev,
        description: response.data.description ?? "",
        tags: Array.isArray(response.data.tags)
          ? response.data.tags.join(", ")
          : "",
      }));
    } catch {
      setError("Erro ao gerar descrição com IA.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };

    try {
      if (isEdit) {
        await updateResource(initialData.id, payload);
      } else {
        await createResource(payload);
      }
      navigate("/");
    } catch {
      setError("Erro ao salvar recurso.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Título"
        value={form.title}
        onChange={handleChange}
        required
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
      >
        <option value="Video">Vídeo</option>
        <option value="PDF">PDF</option>
        <option value="Link">Link</option>
      </select>

      <button
        type="button"
        className="secondary"
        onClick={handleSmartAssist}
      >
        Gerar Descrição com IA
      </button>

      {loadingAI && <Loader />}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <textarea
        name="description"
        placeholder="Descrição"
        value={form.description}
        onChange={handleChange}
      />

      <input
        name="url"
        placeholder="URL"
        value={form.url}
        onChange={handleChange}
        required
      />

      <input
        name="tags"
        placeholder="Tags separadas por vírgula"
        value={form.tags}
        onChange={handleChange}
      />

      <div className="form-actions">
        <button
          type="button"
          className="secondary"
          onClick={() => navigate("/")}
        >
          ← Voltar
        </button>

        <button
          type="submit"
          className="primary"
        >
          {isEdit ? "Atualizar" : "Criar"}
        </button>
      </div>
    </form>
  );
}
