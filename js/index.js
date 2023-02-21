/* seletores do toggle */
const botaoSelecaoPlano = document.querySelector(".checkbox_plano");
const planoBonusFrase = document.querySelectorAll(".plan-bonus");
const mensalOuAnual = document.querySelectorAll("p.plan");

/* seletores do valor */
const valorArcade = document.querySelector(".arcade-plan-amount");
const valorAdvanced = document.querySelector(".advanced-plan-amount");
const valorPro = document.querySelector(".pro-plan-amount");

/* seletores dos extras */
const extraOnline = document.querySelector(".plus_online");
const extraStorage = document.querySelector(".plus_storage");
const extraProfile = document.querySelector(".plus_profile");
const nextBtn = document.querySelector("a.btn-next");

let selectedPlan;
let selectedAddons = [];
let time;

// localStorage.setItem("time", "Monthly");

// const botaoFinalSoma = document.querySelector("button_next_step");
// console.log(botaoFinalSoma)



/* ############### seleciona o plano (estilização css)  #############*/
function planoSelecionado(){
    const planos = document.querySelectorAll("div.mosaico_planos_ind");
    
    planos.forEach((plano) =>{
        plano.addEventListener("click", () =>{
            let planoId = plano.id;
            planos.forEach((elemento) =>{
                if (elemento.id === planoId){
                    elemento.classList.add("checked");
                    const planName = elemento.getElementsByClassName("plan_name")[0].innerText;
                    const lowerCasePlanName = planName.toLowerCase(); 
                    const planValueStr = elemento.getElementsByClassName(`${lowerCasePlanName}-plan-amount`)[0].innerText;
                    const planValue = parseInt(planValueStr.match(/\d+/g)[0]);
                    selectedPlan = {
                        name: planName,
                        valueStr: planValueStr,
                        value: planValue
                    };
                    /* pega qualquer coisa e transforma em uma string */
                    localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
                    
                } else{
                elemento.classList.remove("checked"); 
               }
            });
        });
    })
    
}




/* Adiciona as frases de meses free caso o plano for anual */

function addFraseFree(){
   
    const card = document.querySelectorAll('.elementos_rodape');
    
    card.forEach((item) => {
        const fraseAdicionada = document.createElement('p');
        fraseAdicionada.textContent = '2 months free';
        fraseAdicionada.classList.add('selected');
        item.appendChild(fraseAdicionada);
       
    })
    
}

/* Remove as frases de meses free caso o plano for anual */

function removeFraseFree(){
    const card = document.querySelectorAll('.mosaico_planos_ind');
    card.forEach((item) => {
        try{
            item.querySelector('.selected').remove();
        }
        catch(error){
        }
    })

}


/* verifica se a checkbox está true e adiciona classe de estilização */

const checkboxes = document.querySelectorAll('.mosaico_add_ind input[type="checkbox"]');

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const checkboxParent = checkbox.closest('.mosaico_add_ind');
        if (checkbox.checked) {
            checkboxParent.classList.add('selected_extra');
            
            
            const addonName = checkboxParent.getElementsByClassName("p_azul")[0].innerText;
            const addonValueStr = checkboxParent.getElementsByClassName("extensao")[0].innerText;
            const addonValue = parseInt(addonValueStr.match(/\d+/g)[0]); 
            const addon = {
                name: addonName,
                valueStr: addonValueStr,
                value: addonValue 
        }
        selectedAddons.push(addon);
        localStorage.setItem('selectedAddons', JSON.stringify(selectedAddons));

        
    } else {
        checkboxParent.classList.remove('selected_extra');
        const addonName = checkboxParent.getElementsByClassName("p_azul")[0].innerText;
        selectedAddons = selectedAddons.filter(addon => addon.name != addonName);
        localStorage.setItem('selectedAddons', JSON.stringify(selectedAddons));
    }
    
    
  });
});




