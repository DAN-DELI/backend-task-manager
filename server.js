import app from "./src/app.js";

const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || "localhost";

const showBanner = () => {
    const cyan = '\x1b[36m';
    const green = '\x1b[32m';
    const yellow = '\x1b[33m';
    const reset = '\x1b[0m';
    const dim = '\x1b[2m';

    console.log(`

    ${yellow}◆${reset}  Modo: ${process.env.NODE_ENV || 'development'}
    ${yellow}◆${reset}  Iniciado: ${new Date().toLocaleString('es-CO')}

    ${dim}┌─────────────────────────────┬─────────────────────────────────────┐${reset}
    ${dim}│${reset}  ${cyan}FRONTEND${reset}                  ${dim}│${reset}  ${green}${process.env.FRONTEND_URL || 'No definido'}${reset}
    ${dim}│${reset}  ${cyan}BACKEND${reset}                   ${dim}│${reset}  ${green}${DB_HOST}:${PORT || 'No definido'} ${reset}
    ${dim}│${reset}  ${cyan}DATABASE${reset}                  ${dim}│${reset}  ${green}${process.env.DB_NAME || 'No definido'}${reset}
    ${dim}└─────────────────────────────┴─────────────────────────────────────┘${reset}
    `);
};

app.listen(PORT, "0.0.0.0", () => {
    showBanner();
});