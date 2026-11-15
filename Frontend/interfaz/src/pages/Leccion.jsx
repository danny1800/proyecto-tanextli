import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import Mascota from '../components/Mascota'
import { categorias } from '../data/categorias'
import { contenidoLecciones } from '../data/lecciones'
import { marcarLeccionCompletada } from '../services/progreso'
import { IconAltavoz, IconMicrofono } from '../components/Icons'
import '../styles/leccion.css'
import { actividadesDe } from '../data/actividades'

// Títulos que aparecen en la barra de resultado (uno al azar)
const TITULOS_ACIERTO = ['¡Excelente!', '¡Muy bien!', '¡Perfecto!', '¡Bien hecho!']
const TITULOS_ERROR = [
  '¡Casi! Inténtalo de nuevo',
  '¡No te preocupes! Inténtalo nuevamente',
  '¡Ánimo! Corrígelo e inténtalo otra vez',
]

/* ---------- Funciones de apoyo ---------- */

function elegir(lista) {
  return lista[Math.floor(Math.random() * lista.length)]
}

// Quita mayúsculas, acentos, signos y espacios de más para comparar lo que escribe el usuario
function normalizar(texto) {
  return texto
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’‘ʼ]/g, '')
    .replace(/[¿?¡!.,;:"“”()\-–]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function mezclar(lista) {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temporal = copia[i]
    copia[i] = copia[j]
    copia[j] = temporal
  }
  return copia
}

function sonar(src) {
  if (!src) return
  const audio = new Audio(src)
  audio.play().catch(() => { })
}

// Separa una frase en palabras, dejando aparte los signos (¿ ? ¡ ! , .) para que no den pistas
function palabrasDeFrase(frase) {
  return frase
    .trim()
    .split(/\s+/)
    .map((token) => {
      const m = token.match(/^([¿¡"“(]*)(.*?)([?!.,;:"”)]*)$/)
      return { antes: m[1], texto: m[2], despues: m[3] }
    })
}

// Prepara una pregunta de "completa la frase": tapa una palabra y busca 3 opciones equivocadas
function armarHueco(p, palabras, todasLasPalabras) {
  const partes = palabrasDeFrase(p.nahuatl)
  const clave = (t) => normalizar(t)

  // Cuántas frases de la lección usan cada palabra: se tapa la que menos se repite
  const frecuencia = {}
  palabras.forEach((q) => {
    new Set(palabrasDeFrase(q.nahuatl).map((x) => clave(x.texto))).forEach((k) => {
      frecuencia[k] = (frecuencia[k] || 0) + 1
    })
  })
  const candidatos = partes.map((x, i) => i).filter((i) => partes[i].texto)
  const minimo = Math.min(...candidatos.map((i) => frecuencia[clave(partes[i].texto)] || 1))
  const posibles = candidatos.filter((i) => (frecuencia[clave(partes[i].texto)] || 1) === minimo)
  const hueco = posibles[Math.floor(Math.random() * posibles.length)]
  const correcta = partes[hueco].texto

  // Opciones equivocadas: palabras de otras frases que no aparezcan en esta
  const enLaFrase = new Set(partes.map((x) => clave(x.texto)))
  const vistos = new Set()
  const distractores = []
  for (const q of [...mezclar(palabras), ...mezclar(todasLasPalabras)]) {
    if (q.nahuatl.startsWith('(falta)')) continue
    for (const x of mezclar(palabrasDeFrase(q.nahuatl))) {
      const k = clave(x.texto)
      if (!x.texto || enLaFrase.has(k) || vistos.has(k)) continue
      vistos.add(k)
      distractores.push(x.texto)
      break // una palabra por frase, para que haya variedad
    }
    if (distractores.length === 3) break
  }
  return { partes, hueco, opciones: mezclar([correcta, ...distractores]) }
}

// Elige 3 opciones equivocadas distintas (que no repitan el texto que va en los botones)
// Los números en español, del 1 al 20, para saber qué número es cada palabra
const NUMEROS_EN_ESPANOL = [
  'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
  'once', 'doce', 'trece', 'catorce', 'quince', 'dieciseis', 'diecisiete', 'dieciocho',
  'diecinueve', 'veinte',
]

