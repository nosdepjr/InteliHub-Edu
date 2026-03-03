import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getResourceById } from "../services/api";
import ResourceForm from "../components/ResourceForm";

export default function EditResource() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const response = await getResourceById(id);
      setData(response.data);
    };
    fetch();
  }, [id]);

  if (!data) return <p>Carregando...</p>;

  return (
  <div className="container">
    <h2>Editar Recurso</h2>
    <div className="card">
      <ResourceForm key={data.id} initialData={data} isEdit />
    </div>
  </div>
);
}
