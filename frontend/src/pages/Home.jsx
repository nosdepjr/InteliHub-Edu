import ResourceList from "../components/ResourceList";

export default function Home() {
  return (
    <div className="container">
      <h1>InteliHub Edu</h1>
      <div className="card">
        <ResourceList />
      </div>
    </div>
  );
}