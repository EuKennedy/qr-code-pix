# Gerador de QR Code Pix

![Demonstração](https://github.com/EuKennedy/qr-code-pix/blob/main/img-demo/demo-qr-code-pix.gif)

## Sobre
Gerador de QR Code Pix feito com **HTML, CSS e JavaScript puros**, sem
frameworks. A interface é responsiva, tem tema escuro com gradientes e usa a
biblioteca [QRCodeJS](https://github.com/davidshimjs/qrcodejs) para renderizar o
código.

## Recursos
- Geração do payload Pix (BR Code) seguindo o padrão EMV / Banco Central.
- Cálculo do CRC16-CCITT feito no front.
- Validação dos campos e feedback em tempo real (toasts).
- Cópia do "Pix Copia e Cola" com fallback para navegadores antigos.
- Download do QR Code em PNG com um clique.
- Layout responsivo (mobile, tablet e desktop).

## Como usar
1. Abra o `index.html` no navegador.
2. Preencha a **chave Pix**, o **nome do recebedor**, a **cidade** e,
   opcionalmente, o **valor**.
3. Clique em **Gerar QR Code** para visualizar o QR Code e o código
   "Copia e Cola".
4. Use os botões **Copiar Pix** ou **Baixar PNG** para compartilhar.

> Dica: para pré-preencher seus dados, edite a constante `DEFAULTS` no início
> de `src/main.js`.

## Documentação de referência
- [Manual Pix do Banco Central do Brasil](https://www.bcb.gov.br/content/estabilidadefinanceira/pix/Regulamento_Pix/II_ManualdePadroesparaIniciacaodoPix.pdf)
- [Manual BR Code do Banco Central do Brasil](https://www.bcb.gov.br/content/estabilidadefinanceira/spb_docs/ManualBRCode.pdf)

## Acesse online
[Gerador de QR Code Pix](https://eukennedy.github.io/qr-code-pix/)

## Contato
Me chame no [Instagram](https://www.instagram.com/knndy.rodrigues/).