/* função para ver se está no plano mensal ou anual */
if(botaoSelecaoPlano){
    botaoSelecaoPlano.addEventListener("click", (evento) =>{
        
        const isChecked = evento.target.checked;
   
        if(!isChecked) {
            valorArcade.innerHTML = "$9/mo";
            valorAdvanced.innerHTML = "$12/mo";
            valorPro.innerHTML = "$15/mo";
            time = "Monthly";
            try{
                removeFraseFree()
            }
            catch(error){
                console.log(error);
            }

        }
        else{
            valorArcade.innerHTML = "$90/yr";
            valorAdvanced.innerHTML = "$120/yr";
            valorPro.innerHTML = "$150/yr";
            time = "Yearly";
            addFraseFree()
           
        }
        
        // console.log(time);
        const plano = document.getElementsByClassName("checked")[0];
        const planName = plano.getElementsByClassName("plan_name")[0].innerText;
        const lowerCasePlanName = planName.toLowerCase(); 
        const planValueStr = plano.getElementsByClassName(`${lowerCasePlanName}-plan-amount`)[0].innerText;
        const planValue = parseInt(planValueStr.match(/\d+/g)[0]);
        selectedPlan = {
            name: planName,
            valueStr: planValueStr,
            value: planValue
        };
        localStorage.setItem("time", time);
        
    }) 
}



function loadData(){
    const span_plano = document.createElement("span");
    const spanPlanoValor = document.createElement("span");
    var divConteudo = document.getElementById("plano_dinamico");
    
    var divValores = document.getElementById("addons_dinamico");
    const addons_p = document.createElement("p");

    const addons_valores = document.createElement("p");
    const totalSoma = document.createElement("h3");
    let soma = 0;
  
    const selectedPlanLocalStorage = JSON.parse(localStorage.getItem("selectedPlan")); //retorna uma string do localStorage
    const timeLocalStorage = localStorage.getItem("time");
    const selectedAddonsLocalStorage =  JSON.parse(localStorage.getItem("selectedAddons"));
    const planValueStr = selectedPlanLocalStorage.valueStr;
    const planValue = selectedPlanLocalStorage.value;
    
    divConteudo.appendChild(span_plano);
    divValores.appendChild(spanPlanoValor);
    
    for (let i=0; i < selectedAddonsLocalStorage.length; i++){
        const nomeAddon = selectedAddonsLocalStorage[i].name;
        const valueAddonStr = selectedAddonsLocalStorage[i].valueStr;
        const valueAddon = selectedAddonsLocalStorage[i].value;
        
        addons_p.innerHTML = nomeAddon;
        addons_valores.innerHTML = valueAddonStr;
        soma = soma + valueAddon;
        divConteudo.appendChild(addons_p.cloneNode(true));
        divValores.appendChild(addons_valores.cloneNode(true));
   
        
    }

    const totalFrase = document.createElement("h3");
    totalFrase.innerHTML = "Total";
    
    divConteudo.appendChild(totalFrase);
    soma = soma + planValue;
    totalSoma.innerHTML = ` $${soma}`;


    span_plano.innerHTML = `${selectedPlanLocalStorage.name} (${timeLocalStorage})`;
    spanPlanoValor.innerHTML = planValueStr;
    divValores.appendChild(totalSoma);

}




planoSelecionado()

//uma função que coloque os elementos a ser somados;
// adicionar os elemntos do objetos de plano com valores da variável selectedPlan
//adicionar o tipo de plano (time)
//depois da linha//
//fazer iteração do array selectedAddons para exibir em tela um elemento para cada objeto do array
//outra função para realizar a soma dos valores selectedPlane e de cada objeto de dentro do array selectedAddons




/* é usado para buscar uma string por uma correspondência com uma expressão regular e retorna um array contendo as correspondências/O caractere \d representa um dígito de 0 a 9/O sinal + indica que o caractere anterior (neste caso, \d) pode aparecer uma ou mais vezes na string.
//             A letra g no final indica que a busca deve ser global, ou seja, que todas as correspondências devem ser retornadas em um array. */
//         

/*A função setTimeout é utilizada para agendar a execução da função anônima passada como primeiro argumento após um tempo determinado em milissegundos passado como segundo argumento. No exemplo, a função anônima passada como primeiro argumento a setTimeout contém uma chamada para setInterval e, portanto, será executada após 9000 milissegundos (ou 9 segundos).

A função setInterval é utilizada para executar a função anônima passada como primeiro argumento repetidamente em intervalos de tempo determinados em milissegundos passados como segundo argumento. No exemplo, a função anônima passada como primeiro argumento a setInterval atualiza o conteúdo do elemento HTML com id totalAmount com o valor retornado pela função summaryTotalPrice()*/
