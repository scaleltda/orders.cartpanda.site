document.addEventListener('DOMContentLoaded', function() {

    // --- Logic for Part 1 & 2 (index.html) ---
    const findOrderForm = document.getElementById('findOrderForm');
    const verificationModal = document.getElementById('verificationModal');
    const verificationForm = document.getElementById('verificationForm');
    const cancelButton = document.getElementById('cancelButton');
    const closeButton = verificationModal ? verificationModal.querySelector('.close-button') : null;
    const codeInputs = verificationModal ? Array.from(verificationModal.querySelectorAll('.code-inputs input')) : [];

    if (findOrderForm) {
        findOrderForm.addEventListener('submit', function(event) {
            event.preventDefault();
            verificationModal.style.display = 'flex';
            if (codeInputs.length > 0) {
                codeInputs[0].focus(); // Focus on the first input when modal opens
            }
        });
    }

    if (verificationForm) {
        verificationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            window.location.href = 'orders.html';
        });
    }
    
    // Functions to close the verification modal
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

    // Auto-advance and paste logic for code inputs
    if (codeInputs.length > 0) {
        codeInputs.forEach((input, index) => {
            input.addEventListener('keyup', (e) => {
                // If key is not backspace and input has value, move to the next input
                if (e.key !== 'Backspace' && input.value && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
                // If key is backspace and input is empty, move to the previous input
                if (e.key === 'Backspace' && !input.value && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });

            // Paste logic
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pasteData = e.clipboardData.getData('text');
                // Distribute pasted data across the inputs
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


    // --- Logic for Part 5 & 6 (refund.html) ---
    const refundForm = document.getElementById('refundForm');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeConfirmButton = document.getElementById('closeConfirmButton');

    if (refundForm) {
        refundForm.addEventListener('submit', function(event) {
            event.preventDefault();
            confirmationModal.style.display = 'flex';
        });
    }

    if (closeConfirmButton) {
        closeConfirmButton.addEventListener('click', function() {
            confirmationModal.style.display = 'none';
            // Optional: redirect to order details page after closing
            window.location.href = 'order-details.html';
        });
    }

    // Close modals when clicking outside of them
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