// Devuelve el número (1 a 20) de una palabra, o null si no es un número.
// Si la palabra trae el campo "numero" en lecciones.js, se usa ese.
function numeralDe(palabra) {
  if (palabra.numero) return palabra.numero
  const i = NUMEROS_EN_ESPANOL.indexOf(normalizar(palabra.espanol))
  return i === -1 ? null : i + 1
}
function elegirDistractores(p, palabras, todasLasPalabras, campo) {
  const vistos = new Set([p[campo]])
  const elegidas = []
  for (const q of [...mezclar(palabras), ...mezclar(todasLasPalabras)]) {
    if (elegidas.length === 3) break
    if (q.nahuatl === p.nahuatl) continue // misma palabra en náhuatl: también sería correcta
    if (vistos.has(q[campo])) continue
    vistos.add(q[campo])
    elegidas.push(q)
  }
  return elegidas
}

// Arma la lista de pasos de la lección en el orden que indique "actividades"
function construirFases(palabras, todasLasPalabras, actividades) {
  const puntuables = actividades.filter((a) => a !== 'escuchar')
  const de = puntuables.length
  const numeroDe = (tipo) => puntuables.indexOf(tipo) + 1
  const fases = []

  actividades.forEach((tipo) => {
    if (tipo === 'escuchar') {
      palabras.forEach((p) => fases.push({ tipo, palabra: p }))
    } else if (tipo === 'unir' || tipo === 'unirNumero') {
      fases.push({ tipo, palabras, numero: numeroDe(tipo), de })
    } else if (tipo === 'opcion' || tipo === 'escuchaElige' || tipo === 'leeElige') {
      // Los botones llevan la palabra en español solo en "escuchaElige"
      const campo = tipo === 'escuchaElige' ? 'espanol' : 'nahuatl'
      palabras.forEach((p) => {
        const opciones = mezclar([p, ...elegirDistractores(p, palabras, todasLasPalabras, campo)])
        fases.push({ tipo, palabra: p, opciones, numero: numeroDe(tipo), de })
      })
    } else if (tipo === 'completa') {
      // Solo frases con 2 o más palabras (y que ya tengan su náhuatl)
      palabras
        .filter((p) => !p.nahuatl.startsWith('(falta)') && palabrasDeFrase(p.nahuatl).filter((x) => x.texto).length >= 2)
        .forEach((p) => {
          const hueco = armarHueco(p, palabras, todasLasPalabras)
          if (hueco.opciones.length >= 3) {
            fases.push({ tipo, palabra: p, ...hueco, numero: numeroDe(tipo), de })
          }
        })
    } else if (tipo === 'escritura') {
      palabras.forEach((p) => fases.push({ tipo, palabra: p, numero: numeroDe(tipo), de }))
    }
  })

  return fases
}

// Reproduce el audio de una palabra
function useAudio(src) {
  const audioRef = useRef(null)
  const [aviso, setAviso] = useState(false)

  function reproducir() {
    setAviso(false)
    if (!src) {
      setAviso(true)
      return
    }
    if (audioRef.current) audioRef.current.pause()
    const audio = new Audio(src)
    audioRef.current = audio
    audio.play().catch(() => setAviso(true))
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause()
    }
  }, [])

  return { reproducir, aviso }
}

/* ---------- Piezas de la pantalla ---------- */

function Cabecera({ titulo, onVolver }) {
  return (
    <header className="lp-cabecera">
      <button className="lp-volver" onClick={onVolver} aria-label="Volver">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className="lp-cabecera-titulo">{titulo}</h1>
    </header>
  )
}

function MascotaPista({ pista }) {
  return (
    <div className="lp-mascota-zona">
      <Mascota estado="reposo" mensaje={pista} tamano="pequeno" globo="arriba" />
    </div>
  )
}

function Muestra({ color }) {
  return <span className="lp-muestra" style={{ background: color }}></span>
}

// Barra que sube desde abajo cuando el usuario comprueba su respuesta
function BarraResultado({ resultado, detalle, textoBoton, onClick }) {
  const correcto = resultado === 'correcto'
  const [titulo] = useState(() => elegir(correcto ? TITULOS_ACIERTO : TITULOS_ERROR))

  return (
    <div className={`lp-barra ${correcto ? 'correcta' : 'incorrecta'}`} role="status">
      <div className="lp-barra-contenido">
        <div className="lp-barra-info">
          <Mascota estado={correcto ? 'feliz' : 'animo'} tamano="pequeno" />
          <div>
            <p className="lp-barra-titulo">{titulo}</p>
            {detalle && <p className="lp-barra-detalle">{detalle}</p>}
          </div>
        </div>
        <button className="lp-boton lp-boton-barra" onClick={onClick}>{textoBoton}</button>
      </div>
    </div>
  )
}

