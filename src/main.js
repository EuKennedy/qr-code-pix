
    
        
            var payload = ""; // Variável para armazenar o valor do payload

            document.getElementById('generate_qr_code_button').addEventListener('click', function() {
                var pix_value = document.getElementById('pix_value').value;
                var pix_key = '+5531984956383'; // Adicione aqui sua chave pix (celular, cpf, chave aleatória)
                var destinatario = 'Kennedy Rodrigues G' // digite aqui o destinatário
                var destinatariolength = destinatario.length // Conta as caracteres
                var cidade = 'Belo Horizonte' // Digite aqui a cidade com máximo de 24 caracteres
                var cidadelength = cidade.length // conta as caracteres

                // Construa o payload PIX
                payload = '00020126360014BR.GOV.BCB.PIX0114' + pix_key + '5204000053039865405' + pix_value + '.00' + '5802BR59' + destinatariolength + destinatario + '60' + cidadelength + cidade + '62130509pixcartao';
    
                // Calcula o CRC16 do payload PIX
                var crc16 = getCRC16(payload);
    
                // Converte o valor CRC16 em hexadecimal
                var crc16Hex = crc16.toString(16).toUpperCase();
    
                // Adicione o valor CRC16 ao final do payload PIX
                payload += '6304' + crc16Hex;
    
                // Crie um elemento para exibir o QR Code
                var qrcode = new QRCode(document.getElementById('qr-code-container'), {
                    text: payload.toString(),
                    width: 228,
                    height: 228
                });

                // Habilita o botão de copiar payload após a geração do QR Code
                document.getElementById('copy_payload_button').disabled = false;
            });

            document.getElementById('copy_payload_button').addEventListener('click', function() {
                // Copie o valor do payload para a área de transferência
                var tempInput = document.createElement("input");
                tempInput.value = payload;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand("copy");
                document.body.removeChild(tempInput);

                // Exiba a mensagem de sucesso
                var copySuccessMessage = document.getElementById('copy_success_message');
                copySuccessMessage.style.display = 'block';

                // Oculte a mensagem após alguns segundos
                setTimeout(function() {
                    copySuccessMessage.style.display = 'none';
                }, 2000); // A mensagem será ocultada após 2 segundos (2000 milissegundos)
            });

            function getCRC16(payload) {
                payload += '6304';
                var polinomio = 0x1021;
                var resultado = 0xFFFF;
                var length = payload.length;
    
                for (var offset = 0; offset < length; offset++) {
                    resultado ^= (payload.charCodeAt(offset) << 8);
    
                    for (var bitwise = 0; bitwise < 8; bitwise++) {
                        if ((resultado <<= 1) & 0x10000) {
                            resultado ^= polinomio;
                        }
                        resultado &= 0xFFFF;
                    }
                }
    
                return resultado;
            }


