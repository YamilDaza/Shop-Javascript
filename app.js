/* DOM PARTE #2
El burbujeo y la captura: 
El burbujeo y la captura de eventos son dos mecanismos que describen lo que sucede cuando dos controladores del mismo tipo de evento se activan en un elemento. 

const padre = document.querySelector('.border-primary');
const hijo = document.querySelector('.border-secondary');
const nieto = document.querySelector('.border-danger');
// console.log(padre);
// console.log(hijo);
// console.log(nieto);

// - Fase de burbuja (bubbling): Se propaga desde el elemento hijo hasta el padre. (comportamiento por DEFECTO y recibe como 3er parametro el valor falso, al poner en true generamos el mecanismo de captura ***
// padre.addEventListener('click', () => console.log('Me diste click PADRE'));
// hijo.addEventListener('click', () => console.log('Me diste click HIJO'));
// nieto.addEventListener('click', () => console.log('Me diste click NIETO'));

// - Fase de captura: Se propaga desde el elemento padre hasta el hijo***
padre.addEventListener('click', (e) => console.log('Me diste click PADRE'),true);
hijo.addEventListener('click', (e) => console.log('Me diste click HIJO'),true);
nieto.addEventListener('click', (e) => console.log('Me diste click NIETO'),true);


//PARA EVITAR EL BURBUJEO O CAPTURA, USAREMOS -> StopProgagation: evita la propagación adicional del evento actual en las fases de captura y bubbling.

const cajas = document.querySelectorAll('.border');
cajas.forEach((caja) => {
    caja.addEventListener('click', (event) => {
        //Con la siguiente linea de codigo evitamos el burbujeo y captura:
        event.stopPropagation();
        console.log(`Me diste click`);
    })
})

- PreventDefault: Cancela el evento si este ES CANCELABLE, sin detener el resto del funcionamiento del evento, es decir, puede ser llamado de nuevo.
const formulario = document.querySelector('form');
// console.log(formulario);
formulario.addEventListener('submit', (e) => {
    e.preventDefault(); //Detenemos lo que hace por defecto el navegador.
    console.log('click');
})

const ancla = document.querySelector('a');
ancla.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Me diste click');
});


- Delegacion de Eventos: La delegación de eventos es básicamente un patrón para manejar eventos de manera eficiente.
En lugar de agregar un detector de eventos a todos y cada uno de los elementos similares, podemos agregar un detector de eventos a un elemento principal y llamar a un evento en un objetivo en particular utilizando la propiedad .target del objeto de evento.
Así evitamos la propagación 👌

*** matches: El método matches() comprueba si el Element sería seleccionable por el selector CSS especificado en la cadena; en caso contrario, retorna false.

const container = document.querySelector('.container');
container.addEventListener('click', (e) => {
    //con el e.target accedemos a cada componente en contexto general, dependiendo de sus etiquetas tambien podemos acceder.
    // console.log(e.target); 
    
    if(e.target.id === 'padre'){
        console.log('Me diste click Padre')
    }else if(e.target.id === 'hijo'){
        console.log('Me diste click HIJO')
    }
    
    // console.log(e.target.matches(".border-danger"));
    if (e.target.matches(".border-danger")) {
        console.log("diste click en el nieto");
    }
    
    // data-set
    // console.log(e.target.dataset["div"]);
    // console.log(e.target.dataset.div);
    if (e.target.dataset["div"] === "divPadre") {
        console.log("diste click en padre");
    }  
});

PRACTICA -------------------------------------------------------- 
*/
const carrito = document.querySelector('#carrito');
const template = document.querySelector('#template');
const footer = document.querySelector('#footer');
const templateFooter = document.querySelector('#templateFooter');
const fragment = document.createDocumentFragment();

let carritoCompras = [];
document.addEventListener('click', (e) => {
    //dentro del documento general, queremos capturas los 3 botones de agregar
    // console.log(`me diste click ${e.target.dataset.fruta}`);
    if(e.target.matches('.card .btn-primary')){
        // console.log('Me diste click');
        agregarAlCarrito(e); //function 
    }

    if(e.target.matches('.list-group-item .btn-success')){
        btnAgregar(e);
    }
    if(e.target.matches('.list-group-item .btn-danger')){
        btnQuitar(e);
    }

});

const agregarAlCarrito = (e) => {
    // console.log(`compraste: ${e.target.dataset.fruta}`);

    const producto = {
        titulo: e.target.dataset.fruta,
        id: e.target.dataset.fruta,
        cantidad: 1,
        precio: parseInt(e.target.dataset.precio),
    }
    // console.log(producto);

    const indice = carritoCompras.findIndex((item) => item.id === producto.id);
    // console.log(indice);
    //con el indice en -1 me indica que dicho producto no se encuentra en nuestro array de compras, por lo tanto realizamos un push, *
    if(indice === -1){
        carritoCompras.push(producto);
    } else{ //*PERO si el elemento existe, le sumamos uno a la cantidad de dicho producto
        carritoCompras[indice].cantidad ++;
    }

    //mostramos en nuestro documento html los template
    pintarCarrito();
};

const pintarCarrito = () => {
    carrito.textContent = "";

    carritoCompras.forEach((item) => {
        const clone = template.content.cloneNode(true);
        clone.querySelector('.text-white .lead').textContent = item.titulo;
        clone.querySelector('.text-white .badge').textContent = item.cantidad;
        clone.querySelector('div .lead span').textContent = item.precio * item.cantidad;

        //le estamos agregando de forma dinamica el dataset
        clone.querySelector('.btn-danger').dataset.id = item.id;
        clone.querySelector('.btn-success').dataset.id = item.id;

        fragment.appendChild(clone);
    });

    carrito.appendChild(fragment);
    pintarFooter();
};

const pintarFooter = () => {
    footer.textContent = "";

    const total = carritoCompras.reduce((acc,valorActual) => {
        return acc + valorActual.cantidad * valorActual.precio;
    },0);
    // console.log(total);
    
    const clone = templateFooter.content.cloneNode(true);
    clone.querySelector('.lead span').textContent = total;

    
    total > 0 ? footer.appendChild(clone):'';
};

const btnAgregar = (e) => {
    // console.log('Me diste click');
    carritoCompras = carritoCompras.map((item) => {
        if(item.id === e.target.dataset.id){
            item.cantidad ++;
        }
        return item;
    });

    pintarCarrito();
}

const btnQuitar = (e) => {
    // console.log(e.target.dataset.id);
    carritoCompras = carritoCompras.filter((item) => {
        if(item.id === e.target.dataset.id){
            if(item.cantidad > 0){
                item.cantidad --;
                if(item.cantidad === 0) return
                return item
            }
        }else {return item};
    });
    pintarCarrito();
};