/* ---------- Paso: escuchar y repetir ---------- */

function PasoEscuchaRepite({ palabra, onContinuar }) {
  const { reproducir, aviso } = useAudio(palabra.audio)
  // inactiva | grabando | lista | error | permitido
  const [grabacion, setGrabacion] = useState('inactiva')
  const [modoToque, setModoToque] = useState(false) // true si el usuario tocó en vez de mantener presionado
  const grabadorRef = useRef(null)
  const quiereGrabarRef = useRef(false) // el usuario quiere que se esté grabando
  const modoToqueRef = useRef(false)
  const inicioPulsoRef = useRef(0)

  async function iniciar() {
    quiereGrabarRef.current = true
    const antes = Date.now()
    try {
      const flujo = await navigator.mediaDevices.getUserMedia({ audio: true })
      // El usuario ya soltó el botón mientras el navegador pedía el permiso
      if (!quiereGrabarRef.current) {
        flujo.getTracks().forEach((t) => t.stop())
        if (Date.now() - antes > 600) setGrabacion('permitido') // acaba de dar el permiso
        return
      }
      const grabador = new MediaRecorder(flujo)
      grabador.onstop = () => {
        flujo.getTracks().forEach((t) => t.stop())
        setGrabacion('lista')
      }
      grabador.start()
      grabadorRef.current = grabador
      setGrabacion('grabando')
    } catch {
      quiereGrabarRef.current = false
      setGrabacion('error')
    }
  }

  function terminar() {
    quiereGrabarRef.current = false
    modoToqueRef.current = false
    setModoToque(false)
    const grabador = grabadorRef.current
    if (grabador && grabador.state === 'recording') grabador.stop()
  }

  function alPresionar(e) {
    // Mantiene el seguimiento del cursor aunque se salga del botón
    if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId)
    const grabando = grabadorRef.current && grabadorRef.current.state === 'recording'
    // Si ya está grabando (porque tocó antes), este toque termina la grabación
    if (modoToqueRef.current || grabando) {
      terminar()
      return
    }
    inicioPulsoRef.current = Date.now()
    iniciar()
  }

  function alSoltar() {
    if (!quiereGrabarRef.current || modoToqueRef.current) return
    if (Date.now() - inicioPulsoRef.current < 400) {
      // Fue un toque corto: sigue grabando hasta que vuelva a tocar el micrófono
      modoToqueRef.current = true
      setModoToque(true)
    } else {
      terminar()
    }
  }

  useEffect(() => {
    return () => {
      quiereGrabarRef.current = false
      const grabador = grabadorRef.current
      if (grabador && grabador.state === 'recording') grabador.stop()
    }
  }, [])

  let estado = 'reposo'
  let mensaje = '¡Escucha con atención y luego repite conmigo!'
  if (grabacion === 'lista') {
    estado = 'feliz'
    mensaje = '¡Muy bien! Ya practicaste esta palabra.'
  } else if (grabacion === 'permitido') {
    estado = 'feliz'
    mensaje = '¡Listo! Ya puedes usar el micrófono. Inténtalo otra vez.'
  } else if (grabacion === 'error') {
    estado = 'animo'
    mensaje = 'No pude usar el micrófono. Revisa el permiso del navegador.'
  }

  const textoMic = {
    inactiva: 'Mantén presionado y repite (o toca para empezar y toca para terminar)',
    grabando: modoToque
      ? 'Grabando... toca de nuevo para terminar'
      : 'Grabando... suelta o toca de nuevo para terminar',
    lista: 'Listo. Puedes grabar otra vez o continuar.',
    permitido: 'Micrófono permitido. Mantén presionado y repite.',
    error: 'No se pudo usar el micrófono',
  }[grabacion]

  return (
    <>
      <div className="lp-mascota-zona">
        <Mascota estado={estado} mensaje={mensaje} tamano="pequeno" globo="arriba" />
      </div>

      <div className="lp-tarjeta">
        {palabra.colorHex && <Muestra color={palabra.colorHex} />}
        {palabra.imagen && <img className="lp-imagen" src={palabra.imagen} alt={palabra.espanol} />}
        <h2 className="lp-palabra">{palabra.nahuatl}</h2>
        <p className="lp-traduccion">{palabra.espanol}</p>

        <button className="lp-audio" onClick={reproducir} aria-label="Escuchar la palabra">
          <IconAltavoz />
        </button>
        {aviso && <p className="lp-aviso">No se pudo reproducir el audio.</p>}

        <button
          className={`lp-mic ${grabacion === 'grabando' ? 'grabando' : ''}`}
          onPointerDown={alPresionar}
          onPointerUp={alSoltar}
          onPointerCancel={alSoltar}
          onContextMenu={(e) => e.preventDefault()}
          aria-label="Mantén presionado o toca para grabar tu voz"
        >
          <IconMicrofono />
        </button>
        <p className="lp-ayuda">{textoMic}</p>
        {grabacion === 'error' && (
          <p className="lp-aviso">
            Haz clic en el ícono junto a la dirección de la página, permite el micrófono y recarga.
          </p>
        )}

        <button className="lp-boton-secundario" onClick={reproducir}>Repetir audio</button>

        {(grabacion === 'inactiva' || grabacion === 'error' || grabacion === 'permitido') && (
          <button className="lp-enlace" onClick={() => setGrabacion('lista')}>
            No puedo usar el micrófono ahora
          </button>
        )}
      </div>

      <button className="lp-boton" onClick={() => onContinuar(false)} disabled={grabacion !== 'lista'}>
        Continuar
      </button>
    </>
  )
}

