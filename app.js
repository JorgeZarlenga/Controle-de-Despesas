class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    validarDados() {
        let dadosFaltantes = '';

        for (let i in this) {
            console.log(i, this[i]); // this[i] seria o mesmo de acessar this.atributo
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                if (i == 'descricao') {
                    i = 'descrição'
                }
                if (i == 'mes') {
                    i = 'mês'
                }
                dadosFaltantes += (i.charAt(0).toUpperCase()) + i.slice(1) + '<br/>';
            }  
        }
        console.log('dados faltantes: ' + dadosFaltantes);
        
        return dadosFaltantes;
    }
}

class Bd {
    constructor() {
        let id = localStorage.getItem('id');
        console.log('idd: ' + id);
        

        if (id === null) {
            localStorage.setItem('id', 0);
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }

    gravar(d) {
        let id = this.getProximoId();  
        localStorage.setItem(id, JSON.stringify(d));
        localStorage.setItem('id', id);
        
        document.getElementById('ano').value = '';
        document.getElementById('mes').value = '';
        document.getElementById('dia').value = '';
        document.getElementById('tipo').value = '';
        document.getElementById('descricao').value = '';
        document.getElementById('valor').value = '';

    }

    recuperarTodosRegistros() {
        let despesasArray = []; // Ou despesasArray = Array();

        // Recuperação de todas as despesas cadastradas no Local Storage:
        for (let i = 1; i <= localStorage.getItem('id'); i++) {
            // console.log(i, localStorage.getItem(i));
            // console.log(JSON.parse(localStorage.getItem(i)));
            
            let despesa = JSON.parse(localStorage.getItem(i));
            // Verificar se algum índice foi removido (para pular a adição):
            if (despesa === null) {
                continue;
            }

            despesa.id = i;
            despesasArray.push(despesa);
        }
        // console.log(despesasArray)
        return despesasArray;        
    }

    pesquisar(despesa) {
        let despesasFiltradas = Array();
        despesasFiltradas = this.recuperarTodosRegistros();   

        console.log('desp:');
        console.log(despesasFiltradas);

        // ano
        if(despesa.ano != '') {
            console.log('filtro de ano');
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
        }
        // mes
        if(despesa.mes != '') {
            console.log('filtro de mes');
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
        }

        // dia
        if(despesa.dia != '') {
            console.log('filtro de dia');
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
        }

        // tipo
        if(despesa.tipo != '') {
            console.log('filtro de tipo');
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
        }

        // descrição
        if(despesa.descricao != '') {
            console.log('filtro de descricao');
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
        }

        // valor
        if(despesa.valor != '') {
            console.log('filtro de valor');
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
        }

        console.log('desp filt:');
        console.log(despesasFiltradas);

        return despesasFiltradas;
    }

    remover(id) {
        localStorage.removeItem(id);
        // Refresh na página para atualizar a lista de registros:
        window.location.reload();
    }
}

let bd = new Bd();

function cadastrarDespesa() {
    let ano = document.getElementById('ano');
    let mes = document.getElementById('mes');
    let dia = document.getElementById('dia');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    );

    if (despesa.validarDados() == '') {
        bd.gravar(despesa);
        // Dialog de sucesso
        document.querySelector('.modal-header').className = 'modal-header text-success';
        document.querySelector('.modal-title').innerHTML = 'Gravação bem-sucedida';
        document.getElementById("modalBody").innerHTML = 'Despesa cadastrada com sucesso';
        document.querySelector('.modal-footer > button').className = 'btn btn-success';
        $('#modalRegistraDespesa').modal('show');
    } else {
        // Dialog de erro
        document.getElementById("modalBody").innerHTML = 'Por favor, revise as seguintes informações:<br/>' + despesa.validarDados();
        $('#modalRegistraDespesa').modal('show');
        // alert('Por favor, revise as seguintes informações:\n\n' + despesa.validarDados());
    }
}

