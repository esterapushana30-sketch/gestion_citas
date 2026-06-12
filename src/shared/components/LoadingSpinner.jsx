export function LoadingSpinner({ message = "Cargando..." }) {
  return (
    <div className="loading-screen">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
}
