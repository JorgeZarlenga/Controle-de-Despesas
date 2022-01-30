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
        // console.log('idd: ' + id);
        

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

    console.log(despesas);
    

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

    console.log('despesas recebidas:');
    console.log(despesas);
    
    try {
        let listaDespesas = document.getElementById('listaDespesas');
        // Limpeza da lista para renderizar novamente as despesas:
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

    // console.log('despesas: ');
    // console.log(despesas);

    // Percorrendo o array despesas, listando cada despesa de forma dinâmica:
    despesas.forEach(function(despesa) {

        // console.log('itera: ');
        // console.log(despesa);
        
        // Criando a linha (tr):
        let linha = listaDespesas.insertRow();

        // Criando as colunas (td):

        // Ajustando o 0 antes de dia e mês:

        if (despesa.dia <= 9 && !despesa.dia.includes('0')) {
            despesa.dia = '0' + despesa.dia;
        }
        if (despesa.mes <= 9 && !despesa.mes.includes('0')) {
            despesa.mes = '0' + despesa.mes;
        }
        linha.insertCell(0).innerHTML = `${despesa.dia}/${despesa.mes}/${despesa.ano}`;        
        // Ajustando o tipo:
        switch (despesa.tipo) {
            case '1':
                despesa.tipo = 'Alimentação'
                break;
            case '2':
                despesa.tipo = 'Educação'
                break;
            case '3':
                despesa.tipo = 'Lazer'
                break;
            case '4':
                despesa.tipo = 'Saúde'
                break;
            case '5':
                despesa.tipo = 'Transporte'
                break;
            default:
                break;
        }
        linha.insertCell(1).innerHTML = despesa.tipo;
        linha.insertCell(2).innerHTML = despesa.descricao;
        linha.insertCell(3).innerHTML = despesa.valor;

        // Criação do botão:
        let btn = document.createElement("button");
        btn.className = 'btn btn-danger';
        
        // Inclusão de texto com o Font-Awesome:
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.id = despesa.id;
        btn.onclick = function() {
            console.log(despesa.id);
            // Dialog de sucesso
            document.querySelector('.modal-header').className = 'modal-header text-success';
            document.querySelector('.modal-title').innerHTML = 'Deletar registro';
            document.getElementById("modalBody").innerHTML = 'Deseja deletar este registro?';
            document.getElementById("idToDelete").value = despesa.id;
            $('#modalConfirmaExclusao').modal('show');
        }
        
        linha.insertCell(4).append(btn);

    });
   
}

function confirmarExclusao() {
    bd.remover(document.getElementById("idToDelete").value);   
}

function ordenarData() {
    let listaDespesas = document.getElementById('listaDespesas');
    let tamanhoLista = listaDespesas.rows.length;

    let props = ['data', 'tipo', 'descricao', 'valor', 'id'];
    var listOfObjects = [];

    for (var row = 0; row < tamanhoLista; row++) {
        console.log('Teste')
        var singleObj = {};
        
        let comprimentoLinha = listaDespesas.rows[row].cells.length;
        for (var column = 0; column < comprimentoLinha; column++) {       
            // console.log('props column: ' + props[column]);
            // Caso seja a propriedade 'id':
            if (column == 4) {
                let string = listaDespesas.rows[row].cells[column].innerHTML;
                let substringId = listaDespesas.rows[row].cells[column].innerHTML.indexOf('id=');
                // singleObj[props[column]] = (listaDespesas.rows[row].cells[column].innerHTML);
                let id = string.substring(substringId, string.indexOf('>')).replace('id=', '').replaceAll('"', '');
                // console.log('parseInt(listaDespesas.rows[row].cells[column].innerHTML.substring(35, 36): ' + id);
                singleObj[props[column]] = parseInt(id);
            } else {     
                singleObj[props[column]] = listaDespesas.rows[row].cells[column].innerHTML;
            }   
        }
        console.log('singleOBJ:');
        console.log(singleObj);

        listOfObjects.push(singleObj);
    }

    listOfObjects.forEach(function name(despesa) {
        // console.log('data: ' + despesa.data.substring(6, despesa.data.length));
        despesa['ano'] = despesa.data.substring(6, despesa.data.length);       
        despesa['mes'] = despesa.data.substring(3, 5);
        despesa['dia'] = despesa.data.substring(0, 2);       
        // delete despesa.data;
        despesa['data'] = new Date(despesa.data.substring(6, despesa.data.length), despesa.data.substring(3, 5) - 1, despesa.data.substring(0, 2));
    });

    console.log('listOriginal');
    console.log(listOfObjects);
    
    let ordem = 'decrescente';

    for (let index = 0; index < listOfObjects.length - 1; index++) {

        console.log(listOfObjects[index + 1].data);
        console.log(listOfObjects[index].data);
        
        // Lógica para
        if (listOfObjects[index].data <= listOfObjects[index + 1].data) {
            console.log('crescente');
            ordem = 'decrescente';
        } else if (listOfObjects[index].data >= listOfObjects[index + 1].data) {
            ordem = 'crescente';
        } else {
            ordem = 'crescente';
        }
    }

    console.log('ordem: ' + ordem);
    
    if (ordem == 'crescente') {
        listOfObjects.sort((a, b) => (a.data > b.data) ? 1 : -1);
    } else if (ordem == 'decrescente') {
        listOfObjects.sort((a, b) => (a.data < b.data) ? 1 : -1);
    }

    // console.log(listOfObjects);

    carregarDespesas(listOfObjects);
}   
