export default function RecuperarStep2({ onSwitch }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleNext = (e) => {
    e.preventDefault();
    if (!code) return setError("Ingresá el código recibido");
    // Simulación verificación
    onSwitch("recuperar3"); // ⚠ corregido
  };

  return (
    <form onSubmit={handleNext} className="formCuenta">
      <label>Código</label>
      <input value={code} onChange={(e) => setCode(e.target.value)} />
      {error && <p className="advertencia">{error}</p>}
      <button type="submit">Siguiente</button>
      <p onClick={() => onSwitch("login")}>Volver al login</p>
    </form>
  );
}
