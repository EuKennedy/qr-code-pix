# Gerador de QR Code Pix

## Sobre
Gerador de QR Code Pix feito com **HTML, CSS e JavaScript puros**, sem
frameworks nem dependências externas além da biblioteca
[QRCodeJS](https://github.com/davidshimjs/qrcodejs) (usada para renderizar o
código). A interface é responsiva, com tema escuro e gradientes.

## Recursos
- Geração do payload Pix (BR Code) seguindo o padrão EMV / Banco Central.
- Cálculo do CRC16-CCITT feito no front.
- Normalização automática da chave Pix (telefone com ou sem DDI +55, CPF,
  CNPJ, e-mail e chave aleatória).
- Nome do recebedor e cidade são **opcionais** — se ficarem em branco, o
  gerador usa os valores padrão definidos em `src/main.js`.
- Cópia do "Pix Copia e Cola" com fallback para navegadores antigos.
- Download do QR Code em PNG com um clique.
- Layout responsivo (mobile, tablet e desktop).

## Como usar
1. Abra o `index.html` no navegador.
2. Informe a **chave Pix** (obrigatória). Se for telefone, pode digitar
   só o DDD + número — o sistema completa o `+55` automaticamente.
3. Se quiser, preencha também o nome do recebedor, a cidade e o valor.
4. Clique em **Gerar QR Code** para ver o QR e o "Copia e Cola".
5. Use **Copiar Pix** ou **Baixar PNG** para compartilhar.

> Para personalizar os valores padrão, edite a constante `DEFAULTS` no topo
> de `src/main.js`.

## Testar no seu próprio Pix
Se quiser validar que o QR Code funciona, teste com a sua própria chave
Pix — abra o app do seu banco, aponte a câmera pro QR e confira os dados
antes de confirmar. Nada sai do seu navegador.

## Documentação de referência
- [Manual Pix do Banco Central do Brasil](https://www.bcb.gov.br/content/estabilidadefinanceira/pix/Regulamento_Pix/II_ManualdePadroesparaIniciacaodoPix.pdf)
- [Manual BR Code do Banco Central do Brasil](https://www.bcb.gov.br/content/estabilidadefinanceira/spb_docs/ManualBRCode.pdf)

## Acesse online
[Gerador de QR Code Pix](https://eukennedy.github.io/qr-code-pix/)

## Contato
Me chame no [Instagram](https://www.instagram.com/knndy.rodrigues/).
