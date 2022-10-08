class Producto {
  constructor(id, nombre, precio, cant, categoria, img, descrip) {
    this.id = id;
    this.nombre = nombre;
    this.valorUnidad = parseFloat(precio);
    this.stock = cant; /* cant === 0 || cant === "" ? 1 : parseInt(cant); */ //dejamos que por defecto ponga 1 si no obtenemos un resultado
    this.categ =
      categoria === "" ||
      (categoria != "E" && categoria != "L" && categoria != "A")
        ? "O"
        : categoria; //Colocamos la validacion para evitar un valor no deseado
    this.img = img === "" ? "#" : img;
    this.descrip = descrip === "" ? "Sin descripción del producto" : descrip;
    this.activo = this.stock === 0 ? false : true; // campo que sera utilizado en próximos envios para filtrar productos que queden sin stock
  }
  categoria = () => {
    //la funcion permite mostrar el nombre de la categoria dependiendo de la Letra que tenga en dicho campo
    if (this.categ === "E") {
      return "Electrodomesticos";
    } else if (this.categ === "A") {
      return "Almacen";
    } else if (this.categ === "L") {
      return "Libreria";
    } else {
      return "Otros";
    }
  };
}

class ElementoCarrito {
  constructor(producto, cantidad) {
    this.producto = producto;
    this.cantidad = cantidad;
  }
}

/* INICIO - buscador de productos */

document.addEventListener("keyup", (e) => {
  if (e.target.matches("#buscadorProd")) {
    document.querySelectorAll(".cont_Prod_Carrito").forEach((produBusacado) => {
      produBusacado.textContent
        .toLowerCase() //convierto el resultado en minusculas
        .includes(e.target.value.toLowerCase()) //la condicion verifica si el valor del evento conicide con el texto del elemento de la clase "cont_Prod_Carrito"
        ? produBusacado.classList.remove("filtro") //saco la clase filtro si se cumple la condicion
        : produBusacado.classList.add("filtro"); //agrego la clase filtro si no se cumple la condicion
    });
  }
});

/* FIN - buscador de productos */

const ctrlStockProd = (prod) => {
  let valor = false;
  productos.map((item) => {
    if (item.id === prod.producto.id && item.stock > 0) {
      valor = true;
    }
  });

  return valor;
};

const sumProdCarrito = (prodCarr) => {
  elementosCarrito.map((item) => {
    if (item.producto.id === prodCarr?.producto?.id) {
      item.cantidad = item.cantidad + 1;
    }
  });

  productos.map((valorProd) => {
    if (valorProd.id === prodCarr?.producto?.id) {
      valorProd.stock = valorProd.stock - 1;
    }
  });
};

const restaProdCarrito = (prodCarr) => {
  elementosCarrito.map((item) => {
    if (item.producto.id === prodCarr.producto.id) {
      item.cantidad = item.cantidad - 1;
    }
  });
};

const restCantProd = (element) => {
  productos.map((valorProd) => {
    if (valorProd.id === element?.producto?.id) {
      valorProd.stock = valorProd.stock - 1;
    }
  });
};

const sumCantProdDelete = (element) => {
  productos.map((valorProd) => {
    if (valorProd.id === element?.producto?.id) {
      valorProd.stock = element.cantidad + valorProd.stock;
    }
  });
};

const cantProdCarritoIcono = () => {
  if (elementosCarrito.length > 0) {
    carrito_GloboCant1.innerText = elementosCarrito.length;
    carrito_GloboCant1.setAttribute(
      "style",
      "position: absolute;background: red;font-size: 0.6rem;left: 24%; display:flex;bottom: 25%;"
    );

    carrito_GloboCant2.innerText = elementosCarrito.length;
    carrito_GloboCant2.setAttribute(
      "style",
      "position: absolute;background: red;font-size: 0.6rem;left: 30%; display:flex"
    );
  } else {
    carrito_GloboCant1.setAttribute(
      "style",
      "position: absolute;background: red;font-size: 0.6rem;left: 30%; display:none"
    );

    carrito_GloboCant2.setAttribute(
      "style",
      "position: absolute;background: red;font-size: 0.6rem;left: 30%; display:none"
    );
  }
};

/* Realizamos una funcion Asincronica para traer los productos a travez del Json con ruta relativa*/

const recibeJson = async () => {
  try {
    const response = await fetch("./productos.json");

    if (response.ok) {
      const jsonResponse = await response.json();

      jsonResponse.forEach((prod) => {
        productos.push({ ...prod, prod }); //agregamos en el array los productos que obtenemos desde Json local
      });
      console.log(productos);
      mostrar();
    }
  } catch (error) {
    console.log(error);
  }
};

/* Creamos la funcion que mostrara los productos en pantalla */

