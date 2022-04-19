//Obtenemos los datos del local storage del contenido del carrito y lo guardo en una variable
let elementosLs = localStorage.getItem("carritoCompras");
let carritoCompras = [];
let total1 = 0;

document.addEventListener("DOMContentLoaded", (e) => {
  fetchData();
});

const productosInventario = document.querySelector("#productos__card");
const productosCarrito = document.querySelector("#carrito");
const productosFila = document.querySelector("#cart");
const bottonBorrar = document.createElement("button");
const botonFinalizarCompra = document.createElement("button");
const tbody = document.querySelector("#body__tabla");
tbody.innerText = "NO EXISTE PRODUCTOS EN SU CARRITO";
const footerCarrito = document.querySelector("footer__cart");
const total = document.querySelector("#total_cart");
const cantidadProductos = document.querySelector("#carrito_cantidad");
const busqueda = document.querySelector("#search")

const fetchData = async () => {
  const res = await fetch("data.json");
  const data = await res.json();
  console.log(data);
  pintarproductosInventario(data);
};

//funcion para pintar los productos que traemos desde un Archivo JSON LOCAL
function pintarproductosInventario(data) {
  data.forEach((element) => {
    const productoDiv = document.createElement("div");
    productoDiv.classList.add(
      "card",
      "col-sm-3",
      "col-lg-3",
      "col-md-6",
      "text-center"
    );

    const productoCard = document.createElement("div");
    productoCard.classList.add("card-body");

    const productoImagen = document.createElement("img");
    productoImagen.classList.add("imagen", "card-img-top");
    productoImagen.setAttribute("src", element.imagen);

    const productoCardTitulo = document.createElement("h5");
    productoCardTitulo.classList.add("card-title", "text-center");
    productoCardTitulo.innerText = element.nombre;

    const productoPrecio = document.createElement("p");
    productoPrecio.classList.add("card-text");
    productoPrecio.innerText = `$ ${element.precio}`;

    const botonComprar = document.createElement("button");
    botonComprar.classList.add("btn", "boton__compra", "text-center");
    botonComprar.innerHTML = `<i class="fa-solid fa-cart-plus"> </i>`;
    botonComprar.setAttribute("marcador", element.id);
    botonComprar.setAttribute("data-pushbar-target", "pushbar-carrito");
    botonComprar.addEventListener("click", () => agregarProducto(element));
    

    productoCard.appendChild(productoImagen);
    productoCard.appendChild(productoCardTitulo);
    productoCard.appendChild(productoPrecio);
    productoCard.appendChild(botonComprar);
    productoDiv.appendChild(productoCard);
    //  divCard.appendChild(productoDiv)
    productosInventario.appendChild(productoDiv);
  });
}




filtraProductos(".filtro",".card")

function filtraProductos(input,selector) {
  
 document.addEventListener("keyup",(e) =>{
      if(e.target.matches(input)){
          if(e.key == 'Escape') e.target.value = '';

          // Filtro para buscar las coincidencias
         document.querySelectorAll(selector).forEach(el =>el.textContent.includes(e.target.value.toUpperCase())
              ?el.classList.remove('filtrados')
              :el.classList.add('filtrados'))
    }
  })
}

//FUNCION PARA AGREGAR PRODUCTOS AL CARRITO DE COMPRAS