// La "imagen" de un número: el número y, debajo, puntos que muestran la cantidad.
// Si la palabra trae el campo "imagen" en lecciones.js, se usa esa imagen.
function ImagenNumero({ palabra }) {
  if (palabra.imagen) {
    return <img className="lp-mini-imagen" src={palabra.imagen} alt="" />
  }
  const n = numeralDe(palabra)
  if (!n) return <span>{palabra.espanol}</span>
  return (
    <>
      <span className="lp-mini-numero">{n}</span>
      <span className="lp-mini-cantidad" aria-hidden="true">
        {Array.from({ length: n }, (_, i) => (
          <span key={i} className="lp-mini-punto"></span>
        ))}
      </span>
    </>
  )
}

/* ---------- Paso: unir las parejas ---------- */

// modo 'palabras': une cada palabra en náhuatl con su traducción en español
// modo 'numeros':  une la imagen de cada número con su palabra en náhuatl
function PasoUnir({ modo = 'palabras', palabras, numero, de, onSiguiente }) {
  const [izquierda] = useState(() => mezclar(palabras))
  const [derecha] = useState(() => mezclar(palabras))
  const [selIzq, setSelIzq] = useState(null) // elemento elegido a la izquierda (su náhuatl)
  const [selDer, setSelDer] = useState(null) // elemento elegido a la derecha
  const [unidas, setUnidas] = useState([]) // palabras en náhuatl ya unidas
  const [fallo, setFallo] = useState(null) // { izq, der } mientras parpadea en rojo
  const [huboError, setHuboError] = useState(false)
  const temporizador = useRef(null)

  useEffect(() => {
    return () => clearTimeout(temporizador.current)
  }, [])

  const esNumeros = modo === 'numeros'
  // Qué valor identifica a cada elemento de la derecha
  const valorDerecha = (p) => (esNumeros ? p.nahuatl : p.espanol)
  const completo = unidas.length === palabras.length
  const derechaUnidas = palabras.filter((p) => unidas.includes(p.nahuatl)).map(valorDerecha)

  function evaluar(izq, der) {
    const palabra = palabras.find((p) => p.nahuatl === izq)
    if (valorDerecha(palabra) === der) {
      setUnidas((u) => [...u, izq])
      setSelIzq(null)
      setSelDer(null)
    } else {
      setHuboError(true)
      setFallo({ izq, der })
      temporizador.current = setTimeout(() => {
        setFallo(null)
        setSelIzq(null)
        setSelDer(null)
      }, 700)
    }
  }

  function elegirIzquierda(p) {
    if (fallo || unidas.includes(p.nahuatl)) return
    if (!esNumeros) sonar(p.audio)
    const nuevo = selIzq === p.nahuatl ? null : p.nahuatl
    setSelIzq(nuevo)
    if (nuevo && selDer) evaluar(nuevo, selDer)
  }

  function elegirDerecha(p) {
    if (fallo || derechaUnidas.includes(valorDerecha(p))) return
    if (esNumeros) sonar(p.audio)
    const nuevo = selDer === valorDerecha(p) ? null : valorDerecha(p)
    setSelDer(nuevo)
    if (nuevo && selIzq) evaluar(selIzq, nuevo)
  }

  function claseIzquierda(p) {
    let clase = 'lp-par'
    if (esNumeros) clase += ' imagen'
    if (unidas.includes(p.nahuatl)) clase += ' unida'
    else if (fallo && fallo.izq === p.nahuatl) clase += ' fallo'
    else if (selIzq === p.nahuatl) clase += ' seleccionada'
    return clase
  }

  function claseDerecha(p) {
    let clase = 'lp-par'
    if (derechaUnidas.includes(valorDerecha(p))) clase += ' unida'
    else if (fallo && fallo.der === valorDerecha(p)) clase += ' fallo'
    else if (selDer === valorDerecha(p)) clase += ' seleccionada'
    return clase
  }

  return (
    <>
      <h2 className="lp-actividad">Actividad {numero} de {de}</h2>
      <p className="lp-instruccion">
        {esNumeros ? 'Une cada número con su nombre en náhuatl' : 'Selecciona los pares'}
      </p>

      <div className="lp-pares">
        <div className="lp-columna">
          {izquierda.map((p) => (
            <button key={p.nahuatl} className={claseIzquierda(p)} onClick={() => elegirIzquierda(p)}>
              {esNumeros ? <ImagenNumero palabra={p} /> : p.nahuatl}
            </button>
          ))}
        </div>
        <div className="lp-columna">
          {derecha.map((p) => (
            <button key={valorDerecha(p)} className={claseDerecha(p)} onClick={() => elegirDerecha(p)}>
              {!esNumeros && p.colorHex && (
                <span className="lp-par-muestra" style={{ background: p.colorHex }}></span>
              )}
              {valorDerecha(p)}
            </button>
          ))}
        </div>
      </div>

      {completo && (
        <BarraResultado
          resultado="correcto"
          textoBoton="Continuar"
          onClick={() => onSiguiente(!huboError)}
        />
      )}
    </>
  )
}

