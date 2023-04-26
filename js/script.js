const button = document.getElementById("guess-button");     
const again = document.getElementById("try-again");
const txtIntentos = document.getElementById('intentos');
const input = document.getElementById("guess-input");
const GRID = document.getElementById("grid");
const value = input.value;
let intentos = 6;
let palabra;
const UrlApi = 'https://random-word-api.herokuapp.com/word?lang=en&length=5';
const confettiDiv = document.getElementById('confetti');

//OBS:Función asíncrona
//Se encarga de buscar una palabra de 5 letras por medio de una API
//En caso de que la API no responda, usa palabra del array predeterminado
fetch(UrlApi).then(response => response.json())
    .then(response => {
        palabra = removeAccents(response[0].toUpperCase());
        console.log(palabra);
})
.catch(err => {
    console.log('hubo un problema con la API! :(');
    let diccionario = ["shott","molds","chapt","inane","edged","armer","baton",
                        "clour","stare","refix","gimme","sikas","kemps","thebe",
                        "dusky","hajis","galax","hated","reest","marks","panga",
                        "dinar","dwarf","bandy","willy","clump","farci","might","bumfs"];
    palabra = diccionario[Math.floor(Math.random() * diccionario.length)].toUpperCase();
    console.log(palabra);
});

//Enfoca el input al iniciar
input.focus;

//Al cargar la pagina se ejcuta init
window.addEventListener('load', init);

//Evento al hacer click en el boton
button.addEventListener("click", jugar);

//También se ejecuta el juego usando la tecla enter
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter'){
        jugar();
    }
});

//Boton para reiniciar el juego una vez que este termine
again.addEventListener('click', () => {
    location.reload();
})

//Carga algunas decoraciones al iniciar la pagina
function init(){
    confettiDiv.style.display = 'none';
}

/* Termina el juego con un mensaje, deshabilita botones
y casilla para ingresar elementos */
function terminar(mensaje){
    const INPUT = document.getElementById("guess-input");
    INPUT.disabled = true;
    button.disabled = true;
    let contenedor = document.getElementById('guesses');
    contenedor.innerHTML = mensaje + '<button id="try-again">Play again!!</button>';
}

/* Lee el valor contenido en el input */
function leerIntento(){
    let intento = document.getElementById("guess-input");
    intento = intento.value;
    intento = intento.toUpperCase(); 
    return intento;
}

//Se encarga de analizar la opcion ingresada, si es correcta, si contiene letras o no, etc
//Termina el juego si se gana o si se pierde
function jugar(){
    //Aca ya tenemos la palabra ingresada por usuario
    const INTENTO = leerIntento();    
    input.value = ''; 
    if(INTENTO.length === 5){
        //Se obtiene y crean grillas        
        const GRID = document.getElementById("grid");
        const ROW = document.createElement('div');
        ROW.className = 'row';
        //Se analiza la palabra letra a letra
        for (let i in palabra){
            const SPAN = document.createElement('span');
            SPAN.className = 'letter';
            //Si las letras son iguales y posicionada en el mismo lugar, verde
            if (INTENTO[i]===palabra[i]){
                SPAN.innerHTML = INTENTO[i];
                SPAN.style.backgroundColor = '#79b851';
            } 
            //Si las letras pertenecen a la palabra, se ponen en amarillo
            else if( palabra.includes(INTENTO[i]) ) { 
                SPAN.innerHTML = INTENTO[i];
                SPAN.style.backgroundColor = '#f3c237';
            } 
            //Si no pertenecen a la palabra, se ponen en gris
            else {      
                SPAN.innerHTML = INTENTO[i];
                SPAN.style.backgroundColor = '#a4aec4';
            }
            //Se agregan la casilla a la pantalla
            ROW.appendChild(SPAN);            
        }
        //Se agrega fila completa
        GRID.appendChild(ROW);
        //Se restan los intentos disponibles
        intentos--;
        txtIntentos.innerHTML = '<p id = "intentos">Please, try 5 letter words, you have <b>'+ intentos +'</b> attempts!</p>';
        input.focus();
        //Si la palabra es igual a lo ingresado, se gana
        if (INTENTO === palabra ) {
            terminar("<h2>YOU WON :D!</h2>");  
            confettiDiv.style.display = 'block'; 
            again.style.display = 'block';
        }
        //Se pierde el juego
        else if (intentos==0){
            terminar("<h2>YOU LOSE! :'(</h2>");
            again.style.display = 'block';
        }
    }
    //En caso de quela palabra ingresada no cumpla los requisitos
    else{
        let contenedor = document.getElementById('guesses');
        contenedor.innerHTML = '<h2 id = "guesses">Try again, words must have 5 letters!!</h2>';
        setTimeout(() => {
            contenedor.innerHTML = '<h2 id = "guesses"></h2>';
          }, 5000);        
    }
}

//Para sacar caracteres con acentos
//Copiado de: https://desarrolloweb.com/faq/la-mejor-manera-de-eliminar-tildes-o-acentos-en-javascript
const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } 