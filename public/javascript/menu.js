document.addEventListener("DOMContentLoaded", function(){
    let abrirMenu = document.getElementById("abrirMenu")
    let navbar = document.getElementById("navbar")

    // ao clicar no botão de abrir o menu ele abre o menu e some o svg
    abrirMenu.addEventListener("click", function(event){
        navbar.classList.remove("hidden")
        navbar.classList.add("absolute", "top-0", "right-0", "pl-4", "pr-8", "py-4", "rounded-md")
        console.log(navbar.classList)
        abrirMenu.classList.add("hidden")
        event.stopPropagation()
    })

    // ao clicar fora do botão de abrir o menu ou de um do seus filhos, ele fecha
    document.addEventListener("click", function(event){
        if (!abrirMenu.contains(event.target)) {
            navbar.classList.add("hidden")
            abrirMenu.classList.remove("hidden")
        }
    })
})
