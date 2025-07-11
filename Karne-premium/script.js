// Base de datos de productos premium
const productos = [
    {
      id: 1,
      nombre: "Ribeye Angus",
      precio: 85,
      categoria: "premium",
      imagen: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      descripcion: "Corte premium con marmoleo grado 4, madurado 28 días",
      badge: "TOP SELLER"
    },
    {
      id: 2,
      nombre: "Lomo de Res",
      precio: 65,
      categoria: "res",
      imagen: "https://images.unsplash.com/photo-1618841507238-4f5c6b2b1c1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      descripcion: "Corte tierno, madurado 21 días, ideal para filetes",
      badge: "RECOMENDADO"
    },
    {
      id: 3,
      nombre: "Pechuga de Pollo Orgánico",
      precio: 35,
      categoria: "pollo",
      imagen: "https://images.unsplash.com/photo-1604977048617-3ab47445752b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      descripcion: "Pollo criado libre de jaulas, alimentación natural",
      badge: "ORGÁNICO"
    },
    {
      id: 4,
      nombre: "Costillas de Cerdo BBQ",
      precio: 45,
      categoria: "cerdo",
      imagen: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      descripcion: "Corte especial para parrilla, con marinada incluida",
      badge: "PROMO"
    },
    {
      id: 5,
      nombre: "Wagyu Boliviano",
      precio: 120,
      categoria: "premium",
      imagen: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      descripcion: "Exclusivo corte con marmoleo grado 5, edición limitada",
      badge: "EXCLUSIVO"
    },
    {
      id: 6,
      nombre: "Entraña Premium",
      precio: 70,
      categoria: "res",
      imagen: "https://images.unsplash.com/photo-1618841507238-4f5c6b2b1c1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      descripcion: "Corte jugoso con vetas de grasa, maduración 25 días",
      badge: "CHEF'S CHOICE"
    },
    {
      id: 7,
      nombre: "Chorizo Artesanal",
      precio: 40,
      categoria: "cerdo",
      imagen: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      descripcion: "Elaborado con especias tradicionales, ahumado natural",
      badge: "ARTESANAL"
    },
    {
      id: 8,
      nombre: "Pollo de Campo",
      precio: 30,
      categoria: "pollo",
      imagen: "https://images.unsplash.com/photo-1604977048617-3ab47445752b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      descripcion: "Criado al aire libre, textura firme y sabor intenso",
      badge: "NATURAL"
    }
  ];

  // Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || []; // Modifica esta línea

// Función para guardar en localStorage (añade esto)
function guardarCarrito() {
localStorage.setItem('carrito', JSON.stringify(carrito));
}
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

  // Mostrar productos
  function mostrarProductos(categoria = 'todos') {
    DOM.gridProductos.innerHTML = '';
    
    const productosFiltrados = categoria === 'todos' 
      ? productos 
      : productos.filter(producto => producto.categoria === categoria);
    
    productosFiltrados.forEach(producto => {
      const emoji = emojisCategoria[producto.categoria] || emojisCategoria.default;
      const productoHTML = `
        <div class="producto" data-id="${producto.id}">
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
    
    actualizarCarrito();
    guardarCarrito(); // Añade esta línea
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
    guardarCarrito(); // Añade esta línea
    actualizarCarrito();
  }

  function eliminarDelCarrito(e) {
    const id = e.target.closest('button').dataset.id;
    carrito = carrito.filter(item => item.id != id);
    guardarCarrito(); // Añade esta línea
    actualizarCarrito();
    mostrarNotificacion('Producto eliminado');
  }

  DOM.vaciarCarrito.addEventListener('click', () => {
    carrito = [];
    guardarCarrito(); // Añade esta línea
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

  // Finalizar compra
  DOM.finalizarCompra.addEventListener('click', enviarPedidoWhatsApp);
  DOM.formularioPedido.addEventListener('submit', function(e) {
    e.preventDefault();
    enviarPedidoWhatsApp();
  });
// Validación de teléfono (solo números) - Añade esto:
document.getElementById('telefono').addEventListener('input', function(e) {
this.value = this.value.replace(/[^0-9]/g, '');
});
  // Enviar pedido a WhatsApp
  function enviarPedidoWhatsApp() {
    // Añade estas líneas al inicio:
const btnSubmit = document.querySelector('.btn-submit');
btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
btnSubmit.disabled = true;

    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const notas = document.getElementById('notas').value.trim();
    const metodoEntrega = document.querySelector('input[name="entrega"]:checked').value;
    const empaque = document.querySelector('input[name="empaque"]:checked').value;
    
     // Validación añadida:
if (!nombre || !telefono || !direccion) {
  mostrarNotificacion('❌ Complete todos los campos obligatorios');
  return; // Detiene la función si hay errores
}
    
    if (carrito.length === 0) {
      mostrarNotificacion('El carrito está vacío');
      return;
    }
    
    // Calcular total
    let total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    if (metodoEntrega === 'delivery') total += 30;
    if (empaque === 'premium') total += 50;
    
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
      `*🚚 Entrega:*%0A${metodoEntrega === 'delivery' ? 'Delivery (+30 Bs)' : 'Recoger en tienda'}%0A%0A` +
      `*🎁 Empaque:*%0A${empaque === 'premium' ? 'Premium (+50 Bs)' : 'Estándar'}%0A%0A` +
      `*🛒 Productos:*%0A${productosMsg}%0A%0A` +
      `*💰 Total:*%0A${total.toFixed(2)} Bs%0A%0A` +
      (notas ? `*📝 Notas:*%0A${encodeURIComponent(notas)}%0A%0A` : '') +
      `*⏰ Fecha:*%0A${new Date().toLocaleString('es-BO')}%0A%0A` +
      `_Gracias por su pedido_ ❤️`;
    
      // Al final de la función (antes de abrir WhatsApp), restaura el botón:
setTimeout(() => {
  btnSubmit.innerHTML = '<i class="fab fa-whatsapp"></i> Enviar Pedido por WhatsApp';
  btnSubmit.disabled = false;
}, 2000);
    // Abrir WhatsApp
    window.open(`https://wa.me/59174505984?text=${mensaje}`, '_blank');
    
    // Opcional: Resetear
    // carrito = [];
    // actualizarCarrito();
    // DOM.carrito.classList.remove('visible');
    // DOM.formularioPedido.reset();
    
    mostrarNotificacion('Redirigiendo a WhatsApp...');
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
    
    // Cerrar carrito al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!DOM.carrito.contains(e.target) && e.target !== DOM.btnCarrito) {
        DOM.carrito.classList.remove('visible');
      }
    });
  });