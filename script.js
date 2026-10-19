// Primeiro, pegamos os elementos da página que vamos usar.
// É como separar os ingredientes antes de começar uma receita.
const formulario = document.querySelector("#form-sorteio");
const campoQuantidade = document.querySelector("#quantidade");
const campoMinimo = document.querySelector("#valor-minimo");
const campoMaximo = document.querySelector("#valor-maximo");
const opcaoSemRepeticao = document.querySelector("#nao-repetir");
const mensagemErro = document.querySelector("#mensagem-erro");
const areaResultado = document.querySelector("#resultado");
const botaoSortear = formulario.querySelector('button[type="submit"]');

// Mostra um aviso e leva o cursor até o campo que precisa ser corrigido.
// Assim, a pessoa sabe o que aconteceu e onde deve mexer.
function mostrarErro(mensagem, campo) {
	mensagemErro.textContent = mensagem;
	mensagemErro.hidden = false;

	if (campo) {
		campo.setAttribute("aria-invalid", "true");
		campo.focus();
	}
}

// Quando a pessoa muda um campo, apagamos o aviso antigo e a marcação de erro.
function limparErro(campo) {
	campo.removeAttribute("aria-invalid");
	mensagemErro.hidden = true;
	mensagemErro.textContent = "";
}

// Sorteia os números usando as regras escolhidas pela pessoa.
function gerarNumeros(quantidade, minimo, maximo, semRepeticao) {
	if (!semRepeticao) {
		// Se repetição estiver permitida, cada sorteio é independente.
		// É como tirar uma bolinha numerada de um saco e colocá-la de volta.
		return Array.from(
			{ length: quantidade },
			() => Math.floor(Math.random() * (maximo - minimo + 1)) + minimo,
		);
	}

	// Se não pode repetir, imaginamos uma fila de números embaralhada.
	// O mapa "trocas" anota as mudanças sem precisar guardar a fila inteira,
	// o que economiza memória quando o intervalo é muito grande.
	const numeros = [];
	const trocas = new Map();
	const tamanhoIntervalo = maximo - minimo + 1;

	// A cada volta escolhemos uma posição que ainda não foi sorteada.
	for (let indice = 0; indice < quantidade; indice += 1) {
		const indiceEscolhido = indice + Math.floor(Math.random() * (tamanhoIntervalo - indice));
		// Se essa posição já foi trocada, usamos o número anotado no mapa.
		// Caso contrário, a própria posição representa o número escolhido.
		const numeroEscolhido = trocas.has(indiceEscolhido)
			? trocas.get(indiceEscolhido)
			: indiceEscolhido;
		// Pegamos o número que estava na próxima posição da fila para ocupar
		// o lugar que acabamos de escolher, igual a trocar cartas de lugar.
		const numeroFinal = trocas.has(indice)
			? trocas.get(indice)
			: indice;

		trocas.set(indiceEscolhido, numeroFinal);
		// A posição atual já foi usada, então não precisamos mais anotá-la.
		trocas.delete(indice);
		// As posições começam em zero, por isso somamos o valor mínimo.
		numeros.push(numeroEscolhido + minimo);
	}

	return numeros;
}

// Monta uma lista na página para mostrar os números sorteados.
function exibirResultado(numeros) {
	const lista = document.createElement("ul");
	lista.className = "lista-numeros";

	// O fragmento é uma bandeja temporária: montamos tudo nela e depois
	// colocamos todos os resultados na página de uma só vez.
	const fragmento = document.createDocumentFragment();
	numeros.forEach((numero, indice) => {
		const item = document.createElement("li");
		item.className = "numero-sorteado";
		item.textContent = numero;
		// O CSS usa esse número para fazer cada bolinha aparecer em sequência.
		item.style.setProperty("--indice", Math.min(indice, 8));
		fragmento.append(item);
	});

	lista.append(fragmento);
	// Tiramos o estado de "sorteando" e substituímos o resultado anterior.
	areaResultado.classList.remove("sorteando");
	areaResultado.replaceChildren(lista);
}