// modo 'opcion':       escucha el audio y elige la palabra en náhuatl
// modo 'escuchaElige': escucha el audio y elige su significado en español
// modo 'leeElige':     lee la palabra en español y elige cómo se dice en náhuatl
function PasoOpcionMultiple({ modo, palabra, opciones, numero, de, onSiguiente }) {
  const { reproducir, aviso } = useAudio(palabra.audio)
  const [seleccion, setSeleccion] = useState(null)
  const [resultado, setResultado] = useState(null) // null | correcto | incorrecto
  const [fallos, setFallos] = useState(0)

  const idDe = (op) => `${op.nahuatl}|${op.espanol}`
  const textoBoton = (op) => (modo === 'escuchaElige' ? op.espanol : op.nahuatl)
  const pistas = {
    opcion: 'Escucha el audio y escoge la respuesta correcta',
    escuchaElige: 'Escucha la palabra y elige su significado en español',
    leeElige: 'Lee la palabra y elige cómo se dice en náhuatl',
  }

  function comprobar() {
    const acierto = seleccion === idDe(palabra)
    if (!acierto) setFallos((f) => f + 1)
    setResultado(acierto ? 'correcto' : 'incorrecto')
  }

  function reintentar() {
    setSeleccion(null)
    setResultado(null)
  }

  return (
    <>
      <h2 className="lp-actividad">Actividad {numero} de {de}</h2>
      {resultado === null && <MascotaPista pista={pistas[modo]} />}

      {modo === 'leeElige' ? (
        <div className="lp-tarjeta">
          <p className="lp-traduccion">Lee la palabra</p>
          <h2 className="lp-palabra">{palabra.espanol}</h2>
        </div>
      ) : (
        <>
          <button className="lp-audio" onClick={reproducir} aria-label="Escuchar la palabra">
            <IconAltavoz />
          </button>
          {aviso && <p className="lp-aviso">No se pudo reproducir el audio.</p>}
          {!palabra.audio && (
            <p className="lp-ayuda">
              {modo === 'escuchaElige' ? `Dice: ${palabra.nahuatl}` : `Significa: ${palabra.espanol}`}
            </p>
          )}
        </>
      )}

      <div className="lp-opciones">
        {opciones.map((op) => {
          const id = idDe(op)
          let clase = 'lp-opcion'
          if (seleccion === id) {
            clase += resultado ? (resultado === 'correcto' ? ' correcta' : ' incorrecta') : ' seleccionada'
          }
          return (
            <button
              key={id}
              className={clase}
              disabled={resultado !== null}
              onClick={() => setSeleccion(id)}
            >
              {textoBoton(op)}
            </button>
          )
        })}
      </div>

      {resultado === null ? (
        <button className="lp-boton" onClick={comprobar} disabled={!seleccion}>Comprobar</button>
      ) : (
        <BarraResultado
          resultado={resultado}
          textoBoton={resultado === 'correcto' ? 'Continuar' : 'Intentar de nuevo'}
          onClick={resultado === 'correcto' ? () => onSiguiente(fallos === 0) : reintentar}
        />
      )}
    </>
  )
}

