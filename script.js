

// Base de datos de productos premium
const productos = [
  {
    id: 1,
    nombre: "Ribeye Angus",
    precio: 85,
    categoria: "premium",
    imagen: "https://i.pinimg.com/736x/48/65/f0/4865f00f89d4ba8ebcbb1925519c8c27.jpg",
    descripcion: "Corte premium con marmoleo grado 4, madurado 28 días",
    badge: "PREMIUM"
  },
 {
    id: 2,
    nombre: "costillar de Res",
    precio: 65,
    categoria: "res",
    imagen: "https://i.pinimg.com/736x/c0/8c/21/c08c217dd31c04790e938153b4f15a46.jpg",
    descripcion: "Corte tierno, madurado 21 días, ideal para parrilla",
    badge: "RECOMENDADO"
  },
  {
    id: 3,
    nombre: "Pechuga de Pollo",
    precio: 35,
    categoria: "pollo",
    imagen: "https://i.pinimg.com/736x/16/1b/6c/161b6c43d47a4cba4ad24e92f486b616.jpg",
    descripcion: "Ideal para platos a la plancha, a la parrilla o al horno, es una fuente rica en proteínas y baja en grasas, perfecta para una alimentación equilibrada sin sacrificar el sabor.",
    badge: "ORGÁNICO"
  },
  {
    id: 4,
    nombre: "Costillas de Cerdo",
    precio: 45,
    categoria: "cerdo",
    imagen: "https://i.pinimg.com/736x/00/e2/a4/00e2a462b3ff3da56c23c6f31b77a8ef.jpg",
    descripcion: "Corte especial para parrilla, con marinada incluida",
    badge: "PROMO"
  },
  {
    id: 5,
    nombre: "picaña",
    precio: 120,
    categoria: "premium",
    imagen: "https://i.pinimg.com/736x/5b/02/05/5b02051394969c45d660c7304d3a5635.jpg",
    descripcion: "Exclusivo corte con marmoleo grado 5, edición limitada",
    badge: "EXCLUSIVO"
  },
  {
    id: 6,
    nombre: "Blandos",
    precio: 70,
    categoria: "res",
    imagen: "https://i.pinimg.com/1200x/3d/0b/dc/3d0bdca3e56d7644405c2259f342d778.jpg",
    descripcion: "Cortes jugoso y blando",
    badge: "TERNEZA"
  },
  {
    id: 7,
    nombre: "blandos de cerdo",
    precio: 40,
    categoria: "cerdo",
    imagen: "https://i.pinimg.com/1200x/bf/e3/2c/bfe32cc8d1c853974c3531b4818c6a0d.jpg",
    descripcion: "blandos para horno o para algun plato tradicional boliviano",
    badge: "ARTESANAL"
  },
  {
    id: 8,
    nombre: "Pollo",
    precio: 30,
    categoria: "pollo",
    imagen: "https://i.pinimg.com/736x/2d/a0/32/2da032c9780328c4ec17af2cfdd9b2a7.jpg",
    descripcion: "es ideal para las recetas que nos unen en familia: desde un sabroso ají de pollo, un reconfortante chairo, hasta el clásico pollo al horno con papas del domingo.",
    badge: "NATURAL"
  }
];

// Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const DOM = {
  contadorCarrito: document.getElementById('contadorCarrito'),
  listaCarrito: document.getElementById('listaCarrito'),
  totalCarrito: document.getElementById('totalCarrito'),
  btnCarrito: document.getElementById('btnCarrito'),
  carrito: document.getElementById('carrito'),
  cerrarCarrito: document.getElementById('cerrarCarrito'),
  vaciarCarrito: document.getElementById('vaciarCarrito'),
  finalizarCompra: document.getElementById('finalizarCompra'),
  gridProductos: document.getElementById('gridProductos'),
  filtroBtns: document.querySelectorAll('.filtro-btn'),
  formularioPedido: document.getElementById('formularioPedido')
};

