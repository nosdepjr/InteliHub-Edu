import { useEffect, useState } from "react";
import { getResources, deleteResource } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ResourceList() {
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  const size = 5;

  const fetchResources = async () => {
    try {
      setError("");
      const response = await getResources(page, size);
      setResources(response.data.items);
      setTotal(response.data.total);
    } catch {
      setError("Erro ao carregar recursos.");
    }
  };

  useEffect(() => {
    fetchResources();
  }, [page]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este recurso?"
    );

    if (!confirmDelete) return;

    try {
      await deleteResource(id);
      fetchResources();
    } catch {
      setError("Erro ao excluir recurso.");
    }
  };

  const totalPages = Math.ceil(total / size) || 1;

  return (
    <div>
      <div style={{ marginBottom: "20px", textAlign: "right" }}>
        <button
          className="secondary"
          onClick={() => navigate("/create")}
        >
          + Novo Recurso
        </button>
      </div>

      {error && (
        <p style={{ color: "#ef4444", marginBottom: "15px" }}>
          {error}
        </p>
      )}

      {resources.length === 0 ? (
        <p style={{ textAlign: "center", opacity: 0.7 }}>
          Nenhum recurso cadastrado.
        </p>
      ) : (
        resources.map((res) => (
          <div key={res.id} className="resource-card">
            <h3>{res.title}</h3>

            <p style={{ margin: "8px 0" }}>
              {res.description || "Sem descrição."}
            </p>

            <p>
              <strong>Tipo:</strong> {res.type}
            </p>

            <p>
              <strong>Tags:</strong>{" "}
              {Array.isArray(res.tags)
              ? res.tags.join(", ")
              : res.tags || "Nenhuma"}
            </p>

            <div className="resource-actions">
              <button
                className="secondary"
                onClick={() => navigate(`/edit/${res.id}`)}
              >
                Editar
              </button>

              <button
                className="danger"
                onClick={() => handleDelete(res.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))
      )}

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Anterior
        </button>

        <span>
          Página {page} de {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