/* ---------- Paso: completa la frase ---------- */

function PasoCompleta({ palabra, partes, hueco, opciones, numero, de, onSiguiente }) {
  const [seleccion, setSeleccion] = useState(null)
  const [resultado, setResultado] = useState(null) // null | correcto | incorrecto
  const [fallos, setFallos] = useState(0)
  const correcta = partes[hueco].texto

  function comprobar() {
    const acierto = seleccion === correcta
    if (!acierto) setFallos((f) => f + 1)
    setResultado(acierto ? 'correcto' : 'incorrecto')
  }

  function reintentar() {
    setSeleccion(null)
    setResultado(null)
  }

  return (
    <>
      <h2 className="lp-actividad">Actividad {numero} de {de}</h2>
      <p className="lp-instruccion">Completa la frase</p>
      {resultado === null && <MascotaPista pista="Elige la palabra que falta" />}

      <div className="lp-tarjeta">
        <p className="lp-traduccion">{palabra.espanol}</p>
        <p className="lp-frase">
          {partes.map((parte, i) => (
            <span key={i} className="lp-token">
              {parte.antes}
              {i === hueco ? (
                <button
                  className={`lp-hueco ${seleccion ? 'lleno' : ''} ${resultado === 'correcto' ? 'correcta' : resultado === 'incorrecto' ? 'incorrecta' : ''}`}
                  disabled={!seleccion || resultado !== null}
                  onClick={() => setSeleccion(null)}
                  aria-label="Espacio en blanco"
                >
                  {seleccion || '\u00A0'}
                </button>
              ) : (
                parte.texto
              )}
              {parte.despues}
            </span>
          ))}
        </p>
      </div>

      <div className="lp-fichas">
        {opciones.map((op) => (
          <button
            key={op}
            className={`lp-ficha ${seleccion === op ? 'usada' : ''}`}
            disabled={resultado !== null || seleccion === op}
            onClick={() => setSeleccion(op)}
          >
            {op}
          </button>
        ))}
      </div>

      {resultado === null ? (
        <button className="lp-boton" onClick={comprobar} disabled={!seleccion}>Comprobar</button>
      ) : (
        <BarraResultado
          resultado={resultado}
          textoBoton={resultado === 'correcto' ? 'Continuar' : 'Intentar de nuevo'}
          onClick={resultado === 'correcto' ? () => onSiguiente(fallos === 0) : reintentar}
        />
      )}
    </>
  )
}

/* ---------- Paso: escritura ---------- */

// Después de cuántos errores aparece la ayuda para recordar cómo se escribe
const AYUDA_DESDE = 2

