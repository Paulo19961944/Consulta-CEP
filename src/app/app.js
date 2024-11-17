// Chama as ID do HTML
const manipulaResultado = document.getElementById('result');
const cepInput = document.getElementById('CEP');
const cepResult = document.getElementById('cep-result');
const enderecoResult = document.getElementById('endereco-result');
const cidadeResult = document.getElementById('cidade-result');
const estadoResult = document.getElementById('estado-result');
const button = document.getElementById('button');

// Função para buscar CEP
const buscarCep = async (cep) => {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.ok) {
            throw new Error('Erro ao buscar o CEP');
        }
        const data = await response.json();
        return {
            cep: data.cep,
            rua: data.logradouro,
            cidade: data.localidade,
            uf: data.uf,
            estado: data.estado
        };
    } catch (error) {
        console.error('Erro ao buscar o CEP:', error);
        return null; // Caso haja erro, retorna null
    }
};

// Função para exibir o resultado
const exibirResultado = async () => {
    const cepInputValue = cepInput.value.replace(/\D/g, ''); // Pega o valor do campo de CEP, removendo não-dígitos
    if (cepInputValue.length === 8) {
        // Atualiza a URL na barra de endereços sem recarregar a página
        history.pushState(null, '', `/Consulta-CEP`);
        
        // Chama a função de busca do CEP
        const data = await buscarCep(cepInputValue);
        if (data) {
            // Se o retorno for válido, exibe o resultado
            manipulaResultado.classList.remove('result-hide');
            manipulaResultado.classList.add('result-show');

            cepResult.innerHTML = `<p><span>CEP:</span> ${data.cep}</p>`;
            enderecoResult.innerHTML = `<p><span>Endereço:</span> ${data.rua}</p>`;
            cidadeResult.innerHTML = `<p><span>Cidade:</span> ${data.cidade} - ${data.uf}</p>`;
            estadoResult.innerHTML = `<p><span>Estado:</span> ${data.estado}</p>`;
        } else {
            // Se a busca falhou, você pode mostrar uma mensagem de erro
            manipulaResultado.classList.remove('result-show');
            manipulaResultado.classList.add('result-hide');
            alert('Erro ao buscar o CEP!');
        }
    } else {
        alert('Por favor, insira um CEP válido!');
    }
};

// Evento para o botão "Consultar CEP"
button.addEventListener('click', exibirResultado);

// Lê a URL no carregamento da página
window.addEventListener('load', () => {
    const path = window.location.pathname.replace('/', ''); // Remove o "/"
    if (path.length === 8) {
        cepInput.value = path; // Preenche o campo de CEP com o valor da URL
        exibirResultado(); // Exibe o resultado com o CEP da URL
    }
});

// A opção de voltar para a página inicial
window.addEventListener('popstate', () => {
    const path = window.location.pathname.replace('/', ''); // Remove o "/"
    if (path.length === 8) {
        cepInput.value = path; // Atualiza o valor no input
        exibirResultado(); // Exibe o resultado com o CEP da URL
    }
});
