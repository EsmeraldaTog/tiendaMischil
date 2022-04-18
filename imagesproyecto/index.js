let formu = document.getElementById("formulario")
var productos = []
const div__creado = document.querySelector("section__cont")
const botonSumar = document.getElementById('suma')
const contenedor = document.getElementById("productos") 




const RecibirInfo = ()=>{

/*capturo evento cuando envio inf. a travez de un formulario*/
let x = formu.addEventListener("submit",envio)
function envio (e){
    
    /*prevengo la actualización para evitar la perdida de datos form*/   
    e.preventDefault(e)

    /*capturo mi html*/   
    let form = e.target

    /*imprimo en los cont hijos en cierta posición para obtener info. del Form*/
    const producto = form.children[1].value
    const cantidad = form.children[3].value
    const precio = form.children[5].value
    const newObj ={
        producto : producto,
        cantidad : cantidad,
        precio:precio,
        precioTotal : precio * cantidad
    }
        productos.push(newObj)

    

    const agregar = document.createElement("div")
    agregar.classList.add("section__cont")
    const add = document.createElement("ul")
    add.classList.add("ul__class")
   

    add.innerHTML = `<li>Nombre: ${producto}</li><li> Cantidad: ${cantidad}</li> <li>Precio total :$${precio * cantidad}</li>`
    //devuelve el valor del input en mi HTML
    agregar.innerHTML =`<img src="./imgs/carrito.jpg" class="imgs"> `
    
    agregar.appendChild(add)
    contenedor.appendChild(agregar)
console.log(productos)
}}





botonSumar.onclick =  () =>{

    const numeros = productos.map( x =>x.precioTotal)
    console.log(numeros)
    let total = numeros.reduce((a, b) => a + b, 0)
    console.log(total)

}

console.log(productos)
RecibirInfo()