function PasoEscritura({ palabra, numero, de, onSiguiente }) {
  const { reproducir, aviso } = useAudio(palabra.audio)
  const [texto, setTexto] = useState('')
  const [resultado, setResultado] = useState(null) // null | correcto | incorrecto
  const [fallos, setFallos] = useState(0)
  const [verRespuesta, setVerRespuesta] = useState(false)
  const campoRef = useRef(null)

  useEffect(() => {
    if (resultado === null && campoRef.current) campoRef.current.focus()
  }, [resultado])

  function comprobar() {
    if (!texto.trim()) return
    const acierto = normalizar(texto) === normalizar(palabra.nahuatl)
    if (!acierto) setFallos((f) => f + 1)
    setResultado(acierto ? 'correcto' : 'incorrecto')
  }

  function reintentar() {
    setTexto('')
    setResultado(null)
  }

  return (
    <>
      <h2 className="lp-actividad">Actividad {numero} de {de}</h2>

      <div className="lp-tarjeta">
        {palabra.colorHex && <Muestra color={palabra.colorHex} />}
        <p className="lp-pregunta">
          ¿Cómo se dice «{palabra.espanol.replace(/^[¿¡\s]+|[?!.\s]+$/g, '').toLowerCase()}» en náhuatl?
        </p>
        <input
          ref={campoRef}
          className={`lp-input ${resultado === 'correcto' ? 'correcta' : resultado === 'incorrecto' ? 'incorrecta' : ''}`}
          type="text"
          placeholder="Escribe aquí..."
          value={texto}
          disabled={resultado !== null}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && resultado === null && comprobar()}
        />

        {fallos >= AYUDA_DESDE && resultado !== 'correcto' && (
          <div className="lp-ayuda-escritura">
            <p className="lp-ayuda-titulo">¿No recuerdas cómo se escribe?</p>
            {verRespuesta ? (
              <p className="lp-respuesta">
                Se escribe: <strong>{palabra.nahuatl}</strong>
              </p>
            ) : (
              <button className="lp-enlace" onClick={() => setVerRespuesta(true)}>
                Ver cómo se escribe
              </button>
            )}
            {palabra.audio && (
              <button className="lp-enlace" onClick={reproducir}>
                Escuchar la palabra
              </button>
            )}
            {aviso && <p className="lp-aviso">No se pudo reproducir el audio.</p>}
          </div>
        )}
      </div>

      {resultado === null && <MascotaPista pista="¡Recuerda cómo lo aprendimos!" />}

      {resultado === null ? (
        <button className="lp-boton" onClick={comprobar} disabled={!texto.trim()}>Comprobar</button>
      ) : (
        <BarraResultado
          resultado={resultado}
          textoBoton={resultado === 'correcto' ? 'Continuar' : 'Intentar de nuevo'}
          onClick={resultado === 'correcto' ? () => onSiguiente(fallos === 0) : reintentar}
        />
      )}
    </>
  )
}

/* ---------- Pantalla final de la lección ---------- */

function Resumen({ cantidadPalabras, precision, onContinuar, onRepasar }) {
  return (
    <div className="lp-resumen">
      <Mascota estado="celebra" tamano="grande" />
      <h2 className="lp-resumen-titulo">¡Completaste la lección!</h2>
      <div className="lp-stats">
        <div className="lp-stat naranja">
          <p className="lp-stat-cab">PALABRAS</p>
          <p className="lp-stat-valor">{cantidadPalabras}</p>
        </div>
        <div className="lp-stat verde">
          <p className="lp-stat-cab">PRECISIÓN</p>
          <p className="lp-stat-valor">{precision}%</p>
        </div>
      </div>
      <div className="lp-resumen-botones">
        <button className="lp-boton-secundario" onClick={onRepasar}>Repasar lección</button>
        <button className="lp-boton" onClick={onContinuar}>Continuar</button>
      </div>
    </div>
  )
}

/* ---------- Recorrido completo de una lección ---------- */

