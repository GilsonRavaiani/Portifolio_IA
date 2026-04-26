//let elementH1 = document.querySelector("h1")

//console.log(elementH1)

//elementH1.innerText = `Gilson Ravaiani` 

let botaoRetornar = document.getElementById("botao-retornar");

botaoRetornar.addEventListener("click", function () {


    alert("Obrigado por me visitar, retornando a página principal")

    window.location.href = "index.html";

});

let botao = document.getElementById("botao-retornar");

botao.addEventListener("mouseenter", () => {

    botao.style.cursor = "pointer";
});