// Emojis para categorías
const emojisCategoria = {
  res: "🐄",
  pollo: "🐔",
  cerdo: "🐖",
  premium: "🏆",
  default: "🥩"
};

// Función para guardar en localStorage
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Mostrar productos
function mostrarProductos(categoria = 'todos') {
  DOM.gridProductos.innerHTML = '';
  
  const productosFiltrados = categoria === 'todos' 
    ? productos 
    : productos.filter(producto => producto.categoria === categoria);
  
  productosFiltrados.forEach((producto, index) => {
    const emoji = emojisCategoria[producto.categoria] || emojisCategoria.default;
    const productoHTML = `
      <div class="producto" data-id="${producto.id}" style="animation-delay: ${0.1 * index}s">
        ${producto.badge ? `<span class="producto-badge">${producto.badge}</span>` : ''}
        <div class="producto-img-container">
          <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
        </div>
        <div class="producto-info">
          <h3>${emoji} ${producto.nombre}</h3>
          <p class="producto-desc">${producto.descripcion}</p>
          <div class="producto-precio">
            <div class="precio">${producto.precio} Bs/kg</div>
            <button class="btn-agregar" 
                    data-id="${producto.id}" 
                    data-nombre="${producto.nombre}" 
                    data-precio="${producto.precio}"
                    data-categoria="${producto.categoria}">
              Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    `;
    DOM.gridProductos.insertAdjacentHTML('beforeend', productoHTML);
  });
  
  // Agregar event listeners
  document.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', agregarAlCarrito);
  });
}

// Filtros de productos
DOM.filtroBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    DOM.filtroBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mostrarProductos(btn.dataset.categoria);
  });
});

// Carrito functions
function agregarAlCarrito(e) {
  const id = e.target.dataset.id;
  const producto = productos.find(p => p.id == id);
  
  const productoExistente = carrito.find(item => item.id == id);
  
  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    carrito.push({ 
      ...producto, 
      cantidad: 1 
    });
  }
  
  guardarCarrito();
  actualizarCarrito();
  mostrarNotificacion(`${producto.nombre} añadido al carrito`);
}

function actualizarCarrito() {
  DOM.listaCarrito.innerHTML = '';
  let total = 0;
  
  carrito.forEach(item => {
    const emoji = emojisCategoria[item.categoria] || emojisCategoria.default;
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    
    const li = document.createElement('div');
    li.className = 'carrito-item';
    li.innerHTML = `
      <div class="carrito-item-info">
        <div class="carrito-item-nombre">${emoji} ${item.nombre}</div>
        <div class="carrito-item-precio">${item.precio} Bs/kg</div>
      </div>
      <div class="carrito-item-cantidad">
        <button data-id="${item.id}" data-action="decrementar">-</button>
        <span>${item.cantidad}</span>
        <button data-id="${item.id}" data-action="incrementar">+</button>
      </div>
      <div class="carrito-item-subtotal">${subtotal.toFixed(2)} Bs</div>
      <button class="carrito-item-eliminar" data-id="${item.id}">
        <i class="fas fa-trash"></i>
      </button>
    `;
    DOM.listaCarrito.appendChild(li);
  });
  
  DOM.totalCarrito.textContent = total.toFixed(2);
  DOM.contadorCarrito.textContent = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  
  // Agregar event listeners
  document.querySelectorAll('[data-action="incrementar"]').forEach(btn => {
    btn.addEventListener('click', manejarCantidad);
  });
  
  document.querySelectorAll('[data-action="decrementar"]').forEach(btn => {
    btn.addEventListener('click', manejarCantidad);
  });
  
  document.querySelectorAll('.carrito-item-eliminar').forEach(btn => {
    btn.addEventListener('click', eliminarDelCarrito);
  });
}

