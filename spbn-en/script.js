document.addEventListener('DOMContentLoaded', function() {

    // --- Lógica para Parte 1 & 2 (index.html) ---
    const findOrderForm = document.getElementById('findOrderForm');
    const verificationModal = document.getElementById('verificationModal');
    const verificationForm = document.getElementById('verificationForm');
    const cancelButton = document.getElementById('cancelButton');
    const closeButton = verificationModal ? verificationModal.querySelector('.close-button') : null;
    const codeInputs = verificationModal ? Array.from(verificationModal.querySelectorAll('.code-inputs input')) : [];

    if (findOrderForm) {
        findOrderForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            // --- INÍCIO DA INTEGRAÇÃO N8N (PASSO 1) ---

            // 1. Capturar o e-mail do formulário
            const emailInput = document.getElementById('email');
            const userEmail = emailInput.value.trim();

            if (!userEmail) {
                alert("Please enter a valid email address.");
                return;
            }

            // 2. Gerar o código aleatório de 6 dígitos
            const randomCode = Math.floor(100000 + Math.random() * 900000);

            // 3. Montar o objeto de dados para enviar ao N8N
            const dataToSend = {
                email: userEmail,
                uniqueCode: randomCode
            };

            // 4. Salvar o e-mail no sessionStorage para usar na página de reembolso
            sessionStorage.setItem('userEmail', userEmail);
            
            // 5. Enviar os dados para o primeiro webhook
            fetch("https://n8n-n8n.io4uje.easypanel.host/webhook/16ec9956-9371-4a9b-81ac-930d5bffcb95", {
                method: "POST",
                mode: "no-cors", // "no-cors" é usado para evitar erros de CORS quando o servidor não responde com os cabeçalhos corretos
                body: JSON.stringify(dataToSend)
            })
            .then(() => {
                console.log("Webhook for verification code sent successfully.");
                // 6. Exibir o pop-up de verificação após o envio
                verificationModal.style.display = 'flex';
                if (codeInputs.length > 0) {
                    codeInputs[0].focus();
                }
            })
            .catch(error => {
                console.error("Error sending webhook for verification code:", error);
                alert("An error occurred. Please try again later.");
            });
            
            // --- FIM DA INTEGRAÇÃO N8N (PASSO 1) ---
        });
    }

    if (verificationForm) {
        verificationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Simplesmente redireciona para a próxima página, sem validar o código
            window.location.href = 'orders.html';
        });
    }
    
    // Funções para fechar o modal de verificação
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            verificationModal.style.display = 'none';
        });
    }
    if (closeButton) {
         closeButton.addEventListener('click', () => {
            verificationModal.style.display = 'none';
        });
    }

    // Lógica de auto-avanço e colar para os campos de código
    if (codeInputs.length > 0) {
        codeInputs.forEach((input, index) => {
            input.addEventListener('keyup', (e) => {
                if (e.key !== 'Backspace' && input.value && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
                if (e.key === 'Backspace' && !input.value && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });

            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pasteData = e.clipboardData.getData('text');
                for (let i = 0; i < pasteData.length; i++) {
                    if (index + i < codeInputs.length) {
                        codeInputs[index + i].value = pasteData[i];
                        if (index + i < codeInputs.length - 1) {
                           codeInputs[index + i + 1].focus();
                        }
                    }
                }
            });
        });
    }


    // --- Lógica para Parte 5 & 6 (refund.html) ---
    const refundForm = document.getElementById('refundForm');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeConfirmButton = document.getElementById('closeConfirmButton');

    if (refundForm) {
        refundForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // --- INÍCIO DA INTEGRAÇÃO N8N (REEMBOLSO) ---

            // 1. Recuperar o e-mail do sessionStorage
            const userEmail = sessionStorage.getItem('userEmail');

            if (!userEmail) {
                console.error("User email not found in session storage.");
                alert("Could not process refund: user session not found. Please start over.");
                return;
            }
            
            // 2. Montar o objeto de dados para o webhook de reembolso
            const dataToSend = {
                email: userEmail
                // Você pode adicionar outros dados do formulário se precisar, por exemplo:
                // reason: document.getElementById('refundReason').value,
                // additionalInfo: document.getElementById('additionalInfo').value
            };

            // 3. Enviar os dados para o segundo webhook
            fetch("https://n8n.seven-health.fun/webhook/etapa2", {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify(dataToSend)
            })
            .then(() => {
                console.log("Webhook for refund confirmation sent successfully.");
                // 4. Exibir o pop-up de confirmação somente se o webhook for disparado com sucesso
                confirmationModal.style.display = 'flex';
            })
            .catch(error => {
                console.error("Error sending webhook for refund confirmation:", error);
                alert("An error occurred while submitting your request. Please try again.");
            });

            // --- FIM DA INTEGRAÇÃO N8N (REEMBOLSO) ---
        });
    }

    if (closeConfirmButton) {
        closeConfirmButton.addEventListener('click', function() {
            confirmationModal.style.display = 'none';
            // Opcional: redirecionar para a página de detalhes do pedido após fechar
            window.location.href = 'order-details.html';
        });
    }

    // Fechar modais ao clicar fora deles
    window.addEventListener('click', function(event) {
        if (event.target == verificationModal) {
            verificationModal.style.display = 'none';
        }
        if (event.target == confirmationModal) {
            confirmationModal.style.display = 'none';
            window.location.href = 'order-details.html';
        }
    });


});
