import ResourceForm from "../components/ResourceForm";

export default function CreateResource() {
  return (
    <div className="page-container">
      <h2 style={{ marginBottom: "20px" }}>Criar Recurso</h2>

      <div className="form-wrapper">
        <ResourceForm />
      </div>
    </div>
  );
}