function manejarCantidad(e) {
  const id = e.target.dataset.id;
  const action = e.target.dataset.action;
  const item = carrito.find(item => item.id == id);
  
  if (action === 'incrementar') {
    item.cantidad++;
  } else if (action === 'decrementar') {
    if (item.cantidad > 1) {
      item.cantidad--;
    } else {
      carrito = carrito.filter(i => i.id != id);
    }
  }
  
  guardarCarrito();
  actualizarCarrito();
}

function eliminarDelCarrito(e) {
  const id = e.target.closest('button').dataset.id;
  carrito = carrito.filter(item => item.id != id);
  guardarCarrito();
  actualizarCarrito();
  mostrarNotificacion('Producto eliminado');
}

DOM.vaciarCarrito.addEventListener('click', () => {
  carrito = [];
  guardarCarrito();
  actualizarCarrito();
  mostrarNotificacion('Carrito vaciado');
});

// Toggle carrito
DOM.btnCarrito.addEventListener('click', () => {
  DOM.carrito.classList.toggle('visible');
});

DOM.cerrarCarrito.addEventListener('click', () => {
  DOM.carrito.classList.remove('visible');
});

// Validación de teléfono
document.getElementById('telefono').addEventListener('input', function(e) {
  this.value = this.value.replace(/[^0-9]/g, '');
});

// Finalizar compra
// Por esta:
DOM.finalizarCompra.addEventListener('click', function(e) {
  e.preventDefault();
  // Cierra el carrito
  DOM.carrito.classList.remove('visible');
  // Desplázate a la sección de pedidos
  document.getElementById('pedido').scrollIntoView({ behavior: 'smooth' });
  // Enfoca el primer campo del formulario
  setTimeout(() => {
    document.getElementById('nombre').focus();
  }, 500);
});
DOM.formularioPedido.addEventListener('submit', function(e) {
  e.preventDefault();
  enviarPedidoWhatsApp();
});

