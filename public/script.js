      // Configura data atual como padrão
            const data = new Date();
            const ano = data.getFullYear();
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const dia = String(data.getDate()).padStart(2, '0');
            const dataFormatada = `${ano}-${mes}-${dia}`;
            document.getElementById('itemData').value = dataFormatada;

            // Função para sair do sistema redirecionando para index.html
            function sair() {
                if(confirm('Tem certeza que deseja sair do sistema?')) {
                    // Redireciona para a página index.html
                    window.location.href = 'index.html';
                }
            }

            // Adiciona evento de submit ao formulário
            document.getElementById('itemForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Captura os valores dos campos
                const valor = document.getElementById('itemValor').value;
                const data = document.getElementById('itemData').value;
                const comprador = document.getElementById('itemComprador').value;
                
                // Aqui você pode adicionar a lógica para salvar os dados
                // Exemplo: console.log({valor, data, comprador});
                
                // Limpa o formulário após o envio
                this.reset();
                document.getElementById('itemData').value = dataFormatada;
                
                alert('Item adicionado com sucesso!');
            });