// Escutamos o envio do formulário, que acontece ao apertar "Sortear".
formulario.addEventListener("submit", (evento) => {
	// Impede a página de recarregar, como normalmente faria um formulário.
	evento.preventDefault();
	// Um novo sorteio começa limpo, sem avisos antigos.
	mensagemErro.hidden = true;
	mensagemErro.textContent = "";

	const campos = [campoQuantidade, campoMinimo, campoMaximo];
	campos.forEach((campo) => campo.removeAttribute("aria-invalid"));

	// Primeiro conferimos se os três espaços foram preenchidos.
	const campoVazio = campos.find((campo) => campo.value.trim() === "");
	if (campoVazio) {
		mostrarErro("Preencha todos os campos para realizar o sorteio.", campoVazio);
		return;
	}

	// O navegador guarda o que foi digitado como texto. Number transforma
	// esse texto em número para podermos fazer contas com ele.
	const quantidade = Number(campoQuantidade.value);
	const minimo = Number(campoMinimo.value);
	const maximo = Number(campoMaximo.value);

	// A quantidade precisa ser um inteiro positivo, como 1, 2 ou 3.
	if (!Number.isSafeInteger(quantidade) || quantidade < 1) {
		mostrarErro("A quantidade deve ser um número inteiro maior que zero.", campoQuantidade);
		return;
	}

	// Os limites também precisam ser inteiros seguros para o JavaScript.
	if (!Number.isSafeInteger(minimo)) {
		mostrarErro("O valor mínimo deve ser um número inteiro válido.", campoMinimo);
		return;
	}

	if (!Number.isSafeInteger(maximo)) {
		mostrarErro("O valor máximo deve ser um número inteiro válido.", campoMaximo);
		return;
	}

	// Um intervalo só faz sentido se o máximo vier depois do mínimo.
	if (maximo <= minimo) {
		mostrarErro("O valor máximo precisa ser maior que o valor mínimo.", campoMaximo);
		return;
	}

	const semRepeticao = opcaoSemRepeticao.checked;
	// Incluímos os dois extremos. Exemplo: de 1 até 3 são 1, 2 e 3: três números.
	const tamanhoIntervalo = maximo - minimo + 1;
	if (!Number.isSafeInteger(tamanhoIntervalo)) {
		mostrarErro("O intervalo é grande demais. Informe valores mínimo e máximo mais próximos.", campoMaximo);
		return;
	}

	// Se não pode repetir, não dá para tirar mais números do que existem no intervalo.
	if (semRepeticao && quantidade > tamanhoIntervalo) {
		mostrarErro(
			`Esse intervalo contém apenas ${tamanhoIntervalo} números. Reduza a quantidade ou aumente o intervalo.`,
			campoQuantidade,
		);
		return;
	}

	// Todas as conferências passaram: agora podemos fazer o sorteio.
	const numerosSorteados = gerarNumeros(quantidade, minimo, maximo, semRepeticao);
	// Desativamos o botão durante a animação para evitar vários cliques seguidos.
	botaoSortear.disabled = true;
	areaResultado.classList.add("sorteando");
	// Mostramos uma mensagem temporária enquanto o círculo de espera gira.
	areaResultado.replaceChildren(Object.assign(document.createElement("p"), {
		className: "mensagem-sorteando",
		textContent: "Sorteando seus números...",
	}));

	// Depois de um pequeno momento, trocamos a mensagem pelos números sorteados.
	window.setTimeout(() => {
		exibirResultado(numerosSorteados);
		// Liberamos o botão para que a pessoa possa sortear de novo.
		botaoSortear.disabled = false;
	}, 700);
});

// Se um campo for editado depois de um erro, removemos o aviso da tela.
[campoQuantidade, campoMinimo, campoMaximo].forEach((campo) => {
	campo.addEventListener("input", () => limparErro(campo));
});