function carregarListaDespesas() {
    let despesas = Array();
    console.log('carregou');
    

    despesas = bd.recuperarTodosRegistros();

    carregarDespesas(despesas);
}

function handleFormChange() {
    
    // Capturando valores dos campos para habilitar ou não o botão de consulta:
    let elementsText = document.querySelectorAll("#form input[type=text]");
    let formValues = [];

    for (let index = 0; index < 3; index++) {
        formValues.push(elementsText[index].value);
    }    

    let elementsSelect = document.querySelectorAll("#form select");

    for (let index = 0; index < 3; index++) {
        formValues.push(elementsSelect[index].value);
    }

    // Uso de filtro para identificar valores vazios e assim definir habilitação do botão de consulta:

    formValues = formValues.filter(value => value != "");
    
    if (formValues.length != 0) {
        document.getElementById('searchButton').disabled = false;
    } else {
        document.getElementById('searchButton').disabled = true;
    }
}

function pesquisarDespesa() {
    
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    let despesas = bd.pesquisar(despesa);
    carregarDespesas(despesas);
    
}

function carregarDespesas(despesas) {
    // Selecionando o elemento tbody da tabela (com try, visto que o método pode ser chamado após consulta e não ter nenhum dado ainda):
    try {
        let listaDespesas = document.getElementById('listaDespesas');
        listaDespesas.innerHTML = '';
    } catch (error) {
        console.log(error);
    }

    // <tr>
    //             <td>15/03/2018</td>
    //             <td>Alimentação</td>
    //             <td>Compras do mês</td>
    //             <td>R$444,75</td>
    //           </tr>

    // Percorrendo o array despesas, listando cada despesa de forma dinâmica:
    despesas.forEach(function(d) {

        console.log('itera: ');
        console.log(d);
        
        // Criando a linha (tr):
        let linha = listaDespesas.insertRow();

        // Criando as colunas (td):

        // Ajustando o 0 antes de dia e mês:

        if (d.dia <= 9) {
            d.dia = '0' + d.dia;
        }
        if (d.mes <= 9) {
            d.mes = '0' + d.mes;
        }
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;        
        // Ajustando o tipo:
        switch (d.tipo) {
            case '1':
                d.tipo = 'Alimentação'
                break;
            case '2':
                d.tipo = 'Educação'
                break;
            case '3':
                d.tipo = 'Lazer'
                break;
            case '4':
                d.tipo = 'Saúde'
                break;
            case '5':
                d.tipo = 'Transporte'
                break;
            default:
                break;
        }
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;

        // Criação do botão:
        let btn = document.createElement("button");
        btn.className = 'btn btn-danger';
        
        // Inclusão de texto com o Font-Awrsome:
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.onclick = function() {
            console.log(d.id);
            // Dialog de sucesso
            document.querySelector('.modal-header').className = 'modal-header text-success';
            document.querySelector('.modal-title').innerHTML = 'Deletar registro';
            document.getElementById("modalBody").innerHTML = 'Deseja deletar este registro?';
            document.getElementById("idToDelete").value = d.id;
            $('#modalConfirmaExclusao').modal('show');
        }
        
        linha.insertCell(4).append(btn);

    });
   
}

function confirmarExclusao() {
    bd.remover(document.getElementById("idToDelete").value);   
}

function ordenarData() {
    console.log('teste');
    let listaDespesas = document.getElementById('listaDespesas');
    console.log(listaDespesas.rows.length);

    for (let i = 0; i < listaDespesas.rows.length; i++) {
        //gets cells of current row
        let row = listaDespesas.rows.item(i).cells;

        console.log(row);
        
        for (let j = 0; j < row.rows.length; j++) {
            //gets cells of current row
            let data = row.rows.item(j).cells;
            console.log('data:' + data);
        }

        /* //gets amount of cells of current row
        var cellLength = oCells.length;

        //loops through each cell in current row
        for(var j = 0; j < cellLength; j++){
            /* get your cell info here */
            /* var cellVal = oCells.item(j).innerHTML; */
    }
}   
