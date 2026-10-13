const formularioTareas = document.getElementById('formulario-tareas');
const tituloTarea = document.getElementById('titulo-tarea');
const descripcionTarea = document.getElementById('descripcion-tarea');
const listaTareas = document.getElementById('lista-tareas');
const mensajeVacio = document.getElementById('mensaje-vacio');
const contadorTareas = document.getElementById('contador-tareas');
const btnExportarJson = document.getElementById('btn-exportar-json');
const btnExportarXml = document.getElementById('btn-exportar-xml');

// Se usa la misma clave para guardar y recuperar la información.
let coleccionTareas = JSON.parse(localStorage.getItem('tareasGuardadas')) || [];

function guardarTareas() {
  localStorage.setItem('tareasGuardadas', JSON.stringify(coleccionTareas));
}

function dibujarTareas() {
  listaTareas.innerHTML = '';
  mensajeVacio.hidden = coleccionTareas.length > 0;
  contadorTareas.textContent = `${coleccionTareas.length} ${coleccionTareas.length === 1 ? 'tarea' : 'tareas'}`;

  coleccionTareas.forEach((tarea, indice) => {
    const elemento = document.createElement('li');
    elemento.className = 'elemento-tarea';

    const detalle = document.createElement('div');
    detalle.className = 'detalle-tarea';
    const titulo = document.createElement('h3');
    titulo.textContent = tarea.titulo;
    const descripcion = document.createElement('p');
    descripcion.textContent = tarea.descripcion;
    const fecha = document.createElement('small');
    fecha.textContent = `Código: ${tarea.codigo} | Registro: ${tarea.fecha}`;
    detalle.append(titulo, descripcion, fecha);

    const botonEliminar = document.createElement('button');
    botonEliminar.type = 'button';
    botonEliminar.className = 'boton btn-eliminar';
    botonEliminar.textContent = 'Eliminar';
    botonEliminar.addEventListener('click', () => eliminarTarea(indice));

    elemento.append(detalle, botonEliminar);
    listaTareas.appendChild(elemento);
  });
}

formularioTareas.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const nuevaTarea = {
    codigo: Date.now().toString(),
    titulo: tituloTarea.value.trim(),
    descripcion: descripcionTarea.value.trim(),
    fecha: new Date().toLocaleDateString('es-EC')
  };

  coleccionTareas.push(nuevaTarea);
  guardarTareas();
  dibujarTareas();
  formularioTareas.reset();
  tituloTarea.focus();
});

function eliminarTarea(indice) {
  coleccionTareas.splice(indice, 1);
  guardarTareas();
  dibujarTareas();
}

function descargarArchivo(contenido, nombre, tipo) {
  const archivo = new Blob([contenido], { type: `${tipo};charset=utf-8` });
  const url = URL.createObjectURL(archivo);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(url);
}

btnExportarJson.addEventListener('click', () => {
  if (coleccionTareas.length === 0) {
    alert('Agrega al menos una tarea antes de exportar.');
    return;
  }
  descargarArchivo(JSON.stringify(coleccionTareas, null, 2), 'tareas_academicas.json', 'application/json');
});

function escaparXml(texto) {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

btnExportarXml.addEventListener('click', () => {
  if (coleccionTareas.length === 0) {
    alert('Agrega al menos una tarea antes de exportar.');
    return;
  }

  let textoXml = '<?xml version="1.0" encoding="UTF-8"?>\n<tareas>\n';
  coleccionTareas.forEach((tarea) => {
    textoXml += `  <tarea codigo="${escaparXml(tarea.codigo)}">\n`;
    textoXml += `    <titulo>${escaparXml(tarea.titulo)}</titulo>\n`;
    textoXml += `    <descripcion>${escaparXml(tarea.descripcion)}</descripcion>\n`;
    textoXml += `    <fecha>${escaparXml(tarea.fecha)}</fecha>\n`;
    textoXml += '  </tarea>\n';
  });
  textoXml += '</tareas>';
  descargarArchivo(textoXml, 'tareas_academicas.xml', 'application/xml');
});

dibujarTareas();