const mostrar = () => {
  section_ProdCarrito.innerHTML = "";

  productos.forEach((producto) => {
    if (producto.stock > 0) {
      contProdCarrito = document.createElement("div");
      contProdCarrito.className = "card row g-0 m-1 cont_Prod_Carrito";

      carrito_Cont_img = document.createElement("div");
      carrito_Cont_img.className = "col-md-2 col-12 d-flex";

      contImgCarrito = document.createElement("img");
      contImgCarrito.className = "img-fluid rounded-start carrito__img_art";
      contImgCarrito.src = producto.img;
      contImgCarrito.alt = "img_carrito";

      prodSeccion1Carrito = document.createElement("div");
      prodSeccion1Carrito.className = "col-md-6 col-12";

      carrito_CardBody = document.createElement("div");
      carrito_CardBody.className = "card-body";

      carrito_TituloProducto = document.createElement("h5");
      carrito_TituloProducto.className = "card-title";
      carrito_TituloProducto.innerHTML = producto.nombre;

      carrito_descripProd = document.createElement("p");
      carrito_descripProd.className = "card-text";
      carrito_descripProd.innerHTML = producto.descrip;

      carrito_ContBtnAgregar = document.createElement("div");
      carrito_ContBtnAgregar.className =
        "col-md-2 col-12 d-flex justify-content-center align-self-center";
      carrito_btnAgregar = document.createElement("button");
      carrito_btnAgregar.className = "btn btn-primary";
      carrito_btnAgregar.value = "Agregar";
      carrito_btnAgregar.innerHTML = "AGREGAR";
      carrito_btnAgregar.id = `idbtn_${producto.id}`;

      /* genero la accion del evento que va realizar el boton agregar de cada producto */
      carrito_btnAgregar.addEventListener("click", () => {
        let elementoCarrito = new ElementoCarrito(producto, 1);
        let modifProd = elementosCarrito.find(
          (item) => item.producto.id === elementoCarrito.producto.id
        ); //verifico si el producto que estoy agregadon ya existe en el array del carrito
        if (ctrlStockProd(elementoCarrito)) {
          if (modifProd) {
            /*  usamos Alert de la librerira "sweetalert2" */
            Swal.fire({
              icon: "info",
              /*   title: 'MODIFICAMOS', */
              text: `Fue sumada una unidad mas del producto "${elementoCarrito.producto.nombre}" al CARRITO`,
            });

            sumProdCarrito(modifProd);
            localStorage.setItem("Carrito", JSON.stringify(elementosCarrito));
            dibujarCarrito();
            mostrar();
          } else {
            elementosCarrito.push(elementoCarrito);

            localStorage.setItem("Carrito", JSON.stringify(elementosCarrito)); //guardamos el elemento en el carrito
            restCantProd(elementoCarrito);

            /*  usamos Alert de la librerira "sweetalert2" */
            Swal.fire({
              icon: "success",
              text: `Producto Agregado al CARRITO`,
            });

            cantProdCarritoIcono();
            dibujarCarrito();
            mostrar();
          }
        } else {
          Swal.fire({
            icon: "warning",
            text: `Sin stock del producto ${elementoCarrito.producto.nombre}`,
          });
          mostrar();
        }
      }); // FIN DEL ONCLIK

      carrito_precio = document.createElement("div");
      carrito_precio.className =
        "col-md-2 d-flex carrito__cont_cant_art flex-column";
      carrito_precio.innerHTML = `<h2>$${producto.valorUnidad}</h2> <h6>STOCK:</h6> <h3>${producto.stock}</h3>`;

      /* acomdamos los elemento con sus elementos padres e hijos para poder mostrarse en pantalla */
      section_ProdCarrito?.append(contProdCarrito);
      contProdCarrito.append(
        carrito_Cont_img,
        prodSeccion1Carrito,
        carrito_precio,
        carrito_ContBtnAgregar
      );
      carrito_ContBtnAgregar.append(carrito_btnAgregar);
      carrito_Cont_img.appendChild(contImgCarrito);

      prodSeccion1Carrito.appendChild(carrito_CardBody);
      carrito_CardBody.append(carrito_TituloProducto, carrito_descripProd);
    }
  });
};

// FUNCION PARA GENERAR LA VISTA DEL CARRITO DENTRO DEL MODAL