// Enviar pedido a WhatsApp
function enviarPedidoWhatsApp() {
  const btnSubmit = document.querySelector('.btn-submit');
  btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  btnSubmit.disabled = true;

  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const notas = document.getElementById('notas').value.trim();
  const metodoEntrega = document.querySelector('input[name="entrega"]:checked').value;
  const empaque = document.querySelector('input[name="empaque"]:checked').value;
  const zona = document.getElementById('zona').value;
  const peso = document.getElementById('peso').value;
  
  // Validación
  if (!nombre || !telefono || !direccion) {
    mostrarNotificacion('❌ Complete los campos obligatorios');
    btnSubmit.innerHTML = '<i class="fab fa-whatsapp"></i> Enviar Pedido por WhatsApp';
    btnSubmit.disabled = false;
    return;
  }
  
  if (carrito.length === 0) {
    mostrarNotificacion('El carrito está vacío');
    btnSubmit.innerHTML = '<i class="fab fa-whatsapp"></i> Enviar Pedido por WhatsApp';
    btnSubmit.disabled = false;
    return;
  }
  
  // Calcular total productos
  let total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  
  // Calcular costo de empaque
  if (empaque === 'premium') total += 50;
  
  // Calcular costo de envío
  let costoEnvio = 0;
  let metodoEnvioTexto = '';
  
  switch(metodoEntrega) {
    case 'delivery-tarija':
      switch(zona) {
        case 'centro': costoEnvio = 15; break;
        case 'norte': 
        case 'sur': costoEnvio = 20; break;
        case 'alejada': costoEnvio = 30; break;
        default: costoEnvio = 20;
      }
      metodoEnvioTexto = `Delivery en Tarija (${zona ? zona : 'zona no especificada'}) - ${costoEnvio} Bs`;
      break;
      
    case 'bus':
      costoEnvio = peso >= 5 ? 30 : 15;
      metodoEnvioTexto = `Envío en Bus (${peso ? peso+' kg' : 'peso no especificado'}) - ${costoEnvio} Bs`;
      break;
      
    case 'avion':
      metodoEnvioTexto = `Envío por Avión (Consultar precio según destino y peso)`;
      break;
      
    default: // recoger
      metodoEnvioTexto = `Recoger en tienda - 0 Bs`;
  }
  
  total += costoEnvio;
  
  // Formatear productos
  const productosMsg = carrito.map(item => {
    const emoji = emojisCategoria[item.categoria] || emojisCategoria.default;
    return `${emoji} ${item.nombre} x${item.cantidad} = ${(item.precio * item.cantidad).toFixed(2)} Bs`;
  }).join('%0A');
  
  // Formatear mensaje
  const mensaje = `*🥩 PEDIDO PREMIUM - KARNE PREMIUM*%0A%0A` +
    `*👤 Cliente:*%0A${encodeURIComponent(nombre)}%0A%0A` +
    `*📞 Teléfono:*%0A${encodeURIComponent(telefono)}%0A%0A` +
    `*📍 Dirección:*%0A${encodeURIComponent(direccion)}%0A%0A` +
    `*🚚 Método de Entrega:*%0A${encodeURIComponent(metodoEnvioTexto)}%0A%0A` +
    (zona && metodoEntrega === 'delivery-tarija' ? `*🗺️ Zona:*%0A${encodeURIComponent(zona)}%0A%0A` : '') +
    (peso && (metodoEntrega === 'bus' || metodoEntrega === 'avion') ? `*⚖️ Peso:*%0A${encodeURIComponent(peso)} kg%0A%0A` : '') +
    `*🎁 Empaque:*%0A${empaque === 'premium' ? 'Premium (+50 Bs)' : 'Estándar'}%0A%0A` +
    `*🛒 Productos:*%0A${productosMsg}%0A%0A` +
    `*💰 Total:*%0A${total.toFixed(2)} Bs%0A%0A` +
    (notas ? `*📝 Notas:*%0A${encodeURIComponent(notas)}%0A%0A` : '') +
    `*⏰ Fecha:*%0A${new Date().toLocaleString('es-BO')}%0A%0A` +
    `_Gracias por su pedido_ ❤️`;
  
  // Restaurar botón después de 1.5 segundos
  setTimeout(() => {
    btnSubmit.innerHTML = '<i class="fab fa-whatsapp"></i> Enviar Pedido por WhatsApp';
    btnSubmit.disabled = false;
  }, 1500);

  // Abrir WhatsApp
  setTimeout(() => {
    window.open(`https://wa.me/59174505984?text=${mensaje}`, '_blank');
    mostrarNotificacion('Redirigiendo a WhatsApp...');
  }, 1000);
}

// Notificaciones
function mostrarNotificacion(mensaje) {
  const notificacion = document.createElement('div');
  notificacion.className = 'notificacion';
  notificacion.innerHTML = `<i class="fas fa-check-circle"></i> ${mensaje}`;
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.classList.add('mostrar');
  }, 10);
  
  setTimeout(() => {
    notificacion.classList.remove('mostrar');
    setTimeout(() => {
      document.body.removeChild(notificacion);
    }, 300);
  }, 3000);
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  mostrarProductos();
  actualizarCarrito();
  
  // Cerrar carrito al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!DOM.carrito.contains(e.target) && e.target !== DOM.btnCarrito) {
      DOM.carrito.classList.remove('visible');
    }
  });
   // Mostrar/ocultar campos según método de envío
   document.querySelectorAll('input[name="entrega"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const zonaContainer = document.getElementById('zona-container');
      const pesoContainer = document.getElementById('peso-container');
      
      if (this.value === 'delivery-tarija') {
        zonaContainer.style.display = 'block';
        pesoContainer.style.display = 'none';
      } else if (this.value === 'bus' || this.value === 'avion') {
        zonaContainer.style.display = 'none';
        pesoContainer.style.display = 'block';
      } else {
        zonaContainer.style.display = 'none';
        pesoContainer.style.display = 'none';
      }
    });
  });
});