function agregarProducto(element) {
  //realizo una destructuracion del objeto elemento para poder trabajar solo con 4 propiedades del objeto y agrego la propiedad cantidad
  let { id, nombre, precio, cantidad = 1 } = element;

  //si el producto ya se encuentra en el carrito incrementa la cantidad
  let idProductoRepetido = carritoCompras.find((e) => e.id === id);
  if (idProductoRepetido) {
    idProductoRepetido.cantidad++;
  } else {
    carritoCompras.push({ id, nombre, precio, cantidad });
  }
  console.log(carritoCompras);
  Toastify({
    text: "Se ha agreado un producto al carrito",
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "bottom", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover

    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
  subtotalCompra();
  pintarCarrito();
  localStorage.setItem("carritoCompras", JSON.stringify(carritoCompras));
}



if (elementosLs) {
  carritoCompras = JSON.parse(elementosLs);
  pintarCarrito();
}
// else {

//   tbody.innerText = "NO EXISTE PRODUCTOS EN SU CARRITO";}



///FUNCION PARA PINTAR LOS PRODUCTOS DEL CARRITO EN UNA TABLA

function pintarCarrito() {
  tbody.innerText = "";

  carritoCompras.forEach((product) => {
    const tr = document.createElement("tr");

    // const nodoTd1 = document.createElement("td");
    // nodoTd1.innerText = product.id;

    const nodoTd2 = document.createElement("td");
    nodoTd2.innerText = product.nombre;

    const nodoTd3 = document.createElement("td");
    nodoTd3.innerText = product.precio;

    const nodoTd4 = document.createElement("td");
    nodoTd4.innerText = product.cantidad;

    const nodoTd5 = document.createElement("td");
    nodoTd5.textContent = product.precio * product.cantidad;

    const deleteProducto = document.createElement("button");
    deleteProducto.classList.add("eliminarProducto");
    deleteProducto.innerHTML = `<i class="fas fa-thin fa-trash"> </i>`;

    deleteProducto.addEventListener("click", () => eliminarProducto(product));

    cantidadProductos.innerText = cantidadProducts();
    total.textContent = `Total $ ${subtotalCompra()}`;

    botonFinalizarCompra.classList.add("boton__total", "boton__carrito");
    botonFinalizarCompra.innerText = "Finalizar Compra";
    botonFinalizarCompra.addEventListener("click", calcularTotal);

    bottonBorrar.classList.add("boton__carrito");
    bottonBorrar.innerText = "Vaciar Carrito";
    bottonBorrar.addEventListener("click", borrarCarrito);

    // tr.appendChild(nodoTd1);
    tr.appendChild(nodoTd2);
    tr.appendChild(nodoTd3);
    tr.appendChild(nodoTd4);
    tr.appendChild(nodoTd5);
    tr.appendChild(deleteProducto);
    tbody.appendChild(tr);
    productosFila.appendChild(tbody);
    productosCarrito.appendChild(botonFinalizarCompra);
    productosCarrito.appendChild(bottonBorrar);
  });

}


function cantidadProducts() {
  let totalItems = 0;
  totalItems = carritoCompras.reduce(
    (acumulador, elemento) => acumulador + elemento.cantidad,
    0
  );
  return totalItems;
}

function eliminarProducto(product) {
  let indexDelete = carritoCompras.indexOf(product);
  carritoCompras.splice(indexDelete, 1);
  localStorage.setItem("carritoCompras", JSON.stringify(carritoCompras));
  total.textContent = 0;
  cantidadProductos.textContent=""
  pintarCarrito();
  subtotalCompra();
  
  
}

function subtotalCompra() {
  subtotal = carritoCompras.reduce(
    (acumulador, elemento) => acumulador + elemento.precio * elemento.cantidad,
    0
  );
  return subtotal;
}



function calcularTotal() {
  if (subtotal !== 0) {
    if (subtotal >= 300) {
      swal({ title: "Tu compra incluye envio", icon: "success" })
    
    }
    else{
      (swal({
      title: "La compra actual no incluye envio gratis",
      text: "Se agregar un costo de envio de $100 a cualquier lugar de la Republica Mexicana",
      icon: "warning"
    }))
     subtotal= subtotal + 100
     
    }
} 
else {
    swal({ title: "No tienes agregados productos", icon: "warning" })
    
  }
  
 
  total.textContent = `Total de ${subtotal}`;
  console.log(`Total de su compra: ${subtotal}`);
  console.log(`cantidad de Articulos comprados ${carritoCompras.length}`);
  borrarCarrito()
}




function borrarCarrito() {
  carritoCompras = [];
 
  total.textContent = 0;

  cantidadProductos.textContent = 0;
  localStorage.clear();
  pintarCarrito();
}
