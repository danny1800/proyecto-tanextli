import { useState } from "react";
import Mascota, { ESTADOS } from "./Mascota";
import { useMascota } from "./useMascota";

// Hacia dónde pueden mirar las pupilas: [x, y]
const MIRADAS = {
  centro: [0, 0],
  izquierda: [-8, 0],
  derecha: [4, 0],
  arriba: [0, -3],
  abajo: [0, 6],
};

// Página SOLO para probar la mascota. No se sube a Git.
export default function PruebaMascota() {
  const { estado, mensaje, setEstado, reaccionar, hablar } = useMascota();
  const [tamano, setTamano] = useState(320);
  const [vida, setVida] = useState(true);
  const [espejo, setEspejo] = useState(false);
  const [mirada, setMirada] = useState(null);

  const boton = {
    padding: "8px 14px",
    borderRadius: 10,
    border: "1px solid #ccc",
    background: "#fff",
    color: "#222",
    fontSize: 15,
    cursor: "pointer",
  };
  const fila = { display: "flex", gap: 8, flexWrap: "wrap" };

  return (
    <div style={{ padding: 30, display: "flex", gap: 40, flexWrap: "wrap", alignItems: "flex-start" }}>
      <div style={{ minWidth: 360, display: "flex", justifyContent: "center" }}>
        <Mascota
          estado={estado}
          mensaje={mensaje || estado}
          tamano={tamano}
          espejo={espejo}
          vida={vida}
          mirada={mirada}
        />
      </div>

      <div style={{ maxWidth: 520 }}>
        <h3>Estados</h3>
        <div style={fila}>
          {Object.keys(ESTADOS).map((nombre) => (
            <button
              key={nombre}
              style={{ ...boton, fontWeight: nombre === estado ? "bold" : "normal" }}
              onClick={() => setEstado(nombre)}
            >
              {nombre}
            </button>
          ))}
        </div>

        <h3>Como se usaría en una lección</h3>
        <div style={fila}>
          <button style={boton} onClick={() => hablar("Hola, soy tu guía. Vamos a aprender náhuatl")}>
            Hablar
          </button>
          <button style={boton} onClick={() => reaccionar("celebrando", "¡Muy bien!", 2600)}>
            Acertó
          </button>
          <button style={boton} onClick={() => reaccionar("error", "Inténtalo otra vez", 1800)}>
            Falló
          </button>
        </div>

        <h3>Hacia dónde mira</h3>
        <div style={fila}>
          <button style={boton} onClick={() => setMirada(null)}>
            automática
          </button>
          {Object.keys(MIRADAS).map((n) => (
            <button key={n} style={boton} onClick={() => setMirada(MIRADAS[n])}>
              {n}
            </button>
          ))}
        </div>

        <h3>Opciones</h3>
        <label style={{ display: "block", marginBottom: 6 }}>
          <input type="checkbox" checked={vida} onChange={(e) => setVida(e.target.checked)} /> Con vida propia
          (mira a los lados y mueve las orejas sola)
        </label>
        <label style={{ display: "block", marginBottom: 6 }}>
          <input type="checkbox" checked={espejo} onChange={(e) => setEspejo(e.target.checked)} /> Espejo (voltearla)
        </label>

        <h3>Tamaño: {tamano}px</h3>
        <input
          type="range"
          min="120"
          max="520"
          value={tamano}
          onChange={(e) => setTamano(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