function ReproductorLeccion({ categoriaId, leccion, palabras, actividades, onRepasar }) {
  const navigate = useNavigate()
  const todasLasPalabras = Object.values(contenidoLecciones[categoriaId] || {}).flatMap((l) => l.palabras)
  const [fases] = useState(() => construirFases(palabras, todasLasPalabras, actividades))
  const [indice, setIndice] = useState(0)
  const [aciertosPrimero, setAciertosPrimero] = useState(0)
  const [terminado, setTerminado] = useState(false)

  const volver = () => navigate(`/categoria/${categoriaId}/lecciones`)
  const total = fases.length
  const fase = fases[indice]
  const puntuables = fases.filter((f) => f.tipo !== 'escuchar').length
  const precision = puntuables ? Math.round((aciertosPrimero / puntuables) * 100) : 100

  useEffect(() => {
    if (terminado) marcarLeccionCompletada(categoriaId, leccion.id)
  }, [terminado, categoriaId, leccion.id])

  // primerIntento: true si el usuario acertó a la primera (se usa para la precisión)
  function avanzar(primerIntento) {
    if (primerIntento) setAciertosPrimero((n) => n + 1)
    if (indice + 1 >= total) {
      setTerminado(true)
    } else {
      setIndice(indice + 1)
    }
  }

  let contenido
  if (terminado) {
    contenido = (
      <Resumen
        cantidadPalabras={palabras.length}
        precision={precision}
        onContinuar={volver}
        onRepasar={onRepasar}
      />
    )
  } else if (fase.tipo === 'escuchar') {
    contenido = <PasoEscuchaRepite palabra={fase.palabra} onContinuar={avanzar} />
    } else if (fase.tipo === 'unir' || fase.tipo === 'unirNumero') {
    contenido = (
      <PasoUnir
        modo={fase.tipo === 'unirNumero' ? 'numeros' : 'palabras'}
        palabras={fase.palabras}
        numero={fase.numero}
        de={fase.de}
        onSiguiente={avanzar}
      />
    )
  } else if (fase.tipo === 'opcion' || fase.tipo === 'escuchaElige' || fase.tipo === 'leeElige') {
    contenido = (
      <PasoOpcionMultiple
        modo={fase.tipo}
        palabra={fase.palabra}
        opciones={fase.opciones}
        numero={fase.numero}
        de={fase.de}
        onSiguiente={avanzar}
      />
    )
  } else if (fase.tipo === 'completa') {
    contenido = (
      <PasoCompleta
        palabra={fase.palabra}
        partes={fase.partes}
        hueco={fase.hueco}
        opciones={fase.opciones}
        numero={fase.numero}
        de={fase.de}
        onSiguiente={avanzar}
      />
    )
  } else {
    contenido = <PasoEscritura palabra={fase.palabra} numero={fase.numero} de={fase.de} onSiguiente={avanzar} />
  }

  return (
    <div className="lp-pagina">
      <Cabecera titulo={`Lección ${leccion.id}: ${leccion.titulo}`} onVolver={volver} />
      {!terminado && (
        <div className="lp-progreso">
          <div className="lp-progreso-relleno" style={{ width: `${Math.round((indice / total) * 100)}%` }}></div>
        </div>
      )}
      <main className={`lp-contenido ${indice % 2 === 1 ? 'lado-izquierdo' : ''}`} key={terminado ? 'fin' : indice}>
        {contenido}
      </main>
    </div>
  )
}

/* ---------- Pantalla que se abre desde la lista de lecciones ---------- */

function Leccion() {
  const { id, leccionId } = useParams()
  const navigate = useNavigate()
  const [vuelta, setVuelta] = useState(0) // sube al repasar la lección, para empezarla de nuevo
  const categoria = categorias[id]
  const leccion = categoria ? categoria.lecciones.find((l) => String(l.id) === leccionId) : null

  if (!categoria || !leccion) {
    return <Navigate to="/menu" replace />
  }

  const contenido = contenidoLecciones[id] && contenidoLecciones[id][leccion.id]

  // Lecciones que todavía no tienen contenido (y los repasos finales)
  if (!contenido) {
    return (
      <div className="lp-pagina">
        <Cabecera
          titulo={`Lección ${leccion.id}: ${leccion.titulo}`}
          onVolver={() => navigate(`/categoria/${id}/lecciones`)}
        />
        <main className="lp-contenido">
          <div className="lp-fin">
            <Mascota estado="reposo" mensaje="Esta lección estará lista muy pronto." tamano="grande" globo="arriba" />
            <button className="lp-boton" onClick={() => navigate(`/categoria/${id}/lecciones`)}>
              Volver a las lecciones
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <ReproductorLeccion
      key={`${id}-${leccion.id}-${vuelta}`}
      categoriaId={id}
      leccion={leccion}
      palabras={contenido.palabras}
      actividades={actividadesDe(id, leccion.id, leccion.final)}
      onRepasar={() => setVuelta((v) => v + 1)}
    />
  )
}

export default Leccion