const dibujarCarrito = () => {
  let sumaCarrito = 0;
  contenedorCarritoCompras.innerHTML = "";

  elementosCarrito.forEach((elemento) => {
    let renglonesCarrito = document.createElement("tr");

    renglonesCarrito.innerHTML = `
                <td>${elemento.producto.id}</td>
                <td>${elemento.producto.nombre}</td>
                <td><input id="cantidad-producto-${
                  elemento.producto.id
                }" type="number" value="${
      elemento.cantidad
    }"disabled step="1" style="width:3rem;"/></td>
                <td>$ ${elemento.producto.valorUnidad}</td>
                <td>$ ${estandarDolaresAmericanos.format(
                  elemento.producto.valorUnidad * elemento.cantidad
                )}</td>
                <td><button id="eliminar-producto-${
                  elemento.producto.id
                }" type="button" class="btn btn-danger"><i class="bi bi-trash-fill">Eliminar</i></button></td>
         
            `;

    contenedorCarritoCompras?.append(renglonesCarrito);

    sumaCarrito += elemento.cantidad * elemento.producto.valorUnidad;

    //agregamos evento a carrito
    let cantidadProductos = document.getElementById(
      `cantidad-producto-${elemento.producto.id}`
    );

    cantidadProductos.addEventListener("change", (e) => {
      let nuevaCantidad = e.target.value;
      elemento.cantidad = nuevaCantidad;
      dibujarCarrito();
      mostrar();
    });

    //Agregar evento a eliminar producto
    let botonEliminarProducto = document.getElementById(
      `eliminar-producto-${elemento.producto.id}`
    );
    botonEliminarProducto.addEventListener("click", () => {
      let indiceEliminar = elementosCarrito.indexOf(elemento); //se obtiene la posicion del elemento en el array
      elementosCarrito.splice(indiceEliminar, 1); // se agrega el indice del elemento a eliminar y se indica que se borre un elemento con el número "1"

      sumCantProdDelete(elemento);
      localStorage.setItem("Carrito", JSON.stringify(elementosCarrito));

      dibujarCarrito(); // volvemos a crear el carrito
      cantProdCarritoIcono();
      mostrar();
    });
  });

  if (elementosCarrito.length == 0) {
    contenedorFooterCarrito.innerHTML = `
            <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `;
  } else {
    contenedorFooterCarrito.innerHTML = `
            <th scope="row" colspan="5">Total de la compra: $${estandarDolaresAmericanos.format(
              sumaCarrito
            )}</th>
        `;
  }
};

/* declaramos la/las variables */
const productos = [];
let elementosCarrito = [];
let arrayLocalStorage = localStorage.getItem("Carrito"); //obtengo el valor depositado en el local stortage

if (arrayLocalStorage) {
  elementosCarrito = JSON.parse(arrayLocalStorage);
}

const section_ProdCarrito = document.querySelector("#section_ProdCarrito");
const contenedorCarritoCompras = document.querySelector("#items");
const contenedorFooterCarrito = document.querySelector("#footer");
const estandarDolaresAmericanos = Intl.NumberFormat("en-US");
let categProducto;
let nombreProducto;
let contProdCarrito;
let carrito_Cont_img;
let contImgCarrito;
let prodSeccion1Carrito;
let carrito_CardBody;
let carrito_TituloProducto;
let carrito_descripProd;
let carrito_ContBtnAgregar;
let carrito_btnAgregar;
let carrito_precio;
let iconoCarritoMobile = document.getElementById("carrito_iconoMobile");
let iconoCarrito = document.getElementById("icono_Carrito");
let modal = document.getElementById("exampleModal");
let modal_Contenido = document.getElementById("modal_contenido");

iconoCarrito.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "block";
  modal.className = "modal fade show";
});

iconoCarritoMobile.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "block";
  modal.className = "modal fade show";
});

let modalBtnCerrar = document.getElementById("Modal_btn_Cerrar");
modalBtnCerrar.addEventListener("click", () => {
  modal.className = "modal fade";
  modal.style.display = "none";
});

let modalIconCerrar = document.getElementById("modalIconoCerrar");
modalIconCerrar.addEventListener("click", () => {
  modal.className = "modal fade";
  modal.style.display = "none";
});

let modalAlertFinCompra = document.getElementById("modalAlertFinCompra");
let modalAlertSinProduct = document.getElementById("modalAlertSinProduct");
let modalBtnComprar = document.getElementById("modalBtnComprar");
let carrito_GloboCant1 = document.getElementById("cart_menu_num1");
let carrito_GloboCant2 = document.getElementById("cart_menu_num2");

modalBtnComprar.addEventListener("click", () => {
  //verificamos que el array del carrito tenga al menos 1 producto cargado
  if (elementosCarrito.length > 0) {
    elementosCarrito.splice(0); //borramos todos los elementos del carrito

    //Mostramos alerta dando aviso que la compra fue realizada "ok"
    modalAlertFinCompra.setAttribute(
      "style",
      "display:flex;justify-content: center;"
    );
    /* usamos el metodo setTimeout para que se cierre la alerta luego de pasar 2 segundos */
    setTimeout(() => {
      modalAlertFinCompra.setAttribute(
        "style",
        "display:none;justify-content: center;"
      );
    }, 2000);
    localStorage.clear(); // al generarse la compra borramos el elemento del local stor
    dibujarCarrito();
    cantProdCarritoIcono();
    mostrar();
  } else {
    //Mostramos alerta dando aviso que no tiene productos en el carrito
    modalAlertSinProduct.setAttribute(
      "style",
      "display:flex;justify-content: center;"
    );
    /* usamos el metodo setTimeout para que se cierre la alerta luego de pasar 2 segundos */
    setTimeout(() => {
      modalAlertSinProduct.setAttribute(
        "style",
        "display:none;justify-content: center;"
      );
    }, 2000);
    dibujarCarrito();
    cantProdCarritoIcono();
  }
});

/* Ejecutamos las funciones */
recibeJson();
mostrar();

/* agregarProductos(); */

cantProdCarritoIcono();
dibujarCarrito();
