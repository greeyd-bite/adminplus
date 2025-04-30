// Array de productos (se mantiene)
let productos = [];
total += totalProducto;

// Referencias a elementos del DOM
const searchInput = document.getElementById('searchInput');
const listaProductos = document.getElementById('listaProductos');

// Función para agregar un producto
function agregarProducto() {
    const nombre = document.getElementById("nombreProducto").value.trim();
    const precio = parseFloat(document.getElementById("precioProducto").value);
    const cantidad = parseInt(document.getElementById("cantidadProducto").value) || 1;
    const descuento = parseFloat(document.getElementById("descuentoProducto").value) || 0;
    const ivaTarifa = parseFloat(document.getElementById("ivaProducto").value); // Nueva línea

    if (nombre && !isNaN(precio) && cantidad > 0) {
        const subtotalSinDescuento = precio * cantidad;
        const subtotal = subtotalSinDescuento - (subtotalSinDescuento * (descuento / 100));
        const valorIva = subtotal * (ivaTarifa / 100);
        const totalProducto = subtotal + valorIva;

        productos.push({ nombre, cantidad, descuento, subtotal, valorIva, totalProducto, ivaTarifa });

        const li = document.createElement("li");
        li.textContent = `${nombre} x${cantidad} (desc. ${descuento}% | IVA ${ivaTarifa}%): $${totalProducto.toFixed(2)}`;
        document.getElementById("listaProductos").appendChild(li);

        actualizarTotales();

        document.getElementById("nombreProducto").value = "";
        document.getElementById("precioProducto").value = "";
        document.getElementById("cantidadProducto").value = "1";
        document.getElementById("descuentoProducto").value = "0";
        document.getElementById("ivaProducto").value = "19";
    } else {
        alert("Por favor, ingresa datos válidos.");
    }
}

// Función para actualizar la lista de productos
function actualizarLista() {
    // Limpiar la lista de productos
    listaProductos.innerHTML = '';

    // Filtrar productos según búsqueda
    const term = searchInput.value.trim().toLowerCase();
    const filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(term)
    );

    // Renderizar productos filtrados
    filtrados.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.nombre} x${p.cantidad} (desc. ${p.descuento}% | IVA ${p.ivaTarifa}%): $${p.totalProducto.toFixed(2)}`;
        listaProductos.appendChild(li);
    });

// Función para actualizar los totales (IVA, Total con IVA)
function actualizarTotales() {
    const moneda = document.getElementById("monedaSeleccionada").value;
    const tasa = tasasCambio[moneda];
    const iva = total * 0.19;
    const totalConIva = total + iva;

    document.getElementById("ivaValor").textContent = (iva * tasa).toFixed(2) + ' ' + moneda;
    document.getElementById("total").textContent = (totalConIva * tasa).toFixed(2) + ' ' + moneda;
}

const tasasCambio = {
    COP: 1,
    USD: 0.00025, // 1 COP = 0.00025 USD
    EUR: 0.00023  // 1 COP = 0.00023 EUR
};
function guardarEnHistorial(recibo, productos, iva, totalConIva, metodo) {
    const historial = JSON.parse(localStorage.getItem("historialVentas")) || [];

    historial.push({
        fecha: new Date().toLocaleString(),
        productos: productos.map(p => `${p.nombre} x${p.cantidad}`),
        iva: iva.toFixed(2),
        total: totalConIva.toFixed(2),
        metodo
    });

    localStorage.setItem("historialVentas", JSON.stringify(historial));
}

function mostrarHistorial() {
    const tabla = document.getElementById("tablaHistorial").getElementsByTagName("tbody")[0];
    tabla.innerHTML = ""; // Limpiar antes de cargar

    const historial = JSON.parse(localStorage.getItem("historialVentas")) || [];

    historial.forEach(venta => {
        const fila = tabla.insertRow();
        fila.innerHTML = `
            <td>${venta.fecha}</td>
            <td>${venta.productos.join("<br>")}</td>
            <td>$${venta.iva}</td>
            <td>$${venta.total}</td>
            <td>${venta.metodo}</td>
        `;
    });
}

// Función para imprimir el recibo
function imprimirRecibo() {
    let recibo = "RECIBO DE COMPRA\n\n";
    productos.forEach(p => {
        recibo += `${p.nombre} x${p.cantidad} ${p.unidad} (desc. ${p.descuento}%): $${p.subtotal.toFixed(2)}\n`;
    });
    const moneda = document.getElementById("moneda").value;
    const tasa = tasasCambio[moneda];
    const iva = total * 0.19;
    const totalConIva = total + iva;

    recibo += `\nIVA (19%): ${(iva * tasa).toFixed(2)} ${moneda}\n`;
    recibo += `TOTAL: ${(totalConIva * tasa).toFixed(2)} ${moneda}\n`;
    recibo += `Método de pago: ${metodo}\n`;

    const win = window.open('', '_blank');
    win.document.write(`<pre>${recibo}</pre>`);
    guardarEnHistorial(recibo, productos, iva, totalConIva, metodo);
    win.print();
}

// Función para reiniciar la caja
function reiniciarCaja() {
    productos = [];
    total = 0;
    document.getElementById("listaProductos").innerHTML = "";
    document.getElementById("ivaValor").textContent = "0.00";
    document.getElementById("total").textContent = "0.00";
    searchInput.value = '';  // Limpiar la búsqueda
    actualizarLista();  // Actualizar lista de productos (vacía)
}

// Event listener para la búsqueda en tiempo real
searchInput.addEventListener('input', actualizarLista);

function alternarCalculadora() {
    const calculadora = document.getElementById("calculadora");
    const boton = document.getElementById("toggleCalculadora");

    if (calculadora.style.display === "none") {
        calculadora.style.display = "block";
        boton.textContent = "Ocultar Calculadora";
    } else {
        calculadora.style.display = "none";
        boton.textContent = "Mostrar Calculadora";
    }
}

function alternarCalculadora() {
    const calculadora = document.getElementById("calculadora");
    calculadora.style.display = (calculadora.style.display === "none" || calculadora.style.display === "") ? "block" : "none";
}
